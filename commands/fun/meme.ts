import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { randomColor } from '../../util/bananabread.js';

export const data = new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Fetches a random trending meme from Reddit.')
    .addStringOption(option => 
        option.setName('subreddit')
            .setDescription('Optional: Specify a subreddit (e.g. wholesomememes, programmerhumor)')
            .setRequired(false)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const subredditInput = interaction.options.getString('subreddit');
    
    // strip any user-typed "r/" prefix and trim spaces
    const cleanSubreddit = subredditInput 
        ? encodeURIComponent(subredditInput.trim().replace(/^r\//i, '')) 
        : '';
    
    const apiUrl = cleanSubreddit 
        ? `https://meme-api.com/gimme/${cleanSubreddit}` 
        : 'https://meme-api.com/gimme';

    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            await interaction.editReply(
                subredditInput 
                    ? `Could not find any memes in \`r/${cleanSubreddit}\`. Make sure the subreddit exists and is public!`
                    : 'Could not connect to the meme service. Please try again later.'
            );
            return;
        }

        const data = await response.json() as any;
        const { title, url, postLink, author, subreddit, ups, nsfw } = data;

        const isNsfwChannel = (interaction.channel as any)?.nsfw ?? false;
        if (nsfw && !isNsfwChannel) {
            await interaction.editReply(
                '⚠️ The fetched meme was marked as NSFW, but this is a family-friendly channel! Please run the command again or try inside an NSFW channel.'
            );
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(randomColor())
            .setTitle(title || 'Look at this meme')
            .setURL(postLink)
            .setImage(url)
            .setFooter({ 
                text: `Meme by u/${author} on r/${subreddit} • 👍 ${ups.toLocaleString()} upvotes`,
                iconURL: interaction.user.displayAvatarURL()
            });

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error executing meme command:', error);
        await interaction.editReply('Yikes! An unexpected error occurred while fetching your meme.');
    }
}