import { codeBlock, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { randomColor } from '../../util/bananabread';

/**
 * Represents an interaction with a user.
 */
interface Interaction {
    createdTimestamp: number;
    client: { ws: { ping: number } };
    user: { avatarURL: () => string };
    reply: (content: any) => Promise<void>;
}

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with the latency of the bot.');

export async function execute(interaction: Interaction) {
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
}