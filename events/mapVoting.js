const Discord = require("discord.js"),
	{ MessageEmbed } = require("discord.js"),
	axios = require("axios"),
	io = require("socket.io-client"),
	Canvas = require("canvas"),
	{ resolve } = require("path"),
	random = require("random"),
	MYSQLPromiseObjectBuilder = require("../base/MYSQLPromiseObjectBuilder.js");

const wait = require("util").promisify(setTimeout);
const mysql = require("mysql");
// Register assets fonts
Canvas.registerFont(resolve("./assets/fonts/theboldfont.ttf"), {
	family: "Bold",
});
Canvas.registerFont(resolve("./assets/fonts/SketchMatch.ttf"), {
	family: "SketchMatch",
});

const canvasVotes = Canvas.createCanvas(1680, 1080),
	ctx = canvasVotes.getContext("2d");

const canvasLayers = Canvas.createCanvas(1680, 1080),
	ctxLayers = canvasLayers.getContext("2d");

const canvasWinner = Canvas.createCanvas(1680, 1080),
	ctxWinner = canvasWinner.getContext("2d");

const config = require("../config.js"),
	DEBUG = config.support.debug,
	ip = config.squadMapVoting.socketIO.ip,
	port = config.squadMapVoting.socketIO.port,
	token = config.squadMapVoting.socketIO.token,
	seedLayers = config.squadMapVoting.layers.seedLayers,
	rotationLayers = config.squadMapVoting.layers.normalLayers,
	votingTime = config.squadMapVoting.votingTime,
	seedThreeshold = config.squadMapVoting.seedThreeshold,
	msgFirstTime = config.squadMapVoting.messages.firstTimeOut,
	msgSecondTime = config.squadMapVoting.messages.secondTimeOut,
	msgThirdTime =  config.squadMapVoting.messages.thirdTimeOut,
	keepHistoryOfLayers = config.squadMapVoting.keepHistoryOfLayers;

const defEmojiList = [
	"\u0031\u20E3",
	"\u0032\u20E3",
	"\u0033\u20E3",
	"\u0034\u20E3",
	"\u0035\u20E3",
	"\u0036\u20E3",
];
let currentPlayers;
let res;
let testData;
let ignoreMaps = [];
let rotationToUse;
let response;
let text;
let checkEmojis = [];
let winner = "";
let winAmount = 0;
let loopSize;
let emojiInfoLayers = {};
let tempMax;
let gameLayerImg;
let voteForLayer;
let broadcastMessage = "";
let winnerImg;
let maps = [];
let mapsName = [];
let pickedMaps = [];
let pickedMapsName = [];
let layer;
let layers = [];
let width = 0;
let layerName;
let currentLayer;
let index;

/**Builds an embed message.
 *
 * @param {String} title - The title of the embed message
 * @returns {MessageEmbed} Discord embed message
 */
const embedBuilder = (title) => {
	return new MessageEmbed().setTitle(`${title}`);
};

/**Removes the map from the array of maps
 *
 * @param {Array} arr - An array of maps.
 * @param {String} value - A map.
 * @returns {Array} - The filtered array.
 */
function removeMap(arr, value) {
	return arr.filter(function (ele) {
		return ele != value;
	});
}

/** Draws layers and their sequence numbers to canvas.
 *
 * @param {Array} maps - An array of 6 raw names of the random layers.
 * @param {Array} names - An array of 6 human readable layer names.
 * @returns {null} - Logs an error in the console.
 * @author LeventHAN
 */
async function drawMaps(maps, names) {
	/**Centers the text
	 *
	 * @param {String} text - The content to be centered
	 * @returns {Integer} Width/ Y coordinates
     * @author Alverrt
	 */
	const alignText = (text) => {
		const maptxt = ctxLayers.measureText(text);
		return (400 - maptxt.width) / 2;
	};

	if (!names) return console.error("No object.");
	layers = [];
	for (let i = 0; i < maps.length; i++) {
		layer = await Canvas.loadImage(
			`https://raw.githubusercontent.com/Squad-Wiki-Editorial/squad-wiki-pipeline-map-data/master/completed_output/_Current%20Version/images/${maps[i]}.jpg`
		);
		await layers.push(layer);
	}

	// Draw layer's images
	width = 0;
	for (let i = 0; i < names.length; i++) {
		if (i <= 2) {
			await ctxLayers.drawImage(layers[i], 120 + width, 90, 400, 400);
			ctxLayers.font = "42px Bold";
			ctxLayers.fillStyle = "#fcfc03";
			await ctxLayers.fillText(
				names[i],
				120 + width + alignText(names[i]),
				540
			);
			ctxLayers.font = "64px Sans-serif";
			ctxLayers.strokeStyle = "black";
			ctxLayers.lineWidth = 6;
			ctxLayers.fillStyle = "#f56c42";
			ctxLayers.strokeText(i + 1, 460 + width, 460);
			ctxLayers.fillText(i + 1, 460 + width, 460);
			i == 2 ? (width = 0) : (width += 520);
		}
		if (i > 2) {
			await ctxLayers.drawImage(layers[i], 120 + width, 580, 400, 400);
			ctxLayers.font = "42px Bold";
			ctxLayers.fillStyle = "#fcfc03";
			await ctxLayers.fillText(
				names[i],
				120 + width + alignText(names[i]),
				1030
			);
			ctxLayers.font = "64px Sans-serif";
			ctxLayers.strokeStyle = "black";
			ctxLayers.lineWidth = 6;
			ctxLayers.fillStyle = "#f56c42";
			ctxLayers.strokeText(i + 1, 460 + width, 950);
			ctxLayers.fillText(i + 1, 460 + width, 950);
			width += 520;
		}
	}
}

/** Draws the winning layer's image in the canvas.
 *
 * @param {string} winner - The layer that has the most votes.
 * @param {number} winAmount - The amount of votes.
 * @author LeventHAN
 */
async function drawWinner(winner, winAmount) {
	const alignText = (text) => {
		const maptxt = ctxWinner.measureText(text);
		return (400 - maptxt.width) / 2;
	};
	layerName = winner;
	currentLayer = winner.replace(/'/g, "");
	currentLayer = currentLayer.replace(/ /g, "_");
	const imgLayer = await Canvas.loadImage(
		`https://raw.githubusercontent.com/Squad-Wiki-Editorial/squad-wiki-pipeline-map-data/master/completed_output/_Current%20Version/images/${currentLayer}.jpg`
	);

	// draw map images
	ctxWinner.font = "70px Bold";
	ctxWinner.fillStyle = "#fcfc03";

	await ctxWinner.drawImage(imgLayer, 510, 140, 700, 700);

	await ctxWinner.fillText(layerName, 660 + alignText(layerName), 930);

	ctxWinner.font = "60px Bold";
	ctxWinner.fillStyle = "#fa9024";

	await ctxWinner.fillText(
		this.client.translate("misc/WON_WITH_VOTES", {
			winAmount: winAmount
		}),
		660 + alignText(this.client.translate("misc/WON_WITH_VOTES", {
			winAmount: winAmount
		})),
		1000
	);
}



module.exports = class {

	constructor (client) {
		this.client = client;
		this.pool = null;
	}

	async run (guildID, channelID) {

		const client = this.client;
		const channel = client.channels.cache.find(channel => channel.id === channelID)

		const guildData = await this.client.findOrCreateGuild({ id: guildID });

		const socket = io.connect("ws://"+ip+":"+port, {
			auth: {
				token: token,
			},
		});

		socket.on("connect_error", (err) => {
			return client.logger.log(err,"ERROR");
		});

		if (socket) client.logger.log(`Socket.IO is successfully connected with ${ip}:${port}`,"READY");

		//  PLAYER_CONNECTED - NEW_GAME
		socket.on("NEW_GAME", async () => {
			if(!guildData.plugins.squad.mapVote.enabled) return client.logger.log("Map voting is manually disabled.","DEBUG");
			await wait(msgFirstTime * 1000); 
			if (DEBUG) {
				client.logger.log(`After waiting ${msgFirstTime} seconds, the first broadcast message will be send; ${msgFirstContent}`,"DEBUG");
			} else {
				socket.emit(
					"rcon.broadcast",
					this.client.translate("misc/FIRST_BROADCAST", {
						seconds: msgSecondTime,
					}),
					() => {
						console.log("Broadcast message #1 send.");
					}
				);
			}

			await wait(msgSecondTime * 1000);
			if (DEBUG) {
				client.logger.log(`After waiting ${msgThirdTime} seconds, the first broadcast message will be send; ${msgSecondContent}`,"DEBUG");
			} else {
				socket.emit(
					"rcon.broadcast",
					this.client.translate("misc/SECOND_BROADCAST", {
						seconds: msgThirdTime,
					}),
					() => {
						console.log("Broadcast message #2 send.");
					}
				);
			}
			await wait(msgThirdTime * 1000);

			if (DEBUG) {
				await socket.emit("players", (playerList) => {
					currentPlayers = playerList.length;
					client.logger.log(`Current Players after waiting ${msgFirstTime+msgSecondTime+msgThirdTime} seconds is ${currentPlayers}`,"DEBUG");

				});
			} else {
				await socket.emit("players", (playerList) => {
					currentPlayers = playerList.length;
				});
			}

			if (this.pool == null) {
				// Only create one instance
				this.pool = mysql.createPool({
					connectionLimit: 10, // Call all
					host: guildData.plugins.squad.host,
					port: guildData.plugins.squad.port,
					user: guildData.plugins.squad.user,
					password: guildData.plugins.squad.password,
					database: guildData.plugins.squad.database,
				});
			}
			const pool = this.pool;
			res = new MYSQLPromiseObjectBuilder(pool);
			for (let i = 0; i < keepHistoryOfLayers; i++) {
				res.add(
					`ignoreLayer_${i}`,
					`SELECT map AS MAP
				FROM DBLog_Matches
				ORDER BY startTime desc
				LIMIT 1 OFFSET ${i}`,
					"Undefined",
					null
				);
			}
			testData = await res.waitForAll();
			ignoreMaps = [];
			ignoreMaps.push(testData.ignoreLayer_0.MAP);
			ignoreMaps.push(testData.ignoreLayer_1.MAP);
			ignoreMaps.push(testData.ignoreLayer_2.MAP);
			ignoreMaps.push(testData.ignoreLayer_3.MAP);
			// TODO: Toggleable

			// TOOD: event?

			response = await axios.get(
				"https://raw.githubusercontent.com/Squad-Wiki-Editorial/squad-wiki-pipeline-map-data/master/completed_output/_Current%20Version/finished.json"
			);

			// Background language
			const background = await Canvas.loadImage(
				"./assets/img/mapvote_background.jpg"
			);
			// This uses the canvas dimensions to stretch the image onto the entire canvas
			await ctx.drawImage(
				background,
				0,
				0,
				canvasVotes.width,
				canvasVotes.height
			);

			if (DEBUG) {
				client.logger.log(`Voting has been started message has been send.`,"DEBUG");
			} else {
				socket.emit(
					"rcon.broadcast",
					this.client.translate("misc/VOTING_STARTED_BROADCAST"),
					() => {
						console.log("Broadcast message voting started has been send.");
					}
				);
			}

			maps = [];
			mapsName = [];
			pickedMaps = [];
			pickedMapsName = [];
			rotationToUse = currentPlayers > seedThreeshold ? rotationLayers : seedLayers;

			response.data.Maps.forEach((map) => {
				if (
					!ignoreMaps.includes(map.mapName) &&
					rotationToUse.includes(map.rawName)
				) {
					maps.push(map.Name);
					mapsName.push(map.rawName);
					ignoreMaps.push(map.mapName);
				}
			});
			loopSize = maps.length > 6 ? 6 : maps.length;
			for (let i = 0; i < loopSize; i++) {
				index = random.int(0, maps.length - 1);
				if (!maps[index]) continue;
				if (!mapsName[index]) continue;
				pickedMaps.push(mapsName[index]);
				pickedMapsName.push(maps[index]);
				mapsName = removeMap(mapsName, mapsName[index]);
				maps = removeMap(maps, maps[index]);
			}

			text = this.client.translate("misc/EMBED_DESC", {
				seconds: votingTime,
			});

			// This uses the canvas dimensions to stretch the image onto the entire canvas
			await ctxLayers.drawImage(
				background,
				0,
				0,
				canvasLayers.width,
				canvasLayers.height
			);

			await drawMaps(pickedMaps, pickedMapsName);
			const emojiListLayers = defEmojiList.slice();
			emojiInfoLayers = {};
			tempMax = loopSize;
			for (const option of pickedMapsName) {
				if (tempMax <= 0) continue;
				const emoji = emojiListLayers.splice(0, 1);
				emojiInfoLayers[emoji] = { option: option, votes: 0 };
				text += `${emoji} : \`${option}\`\n\n`;
				tempMax--;
			}
			gameLayerImg = await new Discord.MessageAttachment(
				canvasLayers.toBuffer(),
				"mapGameLayerVote.png"
			);

			voteForLayer = await channel.send(
				embedBuilder(client.translate("misc:MAP_VOTE_LAYER_TITLE"))
					.setDescription(text)
					.setColor(config.embed.color)
					.setFooter(config.embed.footer)
					.setTimestamp()
					.attachFiles(gameLayerImg)
					.setImage("attachment://mapGameLayerVote.png")
			);

			tempMax = loopSize;
			for (const emoji of [...defEmojiList]) {
				if (tempMax <= 0) continue;
				await wait(250);
				await voteForLayer.react(emoji);
				tempMax--;
			}

			const usedEmojisLayers = Object.keys(emojiInfoLayers);
			const reactionCollectorLayers = voteForLayer.createReactionCollector(
				(reaction, user) =>
					usedEmojisLayers.includes(reaction.emoji.name) && !user.bot,
				{ time: votingTime * 1000 }
			);
			const voterInfoLayer = new Map();
			reactionCollectorLayers.on("collect", async (reaction, user) => {
				if (usedEmojisLayers.includes(reaction.emoji.name)) {
					if (!voterInfoLayer.has(user.id))
						await voterInfoLayer.set(user.id, { emoji: reaction.emoji.name });
					const votedEmoji = voterInfoLayer.get(user.id).emoji;
					if (votedEmoji !== reaction.emoji.name) {
						const lastVote = await voteForLayer.reactions.cache.get(votedEmoji);
						lastVote.count -= await 1;
						await lastVote.users.remove(user.id);
						emojiInfoLayers[votedEmoji].votes -= await 1;
						await voterInfoLayer.set(user.id, { emoji: reaction.emoji.name });
					}
					emojiInfoLayers[reaction.emoji.name].votes += await 1;
				}
			});
			reactionCollectorLayers.on("dispose", (reaction, user) => {
				if (usedEmojisLayers.includes(reaction.emoji.name)) {
					voterInfoLayer.delete(user.id);
					emojiInfoLayers[reaction.emoji.name].votes -= 1;
				}
			});
			reactionCollectorLayers.on("end", async (s) => {
				checkEmojis = [];
				s.forEach((emoji) => {
					checkEmojis.push({
						emoji: parseInt(emoji._emoji.name.slice(0, 1), 10),
						amount: emoji.count,
					});
				});
				winner = "";
				winAmount = 0;
				checkEmojis.forEach((emoji) => {
					if (winAmount < emoji.amount) {
						winner = emoji.emoji;
						winAmount = emoji.amount;
					}
				});

				await voteForLayer.delete();

				await ctxWinner.drawImage(
					background,
					0,
					0,
					canvasWinner.width,
					canvasWinner.height
				);
				broadcastMessage = "";
				if (winner) {
					broadcastMessage = pickedMaps[winner - 1];
				} else {
					broadcastMessage = pickedMaps[0];
				}
				await drawWinner(broadcastMessage, winAmount);

				if (DEBUG) {
					channel.send(`AdminSetNextLayer ${broadcastMessage}`);
				} else {
					socket.emit(
						"rcon.execute",
						`AdminSetNextLayer ${broadcastMessage}`,
						(s) => {
							console.log(s);
						}
					);
				}

				winnerImg = await new Discord.MessageAttachment(
					canvasWinner.toBuffer(),
					"mapWinner.png"
				);

				if (DEBUG) {
					channel.send(
						`Winning layer is ${broadcastMessage} - with ${winAmount} votes.`
					);
				} else {
					socket.emit(
						"rcon.broadcast",
						this.client.translate("misc/WON_MESSAGE", {
							broadcastMessage: broadcastMessage,
							winAmount: winAmount
						}),
						() => {
							console.log(
								`Winner map has been selected; ${broadcastMessage} | votes; ${winAmount} `
							);
						}
					);
				}

				await channel.send(
					embedBuilder(
						client.translate("misc:WINNER_TITLE", {
							layer: broadcastMessage,
						})
					)
						.setDescription(
							client.translate("misc:WINNER_DESC", {
								layer: broadcastMessage,
								amount: winAmount,
							})
						)
						.setColor(config.embed.color)
						.setFooter(config.embed.footer)
						.setTimestamp()
						.attachFiles(winnerImg)
						.setImage("attachment://mapWinner.png")
				);
			});
		});
	}
};