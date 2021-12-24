const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	version = require("../../package.json").version;

// Gets profile page
router.get("/", CheckAuth, async function (req, res) {
	const canSeeArray = await req.client.getAllCanSee();
	const canSee = await req.client.canAccess("roles", req.userInfos.id);
	if (!canSee) return res.json({ status: "nok", message: "No access!" });

	const roles = await req.client.getWhitelistRoles();
	const whitelisted = await req.client.getWhitelistUsers();
	res.render("rolesSettings", {
		userRoles: await req.client.getRoles(req.session.user.id),
		playerAmount: await req.client.getPlayersLength(),
		c: req.client,
		roles: roles,
		allCanSee: canSeeArray,
		whitelisted: whitelisted,
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
