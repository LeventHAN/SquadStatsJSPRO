require("./helpers/extenders");
const config = require("./config");
const logdna = require("@logdna/logger");
const options = {
	app: "SquadStatJSPRO-" + config.embed.footer,
	level: "info",
};
const logger = logdna.createLogger("2a30af09b6f95d83e47ec94b2ebb1ece", options);

const util = require("util"),
	fs = require("fs"),
	readdir = util.promisify(fs.readdir),
	mongoose = require("mongoose");

// Load SquadStatJSv3 class
const SquadStatJSv3 = require("./base/SquadStatJSv3"),
	client = new SquadStatJSv3();

const init = async () => {
	// Search for all commands
	const directories = await readdir("./commands/");
	client.logger.log(
		`Loading a total of ${directories.length} categories.`,
		"log"
	);
	directories.forEach(async (dir) => {
		const commands = await readdir("./commands/" + dir + "/");
		commands
			.filter((cmd) => cmd.split(".").pop() === "js")
			.forEach((cmd) => {
				const response = client.loadCommand("./commands/" + dir, cmd);
				if (response) {
					client.logger.log(response, "error");
				}
			});
	});

	// Then we load events, which will include our message and ready event.
	const evtFiles = await readdir("./events/");
	client.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
	evtFiles.forEach((file) => {
		const eventName = file.split(".")[0];
		client.logger.log(`Loading Event: ${eventName}`);
		const event = new (require(`./events/${file}`))(client);
		client.on(eventName, (...args) => event.run(...args));
		delete require.cache[require.resolve(`./events/${file}`)];
	});

	client.login(client.config.token); // Log in to the discord api
	
	// connect to mongoose database
	mongoose
		.connect(client.config.mongoDB, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			client.logger.log("Connected to the Mongodb database.", "log");
		})
		.catch((err) => {
			client.logger.log(
				"Unable to connect to the Mongodb database. Error:" + err,
				"error"
			);
		});

	const languages = require("./helpers/languages");
	client.translations = await languages();
	
};

init();

logger.log(
	"SquadStatJS has been run by " +
		config.owner.name +
		" (" +
		config.owner.id +
		")",
	{
		level: "info",
		indexMeta: true,
		meta: {
			dashboard: config.dashboard.enabled,
			baseURL: config.dashboard.enabled
				? config.dashboard.baseURL + ":" + config.dashboard.port
				: "n/a",
			prefix: config.dashboard.prefix,
			supportServer: config.support.id
		},
	}
);

// if there are errors, log them
client
	.on("disconnect", () => client.logger.log("Bot is disconnecting...", "warn"))
	.on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
	.on("error", (e) => client.logger.log(e, "error"))
	.on("warn", (info) => client.logger.log(info, "warn"));

// if there is an unhandledRejection, log them
process.on("unhandledRejection", (err) => {
	console.error(err);
});
