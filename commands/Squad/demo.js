const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

const stringCleaner = require("@sindresorhus/slugify");
const Canvas = require("canvas");
const { resolve } = require("path");
// Register assets fonts
Canvas.registerFont(resolve("./assets/fonts/theboldfont.ttf"), {
	family: "Bold",
});
Canvas.registerFont(resolve("./assets/fonts/SketchMatch.ttf"), {
	family: "SketchMatch",
});

const applyText = (canvas, text, defaultFontSize) => {
	const ctx = canvas.getContext("2d");
	do {
		ctx.font = `${(defaultFontSize -= 10)}px Bold`;
	} while (ctx.measureText(text).width > 600);
	return ctx.font;
};

/** Wraps a text in multiple lines. A solution for .fillText() that goes out of the canvas.
 *
 * @param {Object<Canvas>} context - The Canvas Object.
 * @param {string} text - The text to be wrapped.
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @param {number} maxWidth - The maximum value of the width of one line.
 * @param {number} lineHeight - The space between multiple lines.
 * @author LeventHAN
 */
function wrapText(context, text, x, y, maxWidth, lineHeight) {
	let line;
	let words;
	let testWidth;
	let metrics;
	let testLine;
	let cars;
	cars = text.split("\n");
	for (let ii = 0; ii < cars.length; ii++) {
		line = "";
		words = cars[ii].split(" ");
		for (let n = 0; n < words.length; n++) {
			testLine = line + words[n] + " ";
			metrics = context.measureText(testLine);
			testWidth = metrics.width;
			if (testWidth > maxWidth) {
				context.fillText(line, x, y);
				line = words[n] + " ";
				y += lineHeight;
			} else {
				line = testLine;
			}
		}
		context.fillText(line, x, y);
		y += lineHeight;
	}
}
/**Draws a text to the canvas.
 *
 * @param {Object} ctx - The context of the canvas 2D.
 * @param {string} font - The font size and type, (ex. 70px Bold).
 * @param {string} strokeStyle - The color of the outer stroke in HEX.
 * @param {number} lineWidth - The width of the letter's line.
 * @param {string} data - Player data (obtained from MongoDB) to be drawn in the canvas.
 * @param {number} xPos - The postion of the text X-coordinates.
 * @param {number} yPos - The postion of the text Y-coordinates.
 * @param {number} gradientWidth - The width of the gradient.
 * @param {number} gradientHeight - The height of the gradient.
 * @param {string} colorStart - The gradients start color in HEX.
 * @param {string} colorEnd - The gradients end color in HEX.
 * @author LeventHAN
 */
function drawText(
	ctx,
	font,
	strokeStyle,
	lineWidth,
	data,
	xPos,
	yPos,
	gradientWidth,
	gradientHeight,
	colorStart,
	colorEnd
) {
	// Draw Kills with gradient
	ctx.font = font;
	ctx.strokeStyle = strokeStyle;
	ctx.lineWidth = lineWidth;
	ctx.strokeText(data, xPos, yPos);
	let gradient = ctx.createLinearGradient(gradientWidth, 0, gradientHeight, 0);
	gradient.addColorStop(0, colorStart);
	gradient.addColorStop(1, colorEnd);
	ctx.fillStyle = gradient;
	ctx.fillText(data, xPos, yPos);
}

/**Command for squad profile stats track.
 * <h2>Usage: </h2>
 * <h3>Linking your account</h3>
 * <code>{prefix}profile {Steam64ID}</code>
 * <br />
 * <h3>Removing the link from your account</h3>
 * <code>{prefix}profile re</code> OR <code>{prefix}profile re-link</code>
 * <br />
 * <h6>Note: </h6>
 * <sub><sup>After linking your account you don't need to specify your steam64ID anymore. Just use; <code>{prefix}profile</code></sup></sub>
 *
 * @author LeventHAN
 * @class Squad-Track-Profile
 * @extends Command
 */
class Demo extends Command {
	constructor(client) {
		super(client, {
			name: "demo",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: ["asdasdasdasd", "qweqweqwe", "qweqweqwewqa"],
			memberPermissions: [],
			botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			nsfw: false,
			ownerOnly: false,
			cooldown: 1000,
		});
		this.client = client;
		this.pool = null;
	}

	async run(message, args, /**@type {{}}*/ data) {
		const client = this.client;
		// If someone is mentioned grab that
		let member = await client.resolveMember(args[0], message.guild);
		if (!member) member = message.member;
		const memberData =
			member.id === message.author.id
				? data.memberData
				: await client.findOrCreateMember({
					id: member.id,
					guildID: message.guild.id,
				  });
		const userData =
			member.id === message.author.id
				? data.userData
				: await client.findOrCreateUser({ id: member.id });
		if (memberData.squad.steam64ID == null)
			return message.error("squad/profile:INVALID_MEMBER");

		if (data.guild.plugins.squad.rolesEnabled) {
			if (data.guild.plugins.squad.enabled) {
				const canvas = Canvas.createCanvas(1680, 1080),
					ctx = canvas.getContext("2d");

				// Background language
				const background = await Canvas.loadImage(
					"./assets/img/profile_background.png"
				);
				// This uses the canvas dimensions to stretch the image onto the entire canvas
				ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
				// Draw username
				ctx.fillStyle = "#ffffff";
				const username = stringCleaner(memberData.squad.steamName, {
					separator: " ",
					lowercase: false,
					decamelize: false,
					preserveLeadingUnderscore: true,
				});
				const bio = stringCleaner(userData.bio || "", {
					separator: " ",
					lowercase: false,
					decamelize: false,
					preserveLeadingUnderscore: true,
				});

				ctx.font = applyText(canvas, username, 48);

				// Steam64ID wrapped
				wrapText(
					ctx,
					memberData.squad.steam64ID,
					canvas.width - 705,
					canvas.height - 764,
					200,
					36
				);

				// Username wrapped
				wrapText(
					ctx,
					username.slice(0, 16),
					canvas.width - 1040,
					canvas.height - 729,
					350,
					36
				);

				// Bio wrapped
				wrapText(ctx, bio, canvas.width - 1000, canvas.height - 910, 920, 36);

				ctx.font = applyText(
					canvas,
					member.guild.translate("squad/profile:KDS"),
					60
				);
				// K/D
				ctx.fillText(member.guild.translate("squad/profile:KDS"), 240, 530);

				// Infantry Kills Title
				ctx.fillText(
					member.guild.translate("squad/profile:KILLS_INF"),
					canvas.width - 1000,
					canvas.height - 600
				);

				// Vehicle Kills Title
				ctx.fillText(
					member.guild.translate("squad/profile:KILLS_VEH"),
					canvas.width - 1000,
					canvas.height - 420
				);

				// Infantry Wounds Title
				ctx.fillText(
					member.guild.translate("squad/profile:WOUNDS_INF"),
					canvas.width - 560,
					canvas.height - 600
				);

				// Vehicle Wounds Title
				ctx.fillText(
					member.guild.translate("squad/profile:WOUNDS_VEH"),
					canvas.width - 560,
					canvas.height - 420
				);

				// Draw # for discriminator
				ctx.fillStyle = "#44d14a";
				ctx.font = "75px SketchMatch";
				ctx.fillText("#", canvas.width - 690, canvas.height - 165);

				// K/D
				drawText(
					ctx,
					"90px Bold",
					"#1d2124",
					15,
					memberData.squad.kd.toFixed(2) + " %",
					180,
					615,
					canvas.width - 780,
					canvas.width - 30,
					"#e15500",
					"#e7b121"
				);

				// Infantry Kills
				drawText(
					ctx,
					"70 Bold",
					"#1d2124",
					15,
					memberData.squad.killsINF,
					memberData.squad.killsINF > 9999
						? canvas.width - 1065
						: memberData.squad.killsINF > 999
							? canvas.width - 1040
							: memberData.squad.killsINF > 99
								? canvas.width - 1015
								: memberData.squad.killsINF > 9
									? canvas.width - 990
									: canvas.width - 955,
					canvas.height - 510,
					canvas.width - 780,
					canvas.width - 30,
					"#EEC005",
					"#0591EE"
				);

				// Vehicle Kills
				drawText(
					ctx,
					"70 Bold",
					"#1d2124",
					15,
					memberData.squad.killsVEH,
					memberData.squad.killsVEH > 9999
						? canvas.width - 1065
						: memberData.squad.killsVEH > 999
							? canvas.width - 1040
							: memberData.squad.killsVEH > 99
								? canvas.width - 1015
								: memberData.squad.killsVEH > 9
									? canvas.width - 990
									: canvas.width - 955,
					canvas.height - 340,
					canvas.width - 780,
					canvas.width - 30,
					"#EEC005",
					"#0591EE"
				);

				// Infantry Wounds
				drawText(
					ctx,
					"70 Bold",
					"#1d2124",
					15,
					memberData.squad.woundsINF,
					memberData.squad.woundsINF > 9999
						? canvas.width - 580
						: memberData.squad.woundsINF > 999
							? canvas.width - 555
							: memberData.squad.woundsINF > 99
								? canvas.width - 525
								: memberData.squad.woundsINF > 9
									? canvas.width - 480
									: canvas.width - 450,
					canvas.height - 510,
					canvas.width - 780,
					canvas.width - 30,
					"#EEC005",
					"#0591EE"
				);

				// Vehicle Wounds
				drawText(
					ctx,
					"70 Bold",
					"#1d2124",
					15,
					memberData.squad.woundsVEH,
					memberData.squad.woundsVEH > 9999
						? canvas.width - 580
						: memberData.squad.woundsVEH > 999
							? canvas.width - 555
							: memberData.squad.woundsVEH > 99
								? canvas.width - 525
								: memberData.squad.woundsVEH > 9
									? canvas.width - 480
									: canvas.width - 450,
					canvas.height - 340,
					canvas.width - 780,
					canvas.width - 30,
					"#EEC005",
					"#0591EE"
				);

				// Load the images
				let imgInfKills = await Canvas.loadImage("./assets/img/infIcon.png");
				let imgVehKills = await Canvas.loadImage("./assets/img/vehIcon.png");

				// Draw the images
				ctx.drawImage(imgVehKills, 520, 572, 120, 120);
				ctx.drawImage(imgInfKills, 540, 402, 120, 120);

				ctx.drawImage(imgVehKills, 900, 572, 120, 120);
				ctx.drawImage(imgInfKills, 920, 402, 120, 120);

				// Pick up the pen
				ctx.beginPath();
				//Define Stroke Line
				ctx.lineWidth = 10;
				//Define Stroke Style
				ctx.strokeStyle = "#03A9F4";
				// Start the arc to form a circle
				ctx.arc(180, 200, 90, 0, Math.PI * 2, true);
				// Draw Stroke
				ctx.stroke();
				// Put the pen down
				ctx.closePath();
				// Clip off the region you drew on
				ctx.clip();

				const options = { format: "png", size: 512 },
					avatar = await Canvas.loadImage(
						member.user.displayAvatarURL(options)
					);
				// Move the image downwards vertically and constrain its height to 200, so it"s a square
				ctx.drawImage(avatar, 45, 90, 270, 270);

				const attachment = new Discord.MessageAttachment(
					canvas.toBuffer(),
					"squad-stats-" + memberData.squad.steam64ID + ".png"
				);
				message.channel.send(attachment);
			}
		}
	}
}

module.exports = Demo;
