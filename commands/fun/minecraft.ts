import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { randomColor } from '../../util/bananabread.js';

export const data = new SlashCommandBuilder()
    .setName('minecraft')
    .setDescription("Fetches a Minecraft user or server's information.")
    .addSubcommand(subcommand =>
        subcommand
            .setName('player')
            .setDescription("Fetches a Minecraft player's skin and profile.")
            .addStringOption(option =>
                option.setName('username')
                    .setDescription("The player's username")
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('server')
            .setDescription("Fetches a Minecraft server's status.")
            .addStringOption(option =>
                option.setName('ip')
                    .setDescription("The server's IP address")
                    .setRequired(true)
            )
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();

    try {
        if (subcommand === 'player') {
            const username = interaction.options.getString('username', true);
            const playerDbUrl = `https://playerdb.co/api/player/minecraft/${username}`;

            const response = await fetch(playerDbUrl);
            if (!response.ok) {
                await interaction.editReply(`Jinkies! Could not find a Minecraft player named "${username}".`);
                return;
            }

            const mcUserRes = await response.json() as any;
            const player = mcUserRes.data?.player;

            if (!player) {
                await interaction.editReply('Zoinks! Failed to retrieve player information.');
                return;
            }

            const mcUserSkinUrl = `https://crafatar.com/renders/body/${player.id}.png`;
            const skinResponse = await fetch(mcUserSkinUrl);

            if (!skinResponse.ok) {
                await interaction.editReply('Yikes! Failed to retrieve the player skin.');
                return;
            }

            const arrayBuffer = await skinResponse.arrayBuffer();
            const attachment = new AttachmentBuilder(Buffer.from(arrayBuffer), { name: 'skin.png' });

            const embed = new EmbedBuilder()
                .setAuthor({ name: player.username, iconURL: player.avatar })
                .setColor(randomColor())
                .setImage('attachment://skin.png');

            await interaction.editReply({ embeds: [embed], files: [attachment] });
        }

        if (subcommand === 'server') {
            const serverIp = interaction.options.getString('ip', true);
            const mcsrvstatUrl = `https://api.mcsrvstat.us/3/${serverIp}`;

            const response = await fetch(mcsrvstatUrl);
            if (!response.ok) {
                await interaction.editReply('Jinkies! Could not fetch server status.');
                return;
            }

            const server = await response.json() as any;

            if (!server.online) {
                await interaction.editReply(`Zoinks! The server \`${serverIp}\` is currently offline or unreachable.`);
                return;
            }

            const line1 = server.motd?.clean?.[0] || 'A Minecraft Server';
            const line2 = server.motd?.clean?.[1] || '';
            const description = line2 ? `**${line1}**\n${line2}` : `**${line1}**`;

            const minecraftServerIconApi = `https://api.mcsrvstat.us/icon/${serverIp}`;

            const embed = new EmbedBuilder()
                .setDescription(description)
                .setColor(randomColor())
                .addFields(
                    { name: 'Hostname', value: `${server.hostname || server.ip}`, inline: true },
                    { name: 'Version', value: `${server.version || 'Unknown'}`, inline: true },
                    { name: 'Players', value: `${server.players?.online ?? 0}/${server.players?.max ?? 0}`, inline: true },
                )
                .setThumbnail(minecraftServerIconApi);

            await interaction.editReply({ embeds: [embed] });
        }
    } catch (error) {
        console.error('Error executing minecraft command:', error);
        await interaction.editReply('Yikes! An unexpected error occurred while executing this command.');
    }
}