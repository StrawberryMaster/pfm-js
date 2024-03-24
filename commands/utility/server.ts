import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('server')
    .setDescription('Provides information about the server you\'re in');

export async function execute(interaction: CommandInteraction) {
    await interaction.reply(`My crystal ball says you're in ${interaction.guild?.name}, which has ${interaction.guild?.memberCount} members.`);
};