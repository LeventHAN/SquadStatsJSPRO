const axios = require("axios");

/** Check players squad play time.
 *
 * @param {string} steamID - The players steam 64 ID.
 * @param {integer} prefTime - The time we prefer to have.
 * @returns {boolean} True/False if not private, if private {string} "private".
 */
const checkSquadRookie = async ({ steamID, prefTime }) => {
	const steamKey = this.client.config.apiKeys.steam;
	const appID = 393380;
	let res = {
		rookie: null,
		private: null,
		playHours: 0,
	};
	const response = await axios.get(
		"http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" +
			steamKey +
			"&steamid=" +
			steamID +
			"&format=json"
	);

	if (Object.keys(response.data.response).length === 0) {
		console.log(response.data.response);
		return (res = {
			rookie: false,
			private: true,
			playHours: 0,
		});
	} else {
		response.data.response.games.forEach((game) => {
			if (game.appid === appID) {
				console.log(game);
				if (game.playtime_forever < prefTime) {
					// playtime in minutes | integer
					return (res = {
						rookie: true,
						private: false,
						playHours: game.playtime_forever,
					});
				} else {
					return (res = {
						rookie: false,
						private: false,
						playHours: game.playtime_forever,
					});
				}
			}
		});
	}
	return res;
};

/** Check current layer.
 *
 * @returns {string} The layer name.
 */
const checkCurrentLayer = async () => {
	const response = await axios.get(
		this.client.config.dashboard.baseURL + "/v2/getServerInfo"
	);
	return response.data.data.attributes;
};

module.exports = {
	checkSquadRookie,
	checkCurrentLayer,
};
