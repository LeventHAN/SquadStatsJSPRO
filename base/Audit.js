const mongoose = require("mongoose");

module.exports = mongoose.model(
	"Audit",
	new mongoose.Schema({
		action: { type: String, default: "unknown" },
		date: { type: Number, default: Date.now() },
		author: {
			type: Object,
			default: {
				discord: null,
				steam: null,
			},
		},
		ip: { type: String, default: "0.0.0.0" },
		details: {
			type: Object,
			default: {
				details: null,
			},
		},
	})
);
