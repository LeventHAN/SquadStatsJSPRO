const mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	languages = require("../languages/language-meta.json");

module.exports = mongoose.model(
	"Guild",
	new Schema({
		id: { type: String }, // Discord ID of the guild
		language: { type: String, default: languages.find((l) => l.default).name }, // Language of the guild
		prefix: { type: String, default: "!" },
		dashboard: {
			type: Object,
			default: {
				showNotifications: {
					onConnect: true,
					onDisconnect: true,
					onSquadJoin: true,
					onSquadLeave: true,
					onSquadUpdate: true,
					onAdminRequest: true,
					notifyAboutUpdates: true,
				},
				updatePlayersTable: {
					onConnect: true,
					onDisconnect: true,
					onSquadJoin: true,
					onSquadLeave: true,
					onSquadUpdate: true,
				},
			},
		},
		plugins: {
			type: Object,
			default: {
				// Plugins data
				/* SQUAD DATABASE SETTINGS */
				squad: {
					stats: {
						enabled: false,
						rolesEnabled: false,
						rolesGiven: false,
					},
					db: {
						host: null,
						port: null,
						database: null,
						user: null,
						password: null,
						serverID: null,
					},
					mapVote: {
						enabled: false,
						active: false,
						rotations: {
							type: Object,
							default: {
								Default: {
									layers: [],
								},
							},
						},
					},
					nameChecker: {
						enabled: false,
						kickMessage: "Your name is not human readable.",
						showWhichLetters: true,
						matchRegex: `[\u0400-\u04FF]|[\u4E00-\u9FA5][^"\n]`,
						blacklist: ["admin", "hitler", "nazi", "fuck", "pussy"],
					},
				},
				suggestions: false, // the channel in which the suggestions will be sent
				modlogs: false, // the channel in which the moderation logs (mute, kick, ban, etc...) will be sent
				reports: false, // the channel in which the reports will be sent
				logs: false, // the channel in which the logs (message deleted, etc...) will be sent
			},
		},
		ignoredChannels: { type: Array, default: [] }, // Channels ignored by the bot
		customCommands: { type: Array, default: [] }, // Custom commands of the guild
		commands: { type: Array, default: [] }, // Commands logs
		autoDeleteModCommands: { type: Boolean, default: false }, // Whether to auto delete moderation commands
	})
);
