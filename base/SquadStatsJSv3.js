const { Client, Collection, Intents } = require("discord.js");

const util = require("util"),
	path = require("path"),
	fs = require("fs"),
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
		// init axios here
		this.axios = axios;
		this.config = {};
		this.customEmojis = require("../emojis.json"); // load the bot's emojis
		this.languages = require("../languages/language-meta.json"); // Load the bot's languages
		this.commands = new Collection(); // Creates new commands collection
		this.aliases = new Collection(); // Creates new command aliases collection
		this.logger = require("../helpers/logger"); // Load the logger file
		this.wait = util.promisify(setTimeout); // client.wait(1000) - Wait 1 second
		this.functions = require("../helpers/functions"); // Load the functions file
		this.guildsData = require("./Guild"); // Guild mongoose model
		this.usersData = require("./User"); // User mongoose model
		this.logs = require("./Log"); // Log mongoose model
		this.moderation = require("./Moderation"); // Log mongoose model
		this.audit = require("./Audit"); // Audit mongoose model
		this.permission = require("./Permissions"); // Audit mongoose model
		this.whitelists = require("./Whitelist"); // Audit mongoose model
		this.dashboard = require("../dashboard/app"); // Dashboard app
		this.states = {}; // Used for the dashboard
		this.knownGuilds = [];
		this.pool = null;

		this.databaseCache = {};
		this.databaseCache.users = new Collection();
		this.databaseCache.guilds = new Collection();

		// For the website
		this.databaseCache.audit = new Collection();
		this.databaseCache.moderation = new Collection();
		this.databaseCache.permissions = new Collection();
		this.databaseCache.whitelists = new Collection();

		this.databaseCache.usersReminds = new Collection(); // members with active reminds
		this.databaseCache.mutedUsers = new Collection(); // members who are currently muted
		this.socket = null;
	}

	async hookSocketIO(){
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
					},
				}
			);
		}
	}
	async readConfig(configPath = "./config.json") {
		configPath = path.resolve(__dirname, "../", configPath);
		if (!fs.existsSync(configPath))
			throw new Error("Config file does not exist.");
		return fs.readFileSync(configPath, "utf8");
	}

	async parseConfig(configString) {
		try {
			return JSON.parse(configString);
		} catch (err) {
			throw new Error("Unable to parse config file, check the JSON format.");
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
	async findOrCreateUser({ id: userID }, isLean = false) {
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
			const userData = await this.findOrCreateUser({ id: userID });
			if (!userData) return;
			// check if userData has a steam account
			if (!userData.steam) {
				userData.steam = steamObj._json;
				await userData.markModified("steam");
				await userData.save();
			}
		}
		return;
	}

	// Will check if the user has a steam account linked to them and send back the steam data if so
	async linkedSteamAccount(userID) {
		const userData = await this.usersData.findOne({ id: userID });
		if (!userData) return false;
		return userData.steam;
	}

	// Checks if the user.id is the same as the owners id given in the config file
	async isOwner(id) {
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
		if (!user.lastIp.includes(ip)) {
			// save the ip to the user lastIp array
			user.lastIp.push(ip);
			// save the user
			await user.save();
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

	async addModeration({
		steamID: steamID,
		moderatorSteamID: moderatorSteamID,
		moderatorName: moderatorName,
		moderator: moderator,
		typeModeration: typeModeration,
		reason: reason,
		endDate: endDate,
	}) {
		const moderationRow = new this.moderation({
			steamID: steamID,
			moderatorSteamID: moderatorSteamID,
			moderatorName: moderatorName,
			moderator: moderator,
			typeModeration: typeModeration,
			reason: reason,
			endDate: endDate,
		});
		await moderationRow.save();
		return moderationRow;
	}

	// Will create/init the mock data for permissions
	async createPermissions() {
		const doesExist = await this.permission.find({}).lean();
		if (doesExist.length !== 0)
			return this.logger.log("Permissions schema already exist. 👌", "log");
		this.permission.create({}).catch((err) => {
			return console.log(err);
		});
		this.logger.log("Permissions schema is created 👌", "log");
	}

	// Will create/init the mock data for permissions
	async createWhitelist() {
		const doesExist = await this.whitelists.find({}).lean();
		if (doesExist.length !== 0) return;
		this.whitelists.create({}).catch((err) => {
			return console.log(err);
		});
		this.logger.log("Whitelists default schema is created 👌", "log");
	}

	// Will replace the Whitelist by the new one given (file)
	async importWhitelist({ roles: roles, whitelisted: whitelisted }) {
		const whitelist = await this.whitelists.findOne({});
		if (!whitelist) return;
		whitelist.roles = roles;
		whitelist.memberData = whitelisted;
		await whitelist.save();
		this.logger.log(
			"Whitelists schema is imported via the dashboard 👌",
			"log"
		);
	}

	async getBanlist() {
		const bans = await this.moderation.find({});
		const onList = [];
		bans.forEach((element) => {
			if (element.typeModeration == "ban" && element.endDate > Date.now())
				return onList.push(element);
		});
		return onList;
	}

	// Returns the whitelist roles only (Groups)
	async getWhitelistRoles() {
		const whitelist = await this.whitelists.findOne({});
		if (!whitelist) return;
		return whitelist.roles;
	}
	// Returns the whitelist users only (Accounts)
	async getWhitelistUsers() {
		const whitelist = await this.whitelists.findOne({});
		if (!whitelist) return;
		return whitelist.memberData;
	}

	async removeUserBanlist(steamID) {
		await this.moderation.findOneAndUpdate(
			{ steamID: steamID, endDate: { $gt: Date.now() } },
			{ $set: { endDate: Date.now() } }
		);
		return true;
	}

	// Remove user from whitelist by steamID
	async removeUserWhitelist(steamID) {
		const whitelist = await this.whitelists.findOne({});
		if (!whitelist) return;
		delete whitelist.memberData[steamID];
		await whitelist.markModified("memberData");
		await whitelist.save();
	}

	async removeWhitelistRole(role) {
		const whitelist = await this.whitelists.findOne({});
		if (!whitelist) return;
		delete whitelist.roles[role];
		await whitelist.markModified("roles");
		await whitelist.save();
	}

	// Add a single role (Groupe) to a permission groupe or if not exist make it.
	async addWhitelistRolePermission(role, permission) {
		// Normally there is only one, but might want to change it to .find({}) later
		const whitelists = await this.whitelists.findOne({});
		if (!whitelists) return;
		if (!whitelists.roles[role]) return;
		whitelists.roles[role].permissions.push(permission);
		await whitelists.markModified("roles");
		await whitelists.save();
	}

	// Remove a single role
	async removeWhitelistRolePermission(role, permission) {
		const whitelists = await this.whitelists.findOne({});
		if (!whitelists) return;
		if (!whitelists.roles[role]) return;
		whitelists.roles[role].permissions = whitelists.roles[
			role
		].permissions.filter((perm) => perm !== permission);
		await whitelists.markModified("roles");
		await whitelists.save();
	}

	// will add a new group to the whitelist schema
	async addWhitelistGroup(group) {
		const whitelists = await this.whitelists.findOne({});
		if (!whitelists) return;
		whitelists.roles[group] = {
			permissions: [],
			name: group,
		};
		await whitelists.markModified("roles");
		await whitelists.save();
	}

	// will add whitelist to an user
	async addUserWhitelist(steamID, role, description) {
		const whitelists = await this.whitelists.findOne({});
		if (!whitelists) return;
		whitelists.memberData[steamID] = {
			role: role,
			description: description,
		};
		await whitelists.markModified("memberData");
		await whitelists.save();
	}

	// Righnot hard coded. Might wanna change this...
	async getAllAvaibleAccesLevels() {
		return [
			{
				level: "changemap",
				description: "Map commands",
			},
			{
				level: "canseeadminchat",
				description: "This group can see the admin chat + teamkills",
			},
			{
				level: "balance",
				description: "This group can switch teams regardless of team sizes",
			},
			{
				level: "pause",
				description: "Match commands",
			},
			{
				level: "cheat",
				description: "Access to some cheat commands",
			},
			{
				level: "private",
				description: "Set server private",
			},
			{
				level: "chat",
				description: "Admin chat",
			},
			{
				level: "kick",
				description: "kick commands",
			},
			{
				level: "ban",
				description: "ban commands",
			},
			{
				level: "config",
				description: "Set server configuration",
			},
			{
				level: "immune",
				description: "Cannot be kicked or banned",
			},
			{
				level: "manageserver",
				description: "Manage server / kill server",
			},
			{
				level: "cameraman",
				description: "Spectate players",
			},
			{
				level: "featuretest",
				description: "Debug commands like Vehicle Spawner",
			},
			{
				level: "forceteamchange",
				description: "Allows forced team changes",
			},
			{
				level: "reserve",
				description: "Reserved slot access",
			},
			{
				level: "demos",
				description: "Record demo's (currently broken)",
			},
			{
				level: "debug",
				description: "Debug commands",
			},
			{
				level: "teamchange",
				description: "Change teams without penalty",
			},
		];
	}

	async getPlayersLength() {
		if (!this.socket) return "N/A";
		this.players;
		const response = new Promise((res) => {
			this.socket.emit("players", async (data) => {
				res(data);
			});
		});
		this.players = response;
		return await this.players.then((players) => players.length);
	}

	// Will return the users dashboard roles ("owner", "admin", etc..)
	async getRoles(userID) {
		// search the roles for the userID
		const user = await this.usersData.findOne({ id: userID });
		if (!user || !user.roles) return;
		return user.roles;
	}

	// Get all role names that can do the "action" (kick, ban, etc..)
	async whoCan(action) {
		// get the permissions
		const perms = await this.permission.findOne({});
		if (!perms) return;
		// check if the action is in the permissions
		if (!perms.whoCan[action]) return;
		// return the permissions
		return perms.whoCan[action];
	}

	async getAllCanSee() {
		const perms = await this.permission.findOne({});
		if (!perms) return;
		return perms.canSee;
	}

	async getAllDiffrentRoles() {
		const perms = await this.permission.findOne({});
		if (!perms) return;

		const roles = [];
		// loop trough perms.canSee and put all values to roles
		for (const key in perms.canSee) {
			if (perms.canSee[key]) {
				// loop trough the roles
				for (let i = 0; i < perms.canSee[key].length; i++) {
					roles.push(perms.canSee[key][i]);
				}
			}
		}
		// remove duplicates
		return [...new Set(roles)];
	}

	async getAllPagesCanSee() {
		const perms = await this.permission.findOne({});
		if (!perms) return;
		// look inside canSee and whoCan and put all diffrent values in an array
		const pages = [];
		for (const key in perms.canSee) {
			if (perms.canSee[key]) pages.push(key);
		}
		return pages;
	}

	async getAllActionsWhoCan() {
		const perms = await this.permission.findOne({});
		if (!perms) return;
		// look inside canSee and whoCan and put all diffrent values in an array
		const actions = [];
		for (const key in perms.whoCan) {
			if (perms.whoCan[key]) actions.push(key);
		}
		return actions;
	}

	// Check if userID can access/see the route/page
	async canAccess(route, userID) {
		const perms = await this.permission.find().lean();
		const user = await this.findOrCreateUser({ id: userID });
		let response = false;
		if (perms.length === 0) return false;

		// Loop trough perms.canSee and search for route in it
		for (const key in perms[0].canSee) {
			if (key === route) {
				// Loop trough the roles in the array
				for (const role of perms[0].canSee[key]) {
					// Loop trough user.roles and check if the keys that have true as value are included in role now it is an array
					for (const userRole of user.roles) {
						if (userRole === role) response = true;
					}
				}
			}
		}
		return response;
	}

	// Will get the secret key for the whitelist URL (used for the remote whitelist link)
	async getWhitelistToken() {
		// get the token from the whitelists collection
		const whitelist = await this.whitelists.findOne({});
		if (!whitelist) return;
		return whitelist.token;
	}

	// Will generate a random string that is 32 characters long
	async generateToken() {
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
		if (!whitelist) return;
		// generate a new token
		const token = await this.generateToken();
		// update the token in the whitelists collection
		await this.whitelists.updateOne({}, { $set: { token: token } });
		return token;
	}

	// Will init the mysql pool
	async setPool() {
		const guildID = this.config.serverID;
		let guild = await this.guildsData.findOne({ id: guildID });
		if (!guild) {
			guild = new this.guildsData({ id: guildID });
			await guild.save();
			this.databaseCache.guilds.set(guildID, guild);
		}
		const pool = await mysql.createPool({
			connectionLimit: 10, // Call all
			host: guild.plugins.squad.db.host,
			port: guild.plugins.squad.db.port,
			user: guild.plugins.squad.db.user,
			password: guild.plugins.squad.db.password,
			database: guild.plugins.squad.db.database,
		});
		return pool;
	}

	async getPreviusMap(callback) {
		const pool = this.pool;
		const res = new MYSQLPromiseObjectBuilder(pool);
		await res
			.add(
				"PreviusMap", // object key
				"SELECT layerClassName FROM DBLog_Matches ORDER BY startTime DESC LIMIT 1;",
				"0", // default value when null, 0 or nothing
				"layerClassName" // this is the name of the column
			)
			.then((res) => {
				return callback(res);
			});
	}

	async getLatestTPS(callback) {
		const pool = this.pool;
		const res = new MYSQLPromiseObjectBuilder(pool);
		await res
			.add(
				"latestTPS", // object key
				"SELECT tickRate FROM DBLog_TickRates ORDER BY time DESC LIMIT 1;",
				"0", // default value when null, 0 or nothing
				"tickRate" // this is the name of the column
			)
			.then((res) => {
				return callback(res);
			});
	}

	// Will update a users squad stats
	async updateStats(userID) {
		const user = await this.findOrCreateUser({ id: userID });
		if (!user) return console.log("No User found.");
		const steamUID = user.steam.steamid;
		const pool = this.pool;
		const res = new MYSQLPromiseObjectBuilder(pool);
		await res.add(
			"kd", // object key
			`SELECT (COUNT(*)/(SELECT COUNT(*) FROM DBLog_Deaths WHERE victim = "${steamUID}")) AS KD FROM DBLog_Deaths WHERE attacker="${steamUID}"`,
			"0", // default value when null, 0 or nothing
			"KD" // this is the name of the column
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
	async getLeaderboard() {
		const users = await this.usersData.find({ "squad.kd": { $exists: true } });
		users.map((user) => user.squad.kd).sort();
		// return only users squad object and steam.name if it exist
		return users.map((user) => {
			if (user.steam?.personaname)
				return {
					name: user.steam.personaname,
					id: user.steam.steamid,
					avatar: user.steam.avatar,
					squad: user.squad,
				};
		});
	}

	async getAllUsers() {
		const users = await this.usersData.find({});
		return users;
	}

	async toggleUserRole(userID, role) {
		const user = await this.findOrCreateUser({ id: userID });
		if (!user) return false;
		let action = "";
		// check if user has role and remove it
		if (user.roles.includes(role)) {
			user.roles = user.roles.filter((r) => r !== role);
			action = "removed";
		} else {
			user.roles.push(role);
			action = "added";
		}
		await user.save();
		return action;
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

	// Get all data from audit logs form mongoose
	async getAuditLogs() {
		const logs = await this.audit.find({});
		return logs;
	}

	async getShowNotifications() {
		const guild = await this.findOrCreateGuild({ id: this.config.serverID });
		return guild.dashboard.showNotifications;
	}

	async getUpdatePlayersTable() {
		const guild = await this.findOrCreateGuild({ id: this.config.serverID });
		return guild.dashboard.updatePlayersTable;
	}

	async toggleShowNotifications(actionType) {
		const guild = await this.findOrCreateGuild({ id: this.config.serverID });
		if (guild) {
			for (const action in guild.dashboard.showNotifications) {
				if (action === actionType) {
					guild.dashboard.showNotifications[action] =
						!guild.dashboard.showNotifications[action];
				}
			}
		}
		await guild.save();
	}

	async toggleUpdatePlayersTable(actionType) {
		const guild = await this.findOrCreateGuild({ id: this.config.serverID });
		if (guild) {
			for (const action in guild.dashboard.updatePlayersTable) {
				if (action === actionType) {
					guild.dashboard.updatePlayersTable[action] =
						!guild.dashboard.updatePlayersTable[action];
				}
			}
		}
		await guild.save();
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
