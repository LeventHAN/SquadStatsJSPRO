const Command = require("../../base/Command.js"),
	Discord = require("discord.js");
class Ping extends Command {

	constructor (client) {
		super(client, {
			name: "helpme",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [ "search", "s" ],
			memberPermissions: ["MANAGE_GUILD"],
			botPermissions: [ "SEND_MESSAGES" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 1000
		});
	}

	async run (message) {
		const profileEmbed = new Discord.MessageEmbed()
			.setDescription(
				"Hey! We changed the way you search for your stats."
			)
			.addField(
				"New stat track usage:",
                "New command is: `!profile`",
				false
			)
			.addField(`\u200B`, `\u200B`)
			.addField(
				"What is new?",
                "- Discord roles for your stats \n- Faster response. \n- More coming soon.",
                true
			)
			.addField(
				"What you should know?",
                "Updated every hour once.",
                true
			)
			.setColor("red") // Sets the color of the embed
			.setFooter("GER-SQ Stat Track") // Sets the footer of the embed
			.setTimestamp();
		message.channel.send(profileEmbed);
	}

}

module.exports = Ping;