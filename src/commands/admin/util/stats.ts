import { ChatCommand } from "../../../types/Discord";
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	EmbedBuilder,
} from "discord.js";
import { sharedPrismaClient } from "../../../helpers/Prisma/sharedClient";
import { PEROXAAN_COLOR } from "../../../constants";

export const Stats: ChatCommand = {
	name: "stats",
	description: "Get your stats, or someone elses!",
	type: ApplicationCommandType.ChatInput,
	inhibitors: [],
	options: [
		{
			name: "user",
			description: "User to get stats for",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
	],
	async run(interaction) {
		const user = interaction.options.get("user")?.value;

		let userID: string = interaction.user.id;
		if (user) {
			userID = user.toString();
		}

		// Fetch all stats for user
		const stats = await sharedPrismaClient.users.findUnique({
			where: {
				userID: userID,
			},
		});

		if (stats) {
			const statsEmbed = new EmbedBuilder()
				.setColor(`${PEROXAAN_COLOR}`)
				.setTitle(
					`Here are the stats for ${stats?.username}#${stats?.discriminator}`
				)
				.setFields([
					{
						name: "W Count 🏆",
						value: `${stats.wCount}`,
					},
					{
						name: "L Count ❌",
						value: `${stats.lCount}`,
					},
				])
				.setTimestamp(new Date());

			await interaction.reply({
				embeds: [statsEmbed],
			});
		} else {
			await interaction.reply({
				content:
					"I wasn't able to find a user. Have they sent a ratio before?",
				ephemeral: true,
			});
		}
	},
};
