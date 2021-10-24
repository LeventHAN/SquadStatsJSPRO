const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	config = require("../../config");



router.get("/", CheckAuth, async(req,res) => {
	const canSeeArray = await req.client.getAllCanSee();
	const userRole = await req.client.getRoles(req.session.user.id);
	const canSee = await req.client.canAccess("logs", req.userInfos.id);
	if(!canSee)
		return res.json({status: "nok", message: "No access!"});

	res.render("logs", {
		ownerID: config.owner.id,
		playerAmount: await req.client.getPlayersLength(),
		role: userRole,
		allCanSee: canSeeArray,
		serverID: config.serverID,
		userDiscord: req.userInfos,
		userSteam: req.session?.passport?.user || req.userInfos.steam,
		translate: req.translate,
		repoVersion: config.version,
		currentURL: `${config.dashboard.baseURL}/${req.originalUrl}`,
		config: config,
		logs: await req.client.getAuditLogs()
	});

});



module.exports = router;