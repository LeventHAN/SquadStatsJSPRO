const express = require("express"),
	utils = require("../utils"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	version = require("../../package.json").version;

    router.get("/", CheckAuth, async (req, res) => {
        const allCanSeeRoles = await req.client.getAllCanSee();
        const canSee = await req.client.canAccess("clans", req.userInfos.id);
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
            serverID: req.client.config.serverID,
            clans: await req.client.getAllClans(),
            userClan: await req.client.getUsersClan(req.userInfos.steam.steamid),
            userDiscord: req.userInfos,
            userSteam: req.session?.passport?.user || req.userInfos.steam,
            translate: req.translate,
            repoVersion: req.client.config.version,
            currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
            usage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
            config: req.client.config,
        })
    });

    router.get("/:clanName", CheckAuth, async (req, res, next) => {
        const allCanSeeRoles = await req.client.getAllCanSee(); 
        const clan = await req.params.clanName;
        const clanID = await req.client.findClanbyName(clan);
        if (
            !clan ||
            await req.client.getUsersClan(req.userInfos.steam.steamid) != clanID
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
            serverID: req.client.config.serverID,
            clan: await req.client.getClan(clanID),
            clanMembers: await req.client.getClansMember(clanID),
            clanWhiteLimit: await req.client.getClanWhiteLimit(clanID),
            clanWhitelisted: await req.client.getClanWhitelisted(clanID),
            clanApplications: await req.client.getClanApps(clanID),
            userClan: await req.client.findClanbyID(clanID),
            userDiscord: req.userInfos,
            userSteam: req.session?.passport?.user || req.userInfos.steam,
            translate: req.translate,
            repoVersion: req.client.config.version,
            currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
            usage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
            config: req.client.config,
        })
    });

module.exports = router;
