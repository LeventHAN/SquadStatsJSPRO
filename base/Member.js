const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
	/* REQUIRED */
	id: { type: String }, // Discord ID of the user
	guildID: { type: String }, // ID of the guild to which the member is connected
	/* Player points by play hour */
	exp: { type: Number, default: 0 }, // Exp points of the user
	registeredAt: { type: Number, default: Date.now() }, // Registered date of the member
});

module.exports = mongoose.model("Member", memberSchema);
