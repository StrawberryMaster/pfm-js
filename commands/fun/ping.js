const { codeBlock, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with the latency of the bot.'),
	async execute(interaction) {
		const databaseTiming = performance.now() - interaction.createdTimestamp;
		const embed = new EmbedBuilder()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Pong! :ping_pong:')
			.addFields([
				{
					name: 'Websocket latency',
					value: codeBlock(`${Math.floor(databaseTiming)}ms`),
					inline: true,
				},
			])
			.setTimestamp()
			.setFooter({ text: 'Use /ping to retry.', iconURL: interaction.user.avatarURL() });

		await interaction.reply({ embeds: [embed] });
	},
};