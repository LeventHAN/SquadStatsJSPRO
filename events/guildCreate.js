const Discord = require("discord.js");
const config = require("../config");
const logdna = require("@logdna/logger");
const options = {
	app: "SquadStatJSPRO-" + config.embed.footer,
	level: "info",
};
const logger = logdna.createLogger("2a30af09b6f95d83e47ec94b2ebb1ece", options);


module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run(guild) {
		if (this.client.config.proMode) {
			if (
				(!this.client.config.proUsers.includes(guild.ownerID) ||
					this.guilds.filter((g) => g.ownerID === guild.ownerID) > 1) &&
				guild.ownerID !== this.client.config.owner.id
			) {
				this.client.logger.log(
					guild.ownerID + " tried to invite SquadStatJS v3 on its server."
				);
				return guild.leave();
			}
		}

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

		guild.owner.send(messageOptions).catch(() => {});

		const text =
			"Bot did join to **" +
			guild.name +
			"**, with **" +
			guild.members.cache.filter((m) => !m.user.bot).size +
			"** users (and " +
			guild.members.cache.filter((m) => m.user.bot).size +
			" bots)";

		await logger.log(
			"Guild has been created: " +
					guild.name +
					" with " +
					guild.members.cache.filter((m) => !m.user.bot).size +
					"users (and "+
					guild.members.cache.filter((m) => m.user.bot).size +
					" bots)",
			{
				level: "info",
				indexMeta: true,
				meta: {
					dashboard: config.dashboard.enabled,
					baseURL: config.dashboard.enabled
						? config.dashboard.baseURL + ":" + config.dashboard.port
						: "n/a",
					prefix: config.dashboard.prefix,
					supportServer: config.support.id,
					client: guild,
				},
			}
		);

		// Sends log embed in the logs channel
		const logsEmbed = new Discord.MessageEmbed()
			.setAuthor(guild.name, guild.iconURL())
			.setColor("#32CD32")
			.setDescription(text);
		this.client.channels.cache
			.get(this.client.config.support.logs)
			.send(logsEmbed);
	}
};
