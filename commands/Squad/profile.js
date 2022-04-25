const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

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
class Profile extends Command {
	constructor(client) {
		super(client, {
			name: "profile",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: ["prof", "sq", "squad"],
			memberPermissions: [],
			botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			nsfw: false,
			ownerOnly: false,
			cooldown: 1000,
		});
		this.client = client;
	}

	async run(message, args, /**@type {{}}*/ data) {
		if (!data.guild.plugins.squad.stats.enabled)
			return message.error("squad/profile:NOT_ENABLED");

		const client = this.client;

		await message.guild.members.fetch();

		let steamUID;

		let member;

		if (args[0]) member = await client.resolveUser(args[0]);

		if (!member) {
			member = message.member.user;
		}
		// Check if the user is a bot
		if (member.bot) {
			return message.error("squad/profile:BOT_USER");
		}

		const userData =
			member.id === message.author.id
				? data.userData
				: await client.findOrCreateUser({ id: member.id });

		if (!userData.steam?.steamid) {
			return message.error("squad/profile:NOT_LOGGED_TAG", {
				dashboard: data.config.dashboard.baseURL,
				user: userData.id,
			});
		}

		if (data.userData.squad.tracking) {
			steamUID = data.userData.steam.steamid;
		}

		if (
			args[0] === "re" ||
			args[1] === "re" ||
			args[0] === "re-link" ||
			args[1] === "re-link" ||
			args[0] === "relink" ||
			args[1] === "relink"
		) {
			// make an axios post request to the dashboard to "/steam/delete" with the token of the userData
			return await client.axios
				.post(`${data.config.dashboard.baseURL}/auth/steam/delete`, {
					apiToken: userData.apiToken,
					steamid: userData.steam.steamid,
				})
				.then(async (res) => {
					if (res.data.status === "ok") {
						return message.success("squad/profile:REMOVE_LINK");
					} else if (res.data.status === "nok2") {
						return message.error("squad/profile:RE_LINK_FAIL_PERM");
					} else {
						return message.error("squad/profile:RE_LINK_FAIL");
					}
				});
		}
		/**
		 * Send an embed message to the authors channel with the authors squad stats grabbed from MongoDB.
		 *
		 * @author LeventHAN
		 */
		function sendEmbed() {
			const profileEmbed = new Discord.MessageEmbed()
				.setAuthor(
					{
						name: message.translate("squad/profile:TITLE", {
							username: member.tag,
						}),
						iconURL: member.displayAvatarURL()
					}
				)
				.setDescription(
					userData.bio
						? userData.bio
						: message.translate("squad/profile:NO_BIO", {
							prefix: data.guild.prefix,
						  })
				)
				.addField(
					message.translate("squad/profile:STEAMS"),
					message.translate("squad/profile:STEAM", {
						steamName:
							userData.squad.steamName === "Undefined"
								? "Not Recorded Profile"
								: userData.squad.steamName,
						steam64ID: userData.squad.steam64ID || "#",
					}),
					false
				)
				.addField("\u200B", "\u200B")
				.addField(
					message.translate("squad/profile:KDS"),
					message.translate("squad/profile:KD", {
						kd: userData.squad.kd,
					}),
					true
				)
				.addField("\u200B", "\u200B")
				.addField(
					message.translate("squad/profile:Kills_ALL"),
					message.translate("squad/profile:KILL", {
						kills: userData.squad.Kills_ALL || 0,
					}),
					true
				)
				.addField(
					message.translate("squad/profile:WOUNDS_INF"),
					message.translate("squad/profile:WOUNDS", {
						kills: userData.squad.woundsINF,
					}),
					true
				)
				.addField(
					message.translate("squad/profile:WOUNDS_VEH"),
					message.translate("squad/profile:WOUNDS", {
						kills: userData.squad.woundsVEH,
					}),
					true
				)
				.addField(
					message.translate("squad/profile:REVIVES"),
					message.translate("squad/profile:REVIVE", {
						revives: userData.squad.revives,
					}),
					true
				)
				.addField(
					message.translate("squad/profile:DEATHS"),
					message.translate("squad/profile:DEATH", {
						deaths: userData.squad.deaths,
					}),
					true
				)
				.addField(
					message.translate("squad/profile:TEAMKILLS"),
					message.translate("squad/profile:TEAMKILL", {
						tk: userData.squad.tk,
					}),
					true
				)
				.addField(
					message.translate("squad/profile:MK_GUNS"),
					message.translate("squad/profile:MK_GUN", {
						gun: userData.squad.mk_gun,
					}),
					true
				)

				.addField("\u200B", "\u200B", true)
				.addField(
					message.translate("squad/profile:MK_ROLES"),
					message.translate("squad/profile:MK_ROLE", {
						role: userData.squad.mk_role,
					}),
					true
				)
				.addField("\u200B", "\u200B")
				.addField(
					message.translate("squad/profile:EXPS"),
					message.translate("squad/profile:EXP", {
						exp: userData.squad.exp || 0,
					}),
					true
				)

				.addField(message.translate("squad/profile:HOURS"), "Soon™", true)
				.addField(message.translate("squad/profile:ACTIVITY"), "Soon™", true)
				.addField("\u200B", "\u200B")
				.addField(
					":link: Links",
					message.translate("misc:STATS_FOOTER", {
						donateLink: "https://github.com/sponsors/11TStudio",
						dashboardLink: data.config.dashboard.baseURL,
						githubLink: "https://github.com/11TStudio",
					})
				)
				.setColor(data.config.embed.color) // Sets the color of the embed
				.setFooter({
					text: data.config.embed.footer
				}) // Sets the footer of the embed
				.setTimestamp();
			message.channel.send({ embeds: [profileEmbed] });
		}

		/**
		 * Gives a K/D role to the message author if the guild/discord server has those roles installed.
		 */
		function giveDiscordRoles() {
			const regexKD = /^KD /i;
			message.member.roles.cache.some((role) => {
				if (regexKD.test(role.name))
					message.member.roles.remove(role).catch(console.error);
			});
			let roleName = "KD 0+";
			switch (true) {
				case parseFloat(data.userData.squad.kd) < 0.5:
					roleName = "KD 0+";
					break;
				case parseFloat(data.userData.squad.kd) < 1.0:
					roleName = "KD 0.5+";
					break;
				case parseFloat(data.userData.squad.kd) < 1.5:
					roleName = "KD 1+";
					break;
				case parseFloat(data.userData.squad.kd) < 2.0:
					roleName = "KD 1.5+";
					break;
				case parseFloat(data.userData.squad.kd) < 2.5:
					roleName = "KD 2+";
					break;
				case parseFloat(data.userData.squad.kd) < 3.0:
					roleName = "KD 2.5+";
					break;
				case parseFloat(data.userData.squad.kd) < 3.5:
					roleName = "KD 3+";
					break;
				case parseFloat(data.userData.squad.kd) < 4.0:
					roleName = "KD 3.5+";
					break;
				case parseFloat(data.userData.squad.kd) < 4.5:
					roleName = "KD 4+";
					break;
				case parseFloat(data.userData.squad.kd) < 5.0:
					roleName = "KD 4.5+";
					break;
				case parseFloat(data.userData.squad.kd) < 5.5:
					roleName = "KD 5+";
					break;
				case parseFloat(data.userData.squad.kd) < 6.0:
					roleName = "KD 5.5+";
					break;
				case parseFloat(data.userData.squad.kd) < 6.5:
					roleName = "KD 6+";
					break;
				case parseFloat(data.userData.squad.kd) < 7:
					roleName = "KD 6.5+";
					break;
				case parseFloat(data.userData.squad.kd) < 7.5:
					roleName = "KD 7+";
					break;
				case parseFloat(data.userData.squad.kd) < 8:
					roleName = "KD 7.5+";
					break;
				case parseFloat(data.userData.squad.kd) < 8.5:
					roleName = "KD 8+";
					break;
				case parseFloat(data.userData.squad.kd) < 9:
					roleName = "KD 8.5+";
					break;
				case parseFloat(data.userData.squad.kd) < 9.5:
					roleName = "KD 9+";
					break;
				case parseFloat(data.userData.squad.kd) < 10:
					roleName = "KD 9.5+";
					break;
				case parseFloat(data.userData.squad.kd) > 10:
					roleName = "KD 10+";
					break;
				default:
					roleName = "KD 0+";
					break;
			}
			const role = message.guild.roles.cache.find((r) => r.name === roleName);
			message.member.roles.add(role).catch(console.error);
			message.success("squad/profile:UPDATE", {
				steamID: steamUID,
			});
		}

		let dt = new Date();
		dt = dt.setHours(dt.getHours() + 2);
		dt = new Date(dt);
		let lastUpdate = new Date(data.userData.squad.trackDate);
		lastUpdate = lastUpdate.setHours(lastUpdate.getHours() + 1);
		lastUpdate = new Date(lastUpdate);
		if (
			!data.userData.squad.tracking ||
			(data.userData.squad.tracking && lastUpdate < dt)
		) {
			await client.updateStats(userData.id);
			if (data.guild.plugins.squad.stats.rolesEnabled) {
				await giveDiscordRoles();
			}
			await sendEmbed();
		} else {
			await sendEmbed();
		}
	}
}

module.exports = Profile;
