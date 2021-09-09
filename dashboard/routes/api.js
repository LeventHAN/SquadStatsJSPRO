const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	utils = require("../utils"),
	config = require("../../config");

router.get("/", CheckAuth, async(req, res) => {
	return res.json("Welcome to the SquadStatsJSPRO api!");
});

/**
 * @api {get} /squad-api/getServerInfo Request server info
 * @apiName getServerInfo
 * @apiGroup Server
 *
 * @apiParam (Login) {String} apiToken Your api token
 *
 * @apiSuccess {Object} data Server information.
 * @apiSuccess {Array} included Included.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 * {
    "data": {
        "type": "server",
        "id": "10281405",
        "attributes": {
            "id": "10281405",
            "name": "✪✪✪ GERMAN SQUAD #1 ✪✪✪ @GER-SQUAD.community",
            "address": null,
            "ip": "194.26.183.182",
            "port": 27015,
            "players": 99,
            "maxPlayers": 100,
            "rank": 20,
            "location": [
                8.10812,
                50.518749
            ],
            "status": "online",
            "details": {
                "map": "Yehorivka_RAAS_v1",
                "gameMode": "RAAS",
                "version": "V2.11.0.25.64014",
                "secure": 0,
                "licensedServer": true,
                "licenseId": "809942",
                "numPubConn": 99,
                "numPrivConn": 1,
                "numOpenPrivConn": 1,
                "modded": false,
                "serverSteamId": "90150709607385097"
            },
            "private": false,
            "createdAt": "2021-02-19T13:52:06.986Z",
            "updatedAt": "2021-08-28T18:41:12.307Z",
            "portQuery": 27016,
            "country": "DE",
            "queryStatus": "valid"
        },
        "relationships": {
            "game": {
                "data": {
                    "type": "game",
                    "id": "squad"
                }
            }
        }
    },
    "included": []
}
 */
router.get("/getServerInfo", CheckAuth, async(req, res) => {
	const response = await utils.getBMStats(config.squadBattleMetricsID);
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

	const log = await req.client.addLog({ action: "GET_SERVER_INFO", author: {discord: discordAccount, steam: steamAccount}, ip: null, details: {details: req.session.user}});
	await log.save();
	return res.json(response);
});
 
/**
 * @api {get} /squad-api/getPlayersList Request current active players
 * @apiName getPlayersList
 * @apiGroup Server
 *
 * @apiParam (Login) {String} apiToken Your api token
 *
 * @apiSuccess {Object[]} data Players info.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *   {
 *    {
 *      "playerID": "62",
 *      "steamID": "76561197988878542",
 *      "name": "!Flöt3nFranZ!",
 *      "teamID": "1",
 *      "squadID": "2",
 *      "squad": {
 *          "squadID": "2",
 *          "squadName": "Squad 2",
 *          "size": "9",
 *          "locked": "False",
 *          "teamID": "1",
 *          "teamName": "British Armed Forces"
 *      },
 *      "suffix": "!Flöt3nFranZ!",
 *      "possessClassname": "BP_Brit_Util_Truck_Logi"
 *   },
 * 	 {...},
 *    ...
 * }
 */
router.get("/getPlayersList", CheckAuth, async(req, res) => {
	req.client.socket.emit("players", async (data) => {
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
		const log = await req.client.addLog({ action: "GET_PLAYERS_LIST", author: {discord: discordAccount, steam: steamAccount}, ip: req.session.user.lastIp, details: {details: null}});
		await log.save();
		return res.json(data);
	});
});


/**
 * @api {get} /squad-api/nextMap Request next layer
 * @apiName nextMap
 * @apiGroup Server
 *
 * @apiParam (Login) {String} apiToken Your api token
 *
 * @apiSuccess {String} level Map name.
 * @apiSuccess {String} layer Layer name.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
	{
		"level": "Narva",
		"layer": "Narva AAS v2"
	}
 */
router.get("/nextMap", CheckAuth, async(req, res) => {
	req.client.socket.emit("rcon.getNextMap", async (data) => {
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
	
		const log = await req.client.addLog({ action: "GET_NEXT_MAP", author: {discord: discordAccount, steam: steamAccount}, ip: req.session.user.lastIp, details: {details: null}});
		await log.save();
		return res.json(data);
	});
});

/**
 * @api {get} /squad-api/currentMap Request current layer
 * @apiName currentMap
 * @apiGroup Server
 *
 * @apiParam (Login) {String} apiToken Your api token
 *
 * @apiSuccess {String} level Map name.
 * @apiSuccess {String} layer Layer name.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
	{
		"level": "Narva",
		"layer": "Narva AAS v2"
	}
 */
router.get("/currentMap", CheckAuth, async(req, res) => {
	req.client.socket.emit("rcon.getCurrentMap", async (data) => {
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
		const log = await req.client.addLog({ action: "GET_CURRENT_MAP", author: {discord: discordAccount, steam: steamAccount}, ip: req.session.user.lastIp, details: {details: null}});
		await log.save();
		return res.json(data);
	});
});

/**
 * @api {post} /squad-api/broadcast Send broadcast to sever
 * @apiName broadcast
 * @apiGroup Admin
 *
 * @apiParam (Login) {String} apiToken Your api token
 *
 * @apiSuccess {String} content The message to be broadcasted to the server.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
	{
		"status": "ok",
		"message": "Broadcast sent!"
	}
 * @apiErrorExample {json} Error-Response:
 * {
		"status": "nok",
		"message": "You are doing something wrong."
	}
 */
router.post("/broadcast",  CheckAuth, async function(req, res){
	if(!req.body.content) return res.json({ status: "nok", message: "You are doing something wrong." });
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
		broadcast: req.body.content,
	};
	// { action: action, author: {discord: discordDetails, steam: steamDetails}, details: {details: moreDetails} }
	const log = await req.client.addLog({ action: "ADMIN_BROADCAST", author: {discord: discordAccount, steam: steamAccount}, ip: req.session.user.lastIp, details: {details: moreDetails}});
	await log.save();
	res.json({status: "ok", message: "Broadcast sent!"});
});

/**
 * @api {post} /squad-api/kick Kick players
 * @apiName kick
 * @apiGroup Admin
 *
 * @apiParam (Login) {String} apiToken Your api token
 * @apiParam {String} steamID The steamID of the player to be kicked.
 * @apiParam {String} reason The reason of the kick.
 *
 * @apiSuccess {String} content The message to be broadcasted to the server.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
	{
		"status": "ok",
		"message": "Player kicked!"
	}
 * @apiErrorExample {json} Error-Response:
 * {
		"status": "nok",
		"message": "You are doing something wrong."
	}
 */
router.post("/kick", CheckAuth, async function(req, res){
	if(!req.body.steamUID || !req.body.reason) return res.json({ status: "nok", message: "You are doing something wrong." });
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
		player: req.body.steamUID,
		reason: req.body.reason
	};

	// { action: action, author: {discord: discordDetails, steam: steamDetails}, details: {details: moreDetails} }
	const socket = req.client.socket;
	// debug
	console.log("rcon.kick", moreDetails.player, moreDetails.reason);
	socket.emit("rcon.kick", moreDetails.player, moreDetails.reason, async () => {
		const log = await req.client.addLog({ action: "PLAYER_KICKED", author: {discord: discordAccount, steam: steamAccount}, ip: req.session.user.lastIp, details: {details: moreDetails}});
		await log.save();
		return res.json({status: "ok", message: "Player kicked!"});
	});
});

/**
 * @api {post} /squad-api/warn Warn players
 * @apiName warn
 * @apiGroup Admin
 *
 * @apiParam (Login) {String} apiToken Your api token
 * @apiParam {String} steamID The steamID of the player to be warned.
 * @apiParam {String} reason The warning message.
 *
 * @apiSuccess {String} content The message to be broadcasted to the server.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
	{
		"status": "ok",
		"message": "Player warned!"
	}
 * @apiErrorExample {json} Error-Response:
 * {
		"status": "nok",
		"message": "You are doing something wrong."
	}
 */
router.post("/warn", CheckAuth, async function(req, res){
	if(!req.body.steamUID || !req.body.reason) return res.json({ status: "nok", message: "You are doing something wrong." });
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
		player: req.body.steamUID,
		reason: req.body.reason
	};

	// { action: action, author: {discord: discordDetails, steam: steamDetails}, details: {details: moreDetails} }
	const socket = req.client.socket;
	// debug
	console.log("rcon.warn", moreDetails.player, moreDetails.reason);
	socket.emit("rcon.warn", moreDetails.player, moreDetails.reason, async () => {
		const log = await req.client.addLog({ action: "PLAYER_WARNED", author: {discord: discordAccount, steam: steamAccount}, ip: req.session.user.lastIp, details: {details: moreDetails}});
		await log.save();
		return res.json({status: "ok", message: "Player warned!"});
	});
});

/**
 * @api {post} /squad-api/ban Ban players
 * @apiName ban
 * @apiGroup Admin
 *
 * @apiParam (Login) {String} apiToken Your api token
 * @apiParam {String} steamID The steamID of the player to be banned.
 * @apiParam {String} reason The reason of the ban.
 * @apiParam {String} duration The duration of the ban.
 *
 * @apiSuccess {String} content The message to be broadcasted to the server.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
	{
		"status": "ok",
		"message": "Player banned!"
	}
 * @apiErrorExample {json} Error-Response:
 * {
		"status": "nok",
		"message": "You are doing something wrong."
	}
 */
router.post("/ban", CheckAuth, async function(req, res){
	if(!req.body.steamUID || !req.body.reason || !req.body.duration) return res.json({ status: "nok", message: "You are doing something wrong." });
	
	// TODO: check if the duration is valid


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
		player: req.body.steamUID,
		reason: req.body.reason,
		duration: req.body.duration
	};

	// { action: action, author: {discord: discordDetails, steam: steamDetails}, details: {details: moreDetails} }
	const socket = req.client.socket;
	// debug
	console.log("rcon.ban", moreDetails.player, "1m", moreDetails.reason);
	socket.emit("rcon.ban", moreDetails.player, "1m", moreDetails.reason, async () => {
		const log = await req.client.addLog({ action: "PLAYER_BANNED", author: {discord: discordAccount, steam: steamAccount}, ip: req.session.user.lastIp, details: {details: moreDetails}});
		await log.save();
		return res.json({status: "ok", message: "Player banned!"});
	});
});

/**
 * @api {post} /squad-api/disbandSquad Disband squads
 * @apiName disbandSquad
 * @apiGroup Admin
 *
 * @apiParam (Login) {String} apiToken Your api token
 * @apiParam {String} squadID The squadID of the player's squad to be disband.
 * @apiParam {String} teamID The teamID (side 1 or 2) of the player's squad.
 *
 * @apiSuccess {String} content The message to be broadcasted to the server.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
	{
		"status": "ok",
		"message": "Squad is disband!"
	}
 * @apiErrorExample {json} Error-Response:
 * {
		"status": "nok",
		"message": "You are doing something wrong."
	}
 */
router.post("/disbandSquad", CheckAuth, async function(req, res){
	if(!req.body.squadID || !req.body.teamID) return res.json({ status: "nok", message: "You are doing something wrong." });
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
		teamID: req.body.teamID,
		squadID: req.body.squadID
	};

	// { action: action, author: {discord: discordDetails, steam: steamDetails}, details: {details: moreDetails} }
	const socket = req.client.socket;
	// debug:
	console.log("rcon.disbandSquad", moreDetails.teamID, moreDetails.squadID);
	socket.emit("rcon.disbandSquad", moreDetails.teamID, moreDetails.squadID, async () => {
		const log = await req.client.addLog({ action: "SQUAD_DISBAND", author: {discord: discordAccount, steam: steamAccount}, ip: req.session.user.lastIp, details: {details: moreDetails}});
		await log.save();
		return res.json({status: "ok", message: "Squad is disband!"});
	});
});

/**
 * @api {post} /squad-api/removeFromSquad Remove players from squad
 * @apiName removeFromSquad
 * @apiGroup Admin
 *
 * @apiParam (Login) {String} apiToken Your api token
 * @apiParam {String} steamID The steamID of the player to be kicked from squad (not from the game!).
 *
 * @apiSuccess {String} content The message to be broadcasted to the server.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
	{
		"status": "ok",
		"message": "Player removed from squad!"
	}
 * @apiErrorExample {json} Error-Response:
 * {
		"status": "nok",
		"message": "You are doing something wrong."
	}
 */
router.post("/removeFromSquad", CheckAuth, async function(req, res){
	if(!req.body.steamID) return res.json({ status: "nok", message: "You are doing something wrong." });
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
		steamUID: req.body.steamID
	};

	// { action: action, author: {discord: discordDetails, steam: steamDetails}, details: {details: moreDetails} }
	const socket = req.client.socket;
	// debug:
	console.log("rcon.removePlayerFromSquad", moreDetails.steamUID);
	socket.emit("rcon.removePlayerFromSquad", moreDetails.steamUID, async () => {
		const log = await req.client.addLog({ action: "KICK_PLAYER_FROM_SQUAD", author: {discord: discordAccount, steam: steamAccount}, ip: req.session.user.lastIp, details: {details: moreDetails}});
		await log.save();
		return res.json({status: "ok", message: "Player removed from squad!"});
	});
});

module.exports = router;