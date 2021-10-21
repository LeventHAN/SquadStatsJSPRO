const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	config = require("../../config");



router.get("/", CheckAuth, async(req,res) => {
	const userRole = await req.client.getRoles(req.session.user.id);

	res.render("logs", {
		ownerID: config.owner.id,
		role: userRole,
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