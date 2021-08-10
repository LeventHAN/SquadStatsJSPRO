const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

class Stats extends Command {
	constructor(client) {
		super(client, {
			name: "credits",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [
				"credits",
				"infobot",
				"botinfos",
				"bot-infos",
				"bot-info",
				"infos-bot",
				"info-bot",
			],
			memberPermissions: [],
			botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			nsfw: false,
			ownerOnly: false,
			cooldown: 3000,
		});
	}

	async run(message, args, data) {
		const statsEmbed = new Discord.MessageEmbed()
			.setColor(data.config.embed.color)
			.setFooter(data.config.embed.footer)
			.setAuthor(message.translate("common:STATS"))
			.setDescription(message.translate("general/stats:MADE"))
			.addField(
				this.client.customEmojis.stats +
					" " +
					message.translate("general/stats:COUNTS_TITLE"),
				message.translate("general/stats:COUNTS_CONTENT", {
					servers: this.client.guilds.cache.size,
					users: this.client.users.cache.size,
				}),
				true
			)
			.addField(
				message.translate("general/stats:CREDITS"),
				message.translate("general/stats:CREDIT", {
					contributors: ["`Bitman#0669`"].join("\n"),
					translators: [
						/* "`Morph#8610` (:flag_de:)", */
						"`Harun | CORONA#6035` (:flag_tr:)",
					].join("\n"),
				})
			)
			.addField(
				"Made using core structure of;",
				"[Atlanta Bot](https://github.com/Androz2091/AtlantaBot/)",
				false
			);

		statsEmbed.addField(
			this.client.customEmojis.link +
				" " +
				message.translate("general/stats:LINKS_TITLE"),
			message.translate("misc:STATS_FOOTER", {
				donateLink: "https://paypal.me/11tstudio?locale.x=en_US",
				dashboardLink: "https://l-event.studio",
				// inviteLink: await this.client.generateInvite({
				// 	permissions: [Discord.Permissions.FLAGS.ADMINISTRATOR]
				// }),
				githubLink: "https://github.com/11TStudio",
				supportLink: "https://discord.gg/eF3nYAjhZ9",
			})
		);
		message.channel.send({ embeds: [statsEmbed] });
	}
}

module.exports = Stats;
