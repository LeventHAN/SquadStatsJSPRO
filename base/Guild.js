const mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	config = require("../config.js"),
	languages = require("../languages/language-meta.json");

module.exports = mongoose.model(
	"Guild",
	new Schema({
		/* REQUIRED */
		id: { type: String }, // Discord ID of the guild

		/* MEMBERSDATA */
		membersData: { type: Object, default: {} }, // Members data of the guild
		members: [{ type: Schema.Types.ObjectId, ref: "Member" }],

		/* CONFIGURATION */
		language: { type: String, default: languages.find((l) => l.default).name }, // Language of the guild
		prefix: { type: String, default: config.prefix }, // Default or custom prefix of the guild
		dashboard: {
			type: Object, default: {
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
				}
			}
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
								"Default": {
									layers: [],
								},
							}
						},
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
