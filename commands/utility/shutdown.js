const { SlashCommandBuilder } = require('discord.js');
const { ownerId } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shutdown')
		.setDescription('Shuts down the bot.'),
	async execute(interaction) {
		if (interaction.user.id !== ownerId) {
			return await interaction.reply('You are not authorized to use this command, bro. :angry:');
		}

		await interaction.reply('Shutting down... :compression:');
		process.exit();
	},
};