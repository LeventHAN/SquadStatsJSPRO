const mongoose = require("mongoose");

const permissionsSchema = new mongoose.Schema({
	canSee: {
		type: Object,
		default: {
			manage: ["owner"],
			dashboard: ["owner", "superadmin", "admin", "moderator"],
			players: ["owner", "superadmin", "admin", "moderator"], // whoCan will determine the actions here...
			roles: ["owner", "superadmin", "admin"],
			bans: ["owner", "superadmin", "admin"],
			logs: ["owner"],
			profile: ["user"],
			mapVote: ["owner", "superadmin", "admin", "moderator"],
			mapRotation: ["owner", "superadmin", "admin", "moderator"],
		},
	},
	whoCan: {
		type: Object,
		default: {
			kick: ["owner", "superadmin", "admin", "moderator"],
			ban: ["owner", "superadmin", "admin", "moderator"],
			broadcast: ["owner", "superadmin", "admin", "moderator"],
			warn: ["owner", "superadmin", "admin", "moderator"],
			disbandSquad: ["owner", "superadmin", "admin", "moderator"],
			removeFromSquad: ["owner", "superadmin", "admin", "moderator"],
			unlinkSteam: ["owner", "superadmin", "admin", "moderator", "user"],
			setNextMap: ["owner", "superadmin", "admin", "moderator"],
			setCurrentMap: ["owner", "superadmin", "admin", "moderator"],
			mapRotation: ["owner", "superadmin", "admin", "moderator"],
			startMapVote: ["owner", "superadmin", "admin", "moderator"],
			teamForceChange: ["owner", "superadmin", "admin", "moderator"],
		},
	},
	allRoles: {
		type: Array,
		default: ["owner", "superadmin", "admin", "moderator", "user"],
	},
});

module.exports = mongoose.model("Permissions", permissionsSchema);
