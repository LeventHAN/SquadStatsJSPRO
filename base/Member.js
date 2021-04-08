const mongoose = require("mongoose");

module.exports = mongoose.model("Member", new mongoose.Schema({

	/* REQUIRED */
	id: { type: String }, // Discord ID of the user
	guildID: { type: String }, // ID of the guild to which the member is connected

	/* Player points by play hour */
	exp: { type: Number, default: 0 }, // Exp points of the user

	/* Squad Stats */
	steamName: { type: String, default: "" }, // Steam Name of the User
	steam64ID: { type: String, default: "" }, // Steam ID of the User
	kd: { type: String, default: "" }, // K/D of the user
	kills: { type: String, default: "" }, // Kills of the user
	wounds: { type: String, default: "" }, // Wounds of the user
	deaths: { type: String, default: "" }, // Deaths of the user
	revives: { type: String, default: "" }, // Revives of the user
	tk: { type: String, default: "" }, // TeamKills of the user
	mk_role: { type: String, default: "" }, // Role that has most kills recorded with of the User
	mk_gun: { type: String, default: "" }, // Gun that has most kills recorded with of the User
	tracking: { type: Number, default: 0 },
	trackDate: { type: Number, default: Date.now() },
	checkedStats: { type: Number, default: 0 },

	/* STATS */
	registeredAt: { type: Number, default: Date.now() }, // Registered date of the member

	/* COOLDOWN */
	cooldowns: { type: Object, default: {
		work: 0,
		rob: 0
	}},

	/* OTHER INFORMATIONS */
	sanctions: { type: Array, default: [] }, // Array of the member sanctions (mute, ban, kick, etc...)
	mute: { type: Object, default: { // The member mute infos
		muted: false,
		case: null,
		endDate: null
	}},
}));