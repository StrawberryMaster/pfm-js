import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { randomColor } from '../../util/bananabread.js';

export const data = new SlashCommandBuilder()
    .setName('rickandmorty')
    .setDescription('Fetches a character from the Rick and Morty multiverse.')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('Optional: the name of a specific character to search for.')
            .setRequired(false)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const nameQuery = interaction.options.getString('name');

    try {
        let character: any = null;

        if (nameQuery) {
            const searchUrl = `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(nameQuery.trim())}`;
            const searchRes = await fetch(searchUrl);

            if (!searchRes.ok) {
                await interaction.editReply(`Could not find any character matching \`${nameQuery}\`. Try searching for someone else!`);
                return;
            }

            const searchData = await searchRes.json() as any;
            
            if (!searchData.results || searchData.results.length === 0) {
                await interaction.editReply(`No results found for \`${nameQuery}\`.`);
                return;
            }

            // grab the first match from the results array
            character = searchData.results[0];
        } else {
            // fetch the character base directory to read the dynamic total count
            const countRes = await fetch('https://rickandmortyapi.com/api/character');
            if (!countRes.ok) {
                await interaction.editReply('Failed to connect to the Rick and Morty database. Please try again later.');
                return;
            }
            const countData = await countRes.json() as any;
            const totalCount = countData.info?.count ?? 826;

            // select a random ID from the current pool of characters
            const randomId = Math.floor(Math.random() * totalCount) + 1;
            const randomUrl = `https://rickandmortyapi.com/api/character/${randomId}`;
            const randomRes = await fetch(randomUrl);

            if (!randomRes.ok) {
                await interaction.editReply('Failed to retrieve a random character. Try running the command again.');
                return;
            }

            character = await randomRes.json() as any;
        }

        if (!character) {
            await interaction.editReply('Could not fetch character details.');
            return;
        }

        // format a status visual indicator
        let statusString = '⚪ Unknown';
        const rawStatus = character.status?.toLowerCase();
        if (rawStatus === 'alive') statusString = '🟢 Alive';
        if (rawStatus === 'dead') statusString = '🔴 Dead';

        // resolve the title of their first appearance episode
        let firstEpisodeString = 'Unknown';
        if (character.episode && character.episode.length > 0) {
            try {
                const episodeRes = await fetch(character.episode[0]);
                if (episodeRes.ok) {
                    const episodeData = await episodeRes.json() as any;
                    firstEpisodeString = `${episodeData.episode} - "${episodeData.name}"`;
                }
            } catch {
                // if the episode API call fails, fallback to unknown
            }
        }

        const embed = new EmbedBuilder()
            .setColor(randomColor())
            .setTitle(character.name)
            .setURL(character.url || 'https://rickandmortyapi.com')
            .setImage(character.image)
            .addFields(
                { name: 'Status', value: statusString, inline: true },
                { name: 'Species', value: character.species || 'Unknown', inline: true },
                { name: 'Gender', value: character.gender || 'Unknown', inline: true },
                { name: 'Origin', value: character.origin?.name || 'Unknown', inline: true },
                { name: 'Last known location', value: character.location?.name || 'Unknown', inline: true },
                { name: 'First seen in', value: firstEpisodeString, inline: false }
            )
            .setTimestamp()
            .setFooter({ 
                text: 'powered by rickandmortyapi.com', 
                iconURL: interaction.user.displayAvatarURL() 
            });

        await interaction.editReply({ embeds: [embed] });

    } catch (error) {
        console.error('Error executing rickandmorty command:', error);
        await interaction.editReply('Great job, Jerry. An unexpected error occurred while traveling the multiverse.');
    }
}