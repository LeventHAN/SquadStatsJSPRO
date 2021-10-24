const mongoose = require("mongoose");

const permissionsSchema =
	new mongoose.Schema({
		canSee: {
			type: Object, default: {
				manage: ["owner"],
				players: ["owner", "admin", "moderator", "user"], // whoCan will determine the actions here...
				dashboard: ["owner", "admin", "moderator", "user"],
				roles: ["owner", "admin"],
				logs: ["owner"],
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