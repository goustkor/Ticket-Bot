/*
Copyright 2023 Sayrix (github.com/Sayrix)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import fs from "fs-extra";
import path from "node:path";
import { GatewayIntentBits } from "discord.js";
import { jsonc } from "jsonc";
import { config as envconf } from "dotenv";
import {ConfigType, ExtendedClient} from "./structure";

// Initalize .env file as environment
try {envconf();}
catch(ex) {console.log(".env failed to load");}

// Although invalid type, it should be good enough for now until more stuff needs to be handled here
process.on("unhandledRejection", (reason: string, promise: string, a: string) => {
	console.error(reason, promise, a);
});

process.on("uncaughtException", (err: string) => {
	console.error(err);
});

process.stdout.write(`
\x1b[38;2;143;110;250m████████╗██╗ ██████╗██╗  ██╗███████╗████████╗    ██████╗  ██████╗ ████████╗
\x1b[38;2;157;101;254m╚══██╔══╝██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝    ██╔══██╗██╔═══██╗╚══██╔══╝
\x1b[38;2;172;90;255m   ██║   ██║██║     █████╔╝ █████╗     ██║       ██████╔╝██║   ██║   ██║   
\x1b[38;2;188;76;255m   ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║       ██╔══██╗██║   ██║   ██║   
\x1b[38;2;205;54;255m   ██║   ██║╚██████╗██║  ██╗███████╗   ██║       ██████╔╝╚██████╔╝   ██║   
\x1b[38;2;222;0;255m   ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝       ╚═════╝  ╚═════╝    ╚═╝\x1b[0m
                 https://github.com/Sayrix/ticket-bot

Connecting to Discord...
`);

// Update Detector
fetch("https://api.github.com/repos/Sayrix/Ticket-Bot/tags").then((res) => {
	if (Math.floor(res.status / 100) !== 2) return console.warn("🔄  Failed to pull latest version from server");
	res.json().then((json) => {
               // Assuming the format stays consistent (i.e. x.x.x)
		const latest = json[0].name.split(".").map((k: string) => parseInt(k));
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const current = require("../package.json").version.split(".")
			.map((k: string) => parseInt(k));
		if (
			latest[0] > current[0] ||
			(latest[0] === current[0] && latest[1] > current[1]) ||
			(latest[0] === current[0] && latest[1] === current[1] && latest[2] > current[2])
		)
			console.warn(`🔄  New version available: ${json[0].name}; Current Version: ${current.join(".")}`);
		else console.log("🔄  The ticket-bot is up to date");
	});
});

const config: ConfigType = jsonc.parse(fs.readFileSync(path.join(__dirname, "/../config/config.jsonc"), "utf8"));

const client = new ExtendedClient({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
	presence: {
		status: config.status?.status ?? "online"
	}
}, config);

// Login the bot
client.login(process.env["TOKEN"]).then(null);

/*
Copyright 2023 Sayrix (github.com/Sayrix)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
