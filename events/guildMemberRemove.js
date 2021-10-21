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
