import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { ownerId } from '../../config.json';

export const data = new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('Shuts down the bot. For testing only!');

export async function execute(interaction: CommandInteraction) {
    if (interaction.user.id !== ownerId) {
        return await interaction.reply('You are not authorized to use this command, bro. :angry:');
    }

    await interaction.reply('Shutting down... :compression:');
    process.exit();
};