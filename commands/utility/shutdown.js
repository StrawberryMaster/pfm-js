const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shutdown')
		.setDescription('Shuts down the bot.'),
	async execute(interaction) {
		await interaction.reply('Shutting down... :compression:');
		process.exit();
	},
};