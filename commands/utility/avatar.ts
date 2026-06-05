// Attribution goes to from github.com/necrydark/Makima/master/commands/avatar.js
// for the inspiration/original version

import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { randomColor } from '../../util/bananabread.js';

export const data = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get the avatar URL of the selected user, or your own avatar.')
    .addUserOption(option => 
        option.setName('target')
            .setDescription("The user's avatar to show")
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const targetUser = interaction.options.getUser('target') ?? interaction.user;

    try {
        // get the avatar URL
        const avatarUrl = targetUser.displayAvatarURL({ size: 1024 });

        // fetch the image to capture a snapshot of the current avatar
        const response = await fetch(avatarUrl);
        if (!response.ok) {
            await interaction.editReply('Jinkies!Failed to download the avatar image.');
            return;
        }

        const arrayBuffer = await response.arrayBuffer();
        
        // determine the correct extension for the persistent attachment
        const isAnimated = targetUser.avatar?.startsWith('a_') ?? false;
        const filename = `avatar.${isAnimated ? 'gif' : 'png'}`;
        
        const attachment = new AttachmentBuilder(Buffer.from(arrayBuffer), { name: filename });

        // generate individual format download links
        const pngUrl = targetUser.displayAvatarURL({ extension: 'png', size: 1024 });
        const webpUrl = targetUser.displayAvatarURL({ extension: 'webp', size: 1024 });
        const jpgUrl = targetUser.displayAvatarURL({ extension: 'jpeg', size: 1024 });
        
        let downloadLinks = `[.png](${pngUrl}) | [.webp](${webpUrl}) | [.jpg](${jpgUrl})`;
        
        // add a GIF link only if the avatar is actually animated
        if (isAnimated) {
            const gifUrl = targetUser.displayAvatarURL({ extension: 'gif', size: 1024 });
            downloadLinks += ` | [.gif](${gifUrl})`;
        }

        const embed = new EmbedBuilder()
            .setTitle(`:frame_photo: **${targetUser.username}'s avatar**`)
            .setColor(randomColor())
            // point the embed image to our local attachment to lock it in forever
            .setImage(`attachment://${filename}`)
            .addFields({ name: 'Image links for download', value: downloadLinks })
            .setFooter({ 
                text: `Requested by: ${interaction.user.username}`, 
                iconURL: interaction.user.displayAvatarURL({ extension: 'png' }) 
            });

        await interaction.editReply({ embeds: [embed], files: [attachment] });
    } catch (error) {
        console.error('Error executing avatar command:', error);
        await interaction.editReply('Zoinks! An unexpected error occurred while fetching the avatar.');
    }
}