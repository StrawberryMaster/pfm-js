// Attribution goes to https://github.com/skillzl/eres/blob/main/commands/utils/whois.js
// for the original code
import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, codeBlock } from 'discord.js';
import { randomColor } from '../../util/bananabread.js';
import figlet from 'figlet';

export const data = new SlashCommandBuilder()
    .setName('ascii')
    .setDescription('Converts text to ASCII art.')
    .addStringOption(option => 
        option.setName('text')
            .setDescription('The text to convert (max 20 characters for best display)')
            .setRequired(true)
            .setMaxLength(20)
    );

function generateAscii(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
        figlet(text, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data ?? '');
            }
        });
    });
}

export async function execute(interaction: ChatInputCommandInteraction) {
    const text = interaction.options.getString('text', true);

    await interaction.deferReply();

    try {
        const artData = await generateAscii(text);

        if (artData.length > 2000) {
            await interaction.editReply('Well, uh, the generated ASCII art is too large to display cleanly on Discord.');
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(randomColor())
            .setTitle('Your ASCII art')
            .setDescription(codeBlock(artData))
            .setTimestamp()
            .setFooter({ 
                text: 'Use /ascii to generate new art.', 
                iconURL: interaction.user.displayAvatarURL()
            });

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error generating ASCII art:', error);
        await interaction.editReply('Jinkies! An error occurred while converting your text to ASCII.');
    }
}