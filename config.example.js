module.exports = {
	/* The token of your Discord Bot */
	token: "Discord_Bot_Token",
	/* The main Discord server ID */
	serverID: "Discord_Server_ID",
	/* The Battle Metrics Server ID of your squad server */
	squadBattleMetricsID: "BattleMetrics_ServerID",
	/* For the support server */
	support: {
		logs: "827885263438217226", // And the ID of the logs channel of your server (new servers for example)
		debug: false, // Will activate debug mode.
	},
	/* SocketIO details */
	socketIO: {
		enabled: true, // whether the squad map voting is enabled or nothing
		ip: "194.26.183.182", // The IP address where SquadJS is installed.
		port: "7777", // The port for socket.IO
		token: "MyPasswordForSocketIOFromSquadJS", // Password for socket.IO
	},
	/* Dashboard/Website configuration */
	dashboard: {
		enabled: true, // whether the dashboard is enabled or not
		secret: "MyDiscordBotSecret", // Your discord client secret
		/* don't forget to add "<baseURL>/api/callback" at the discord bot whitelisted url's/OAuth2 */
		baseURL: "http://my-domain.com", // The base URl of the dashboard without "/" at the end
		port: 80, // Dashboard port
		expressSessionPassword: "UcPT5Enzmhk_ARFVrGyDZ3WjJvSe!9", // Change this to something else!!! (Use: https://passwordsgenerator.net/plus/ to generate a new one)
		failureURL: "http://my-domain.com", // url on which users will be redirected if they click the cancel button (discord authentication) or logout
	},
	/* The URl of the mongodb database (SECURE YOUR CONNECTION IF YOU WILL USE IT REMOTELY) */
	/* 	More info on:	https://docs.mongodb.com/manual/reference/connection-string/ */
	mongoDB: "mongodb://localhost:27017/V3", // if remote hosted: "mongodb://username:password@host:port/database"
	/* The default prefix for using the bot, you can also change this from dashboard or discord command (setprefix) */
	prefix: "v3!",
	/* For the embeds (embeded messages) */
	embed: {
		color: "#0091fc", // The default color for the embeds
		footer: "LeventHAN | l-event.studio", // And the default footer for the embeds
	},
	/* Bot's owner informations */
	/* Change this to your own ID (and name?), as this will be used to give you permission at the dashboard when configuring it! */
	owner: {
		id: "152644814146371584", // The ID of the bot's owner (for the dashboard to give access to configurations)
		name: "LeventHAN#0001", // And the name of the bot's owner (just for statistics)
	},
	/* The API keys that are required for certain commands */
	apiKeys: {
		steam: "MySteamKeyToken", // Will be used for logging (Obtain by filling your domain or IP here: https://steamcommunity.com/dev/apikey)
		battleMetrics: "MyBattleMetricsToken", // Will be used to sync with your Battle Metrics server (Obtain from: https://www.battlemetrics.com/developers)
	},
	/* The others utils links */
	others: {
		github: "https://github.com/11TStudio", // Founder's github account
		donate: "https://github.com/sponsors/11TStudio", // Sponsor Link (donate if you liked this project <3)
	},
	/* The Bot status */
	status: [
		{
			name: "👀 looking for your stats",
			type: "LISTENING",
		},
		{
			name: "SquadStatsJS PRO™",
			type: "PLAYING",
		},
	],
};
