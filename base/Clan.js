const mongoose = require("mongoose");

module.exports = mongoose.model(
	"Clan",
	new mongoose.Schema({
		name: {
			type: String,
			default: "undefined",
		},
		logo: {
			type: String,
			default: "undefined",
		},
		banner: {
			type: String,
			default: "undefined",
		},
		size: {
			type: String,
			enum: ["member", "clanMember", "clanLeader", "admin", "owner"],
			default: "member",
		},
		recruitStatus: {
			type: Boolean,
			default: false,
		},
	})
);
