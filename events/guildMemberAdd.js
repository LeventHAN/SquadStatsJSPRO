const Canvas = require("canvas"),
	Discord = require("discord.js");
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

module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run(member) {
		await member.guild.members.fetch();

		const guildData = await this.client.findOrCreateGuild({
			id: member.guild.id,
		});
		member.guild.data = guildData;
	}
};
