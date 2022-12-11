import { Message } from "discord.js";
import { sharedPrismaClient } from "../../helpers/Prisma/sharedClient";
import { ACCEPTED_PNG, DENIED_PNG } from "../../constants";

export const handleMessageCreate = async (message: Message) => {
	const ratioRegex = /\b(rati|coun)(o|ou|a|ai)+(s|t|er)?\b/i;

	const isMatch = ratioRegex.test(message.content);
	if(isMatch) {
		// Get ratio config for user
		const config = await sharedPrismaClient.userConfigs.findUnique({
			where: {
				userID: message.author.id
			}
		});

		let percentOdds: number = 50;
		if(config) {
			percentOdds = config.odds
		}

		const isRatio = (Math.random() < (percentOdds / 100))

		if(isRatio) {
			// No ratio 😔
			await message.react("👎")
			await message.reply({
				content: DENIED_PNG
			})

			// Create ratio log
			await sharedPrismaClient.ratios.create({
				data: {
					messageID: message.id,
					guildID: message.guildId!,
					accepted: false,
					wasRigged: percentOdds === 50,
					rigOdds: percentOdds === 50 ? null : percentOdds,
					createdOn: new Date()
				}
			});
		}
		else {
			// Ratio 😄
			await message.react("👍")
			await message.reply({
				content: ACCEPTED_PNG
			});

			// Create ratio log for leaderboard
			await sharedPrismaClient.ratios.create({
				data: {
					messageID: message.id,
					guildID: message.guildId!,
					accepted: true,
					wasRigged: percentOdds === 50,
					rigOdds: percentOdds === 50 ? null : percentOdds,
					createdOn: new Date()
				}
			});
		}


	}
}