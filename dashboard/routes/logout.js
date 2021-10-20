const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router();

// Gets login page
router.get("/", CheckAuth, async function(req, res) {
	// Set user's status to false
	const user = await req.client.users.fetch(req.session.user.id);
	const userDB = await req.client.findOrCreateUser({ id: user.id });
	// Set active status to false
	if(userDB.isOnline){
		userDB.isOnline = false;
	}
	await userDB.save();
	// Delete session
	await req.logout();
	await req.session.destroy();
	res.redirect("/");
});

module.exports = router;