const {
	Client,
	Collection,
	Intents,
} = require("discord.js");

const util = require("util"),
	path = require("path"),
	moment = require("moment"),
	MYSQLPromiseObjectBuilder = require("./MYSQLPromiseObjectBuilder.js"),
	axios = require("axios");

const mysql = require("mysql");

moment.relativeTimeThreshold("s", 60);
moment.relativeTimeThreshold("ss", 5);
moment.relativeTimeThreshold("m", 60);
moment.relativeTimeThreshold("h", 60);
moment.relativeTimeThreshold("d", 24);
moment.relativeTimeThreshold("M", 12);

// Creates SquadStatsJSv3 class
class SquadStatsJSv3 extends Client {
	constructor() {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
				Intents.FLAGS.GUILD_VOICE_STATES,
				Intents.FLAGS.DIRECT_MESSAGES,
			],
			allowedMentions: {
				parse: ["users"],
			},
		});
		this.config = require("../config"); // Load the config file
		this.customEmojis = require("../emojis.json"); // load the bot's emojis
		this.languages = require("../languages/language-meta.json"); // Load the bot's languages
		this.commands = new Collection(); // Creates new commands collection
		this.aliases = new Collection(); // Creates new command aliases collection
		this.logger = require("../helpers/logger"); // Load the logger file
		this.wait = util.promisify(setTimeout); // client.wait(1000) - Wait 1 second
		this.functions = require("../helpers/functions"); // Load the functions file
		this.guildsData = require("./Guild"); // Guild mongoose model
		this.usersData = require("./User"); // User mongoose model
		this.membersData = require("./Member"); // Member mongoose model
		this.logs = require("./Log"); // Log mongoose model
		this.audit = require("./Audit"); // Audit mongoose model
		this.permissions = require("./Permissions"); // Audit mongoose model
		this.whitelists = require("./Whitelist"); // Audit mongoose model
		this.dashboard = require("../dashboard/app"); // Dashboard app
		this.queues = new Collection(); // This collection will be used for the music
		this.states = {}; // Used for the dashboard
		this.knownGuilds = [];
		this.pool = null;

		this.databaseCache = {};
		this.databaseCache.users = new Collection();
		this.databaseCache.guilds = new Collection();
		this.databaseCache.members = new Collection();

		// For the website
		this.databaseCache.audit = new Collection();
		this.databaseCache.permissions = new Collection();
		this.databaseCache.whitelists = new Collection();

		this.databaseCache.usersReminds = new Collection(); // members with active reminds
		this.databaseCache.mutedUsers = new Collection(); // members who are currently muted

		if (this.config.socketIO.enabled) {
			const io = require("socket.io-client"); // Load the socket.io client
			// make socketIO connection to an IP address
			this.socket = io.connect(
				"ws://" + this.config.socketIO.ip + ":" + this.config.socketIO.port,
				{
					auth: {
						token: this.config.socketIO.token,
					},
					serverAuth: {
						token: this.config.socketIO.serverSecret,
					}
				}
			);
		}
	}

	get defaultLanguage() {
		return this.languages.find((language) => language.default).name;
	}

	translate(key, args, locale) {
		if (!locale) locale = this.defaultLanguage;
		const language = this.translations.get(locale);
		if (!language) throw "Invalid language set in data.";
		return language(key, args);
	}

	printDate(date, format, locale) {
		if (!locale) locale = this.defaultLanguage;
		const languageData = this.languages.find(
			(language) =>
				language.name === locale || language.aliases.includes(locale)
		);
		if (!format) format = languageData.defaultMomentFormat;
		return moment(new Date(date)).locale(languageData.moment).format(format);
	}

	convertTime(time, type, noPrefix, locale) {
		if (!type) time = "to";
		if (!locale) locale = this.defaultLanguage;
		const languageData = this.languages.find(
			(language) =>
				language.name === locale || language.aliases.includes(locale)
		);
		const m = moment(time).locale(languageData.moment);
		return type === "to" ? m.toNow(noPrefix) : m.fromNow(noPrefix);
	}

	// This function is used to load a command and add it to the collection
	loadCommand(commandPath, commandName) {
		try {
			const props = new (require(`.${commandPath}${path.sep}${commandName}`))(
				this
			);
			this.logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
			props.conf.location = commandPath;
			if (props.init) {
				props.init(this);
			}
			this.commands.set(props.help.name, props);
			props.help.aliases.forEach((alias) => {
				this.aliases.set(alias, props.help.name);
			});
			return false;
		} catch (e) {
			return `Unable to load command ${commandName}: ${e}`;
		}
	}

	// This function is used to unload a command (you need to load them again)
	async unloadCommand(commandPath, commandName) {
		let command;
		if (this.commands.has(commandName)) {
			command = this.commands.get(commandName);
		} else if (this.aliases.has(commandName)) {
			command = this.commands.get(this.aliases.get(commandName));
		}
		if (!command) {
			return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;
		}
		if (command.shutdown) {
			await command.shutdown(this);
		}
		delete require.cache[
			require.resolve(`.${commandPath}${path.sep}${commandName}.js`)
		];
		return false;
	}

	// This function is used to find a user data or create it
	async findOrCreateUser({ id: userID }, isLean) {
		if (this.databaseCache.users.get(userID)) {
			return isLean
				? this.databaseCache.users.get(userID).toJSON()
				: this.databaseCache.users.get(userID);
		} else {
			let userData = isLean
				? await this.usersData.findOne({ id: userID }).lean()
				: await this.usersData.findOne({ id: userID });
			if (userData) {
				if (!isLean) this.databaseCache.users.set(userID, userData);
				return userData;
			} else {
				userData = new this.usersData({ id: userID });
				await userData.save();
				this.databaseCache.users.set(userID, userData);
				return isLean ? userData.toJSON() : userData;
			}
		}
	}

	// Will get the user data via userID and will put the given steam object in it and save it.
	async linkSteamAccount(userID, steamObj) {
		// In case something goes wrong, we want to make sure we don't have a steam account linked to this user
		if (steamObj.id) {
			const userData = await this.usersData.findOne({ id: userID });
			if(!userData) return;
			// check if userData has a steam account
			if (!userData?.steam) {	
				userData.steam = steamObj._json;
				await userData.save();
			}
			return;
		}
	}

	
	// Will check if the user has a steam account linked to them and send back the steam data if so
	async linkedSteamAccount(userID) {
		const userData = await this.usersData.findOne({ id: userID });
		if(!userData) return false;
		return userData.steam;
	}

	// Will remove the steam field from the user data and save it
	async unlinkSteamAccount(steamID) {
		const user = await this.usersData.findOne({ "steam.steamid": steamID });
		if(!user) return false;
		// console.log(user?.steam);
		//user.steam = undefined;
		await user.set("steam", undefined, { strict: false });
		await user.markModified("steam");
		await user.save();
		return true;
	}

	// Checks if the user.id is the same as the owners id given in the config file
	async isOwner(id){
		return this.config.owner.id === id;
	}

	// Will return the user that the token belongs to
	async fetchUserByToken(token) {
		const apiUser = await this.usersData.findOne({ apiToken: token });
		if (apiUser) {
			const userData = await this.findOrCreateUser({ id: apiUser.id }, true);
			return userData;
		} else {
			return null;
		}
	}

	// Will save the ip address of the user by its user.id
	async apiSaveIP(userID, ip) {
		const user = await this.usersData.findOne({ id: userID });
		if(!user.lastIp.includes(ip)) {
			// save the ip to the user lastIp array
			user.lastIp.push(ip);
			// save the user
			await user.save();
		}
	}

	// DEPRECIATED USE USER INSTEAD! Member will be removed soon. This function is used to find a member data or create it
	async findOrCreateMember({ id: memberID, guildID }, isLean) {
		if (this.databaseCache.members.get(`${memberID}${guildID}`)) {
			return isLean
				? this.databaseCache.members.get(`${memberID}${guildID}`).toJSON()
				: this.databaseCache.members.get(`${memberID}${guildID}`);
		} else {
			let memberData = isLean
				? await this.membersData.findOne({ guildID, id: memberID }).lean()
				: await this.membersData.findOne({ guildID, id: memberID });
			if (memberData) {
				if (!isLean)
					this.databaseCache.members.set(`${memberID}${guildID}`, memberData);
				return memberData;
			} else {
				memberData = new this.membersData({ id: memberID, guildID: guildID });
				await memberData.save();
				const guild = await this.findOrCreateGuild({ id: guildID });
				if (guild) {
					guild.members.push(memberData._id);
					await guild.save();
				}
				this.databaseCache.members.set(`${memberID}${guildID}`, memberData);
				return isLean ? memberData.toJSON() : memberData;
			}
		}
	}

	// This function is used to find a guild data or create it
	async findOrCreateGuild({ id: guildID }, isLean) {
		if (this.databaseCache.guilds.get(guildID)) {
			return isLean
				? this.databaseCache.guilds.get(guildID).toJSON()
				: this.databaseCache.guilds.get(guildID);
		} else {
			let guildData = isLean
				? await this.guildsData
					.findOne({ id: guildID })
					.populate("members")
					.lean()
				: await this.guildsData.findOne({ id: guildID }).populate("members");
			if (guildData) {
				if (!isLean) this.databaseCache.guilds.set(guildID, guildData);
				return guildData;
			} else {
				guildData = new this.guildsData({ id: guildID });
				await guildData.save();
				this.databaseCache.guilds.set(guildID, guildData);
				return isLean ? guildData.toJSON() : guildData;
			}
		}
	}

	// This function is used to create a log data in the mongodb
	async addLog({
		action: action,
		author: { discord: discordDetails, steam: steamDetails },
		details: { details: moreDetails },
		ip: ip,
	}) {
		const logData = new this.audit({
			action: action,
			author: { discord: discordDetails, steam: steamDetails },
			ip: ip,
			details: { details: moreDetails },
		});
		await logData.save();
		return logData;
	}

	// Will create/init the mock data for permissions
	async createPermissions() {
		const doesExist = await this.permissions.find({}).lean();
		if(doesExist.length !== 0) return this.logger.log("Permissions schema already exist. 👌", "log");
		this.permissions.create({}).catch((err) => { return console.log(err); });
		this.logger.log("Permissions schema is created 👌", "log");
	}

	// Will create/init the mock data for permissions
	async createWhitelist() {
		const doesExist = await this.whitelists.find({}).lean();
		if(doesExist.length !== 0) return;
		this.whitelists.create({}).catch((err) => { return console.log(err); });
		this.logger.log("Whitelists default schema is created 👌", "log");
	}

	// Will replace the Whitelist by the new one given (file)
	async importWhitelist({ roles: roles, whitelisted: whitelisted }) {
		const whitelist = await this.whitelists.findOne({});
		if(!whitelist) return;
		whitelist.roles = roles;
		whitelist.memberData = whitelisted;
		await whitelist.save();
		this.logger.log("Whitelists schema is imported via the dashboard 👌", "log");
	}

	// Returns the whitelist roles only (Groups)
	async getWhitelistRoles() {
		const whitelist = await this.whitelists.findOne({});
		if(!whitelist) return;
		return whitelist.roles;
	}

	// Returns the whitelist users only (Accounts)
	async getWhitelistUsers() {
		const whitelist = await this.whitelists.findOne({});
		if(!whitelist) return;
		return whitelist.memberData;
	}

	// Remove user from whitelist by steamID
	async removeUserWhitelist(steamID){
		const whitelist = await this.whitelists.findOne({});
		if(!whitelist) return;
		delete whitelist.memberData[steamID];
		await whitelist.markModified("memberData");
		await whitelist.save();
	}

	// Add a single role (Groupe) to a permission groupe or if not exist make it.
	async addWhitelistRolePermission(role, permission){
		// Normally there is only one, but might want to change it to .find({}) later
		const whitelists = await this.whitelists.findOne({});
		if(!whitelists) return;
		if(!whitelists.roles[role]) return;
		whitelists.roles[role].permissions.push(permission);
		await whitelists.markModified("roles");
		await whitelists.save(); 
	}

	// Remove a single role 
	async removeWhitelistRolePermission(role, permission){
		const whitelists = await this.whitelists.findOne({});
		if(!whitelists) return;
		if(!whitelists.roles[role]) return;
		whitelists.roles[role].permissions = whitelists.roles[role].permissions.filter(perm => perm !== permission);
		await whitelists.markModified("roles");
		await whitelists.save();
	}

	// Righnot hard coded. Might wanna change this...
	async getAllAvaibleAccesLevels(){
		return [
			{
				level: "changemap",
				description: "Map commands"
			},
			{
				level: "canseeadminchat",
				description: "This group can see the admin chat + teamkills"
			},
			{
				level: "balance",
				description: "This group can switch teams regardless of team sizes"
			},
			{
				level: "pause",
				description: "Match commands"
			},
			{
				level: "cheat",
				description: "Access to some cheat commands"
			},
			{
				level: "private",
				description: "Set server private"
			},
			{
				level: "chat",
				description: "Admin chat"
			},
			{
				level: "kick",
				description: "kick commands"
			},
			{
				level: "ban",
				description: "ban commands"
			},
			{
				level: "config",
				description: "Set server configuration"
			},
			{
				level: "immune",
				description: "Cannot be kicked or banned"
			},
			{
				level: "manageserver",
				description: "Manage server / kill server"
			},
			{
				level: "cameraman",
				description: "Spectate players"
			},
			{
				level: "featuretest",
				description: "Debug commands like Vehicle Spawner"
			},
			{
				level: "forceteamchange",
				description: "Allows forced team changes"
			},
			{
				level: "reserve",
				description: "Reserved slot access"
			},
			{
				level: "demos",
				description: "Record demo's (currently broken)"
			},
			{
				level: "debug",
				description: "Debug commands"
			},
			{
				level: "teamchange",
				description: "Change teams without penalty"
			},
		];

	}


	// Will return the users dashboard roles ("owner", "admin", etc..)
	async getRoles(userID){
		// search the roles for the userID
		const user = await this.usersData.findOne({ id: userID });
		if(!user || !user.roles) return;
		const roleArray = [];
		// loop through the roles
		for (const key in user.roles) {
			if(user.roles[key]) roleArray.push(key);
		}
		return roleArray;
	}

	// Get all role names that can do the "action" (kick, ban, etc..)
	async whoCan(action){
		// get the permissions
		const perms = await this.permissions.findOne({});
		if(!perms) return;
		// check if the action is in the permissions
		if(!perms.whoCan[action]) return;
		// return the permissions
		return perms.whoCan[action];
	}

	// Check if userID can access/see the route/page
	async canAccess(route, userID) {
		const perms = await this.permissions.find().lean();
		const user = await this.findOrCreateUser({ id: userID});
		if(perms.length === 0) return false;

		// Loop trough perms.canSee and search for route in it
		for (const key in perms[0].canSee) {
			if (key === route) {
				// Loop trough the roles in the array
				for (const role of perms[0].canSee[key]) {
					// Loop trough user.roles and check if the keys that have true as value are included in role
					for (const key in user.roles) {
						if (user.roles[key] && role === key) return true;
					}
				}
			}
		}
		return false;
	}

	// Will get the secret key for the whitelist URL (used for the remote whitelist link)
	async getWhitelistToken() {
		// get the token from the whitelists collection
		const whitelist = await this.whitelists.findOne({});
		if(!whitelist) return;
		return whitelist.token;
	}

	// Will generate a random string that is 32 characters long
	async generateToken(){
		let token = "";
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwzy0123456789_";
		for (let i = 0; i < 32; i++) {
			token += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		return token;
	}

	// Will regenerate a random string with 32 characters
	async regenerateToken() {
		// get the token from the whitelists collection
		const whitelist = await this.whitelists.findOne({});
		if(!whitelist) return;
		// generate a new token
		const token = await this.generateToken();
		// update the token in the whitelists collection
		await this.whitelists.updateOne({}, { $set: { token: token } });
		return token;
	}

	// Will init the mysql pool
	async setPool(guild) {
		if(!this.pool){
			this.pool = mysql.createPool({
				connectionLimit: 10, // Call all
				host: guild.plugins.squad.db.host,
				port: guild.plugins.squad.db.port,
				user: guild.plugins.squad.db.user,
				password: guild.plugins.squad.db.password,
				database: guild.plugins.squad.db.database,
			});
		}
	}

	// Will update a users squad stats
	async updateStats(userID) {
		const guildID = this.config.serverID;
		const user = await this.usersData.findOne({ id: userID });
		if(!user) return console.log("No User found.");
		const steamUID = user.steam.steamid;
		// get the guild plugins data from mongoose
		const guild = await this.guildsData.findOne({ id: guildID });
		if(!guild) return console.log("No Guild found.");
		await this.setPool(guild);
		const pool = this.pool;
		const res = new MYSQLPromiseObjectBuilder(pool);
		await res.add(
			"kd",
			`SELECT (COUNT(*)/(SELECT COUNT(*) FROM DBLog_Deaths WHERE victim = "${steamUID}")) AS KD FROM DBLog_Deaths WHERE attacker="${steamUID}"`,
			"0",
			"KD"
		);
		await res.add(
			"Kills_ALL",
			`SELECT COUNT(*) AS Kills_ALL FROM DBLog_Deaths WHERE attacker = "${steamUID}"`,
			"0",
			"Kills_ALL"
		);
		await res.add(
			"deaths",
			`SELECT COUNT(*) AS Deaths FROM DBLog_Deaths WHERE victim = "${steamUID}"`,
			"0",
			"Deaths"
		);
		await res.add(
			"woundsINF",
			`SELECT COUNT(*) AS Wounds_INF FROM DBLog_Wounds WHERE attacker = "${steamUID}" AND weapon NOT REGEXP '(kord|stryker|uh60|projectile|mortar|btr80|btr82|deployable|kornet|s5|s8|tow|crows|50cal|warrior|coax|L30A1|_hesh|_AP|technical|shield|DShK|brdm|2A20|LAV|M1126|T72|bmp2|SPG9|FV4034|Truck|logi|FV432|2A46|Tigr)'`,
			"0",
			"Wounds_INF"
		);
		await res.add(
			"woundsVEH",
			`SELECT COUNT(*) AS Wounds_VEH FROM DBLog_Wounds WHERE attacker = "${steamUID}" AND weapon REGEXP '(kord|stryker|uh60|projectile|mortar|btr80|btr82|deployable|kornet|s5|s8|tow|crows|50cal|warrior|coax|L30A1|_hesh|_AP|technical|shield|DShK|brdm|2A20|LAV|M1126|T72|bmp2|SPG9|FV4034|Truck|logi|FV432|2A46|Tigr)'`,
			"0",
			"Wounds_VEH"
		);
		await res.add(
			"revives",
			`SELECT COUNT(*) AS Revives FROM DBLog_Revives WHERE reviver = "${steamUID}"`,
			"0",
			"Revives"
		);
		await res.add(
			"tk",
			`SELECT COUNT(*) AS TeamKills FROM DBLog_Wounds WHERE attacker = "${steamUID}" AND teamkill=1`,
			"0",
			"TeamKills"
		);
		await res.add(
			"mk_gun",
			`SELECT weapon AS Fav_Gun FROM DBLog_Wounds WHERE attacker = "${steamUID}" GROUP BY weapon ORDER BY COUNT(weapon) DESC LIMIT 1`,
			"0",
			"Fav_Gun"
		);
		await res.add(
			"mk_role",
			`SELECT weapon AS Fav_Role FROM DBLog_Deaths WHERE attacker = "${steamUID}" GROUP BY weapon ORDER BY COUNT(weapon) DESC LIMIT 1`,
			"0",
			"Fav_Role"
		);
		await res.waitForAll(user.squad);
		let dt = new Date();
		dt = dt.setHours(dt.getHours() + 2);
		dt = new Date(dt);
		user.squad.trackDate = dt;
		if (!user.squad.tracking) {
			user.squad.tracking = true;
		}
		await user.markModified("squad");
		await user.save();
	}

	// Get all player squad stats from mongoose
	async getLeaderboard(){
		const users = await this.usersData.find({"squad.kd": {$exists: true}});
		users.map(user => user.squad.kd).sort();
		// return only users squad object and steam.name if it exist
		return users.map(user => {
			if(user.steam?.personaname) return {
				name: user.steam.personaname,
				id: user.steam.steamid,
				avatar: user.steam.avatar,
				squad: user.squad
			};
		});
	}

	// This function is used to resolve a user from a string (his name or id for example when searching it)
	async resolveUser(search) {
		let user = null;
		if (!search || typeof search !== "string") return;
		// Try ID search
		if (search.match(/^<@!?(\d+)>$/)) {
			const id = search.match(/^<@!?(\d+)>$/)[1];
			user = this.users.fetch(id).catch(() => {});
			if (user) return user;
		}
		// Try username search
		if (search.match(/^!?(\w+)#(\d+)$/)) {
			const username = search.match(/^!?(\w+)#(\d+)$/)[0];
			const discriminator = search.match(/^!?(\w+)#(\d+)$/)[1];
			user = this.users.find(
				(u) => u.username === username && u.discriminator === discriminator
			);
			if (user) return user;
		}
		user = await this.users.fetch(search).catch(() => {});
		return user;
	}

	// This function is used to resolve a user from a string (his name or id for example when searching it)
	async resolveMember(search, guild) {
		let member = null;
		if (!search || typeof search !== "string") return;
		// Try ID search
		if (search.match(/^<@!?(\d+)>$/)) {
			const id = search.match(/^<@!?(\d+)>$/)[1];
			member = await guild.members.fetch(id).catch(() => {});
			if (member) return member;
		}
		// Try username search
		if (search.match(/^!?(\w+)#(\d+)$/)) {
			guild = await guild.fetch();
			member = guild.members.cache.find((m) => m.user.tag === search);
			if (member) return member;
		}
		member = await guild.members.fetch(search).catch(() => {});
		return member;
	}

	// This function is used to resolve a role from a string (his name or id for example when searching it)
	async resolveRole(search, guild) {
		let role = null;
		if (!search || typeof search !== "string") return;
		// Try ID search
		if (search.match(/^<@&!?(\d+)>$/)) {
			const id = search.match(/^<@&!?(\d+)>$/)[1];
			role = guild.roles.cache.get(id);
			if (role) return role;
		}
		// Try name search
		role = guild.roles.cache.find((r) => search === r.name);
		if (role) return role;
		role = guild.roles.cache.get(search);
		return role;
	}
}

module.exports = SquadStatsJSv3;
