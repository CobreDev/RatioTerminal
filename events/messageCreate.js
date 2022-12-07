const { AttachmentBuilder } = require("discord.js");
const { triggers, userChances } = require("../config.json");

const regex = new RegExp(triggers.join("|"), "im");

const acceptedAttachment = new AttachmentBuilder(
	"https://cdn.discordapp.com/attachments/809297772850839552/1048825101551947846/RatioTerminalAccepted.png",
	{
		name: "Accepted.png",
		description:
			"A card that says 'Ratio Card' registered to Michael Peroxaan sliding through a card terminal. The terminal reads 'Accepted' in green.",
	}
);

const declinedAttachment = new AttachmentBuilder(
	"https://cdn.discordapp.com/attachments/809297772850839552/1048825102130757702/RatioTerminalDeclined.png",
	{
		name: "Accepted.png",
		description:
			"A card that says 'Ratio Card' registered to Michael Peroxaan sliding through a card terminal. The terminal reads 'Declined' in red.",
	}
);

module.exports = {
	name: "messageCreate",
	async execute(message) {
		if (
			message.author.bot ||
			!message.guild ||
			!message.content ||
			!regex.test(message.content)
		)
			return;

		const rand = Math.random() * 100;
		const chance = userChances[message.author.id] || 50;
		const accepted = rand <= chance;

		message
			.react(accepted ? "👍" : "👎")
			.catch((reason) =>
				this.container.logger.error(
					"Failed to add reaction to message:" + reason
				)
			);

		message
			.reply({
				files: [accepted ? acceptedAttachment : declinedAttachment],
			})
			.catch((reason) =>
				this.container.logger.error(
					"Failed to send image to channel:" + reason
				)
			);
	},
};
