const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

const mysql = require("mysql");

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
		const pool = mysql.createPool({
			connectionLimit: 5,
			host: data.guild.squadDB.host,
			port: data.guild.squadDB.port,
			user: data.guild.squadDB.user,
			password: data.guild.squadDB.password,
			database: data.guild.squadDB.database,
		});

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

		let steamUID;

		if (args[0] === "re" || args[0] === "re-link") {
			data.memberData.tracking = false;
			data.memberData.save();
			return message.success("squad/profile:RE_LINKED");
		}

		const members = await this.client.membersData
			.find({ guildID: message.guild.id })
			.lean();

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

		/**
		 * Send an embed message to the authors channel with the authors squad stats grabbed from MongoDB.
		 */
		function sendEmbed() {
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
					message.translate("squad/profile:WOUNDS_INF"),
					message.translate("squad/profile:WOUNDS", {
						kills: memberData.woundsINF,
					}),
					true
				)
				.addField(
					message.translate("squad/profile:WOUNDS_VEH"),
					message.translate("squad/profile:WOUNDS", {
						kills: memberData.woundsVEH,
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

		/**.
		 * Promise based getter, gets the KD ratio for the steamUID
		 *
		 * @param {string} steamUID SteamID is a unique identifier for your Steam account
		 * @returns {string} row with K/D value of the steamUID
		 */
		function getKD(steamUID) {
			return new Promise(function (resolve, reject) {
				pool.getConnection(function (err, connection) {
					var query_str =
						"SELECT (COUNT(*)/(SELECT COUNT(*)" +
						"FROM DBLog_Deaths WHERE victim = ?)) AS KD " +
						"FROM DBLog_Deaths WHERE attacker=?";

					var query_var = [steamUID, steamUID];

					pool.query(query_str, query_var, function (err, rows) {
						// Call reject on error states,
						// call resolve with results
						if (err) return reject(err);
						resolve(rows);
					});

					// Release the connection
					connection.release();
				});
			});
		}

		/**.
		 * Promise based getter, gets the steamName for the steamUID
		 *
		 * @param {string} steamUID SteamID is a unique identifier for your Steam account
		 * @returns {string} row with steamName of the steamUID
		 */
		function getSteamName(steamUID) {
			return new Promise(function (resolve, reject) {
				pool.getConnection(function (err, connection) {
					var query_str =
						"SELECT lastName FROM DBLog_SteamUsers WHERE steamID = ? ";

					var query_var = [steamUID];

					pool.query(query_str, query_var, function (err, rows) {
						// Call reject on error states,
						// call resolve with results
						if (err) return reject(err);
						resolve(rows);
					});

					// Release the connection
					connection.release();
				});
			});
		}

		/**.
		 * Promise based getter, gets the infantry wounds count for the steamUID
		 *
		 * @param {string} steamUID SteamID is a unique identifier for your Steam account
		 * @returns {string} the infantry wounds count
		 */
		function getInfantryWounds(steamUID) {
			return new Promise(function (resolve, reject) {
				pool.getConnection(function (err, connection) {
					var query_str =
						"SELECT COUNT(*) AS `Kills INF` FROM DBLog_Wounds WHERE attacker = ?" +
						" AND weapon NOT REGEXP '(kord|stryker|uh60|projectile|mortar|btr80|btr82|deployable|kornet|s5|s8|tow|crows|50cal|warrior|coax|L30A1|_hesh|_AP|technical|shield|DShK|brdm|2A20|LAV|M1126|T72|bmp2|SPG9|FV4034|Truck|logi|FV432|2A46|Tigr)'";

					var query_var = [steamUID];

					pool.query(query_str, query_var, function (err, rows) {
						// Call reject on error states,
						// call resolve with results
						if (err) return reject(err);
						resolve(rows);
					});
					// Release the connection
					connection.release();
				});
			});
		}

		/**.
		 * Promise based getter, gets the vehicle wounds count for the steamUID
		 *
		 * @param {string} steamUID SteamID is a unique identifier for your Steam account
		 * @returns {string} the vehicle wounds count
		 */
		function getVehicleWounds(steamUID) {
			return new Promise(function (resolve, reject) {
				pool.getConnection(function (err, connection) {
					var query_str =
						"SELECT COUNT(*) AS `Kills VEH` FROM DBLog_Wounds WHERE attacker = ?" +
						" AND weapon REGEXP '(kord|stryker|uh60|projectile|mortar|btr80|btr82|deployable|kornet|s5|s8|tow|crows|50cal|warrior|coax|L30A1|_hesh|_AP|technical|shield|DShK|brdm|2A20|LAV|M1126|T72|bmp2|SPG9|FV4034|Truck|logi|FV432|2A46|Tigr)'";

					var query_var = [steamUID];

					pool.query(query_str, query_var, function (err, rows) {
						// Call reject on error states,
						// call resolve with results
						if (err) return reject(err);
						resolve(rows);
					});
					// Release the connection
					connection.release();
				});
			});
		}

		/**.
		 * Promise based getter, gets the kills count for the steamUID
		 *
		 * @param {string} steamUID SteamID is a unique identifier for your Steam account
		 * @returns {string} the kills count
		 */
		function getKills(steamUID) {
			return new Promise(function (resolve, reject) {
				pool.getConnection(function (err, connection) {
					var query_str =
						"SELECT COUNT(*) AS Kills FROM DBLog_Deaths WHERE attacker = ?";

					var query_var = [steamUID];

					pool.query(query_str, query_var, function (err, rows) {
						// Call reject on error states,
						// call resolve with results
						if (err) return reject(err);
						resolve(rows);
					});
					// Release the connection
					connection.release();
				});
			});
		}

		/**.
		 * Promise based getter, gets the deaths count for the steamUID
		 *
		 * @param {string} steamUID SteamID is a unique identifier for your Steam account
		 * @returns {string} the deaths count
		 */
		function getDeaths(steamUID) {
			return new Promise(function (resolve, reject) {
				pool.getConnection(function (err, connection) {
					var query_str =
						"SELECT COUNT(*) AS Deaths FROM DBLog_Deaths WHERE victim = ?";

					var query_var = [steamUID];

					pool.query(query_str, query_var, function (err, rows) {
						// Call reject on error states,
						// call resolve with results
						if (err) return reject(err);
						resolve(rows);
					});
					// Release the connection
					connection.release();
				});
			});
		}

		/**.
		 * Promise based getter, gets the revives count for the steamUID
		 *
		 * @param {string} steamUID SteamID is a unique identifier for your Steam account
		 * @returns {string} the revives count
		 */
		function getRevives(steamUID) {
			return new Promise(function (resolve, reject) {
				pool.getConnection(function (err, connection) {
					var query_str =
						"SELECT COUNT(*) AS Revives FROM DBLog_Revives WHERE reviver = ?";

					var query_var = [steamUID];

					pool.query(query_str, query_var, function (err, rows) {
						// Call reject on error states,
						// call resolve with results
						if (err) return reject(err);
						resolve(rows);
					});
					// Release the connection
					connection.release();
				});
			});
		}

		/**.
		 * Promise based getter, gets the team kills count for the steamUID
		 *
		 * @param {string} steamUID SteamID is a unique identifier for your Steam account
		 * @returns {string} the team kills count
		 */
		function getTeamKills(steamUID) {
			return new Promise(function (resolve, reject) {
				pool.getConnection(function (err, connection) {
					var query_str =
						"SELECT COUNT(*) AS TeamKills FROM DBLog_Wounds WHERE attacker=?" +
						" AND teamkill=1";

					var query_var = [steamUID];

					pool.query(query_str, query_var, function (err, rows) {
						// Call reject on error states,
						// call resolve with results
						if (err) return reject(err);
						resolve(rows);
					});
					// Release the connection
					connection.release();
				});
			});
		}

		/**.
		 * Promise based getter, gets the gun name with most kill count for the steamUID
		 *
		 * @param {string} steamUID SteamID is a unique identifier for your Steam account
		 * @returns {string} the gun name with most kill
		 */
		function getGunWithMostKills(steamUID) {
			return new Promise(function (resolve, reject) {
				pool.getConnection(function (err, connection) {
					var query_str =
						"SELECT weapon AS Fav_Gun FROM DBLog_Wounds WHERE attacker = ?" +
						" GROUP BY weapon ORDER BY COUNT(weapon) DESC LIMIT 1";

					var query_var = [steamUID];

					pool.query(query_str, query_var, function (err, rows) {
						// Call reject on error states,
						// call resolve with results
						if (err) return reject(err);
						resolve(rows);
					});
					// Release the connection
					connection.release();
				});
			});
		}

		/**.
		 * Promise based getter, gets the role name with most kill count for the steamUID
		 *
		 * @param {string} steamUID SteamID is a unique identifier for your Steam account
		 * @returns {string} the role name with most kill
		 */
		function getRoleWithMostKills(steamUID) {
			return new Promise(function (resolve, reject) {
				pool.getConnection(function (err, connection) {
					var query_str =
						"SELECT weapon AS Fav_Role FROM DBLog_Deaths WHERE attacker = ?" +
						" GROUP BY weapon ORDER BY COUNT(weapon) DESC LIMIT 1";

					var query_var = [steamUID];

					pool.query(query_str, query_var, function (err, rows) {
						// Call reject on error states,
						// call resolve with results
						if (err) return reject(err);
						resolve(rows);
					});
					// Release the connection
					connection.release();
				});
			});
		}

		/**
		 * Saves the current trackdate and tracking status in the mongodb which will be used later to determine if it should refetch new data from MySQL DB or grab it from mongoDB.
		 *
		 * @param {number} dt - The dateTime of now in epoch.
		 */
		function saveTracking(dt) {
			data.memberData.trackDate = dt;

			if (!data.memberData.tracking) {
				data.memberData.tracking = true;
			}
		}

		/**
		 * Gives a K/D role to the message author if the guild/discord server has those roles installed.
		 */
		function giveDiscordRoles() {
			if (data.guild.squadStatRoles) {
				const regexKD = /^KD /i;
				message.member.roles.cache.some((role) => {
					if (regexKD.test(role.name))
						message.member.roles.remove(role).catch(console.error);
				});
				let roleName = "KD 0+";
				if (parseFloat(data.memberData.kills) > 50) {
					switch (true) {
					case parseFloat(data.memberData.kd) < 0.5:
						roleName = "KD 0+";
						break;
					case parseFloat(data.memberData.kd) < 1.0:
						roleName = "KD 0.5+";
						break;
					case parseFloat(data.memberData.kd) < 1.5:
						roleName = "KD 1+";
						break;
					case parseFloat(data.memberData.kd) < 2.0:
						roleName = "KD 1.5+";
						break;
					case parseFloat(data.memberData.kd) < 2.5:
						roleName = "KD 2+";
						break;
					case parseFloat(data.memberData.kd) < 3.0:
						roleName = "KD 2.5+";
						break;
					case parseFloat(data.memberData.kd) < 3.5:
						roleName = "KD 3+";
						break;
					case parseFloat(data.memberData.kd) < 4.0:
						roleName = "KD 3.5+";
						break;
					case parseFloat(data.memberData.kd) < 4.5:
						roleName = "KD 4+";
						break;
					case parseFloat(data.memberData.kd) < 5.0:
						roleName = "KD 4.5+";
						break;
					case parseFloat(data.memberData.kd) < 5.5:
						roleName = "KD 5+";
						break;
					case parseFloat(data.memberData.kd) < 6.0:
						roleName = "KD 5.5+";
						break;
					case parseFloat(data.memberData.kd) < 6.5:
						roleName = "KD 6+";
						break;
					case parseFloat(data.memberData.kd) < 7:
						roleName = "KD 6.5+";
						break;
					case parseFloat(data.memberData.kd) < 7.5:
						roleName = "KD 7+";
						break;
					case parseFloat(data.memberData.kd) < 8:
						roleName = "KD 7.5+";
						break;
					case parseFloat(data.memberData.kd) < 8.5:
						roleName = "KD 8+";
						break;
					case parseFloat(data.memberData.kd) < 9:
						roleName = "KD 8.5+";
						break;
					case parseFloat(data.memberData.kd) < 9.5:
						roleName = "KD 9+";
						break;
					case parseFloat(data.memberData.kd) < 10:
						roleName = "KD 9.5+";
						break;
					default:
						roleName = "KD 10+";
						break;
					}
				}
				const role = message.guild.roles.cache.find((r) => r.name === roleName);
				message.member.roles.add(role).catch(console.error);
				message.success("squad/profile:UPDATE", {
					creator: message.author.toString(),
					steamID: steamUID,
				});
			}
		}

		/**
		 * End all connections in the pool...
		 */
		function endPool() {
			pool.end(function () {
				//console.error(err);
				// all connections in the pool have ended
			});
		}

		let dt = new Date();
		dt = dt.setHours(dt.getHours() + 2);
		dt = new Date(dt);

		let lastUpdate = new Date(data.memberData.trackDate);
		lastUpdate = lastUpdate.setHours(lastUpdate.getHours() + 1);
		lastUpdate = new Date(lastUpdate);
		if (!data.guild.squadStatRoles) {
			return message.error("squad/profile:NOT_CONFIGURED");
		} else {
			if (
				!data.memberData.tracking ||
				(data.memberData.tracking && lastUpdate < dt)
			) {
				await getSteamName(steamUID)
					.then(function (rows) {
						data.memberData.steamName = rows[0]["lastName"];
						data.memberData.save();
					})
					.catch((err) =>
						setImmediate(() => {
							throw err;
						})
					);

				await getKD(steamUID)
					.then(function (rows) {
						data.memberData.kd = rows[0]["KD"];
						data.memberData.save();
					})
					.catch((err) =>
						setImmediate(() => {
							throw err;
						})
					);

				await getKills(steamUID)
					.then(function (rows) {
						data.memberData.kills = rows[0]["Kills"];
						data.memberData.save();
					})
					.catch((err) =>
						setImmediate(() => {
							throw err;
						})
					);
				await getDeaths(steamUID)
					.then(function (rows) {
						data.memberData.deaths = rows[0]["Deaths"];
						data.memberData.save();
					})
					.catch((err) =>
						setImmediate(() => {
							throw err;
						})
					);
				await getInfantryWounds(steamUID)
					.then(function (rows) {
						data.memberData.woundsINF = rows[0]["Kills INF"];
						data.memberData.save();
					})
					.catch((err) =>
						setImmediate(() => {
							throw err;
						})
					);
				await getVehicleWounds(steamUID)
					.then(function (rows) {
						data.memberData.woundsVEH = rows[0]["Kills VEH"];
						data.memberData.save();
					})
					.catch((err) =>
						setImmediate(() => {
							throw err;
						})
					);
				await getRevives(steamUID)
					.then(function (rows) {
						data.memberData.revives = rows[0]["Revives"];
						data.memberData.save();
					})
					.catch((err) =>
						setImmediate(() => {
							throw err;
						})
					);
				await getTeamKills(steamUID)
					.then(function (rows) {
						data.memberData.tk = rows[0]["TeamKills"];
						data.memberData.save();
					})
					.catch((err) =>
						setImmediate(() => {
							throw err;
						})
					);
				await getGunWithMostKills(steamUID)
					.then(function (rows) {
						data.memberData.mk_gun = String(rows[0]["Fav_Gun"]);
						data.memberData.save();
					})
					.catch((err) =>
						setImmediate(() => {
							throw err;
						})
					);
				await getRoleWithMostKills(steamUID)
					.then(function (rows) {
						data.memberData.mk_role = String(rows[0]["Fav_Role"]);
						data.memberData.save();
					})
					.catch((err) =>
						setImmediate(() => {
							throw err;
						})
					);

				await saveTracking(dt);
				await giveDiscordRoles();
				await endPool();
				await sendEmbed();
			} else {
				sendEmbed();
			}
		}
	}
}

module.exports = Profile;
