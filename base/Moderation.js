const mongoose = require("mongoose");

const moderationSchema = new mongoose.Schema({
	/* the players steamid */
	steamID: {
		type: String,
		default: "12345678911234567",
	},
	/* admin steamID */
	moderatorSteamID: {
		type: String,
		default: "steamID",
	},
	/* admin discordID */
	moderatorName: {
		type: String,
		default: "discordName",
	},
	/* admin discordID */
	moderator: {
		type: String,
		default: "discordID",
	},
	/* type for the moderation */
	typeModeration: {
		type: String,
		default: "ban",
	},
	/* reason for the moderation */
	reason: {
		type: String,
		default: "reason",
	},
	/* date of the action */
	startDate: {
		type: Number,
		default: Date.now(),
	},
	/* end date of the action - null if just kick or warn */
	endDate: {
		type: Number,
		default: null,
	},
});

module.exports = mongoose.model("Moderation", moderationSchema);
