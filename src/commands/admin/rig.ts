import { ChatCommand } from "../../types/Discord";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { ownerOnly } from "../../inhibitors/ownerOnly";
import { promises as fs } from "fs";

export const Rig: ChatCommand = {
	name: "rig",
	description: "Rig the odds for a certain user",
	type: ApplicationCommandType.ChatInput,
	inhibitors: [ownerOnly],
	options: [
		{
			name: "user",
			description: "The user to rig odds for",
			type: ApplicationCommandOptionType.User,
			required: true
		},
		{
			name: "odds",
			description: "The odds for the user. 0 = always lose, 100 = always win",
			type: ApplicationCommandOptionType.Number,
			min_value: 0,
			max_value: 100,
			required: true
		}
	],
	async run(interaction) {
		const userID = interaction.options.get("user")?.value?.toString()!;
		const odds = Number(interaction.options.get("odds")?.value!);

		// Get file and ensure the ID isn't there yet
		let oddsFile = await fs.readFile("./src/store/kv/odds", "utf-8");

		const oddsFileLines = oddsFile.split("\n");
		let found: boolean = false;
		for (let i = 0; i <= oddsFileLines.length; i++) {
			if (oddsFileLines[i]) {
				const kvSplit = oddsFileLines[i].split(":");

				if (kvSplit[0] === userID) {
					found = true;

					await fs.writeFile("./src/store/kv/odds", oddsFile.replace(`${userID}:${kvSplit[1]}`, `${userID}:${odds}`));

					const user = await interaction.client.users.cache.get(userID);
					await interaction.reply({
						content: `Success! Set ${user?.username}#${user?.discriminator}'s odds to ${odds}%`
					});

					break;
				}
			}
		}

		if (!found) {
			// Write new line w/ odds
			await fs.appendFile("./src/store/kv/odds", `${userID}:${odds}\n`);

			const user = await interaction.client.users.cache.get(userID);
			await interaction.reply({
				content: `Success! Set ${user?.username}#${user?.discriminator}'s odds to ${odds}%`
			});
		}
	}
};