<div align="center">

<img src="https://i.imgur.com/QCxOSK5.png" alt="Logo" width="500"/>

#### SquadStatsJS PRO

[![GitHub contributors](https://img.shields.io/github/contributors/11TStudio/SquadStatsJSPRO.svg?style=flat-square)](https://github.com/11TStudio/SquadStatsJSPRO/graphs/contributors)
[![GitHub release](https://img.shields.io/github/license/11TStudio/SquadStatsJSPRO.svg?style=flat-square)](https://github.com/11TStudio/SquadStatsJSPRO/blob/master/LICENSE)

<br>

[![GitHub issues](https://img.shields.io/github/issues/11TStudio/SquadStatsJSPRO.svg?style=flat-square)](https://github.com/11TStudio/SquadStatsJSPRO/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/11TStudio/SquadStatsJSPRO.svg?style=flat-square)](https://github.com/11TStudio/SquadStatsJSPRO/pulls)
[![GitHub issues](https://img.shields.io/github/stars/11TStudio/SquadStatsJSPRO.svg?style=flat-square)](https://github.com/11TStudio/SquadStatsJSPRO/stargazers)

<br><br>

</div>

## About

An advanced version of SquadStatJS (tracking your squad stats) with advanced discord commands to manage your discord server.
Next to squad tracking it uses (some of) Atlanta's basic features/commands to help admins moderate their servers.

## Using SquadStatsJS PRO

The general usage can be found on the help command.

**Configuring the Squad DB Connection**
Before doing anything, you/the owner of the server, should first configurate the squad DB connection via `{prefix}add-sq` and read the embed message.
<br>This will also create KD roles. (Which will be linked to the users once they run the stat command; `{prefix}profile <steam64ID>`)

**Checking stats**
An user should first link his steam64ID (17 digits long steam identifier) with his discord account.
<br>This is simple as doing `{prefix}profile <steamID>`. Once done, his steamID will be linked with his discord profile and all data will be saved to the mongodb.
<br>After linking the user can just use `{prefix}profile` and his stats will be shown (updated every hour)

**Unlinking a steamUID from yourself**
If a player did missconfigure their profile, they can run: `{prefix}profile re-link`.
<br>This will let users make another link by running `{prefix}profile <steam64ID>`

**Important: Experience will be avaible once SquadJS has it, it is in the PR so soon.**

### Prerequisites

- Git
- MongoDB ([Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#download-the-installer) || [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/))
  - Just download and install it. No need to configure anything. One time install and forget about it.
- [Node.js](https://nodejs.org/en/) (14.X) - [Download](https://nodejs.org/en/)
- NPM

### Postrequisites

- Once you have a working bot, you should join [this emoji discord server](https://discord.gg/NPkySYKMkN) to obtain the emojis! (On join you will get how to proceed further, just do what the welcome messages mentions.)

### Installation

1. Clone the repository via your terminal/cmd: `git clone https://github.com/11TStudio/SquadStatsJSPRO`
2. Configure the `config.example.js` file. And when done SAVE and delete the .example. (At the end the file should look like: `config.js`)
3. Run `npm install` via the terminal.
4. Start your bot: `node index.js&`. (**I recommend you to use [pm2](https://pm2.keymetrics.io)**)
5. Star this repo if you liked!

### Configuring - SquadStatsJS PRO

SquadStatsJS PRO can be configured via .js file which by default is called `config.example.js`

The config file needs to be called `config.js` at the end and a example can be found below:

```js
module.exports = {
	/* The token of your Discord Bot */
	token: "XXXXXXXXXXX",
	/* For the support server */
	support: {
		id: "XXXXXXXXXXX", // The ID of the support server
		logs: "XXXXXXXXXXX", // And the ID of the logs channel of your server (new servers for example)
	},
	/* Dashboard configuration */
	dashboard: {
		enabled: false, // whether the dashboard is enabled or not
		secret: "XXXXXXXXXXX", // Your discord client secret
		baseURL: "https://localhost", // The base URl of the dashboard
		logs: "XXXXXXXXXXX", // The channel ID of logs
		port: 8080, // Dashboard port
		expressSessionPassword: "XXXXXXXXXXX", // Express session password (it can be what you want)
		failureURL: "https://l-event.studio", // url on which users will be redirected if they click the cancel button (discord authentication)
	},
	mongoDB: "mongodb://localhost:27017/SquadStatJSv3", // The URl of the mongodb database
	prefix: "!", // The default prefix for the bot
	/* For the embeds (embeded messages) */
	embed: {
		color: "#0091fc", // The default color for the embeds
		footer: "LeventHAN | l-event.studio", // And the default footer for the embeds
	},
	/* Bot's owner informations */
	owner: {
		id: "152644814146371584", // The ID of the bot's owner
		name: "LeventHAN#0001", // And the name of the bot's owner
	},
	/* DBL votes webhook (optional) */
	votes: {
		port: 5000, // The port for the server
		password: "XXXXXXXXXXX", // The webhook auth that you have defined on discordbots.org
		channel: "XXXXXXXXXXX", // The ID of the channel that in you want the votes logs
	},
	/* The API keys that are required for certain commands */
	apiKeys: {
		// DBL: https://discordbots.org/api/docs#mybots
		dbl: "",
		// SENTRY: https://sentry.io (this is not required and not recommended - you can delete the field)
		sentryDSN: "",
	},
	/* The others utils links */
	others: {
		github: "https://github.com/11TStudio", // Founder's github account
		donate: "https://l-event.studio", // Donate link
	},
	/* The Bot status */
	status: [
		{
			name: "SquadStatJSv3 servs on {serversCount} servers",
			type: "LISTENING",
		},
		{
			name: "WebSite: l-event.studio",
			type: "PLAYING",
		},
	],
};
```

## Commands and Examples

<details>
      <summary>help</summary>
      <h2>Help Embed</h2>
      <p>Shows all commands with more info when used as following: `!help <command-name>`</p>
      <h3>Example image</h3>
       <div align="center">
       <img src="https://i.imgur.com/ZCCJV5H.png" alt="Example !profile"/>
       </div>
</details>

<details>
      <summary>profile</summary>
      <h2>Search for players statistics</h2>
      <p>The <code>profile</code> command will show the player stats.</p>
      <h3>Example after linking your steamUID</h3>
       <div align="center">
       <img src="https://i.imgur.com/pSxuO8G.png" alt="Example !profile"/>
       </div>
</details>

## Credits

- @[AtlantaBot](https://github.com/Androz2091/AtlantaBot) for the amazing bot, used the core base.
- [SquadJS](https://github.com/Thomas-Smyth/SquadJS) - The reason this bot is made.
- My mom for feeding me while I was coding.

## License

```
MIT License

Copyright (c) 2021 11T Studio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```
