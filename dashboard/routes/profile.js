const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	config = require("../../config");



router.get("/", CheckAuth, async(req,res) => {
	const canSeeArray = await req.client.getAllCanSee();
	const userRole = await req.client.getRoles(req.session.user.id);

	res.render("profile", {
		ownerID: config.owner.id,
		role: userRole,
		allCanSee: canSeeArray,
		serverID: config.serverID,
		userDiscord: req.userInfos,
		playerAmount: await req.client.getPlayersLength(),
		userSteam: req.session?.passport?.user || req.userInfos.steam,
		translate: req.translate,
		repoVersion: config.version,
		currentURL: `${config.dashboard.baseURL}/${req.originalUrl}`,
		config: config
	});

});



module.exports = router;