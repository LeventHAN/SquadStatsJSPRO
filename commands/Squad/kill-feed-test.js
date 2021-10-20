const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

/**Checks the servers tickrate.
 * <h2>Usage: </h2>
 * <h3>To check the current tickrate</h3>
 * <code>{prefix}tickrate</code>
 * <br />
 *
 * @author LeventHAN
 * @extends Command
 */

class ServerTickRate extends Command {
	constructor(client) {
		super(client, {
			name: "killfeed-test",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [],
			memberPermissions: ["KICK_MEMBERS", "BAN_MEMBERS"],
			botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			nsfw: false,
			ownerOnly: false,
			cooldown: 1000,
		});
		this.client = client;
		this.pool = null;
	}

	async run(message) {
		const client = this.client;
		client.socket.on("PLAYER_WOUNDED", (feed) => {
			//console.log(feed);
			const killFeedEmbed = new Discord.MessageEmbed()
				.setAuthor("Kill Feed Pane")
				.setDescription("HASSIGOME")
				.addField(
					"Attacker",
					`${feed.attacker?.name} [${feed.attacker?.squad?.teamName}/${feed.attacker?.squad?.squadName}]`,
					true
				)
				.addField(
					"Victim",
					`${feed.victim?.name} [${feed.victim?.squad?.teamName}/${feed.victim?.squad?.squadName}]`,
					true
				)
				.addField("Weapon", feed.weapon, false);

			message.channel.send({ embeds: [killFeedEmbed] }).catch((err) => {
				console.log(err);
				console.log(feed);
			});
		});
	}
}

module.exports = ServerTickRate;
