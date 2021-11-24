const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	version = require("../../package.json").version,
	utils = require("../utils");

// Gets profile page
router.get("/", CheckAuth, async function (req, res) {
	const canSeeArray = await req.client.getAllCanSee();
	const canSee = await req.client.canAccess("bans", req.userInfos.id);
	if (!canSee) return res.json({ status: "nok", message: "No access!" });

	res.render("bans", {
		userRoles: await req.client.getRoles(req.session.user.id),
		playerAmount: await req.client.getPlayersLength(),
		c: req.client,
		allCanSee: canSeeArray,
		latestTPS: await utils.getTPS(req.client),
		allBannedUsers: await req.client.getBanlist(),
		ownerID: req.client.config.owner.id,
		serverID: req.client.config.serverID,
		userDiscord: req.userInfos,
		userSteam: req.session?.passport?.user || req.userInfos.steam,
		translate: req.translate,
		printDate: req.printDate,
		currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
		repoVersion: version,
		allAvaibleRoles: await req.client.getAllAvaibleAccesLevels(),
		config: req.client.config,
		usage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
	});
});

module.exports = router;
