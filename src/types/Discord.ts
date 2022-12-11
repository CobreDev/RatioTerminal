import {
	ChatInputApplicationCommandData,
	CommandInteraction,
	Interaction,
	ApplicationCommandType,
	MessageContextMenuCommandInteraction,
	MessageApplicationCommandData,
	UserApplicationCommandData,
	UserContextMenuCommandInteraction, InteractionButtonComponentData, ButtonInteraction
} from "discord.js";

export interface ChatCommand extends ChatInputApplicationCommandData {
	inhibitors: Inhibitor[] | Inhibitor;
	type: ApplicationCommandType.ChatInput;

	// eslint-disable-next-line no-unused-vars
	run(interaction: CommandInteraction): Promise<void>;
}

export interface MessageCommand extends MessageApplicationCommandData {
	inhibitors: Inhibitor[] | Inhibitor;
	type: ApplicationCommandType.Message;

	// eslint-disable-next-line no-unused-vars
	run(interaction: MessageContextMenuCommandInteraction): Promise<void>;
}

export interface UserCommand extends UserApplicationCommandData {
	inhibitors: Inhibitor[] | Inhibitor;
	type: ApplicationCommandType.User;

	// eslint-disable-next-line no-unused-vars
	run(interaction: UserContextMenuCommandInteraction): Promise<void>;
}

export interface InteractionButtonCommand extends InteractionButtonComponentData {
	inhibitors: Inhibitor[] | Inhibitor;
	run(interaction: ButtonInteraction): Promise<void>;
}

// eslint-disable-next-line no-unused-vars
export type Inhibitor = (interaction: Interaction) => Promise<void> | void;