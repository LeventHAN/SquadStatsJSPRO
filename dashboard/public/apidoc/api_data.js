define({ "api": [
  {
    "type": "post",
    "url": "/squad-api/ban",
    "title": "Ban players",
    "name": "ban",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Login": [
          {
            "group": "Login",
            "type": "String",
            "optional": false,
            "field": "apiToken",
            "description": "<p>Your api token</p>"
          }
        ],
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "steamID",
            "description": "<p>The steamID of the player to be banned.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>The reason of the ban.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "duration",
            "description": "<p>The duration of the ban.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the request.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n\t{\n\t\t\"status\": \"ok\",\n\t\t\"message\": \"Player banned!\"\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n\t\t\"status\": \"nok\",\n\t\t\"message\": \"You are doing something wrong.\"\n\t}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./dashboard/routes/api.js",
    "groupTitle": "Admin"
  },
  {
    "type": "post",
    "url": "/squad-api/broadcast",
    "title": "Send broadcast to sever",
    "name": "broadcast",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Login": [
          {
            "group": "Login",
            "type": "String",
            "optional": false,
            "field": "apiToken",
            "description": "<p>Your api token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the request.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n\t{\n\t\t\"status\": \"ok\",\n\t\t\"message\": \"Broadcast sent!\"\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n\t\t\"status\": \"nok\",\n\t\t\"message\": \"You are doing something wrong.\"\n\t}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./dashboard/routes/api.js",
    "groupTitle": "Admin"
  },
  {
    "type": "post",
    "url": "/squad-api/disbandSquad",
    "title": "Disband squads",
    "name": "disbandSquad",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Login": [
          {
            "group": "Login",
            "type": "String",
            "optional": false,
            "field": "apiToken",
            "description": "<p>Your api token</p>"
          }
        ],
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "squadID",
            "description": "<p>The squadID of the player's squad to be disband.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "teamID",
            "description": "<p>The teamID (side 1 or 2) of the player's squad.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the request.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n\t{\n\t\t\"status\": \"ok\",\n\t\t\"message\": \"Squad is disband!\"\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n\t\t\"status\": \"nok\",\n\t\t\"message\": \"You are doing something wrong.\"\n\t}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./dashboard/routes/api.js",
    "groupTitle": "Admin"
  },
  {
    "type": "post",
    "url": "/squad-api/kick",
    "title": "Kick players",
    "name": "kick",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Login": [
          {
            "group": "Login",
            "type": "String",
            "optional": false,
            "field": "apiToken",
            "description": "<p>Your api token</p>"
          }
        ],
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "steamID",
            "description": "<p>The steamID of the player to be kicked.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>The reason of the kick.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the request.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n\t{\n\t\t\"status\": \"ok\",\n\t\t\"message\": \"Player kicked!\"\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n\t\t\"status\": \"nok\",\n\t\t\"message\": \"You are doing something wrong.\"\n\t}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./dashboard/routes/api.js",
    "groupTitle": "Admin"
  },
  {
    "type": "post",
    "url": "/squad-api/removeFromSquad",
    "title": "Remove players from squad",
    "name": "removeFromSquad",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Login": [
          {
            "group": "Login",
            "type": "String",
            "optional": false,
            "field": "apiToken",
            "description": "<p>Your api token</p>"
          }
        ],
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "steamID",
            "description": "<p>The steamID of the player to be kicked from squad (not from the game!).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the request.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n\t{\n\t\t\"status\": \"ok\",\n\t\t\"message\": \"Player removed from squad!\"\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n\t\t\"status\": \"nok\",\n\t\t\"message\": \"You are doing something wrong.\"\n\t}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./dashboard/routes/api.js",
    "groupTitle": "Admin"
  },
  {
    "type": "post",
    "url": "/squad-api/warn",
    "title": "Warn players",
    "name": "warn",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Login": [
          {
            "group": "Login",
            "type": "String",
            "optional": false,
            "field": "apiToken",
            "description": "<p>Your api token</p>"
          }
        ],
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "steamID",
            "description": "<p>The steamID of the player to be warned.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>The warning message.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the request.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n\t{\n\t\t\"status\": \"ok\",\n\t\t\"message\": \"Player warned!\"\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n\t\t\"status\": \"nok\",\n\t\t\"message\": \"You are doing something wrong.\"\n\t}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./dashboard/routes/api.js",
    "groupTitle": "Admin"
  },
  {
    "type": "get",
    "url": "/squad-api/currentMap",
    "title": "Request current layer",
    "name": "currentMap",
    "group": "Server",
    "parameter": {
      "fields": {
        "Login": [
          {
            "group": "Login",
            "type": "String",
            "optional": false,
            "field": "apiToken",
            "description": "<p>Your api token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "level",
            "description": "<p>Map name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "layer",
            "description": "<p>Layer name.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n\t{\n\t\t\"level\": \"Narva\",\n\t\t\"layer\": \"Narva AAS v2\"\n\t}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./dashboard/routes/api.js",
    "groupTitle": "Server"
  },
  {
    "type": "get",
    "url": "/squad-api/getNextMap",
    "title": "Request next layer",
    "name": "getNextMap",
    "group": "Server",
    "parameter": {
      "fields": {
        "Login": [
          {
            "group": "Login",
            "type": "String",
            "optional": false,
            "field": "apiToken",
            "description": "<p>Your api token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "level",
            "description": "<p>Map name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "layer",
            "description": "<p>Layer name.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n\t{\n\t\t\"level\": \"Narva\",\n\t\t\"layer\": \"Narva AAS v2\"\n\t}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./dashboard/routes/api.js",
    "groupTitle": "Server"
  },
  {
    "type": "get",
    "url": "/squad-api/getPlayersList",
    "title": "Request current active players",
    "name": "getPlayersList",
    "group": "Server",
    "parameter": {
      "fields": {
        "Login": [
          {
            "group": "Login",
            "type": "String",
            "optional": false,
            "field": "apiToken",
            "description": "<p>Your api token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>Players info.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n  {\n   {\n     \"playerID\": \"62\",\n     \"steamID\": \"76561197988878542\",\n     \"name\": \"!Flöt3nFranZ!\",\n     \"teamID\": \"1\",\n     \"squadID\": \"2\",\n     \"squad\": {\n         \"squadID\": \"2\",\n         \"squadName\": \"Squad 2\",\n         \"size\": \"9\",\n         \"locked\": \"False\",\n         \"teamID\": \"1\",\n         \"teamName\": \"British Armed Forces\"\n     },\n     \"suffix\": \"!Flöt3nFranZ!\",\n     \"possessClassname\": \"BP_Brit_Util_Truck_Logi\"\n  },\n\t {...},\n   ...\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./dashboard/routes/api.js",
    "groupTitle": "Server"
  },
  {
    "type": "get",
    "url": "/squad-api/getServerInfo",
    "title": "Request server info",
    "name": "getServerInfo",
    "group": "Server",
    "parameter": {
      "fields": {
        "Login": [
          {
            "group": "Login",
            "type": "String",
            "optional": false,
            "field": "apiToken",
            "description": "<p>Your api token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Server information.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "included",
            "description": "<p>Included.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n{\n    \"data\": {\n        \"type\": \"server\",\n        \"id\": \"10281405\",\n        \"attributes\": {\n            \"id\": \"10281405\",\n            \"name\": \"✪✪✪ GERMAN SQUAD #1 ✪✪✪ @GER-SQUAD.community\",\n            \"address\": null,\n            \"ip\": \"194.26.183.182\",\n            \"port\": 27015,\n            \"players\": 99,\n            \"maxPlayers\": 100,\n            \"rank\": 20,\n            \"location\": [\n                8.10812,\n                50.518749\n            ],\n            \"status\": \"online\",\n            \"details\": {\n                \"map\": \"Yehorivka_RAAS_v1\",\n                \"gameMode\": \"RAAS\",\n                \"version\": \"V2.11.0.25.64014\",\n                \"secure\": 0,\n                \"licensedServer\": true,\n                \"licenseId\": \"809942\",\n                \"numPubConn\": 99,\n                \"numPrivConn\": 1,\n                \"numOpenPrivConn\": 1,\n                \"modded\": false,\n                \"serverSteamId\": \"90150709607385097\"\n            },\n            \"private\": false,\n            \"createdAt\": \"2021-02-19T13:52:06.986Z\",\n            \"updatedAt\": \"2021-08-28T18:41:12.307Z\",\n            \"portQuery\": 27016,\n            \"country\": \"DE\",\n            \"queryStatus\": \"valid\"\n        },\n        \"relationships\": {\n            \"game\": {\n                \"data\": {\n                    \"type\": \"game\",\n                    \"id\": \"squad\"\n                }\n            }\n        }\n    },\n    \"included\": []\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./dashboard/routes/api.js",
    "groupTitle": "Server"
  },
  {
    "type": "get",
    "url": "/squad-api/setNextMap",
    "title": "Set next layer",
    "name": "setNextMap",
    "group": "Server",
    "parameter": {
      "fields": {
        "Login": [
          {
            "group": "Login",
            "type": "String",
            "optional": false,
            "field": "apiToken",
            "description": "<p>Your api token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the request.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n\t{\n\t\t\"status\": \"ok\",\n\t\t\"message\": \"Next map set!\"\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n\t\t\"status\": \"nok\",\n\t\t\"message\": \"You are doing something wrong.\"\n\t}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./dashboard/routes/api.js",
    "groupTitle": "Server"
  },
  {
    "type": "post",
    "url": "/roles/whitelist/removeUserWhitelist",
    "title": "Remove the whitelist from a player",
    "name": "RemoveWhitelistPlayer",
    "group": "WhiteList",
    "parameter": {
      "fields": {
        "Login": [
          {
            "group": "Login",
            "type": "String",
            "optional": false,
            "field": "apiToken",
            "description": "<p>Your api token</p>"
          }
        ],
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "steamID",
            "description": "<p>The steamID of the player to be removed from the whitelist.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>The reason.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the request.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n\t{\n\t\t\"status\": \"ok\",\n\t\t\"message\": \"Whitelist removed from the player!\"\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n\t\t\"status\": \"nok\",\n\t\t\"message\": \"You are doing something wrong.\"\n\t}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./dashboard/routes/api.js",
    "groupTitle": "WhiteList"
  },
  {
    "type": "get",
    "url": "/roles/url",
    "title": "Regenerate the token for the whitelists",
    "name": "reGenerateWhitelistURL",
    "group": "WhiteList",
    "parameter": {
      "fields": {
        "Login": [
          {
            "group": "Login",
            "type": "String",
            "optional": false,
            "field": "apiToken",
            "description": "<p>Your api token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>The URL of the whitelists</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n\t{\n\t\t\"status\": \"ok\",\n\t\t\"message\": \"URL sent\",\n\t\t\"url\": \"localhost/whitelist/ThisNewTokenBdc78_457qwe1455sadASD\"\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n\t\t\"status\": \"nok\",\n\t\t\"message\": \"You are doing something wrong.\"\n\t}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n\t\t\"status\": \"nok\",\n\t\t\"message\": \"Only the owner can get regenerate the url!\"\n\t}",
          "type": "json"
        }
      ]
    },
    "description": "<p>Only the owner can regenerate the url of the whitelists</p>",
    "version": "0.0.0",
    "filename": "./dashboard/routes/api.js",
    "groupTitle": "WhiteList"
  },
  {
    "type": "get",
    "url": "/roles/url",
    "title": "Get the URL of the whitelists",
    "name": "whitelistURL",
    "group": "WhiteList",
    "parameter": {
      "fields": {
        "Login": [
          {
            "group": "Login",
            "type": "String",
            "optional": false,
            "field": "apiToken",
            "description": "<p>Your api token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>The URL of the whitelists</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n\t{\n\t\t\"status\": \"ok\",\n\t\t\"message\": \"URL sent\",\n\t\t\"url\": \"localhost/whitelist/ABCDabcd1234_56789EfgIkLm\"\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n\t\t\"status\": \"nok\",\n\t\t\"message\": \"You are doing something wrong.\"\n\t}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n\t\t\"status\": \"nok\",\n\t\t\"message\": \"Only the owner can get regenerate the url!\"\n\t}",
          "type": "json"
        }
      ]
    },
    "description": "<p>Only the owner can get the url of the whitelists</p>",
    "version": "0.0.0",
    "filename": "./dashboard/routes/api.js",
    "groupTitle": "WhiteList"
  }
] });
