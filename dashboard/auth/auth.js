var express = require("express")
	, router = express.Router()
	, passport = require("passport")
	, CheckAuth = require("./CheckAuth");

// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steamcommunity.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
router.get("/steam", async(req, res) => {
	const hasLinked = await req.client.linkedSteamAccount(req.session.user.id);
	if(!hasLinked) return res.redirect("login");
	console.log("Is is already linked. Redirecting to /index.");
	return res.redirect("/index");
});


// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steamcommunity.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
router.get("/login",
	passport.authenticate("steam", { failureRedirect: "/" }),
	function(req, res) {
		res.redirect("/");
	});

// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get("/steam/return",
	// Issue #37 - Workaround for Express router module stripping the full url, causing assertion to fail 
	function(req, res, next) {
		req.url = req.originalUrl;
		next();
	}, 
	passport.authenticate("steam", { failureRedirect: "/" }),
	async (req, res) => {
		const redirectURL = req.client.states[req.query.state] || "/index";
		console.log("Redirecting to " + redirectURL);
		const needLinking = await req.client.linkedSteamAccount(req.session.user.id);
		if(needLinking) 
			await req.client.linkSteamAccount(req.session.user.id, req.session?.passport?.user || req.userInfos.steam);
		return res.redirect(redirectURL);
	}
);

router.post("/steam/delete", CheckAuth, async(req, res) => {
	if(!req.body.userID) return res.json({ status: "nok", message: "You are doing something wrong." });
	
	const userRole = await req.client.getRoles(req.session.user.id);

	const canUser = await req.client.whoCan("unlinkSteam");
	
	if(!canUser.some(role => userRole.includes(role)))
		return res.json({status: "nok2", message: "You are not allowed to do this."});



	// Check if req.body.userID is indeed the userID of the user requesting
	// to delete their linked Steam account.
	const userSteamAccount = req.client.linkedSteamAccount(req.body.userID);
	if(!userSteamAccount) return res.json({ status: "nok", message: "There is no account linked." });
	if(userSteamAccount.id !== req.body.userID && !userRole.includes("owner")) return res.json({ status: "nok", message: "You are not the owner of this account." });

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
		unlinkedAccountID: req.body.userID,
	};
	// { action: action, author: {discord: discordDetails, steam: steamDetails}, details: {details: moreDetails} }
	const log = await req.client.addLog({ action: "USER_UNLINK_STEAM", author: {discord: discordAccount, steam: steamAccount}, ip: req.session.user.lastIp, details: {details: moreDetails}});
	await log.save();
	res.redirect("/logout");
	return (await req.client.unlinkSteamAccount(req.body.userID) ? res.json({ status: "ok" }) : res.json({ status: "nok" }));
	
});


module.exports = router;