import { Message } from "discord.js";
import { sharedPrismaClient } from "../../helpers/Prisma/sharedClient";
import { ACCEPTED_PNG, DENIED_PNG } from "../../constants";
import * as fs from "fs";

export const handleMessageCreate = async (message: Message) => {
	const ratioRegex = /\b(rati|coun)(o|ou|a|ai)+(s|t|er)?\b/i;

	if (message.author.bot) return;

	const isMatch = ratioRegex.test(message.content);
	if (isMatch) {
		// Get ratio odds KV for user
		const configFile = fs.readFileSync("./src/store/kv/odds", "utf-8");

		let percentOdds: number = 50;

		for (const i of configFile.split("\n")) {
			let kvSplit = i.split(":");
			let userID = kvSplit[0];

			if (userID === message.author.id) {
				percentOdds = Number(kvSplit[1]);
				break;
			}
		}

		const isRatio = Math.random() > percentOdds / 100;

		if (isRatio) {
			// No ratio 😔

			await message.react("👎");
			await message.reply({
				content: DENIED_PNG
			});

			// Create ratio log
			await sharedPrismaClient.ratios.create({
				data: {
					messageID: message.id,
					userID: message.author.id,
					guildID: message.guildId!,
					accepted: false,
					wasRigged: percentOdds === 50,
					rigOdds: percentOdds === 50 ? null : percentOdds,
					createdOn: new Date(),
				},
			});

			const user = message.client.users.cache.get(message.author.id);

			await sharedPrismaClient.users.upsert({
				where: {
					userID: message.author.id,
				},
				update: {
					lCount: {
						increment: 1,
					},
					updatedOn: new Date(),
				},
				create: {
					userID: message.author.id,
					username: user?.username!,
					discriminator: user?.discriminator!,
					wCount: 0,
					lCount: 1,
					createdOn: new Date(),
				},
			});
		} else {
			// Ratio 😄

			await message.react("👍");
			await message.reply({
				content: ACCEPTED_PNG
			});

			// Create ratio log for leaderboard
			await sharedPrismaClient.ratios.create({
				data: {
					messageID: message.id,
					userID: message.author.id,
					guildID: message.guildId!,
					accepted: true,
					wasRigged: percentOdds === 50,
					rigOdds: percentOdds === 50 ? null : percentOdds,
					createdOn: new Date(),
				},
			});

			const user = message.client.users.cache.get(message.author.id);

			await sharedPrismaClient.users.upsert({
				where: {
					userID: message.author.id,
				},
				update: {
					wCount: {
						increment: 1,
					},
					updatedOn: new Date(),
				},
				create: {
					userID: message.author.id,
					username: user?.username!,
					discriminator: user?.discriminator!,
					wCount: 1,
					lCount: 0,
					createdOn: new Date(),
				},
			});
		}
	}
};
