const chalk = require("chalk");
const status = require("../config.js").status,
	version = require("../package.json").version;

module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run() {
		const client = this.client;
		const socket = client.socket;
		if(socket){
			socket.on("connect_error", (err) => {
				return client.logger.log(err, "ERROR");
			});
		}
		// Logs some informations using the logger file
		client.logger.log(
			`Loading a total of ${client.commands.size} command(s).`,
			"log"
		);

		

		// /* Squad Creating Plugin */
		// 	await client.emit("squadCreating", squadVotingGuild, "851451690020110346", socket);
		//

		client.logger.log(
			`${client.user.tag}, ready to serve ${client.users.cache.size}.`,
			"ready"
		);

		// STREAMERS PERMS ?
		// // setInterval(function () {
		// client.on("presenceUpdate", (oldPresence, newPresence) => {
		// 	if (!newPresence.activities) return false;
		// 	newPresence.activities.forEach(activity => {
		// 		if (activity.type == "STREAMING" && activity.state == "Squad") {
		// 			console.log(activity);
		// 			console.log(`${newPresence.user.tag} is streaming at ${activity.url}.`);
		// 		}
		// 	});
		// });
		// // }, 20000); // Every 20 seconds
		// Start the dashboard
		if (client.config.dashboard.enabled) {
			client.dashboard.load(client);
		}

		let i = 0;

		setInterval(function () {
			const toDisplay = status[parseInt(i, 10)].name + " | v" + version;
			client.user.setActivity(toDisplay, {
				type: status[parseInt(i, 10)].type,
			});
			if (status[parseInt(i + 1, 10)]) i++;
			else i = 0;
		}, 20000); // Every 20 seconds

		setTimeout(() => {
			console.log(
				chalk.magenta("\n\nSquadStatsJS Ready!"),
				"Made with ❤️   by LeventHAN https://github.com/11TStudio/SquadStatsJSPRO"
			);
		}, 400);
	}
};
