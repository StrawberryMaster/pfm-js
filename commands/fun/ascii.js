// Attribution goes to https://github.com/skillzl/eres/blob/main/commands/utils/whois.js for the original code
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { randomColor } = require('../../util/bananabread.js');
const figlet = require('figlet');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ascii')
		.setDescription('Converts text to ASCII art')
		.addStringOption(option => option.setName('text').setDescription('The text to convert').setRequired(true)),
	async execute(interaction) {
		const text = interaction.options.getString('text');

		figlet(text, async (error, artData) => {
			if (error) {
				console.log('Huh. Something went wrong.');
				console.dir(error);
				return;
			}

			const embed = new EmbedBuilder()
				.setColor(randomColor())
				.setTitle('Your ASCII art')
				.setDescription('```' + artData + '```')
				.setTimestamp()
				.setFooter({ text: 'Use /ascii to do a new art.', iconURL: interaction.user.avatarURL() });

			await interaction.reply({ embeds: [embed] });
		});
	},
};