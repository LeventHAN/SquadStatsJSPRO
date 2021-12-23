const mongoose = require("mongoose");

const genToken = () => {
	let token = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwzy0123456789.-_";
	for (let i = 0; i < 32; i++) {
		token += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return token;
};

module.exports = mongoose.model(
	"Clan",
	new mongoose.Schema({
		id: {
			type: String,
			default: genToken(),
		},
		name: {
			type: String,
			default: "undefined",
		},
		createdBy: {
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
			type: Number,
			default: 0,
		},
		applications: {
			type: Array,
			default: [],
		},
		recruitStatus: {
			type: Boolean,
			default: false,
		},
		whitelistLimit: {
			type: Number,
			default: 0,
		},
		manualWhitelistedUsers: {
			type: Array,
			default: [ 
				
			],
		}

	})
);
