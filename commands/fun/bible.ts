import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { randomColor } from '../../util/bananabread';
import * as fs from 'fs';
import * as path from 'path';

const biblePath = path.join(process.cwd(), './data/bible.txt');
let bibleWords: Set<string> = new Set();

try {
    const fileContent = fs.readFileSync(biblePath, 'utf8');
    const words = JSON.parse(fileContent);
    bibleWords = new Set(words.map((word: string) => word.toLowerCase()));
} catch (error) {
    console.error(`Error reading or parsing bible.txt: ${error}`);
}

export const data = new SlashCommandBuilder()
    .setName('bible')
    .setDescription('Check how many words in your message are in the Bible')
    .addStringOption(option =>
        option.setName('text')
            .setDescription('The text to check')
            .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const text = interaction.options.getString('text', true);

    const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, '');
    const words = normalizedText.split(/\s+/).filter(word => word.length > 0);

    if (words.length === 0) {
        await interaction.reply('Your message is empty or contains no valid words.');
        return;
    }

    const bibleMatches = words.filter(word => bibleWords.has(word));
    const bibleWordsCount = bibleMatches.length;

    const hitRate = (bibleWordsCount / words.length) * 100;
    const hitRatePrint = hitRate.toFixed(2);

    const totalWords = words.length;
    const matchedWords = bibleMatches.length > 0
        ? bibleMatches.slice(0, 10).join(', ') + (bibleMatches.length > 10 ? '...' : '')
        : 'None';

    const embed = new EmbedBuilder()
        .setColor(randomColor())
        .setTitle('The Schlossberg-Märtens Bible Index')
        .setDescription(`${hitRatePrint}% of your message is in the Bible!`)
        .addFields(
            { name: 'Total words', value: totalWords.toString(), inline: true },
            { name: 'Words found', value: bibleWordsCount.toString(), inline: true },
            { name: 'Matched words', value: matchedWords, inline: false }
        )
        .setTimestamp()
        .setFooter({ text: 'Use /bible to check another message.', iconURL: interaction.user.avatarURL() ?? undefined });

    await interaction.reply({ embeds: [embed] });
}