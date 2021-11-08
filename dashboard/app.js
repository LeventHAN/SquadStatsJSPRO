const version = require("../package.json").version,
	cors = require("cors"),
	utils = require("./utils"),
	authRoutes = require("./auth/auth"),
	CheckAuth = require("./auth/CheckAuth"),
	passport = require("passport"),
	SteamStrategy = require("./auth/SteamAuth"),
	rateLimit = require("express-rate-limit");

module.exports.load = async (client) => {
	/* Init express app */
	const limiter = rateLimit({
		windowMs: 1000,
		max: 10, // limit each IP to 6 requests per windowMs (1 second)
		message: "RateLimit reached! Please try again.",
	});
	const express = require("express"),
		session = require("express-session"),
		path = require("path"),
		app = express(),
		server = require("http").createServer(app),
		io = require("socket.io")(server, {
			secure: true,
			origins: "*:*",
			transports: ["websocket", "polling"],
		});

	/* Routers */
	const mainRouter = require("./routes/index"),
		playersRouter = require("./routes/players"),
		profileRouter = require("./routes/profile"),
		dashboardRouter = require("./routes/dashboard"),
		discordAPIRouter = require("./routes/discord"),
		apiRouter = require("./routes/api"),
		logoutRouter = require("./routes/logout"),
		banlistRouter = require("./routes/banlist"),
		settingsRouter = require("./routes/settings"),
		rolesRouter = require("./routes/roles"),
		steamRouter = require("./routes/steam"),
		guildManagerRouter = require("./routes/guild-manager"),
		logsRouter = require("./routes/logs"),
		mapRotationRouter = require("./routes/mapRotation.js");

	const eventsToBroadcast = [
		"CHAT_MESSAGE",
		"POSSESSED_ADMIN_CAMERA",
		"UNPOSSESSED_ADMIN_CAMERA",
		"RCON_ERROR",
		"ADMIN_BROADCAST",
		"DEPLOYABLE_DAMAGED",
		"NEW_GAME",
		"PLAYER_CONNECTED",
		"PLAYER_DISCONNECTED",
		"PLAYER_DAMAGED",
		"PLAYER_WOUNDED",
		"PLAYER_DIED",
		"PLAYER_REVIVED",
		"TEAMKILL",
		"PLAYER_POSSESS",
		"PLAYER_UNPOSSESS",
		"TICK_RATE",
		"PLAYER_TEAM_CHANGE",
		"PLAYER_SQUAD_CHANGE",
		"UPDATED_PLAYER_INFORMATION",
		"UPDATED_LAYER_INFORMATION",
		"UPDATED_A2S_INFORMATION",
		"PLAYER_AUTO_KICKED",
		"PLAYER_WARNED",
		"PLAYER_KICKED",
		"PLAYER_BANNED",
		"SQUAD_CREATED",
	];

	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function (obj, done) {
		done(null, obj);
	});

	passport.use(
		new SteamStrategy(
			{
				returnURL: client.config.dashboard.baseURL + "/auth/steam/return",
				realm: client.config.dashboard.baseURL,
				apiKey: client.config.apiKeys.steam,
			},
			function (identifier, profile, done) {
				process.nextTick(function () {
					profile.identifier = identifier;
					return done(null, profile);
				});
			}
		)
	);

	if (client.socket) {
		io.use(async (socket, next) => {
			if (!socket.handshake.auth) return next(new Error("No token provided."));
			const user = await client.fetchUserByToken(socket.handshake.auth.token);
			if (!user) {
				console.log(
					"Someone did try to login with wrong credintials.",
					socket.handshake
				);
				return next(new Error("Invalid token."));
			}
			socket.user = user;
			next();
		});

		io.on("connection", async (socket) => {
			for (const eventToBroadcast of eventsToBroadcast) {
				client.socket.on(eventToBroadcast, (...args) => {
					socket.emit(eventToBroadcast, ...args);
				});
			}
			socket.onAny(async (eventName, ...rawArgs) => {
				const args = rawArgs.slice(0, rawArgs.length - 1);
				const callback = rawArgs[rawArgs.length - 1];
				await client.socket.emit(`${eventName}`, ...args, async (response) => {
					return callback(response);
				});
			});
		});
	}

	/* App configuration */
	app
		.use(express.json())
		.use(express.urlencoded({ extended: true }))
		.use(
			cors({
				origin: "*",
				optionsSuccessStatus: 200,
			})
		)
		// Set the engine to html (for ejs template)
		.engine("html", require("ejs").renderFile)
		.set("view engine", "ejs")
		// Set the css and js folder to ./public
		.use(express.static(path.join(__dirname, "/public")))
		// Set the ejs templates to ./views
		.set("views", path.join(__dirname, "/views"))
		// Set the dashboard port
		.set("port", client.config.dashboard.port)
		// Set the express session password and configuration
		.use(
			session({
				secret: client.config.dashboard.expressSessionPassword,
				resave: false,
				saveUninitialized: false,
			})
		)
		.use(passport.initialize())
		.use(passport.session())
		// Multi languages support
		.use(async function (req, res, next) {
			req.user = req.session.user;
			req.client = client;
			req.locale = "en-US";
			if (req.user && req.url !== "/") {
				req.userInfos = await utils.fetchUser(req.user, req.client);
			}
			if (req.user) {
				req.translate = req.client.translations.get(req.locale);
				req.printDate = (date) => req.client.printDate(date, null, req.locale);
			}
			next();
		})
		.use(limiter)
		.use("/squad-api", apiRouter)
		.use("/api", discordAPIRouter)
		.use("/logout", logoutRouter)
		.use("/manage", guildManagerRouter)
		.use("/settings", settingsRouter)
		.use("/roles", rolesRouter)
		.use("/steam", steamRouter)
		.use("/bans", banlistRouter)
		.use("/", mainRouter)
		.use("/players", playersRouter)
		.use("/profile", profileRouter)
		.use("/dashboard", dashboardRouter)
		.use("/auth", authRoutes)
		.use("/rotation", mapRotationRouter)
		.use("/logs", logsRouter)
		.use(CheckAuth, function (req, res) {
			res.status(404).render("404", {
				userDiscord: req.userInfos,
				translate: req.translate,
				currentURL: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
			});
		})
		.use(CheckAuth, function (err, req, res) {
			if (!req.user) return res.redirect("/");
			res.status(500).render("500", {
				userDiscord: req.userInfos,
				translate: req.translate,
				currentURL: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
			});
		});

	// Listen express server
	app.listen(app.get("port"), () => {
		client.logger.log(
			`SquadStatsJS ${version} Dashboard is listening on port ${app.get(
				"port"
			)}`,
			"READY"
		);
	});
	// Listen websocket server
	server.listen(client.config.socketIO.localPort, () => {
		client.logger.log(
			`SquadStatsJS ${version} SocketIO is listening on port ${client.config.socketIO.localPort}`,
			"READY"
		);
	});
};
