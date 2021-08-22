/* eslint-disable no-async-promise-executor */
const config = require("../config.js");
const fetch = require("node-fetch");

const chalk = require("chalk");
const success = (message) => console.log(`   ${chalk.green("✓")} ${message}`);
const error = (message, howToFix) =>
	console.log(
		`   ${chalk.red("✗")} ${message}${howToFix ? ` : ${howToFix}` : ""}`
	);
const ignore = (message) => console.log(`   ${chalk.yellow("~")} ${message}`);

const checks = [
	() => {
		console.log("\n\nEnvironnement");
		return new Promise((res) => {
			if (parseInt(process.version.split(".")[0].split("v")[1]) >= 16) {
				success("node.js version should be equal or higher than v16");
			} else {
				error("node.js version should be equal or higher than v16");
			}
			res();
		});
	},
	() => {
		console.log("\n\nDiscord Bot");
		return new Promise((res) => {
			const { Client, Intents } = require("discord.js");

			const client = new Client({
				intents: [
					Intents.FLAGS.GUILDS,
					Intents.FLAGS.GUILD_MEMBERS,
					Intents.FLAGS.GUILD_MESSAGES,
					Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
					Intents.FLAGS.GUILD_VOICE_STATES,
					Intents.FLAGS.DIRECT_MESSAGES,
				],
			});
			let readyResolve;
			new Promise((resolve) => (readyResolve = resolve));
			client
				.login(config.token)
				.then(async () => {
					success("should be a valid bot token");
					await readyResolve();
					if (!client.guilds.cache.has("568120814776614924")) {
						error(
							"should be added to the emojis server",
							"Please add your bot on this server: https://discord.gg/NPkySYKMkN to make the emojis working"
						);
					} else {
						success("should be added to the emojis server");
					}
					res();
				})
				.catch(() => {
					error("should be a valid bot token");
					res();
				});
			client.on("ready", readyResolve);
		});
	},
	() => {
		console.log("\n\nMongoDB");
		return new Promise((res) => {
			const MongoClient = require("mongodb").MongoClient;
			const dbName = config.mongoDB.split("/").pop();
			const baseURL = config.mongoDB.substr(
				0,
				config.mongoDB.length - dbName.length
			);
			const client = new MongoClient(baseURL, {
				useUnifiedTopology: true,
			});
			client
				.connect()
				.then(async () => {
					success("should be able to connect to Mongo database");
					res();
				})
				.catch(() => {
					error(
						"should be able to connect to Mongo database",
						"please verify if the MongoDB server is started"
					);
					res();
				});
		});
	},
	() => {
		console.log("\n\nAPI keys [Not ready yet]");
		return new Promise(async (resolve) => {
			// Do some api checks.
			resolve();
		});
	},
	() => {
		console.log("\n\nDashboard");
		return new Promise(async (resolve) => {
			if (!config.dashboard.enabled) {
				ignore("Dashboard is not enabled, config shouldn't be checked.");
			} else {
				const checkPortTaken = (port) => {
					return new Promise((resolve) => {
						const net = require("net");
						const tester = net
							.createServer()
							.once("error", () => {
								resolve(true);
							})
							.once("listening", function () {
								tester
									.once("close", function () {
										resolve(false);
									})
									.close();
							})
							.listen(port);
					});
				};
				const isPortTaken = await checkPortTaken(config.dashboard.port);
				if (isPortTaken) {
					error(
						"dashboard port should be available",
						"you have probably another process using this port"
					);
				} else {
					success("dashboard port should be available");
				}
			}
			resolve();
		});
	},
];

(async () => {
	console.log(
		chalk.yellow(
			"This script will check if your config is errored, and some other important things such as whether your database is started, etc..."
		)
	);
	for (const check of checks) {
		await check();
	}
	console.log(
		chalk.yellow(
			"\n\nThank you for using SquadStatJSv3. If you need more help, join our support server here: https://discord.gg/9F2Ng5C"
		)
	);
	process.exit(0);
})();
