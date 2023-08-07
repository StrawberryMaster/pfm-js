const { codeBlock, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { randomColor } = require('../../util/bananabread.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with the latency of the bot.'),
	async execute(interaction) {
		const databaseTiming = Math.abs(Date.now() - interaction.createdTimestamp);
		const userTiming = interaction.client.ws.ping;
		const embed = new EmbedBuilder()
			.setColor(randomColor())
			.setTitle('Pong! :ping_pong:')
			.addFields([
				{
					name: 'Database latency',
					value: codeBlock(`${Math.floor(databaseTiming)}ms`),
					inline: true,
				},
				{
					name: 'User latency',
					value: codeBlock(`${Math.floor(userTiming)}ms`),
					inline: true,
				},
				{
					name: 'Roundtrip latency',
					value: codeBlock(`${Math.floor(databaseTiming + userTiming)}ms`),
					inline: true,
				},
			])
			.setTimestamp()
			.setFooter({ text: 'Use /ping to retry.', iconURL: interaction.user.avatarURL() });

		await interaction.reply({ embeds: [embed] });
	},
};