const Command = require("../../base/Command.js"),
	Discord = require("discord.js"),
	{ MessageEmbed } = require("discord.js"),
	axios = require("axios"),
	io = require("socket.io-client"),
	Canvas = require("canvas"),
	{ resolve } = require("path"),
	random = require("random"),
	MYSQLPromiseObjectBuilder = require("../../base/MYSQLPromiseObjectBuilder.js");

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

const defEmojiList = [
	"\u0031\u20E3",
	"\u0032\u20E3",
	"\u0033\u20E3",
	"\u0034\u20E3",
	"\u0035\u20E3",
	"\u0036\u20E3"
];
let currentPlayers;
let res;
let testData;
let ignoreMaps = [];
let rotationToUse;
const seedLayers = [
	"Yehorivka_Skirmish_v1",
	"Narva_Skirmish_v1",
	"Kamdesh_Skirmish_v1",
	"Yehorivka_Skirmish_v2",
	"Skorpo_Skirmish_v1",
	"FoolsRoad_Skirmish_v2",
	"Kohat_Skirmish_v1",
	"Belaya_Skirmish_v1",
	"LashkarValley_Skirmish_v1",
	"CAF_Manic_Skirmish_v1",
	"Gorodok_Skirmish_v1",
	"Fallujah_Skirmish_v2"
];
const rotationLayers = [
	"CAF_GooseBay_AAS_v1",
	"Gorodok_RAAS_v1",
	"Chora_Invasion_v1",
	"Narva_RAAS_v1",
	"Tallil_AAS_v1",
	"Sumari_TC_v1",
	"Mutaha_AAS_v1",
	"Kokan_RAAS_v1",
	"Yehorivka_Invasion_v2",
	"Gorodok_AAS_v2",
	"Kohat_AAS_v1",
	"Gorodok_Destruction_v1",
	"Narva_AAS_v3",
	"Fallujah_RAAS_v2",
	"Chora_AAS_v1",
	"CAF_Yehorivka_RAAS_v1",
	"Mutaha_RAAS_v1",
	"Narva_AAS_v2",
	"Skorpo_AAS_v1",
	"Yehorivka_AAS_v2",
	"FoolsRoad_AAS_v2",
	"Gorodok_Invasion_v1",
	"Chora_RAAS_v2",
	"Mestia_RAAS_v1",
	"Fallujah_RAAS_v1",
	"Narva_Destruction_v1",
	"Skorpo_RAAS_v1",
	"Tallil_RAAS_v4",
	"Yehorivka_RAAS_v3",
	"Albasrah_AAS_v1",
	"Chora_RAAS_v1",
	"Kokan_RAAS_v2",
	"Belaya_Invasion_v2",
	"Gorodok_RAAS_v5",
	"CAF_AlBasrah_Invasion_v2",
	"Fallujah_AAS_v2",
	"Yehorivka_AAS_v1",
	"Narva_Invasion_v1",
	"CAF_Gorodok_AAS_v1",
	"Kohat_RAAS_v4",
	"Albasrah_RAAS_v1",
	"CAF_Mestia_RAAS_v1",
	"Narva_Invasion_v2",
	"Mutaha_Invasion_v1",
	"Yehorivka_RAAS_v1",
	"Kamdesh_RAAS_v2",
	"Kohat_AAS_v2",
	"Yehorivka_RAAS_v5",
	"LashkarValley_AAS_v2",
	"Narva_AAS_v1",
	"Tallil_Invasion_v1",
	"Gorodok_RAAS_v2",
	"FoolsRoad_Invasion_1",
	"Belaya_RAAS_v1",
	"Yehorivka_RAAS_v2",
	"Kamdesh_RAAS_v1",
	"Belaya_AAS_v2",
	"CAF_Lashkar_Valley_RAAS_v1",
	"Fallujah_Invasion_v1",
	"Kohat_RAAS_v1",
	"CAF_Manic_AAS_v1Mutaha_RAAS_v1",
	"FoolsRoad_AAS_v1",
	"Sumari_Invasion_v1",
	"CAF_Manic_RAAS_v1",
	"LashkarValley_AAS_v1",
	"Logar_TC_v1",
	"CAF_Manic_RAAS_v3",
	"Albasrah_invasion_v1"
];

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

const embedBuilder = (title) => {
	return new MessageEmbed()
		.setTitle(`${title}`);
};

/**Removes the map from the array of maps
 *
 * @param {Array} arr - An array of maps.
 * @param {String} value - A map.
 * @returns {Array} - The filtered array.
 */
function removeMap(arr, value) {
	return arr.filter(function(ele){
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

	if(!names) return console.error("No object.");
	layers = [];
	for (let i = 0; i < maps.length; i++){
		console.log("I TRY TO PUSH THIS: ",maps[i]);
		layer = await Canvas.loadImage(
			`https://raw.githubusercontent.com/Squad-Wiki-Editorial/squad-wiki-pipeline-map-data/master/completed_output/_Current%20Version/images/${maps[i]}.jpg`
		);
		console.log(layer);
		await layers.push(layer);
	}


	// Draw layer's images
	width = 0;
	for(let i = 0; i < names.length; i++){
		if(i <= 2){
			await ctxLayers.drawImage(
				layers[i],
				120 + width,
				90,
				400,
				400);
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
			ctxLayers.strokeText(i+1, 460 + width, 460);
			ctxLayers.fillText(i+1, 460 + width, 460);
			(i==2) ? width = 0 : width += 520;
		}
		if(i > 2){
			await ctxLayers.drawImage(
				layers[i],
				120 + width,
				580,
				400,
				400);
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
			ctxLayers.strokeText(i+1, 460 + width, 950);
			ctxLayers.fillText(i+1, 460 + width, 950);
			width += 520;
		}
	}
}

/** Draws the winning layer's image in the canvas.
 *
 * @param {string} winner - The layer that has the most votes.
 * @param {number} winAmount - The amount of votes.
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

	await ctxWinner.drawImage(
		imgLayer,
		510,
		140,
		700,
		700);

	await ctxWinner.fillText(
		layerName,
		660 + alignText(layerName),
		930
	);

	ctxWinner.font = "60px Bold";
	ctxWinner.fillStyle = "#fa9024";

	await ctxWinner.fillText(
		"Won with "+winAmount+" votes",
		660 + alignText("Won with "+winAmount+" votes"),
		1000
	);
}

/**Command for map voting.
 * <h2>Usage: </h2>
 * <h3>Write once this to the channel you want the voting embeds to show</h3>
 * <code>{prefix}mapvote</code>
 * <br />
 * <h3>Disabling mapvote</h3>
 * <code>{prefix}mapvote disable</code>
 *
 * @author LeventHAN
 * @author Alverrt
 * @class Squad-Track-Profile
 * @extends Command
 */

class MapVote extends Command {
	constructor(client) {
		super(client, {
			name: "mapvote",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [],
			memberPermissions: [],
			botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "KICK_MEMBERS", "BAN_MEMBERS"],
			nsfw: false,
			ownerOnly: false,
			cooldown: 1000,
		});
		this.client = client;
		this.pool = null;
	}

	async run(message, args, /**@type {{}}*/ data) {
		if (!data.guild.plugins.squad.mapVote.enabled)
			return message.error("MAP VOTE IS NOT ENABLED");

		const client = this.client;

		const socket = io.connect("ws://185.255.92.71:7894", {
			auth: {
				token: "MySexyPassword123"
			}
		});

		socket.on("connect_error", (err) => {
			return console.error(err); // { content: "Please retry later" }
		});

		if(!socket) return console.error("Socket connection was not accomplied.");

		const DEBUG = false;
		// NEW_GAME - PLAYER_CONNECTED
		socket.on(("NEW_GAME"), async () => {

			
			if(DEBUG){
				message.channel.send("Voting Started Firs Broadcast");
			} else {
				console.log("NEW GAME STARTED.")
				await wait(30 * 1000);
				socket.emit("rcon.broadcast","30 SANIYE SONRA HARITA OYLAMA SISTEMI BASLAYACAKTIR. OYLARINIZ DISCORD UZERINDEN VERILIYOR!", (s) => {
					console.log("Map Voting started message has been send.", s);
				});

			}
			
			if(DEBUG){
				message.channel.send("Voting Started Firs Broadcast");
			} else {
				await wait(20 * 1000);
				socket.emit("rcon.broadcast","10 SANIYE SONRA HARITA OYLAMA SSITEMI BASLAYACAKTIR. OYLARINIZ DISCORD UZERINDEN VERILIYOR!", (s) => {
					console.log("Map Voting started message has been send.", s);
				});
			}

			if(DEBUG){
				await socket.emit("players", (playerList) => {
					currentPlayers = playerList.length;
					console.log("Current Players;",currentPlayers);
				});
			} else {
				await wait(10 * 1000);
				await socket.emit("players", (playerList) => {
					currentPlayers = playerList.length;
				});
			}
			

			

			// TODO: MySQL check last layers
			if (this.pool == null) {
			// Only create one instance
				this.pool = mysql.createPool({
					connectionLimit: 10, // Call all
					host: data.guild.plugins.squad.host,
					port: data.guild.plugins.squad.port,
					user: data.guild.plugins.squad.user,
					password: data.guild.plugins.squad.password,
					database: data.guild.plugins.squad.database,
				});
			}
			const pool = this.pool;
			res = new MYSQLPromiseObjectBuilder(pool);
			for(let i = 0; i < 4; i++){
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
			await ctx.drawImage(background, 0, 0, canvasVotes.width, canvasVotes.height);

			if(DEBUG){
				message.channel.send("Voting Started");
			} else {
				socket.emit("rcon.broadcast","[REMINDER] - Harita oylama sistemi aktif, discord uzerinden oylarinizi kullanmayi unutmayin! (120sn sure - 6 RANDOM HARITA)", (s) => {
					console.log("REMINDER - Map Voting started message has been send.", s);
				});

			}


			maps = [];
			mapsName = [];
			pickedMaps = [];
			pickedMapsName = [];
			rotationToUse = (currentPlayers > 44) ? rotationLayers : seedLayers;

			response.data.Maps.forEach(
				(map) => {
					if(
						!ignoreMaps.includes(map.mapName)
						&&  rotationToUse.includes(map.rawName)
					) {
						maps.push(map.Name);
						mapsName.push(map.rawName);
						ignoreMaps.push(map.mapName);
					}
				}
			);
			console.log("DEBUG MAPS; ",maps);
			loopSize = (maps.length > 6) ? 6 : maps.length;
			for(let i = 0; i < loopSize; i++){
				index = random.int(0, maps.length-1);
				if (!maps[index]) continue;
				if (!mapsName[index]) continue;
				pickedMaps.push(mapsName[index]);
				pickedMapsName.push(maps[index]);
				mapsName = removeMap(mapsName, mapsName[index]);
				maps = removeMap(maps, maps[index]);
			}





			text = `*To vote, react using the correspoding emoji.\nThe voting will end in **60 seconds**.\n\n`;

			// This uses the canvas dimensions to stretch the image onto the entire canvas
			await ctxLayers.drawImage(background, 0, 0, canvasLayers.width, canvasLayers.height);
			console.log(pickedMaps, pickedMapsName);
			await drawMaps(pickedMaps, pickedMapsName);
			const emojiListLayers = defEmojiList.slice();
			emojiInfoLayers = {};
			tempMax = loopSize;
			for (const option of pickedMapsName) {
				if(tempMax <= 0) continue;
				const emoji = emojiListLayers.splice(0, 1);
				emojiInfoLayers[emoji] = { option: option, votes: 0 };
				text += `${emoji} : \`${option}\`\n\n`;
				tempMax--;
			}
			gameLayerImg = await new Discord.MessageAttachment(
				canvasLayers.toBuffer(),
				"mapGameLayerVote.png"
			);

			voteForLayer = await message.channel.send(
				embedBuilder(
					message.translate("misc:MAP_VOTE_LAYER_TITLE")
				)
					.setDescription(text)
					.setColor(data.config.embed.color)
					.setFooter(data.config.embed.footer)
					.setTimestamp()
					.attachFiles(gameLayerImg)
					.setImage("attachment://mapGameLayerVote.png")
			);

			tempMax = loopSize;
			for (const emoji of [...defEmojiList]){
				if(tempMax <= 0) continue;
				await wait(250);
				await voteForLayer.react(emoji);
				tempMax--;
			}

			const usedEmojisLayers = Object.keys(emojiInfoLayers);
			const reactionCollectorLayers = voteForLayer.createReactionCollector(
				(reaction, user) => usedEmojisLayers.includes(reaction.emoji.name) && !user.bot,
				{ time: 120 * 1000 }
			);
			const voterInfoLayer = new Map();
			reactionCollectorLayers.on("collect", async (reaction, user) => {
				if (usedEmojisLayers.includes(reaction.emoji.name)) {
					if (!voterInfoLayer.has(user.id)) await voterInfoLayer.set(user.id, { emoji: reaction.emoji.name });
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
				console.log(s);
				s.forEach((emoji) => {
					checkEmojis.push(
						{
							emoji: parseInt(emoji._emoji.name.slice(0,1), 10),
							amount: emoji.count
						});
				});
				winner = "";
				winAmount = 0;
				checkEmojis.forEach((emoji) => {
					if(winAmount < emoji.amount) {
						winner = emoji.emoji;
						winAmount = emoji.amount;
					}
				});

				// message.channel.send(`Winner is; **${winner ? winner : pickedMaps[0]}** with \`${winner ? winAmount : "No One Voted"}\` votes.`);
				await voteForLayer.delete();
				
				await ctxWinner.drawImage(background, 0, 0, canvasWinner.width, canvasWinner.height);
				broadcastMessage = "";
				if(winner){
					broadcastMessage = pickedMaps[winner-1];
				} else {
					broadcastMessage = pickedMaps[0];
				}
				await drawWinner(broadcastMessage, winAmount);
					
				if(DEBUG){
					message.channel.send(`AdminSetNextLayer ${broadcastMessage}`);
				} else {
					socket.emit("rcon.execute", `AdminSetNextLayer ${broadcastMessage}`, (s) => {
						console.log("DEBUG: ", s);
					});
				}

					
					
				winnerImg = await new Discord.MessageAttachment(
					canvasWinner.toBuffer(),
					"mapWinner.png"
				);

				if(DEBUG){
					message.channel.send(`BROADCAST Edilcek Mesaj: Kazanan harita ${broadcastMessage} - ${winAmount}`);
				} else {
					socket.emit("rcon.broadcast",`Kazanan harita ${broadcastMessage} - oy sayısı: ${winAmount}`, (s) => {
						console.log(`Winner map has been selected; ${broadcastMessage} | votes; ${winAmount} `,s);
					});
				}

				await message.channel.send(
					embedBuilder(
						message.translate("misc:WINNER_TITLE", {
							layer: broadcastMessage
						})
					)
						.setDescription(message.translate("misc:WINNER_DESC", {
							layer: broadcastMessage,
							amount: winAmount
						}))
						.setColor(data.config.embed.color)
						.setFooter(data.config.embed.footer)
						.setTimestamp()
						.attachFiles(winnerImg)
						.setImage("attachment://mapWinner.png")
				);
			});
		});
	}
}

module.exports = MapVote;
