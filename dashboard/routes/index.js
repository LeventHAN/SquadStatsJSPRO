const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	utils = require("../utils")
	config = require("../../config");


router.get("/", async(req, res) => {
	return res.redirect("/index");
});

router.get("/index", async(req, res) => {
	if(req.isAuthenticated()){
		return res.render("index", {
			role: await req.client.getRoles(req.session.user.id),
			latestTPS: await utils.getTPS(req.client),
			ownerID: config.owner.id,
			serverID: config.serverID,
			userDiscord: req.userInfos,
			userSteam: req.session?.passport?.user || req.userInfos.steam,
			translate: req.translate,
			repoVersion: config.version,
			currentURL: `${config.dashboard.baseURL}/${req.originalUrl}` 
		});
	}
	return res.render("index", {
		ownerID: config.owner.id,
		serverID: config.serverID,
		userDiscord: null,
		userSteam: null,
		translate: req.translate,
		repoVersion: config.version,
		currentURL: `${config.dashboard.baseURL}/${req.originalUrl}` 
	});
});

router.get("/selector", CheckAuth, async(req,res) => {
	const canSeeArray = await req.client.getAllCanSee();
	res.render("selector", {
		latesTPS: await utils.getTPS(req),
		playerAmount: await req.client.getPlayersLength(),
		role: await req.client.getRoles(req.session.user.id),
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
