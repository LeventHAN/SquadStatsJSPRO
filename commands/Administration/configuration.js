const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

class Configuration extends Command {
	constructor(client) {
		super(client, {
			name: "configuration",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: ["conf", "config"],
			memberPermissions: ["MANAGE_GUILD"],
			botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			nsfw: false,
			ownerOnly: false,
			cooldown: 3000,
		});
	}

	async run(message, args, data) {
		const guildData = data.guild;

		const embed = new Discord.MessageEmbed()
			.setAuthor({
				name: message.guild.name, 
				iconURL: message.guild.iconURL()
			})
			.setColor(this.client.config.embed.color)
			.setFooter(this.client.config.embed.footer);

		// Guild prefix
		embed.addField(
			message.translate("administration/configuration:PREFIX_TITLE"),
			guildData.prefix
		);

		// Ignored channels
		embed.addField(
			message.translate("administration/configuration:IGNORED_CHANNELS_TITLE"),
			guildData.ignoredChannels.length > 0
				? guildData.ignoredChannels.map((ch) => `<#${ch}>`).join(", ")
				: message.translate("administration/configuration:NO_IGNORED_CHANNELS")
		);

		// Special channels
		embed.addField(
			message.translate("administration/configuration:SPECIAL_CHANNELS"),
			message.translate("administration/configuration:MODLOGS", {
				channel: guildData.plugins.modlogs
					? `<#${guildData.plugins.modlogs}>`
					: message.translate("common:NOT_DEFINED"),
			}) +
				"\n" +
				message.translate("administration/configuration:SUGGESTIONS", {
					channel: guildData.plugins.suggestions
						? `<#${guildData.plugins.suggestions}>`
						: message.translate("common:NOT_DEFINED"),
				}) +
				"\n" +
				message.translate("administration/configuration:REPORTS", {
					channel: guildData.plugins.reports
						? `<#${guildData.plugins.reports}>`
						: message.translate("common:NOT_DEFINED"),
				})
		);

		// Auto-delete mod commands
		embed.addField(
			message.translate("administration/configuration:AUTODELETEMOD"),
			!message.guild.autoDeleteModCommands
				? message.translate(
					"administration/configuration:AUTODELETEMOD_ENABLED"
				  )
				: message.translate(
					"administration/configuration:AUTODELETEMOD_DISABLED"
				  )
		);

		// Dashboard link
		embed.addField(
			message.translate("administration/configuration:DASHBOARD_TITLE"),
			`[${message.translate(
				"administration/configuration:DASHBOARD_CONTENT"
			)}](${this.client.config.dashboard.baseURL})`
		);

		message.channel.send({ embeds: [embed] });
	}
}

module.exports = Configuration;
