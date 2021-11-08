const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router();

router.get("/", CheckAuth, async (req, res, next) => {
	//if(req.isAuthenticated()){
	const canSeeArray = await req.client.getAllCanSee();
	const canSee = await req.client.canAccess("dashboard", req.userInfos.id);
	if (!canSee) return next(new Error("You can't access this page"));
	return res.render("squad/mapRotation", {
		userRoles: await req.client.getRoles(req.session.user.id),
		c: req.client,
		playerAmount: await req.client.getPlayersLength(),
		ownerID: req.client.config.owner.id,
		allCanSee: canSeeArray,
		serverID: req.client.config.serverID,
		userDiscord: req.userInfos,
		userSteam: req.session?.passport?.user || req.userInfos.steam,
		translate: req.translate,
		repoVersion: req.client.config.version,
		currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
		config: req.client.config,
		usage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
	});
});

module.exports = router;
