import { Inhibitor } from "../types/Discord";
import { OWNERS_IDS } from "../constants";
import { GuildMember } from "discord.js";

export const ownerOnly: Inhibitor = interaction => {
	if (!OWNERS_IDS.includes((interaction.member as GuildMember).id)) {
		throw new Error("Stop tryna rig it, you're not that guy.")
	}
}