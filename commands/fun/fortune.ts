
import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { randomColor } from '../../util/bananabread';
import { quotes } from '../../data/fortunequotes';

interface Quote {
    quote: string;
    author: string;
}

export const data = new SlashCommandBuilder()
    .setName('fortune')
    .setDescription('Sends a random quote from a list of quotes.');

export async function execute(interaction: CommandInteraction) {
    const randomQuote: Quote = quotes[Math.floor(Math.random() * quotes.length)];
    const embed = new EmbedBuilder()
        .setColor(randomColor())
        .setTitle('Fortune of the day')
        .setDescription(`"${randomQuote.quote}"`)
        .addFields({ name: 'Author', value: randomQuote.author })
        .setTimestamp()
        .setFooter({ text: 'Use /fortune to get a new quote.', iconURL: interaction.user.avatarURL() ?? undefined });

    await interaction.reply({ embeds: [embed] });
}