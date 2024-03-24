// Fortune - sends a random quote from a list of quotes. My favorite command! :D
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { randomColor } = require('../../util/bananabread.js');
const quotes = require('../../data/fortunequotes.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fortune')
		.setDescription('Sends a random quote from a list of quotes.'),
	async execute(interaction) {
		const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
		const embed = new EmbedBuilder()
			.setColor(randomColor())
			.setTitle('Fortune of the day')
			.setDescription(`"${randomQuote.quote}"`)
			.addFields({ name: 'Author', value: randomQuote.author })
			.setTimestamp()
			.setFooter({ text: 'Use /fortune to get a new quote.', iconURL: interaction.user.avatarURL() });

		await interaction.reply({ embeds: [embed] });
	},
};