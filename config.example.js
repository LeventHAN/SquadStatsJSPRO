module.exports = {
	/* The token of your Discord Bot */
	token: "MY-DISCORD-BOT-TOKEN",
	/* For the support server */
	support: {
		id: "810443572150403122", // The ID of the support server
		logs: "827885263438217226", // And the ID of the logs channel of your server (new servers for example)
		debug: true, // Will activate debug mode.
	},
	/* This will be used for map-voting features. Fill in details for your MAIN discord server */
	squadMapVoting: {
		enabled: true, // whether the squad map voting is enabled or nothing
		socketIO: {
			ip: "127.0.0.1", // The IP address where SquadJS is installed.
			port: "7894", // The port for socket.IO
			token: "MySexyPassword666", // Password for socket.IO
		},
		guildID: "676475499538808842", // The bot must be in this guild
		channelID: "838466150249529395", // The channelID where the map voting message will be send
		votingTime: 300, // Time that the voting will last. In seconds. Default is 5 minutes.
		seedThreeshold: 44, // Players amount for seed mode
		keepHistoryOfLayers: 4, // The amount of layers to keep in history so it is not added to voting (RECOMMENDED IS 4)
		layers: {
			// The layers that will be used when players are below the seedThreeshold
			seedLayers: [
				"Yehorivka_Skirmish_v1",
				"Narva_Skirmish_v1",
				"Kamdesh_Skirmish_v1",
				"Yehorivka_Skirmish_v2",
				"Skorpo_Skirmish_v1",
				"FoolsRoad_Skirmish_v2",
				"Kohat_Skirmish_v1",
				"Belaya_Skirmish_v1",
				"LashkarValley_Skirmish_v1",
				"CAF_Manic_Skirmish_v1",
				"Gorodok_Skirmish_v1",
				"Fallujah_Skirmish_v2",
			],
			// The layers that will be used when players are higher than the seedThreeshold
			normalLayers: [
				"CAF_GooseBay_AAS_v1",
				"Gorodok_RAAS_v1",
				"Chora_Invasion_v1",
				"Narva_RAAS_v1",
				"Tallil_AAS_v1",
				"Sumari_TC_v1",
				"Mutaha_AAS_v1",
				"Kokan_RAAS_v1",
				"Yehorivka_Invasion_v2",
				"Gorodok_AAS_v2",
				"Kohat_AAS_v1",
				"Gorodok_Destruction_v1",
				"Narva_AAS_v3",
				"Fallujah_RAAS_v2",
				"Chora_AAS_v1",
				"CAF_Yehorivka_RAAS_v1",
				"Mutaha_RAAS_v1",
				"Narva_AAS_v2",
				"Skorpo_AAS_v1",
				"Yehorivka_AAS_v2",
				"FoolsRoad_AAS_v2",
				"Gorodok_Invasion_v1",
				"Chora_RAAS_v2",
				"Mestia_RAAS_v1",
				"Fallujah_RAAS_v1",
				"Narva_Destruction_v1",
				"Skorpo_RAAS_v1",
				"Tallil_RAAS_v4",
				"Yehorivka_RAAS_v3",
				"Albasrah_AAS_v1",
				"Chora_RAAS_v1",
				"Kokan_RAAS_v2",
				"Belaya_Invasion_v2",
				"Gorodok_RAAS_v5",
				"CAF_AlBasrah_Invasion_v2",
				"Fallujah_AAS_v2",
				"Yehorivka_AAS_v1",
				"Narva_Invasion_v1",
				"CAF_Gorodok_AAS_v1",
				"Kohat_RAAS_v4",
				"Albasrah_RAAS_v1",
				"CAF_Mestia_RAAS_v1",
				"Narva_Invasion_v2",
				"Mutaha_Invasion_v1",
				"Yehorivka_RAAS_v1",
				"Kamdesh_RAAS_v2",
				"Kohat_AAS_v2",
				"Yehorivka_RAAS_v5",
				"LashkarValley_AAS_v2",
				"Narva_AAS_v1",
				"Tallil_Invasion_v1",
				"Gorodok_RAAS_v2",
				"FoolsRoad_Invasion_1",
				"Belaya_RAAS_v1",
				"Yehorivka_RAAS_v2",
				"Kamdesh_RAAS_v1",
				"Belaya_AAS_v2",
				"CAF_Lashkar_Valley_RAAS_v1",
				"Fallujah_Invasion_v1",
				"Kohat_RAAS_v1",
				"CAF_Manic_AAS_v1Mutaha_RAAS_v1",
				"FoolsRoad_AAS_v1",
				"Sumari_Invasion_v1",
				"CAF_Manic_RAAS_v1",
				"LashkarValley_AAS_v1",
				"Logar_TC_v1",
				"CAF_Manic_RAAS_v3",
				"Albasrah_invasion_v1",
			]
		},
		messages: {
			firstTimeOut: 50, // Will wait exactly X seconds before sending ANY broadcast message...
			secondTimeOut: 40, // Will wait exactly X seconds before sending the second broadcast message.
			thirdTimeOut: 10 // Will wait exactly X seconds before counting current active players and sending the VOTING STARTED message.
		}
	},
	/* Dashboard configuration */
	dashboard: {
		enabled: true, // whether the dashboard is enabled or not
		secret: "MY-DISCORD-BOT-SECRET", // Your discord client secret
		baseURL: "http://MY-IP-OR-DOMAIN", // The base URl of the dashboard
		logs: "827885263438217226", // The channel ID of logs
		port: 80, // Dashboard port
		expressSessionPassword: "3D02fDf51e!@!#$L!@L#$", // Express session password (it can be what you want)
		failureURL: "http://MY-IP-OR-DOMAIN", // url on which users will be redirected if they click the cancel button (discord authentication)
	},
	mongoDB: "mongodb://localhost:27017/SquadStatJSv3", // The URl of the mongodb database
	prefix: "sq!", // The default prefix for the bot
	/* For the embeds (embeded messages) */
	embed: {
		color: "#0091fc", // The default color for the embeds
		footer: "LeventHAN | l-event.studio", // And the default footer for the embeds
	},
	/* Bot's owner informations */
	owner: {
		id: "152644814146371584", // The ID of the bot's owner
		name: "LeventHAN#0001", // And the name of the bot's owner
	},
	/* The API keys that are required for certain commands */
	apiKeys: {},
	/* The others utils links */
	others: {
		github: "https://github.com/11TStudio", // Founder's github account
		donate: "https://l-event.studio", // Donate link
	},
	/* The Bot status */
	status: [
		{
			name: "SquadStatJSv3 servs on {serversCount} servers",
			type: "LISTENING",
		},
		{
			name: "WebSite: l-event.studio",
			type: "PLAYING",
		},
	],
};
