const mongoose = require("mongoose");

const genToken = () => {
	let token = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwzy0123456789_";
	for (let i = 0; i < 32; i++) {
		token += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return token;
};

const whitelistSchema =
	new mongoose.Schema({
		token: { type: String, default: genToken() },
		roles: {type: Object, default: {
			Default: {
				permissions: ["changemap","pause","cheat","private","balance","chat","kick","ban","config","cameraman","immunity","manageserver","featuretest","reserve","demos","debug","teamchange","forceteamchange","canseeadminchat","adminteleporttoplayer","AdminSetFogOfWar"]
			},
		}},
		memberData: {type: Object, default: {
			Default: {
				role: null,
				description: null,
			}
		}},
	});



module.exports = mongoose.model("Whitelist", whitelistSchema);