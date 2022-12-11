import { ChatCommand } from "../../../types/Discord";
import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } from "discord.js";
import { sharedPrismaClient } from "../../../helpers/Prisma/sharedClient";
import { PEROXAAN_COLOR } from "../../../constants";
import { User } from "../../../types/Leaderboard";

export const Leaderboard: ChatCommand = {
	name: "leaderboard",
	description: "Get a ratio leaderboard of the most W's or L's",
	type: ApplicationCommandType.ChatInput,
	inhibitors: [],
	options: [
		{
			name: "global",
			description: "Get a global leaderboard",
			type: ApplicationCommandOptionType.Boolean,
			required: true
		},
		{
			name: "sort",
			description: "Get W's or L's",
			type: ApplicationCommandOptionType.String,
			choices: [
				{
					name: "W's",
					value: "w"
				},
				{
					name: "L's",
					value: "l"
				}
			],
			required: true
		}
	],
	async run(interaction) {
		const global = interaction.options.get("global")?.value === "true";
		const sortTop: boolean = interaction.options.get("sort")?.value === "w";

		if (global) {
			if(sortTop) {
				const topWinners = await sharedPrismaClient.users.findMany({
					take: 10,
					orderBy: {
						wCount: 'desc'
					}
				});

				const winnersEmbed = new EmbedBuilder()
					.setColor(`${PEROXAAN_COLOR}`)
					.setTitle("Here are the ten biggest W takers!")
					.setTimestamp(new Date());

				for (let i=0; i < topWinners.length; i++) {
					winnersEmbed.addFields([
						{
							name: `#${i+1} - ${topWinners[i].username}#${topWinners[i].discriminator}`,
							value: `Number of Ws: ${topWinners[i].wCount}`
						}
					])
				}

				await interaction.reply({
					embeds: [
						winnersEmbed
					]
				});
			}
			else {
				const topLosers = await sharedPrismaClient.users.findMany({
					take: 10,
					orderBy: {
						lCount: 'desc'
					}
				});

				const losersEmbed = new EmbedBuilder()
					.setColor(`${PEROXAAN_COLOR}`)
					.setTitle("Here are the ten biggest L takers!")
					.setTimestamp(new Date());

				for (let i=0; i < topLosers.length; i++) {
					losersEmbed.addFields([
						{
							name: `#${i} - ${topLosers[i].username}#${topLosers[i].discriminator}`,
							value: `Number of Ls: ${topLosers[i].lCount}`
						}
					])
				}

				await interaction.reply({
					embeds: [
						losersEmbed
					]
				});
			}
		}
		else {
			if(sortTop) {
				const allGuildWs = await sharedPrismaClient.ratios.findMany({
					where: {
						guildID: interaction.guildId!,
						accepted: true,
					},
				});

				let ratioArr: User[] = [];

				for (const i of allGuildWs) {
					const user = await interaction.client.users.cache.get(i.userID);

					let userExists = ratioArr.findIndex(user => user.userID === i.userID);

					if(ratioArr[userExists]) {
						i.accepted ? ratioArr[userExists].wCount += 1 : ratioArr[userExists].lCount += 1;
					}
					else {
						if(user) {
							ratioArr.push({
								userID: i.userID,
								username: user.username,
								discriminator: user.discriminator,
								wCount: i.accepted ? 1 : 0,
								lCount: i.accepted ? 0 : 1,
							})
						}
					}
				}

				ratioArr.sort((a, b) => b.wCount - a.wCount);

				const guild = await interaction.client.guilds.cache.get(interaction.guildId!);

				const winsEmbed = new EmbedBuilder()
					.setColor(`${PEROXAAN_COLOR}`)
					.setTitle(`Here's the top 10 W takers from the ${guild?.name} server!`)
					.setTimestamp(new Date());

				for (let i=0; i < 11; i++) {
					if(ratioArr[i]) {
						winsEmbed.addFields([
							{
								name: `#${i+1} - ${ratioArr[i].username}#${ratioArr[i].discriminator}`,
								value: `W Count: ${ratioArr[i].wCount}`
							}
						]);
					}
				}

				await interaction.reply({
					embeds: [
						winsEmbed
					]
				});
			}
			else {
				const allGuildLs = await sharedPrismaClient.ratios.findMany({
					where: {
						guildID: interaction.guildId!,
						accepted: false,
					},
				});

				let ratioArr: User[] = [];

				for (const i of allGuildLs) {
					const user = interaction.client.users.cache.get(i.userID);

					let userExists = ratioArr.findIndex(user => user.userID === i.userID);

					if(ratioArr[userExists]) {
						i.accepted ? ratioArr[userExists].wCount += 1 : ratioArr[userExists].lCount += 1;
					}
					else {
						if(user) {
							ratioArr.push({
								userID: i.userID,
								username: user.username,
								discriminator: user.discriminator,
								wCount: i.accepted ? 1 : 0,
								lCount: i.accepted ? 0 : 1,
							})
						}
					}
				}

				ratioArr.sort((a, b) => a.wCount - b.wCount);

				const guild = await interaction.client.guilds.cache.get(interaction.guildId!);

				const lossesEmbed = new EmbedBuilder()
					.setColor(`${PEROXAAN_COLOR}`)
					.setTitle(`Here's the top 10 L takers from the ${guild?.name} server!`)
					.setTimestamp(new Date());

				for (let i=0; i < 11; i++) {
					if(ratioArr[i]) {
						lossesEmbed.addFields([
							{
								name: `#${i+1} - ${ratioArr[i].username}#${ratioArr[i].discriminator}`,
								value: `L Count: ${ratioArr[i].lCount}`
							}
						]);
					}
				}

				await interaction.reply({
					embeds: [
						lossesEmbed
					]
				});
			}
		}
	}
}