const Discord = require("discord.js");
const axios = require("axios");
/**
 * Fetch guild informations
 * @param {string} guildID The ID of the guild to fetch
 * @param {object} client The discord client instance
 * @param {array} guilds The user guilds
 */
async function fetchGuild(guildID, client, guilds) {
	const guild = client.guilds.cache.get(guildID);
	const conf = await client.findOrCreateGuild({ id: guild.id });
	return {
		...guild,
		...conf.toJSON(),
		...guilds.find((g) => g.id === guild.id),
	};
}

/**
 * Fetch user informations (stats, guilds, etc...)
 * @param {object} userData The oauth2 user informations
 * @param {object} client The discord client instance
 * @param {string} query The optional query for guilds
 * @returns {object} The user informations
 */
async function fetchUser(userData, client, query) {
	if (userData.guilds) {
		userData.guilds.forEach((guild) => {
			const perms = new Discord.Permissions(BigInt(guild.permissions));
			if (perms.has("MANAGE_GUILD")) {
				guild.admin = true;
			}
			guild.settingsUrl = client.guilds.cache.get(guild.id)
				? `/manage/${guild.id}/`
				: `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2146958847&guild_id=${guild.id}`;
			guild.statsUrl = client.guilds.cache.get(guild.id)
				? `/stats/${guild.id}/`
				: `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2146958847&guild_id=${guild.id}`;
			guild.iconURL = guild.icon
				? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`
				: "https://discordemoji.com/assets/emoji/discordcry.png";
			guild.displayed = query
				? guild.name.toLowerCase().includes(query.toLowerCase())
				: true;
		});
		userData.displayedGuilds = userData.guilds.filter(
			(g) => g.displayed && g.admin
		);
		if (userData.displayedGuilds.length < 1) {
			delete userData.displayedGuilds;
		}
	}
	const user = await client.users.fetch(userData.id);
	const userDb = await client.findOrCreateUser({ id: user.id }, true);
	// Fix for no banner issue.
	if (!user.banner) user.banner = null;
	const userInfos = {
		apiToken: userDb.apiToken,
		...user.toJSON(),
		...userDb,
		...userData,
		...user.presence,
	};
	return userInfos;
}

async function getBMStats(bmServer) {
	const res = await axios.get(
		`https://api.battlemetrics.com/servers/${bmServer}`
	);
	return res.data;
}

async function getTPS(client) {
	let latestTPS = "";
	await client.getLatestTPS((res) => {
		latestTPS = res;
	});
	return latestTPS;
}

async function getPreviusMap(client) {
	let previusMap = "";
	await client.getPreviusMap((res) => {
		previusMap = res;
	});
	if (previusMap == "") return previusMap == "Not Found.";
	return previusMap;
}

module.exports = { fetchUser, fetchGuild, getBMStats, getTPS, getPreviusMap };
