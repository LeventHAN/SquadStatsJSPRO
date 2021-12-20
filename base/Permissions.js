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
			clans: ["user"],
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
			teamForceChange: ["owner", "superadmin", "admin", "moderator"],
			createClan: ["owner", "superadmin", "clan leader"],
			setWhitelistLimit: ["owner", "superadmin", "clan leader", "clan manager"],
			disbandClan: ["owner", "superadmin", "clan leader"],
			kickFromClan: ["owner", "superadmin", "clan leader", "clan manager"],
			CLgiveWhitelist: ["owner", "superadmin", "clan leader", "clan manager"],
			CLremoveWhitelist: ["owner", "superadmin", "clan leader", "clan manager"],
			manageClanReqruitement: ["owner", "superadmin", "clan leader", "clan manager"],
			clanApplications: ["owner", "superadmin", "clan leader", "clan manager"],
		},
	},
	allRoles: {
		type: Array,
		default: ["owner", "superadmin", "admin", "moderator", "clan leader", "clan manager", "user"],
	},
});

module.exports = mongoose.model("Permissions", permissionsSchema);
