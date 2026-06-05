import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { randomColor } from '../../util/bananabread.js';
import { quotes, type Quote } from '../../data/fortunequotes.js';

export const data = new SlashCommandBuilder()
    .setName('fortune')
    .setDescription('Sends a random quote from a list of quotes.');

export async function execute(interaction: ChatInputCommandInteraction) {
    const randomQuote: Quote = quotes[Math.floor(Math.random() * quotes.length)];

    const embed = new EmbedBuilder()
        .setColor(randomColor())
        .setTitle('🔮 Fortune of the day')
        .setDescription(`*"${randomQuote.quote}"*\n\n— **${randomQuote.author}**`)
        .setTimestamp()
        .setFooter({ 
            text: 'Use /fortune to get a new quote.', 
            iconURL: interaction.user.displayAvatarURL() 
        });

    await interaction.reply({ embeds: [embed] });
}