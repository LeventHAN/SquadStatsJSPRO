const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	config = require("../../config");


router.get("/", CheckAuth, async(req, res, next) => {
	//if(req.isAuthenticated()){
	const canSeeArray = await req.client.getAllCanSee();
	const userRole = await req.client.getRoles(req.session.user.id);
	const canSee = await req.client.canAccess("dashboard", req.userInfos.id);
	if(!canSee)
		return next(new Error("You can't access this page"));
	return res.render("squad/mapRotation", {
		role: userRole,
		playerAmount: await req.client.getPlayersLength(),
		ownerID: config.owner.id,
		allCanSee: canSeeArray,
		serverID: config.serverID,
		userDiscord: req.userInfos,
		userSteam: req.session?.passport?.user || req.userInfos.steam,
		translate: req.translate,
		repoVersion: config.version,
		currentURL: `${config.dashboard.baseURL}/${req.originalUrl}`
	});
});

module.exports = router;