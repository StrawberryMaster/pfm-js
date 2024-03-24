import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { randomColor } from '../../util/bananabread';
import fetch from 'node-fetch';

/** 
 * Represents an interaction with a user.
 */
interface Interaction {
    user: {
        /**
         * Returns the URL of the user's avatar.
         */
        avatarURL: () => string;
    };
    /**
     * Sends a reply to the interaction.
     * @param message - The message to send as a reply.
     */
    reply: (message: { embeds: EmbedBuilder[] }) => Promise<void>;
}

/**
 * Represents the response object for an advice slip.
 */
interface AdviceResponse {
    slip: {
        advice: string;
    };
}

export const data = new SlashCommandBuilder()
    .setName('advice')
    .setDescription('Get some advice');

export async function execute(interaction: Interaction): Promise<void> {
    try {
        const response = await fetch('https://api.adviceslip.com/advice');
        if (!response.ok) {
            throw new Error('Failed to fetch advice. Network error? ${response.status}');
        }
        const data = (await response.json()) as AdviceResponse;
        const embed = new EmbedBuilder()
            .setColor(randomColor())
            .setTitle('Advice of the day')
            .setDescription(data.slip.advice)
            .setTimestamp()
            .setFooter({ text: 'Use /advice to get a new advice.', iconURL: interaction.user.avatarURL() });

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error('Failed to fetch advice:', error);
    }
}