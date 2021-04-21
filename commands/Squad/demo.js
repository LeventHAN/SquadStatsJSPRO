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
 * @param {Canvas()} context The Canvas Object.
 * @param {string} text the text to be wrapped.
 * @param {int} x The x-coordinate.
 * @param {int} y The y-coordinate.
 * @param {int} maxWidth the maximum value of the width of one line.
 * @param {int} lineHeight the space between multiple lines.
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
			}
			else {
				line = testLine;
			}
		}
		context.fillText(line, x, y);
		y += lineHeight;
	}
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
				const bio = stringCleaner(userData.bio, {
					separator: " ",
					lowercase: false,
					decamelize: false,
					preserveLeadingUnderscore: true,
				});
				ctx.font = applyText(canvas, username, 48);
				wrapText(ctx, memberData.squad.steam64ID, canvas.width - 705, canvas.height - 764, 200, 36);
				wrapText(ctx, username.slice(0,16), canvas.width - 1240, canvas.height - 729, 350, 36);
				// Draw server name
				// ctx.fillText(userData.bio, canvas.width - 1300, canvas.height - 880);
				wrapText(ctx, bio, canvas.width - 1300, canvas.height - 910, 920, 36);
				ctx.font = applyText(canvas, member.guild.translate("squad/profile:KDS"), 60);
				ctx.fillText(
					member.guild.translate("squad/profile:KDS"),
					canvas.width - 1450,
					canvas.height - 600
				);
               

				ctx.font = applyText(
					canvas,
					member.guild.translate("administration/welcome:IMG_WELCOME", {
						server: member.guild.name,
					}),
					53
				);
				ctx.fillText(
					member.guild.translate("administration/welcome:IMG_WELCOME", {
						server: member.guild.name,
					}),
					canvas.width - 690,
					canvas.height - 65
				);
				// Draw discriminator
				ctx.font = "40px Bold";
				ctx.fillText(
					member.user.discriminator,
					canvas.width - 623,
					canvas.height - 178
				);
				// Draw number
				ctx.font = "22px Bold";
				ctx.fillText(
					member.guild.translate("administration/welcome:IMG_NB", {
						memberCount: member.guild.memberCount,
					}),
					40,
					canvas.height - 50
				);
				// Draw # for discriminator
				ctx.fillStyle = "#44d14a";
				ctx.font = "75px SketchMatch";
				ctx.fillText("#", canvas.width - 690, canvas.height - 165);
				// Draw Title with gradient
				ctx.font = "90px Bold";
				ctx.strokeStyle = "#1d2124";
				ctx.lineWidth = 15;
				ctx.strokeText(
					(memberData.squad.kd).toFixed(2)+" %",
					canvas.width - 1500,
					canvas.height - 500
				);
				var gradient = ctx.createLinearGradient(
					canvas.width - 780,
					0,
					canvas.width - 30,
					0
				);
				gradient.addColorStop(0, "#e15500");
				gradient.addColorStop(1, "#e7b121");
				ctx.fillStyle = gradient;
				ctx.fillText(
					(memberData.squad.kd).toFixed(2)+" %",
					canvas.width - 1500,
					canvas.height - 500
				);
    
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
					"welcome-image.png"
				);
				message.channel.send(attachment);
			}
		}
	}
}

module.exports = Demo;
