const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	utils = require("../utils"),
	config = require("../../config");

router.get("/", CheckAuth, async(req,res, next) => {
	const canSeeArray = await req.client.getAllCanSee();
	const canSee = await req.client.canAccess("players", req.userInfos.id);
	if(!canSee)
		return next(new Error("You can't access this page"));
	res.render("players", {
		userRoles: await req.client.getRoles(req.session.user.id),
		c: req.client,
		latestTPS: await utils.getTPS(req.client),
		playerAmount: await req.client.getPlayersLength(),
		userDiscord: req.userInfos,
		allCanSee: canSeeArray,
		userSteam: req.session?.passport?.user || req.userInfos.steam,
		translate: req.translate,
		repoVersion: config.version,
		currentURL: `${config.dashboard.baseURL}/${req.originalUrl}`,
		serverID: config.serverID,
		ownerID: config.owner.id,
		conf: config
	});

});



module.exports = router;
