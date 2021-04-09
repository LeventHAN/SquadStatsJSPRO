const Command = require("../../base/Command.js");

class Setbio extends Command {

	constructor (client) {
		super(client, {
			name: "setbio",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [ "bio", "desc" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 15000
		});
	}

	async run (message, args, data) {
		const newBio = args.join(" ");
		if(!newBio){
			return message.error("squad/setbio:MISSING");
		}
		if(newBio.length > 100){
			return message.error("squad/setbio:MAX_CHARACT");
		}
		data.userData.bio = newBio;
		message.success("squad/setbio:SUCCESS");
		await data.userData.save();
	}

}

module.exports = Setbio;