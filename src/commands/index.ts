import { ChatCommand, InteractionButtonCommand, MessageCommand, UserCommand } from "../types/Discord";
import { Rig } from "./admin/rig";

export const chatCommands: ChatCommand[] = [Rig];

export const messageCommands: MessageCommand[] = [];

export const userCommands: UserCommand[] = [];

export const buttonInteractions: InteractionButtonCommand[] = [];

export const chatCommandsMap = new Map<string, ChatCommand>(
	Object.entries(
		chatCommands.reduce((all, command) => {
			return { ...all, [command.name]: command };
		}, {} as Record<string, ChatCommand>)
	)
);

export const messageCommandsMap = new Map<string, MessageCommand>(
	Object.entries(
		messageCommands.reduce((all, command) => {
			return { ...all, [command.name]: command };
		}, {} as Record<string, MessageCommand>)
	)
);

export const userCommandsMap = new Map<string, UserCommand>(
	Object.entries(
		userCommands.reduce((all, command) => {
			return { ...all, [command.name]: command };
		}, {} as Record<string, UserCommand>)
	)
);

export const buttonInteractionsMap = new Map<string, InteractionButtonCommand>(
	Object.entries(
		buttonInteractions.reduce((all, interaction) => {
			return { ...all, [interaction.customId]: interaction};
		}, {} as Record<string, InteractionButtonCommand>)
	)
)