const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router();

router.get("/", CheckAuth, async (req, res) => {
	const allCanSeeRoles = await req.client.getAllCanSee();
	const allWhoCan = await req.client.getAllActionsWhoCan();
	const canSee = await req.client.canAccess("clans", req.userInfos.id);
	const user = await req.client.usersData.find({id: req.userInfos.id}).lean().exec();
	const clan = await req.client.getUsersClan(req.userInfos.steam.steamid);
	if (!canSee){
		return res.render("404", {
			userRoles: await req.client.getRoles(req.session.user.id),
			ownerID: req.client.config.owner.id,
			serverID: req.client.config.serverID,
			userDiscord: req.userInfos,
			translate: req.translate,
			currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
		});
	}
	return res.render("clans", {
		userRoles: await req.client.getRoles(req.session.user.id),
		playerAmount: await req.client.getPlayersLength(),
		c: req.client,
		allCanSee: allCanSeeRoles,
		allWhoCan: allWhoCan,
		serverID: req.client.config.serverID,
		clans: await req.client.getAllClans(),
		userClan: clan,
		userDiscord: req.userInfos,
		hasClan: user[0].whitelist.clan || false,
		upToDate: user,
		userSteam: req.session?.passport?.user || req.userInfos.steam,
		translate: req.translate,
		repoVersion: req.client.config.version,
		currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
		usage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
		config: req.client.config,
	})
});

router.get("/:clanName", CheckAuth, async (req, res) => {
	const allCanSeeRoles = await req.client.getAllCanSee(); 
	const allWhoCan = await req.client.getAllActionsWhoCan();
	const userClan = await req.client.getUsersClan(req.userInfos.steam.steamid);
	const clan = await req.params.clanName;
	const clanID = await req.client.findClanbyName(clan);
	const userClanObj = await req.client.findClanbyID(clanID);
	if (
		!clan ||
        userClan != clanID
	)
	{
		return res.render("404", {
			userRoles: await req.client.getRoles(req.session.user.id),
			ownerID: req.client.config.owner.id,
			serverID: req.client.config.serverID,
			userDiscord: req.userInfos,
			translate: req.translate,
			currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
		});
	}
	return res.render("clan", {
		userRoles: await req.client.getRoles(req.session.user.id),
		playerAmount: await req.client.getPlayersLength(),
		c: req.client,
		allCanSee: allCanSeeRoles,
		allWhoCan: allWhoCan,
		serverID: req.client.config.serverID,
		clan: await req.client.getClan(clanID),
		clanMembers: await req.client.getClansMember(clanID),
		clanWhiteLimit: await req.client.getClanWhiteLimit(clanID),
		clanWhitelisted: await req.client.getClanWhitelisted(clanID),
		clanApplications: await req.client.getClanApps(clanID),
		userClan: userClanObj,
		userDiscord: req.userInfos,
		userSteam: req.session?.passport?.user || req.userInfos.steam,
		translate: req.translate,
		repoVersion: req.client.config.version,
		currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
		usage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
		config: req.client.config,
	});
});

module.exports = router;
