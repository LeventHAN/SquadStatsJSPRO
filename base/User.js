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

const userSchema = new mongoose.Schema({
	/* REQUIRED */
	id: { type: String }, // Discord ID of the user
	name: { type: String, default: null }, // Discord name of the user
	discriminator: { type: String, default: null }, // Discord discriminator of the user
	steam: { type: Object, default: null }, // Steam ID of the user
	battleMetricsID: { type: String, default: null }, // Battlemetrics ID of the user
	bio: { type: String }, // Biography of the user

	/* STATS */
	registeredAt: { type: Number, default: Date.now() }, // Registered date of the user

	/* LAST KNOWN IP ADDRESS */
	lastIp: { type: Array, default: [] }, // Last known IP address of the user

	/* ROLES */
	roles: {
		type: Array,
		default: ["user"],
	},

	whitelist: {
		type: Object,
		default: {
			won: false, // Did the user win the whitelsit?
			byClan: false, // Is the user whitelisted by clan?
			byUser: false, // Is the user whitelisted by user?
			user: "", // User who whitelisted the user
			clan: "", // Clan who whitelisted the user
			reason: "", // Reason for the whitelist
			expires: 0, // When does the whitelist expire? (EPOCH)
		},
	}, // Is the user white listed?

	/* COOLDOWN */
	cooldowns: {
		type: Object,
		default: {
			rep: 0,
		},
	},

	/* Squad Stats */
	squad: {
		type: Object,
		default: {
			// Plugins data
			/* SQUAD DATABASE SETTINGS */
			kd: null, // K/D of the user
			Kills_ALL: null, // Kills of the user
			woundsVEH: null, // Kills of the user for VEHICLES
			woundsINF: null, // Kills of the user for INFANTRY
			deaths: null, // Deaths of the user
			revives: null, // Revives of the user
			tk: null, // TeamKills of the user
			mk_role: null, // Role that has most kills recorded with of the User
			mk_gun: null, // Gun that has most kills recorded with of the User
			tracking: null,
			trackDate: null,
		},
	},

	banned: { type: Boolean, default: false }, // Is the user banned?
	afk: { type: String, default: null }, // Whether the member is disabling his account
	isOnline: { type: Boolean, default: false }, // Whether the user is online at the dashboard
	logged: { type: Boolean, default: false }, // if the user is logged to the dashboard
	apiToken: { type: String, default: genToken() }, // the api token of the user
});

userSchema.method("genApiToken", async function () {
	this.apiToken = genToken();
	await this.save();
	return this.apiToken;
});

module.exports = mongoose.model("User", userSchema);
