const { MessageEmbed } = require("discord.js"),
	SquadCheckers = require("../helpers/squadChecker");

/**Builds an embed message.
 *
 * @param {String} title - The title of the embed message
 * @returns {MessageEmbed} Discord embed message
 */
const embedBuilder = (title) => {
	return new MessageEmbed().setTitle(`${title}`);
};

/**Event for creating squads.
 * <h2>Usage: </h2>
 * <h3>Catches TODO event that has been fired via socket-io-server</h3>
 *
 * @author LeventHAN
 * @class CreateSquad
 * @extends Command
 */
module.exports = class {
	constructor(client) {
		this.client = client;
		this.pool = null;
	}

	async run(guildID, channelID, socket) {
		const client = this.client;
		const channel = client.channels.cache.find(
			(channel) => channel.id === channelID
		);
		let isRookie;

		// const regex = /\d+/gm;
		// const guildData = await this.client.findOrCreateGuild({ id: guildID });

		/**EXAMPLE
		 *
		 * {
			player: {
				playerID: '16',
				steamID: '76561198177277337',
				name: '[Blitz]Generalfeld',
				teamID: '1',
				squadID: '3',
				squad: {
					squadID: '3',
					squadName: 'PUSU',
					size: '3',
					locked: 'False',
					teamID: '1',
					teamName: 'US Brigade Combat Team'
				},
				suffix: 'Generalfeld'
			},
			oldSquadID: null,
			newSquadID: '3'
			}
		*/
		socket.on("PLAYER_SQUAD_CHANGE", async (player) => {
			console.log("===========================================");
			console.log("===========================================");
			console.log("===========================================");
			console.log(player);
			console.log("===========================================");
			console.log("===========================================");
			console.log("===========================================");

			if (!player || !player.player.squad) return;

			if (player.player.squad.size === "1") {
				isRookie = await SquadCheckers.checkSquadRookie({
					steamID: player.player.steamID,
					prefTime: 6000, // minutes
				});
				if (isRookie.private && isRookie.rookie) {
					await socket.emit(
						"rcon.execute",
						`AdminWarn ${player.player.steamID} It seems you have a private profile! Keep in mind that we don't recommend Rookies to lead squads.`,
						(info) => {
							console.log(info);
						}
					);
				}
				if (isRookie.rookie && !isRookie.private) {
					await socket.emit(
						"rcon.execute",
						`AdminWarn ${player.player.steamID} It seems you are a Rookie! We don't recommend Rookies to lead Squad/Teams.`,
						(info) => {
							console.log(info);
						}
					);
				}

				const serverInfo = await SquadCheckers.checkCurrentLayer();
				await channel.send(
					embedBuilder(`${player.player.name} has created a new squad!`)
						.setDescription("Yani bir squad olusturuldu!")
						.addField(
							"Olusturan Oyuncu:",
							`\`\`\`-Isim: ${player.player.name}\n-Squad Status: ${
								isRookie.private
									? "Private Account"
									: isRookie.rookie
									? "Rookie"
									: "Not Rookie"
							}\n-Squad Hours: ${Math.round(isRookie.playHours / 60)} \n\`\`\``,
							false
						)
						.addField("Takim Ismi:", player.player.squad.teamName, true)
						.addField(
							"Squad Ismi:",
							`**${player.player.squad.squadName}**`,
							false
						)
						.addField("Harita:", `${serverInfo.details.map}`, true)
						.addField("Game Mod:", `${serverInfo.details.gameMode}`, true)
						.addField("Anlık Oyuncu:", `${serverInfo.players}`, true)
						.setColor(isRookie ? "#fc1d00" : this.client.config.embed.color)
						.setFooter(this.client.config.embed.footer)
						.setTimestamp()
				);
			}
		});
	}
};
