const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	utils = require("../utils"),
	config = require("../../config");

router.get("/", CheckAuth, async function(req, res){
	res.render("steam", {
		role: await req.client.getRoles(req.session.user.id),
		ownerID: config.owner.id,
		playerAmount: await req.client.getPlayersLength(),
		serverID: config.serverID,
		userDiscord: req.session.user,
		userSteam: req.session?.passport?.user || req.userInfos.steam,
		translate: req.translate,
		repoVersion: config.version,
		currentURL: `${config.dashboard.baseURL}/${req.originalUrl}`
	});
});

module.exports = router;