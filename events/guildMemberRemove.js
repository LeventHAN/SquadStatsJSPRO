const Canvas = require("canvas");
const { resolve } = require("path");
// Register assets fonts
Canvas.registerFont(resolve("./assets/fonts/theboldfont.ttf"), {
	family: "Bold",
});
Canvas.registerFont(resolve("./assets/fonts/SketchMatch.ttf"), {
	family: "SketchMatch",
});

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
