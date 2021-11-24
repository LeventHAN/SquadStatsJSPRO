const Discord = require("discord.js");

/**Event on player message/chat.
 * - Current functions;
 * - - This event will be runned when message event is fired from SocketIO
 *
 * @author LeventHAN
 * @class ChatMessage
 * @extends Command
 */
module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run(channelID, messageData) {
		const client = this.client;

		console.log(messageData);

		// const channel = client.channels.cache.find(
		// 	(channel) => channel.id === channelID
		// );

		// // TODO check if playerData.player.steamID is admin. if user does have group that includes canseeadminchat than suppose it is admin.

		// const log = await client.addLog({
		// 	action: "PLAYER_KICKED",
		// 	author: {
		// 		discord: "NAME_CHECKER_INTERNAL",
		// 		steam: "NAME_CHECKER_INTERNAL",
		// 	},
		// 	ip: "127.0.0.1",
		// 	details: { details: moreDetails },
		// });
		// await log.save();

		// const kickEmbed = new Discord.MessageEmbed()
		// 	.setAuthor("BAD NAME CHECKER")
		// 	.setDescription(`${playerName} was kicked because he has not readable name!`)
		// 	.addField("Name:", `${playerName}`, true)
		// 	.addField("SteamID:", `${playerData.player.steamID}`, true)
		// 	.addField(
		// 		"Letters/Name that should be changed:",
		// 		`${nameChecker.showWhichLetters ? (nameChecker.blacklist.some((x) => playerName.includes(x)) ? nameChecker.blacklist.filter((x) => playerName.includes(x)).toString() : playerName.match(regex).toString()) : "Not enabled."}`,
		// 		true
		// 	)
		// 	.setColor("#fc1d00")
		// 	.setFooter(client.config.owner.name)
		// 	.setTimestamp();
		// return channel.send({ embeds: [kickEmbed] });
	}
};
