const mongoose = require("mongoose");
//	Canvas = require("canvas"); Not Required

const genToken = () => {
	let token = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwzy0123456789.-_";
	for (let i = 0; i < 32; i++) {
		token += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return token;
};

const userSchema = new mongoose.Schema({
	/* REQUIRED */
	id: { type: String }, // Discord ID of the user
	bio: { type: String }, // Biography of the user

	/* STATS */
	registeredAt: { type: Number, default: Date.now() }, // Registered date of the user

	/* COOLDOWN */
	cooldowns: {
		type: Object,
		default: {
			rep: 0,
		},
	},

	/* OTHER INFORMATIONS */
	afk: { type: String, default: null }, // Whether the member is AFK
	reminds: { type: Array, default: [] }, // the reminds of the user
	logged: { type: Boolean, default: false }, // if the user is logged to the dashboard
	apiToken: { type: String, default: genToken() }, // the api token of the user
});

userSchema.method("genApiToken", async function () {
	this.apiToken = genToken();
	await this.save();
	return this.apiToken;
});

module.exports = mongoose.model("User", userSchema);
