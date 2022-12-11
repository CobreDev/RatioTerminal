import { Client, ActivityType } from "discord.js";
import { IS_DEV } from "./constants";
import {
	chatCommandsMap,
	messageCommandsMap,
	userCommandsMap,
} from "./commands";
import { handleInteraction } from "./services/events/interaction";
import { createSharedPrismaClient } from "./helpers/Prisma/sharedClient";
import { handleMessageCreate } from "./services/events/messageCreate";

const client = new Client({
	intents: [
		"Guilds",
		"GuildMessages",
		"MessageContent",
		"GuildMembers",
		"GuildPresences",
	],
});

client.on("ready", async () => {
	await client.user?.setPresence({
		status: "online",
		activities: [
			{
				type: ActivityType.Watching,
				name: "ratios",
			},
		],
	});

	if (IS_DEV) {
		// Register local slash commands
		if (!process.env.GUILD_ID) {
			throw new Error("GUILD_ID is not set");
		}

		await client.guilds.cache
			.get(process.env.GUILD_ID)
			?.commands.set([
				...chatCommandsMap.values(),
				...messageCommandsMap.values(),
				...userCommandsMap.values(),
			]);
	} else {
		// Register global slash commands
		await client.application?.commands.set([
			...chatCommandsMap.values(),
			...messageCommandsMap.values(),
			...userCommandsMap.values(),
		]);
	}

	await createSharedPrismaClient();
});

client.on("interactionCreate", handleInteraction);

client.on("messageCreate", handleMessageCreate);
(async () => {
	await client.login(process.env.DISCORD_TOKEN);
})();
