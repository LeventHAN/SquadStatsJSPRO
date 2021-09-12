const mongoose = require("mongoose");

const permissionsSchema =
	new mongoose.Schema({
		canSee: {type: Object, default: {
			players: ["owner", "admin", "moderator", "users"], // whoCan will determine the actions here...
			dashboard: ["owner", "admin", "moderator", "users"],
			roles: ["owner", "admin"],
		}},
	});



module.exports = mongoose.model("Permissions", permissionsSchema);