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
let DEBUG = config.support.debug;
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
let voter = [];
let votedTo = [];
let winner = "";
let winAmount = 0;
let loopSize;
let emojiInfoLayers = {};
let tempMax;
let gameLayerImg;
let voteForLayer;
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
 * @param {Object} client - The current client object.
 * @author LeventHAN
 */
async function drawWinner(winner, winAmount, client) {
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
		client.translate("misc/WON_WITH_VOTES", {
			winAmount: winAmount
		}),
		660 + alignText(client.translate("misc/WON_WITH_VOTES", {
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
		const regex = /\d+/gm;
		const guildData = await this.client.findOrCreateGuild({ id: guildID });
		const socket = io.connect("ws://"+ip+":"+port, {
			auth: {
				token: token,
			},
		});

		socket.on("connect_error", (err) => {
			return client.logger.log(err,"ERROR");
		});

		// DEBUG = true;


		if (socket) client.logger.log(`Socket.IO is successfully connected with ${ip}:${port}`,"READY");

		//  PLAYER_CONNECTED - NEW_GAME
		socket.on("NEW_GAME", async () => {
			await wait(150 * 1000);
			if(!guildData.plugins.squad.mapVote.enabled) return client.logger.log("Map voting is manually disabled.","DEBUG");
			voter = [];
			votedTo = [];
			if (DEBUG) {
				client.logger.log(`Players amount is asked.`,"DEBUG");
			} else {
				await socket.emit("players", (playerList) => {
					currentPlayers = playerList.length;
					client.logger.log(`Current Players after waiting ${msgFirstTime+msgSecondTime+msgThirdTime} seconds is ${currentPlayers}`,"DEBUG");
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
			
			// TODO: make this query dynamic
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

			text = client.translate("misc/EMBED_DESC", {
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
			if(DEBUG){
				console.log(
					"Voting started message has been send."
				);
			} else {
				socket.emit(
					"rcon.broadcast",
					this.client.translate("misc/VOTING_STARTED_BROADCAST"),
					() => {
						console.log(
							"Voting started message has been send."
						);
					}
				);
			}

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

			guildData.plugins.squad.mapVote.active = true;
			guildData.markModified("plugins.squad");
			await guildData.save();
			let Layer = {
				"1": [],
				"2": [],
				"3": [],
				"4": [],
				"5": [],
				"6": [],
			};
			let string = "";
			for(let i=1; i<=pickedMapsName.length;i++){
				string += `| [${i}] ${pickedMapsName[i-1]} |`;
			}

			await socket.emit(
				"rcon.broadcast",
				"Voting is starting. Vote by writing ONLY the number of the layer you want to be played next!",
				() => {
					console.log(
						`Voting is starting. Vote by writing ONLY the number of the layer you want to be played next!`
					);
				}
			);
			await wait(10 * 1000);
			await socket.emit(
				"rcon.broadcast",
				string,
				() => {
					console.log(
						string
					);
				} 
			);
			socket.on("CHAT_MESSAGE", async (message) => {
				if(!guildData.plugins.squad.mapVote.active) return;
				let found = message.message.match(regex);
				if(DEBUG) client.logger.log(`[${message.name}] - ${message.message}`,"DEBUG");
				if(!found) return;
				switch(found[0]){
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
					if(voter.includes(message.name)) return;
					await voter.push(message.name);
					await votedTo.push(found);
					Layer[found].push(message.name || message.steamID)
					if(DEBUG) client.logger.log(`${message.name} did vote for ${found}`,"DEBUG");
					await socket.emit(
						"rcon.execute",
						`AdminWarn ${message.steamID} Voting has been saved. You voted for; ${pickedMapsName[found-1]}. SquadStatsJSPRO™`,
						(s) => {
							console.log(s);
						}
					);
					break;
				default:
					if(DEBUG) client.logger.log(`Player did write another digit; ${found}`,"DEBUG");
				}
			});

			// Reminder
			await wait(60 * 1000);
			await socket.emit(
				"rcon.broadcast",
				"[REMINDER] "+string,
				() => {
					console.log(
						"[REMINDER] "+ string
					);
				}
			);

			await wait((votingTime - 60) * 1000);
			guildData.plugins.squad.mapVote.active = false;
			guildData.markModified("plugins.squad");
			await guildData.save();
			await voteForLayer.delete();

			await ctxWinner.drawImage(
				background,
				0,
				0,
				canvasWinner.width,
				canvasWinner.height
			);

			winAmount=0;
			for (let i = 1; i <= 6; i++) {
				if(!Layer[i]) continue;
				if(winAmount < Layer[i].length){
					winAmount = Layer[i].length;
					winner = pickedMaps[i - 1];
				}
			}
			if(!winner){
				winner = pickedMaps[0];
			}

			console.log("SON SONUC:",winner, winAmount);

			await drawWinner(winner, winAmount, client);

			if (DEBUG) {
				channel.send(`AdminSetNextLayer ${winner}`);
			} else {
				socket.emit(
					"rcon.execute",
					`AdminSetNextLayer ${winner}`,
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
					`Winning layer is ${winner} - with ${winAmount} votes.`
				);
			} else {
				socket.emit(
					"rcon.broadcast",
					client.translate("misc/WON_MESSAGE", {
						winner: winner,
						winAmount: winAmount
					}),
					() => {
						console.log(
							`Winner map has been selected; ${winner} | votes; ${winAmount} `
						);
					}
				);
			}

			await channel.send(
				embedBuilder(
					client.translate("misc:WINNER_TITLE", {
						layer: winner,
					})
				)
					.setDescription(
						client.translate("misc:WINNER_DESC", {
							layer: winner,
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
	}
};