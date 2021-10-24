const mongoose = require("mongoose");

const permissionsSchema =
	new mongoose.Schema({
		canSee: {
			type: Object, default: {
				manage: ["owner"],
				dashboard: ["owner", "admin", "moderator"],
				players: ["owner", "admin", "moderator"], // whoCan will determine the actions here...
				roles: ["owner", "admin"],
				logs: ["owner"],
				profile: ["user"]
			}},
		whoCan: { 
			type: Object, default : {
				kick: [
					"owner",
					"admin",
					"moderator"
				],
				ban: [
					"owner",
					"admin",
				],
				broadcast: [
					"owner",
					"admin",
					"moderator"
				],
				warn: [
					"owner",
					"admin",
					"moderator"
				],
				disbandSquad: [
					"owner",
					"admin",
					"moderator"
				],
				removeFromSquad: [
					"owner",
					"admin",
					"moderator"
				],
				unlinkSteam: [
					"owner",
					"admin",
					"moderator",
					"user"
				],
				setNextMap: [
					"owner",
					"admin",
					"moderator"
				],
				setCurrentMap: [
					"owner",
					"admin",
					"moderator"
				 ]
			}},
	});



module.exports = mongoose.model("Permissions", permissionsSchema);