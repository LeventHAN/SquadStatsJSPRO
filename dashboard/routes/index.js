const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	utils = require("../utils");

router.get("/", async (req, res) => {
	return res.redirect("/index");
});

router.get("/index", async (req, res) => {
	if (req.isAuthenticated()) {
		return res.render("index", {
			c: req.client,
			userRoles: await req.client.getRoles(req.session.user.id),
			latestTPS: await req.client.getTPS(),
			ownerID: req.client.config.owner.id,
			serverID: req.client.config.serverID,
			userDiscord: req.userInfos,
			userSteam: req.session?.passport?.user || req.userInfos.steam,
			translate: req.translate,
			repoVersion: req.client.config.version,
			currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
		});
	}
	return res.render("index", {
		c: req.client,
		ownerID: req.client.config.owner.id,
		serverID: req.client.config.serverID,
		userDiscord: null,
		userSteam: null,
		translate: req.translate,
		repoVersion: req.client.config.version,
		currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
	});
});

router.get("/selector", CheckAuth, async (req, res) => {
	const allCanSeeRoles = await req.client.getAllCanSee();
	const info = [];
	if(req.userInfos?.displayedGuilds){
		await req.userInfos.displayedGuilds.forEach(function(guild) {
			if (guild.id === req.client.config.serverID) {
				info.push({
					name: guild.name,
					icon: guild.iconURL,
					settingsURL: guild.settingsUrl
				});
			}
		});
	}

	res.render("selector", {
		userRoles: await req.client.getRoles(req.session.user.id),
		c: req.client,
		latestTPS: await req.client.getTPS(),
		guild: info[0],
		playerAmount: await req.client.getPlayersLength(),
		ownerID: req.client.config.owner.id,
		allCanSee: allCanSeeRoles,
		serverID: req.client.config.serverID,
		userDiscord: req.userInfos,
		userSteam: req.session?.passport?.user || req.userInfos.steam,
		translate: req.translate,
		repoVersion: req.client.config.version,
		config: req.client.config,
		usage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
		currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
	});
});

router.get("/leaderboard", async (req, res) => {
	// await req.client.getLeaderboard();
	res.render("selector", {
		currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
	});
});

module.exports = router;
