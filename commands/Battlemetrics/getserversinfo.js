const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

/** Get servers info from BattleMetrics.
 *
 * @author LeventHAN
 * @extends Command
 */

class GetServerInfo extends Command {
	constructor(client) {
		super(client, {
			name: "getserverinfo",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: ["getSquadServers", "getServers", "sw"],
			memberPermissions: ["KICK_MEMBERS", "BAN_MEMBERS"],
			botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000,
		});
		this.client = client;
	}

	async run(message, args) {
		const client = this.client;
		const BM = client.BattleMetrics;
		let pageSize;
		let country;
		const serverName = args.join(" ");
		let servers;

		// check it is not a bot
		if (message.author.bot) return;

		const collector = new Discord.MessageCollector(
			message.channel,
			(m) => m.author.id === message.author.id,
			{ time: 60000 }
		);
		const embed = new Discord.MessageEmbed()
			.setColor(client.config.color)
			.setAuthor(message.author.tag, message.author.displayAvatarURL())
			.setTitle("BattleMetrics Servers")
			.setDescription(
				"How much results should we return? Maximum 100. Write `cancel` to cancel."
			)
			.setFooter(
				`Requested by ${message.author.tag}`,
				message.author.displayAvatarURL()
			);
		const firstSend = await message.channel.send({ embeds: [embed] });

		collector.on("collect", (m) => {
			// delete embed
			firstSend.delete();
			if (m.content.toLowerCase() === "cancel") {
				collector.stop("cancelled");
				return message.channel.send(`${message.author} cancelled the command.`);
			}
			if (isNaN(m.content))
				return message.channel.send(`${message.author} please write a number.`);
			if (m.content > 100)
				return message.channel.send(
					`${message.author} please write a number less than 100.`
				);
			if (m.content < 1)
				return message.channel.send(
					`${message.author} please write a number greater than 1.`
				);
			pageSize = m.content;
			collector.stop(true);
		});
		collector.on("end", async () => {
			pageSize = pageSize || 10;
			const secondCollector = new Discord.MessageCollector(
				message.channel,
				(m) => m.author.id === message.author.id,
				{ time: 60000 }
			);

			const secondEmbed = new Discord.MessageEmbed()
				.setColor(client.config.color)
				.setAuthor(message.author.tag, message.author.displayAvatarURL())
				.setTitle("BattleMetrics Servers")
				.setDescription(
					"Filter on which country? Write `Skip` to skip or write the country CODE name (ex: DE, TR, US, etc...)"
				)
				.setFooter(
					`Requested by ${message.author.tag}`,
					message.author.displayAvatarURL()
				);
			const secondSend = await message.channel.send({ embeds: [secondEmbed] });
			await secondCollector.on("collect", () => {
				// delete embed
				secondSend.delete();
				secondCollector.stop(true);
			});
			secondCollector.on("end", async (secondCollected, secondReason) => {
				if (secondReason === "time") {
					return message.channel.send(`${message.author} you took too long.`);
				} else {
					country =
						secondCollected.first().content.toUpperCase() === "SKIP"
							? null
							: secondCollected.first().content.toUpperCase();
				}

				if (country) {
					try {
						servers = await BM.getAllServersByServerNameCountryAndGame(
							serverName,
							country,
							BM.game,
							pageSize
						);
					} catch (e) {
						return message.channel.send(`${message.author} an error occured.`);
					}
				} else {
					try {
						servers = await BM.getServerInfoByNameAndGame(
							serverName,
							BM.game,
							pageSize
						);
					} catch (e) {
						return message.channel.send(`${message.author} an error occured.`);
					}
				}

				let serverList = "";
				for (let i = 0; i < servers.length; i++) {
					if(servers[i].status === "dead") continue;
					serverList += `${servers[i].name} - ${servers[i].players} players\n`;
				}
				if (serverList === "") return message.channel.send("No servers found.");

				const embedResult = new Discord.MessageEmbed()
					.setTitle("Found Servers;")
					.setDescription(serverList)
					.setColor(client.config.color)
					.setFooter(
						`Requested by ${message.author.tag}`,
						message.author.displayAvatarURL()
					);
				await message.channel.send({ embeds: [embedResult] });
			});
		});
	}
}

module.exports = GetServerInfo;
