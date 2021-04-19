const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

const mysql = require("mysql");
// An object to store pending requests
const pendings = {};
let con;

/**Command to configure the connection between the bot and Squad MySQL DB
 * <h2>Usage: </h2>
 * <h3>Status check and help panel with info;</h3>
 * <code>{prefix}add-sq</code>
 * <br />
 * <h6>IMPORTANT: </h6>
 * <sub><sup>Configure your server on a private room! After configuring all the data, please do not forget to run <code>{prefix}clear 999</code><br />This will delete the chat history and the deleted messages are not going to be logged by other bots.</sup></sub>
 *
 * @author LeventHAN
 * @class Squad-Configure-Connection
 * @extends Command
 */
class AddSquadDB extends Command {
	constructor(client) {
		super(client, {
			name: "addsquadserver",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: ["add-sq"],
			memberPermissions: ["MANAGE_GUILD"],
			botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			nsfw: false,
			ownerOnly: false,
			cooldown: 3000,
		});
		this.client = client;
	}

	async run(message, args, data) {
		const client = this.client;
		const chacheRoles = message.guild.roles.cache;
		const sender = message.author.id;
		const roles = [
			"--- KD ROLES ---",
			"KD 0+",
			"KD 0.5+",
			"KD 1+",
			"KD 1.5+",
			"KD 2+",
			"KD 2.5+",
			"KD 3+",
			"KD 3.5+",
			"KD 4+",
			"KD 4.5+",
			"KD 5+",
			"KD 5.5+",
			"KD 6+",
			"KD 6.5+",
			"KD 7+",
			"KD 7.5+",
			"KD 8+",
			"KD 8.5+",
			"KD 9+",
			"KD 9.5+",
			"KD 10+",
		];
		const rolesColors = [
			"DEFAULT",
			"LIGHT_GREY",
			"GREY",
			"DARK_GREY",
			"DARKER_GREY",
			"DARK_AQUA",
			"DARK_AQUA",
			"DARK_BLUE",
			"DARK_BLUE",
			"DARK_PURPLE",
			"DARK_PURPLE",
			"DARK_VIVID_PINK",
			"DARK_VIVID_PINK",
			"DARK_GOLD",
			"RED",
			"RED",
			"RED",
			"RED",
			"RED",
			"RED",
			"RED",
			"RED",
		];

		if (
			data.guild.plugins.squad.host !== null &&
			data.guild.plugins.squad.port !== null &&
			data.guild.plugins.squad.user !== null &&
			data.guild.plugins.squad.database !== null &&
			data.guild.plugins.squad.serverID !== null &&
			data.guild.plugins.squad.password !== null &&
			!data.guild.plugins.squad.enabled
		) {
			data.guild.plugins.squad.enabled = true;
			data.guild.markModified("plugins.squad");
			await data.guild.save();
		}

		/**Sends an embed message with the status of the configuration
		 * @param {boolean} status true for successful connection and false for failed/not yet configured connection
		 * @returns {Discord.EmbedMessage} profileEmbed, an embed message
		 */
		async function sendEmbed(status) {
			let connectionStatusMessage = status
				? "squad/addsquadserver:CONNECTION_SUCCESS"
				: "squad/addsquadserver:CONNECTION_ERROR";
			const profileEmbed = new Discord.MessageEmbed()
				.setAuthor(message.translate("squad/addsquadserver:PANE_NAME"))
				.setDescription(message.translate("squad/addsquadserver:PANE_DESC"))
				.addField(
					message.translate("squad/addsquadserver:CONNECTION_TITLE"),
					message.translate(connectionStatusMessage),
					false
				)

				.addField(
					message.translate("squad/addsquadserver:HOSTS"),
					message.translate("squad/addsquadserver:HOST", {
						host: data.guild.plugins.squad.host || ":x:",
					}),
					true
				)
				.addField(
					message.translate("squad/addsquadserver:PORTS"),
					message.translate("squad/addsquadserver:PORT", {
						port: data.guild.plugins.squad.port || ":x:",
					}),
					true
				)
				.addField(
					message.translate("squad/addsquadserver:USERS"),
					message.translate("squad/addsquadserver:USER", {
						user: data.guild.plugins.squad.user || ":x:",
					}),
					true
				)
				.addField(
					message.translate("squad/addsquadserver:PASSWORDS"),
					message.translate("squad/addsquadserver:PASSWORD", {
						password:
							data.guild.plugins.squad.password === null
								? ":x:"
								: ":white_check_mark:",
					}),
					true
				)
				.addField(
					message.translate("squad/addsquadserver:DATABASES"),
					message.translate("squad/addsquadserver:DATABASE", {
						database: data.guild.plugins.squad.database || ":x:",
					}),
					true
				)
				.addField(
					message.translate("squad/addsquadserver:SERVER_IDS"),
					message.translate("squad/addsquadserver:SERVER_ID", {
						id: data.guild.plugins.squad.serverID || ":x:",
					}),
					true
				)
				.addField(
					message.translate("squad/addsquadserver:ROLES"),
					message.translate("squad/addsquadserver:ROLE", {
						stats: data.guild.plugins.squad.rolesEnabled
							? ":white_check_mark:"
							: ":x:",
						statsGiven: data.guild.plugins.squad.rolesGiven
							? ":white_check_mark:"
							: ":x:",
					}),
					true
				)
				.addField("\u200B", "\u200B")
				.addField(
					message.translate("squad/addsquadserver:HOW_TO_SETS"),
					message.translate("squad/addsquadserver:HOW_TO_SET"),
					false
				)
				.addField(
					message.translate("squad/addsquadserver:SET_HOSTS"),
					message.translate("squad/addsquadserver:SET_HOST", {
						prefix: data.guild.prefix,
					}),
					true
				)
				.addField(
					message.translate("squad/addsquadserver:SET_PORTS"),
					message.translate("squad/addsquadserver:SET_PORT", {
						prefix: data.guild.prefix,
					}),
					true
				)
				.addField(
					message.translate("squad/addsquadserver:SET_USERS"),
					message.translate("squad/addsquadserver:SET_USER", {
						prefix: data.guild.prefix,
					}),
					true
				)
				.addField(
					message.translate("squad/addsquadserver:SET_PASSWORDS"),
					message.translate("squad/addsquadserver:SET_PASSWORD", {
						prefix: data.guild.prefix,
					}),
					true
				)
				.addField(
					message.translate("squad/addsquadserver:SET_DATABASES"),
					message.translate("squad/addsquadserver:SET_DATABASE", {
						prefix: data.guild.prefix,
					}),
					true
				)
				.addField(
					message.translate("squad/addsquadserver:SET_SERVER_IDS"),
					message.translate("squad/addsquadserver:SET_SERVER_ID", {
						prefix: data.guild.prefix,
					}),
					true
				)
				.addField(
					message.translate("squad/addsquadserver:SET_ROLES"),
					message.translate("squad/addsquadserver:SET_ROLE", {
						prefix: data.guild.prefix,
					}),
					true
				)
				.addField(
					message.translate("squad/addsquadserver:BYPASS_ROLES"),
					message.translate("squad/addsquadserver:BYPASS_ROLE", {
						prefix: data.guild.prefix,
					}),
					true
				)
				.addField("\u200B", "\u200B")
				.addField(
					message.translate("squad/addsquadserver:SET_WIPES"),
					message.translate("squad/addsquadserver:SET_WIPE", {
						prefix: data.guild.prefix,
					}),
					false
				)
				.addField("\u200B", "\u200B")
				.addField(
					client.customEmojis.link +
						" " +
						message.translate("general/stats:LINKS_TITLE"),
					message.translate("misc:STATS_FOOTER", {
						donateLink: "https://paypal.me/11tstudio?locale.x=en_US",
						dashboardLink: "https://l-event.studio",
						githubLink: "https://github.com/11TStudio",
						supportLink: "https://discord.gg/eF3nYAjhZ9",
					})
				)
				.setColor(data.config.embed.color) // Sets the color of the embed
				.setFooter(data.config.embed.footer) // Sets the footer of the embed
				.setTimestamp();

			let controlPoint = "";
			if (data.guild.plugins.squad.rolesEnabled && !data.guild.plugins.squad.rolesGiven) {
				chacheRoles.forEach((role) => {
					if (roles.includes(role.name)) {
						return (controlPoint = role.id);
					}
				});
		
				if (controlPoint == "") {
					let i = 0;
					roles.forEach((role) => {
						message.guild.roles
							.create({
								data: {
									name: role,
									color: rolesColors[i],
								},
								reason: "Roles will be used by the SquadStatJS",
							})
							.catch(console.error);
						i++;
					});
					data.guild.plugins.squad.rolesGiven = true;
					data.guild.markModified("plugins.squad");
					await data.guild.save();
				} else {
					message.error("squad/addsquadserver:DELETEROLES", {
						role: controlPoint,
					});
				}
			}

			return message.channel.send(profileEmbed); // Send the embed in the current channel
		}
		if (args[0] === "bypass-roles" || args[0] === "fix-roles") {
			data.guild.plugins.squad.rolesGiven = true;
			data.guild.markModified("plugins.squad");
			data.guild.save();
			return message.success("squad/addsquadserver:BYPASSED");
		}
		if (args[0] === "res" || args[0] === "restart") {
			const squad = {
				enabled: false,
				rolesEnabled: false,
				rolesGiven: false,
				host: null,
				port: null,
				database: null,
				user: null,
				password: null,
				serverID: null
			};
			data.guild.plugins.squad = squad;
			data.guild.markModified("plugins.squad");
			data.guild.save();
			return message.success("squad/addsquadserver:CLEARED");
		}

		con = null;
		try {
			con = mysql.createConnection({
				host: data.guild.plugins.squad.host,
				port: data.guild.plugins.squad.port,
				user: data.guild.plugins.squad.user,
				password: data.guild.plugins.squad.password,
				database: data.guild.plugins.squad.database,
			});
		} catch (err) {
			client.logger.log(err, "error");
		}

		if (args.length < 1)
			return con.connect((error) => {
				error ? sendEmbed(false) : sendEmbed(true);
			});

		let itemToChange;
		// Update pending requests
		pendings[message.author.id] = message.author.id;

		switch (args[0].toLowerCase()) {
		case "host":
			itemToChange = message.translate("squad/addsquadserver:FILL_HOST");
			break;
		case "port":
			itemToChange = message.translate("squad/addsquadserver:FILL_PORT");
			break;
		case "database":
			itemToChange = message.translate("squad/addsquadserver:FILL_DATABASE");
			break;
		case "user":
			itemToChange = message.translate("squad/addsquadserver:FILL_USER");
			break;
		case "password":
			itemToChange = message.translate("squad/addsquadserver:FILL_PASSWORD");
			break;
		case "serverid":
			itemToChange = message.translate("squad/addsquadserver:FILL_SERVER_ID");
			break;
		case "autoroles":
			itemToChange = message.translate(
				"squad/addsquadserver:ENABLE_KD_ROLES"
			);
			break;
		}
		if(!itemToChange) return;
		message.sendT(itemToChange);
		const collector = new Discord.MessageCollector(
			message.channel,
			(m) => m.author.id === sender,
			{
				time: 120000,
			}
		);

		let isCanceled = false;
		collector.on("collect", async (msg) => {
			if (msg.content) {
				if (
					msg.content === "cancel" ||
					msg.content === "canceled" ||
					msg.content === "no" ||
					msg.content === "stop"
				) {
					isCanceled = true;
					delete pendings[message.author.id];
				}
				if (isCanceled) return collector.stop(true);
				switch (args[0].toLowerCase()) {
				case "host":
					data.guild.plugins.squad.host = msg.content;
					data.guild.markModified("plugins.squad");
					break;
				case "port":
					data.guild.plugins.squad.port = msg.content;
					data.guild.markModified("plugins.squad");
					break;
				case "database":
					data.guild.plugins.squad.database = msg.content;
					data.guild.markModified("plugins.squad");
					break;
				case "user":
					data.guild.plugins.squad.user = msg.content;
					data.guild.markModified("plugins.squad");
					break;
				case "password":
					data.guild.plugins.squad.password = msg.content;
					data.guild.markModified("plugins.squad");
					break;
				case "serverid":
					data.guild.plugins.squad.serverID = msg.content;
					data.guild.markModified("plugins.squad");
					break;
				case "autoroles":
					data.guild.plugins.squad.rolesEnabled = new RegExp(
						"^y.?s$",
						"i"
					).test(msg.content);
					data.guild.markModified("plugins.squad");
					break;
				}
				await data.guild.save();
				return collector.stop(true);
			}
		});

		collector.on("end", async (_collected, reason) => {
			// Delete pending request
			delete pendings[message.author.id];
			if (reason === "time") {
				return message.error("squad/addsquadserver:TIMEOUT");
			} else if (!isCanceled) {
				return message.success("squad/addsquadserver:CONF_SUC");
			} else {
				return message.success("squad/addsquadserver:CAN_SUC");
			}
		});
	}
}

module.exports = AddSquadDB;
