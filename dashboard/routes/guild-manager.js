const express = require("express"),
	utils = require("../utils"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	version = require("../../package.json").version,
	config = require("../../config");

router.get("/:serverID", CheckAuth, async (req, res) => {
	const allCanSeeRoles = await req.client.getAllCanSee();
	const guild = req.client.guilds.cache.get(req.params.serverID);

	if (
		!guild ||
		!req.userInfos.displayedGuilds ||
		!req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)
	) {
		return res.render("404", {
			allCanSee: allCanSeeRoles,
			userRoles: await req.client.getRoles(req.session.user.id),
			ownerID: config.owner.id,
			serverID: config.serverID,
			userDiscord: req.userInfos,
			translate: req.translate,
			repoVersion: version,
			currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
		});
	}

	// Fetch guild informations
	const guildInfos = await utils.fetchGuild(
		guild.id,
		req.client,
		req.user.guilds
	);
	await guild.channels.cache.filter((ch) => ch.type === "GUILD_TEXT");
	const allUsers = await req.client.usersData.find().lean().exec();
	const allPages = await req.client.getAllPagesCanSee();
	const allActions = await req.client.getAllActionsWhoCan();
	const allDifferentRoles = await req.client.getAllDiffrentRoles();

	res.render("manager/guild", {
		userRoles: await req.client.getRoles(req.session.user.id),
		c: req.client,
		allCanSee: allCanSeeRoles,
		allActions: allActions,
		role: await req.client.getRoles(req.session.user.id),
		latestTPS: await utils.getTPS(req.client),
		playerAmount: await req.client.getPlayersLength(),
		ownerID: config.owner.id,
		serverID: config.serverID,
		allUsers: allUsers,
		allPages: allPages,
		allRoles: allDifferentRoles,
		memberCount: guild.memberCount,
		guild: guildInfos,
		userDiscord: req.userInfos,
		translate: req.translate,
		repoVersion: version,
		bot: req.client,
		currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
	});
});

router.post("/:serverID", CheckAuth, async (req, res) => {
	// Check if the user has the permissions to edit this guild
	const guild = req.client.guilds.cache.get(req.params.serverID);
	if (
		!guild ||
		!req.userInfos.displayedGuilds ||
		!req.userInfos.displayedGuilds.find((g) => g.id === req.params.serverID)
	) {
		return res.render("404", {
			userRoles: await req.client.getRoles(req.session.user.id),
			ownerID: config.owner.id,
			serverID: config.serverID,
			userDiscord: req.userInfos,
			translate: req.translate,
			currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
		});
	}

	const guildData = await req.client.findOrCreateGuild({ id: guild.id });
	const data = req.body;

	if (data.language) {
		const language = req.client.languages.find(
			(language) =>
				language.aliases[0].toLowerCase() === data.language.toLowerCase()
		);
		if (language) {
			guildData.language = language.name;
		}
		if (data.prefix.length >= 1 && data.prefix.length < 2000) {
			guildData.prefix = data.prefix;
		}
		await guildData.save();
	}

	/**
	 * Adding/Updating the squad server
	 */
	if (
		Object.prototype.hasOwnProperty.call(data, "squadEnable") ||
		Object.prototype.hasOwnProperty.call(data, "squadUpdate")
	) {
		const squad = {
			enabled: true,
			rolesEnabled: data.rolesEnabled == "on" ? true : false,
			rolesGiven: data.rolesGiven == "on" ? false : true,
		};
		const db = {
			host: data.host,
			port: data.port,
			database: data.database,
			user: data.user,
			password:
				data.password === "✔️"
					? guildData.plugins.squad.db.password
					: data.password,
			serverID: data.serverID,
			// (TODO: Should I restrict this to one room?) channel: guild.channels.cache.find((ch) => "#"+ch.name === data.channel).id,
		};
		guildData.plugins.squad.stats = squad;
		guildData.markModified("plugins.squad.stats");
		guildData.plugins.squad.db = db;
		guildData.markModified("plugins.squad.db");
		await guildData.save();
	}

	if (Object.prototype.hasOwnProperty.call(data, "squadDisable")) {
		const squad = {
			enabled: false,
			rolesEnabled: false,
			rolesGiven: false,
			host: null,
			port: null,
			database: null,
			user: null,
			password: null,
			serverID: null,
		};
		const db = {
			host: null,
			port: null,
			database: null,
			userDiscord: null,
			password: null,
			serverID: null,
			// (TODO: Should I restrict this to one room?) channel: guild.channels.cache.find((ch) => "#"+ch.name === data.channel).id,
		};
		guildData.plugins.squad.stats = squad;
		guildData.markModified("plugins.squad.stats");
		guildData.plugins.squad.db = db;
		guildData.markModified("plugins.squad.db");
		await guildData.save();
	}

	if (Object.prototype.hasOwnProperty.call(data, "suggestions")) {
		if (data.suggestions === req.translate("common:NO_CHANNEL")) {
			guildData.plugins.suggestions = false;
		} else {
			guildData.plugins.suggestions = guild.channels.cache.find(
				(ch) => "#" + ch.name === data.suggestions
			).id;
		}
		if (data.modlogs === req.translate("common:NO_CHANNEL")) {
			guildData.plugins.modlogs = false;
		} else {
			guildData.plugins.modlogs = guild.channels.cache.find(
				(ch) => "#" + ch.name === data.modlogs
			).id;
		}
		guildData.markModified("plugins");
	}

	await guildData.save();

	res.redirect(303, "/manage/" + guild.id);
});

module.exports = router;
