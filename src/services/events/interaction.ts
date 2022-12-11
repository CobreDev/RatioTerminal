import {
	ButtonInteraction,
	ChatInputCommandInteraction,
	Interaction,
	MessageContextMenuCommandInteraction,
	UserContextMenuCommandInteraction
} from "discord.js";
import {
	buttonInteractionsMap,
	chatCommandsMap,
	messageCommandsMap,
	userCommandsMap
} from "../../commands";

export async function handleInteraction(
	interaction: Interaction
): Promise<void> {
	try {
		if (interaction.isUserContextMenuCommand())
			return await handleUserContextInteraction(interaction);
		if (interaction.isMessageContextMenuCommand())
			return await handleMessageContextInteraction(interaction);
		if (interaction.isChatInputCommand())
			return await handleMessageInteraction(interaction);
		if (interaction.isButton())
			return await handleButtonInteraction(interaction);
	} catch (e: any) {
		console.error(e);
	}
}

export async function handleUserContextInteraction(
	interaction: UserContextMenuCommandInteraction
): Promise<void> {
	let command;

	command = userCommandsMap.get(interaction.commandName);

	if (!command) return;

	const inhibitors = Array.isArray(command.inhibitors)
		? command.inhibitors
		: [command.inhibitors];

	try {
		for (const inhibitor of inhibitors) {
			await inhibitor(interaction);
		}

		await command.run(interaction);
	} catch (e: any) {
		console.log(e);
	}
}

export async function handleMessageContextInteraction(
	interaction: MessageContextMenuCommandInteraction
): Promise<void> {
	let command;

	command = messageCommandsMap.get(interaction.commandName);

	if (!command) return;

	const inhibitors = Array.isArray(command.inhibitors)
		? command.inhibitors
		: [command.inhibitors];

	try {
		for (const inhibitor of inhibitors) {
			await inhibitor(interaction);
		}

		await command.run(interaction);
	} catch (e: any) {
		console.log(e);
	}
}

export async function handleMessageInteraction(
	interaction: ChatInputCommandInteraction
): Promise<void> {
	const command = chatCommandsMap.get(interaction.commandName);

	if (!command) return;

	const inhibitors = Array.isArray(command.inhibitors)
		? command.inhibitors
		: [command.inhibitors];

	try {
		for (const inhibitor of inhibitors) {
			await inhibitor(interaction);
		}
		await command.run(interaction);
	} catch (e: any) {
		console.log(e);
	}
}

export async function handleButtonInteraction(
	interaction: ButtonInteraction
): Promise<void> {
	const command = buttonInteractionsMap.get(interaction.customId);

	if(!command) return;

	const inhibitors = Array.isArray(command.inhibitors)
		? command.inhibitors
		: [command.inhibitors];

	try {
		for (const inhibitor of inhibitors) {
			await inhibitor(interaction);
		}

		await command.run(interaction);
	}
	catch(e) {
		console.log(e);
	}
}