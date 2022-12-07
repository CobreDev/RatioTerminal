const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const { token } = require("./config.json");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

const eventFiles = fs.readdirSync("./events");
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, event.execute);
	} else {
		client.on(event.name, event.execute);
	}
}

client.login(token);

process.on("SIGINT", () => {
	client.destroy();
	process.exit();
});
