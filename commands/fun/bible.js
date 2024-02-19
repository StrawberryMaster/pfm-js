const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { randomColor } = require('../../util/bananabread.js');
const fs = require('fs');
const bibleWords = new Set(JSON.parse(fs.readFileSync('./data/bible.txt', 'utf8')));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bible')
		.setDescription('Check how many words in your message are in the Bible')
		.addStringOption(option => option.setName('text').setDescription('The text to check').setRequired(true)),
	async execute(interaction) {
		const text = interaction.options.getString('text');
		const words = text.split(' ').filter(word => word.length >= 6);

		const bibleWordsCount = words.reduce((count, word) => bibleWords.has(word) ? count + 1 : count, 0);

		const hitRate = (bibleWordsCount / words.length) * 100;
		const hitRatePrint = hitRate.toFixed(2);

		const embed = new EmbedBuilder()
			.setColor(randomColor())
			.setTitle('The Schlossberg-Märtens Bible Index')
			.setDescription(`${hitRatePrint}% of your message is in the Bible!`)
			.setTimestamp()
			.setFooter({ text: 'Use /bible to check another message.', iconURL: interaction.user.avatarURL() });

		await interaction.reply({ embeds: [embed] });
	},
};