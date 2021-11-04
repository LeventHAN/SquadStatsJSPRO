var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	CheckAuth = require("./CheckAuth");

// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steamcommunity.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
router.get("/steam", async (req, res) => {
	const hasLinked = await req.client.linkedSteamAccount(req.session.user.id);
	if (!hasLinked) return res.redirect("login");
	return res.redirect("/index");
});

// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steamcommunity.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
router.get(
	"/login",
	passport.authenticate("steam", { failureRedirect: "/" }),
	function (req, res) {
		res.redirect("/");
	}
);

// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get(
	"/steam/return",
	// Issue #37 - Workaround for Express router module stripping the full url, causing assertion to fail
	function (req, res, next) {
		req.url = req.originalUrl;
		next();
	},
	passport.authenticate("steam", { failureRedirect: "/" }),
	async (req, res) => {
		const redirectURL = req.client.states[req.query.state] || "/index";
		await req.client.linkSteamAccount(
			req.session.user.id,
			req.session?.passport?.user || req.userInfos.steam
		);
		return res.redirect(redirectURL);
	}
);

router.post("/steam/delete", CheckAuth, async (req, res) => {
	if (!req.body.steamid)
		return res.json({
			status: "nok",
			message: "You are doing something wrong.",
		});

	const userFromToken = await req.client.fetchUserByToken(req.body.apiToken);
	if (!userFromToken)
		return res.json({
			status: "nok",
			message: "You are doing something wrong.",
		});
	const canUser = await req.client.whoCan("unlinkSteam");

	// check if array userFromToken.roles has any of the roles in the array canUser
	if (!canUser.some((role) => userFromToken.roles.includes(role)))
		return res.json({
			status: "nok",
			message: "You are doing something wrong.",
		});

	const userSteamAccount = req.client.linkedSteamAccount(req.body.steamid);
	if (!userSteamAccount)
		return res.json({ status: "nok", message: "There is no account linked." });
	// check if userSteamAccount.id is not the same as req.body.steamid and that the userFromToken.roles has "owner" or "admin" values in it now it is array
	if (
		(userSteamAccount.id !== req.body.steamid &&
			!userFromToken.roles.includes("owner")) ||
		!userFromToken.roles.includes("admin")
	)
		return res.json({
			status: "nok",
			message: "You are doing something wrong.",
		});
	const steamAccount = {
		steam64id: req.session?.passport?.user?.id,
		displayName: req.session?.passport?.user?.displayName,
		identifier: req.session?.passport?.user?.identifier,
	};
	const discordAccount = {
		id: req.session.user.id,
		username: req.session?.user?.username,
		discriminator: req.session?.user?.discriminator,
	};
	const moreDetails = {
		unlinkedAccountID: req.body.steamid,
	};
	const userToUpdate = await req.client.findOrCreateUser({
		id: userFromToken.id,
	});
	userToUpdate.steam = null;
	userToUpdate.squad.tracking = false;
	await userToUpdate.markModified("steam");
	await userToUpdate.markModified("squad");
	await userToUpdate.save();
	const log = await req.client.addLog({
		action: "USER_UNLINK_STEAM",
		author: { discord: discordAccount, steam: steamAccount },
		ip: req.session.user.lastIp,
		details: { details: moreDetails },
	});
	await log.save();
	return res.json({ status: "ok" });
});

module.exports = router;
