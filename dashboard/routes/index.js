const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	version = require("../../package.json").version



router.get("/", CheckAuth, async (req, res) => {
	res.redirect("/selector");
});

router.get("/selector", CheckAuth, async(req, res) => {
	res.render("selector", {
		user: req.userInfos,
		translate: req.translate,
		repoVersion: version,
		currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`
	});
});

module.exports = router;