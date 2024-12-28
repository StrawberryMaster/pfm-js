import { EmbedBuilder, SlashCommandBuilder, TextChannel } from 'discord.js';
import { CommandInteraction, Message } from 'discord.js';

/**
 * Executes the "number" command, which generates a random number between 0-50 and 51-100,
 * prompts the user to guess the number, and provides hints if the guess is incorrect.
 * @param {CommandInteraction} interaction - The interaction object representing the command invocation.
 * @returns {Promise<void>}
 */
export const data = new SlashCommandBuilder()
    .setName('number')
    .setDescription('Guess the random number between 0-100');

export async function execute(interaction: CommandInteraction): Promise<void> {
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

    const filter = (m: Message) => !isNaN(Number(m.content)) && m.author.id === interaction.user.id;
    const collector = (interaction.channel as TextChannel)?.createMessageCollector({ filter, time: 15000 });

    collector?.on('collect', (m: Message) => {
        const guess = parseInt(m.content);
        if (guess === answer) {
            const correctEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('Correct guess!')
                .setDescription(`Correct! And that number (${answer}) just so happens to be my credit score, which is between ${num1} and ${num2}.`)
                .setTimestamp();
            interaction.followUp({ embeds: [correctEmbed] });
            collector.stop();
        } else {
            const wrongEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Wrong guess!')
                .setDescription('Incorrect! Here\'s a hint: it happens to be my credit score.')
                .setTimestamp();
            interaction.followUp({ embeds: [wrongEmbed] });
            collector.stop();
        }
    });

    collector?.on('end', collected => {
        if (collected.size === 0) {
            const timeoutEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Time\'s Up!')
                .setDescription(`The number was ${answer}`)
                .setTimestamp();
            interaction.followUp({ embeds: [timeoutEmbed] });
        }
    });
}
