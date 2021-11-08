const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	utils = require("../utils");

router.get("/", CheckAuth, async (req, res, next) => {
	const canSeeArray = await req.client.getAllCanSee();
	const canSee = await req.client.canAccess("players", req.userInfos.id);
	const responseNotify = await req.client.getShowNotifications();
	const responseUpdate = await req.client.getUpdatePlayersTable();

	if (!canSee) return next(new Error("You can't access this page"));
	res.render("players", {
		notifySettings: responseNotify,
		updateSettings: responseUpdate,
		userRoles: await req.client.getRoles(req.session.user.id),
		c: req.client,
		latestTPS: await utils.getTPS(req.client),
		playerAmount: await req.client.getPlayersLength(),
		userDiscord: req.userInfos,
		allCanSee: canSeeArray,
		userSteam: req.session?.passport?.user || req.userInfos.steam,
		translate: req.translate,
		repoVersion: req.client.config.version,
		currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
		serverID: req.client.config.serverID,
		ownerID: req.client.config.owner.id,
		config: req.client.config,
		usage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
	});
});

module.exports = router;
