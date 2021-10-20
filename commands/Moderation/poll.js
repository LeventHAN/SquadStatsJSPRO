const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

class Poll extends Command {
	constructor(client) {
		super(client, {
			name: "poll",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [],
			memberPermissions: ["MENTION_EVERYONE"],
			botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			nsfw: false,
			ownerOnly: false,
			cooldown: 3000,
		});
	}

	async run(message, args, data) {
		const question = args.join(" ");
		if (!question) {
			return message.error("moderation/poll:MISSING_QUESTION");
		}

		message.delete().catch(() => {});

	

		const success = this.client.customEmojis.success.split(":")[1];
		const error = this.client.customEmojis.error.split(":")[1];

		const emojis = [
			this.client.emojis.cache.find((e) => e.name === success),
			this.client.emojis.cache.find((e) => e.name === error),
		];

		const embed = new Discord.MessageEmbed()
			.setAuthor(message.translate("moderation/poll:TITLE"))
			.setColor(data.config.embed.color)
			.addField(
				question,
				message.translate("moderation/poll:REACT", {
					success: emojis[0].toString(),
					error: emojis[1].toString(),
				})
			);

		message.channel
			.send({
				embeds: [embed],
			})
			.then(async (m) => {
				await m.react(emojis[0]);
				await m.react(emojis[1]);
			});
	}
}

module.exports = Poll;
