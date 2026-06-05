import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { cyrb53a, randomColor } from '../../util/bananabread.js';

const responses: string[] = [
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes - definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Yes.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    'Don\'t count on it.',
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'Very doubtful.',
    'No.',
    'Absolutely not.',
    'Don\'t even think about it.',
];

export const data = new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8-ball a question.')
    .addStringOption(option =>
        option.setName('question')
            .setDescription('The question you want to ask the 8-ball.')
            .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const question = interaction.options.getString('question', true);

    // normalize the question to ensure slight formatting differences yield the same response
    const seed = cyrb53a(question.toLowerCase().trim());
    const response = responses[seed % responses.length];

    const embed = new EmbedBuilder()
        .setColor(randomColor())
        .setTitle('🔮 The Magic 8-Ball')
        .addFields(
            { name: 'Your question', value: question, inline: false },
            { name: 'The 8-Ball says', value: `💬 **${response}**`, inline: false }
        )
        .setTimestamp()
        .setFooter({ 
            text: `Asked by ${interaction.user.username}`, 
            iconURL: interaction.user.displayAvatarURL()
        });

    await interaction.reply({ embeds: [embed] });
}