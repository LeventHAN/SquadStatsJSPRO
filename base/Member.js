const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
	/* REQUIRED */
	id: { type: String }, // Discord ID of the user
	guildID: { type: String }, // ID of the guild to which the member is connected
	/* Player points by play hour */
	exp: { type: Number, default: 0 }, // Exp points of the user

	/* Squad Stats */
	squad: {
		type: Object,
		default: {
			// Plugins data
			/* SQUAD DATABASE SETTINGS */
			steamName: null, // Steam Name of the User
			steam64ID: null, // Steam ID of the User
			kd: null, // K/D of the user
			killsVEH: null, // Kills of the user
			killsINF: null, // Kills of the user
			woundsVEH: null, // Kills of the user for VEHICLES
			woundsINF: null, // Kills of the user for INFANTRY
			deaths: null, // Deaths of the user
			revives: null, // Revives of the user
			tk: null, // TeamKills of the user
			mk_role: null, // Role that has most kills recorded with of the User
			mk_gun: null, // Gun that has most kills recorded with of the User
			tracking: null,
			trackDate: null,
			checkedStats: null,
		},
	},

	/* STATS */
	registeredAt: { type: Number, default: Date.now() }, // Registered date of the member
});

module.exports = mongoose.model("Member", memberSchema);
