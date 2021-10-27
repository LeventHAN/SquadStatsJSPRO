const cmdCooldown = {};
// xpCooldown = {} //TODO Impliment?
module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run(message) {
		const data = {};

		// If the messagr author is a bot
		if (message.author.bot) {
			return;
		}

		// If the member on a guild is invisible or not cached, fetch them.
		if (message.guild && !message.member) {
			await message.guild.members.fetch(message.author.id);
		}

		const client = this.client;
		data.config = client.config;

		if (message.guild) {
			// Gets guild data
			const guild = await client.findOrCreateGuild({ id: message.guild.id });
			message.guild.data = data.guild = guild;
		}

		// Check if the bot was mentionned
		if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
			if (message.guild) {
				return message.sendT("misc:HELLO_SERVER", {
					username: message.author.username,
					prefix: data.guild.prefix,
				});
			} else {
				return message.sendT("misc:HELLO_DM", {
					username: message.author.username,
				});
			}
		}

		if (message.content === "@someone" && message.guild) {
			return client.commands.get("someone").run(message, null, data);
		}

		if (message.guild) {
			// Gets the data of the member
			const memberData = await client.findOrCreateMember({
				id: message.author.id,
				guildID: message.guild.id,
			});
			data.memberData = memberData;
		}

		const userData = await client.findOrCreateUser({ id: message.author.id });
		// add message.author.banner to be null
		if (!message.author.banner) message.author.banner = null;
		data.userData = userData;

		if (message.guild) {
			const afkReason = data.userData.afk;
			if (afkReason) {
				data.userData.afk = null;
				await data.userData.save();
				message.sendT("general/setafk:DELETED", {
					username: message.author.username,
				});
			}

			message.mentions.users.forEach(async (u) => {
				const userData = await client.findOrCreateUser({ id: u.id });
				if (userData.afk) {
					message.error("general/setafk:IS_AFK", {
						user: u.tag,
						reason: userData.afk,
					});
				}
			});
		}

		// Gets the prefix
		const prefix = client.functions.getPrefix(message, data);
		if (!prefix) {
			return;
		}

		const args = message.content
			.slice(typeof prefix === "string" ? prefix.length : 0)
			.trim()
			.split(/ +/g);
		const command = args.shift().toLowerCase();
		const cmd =
			client.commands.get(command) ||
			client.commands.get(client.aliases.get(command));

		const customCommand = message.guild
			? data.guild.customCommands.find((c) => c.name === command)
			: null;
		const customCommandAnswer = customCommand ? customCommand.answer : "";

		if (!cmd && !customCommandAnswer && message.guild) return;
		else if (!cmd && !customCommandAnswer && !message.guild) {
			return message.sendT("misc:HELLO_DM", {
				username: message.author.username,
			});
		}

		if (
			message.guild &&
			data.guild.ignoredChannels.includes(message.channel.id) &&
			!message.member.permissions.has("MANAGE_MESSAGES")
		) {
			message.delete();
			message.author.send(
				message.translate("misc:RESTRICTED_CHANNEL", {
					channel: message.channel.toString(),
				})
			);
			return;
		}

		if (customCommandAnswer) {
			return message.channel.send(customCommandAnswer);
		}

		if (cmd.conf.guildOnly && !message.guild) {
			return message.error("misc:GUILD_ONLY");
		}

		if (message.guild) {
			let neededPermissions = [];
			if (!cmd.conf.botPermissions.includes("EMBED_LINKS")) {
				cmd.conf.botPermissions.push("EMBED_LINKS");
			}
			cmd.conf.botPermissions.forEach((perm) => {
				if (!message.channel.permissionsFor(message.guild.me).has(perm)) {
					neededPermissions.push(perm);
				}
			});
			if (neededPermissions.length > 0) {
				return message.error("misc:MISSING_BOT_PERMS", {
					list: neededPermissions.map((p) => `\`${p}\``).join(", "),
				});
			}
			neededPermissions = [];
			cmd.conf.memberPermissions.forEach((perm) => {
				if (!message.channel.permissionsFor(message.member).has(perm)) {
					neededPermissions.push(perm);
				}
			});
			if (neededPermissions.length > 0) {
				return message.error("misc:MISSING_MEMBER_PERMS", {
					list: neededPermissions.map((p) => `\`${p}\``).join(", "),
				});
			}
			if (
				!message.channel
					.permissionsFor(message.member)
					.has("MENTION_EVERYONE") &&
				(message.content.includes("@everyone") ||
					message.content.includes("@here"))
			) {
				return message.error("misc:EVERYONE_MENTION");
			}
			if (!message.channel.nsfw && cmd.conf.nsfw) {
				return message.error("misc:NSFW_COMMAND");
			}
		}

		if (!cmd.conf.enabled) {
			return message.error("misc:COMMAND_DISABLED");
		}

		if (cmd.conf.ownerOnly && message.author.id !== client.config.owner.id) {
			return message.error("misc:OWNER_ONLY");
		}

		let uCooldown = cmdCooldown[message.author.id];
		if (!uCooldown) {
			cmdCooldown[message.author.id] = {};
			uCooldown = cmdCooldown[message.author.id];
		}
		const time = uCooldown[cmd.help.name] || 0;
		if (time && time > Date.now()) {
			return message.error("misc:COOLDOWNED", {
				seconds: Math.ceil((time - Date.now()) / 1000),
			});
		}
		cmdCooldown[message.author.id][cmd.help.name] =
			Date.now() + cmd.conf.cooldown;

		client.logger.log(
			`${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`,
			"cmd"
		);

		const log = new this.client.logs({
			commandName: cmd.help.name,
			author: {
				username: message.author.username,
				discriminator: message.author.discriminator,
				id: message.author.id,
			},
			guild: {
				name: message.guild ? message.guild.name : "dm",
				id: message.guild ? message.guild.id : "dm",
			},
		});
		log.save();

		try {
			cmd.run(message, args, data);
			if (
				(cmd.help.category === "Moderation" || cmd.help.category === "Squad") &&
				data.guild.autoDeleteModCommands
			) {
				message.delete();
			}
		} catch (e) {
			console.error(e);
			return message.error("misc:ERR_OCCURRED");
		}
	}
};
