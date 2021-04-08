const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

const mysql = require("mysql");
// An object to store pending requests
const pendings = {};
let con;

class Addsquaddb extends Command {

	constructor (client) {
		super(client, {
			name: "addsquadserver",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "add-sq" ],
			memberPermissions: [ "MANAGE_GUILD" ],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 3000
		});
		this.client = client;
	}



	async run (message, args, data) {
		const client = this.client;
		const chacheRoles = message.guild.roles.cache;
		const sender = message.author.id;
		const roles = ["--- KD ROLES ---", "KD 0+", "KD 0.5+", "KD 1+", "KD 1.5+", "KD 2+", "KD 2.5+", "KD 3+", "KD 3.5+", "KD 4+", "KD 4.5+", "KD 5+", "KD 5.5+", "KD 6+", "KD 6.5+", "KD 7+", "KD 7.5+", "KD 8+", "KD 8.5+", "KD 9+", "KD 9.5+", "KD 10+"];
		const rolesColors = ["DEFAULT", "LIGHT_GREY", "GREY", "DARK_GREY", "DARKER_GREY", "DARK_AQUA", "DARK_AQUA", "DARK_BLUE", "DARK_BLUE", "DARK_PURPLE", "DARK_PURPLE", "DARK_VIVID_PINK", "DARK_VIVID_PINK", "DARK_GOLD", "RED", "RED", "RED", "RED", "RED", "RED", "RED", "RED"];
		let controlPoint = "";
		if(!data.guild.squadStatRoles) {
			chacheRoles.forEach(role => {
				if(roles.includes(role.name)){
					return controlPoint = role.id;
				}
			});

			if(controlPoint == "") {
				let i=0;
				roles.forEach(role => {

					message.guild.roles.create({
						data: {
							name: role,
							color: rolesColors[i],
						},
						reason: "Roles will be used by the SquadStatJS",
					})
						.catch(console.error);
					i++;
				});
				data.guild.squadStatRoles = true;
				data.guild.save();
			} else {
				return message.error("Please delete the following role first; <@&"+controlPoint+">");
			}


		}

		con = null;
		try {
			con = mysql.createConnection({
				host: data.guild.squadDB.host,
				port: data.guild.squadDB.port,
				user: data.guild.squadDB.user,
				password: data.guild.squadDB.password,
				database: data.guild.squadDB.database
			});
		} catch(err) {
			client.logger.log(err, "error");
		}

		con.connect(error => {
			if (error) {
				client.logger.log(error, "error");
				if(args.length == 0) {
					const profileEmbed = new Discord.MessageEmbed()
						.setAuthor(message.translate("Squad Configuration Pane"))
						.setDescription("The password is censored, please don't write your squad database password on a public channel.")
						.addField("Connection Status: ",message.translate("squad/addsquadserver:CONNECTION_ERROR"), false)
		
						.addField(message.translate("squad/addsquadserver:HOSTS"), message.translate("squad/addsquadserver:HOST", {
							host: data.guild.squadDB.host || "Not Configured"
						}), true)
						.addField(message.translate("squad/addsquadserver:PORTS"), message.translate("squad/addsquadserver:PORT", {
							port: data.guild.squadDB.port || "Not Configured"
						}), true)
						.addField(message.translate("squad/addsquadserver:USERS"), message.translate("squad/addsquadserver:USER", {
							user: data.guild.squadDB.user || "Not Configured"
						}), true)
						.addField(message.translate("squad/addsquadserver:PASSWORDS"), message.translate("squad/addsquadserver:PASSWORD", {
							password: (data.guild.squadDB.password == "")?"Not Configured Yet":"Configured"
						}), true)
						.addField(message.translate("squad/addsquadserver:DATABASES"), message.translate("squad/addsquadserver:DATABASE", {
							database: data.guild.squadDB.database || "Not Configured"
						}), true)
						.addField(message.translate("squad/addsquadserver:SERVER_IDS"), message.translate("squad/addsquadserver:SERVER_ID", {
							id: data.guild.squadDB.serverID || "Not Configured"
						}), true)
						.addField(message.translate("squad/addsquadserver:ROLES"), message.translate("squad/addsquadserver:ROLE", {
							stats: (data.guild.squadStatRoles ? "Roles Given" : "Not Configured ERROR!")
						}), true)
						// .addField(message.translate("squad/addsquadserver:IGNORED_MAPS"), message.translate("squad/addsquadserver:IGNORED_MAP", {
						// 	map: data.guild.squadDB.ignoredMaps || "Not Configured"
						// }), true)
						.addField(
							"\u200B", "\u200B",
						)
						.addField(message.translate("squad/addsquadserver:HOW_TO_SETS"), message.translate("squad/addsquadserver:HOW_TO_SET"), false)
						.addField(message.translate("squad/addsquadserver:SET_HOSTS"), message.translate("squad/addsquadserver:SET_HOST", {
							prefix: data.guild.prefix
						}), true)
						.addField(message.translate("squad/addsquadserver:SET_PORTS"), message.translate("squad/addsquadserver:SET_PORT", {
							prefix: data.guild.prefix
						}), true)
						.addField(message.translate("squad/addsquadserver:SET_USERS"), message.translate("squad/addsquadserver:SET_USER", {
							prefix: data.guild.prefix
						}), true)
						.addField(message.translate("squad/addsquadserver:SET_PASSWORDS"), message.translate("squad/addsquadserver:SET_PASSWORD", {
							prefix: data.guild.prefix
						}), true)
						.addField(message.translate("squad/addsquadserver:SET_DATABASES"), message.translate("squad/addsquadserver:SET_DATABASE", {
							prefix: data.guild.prefix
						}), true)
						.addField(message.translate("squad/addsquadserver:SET_SERVER_IDS"), message.translate("squad/addsquadserver:SET_SERVER_ID", {
							prefix: data.guild.prefix
						}), true)
						// .addField(message.translate("squad/addsquadserver:SET_IGNORED_MAPS"), message.translate("squad/addsquadserver:SET_IGNORED_MAP", {
						// 	prefix: data.guild.prefix
						// }), true)
						.setColor(data.config.embed.color) // Sets the color of the embed
						.setFooter(data.config.embed.footer) // Sets the footer of the embed
						.setTimestamp();

					return message.channel.send(profileEmbed); // Send the embed in the current channel
				}
				return;
			} else {
				if(args.length == 0) {
					const profileEmbed = new Discord.MessageEmbed()
						.setAuthor(message.translate("Squad Configuration Pane"))
						.setDescription("The password is censored, please don't write your squad database password on a public channel.")
						.addField("Connection Status: ",message.translate("squad/addsquadserver:CONNECTION_SUCCESS"), false)
		
						.addField(message.translate("squad/addsquadserver:HOSTS"), message.translate("squad/addsquadserver:HOST", {
							host: data.guild.squadDB.host
						}), true)
						.addField(message.translate("squad/addsquadserver:PORTS"), message.translate("squad/addsquadserver:PORT", {
							port: data.guild.squadDB.port
						}), true)
						.addField(message.translate("squad/addsquadserver:USERS"), message.translate("squad/addsquadserver:USER", {
							user: data.guild.squadDB.user
						}), true)
						.addField(message.translate("squad/addsquadserver:PASSWORDS"), message.translate("squad/addsquadserver:PASSWORD", {
							password: (data.guild.squadDB.password == "")?"Not Configured Yet":"Configured"
						}), true)
						.addField(message.translate("squad/addsquadserver:DATABASES"), message.translate("squad/addsquadserver:DATABASE", {
							database: data.guild.squadDB.database
						}), true)
						.addField(message.translate("squad/addsquadserver:SERVER_IDS"), message.translate("squad/addsquadserver:SERVER_ID", {
							id: data.guild.squadDB.serverID
						}), true)
						.addField(message.translate("squad/addsquadserver:ROLES"), message.translate("squad/addsquadserver:ROLE", {
							stats: data.guild.squadStatRoles ? "Configured" : "Not Configured ERROR!"
						}), true)
						// .addField(message.translate("squad/addsquadserver:IGNORED_MAPS"), message.translate("squad/addsquadserver:IGNORED_MAP", {
						// 	map: data.guild.squadDB.ignoredMaps
						// }), true)
						.addField(
							"\u200B", "\u200B",
						)
						.addField(message.translate("squad/addsquadserver:HOW_TO_SETS"), message.translate("squad/addsquadserver:HOW_TO_SET"), false)
						.addField(message.translate("squad/addsquadserver:SET_HOSTS"), message.translate("squad/addsquadserver:SET_HOST", {
							prefix: data.guild.prefix
						}), true)
						.addField(message.translate("squad/addsquadserver:SET_PORTS"), message.translate("squad/addsquadserver:SET_PORT", {
							prefix: data.guild.prefix
						}), true)
						.addField(message.translate("squad/addsquadserver:SET_USERS"), message.translate("squad/addsquadserver:SET_USER", {
							prefix: data.guild.prefix
						}), true)
						.addField(message.translate("squad/addsquadserver:SET_PASSWORDS"), message.translate("squad/addsquadserver:SET_PASSWORD", {
							prefix: data.guild.prefix
						}), true)
						.addField(message.translate("squad/addsquadserver:SET_DATABASES"), message.translate("squad/addsquadserver:SET_DATABASE", {
							prefix: data.guild.prefix
						}), true)
						.addField(message.translate("squad/addsquadserver:SET_SERVER_IDS"), message.translate("squad/addsquadserver:SET_SERVER_ID", {
							prefix: data.guild.prefix
						}), true)
						// .addField(message.translate("squad/addsquadserver:SET_IGNORED_MAPS"), message.translate("squad/addsquadserver:SET_IGNORED_MAP", {
						// 	prefix: data.guild.prefix
						// }), true)
		
		
		
		
						.addField(message.translate("squad/addsquadserver:HOW_TO_SETS"), message.translate("squad/addsquadserver:HOW_TO_SET"), true)
						.setColor(data.config.embed.color) // Sets the color of the embed
						.setFooter(data.config.embed.footer) // Sets the footer of the embed
						.setTimestamp();
		
					return message.channel.send(profileEmbed); // Send the embed in the current channel
				}
			}
			
		});





		if(args.length < 1) return;



		for(const requester in pendings){
			// If the member already sent a request to someone
			if(requester === message.author.id){
				return message.success("There is already an configuration on progress.");
			}
		}
		let itemToChange;
		// Update pending requests
		pendings[message.author.id] = message.author.id;

		switch(args[0].toLowerCase()) {
			case "host":
				itemToChange = "Fill in the **host** IP address (Write `cancel` to stop.)";
				break;
			case "port":
				itemToChange = "Fill in the **port** address (Write `cancel` to stop. Default value is **3306**[recommended])";
				break;
			case "database":
				itemToChange = "Fill in the **database** name you want to use (Write `cancel` to stop.)";
				break;
			case "user":
				itemToChange = "Fill in the **user**name you want to use (Write `cancel` to stop.)";
				break;
			case "password":
				itemToChange = "Fill in the **password** you want to use (Write `cancel` to stop.)";
				break;
			case "serverid":
				itemToChange = "Fill in the **server ID(s)** you want to use; **Example: `1,2,3` (Write `cancel` to stop.)";
		}
	
			
		message.sendT(itemToChange);
		const collector = new Discord.MessageCollector(message.channel, (m) => m.author.id === sender, {
			time: 120000
		});

		
		let isCanceled = false;
		collector.on("collect", async (msg) => {
			if(msg.content){
				if(msg.content==="cancel"||msg.content==="canceled"||msg.content==="no"||msg.content==="stop"){
					isCanceled = true;
					delete pendings[message.author.id];
				}
				if(isCanceled) return collector.stop(true);
				switch(args[0].toLowerCase()) {
					case "host":
						data.guild.squadDB.host = msg.content;
						data.guild.markModified("squadDB.host");
						break;
					case "port":
						data.guild.squadDB.port = msg.content;
						data.guild.markModified("squadDB.port");
						break;
					case "database":
						data.guild.squadDB.database = msg.content;
						data.guild.markModified("squadDB.database");
						break;
					case "user":
						data.guild.squadDB.user = msg.content;
						data.guild.markModified("squadDB.user");
						break;
					case "password":
						data.guild.squadDB.password = msg.content;
						data.guild.markModified("squadDB.password");
						break;
					case "serverid":
						data.guild.squadDB.serverID = msg.content;
						data.guild.markModified("squadDB.serverID");
				}
				await data.guild.save();
				return collector.stop(true);
			}
		});
	
		collector.on("end", async (_collected, reason) => {
			// Delete pending request 
			delete pendings[message.author.id];
			if(reason === "time"){
				return message.error("Timeout command. Please try again.");
			} else if(!isCanceled) {
				return message.success("Configured successfully!");
			} else {
				return message.success("Canceled successfully!");
			}
		});


	}
}

module.exports = Addsquaddb;
