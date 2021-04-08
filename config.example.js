module.exports = {
	/* The token of your Discord Bot */
	token: "XXXXXXXXXXX",
	/* For the support server */
	support: {
		id: "XXXXXXXXXXX", // The ID of the support server
		logs: "XXXXXXXXXXX", // And the ID of the logs channel of your server (new servers for example)
	},
	/* Dashboard configuration */
	dashboard: {
		enabled: false, // whether the dashboard is enabled or not
		secret: "XXXXXXXXXXX", // Your discord client secret
		baseURL: "https://localhost", // The base URl of the dashboard
		logs: "XXXXXXXXXXX", // The channel ID of logs
		port: 8080, // Dashboard port
		expressSessionPassword: "XXXXXXXXXXX", // Express session password (it can be what you want)
		failureURL: "https://l-event.studio" // url on which users will be redirected if they click the cancel button (discord authentication)
	},
	mongoDB: "mongodb://localhost:27017/SquadStatJSv3", // The URl of the mongodb database
	prefix: "!", // The default prefix for the bot
	/* For the embeds (embeded messages) */
	embed: {
		color: "#0091fc", // The default color for the embeds
		footer: "LeventHAN | l-event.studio" // And the default footer for the embeds
	},
	/* Bot's owner informations */
	owner: {
		id: "152644814146371584", // The ID of the bot's owner
		name: "LeventHAN#0001" // And the name of the bot's owner
	},
	/* DBL votes webhook (optional) */
	votes: {
		port: 5000, // The port for the server
		password: "XXXXXXXXXXX", // The webhook auth that you have defined on discordbots.org
		channel: "XXXXXXXXXXX" // The ID of the channel that in you want the votes logs
	},
	/* The API keys that are required for certain commands */
	apiKeys: {
		// DBL: https://discordbots.org/api/docs#mybots
		dbl: "",
		// SENTRY: https://sentry.io (this is not required and not recommended - you can delete the field)
		sentryDSN: ""
	},
	/* The others utils links */
	others: {
		github: "https://github.com/11TStudio", // Founder's github account
		donate: "https://l-event.studio" // Donate link
	},
	/* The Bot status */
	status: [
		{
			name: "SquadStatJSv3 servs on {serversCount} servers",
			type: "LISTENING"
		},
		{
			name: "WebSite: l-event.studio",
			type: "PLAYING"
		}
	]
};
