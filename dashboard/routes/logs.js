const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	utils = require("../utils");

router.get("/", CheckAuth, async (req, res) => {
	const canSeeArray = await req.client.getAllCanSee();
	const canSee = await req.client.canAccess("logs", req.userInfos.id);
	if (!canSee) return res.json({ status: "nok", message: "No access!" });

	res.render("logs", {
		c: req.client,
		ownerID: req.client.config.owner.id,
		latestTPS: await req.client.getTPS(),
		playerAmount: await req.client.getPlayersLength(),
		userRoles: await req.client.getRoles(req.session.user.id),
		allCanSee: canSeeArray,
		serverID: req.client.config.serverID,
		userDiscord: req.userInfos,
		userSteam: req.session?.passport?.user || req.userInfos.steam,
		translate: req.translate,
		repoVersion: req.client.config.version,
		currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
		config: req.client.config,
		usage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
		logs: await req.client.getAuditLogs(),
	});
});

module.exports = router;
