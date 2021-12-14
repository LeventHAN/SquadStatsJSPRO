const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	utils = require("../utils");

router.get("/", CheckAuth, async (req, res, next) => {
	const allCanSeeRoles = await req.client.getAllCanSee();

	const canSee = await req.client.canAccess("dashboard", req.userInfos.id);
	if (!canSee) return next(new Error("You can't access this page"));

	res.render("dashboard", {
		userRoles: await req.client.getRoles(req.session.user.id),
		latestTPS: await req.client.getTPS(),
		previusMap: await utils.getPreviusMap(req.client),
		playerAmount: await req.client.getPlayersLength(),
		c: req.client,
		allCanSee: allCanSeeRoles,
		serverID: req.client.config.serverID,
		userDiscord: req.userInfos,
		userSteam: req.session?.passport?.user || req.userInfos.steam,
		translate: req.translate,
		repoVersion: req.client.config.version,
		currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
		usage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
		config: req.client.config,
	});
});

module.exports = router;
