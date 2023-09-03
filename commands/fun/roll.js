const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { randomColor } = require('../../util/bananabread.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls an x-sided dice.')
		.addIntegerOption(option =>
			option.setName('sides')
				.setDescription('Number of sides on the dice.')
				.setRequired(true)),
	async execute(interaction) {
		const sides = interaction.options.getInteger('sides');
		const roll = Math.floor(Math.random() * sides) + 1;

		const embed = new EmbedBuilder()
			.setColor(randomColor())
			.setTitle(`:game_die: You rolled a ${roll}!`)
			.setTimestamp()
			.setFooter({ text: 'Roll again with /roll.', iconURL: interaction.user.avatarURL() });

		await interaction.reply({ embeds: [embed] });
	},
};