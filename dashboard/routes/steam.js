const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router();

router.get("/", CheckAuth, async function (req, res) {
	res.render("steam", {
		userRoles: await req.client.findOrCreateUser({ id: req.user.id }),
		c: req.client,
		role: await req.client.getRoles(req.session.user.id),
		ownerID: req.client.config.owner.id,
		playerAmount: await req.client.getPlayersLength(),
		serverID: req.client.config.serverID,
		userDiscord: req.session.user,
		userSteam: req.session?.passport?.user || req.userInfos.steam,
		translate: req.translate,
		repoVersion: req.client.config.version,
		currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
	});
});

module.exports = router;
