module.exports = async (req, res, next) => {
	// Get the ip
	const regIp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
	const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress).match(regIp);
	if(req.body.apiToken){
		const user = await req.client.fetchUserByToken(req.body.apiToken);
		if(!user) return res.status(401).json({response: "Unauthorized."});
		req.session.user = user;
		if(ip) {
			await req.client.apiSaveIP(user.id, ip[0]);
			req.session.user.lastIp = ip[0];
		}
		return next();
	}

	if ((!req.session?.passport && !req.userInfos?.steam) && req.session.user) {
		return res.redirect("/auth/steam");
		
	} else if ((req.session?.passport || req.userInfos?.steam) && req.session.user) {
		if(ip) {
			req.session.user.lastIp = ip[0];
		}
		// Link the steam account with the user
		await req.client.linkSteamAccount(req.session.user.id, req.session?.passport?.user || req.userInfos.steam);
		return next();
	}
	let redirectURL =
		req.originalUrl.includes("login") || req.originalUrl === "/"
			? "/index"
			: req.originalUrl;
	const state = Math.random().toString(36).substring(5);
	if(redirectURL === "/login" || redirectURL === "/logout") redirectURL = "/index";
	req.client.states[state] = redirectURL;
	return res.redirect(`/api/login?state=${state}`);
	
};
