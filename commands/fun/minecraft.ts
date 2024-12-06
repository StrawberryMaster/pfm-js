import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { randomColor } from '../../util/bananabread.js';
import axios, { ResponseType } from 'axios';

function getOption(interaction: any, optionName: string): string | null {
    return interaction.options.getString(optionName);
}

async function handleRequest(url: string, interaction: any, responseType: ResponseType = 'json'): Promise<any> {
    try {
        const response = await axios.get(url, { responseType });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            interaction.reply({ content: `${error.response.data.message}`, ephemeral: true });
        } else if (error.request) {
            interaction.reply({ content: 'There was an error making the request.', ephemeral: true });
        } else {
            interaction.reply({ content: 'An unexpected error occurred.', ephemeral: true });
        }
    }
}

export const data = new SlashCommandBuilder()
    .setName('minecraft')
    .setDescription('Fetches a Minecraft user or server\'s information.')
    .addStringOption(option =>
        option.setName('player')
            .setDescription('A player\'s username'))
    .addStringOption(option =>
        option.setName('server')
            .setDescription('A server\'s IP address'))

export async function execute(interaction: CommandInteraction) {
    const minecraftUser = getOption(interaction, 'player');
    const minecraftServer = getOption(interaction, 'server');

    if (minecraftUser) {
        const minecraftUserApi = `https://playerdb.co/api/player/minecraft/${minecraftUser}`;
        const mcUserRes = await handleRequest(minecraftUserApi, interaction);

        const player = mcUserRes.data.player;

        if (player) {
            const mcUserSkinUrl = `https://crafatar.com/renders/body/${player.id}.png`;
            const response = await handleRequest(mcUserSkinUrl, interaction, 'arraybuffer');
            const attachment = new AttachmentBuilder(Buffer.from(response, 'binary'), { name: 'skin.png' });
            const embed = new EmbedBuilder()
                .setAuthor({ name: player.username, iconURL: player.avatar })
                .setColor(randomColor())
                .setImage('attachment://skin.png');

            await interaction.reply({ embeds: [embed], files: [attachment] });
        }
    }

    if (minecraftServer) {
        const minecraftServerApi = `https://api.mcsrvstat.us/3/${minecraftServer}`;
        const mcServerRes = await handleRequest(minecraftServerApi, interaction);

        const minecraftServerIconApi = `https://api.mcsrvstat.us/icon/${minecraftServer}`;

        const server = mcServerRes;

        if (server.online === true) {
            const embed = new EmbedBuilder()
                .setDescription(`**${server.motd.clean[0]}** \n ${server.motd.clean[1]}`)
                .setColor(randomColor())
                .addFields(
                    { name: 'Hostname', value: `${server.hostname || server.ip}`, inline: true },
                    { name: 'Version', value: `${server.version}`, inline: true },
                    { name: 'Players', value: `${server.players.online}/${server.players.max}`, inline: true },
                )
                .setThumbnail(minecraftServerIconApi);

            await interaction.reply({ embeds: [embed] });
        }
    }
}