const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	version = require("../../package.json").version,
	utils = require("../utils"),
	config = require("../../config");

// Gets profile page
router.get("/", CheckAuth, async function (req, res) {
	const canSeeArray = await req.client.getAllCanSee();
	const canSee = await req.client.canAccess("roles", req.userInfos.id);
	if (!canSee) return res.json({ status: "nok", message: "No access!" });

	const bans = await req.client.getBanlist();
	res.render("bans", {
		userRoles: await req.client.getRoles(req.session.user.id),
		playerAmount: await req.client.getPlayersLength(),
		c: req.client,
		allCanSee: canSeeArray,
		latestTPS: await utils.getTPS(req.client),
		banlisted: bans,
		ownerID: config.owner.id,
		serverID: config.serverID,
		userDiscord: req.userInfos,
		userSteam: req.session?.passport?.user || req.userInfos.steam,
		translate: req.translate,
		printDate: req.printDate,
		currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
		repoVersion: version,
		allAvaibleRoles: await req.client.getAllAvaibleAccesLevels(),
	});
});

module.exports = router;