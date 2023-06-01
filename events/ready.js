const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Up and ready to go! Logged in as ${client.user.tag}.`);
	},
};