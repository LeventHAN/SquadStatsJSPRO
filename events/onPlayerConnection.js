const Discord = require("discord.js");

/**Event on player connection.
 * - Current functions;
 * - - Checks player connected if name is readable, if not kicked and logged to discord.
 *
 * @author LeventHAN
 * @class PlayerConnection
 * @extends Command
 */
module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run(channelID, playerData, nameChecker) {
		const client = this.client;
		if (!playerData.player) return;
		const playerName = playerData.player.name;
		/*
		Example response for nameChecker:
		{
			enabled: true,
			kickMessage: "Your name is not human readable.",
			showWhichLetters: true,
			matchRegex: `[\u0400-\u04FF]|[\u4E00-\u9FA5][^"\n]`,
			blacklist: [
				"admin",
				"hitler",
				"nazi",
				"fuck",
				"pussy"
			]
		}
		*/
		const channel = client.channels.cache.find(
			(channel) => channel.id === channelID
		);

		// TODO check if playerData.player.steamID is admin. if user does have group that includes canseeadminchat than suppose it is admin.

		const regex = new RegExp(nameChecker.matchRegex, "gi");
		if (
			(!!playerName.match(regex) &&
				(playerName.length / 2 <= 1
					? playerName.length
					: Math.ceil(playerName.length / 2)) <=
					playerName.match(regex).toString().length) ||
			nameChecker.blacklist.includes(playerName)
		) {
			client.socket.emit(
				"rcon.execute",
				`AdminKick ${playerData.player.steamID} ${
					nameChecker.kickMessage + " "
				}${
					nameChecker.showWhichLetters
						? nameChecker.blacklist.some((x) => playerName.includes(x))
							? nameChecker.blacklist
								.filter((x) => playerName.includes(x))
								.toString()
							: playerName.match(regex).toString()
						: ""
				}`
			);
			// save kick log to audit schema
			const moreDetails = {
				steamID: playerData.player.steamID,
				name: playerName,
			};
			const log = await client.addLog({
				action: "PLAYER_KICKED",
				author: {
					discord: "NAME_CHECKER_INTERNAL",
					steam: "NAME_CHECKER_INTERNAL",
				},
				ip: "127.0.0.1",
				details: { details: moreDetails },
			});
			await log.save();

			const kickEmbed = new Discord.MessageEmbed()
				.setDescription(
					`${playerName} was kicked because he has not readable name!`
				)
				.addField("Name:", `${playerName}`, true)
				.addField("SteamID:", `${playerData.player.steamID}`, true)
				.addField(
					"Letters/Name that should be changed:",
					`${
						nameChecker.showWhichLetters
							? nameChecker.blacklist.some((x) => playerName.includes(x))
								? nameChecker.blacklist
									.filter((x) => playerName.includes(x))
									.toString()
								: playerName.match(regex).toString()
							: "Not enabled."
					}`,
					true
				)
				.setColor("#fc1d00")
				.setFooter(client.config.owner.name)
				.setTimestamp();
			return channel.send({ embeds: [kickEmbed] });
		}
	}
};
