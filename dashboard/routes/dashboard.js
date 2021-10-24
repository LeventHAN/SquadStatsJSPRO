const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	config = require("../../config"),
	utils = require("../utils"); 



router.get("/", CheckAuth, async(req,res,next) => {
	const canSeeArray = await req.client.getAllCanSee();
	const userRole = await req.client.getRoles(req.session.user.id);
	const canSee = await req.client.canAccess("dashboard", req.userInfos.id);
	if(!canSee)
		return next(new Error("You can't access this page"));
	
	


	res.render("dashboard", {
		latestTPS: await utils.getTPS(req.client),
		previusMap: await utils.getPreviusMap(req.client),
		playerAmount: await req.client.getPlayersLength(),
		ownerID: config.owner.id,
		role: userRole,
		allCanSee: canSeeArray,
		serverID: config.serverID,
		userDiscord: req.userInfos,
		userSteam: req.session?.passport?.user || req.userInfos.steam,
		translate: req.translate,
		repoVersion: config.version,
		currentURL: `${config.dashboard.baseURL}/${req.originalUrl}`,
		config: config
	});

});



module.exports = router;
