const Discord = require("discord.js");
module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run(guild) {
		const guildOwner = await this.client.users
			.fetch(guild.ownerID)
			.catch(() => {});

		guild = await guild.members.fetch();

		const messageOptions = {};

		//const userData = await this.client.findOrCreateUser({ id: guild.ownerID }); //TODO Impliment?

		const thanksEmbed = new Discord.MessageEmbed()
			.setAuthor("Thank you for adding me to your guild !")
			.setDescription(
				"To configure me, type `" +
					this.client.config.prefix +
					"help` and look at the administration commands!\nTo change the language, type `" +
					this.client.config.prefix +
					"setlang [language]`."
			)
			.setColor(this.client.config.embed.color)
			.setFooter(this.client.config.embed.footer)
			.setTimestamp();
		messageOptions.embed = thanksEmbed;

		guildOwner?.send(messageOptions).catch(() => {});

		const text =
			"Bot did join to **" +
			guild.name +
			"**, with **" +
			guild.members.cache.filter((m) => !m.user.bot).size +
			"** users (and " +
			guild.members.cache.filter((m) => m.user.bot).size +
			" bots)";

		// Sends log embed in the logs channel
		const logsEmbed = new Discord.MessageEmbed()
			.setAuthor(guild.name, guild.iconURL())
			.setColor("#32CD32")
			.setDescription(text);
		this.client.channels.cache
			.get(this.client.config.support.logs)
			.send({ embeds: [logsEmbed] });
	}
};
