const Command = require("../../base/Command.js"),
	Discord = require("discord.js"),
	MYSQLPromiseObjectBuilder = require("../../base/MYSQLPromiseObjectBuilder.js");

const mysql = require("mysql");

/**
 * 
 * @author LeventHAN
 * @class Squad-Track-Profile
 * @extends Command
 */
class MapVote extends Command {
	constructor(client) {
		super(client, {
			name: "map-vote",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: ["vote", "mv"],
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
		message
			.sendT("general/ping:CONTENT", {
				ping: "...",
			})
			.then((m) => {
				m.sendT(
					"general/ping:CONTENT",
					{
						ping: m.createdTimestamp - message.createdTimestamp,
					},
					{
						edit: true,
					}
				);
			});
	}
}


module.exports = MapVote;