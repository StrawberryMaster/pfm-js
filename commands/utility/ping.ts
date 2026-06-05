import { codeBlock, EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { randomColor } from '../../util/bananabread';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with the bot\'s latency metrics.');

export async function execute(interaction: ChatInputCommandInteraction) {
    // send an initial placeholder response
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });

    // calculate the difference between Discord's generation timestamps
    const apiLatency = sent.createdTimestamp - interaction.createdTimestamp;
    
    // retrieve the WebSocket gateway connection heartbeat
    const gatewayLatency = interaction.client.ws.ping;

    const embed = new EmbedBuilder()
        .setColor(randomColor())
        .setTitle('Pong! :ping_pong:')
        .addFields([
            {
                name: 'API latency',
                value: codeBlock(`${apiLatency}ms`),
                inline: true,
            },
            {
                name: 'Gateway latency',
                value: codeBlock(`${gatewayLatency}ms`),
                inline: true,
            }
        ])
        .setTimestamp()
        .setFooter({ text: 'Use /ping to retry.', iconURL: interaction.user.displayAvatarURL() });

    await interaction.editReply({ content: '', embeds: [embed] });
}