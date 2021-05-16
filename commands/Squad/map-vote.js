const Command = require("../../base/Command.js");

/**Command for map voting.
 * <h2>Usage: </h2>
 * <h3>Write once this to the channel you want the voting embeds to show</h3>
 * <code>{prefix}mapvote</code>
 * <br />
 * <h3>Toggle mapvote</h3>
 * <code>{prefix}mapvote stop/start</code>
 *
 * @author LeventHAN
 * @extends Command
 */

class MapVote extends Command {
	constructor(client) {
		super(client, {
			name: "mapvote",
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

	async run(message, args, /**@type {{}}*/ data) {
		let status;
		switch (args[0]) {
		case "stop":
		case "disable":
			status = false;
			break;
		case "start":
		case "activate":
			status = true;
		}
		if (args[0]) {
			data.guild.plugins.squad.mapVote.enabled = status;
			data.guild.markModified("plugins.squad");
			data.guild.save();
			return message.channel.send(
				message.translate("misc:STATUS_VOTING", {
					status: data.guild.plugins.squad.mapVote.enabled ? "ON 🟢" : "OFF 🔴",
				})
			);
		}

		return message.channel.send(
			message.translate("misc:STATUS_VOTING", {
				status: data.guild.plugins.squad.mapVote.enabled ? "ON 🟢" : "OFF 🔴",
			})
		);
	}
}

module.exports = MapVote;
