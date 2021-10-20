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
			type: Number,
			default: 0,
		},
		recruitStatus: {
			type: Boolean,
			default: false,
		},
	})
);
