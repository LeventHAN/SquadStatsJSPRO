const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

const mysql = require("mysql");

const asyncForEach = async (array, callback) => {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
};

class Profile extends Command {
	constructor(client) {
		super(client, {
			name: "profile",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: ["prof"],
			memberPermissions: [],
			botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			nsfw: false,
			ownerOnly: false,
			cooldown: 1000,
		});
		this.client = client;
	}

	async run(message, args, data) {
		const client = this.client;
		let claimed = "";
		let member = await client.resolveMember(args[0], message.guild);
		if (!member) member = message.member;

		// Check if the user is a bot
		if (member.user.bot) {
			return message.error("squad/profile:BOT_USER");
		}
		if (!data.guild.squadStatRoles)
			return message.error("squad/profile:NOT_CONFIGURED");

		// Gets the data of the user whose profile you want to display
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

		let con;
		// Gets the first argument
		let steamUID;

		if (args[0] === "re" || args[0] === "re-link") {
			data.memberData.tracking = false;
			data.memberData.save();
			return message.success("squad/profile:RE_LINKED");
		}

		const members = await this.client.membersData
			.find({ guildID: message.guild.id })
			.lean();
		/*
			membersLeaderboard = members
			.map((m) => {
				return {
					id: m.id,
					value: m.steam64ID,
				};
			})
			.sort((a, b) => b.value - a.value);
			*/

		members.forEach((element) => {
			if (
				element &&
				element.steam64ID === args[0] &&
				element.id !== message.member.id
			) {
				claimed = element.id;
			}
		});

		if (claimed != "") {
			return message.error("squad/profile:ALREADY_EXISTING", {
				username: claimed,
			});
		}

		if (data.memberData.tracking) {
			steamUID = data.memberData.steam64ID;
		} else {
			steamUID = args[0];
			const steamIDpatter = /^[0-9]{17}$/;
			const uidValid = steamIDpatter.test(steamUID);
			if (!uidValid) {
				return message.error("squad/profile:INVALID_MEMBER");
			}

			data.memberData.steam64ID = steamUID;
			data.memberData.save();
			message.success("squad/profile:SUCCESS", {
				creator: message.author.toString(),
				steamID: steamUID,
			});
		}
		try {
			con = mysql.createConnection({
				host: data.guild.squadDB.host,
				port: data.guild.squadDB.port,
				user: data.guild.squadDB.user,
				password: data.guild.squadDB.password,
				database: data.guild.squadDB.database,
			});
		} catch (err) {
			client.logger.log(err, "error");
		}

		let dt = new Date();
		dt = dt.setHours(dt.getHours() + 2);
		dt = new Date(dt);

		let lastUpdate = new Date(data.memberData.trackDate);
		lastUpdate = lastUpdate.setHours(lastUpdate.getHours() + 1);
		lastUpdate = new Date(lastUpdate);

		/** //TODO What is this?
		 *
		 * @returns {*} //TODO What is this?
		 */
		async function sendEmbed() {
			const commonsGuilds = client.guilds.cache.filter((g) =>
				g.members.cache.get(member.id)
			);
			await asyncForEach(commonsGuilds.array(), async (/*guild*/) => {
				//	const memberData = await client.findOrCreateMember({ // TODO BRUH WHAT IS THIS?
				//		id: member.id,
				//		guildID: guild.id,
				//	});
			});

			const profileEmbed = new Discord.MessageEmbed()
				.setAuthor(
					message.translate("squad/profile:TITLE", {
						username: member.user.tag,
					}),
					member.user.displayAvatarURL()
				)
				.setDescription(
					userData.bio
						? userData.bio
						: message.translate("squad/profile:NO_BIO")
				)
				.addField(
					message.translate("squad/profile:STEAMS"),
					message.translate("squad/profile:STEAM", {
						steamName: memberData.steamName,
						steam64ID: memberData.steam64ID || "#",
					}),
					false
				)
				.addField("\u200B", "\u200B")
				.addField(
					message.translate("squad/profile:KDS"),
					message.translate("squad/profile:KD", {
						kd: memberData.kd,
					}),
					true
				)
				.addField(
					message.translate("squad/profile:KILLS"),
					message.translate("squad/profile:KILL", {
						kills: memberData.kills,
					}),
					true
				)
				.addField(
					message.translate("squad/profile:DEATHS"),
					message.translate("squad/profile:DEATH", {
						deaths: memberData.deaths,
					}),
					true
				)
				.addField(
					message.translate("squad/profile:WOUNDS"),
					message.translate("squad/profile:WOUND", {
						wounds: memberData.wounds,
					}),
					true
				)
				.addField(
					message.translate("squad/profile:REVIVES"),
					message.translate("squad/profile:REVIVE", {
						revives: memberData.revives,
					}),
					true
				)
				.addField(
					message.translate("squad/profile:TEAMKILLS"),
					message.translate("squad/profile:TEAMKILL", {
						tk: memberData.tk,
					}),
					true
				)
				.addField(
					message.translate("squad/profile:MK_GUNS"),
					message.translate("squad/profile:MK_GUN", {
						gun: memberData.mk_gun,
					}),
					true
				)
				.addField(
					message.translate("squad/profile:MK_ROLES"),
					message.translate("squad/profile:MK_ROLE", {
						role: memberData.mk_role,
					}),
					true
				)
				.addField("\u200B", "\u200B")
				.addField(
					message.translate("squad/profile:EXPS"),
					message.translate("squad/profile:EXP", {
						exp: memberData.exp,
					}),
					true
				)
				.addField(
					message.translate("squad/profile:HOURS"),
					"Soon™", //`**${memberData.hours}** hours`,
					true
				)
				.addField(
					message.translate("squad/profile:ACTIVITY"),
					"Soon™", //message.printDate(new Date(memberData.lastActivity)),
					true
				)
				.setColor(data.config.embed.color) // Sets the color of the embed
				.setFooter(data.config.embed.footer) // Sets the footer of the embed
				.setTimestamp();
			message.channel.send(profileEmbed);
		}
		if (!data.guild.squadStatRoles) {
			return message.error("squad/profile:NOT_CONFIGURED");
		} else {
			if (
				!data.memberData.tracking ||
				(data.memberData.tracking && lastUpdate < dt)
			) {
				con.connect((error) => {
					if (error) {
						client.logger.log(error, "error");
					}

					con.query(
						"SELECT lastName FROM DBLog_SteamUsers WHERE steamID='" +
							steamUID +
							"'",
						(err, result) => {
							if (err) {
								return client.logger.log(err, "error");
							}
							data.memberData.steamName = result[0]["lastName"] || "Undefined";
							con.query(
								"SELECT COUNT(*) AS Wounds FROM DBLog_Wounds WHERE attacker='" +
									steamUID +
									"'",
								(err, result) => {
									if (err) {
										return client.logger.log(err, "error");
									}
									if (result.length >= 1)
										data.memberData.wounds = result[0]["Wounds"] || 0;
									con.query(
										"SELECT COUNT(*) AS Kills FROM DBLog_Deaths WHERE attacker='" +
											steamUID +
											"'",
										(err, result) => {
											if (err) {
												return client.logger.log(err, "error");
											}
											if (result.length >= 1)
												data.memberData.kills = result[0]["Kills"] || 0;
											con.query(
												"SELECT COUNT(*) AS Deaths FROM DBLog_Deaths WHERE victim='" +
													steamUID +
													"'",
												(err, result) => {
													if (err) {
														return client.logger.log(err, "error");
													}
													if (result.length >= 1)
														data.memberData.deaths = result[0]["Deaths"] || 0;
													con.query(
														"SELECT COUNT(*) AS Revives FROM DBLog_Revives WHERE reviver='" +
															steamUID +
															"'",
														(err, result) => {
															if (err) {
																return client.logger.log(err, "error");
															}
															if (result.length >= 1)
																data.memberData.revives =
																	result[0]["Revives"] || 0;
															con.query(
																"SELECT COUNT(*) AS TeamKills FROM DBLog_Wounds WHERE attacker='" +
																	steamUID +
																	"' AND teamkill=1",
																(err, result) => {
																	if (err) {
																		return client.logger.log(err, "error");
																	}
																	if (result.length >= 1)
																		data.memberData.tk =
																			result[0]["TeamKills"] || 0;
																	con.query(
																		"SELECT weapon AS Fav_Gun FROM DBLog_Wounds WHERE attacker='" +
																			steamUID +
																			"' GROUP BY weapon ORDER BY COUNT(weapon) DESC LIMIT 1",
																		(err, result) => {
																			if (err) {
																				return client.logger.log(err, "error");
																			}
																			if (result.length >= 1)
																				data.memberData.mk_gun =
																					result[0]["Fav_Gun"] || "Undefined";
																			else data.memberData.mk_gun = "N/A";
																			con.query(
																				"SELECT weapon AS Fav_Role FROM DBLog_Deaths WHERE attacker='" +
																					steamUID +
																					"' GROUP BY weapon ORDER BY COUNT(weapon) DESC LIMIT 1",
																				(err, result) => {
																					if (err) {
																						return client.logger.log(
																							err,
																							"error"
																						);
																					}
																					data.memberData.mk_role =
																						result[0]["Fav_Role"] ||
																						"Undefined";
																					con.query(
																						"SELECT (COUNT(*)/(SELECT COUNT(*) FROM DBLog_Deaths WHERE victim = '" +
																							steamUID +
																							"')) AS KD FROM DBLog_Deaths WHERE attacker='" +
																							steamUID +
																							"'",
																						(err, result) => {
																							if (err) {
																								return client.logger.log(
																									err,
																									"error"
																								);
																							}
																							data.memberData.kd =
																								result[0]["KD"] || 0;
																							data.memberData.trackDate = dt;

																							if (!data.memberData.tracking) {
																								data.memberData.tracking = true;
																							}
																							data.memberData.save();

																							if (data.guild.squadStatRoles) {
																								const regexKD = /^KD /i;
																								message.member.roles.cache.some(
																									(role) => {
																										if (regexKD.test(role.name))
																											message.member.roles
																												.remove(role)
																												.catch(console.error);
																									}
																								);
																								let roleName = "KD 0+";
																								if (
																									parseFloat(
																										data.memberData.kills
																									) > 50
																								) {
																									switch (true) {
																									case parseFloat(
																										data.memberData.kd
																									) < 0.5:
																										roleName = "KD 0+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 1.0:
																										roleName = "KD 0.5+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 1.5:
																										roleName = "KD 1+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 2.0:
																										roleName = "KD 1.5+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 2.5:
																										roleName = "KD 2+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 3.0:
																										roleName = "KD 2.5+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 3.5:
																										roleName = "KD 3+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 4.0:
																										roleName = "KD 3.5+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 4.5:
																										roleName = "KD 4+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 5.0:
																										roleName = "KD 4.5+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 5.5:
																										roleName = "KD 5+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 6.0:
																										roleName = "KD 5.5+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 6.5:
																										roleName = "KD 6+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 7:
																										roleName = "KD 6.5+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 7.5:
																										roleName = "KD 7+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 8:
																										roleName = "KD 7.5+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 8.5:
																										roleName = "KD 8+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 9:
																										roleName = "KD 8.5+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 9.5:
																										roleName = "KD 9+";
																										break;
																									case parseFloat(
																										data.memberData.kd
																									) < 10:
																										roleName = "KD 9.5+";
																										break;
																									default:
																										roleName = "KD 10+";
																										break;
																									}
																								}
																								const role = message.guild.roles.cache.find(
																									(r) => r.name === roleName
																								);
																								message.member.roles
																									.add(role)
																									.catch(console.error);
																								message.success(
																									"squad/profile:UPDATE",
																									{
																										creator: message.author.toString(),
																										steamID: steamUID,
																									}
																								);
																								sendEmbed();
																							}
																						}
																					);
																				}
																			);
																		}
																	);
																}
															);
														}
													);
												}
											);
										}
									);
								}
							);
						}
					);
				});
			} else {
				sendEmbed();
			}
		}
	}
}

module.exports = Profile;
