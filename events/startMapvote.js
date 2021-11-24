/** Mapvote event
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

	async run(layers, length, minVoters) {
		const client = this.client;
		const socket = client.socket;
		const voteResults = {
			0: 0,
			1: 0,
			2: 0,
		};
		const votedPlayers = [];
		let voteActive = true;

		// client.emit("PLAYER_VOTED", {
		// 	0: {
		// 		layer: "Belaya_AAS_v1",
		// 		votes: 11,
		// 	},
		// 	1: {
		// 		layer: "CAF_AlBasrah_Invasion_v2",
		// 		votes: 8,
		// 	},
		// 	2: {
		// 		layer: "AlBasrah_TC_v1",
		// 		votes: 13,
		// 	},
		// });
		// return;

		socket.emit(
			"rcon.execute",
			`AdminBroadcast Map vote is starting! You have ${length} minutes to vote. - SquadStatsJSPRO`,
		);
		client.wait(8000).then(() => {
			socket.emit(
				"rcon.execute",
				`AdminBroadcast [1] - ${layers[0]} | [2] - ${layers[1]} | [3] - ${layers[2]}`,
			);
		});

		/**
		 * {
			raw: '[ChatAll] [SteamID:76561198875005827] [501st]Batuhan : !admin rus tarafındaki admininiz afk ',       
			chat: 'ChatAll',
			steamID: '76561198875005827',
			name: '[501st]Batuhan',
			message: '!admin rus tarafındaki admininiz afk ',
			time: '2021-11-24T15:56:44.692Z',
			player: {
				playerID: '86',
				steamID: '76561198875005827',
				name: '[501st]Batuhan',
				teamID: '2',
				squadID: '2',
				squad: {
				squadID: '2',
				squadName: 'TGR RWS',
				size: '2',
				locked: 'True',
				teamID: '2',
				teamName: 'Russian battalion tactical group'
				}
			}
		 * }
		 */
		socket.on("CHAT_MESSAGE", (messageData) => {
			if(!voteActive) return;
			const voteMatch = messageData.message.match(/^([1-3])$/); // the number
			if (voteMatch) {
				if(votedPlayers.includes(messageData.steamID)){
					return socket.emit(
						"rcon.execute",
						`AdminWarn ${messageData.steamID} ${messageData.name} - You can only vote 1 time.`
					);
				}
				votedPlayers.push(messageData.steamID);
				socket.emit(
					"rcon.execute",
					`AdminWarn ${messageData.steamID} - ${messageData.name} you did vote for ${layers[parseInt(voteMatch[1])-1]}.`
				);
				voteResults[(parseInt(voteMatch[1])-1)]++;
				socket.emit("SJSPRO_MAPVOTE_VOTED", messageData, layers[voteMatch], {
					0: {
						layer: layers[0],
						votes: voteResults[0],
					},
					1: {
						layer: layers[1],
						votes: voteResults[1],
					},
					2: {
						layer: layers[2],
						votes: voteResults[2],
					},
				});
			}
		});
		client.wait(parseInt(length) * 1000 * 60).then(() => {
			endMapVote();
		});

		async function getWinner() {
			const voteResultsArray = Object.values(voteResults);
			const maxVote = Math.max(...voteResultsArray); // get the element with the most votes
			if (maxVote < parseInt(minVoters)) {
				return false;
			}
			const maxVoteIndex = voteResultsArray.indexOf(maxVote); // get the index of the element with the most votes

			// the winner;
			return layers[maxVoteIndex]; // get the layer with the most votes
		}

		async function sendBroadcast(winner) {
			console.log(
				`AdminBroadcast The winner for the map vote is: ${winner} - SquadStatsJSPRO`
			);
			socket.emit(
				"rcon.execute",
				`AdminBroadcast The winner for the map vote is: ${winner} - SquadStatsJSPRO`,
			);
		}

		async function sendNoWinner() {
			console.log(
				"AdminBroadcast No winner for the map vote - SquadStatsJSPRO"
			);
			socket.emit(
				"rcon.execute",
				"AdminBroadcast No winner for the map vote - SquadStatsJSPRO",
			);
		}

		async function endMapVote() {
			voteActive = false;
			const winner = await getWinner();
			socket.emit("SJSPRO_MAPVOTE_ENDED", winner);
			if (!winner) return sendNoWinner();
			sendBroadcast(winner);
		}

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
