const { ActivityType } = require("discord.js");

module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		console.log(`Logged in as ${client.user.tag} (${client.user.id})`);

		const update = () => {
			client.user.setActivity(
				`${client.guilds.cache.size} servers for ratios!`,
				{ type: ActivityType.Listening }
			);
		};
		update();
		setInterval(update, 600000);
	},
};
