import { ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from 'discord.js';

/**
 * Executes the "number" command, which generates a random number between 0-50 and 51-100,
 * prompts the user to guess the number, and provides hints if the guess is incorrect.
 * @param {ChatInputCommandInteraction} interaction - The interaction object representing the command invocation.
 * @returns {Promise<void>}
 */
export const data = new SlashCommandBuilder()
    .setName('number')
    .setDescription('Guess the random number between 0-100');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const min1 = 0;
    const max1 = 50;
    const min2 = 51;
    const max2 = 100;
    const num1 = Math.floor(Math.random() * (max1 - min1 + 1)) + min1;
    const num2 = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
    const answer = Math.floor(Math.random() * (num2 - num1 + 1)) + num1;
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Eridan\'s Game of Numbers')
        .setDescription('I\'m thinking of a number between my buttocks. Do you know what it is?')
        .setTimestamp();
    await interaction.reply({ embeds: [embed] });

    const channel = interaction.channel;
    if (!channel?.isTextBased()) {
        await interaction.followUp({ content: 'I can only run this game in text-based channels.' });
        return;
    }

    if (!('createMessageCollector' in channel)) {
        await interaction.followUp({ content: 'This channel does not support message collection.' });
        return;
    }

    const extractGuess = (content: string): number | null => {
        // ignore mention IDs (e.g. <@123...>) so "@Bot 65" parses as 65
        const withoutMentions = content.replace(/<@!?\d+>/g, ' ').trim();
        const matches = withoutMentions.match(/-?\d+/g);
        if (!matches || matches.length === 0) return null;

        const guess = Number.parseInt(matches[matches.length - 1], 10);
        if (Number.isNaN(guess)) return null;
        if (guess < 0 || guess > 100) return null;

        return guess;
    };

    const filter = (m: Message) => m.author.id === interaction.user.id && extractGuess(m.content) !== null;
    const collector = channel.createMessageCollector({ filter, time: 15000 });

    collector.on('collect', async (m: Message) => {
        const guess = extractGuess(m.content);
        if (guess === null) return;

        if (guess === answer) {
            const correctEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('Correct guess!')
                .setDescription(`Correct! And that number (${answer}) just so happens to be my credit score, which is between ${num1} and ${num2}.`)
                .setTimestamp();
            await interaction.followUp({ embeds: [correctEmbed] });
            collector.stop('guessed-correctly');
        } else {
            const direction = guess < answer ? 'Too low.' : 'Too high.';
            const wrongEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Wrong guess!')
                .setDescription(`${direction} Keep trying before time runs out.`)
                .setTimestamp();
            await interaction.followUp({ embeds: [wrongEmbed] });
        }
    });

    collector.on('end', (collected: { size: number }, reason: string) => {
        if (reason === 'time' && collected.size >= 0) {
            const timeoutEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Time\'s Up!')
                .setDescription(`The number was ${answer}`)
                .setTimestamp();
            interaction.followUp({ embeds: [timeoutEmbed] });
        }
    });
}
