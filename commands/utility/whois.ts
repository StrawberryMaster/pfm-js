import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { randomColor } from '../../util/bananabread.js';

const DISCORD_BADGES: Record<string, string> = {
    Staff: '💼 Staff',
    STAFF: '💼 Staff',
    Partner: '👑 Partner',
    PARTNER: '👑 Partner',
    Hypesquad: '🎟️ HypeSquad Events',
    HYPESQUAD: '🎟️ HypeSquad Events',
    BugHunterLevel1: '🐛 Bug Hunter Lvl 1',
    BUG_HUNTER_LEVEL_1: '🐛 Bug Hunter Lvl 1',
    BugHunterLevel2: '🐛 Bug Hunter Lvl 2',
    BUG_HUNTER_LEVEL_2: '🐛 Bug Hunter Lvl 2',
    HypeSquadOnlineHouse1: '🛡️ House of Bravery',
    HYPESQUAD_ONLINE_HOUSE_1: '🛡️ House of Bravery',
    HypeSquadOnlineHouse2: '💡 House of Brilliance',
    HYPESQUAD_ONLINE_HOUSE_2: '💡 House of Brilliance',
    HypeSquadOnlineHouse3: '⚖️ House of Balance',
    HYPESQUAD_ONLINE_HOUSE_3: '⚖️ House of Balance',
    PremiumEarlySupporter: '✨ Early Supporter',
    PREMIUM_EARLY_SUPPORTER: '✨ Early Supporter',
    VerifiedBot: '🤖 Verified Bot',
    VERIFIED_BOT: '🤖 Verified Bot',
    VerifiedDeveloper: '🛠️ Verified Developer',
    VERIFIED_DEVELOPER: '🛠️ Verified Developer',
    CertifiedModerator: '🛡️ Certified Moderator',
    CERTIFIED_MODERATOR: '🛡️ Certified Moderator',
    ActiveDeveloper: '💻 Active Developer',
    ACTIVE_DEVELOPER: '💻 Active Developer',
};

export const data = new SlashCommandBuilder()
    .setName('whois')
    .setDescription("Fetches a user's information. If no user is given, your own is displayed.")
    .addUserOption(option => 
        option.setName('target')
            .setDescription('The user to fetch details for')
            .setRequired(false)
    )
    .setDMPermission(true);

export async function execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('target') ?? interaction.user;
    const formatter = new Intl.ListFormat('en-US', { style: 'narrow', type: 'conjunction' });

    // verify if the command is run in a server and if the target is a member of that server
    const member = interaction.guild ? interaction.guild.members.cache.get(user.id) : null;

    // resolve details that belong to User vs GuildMember
    const nickname = member?.nickname || user.username;
    const createdTimestamp = Math.floor(user.createdTimestamp / 1000);

    const embed = new EmbedBuilder()
        .setColor(randomColor())
        .setTitle(`${user.username}`)
        .setThumbnail(user.displayAvatarURL({ size: 2048, extension: 'png' }))
        .setDescription(`**ID:** ${user.id}`)
        .addFields(
            { name: 'System user', value: user.system ? '🟢 Yes' : '🔴 No', inline: true },
            { name: 'Nickname', value: nickname, inline: true },
            { name: 'Type', value: user.bot ? '🤖 Bot' : '👤 Human', inline: true },
            { name: 'Created on', value: `<t:${createdTimestamp}:F>\n(<t:${createdTimestamp}:R>)`, inline: true }
        );

    // if the lookup is in a server and the target is a member, display server-specific fields
    if (member) {
        const boostingTimestamp = member.premiumSince ? Math.floor(member.premiumSince.getTime() / 1000) : null;
        const boostingText = boostingTimestamp ? `🚀 Since <t:${boostingTimestamp}:d>` : 'Not boosting';
        
        const joinedTimestamp = Math.floor(member.joinedAt!.getTime() / 1000);

        // filter out @everyone role, and slice the array to prevent overflow visual bugs
        const filteredRoles = member.roles.cache.filter(role => role.id !== interaction.guildId);
        let rolesDisplay = 'No roles';
        
        if (filteredRoles.size > 0) {
            const maxRolesToDisplay = 10;
            const rolesArray = Array.from(filteredRoles.values());
            
            rolesDisplay = rolesArray.slice(0, maxRolesToDisplay).map(role => `${role}`).join(' ');
            
            if (rolesArray.length > maxRolesToDisplay) {
                rolesDisplay += ` and **${rolesArray.length - maxRolesToDisplay}** more`;
            }
        }

        embed.addFields(
            { name: 'Boosting', value: boostingText, inline: true },
            { name: 'Joined at', value: `<t:${joinedTimestamp}:F>\n(<t:${joinedTimestamp}:R>)`, inline: true },
            { name: 'Roles  ', value: rolesDisplay, inline: false }
        );
    }

    // retrieve user flags and map to badges
    const userFlags = user.flags?.toArray() || [];
    const badges = userFlags.map(flag => DISCORD_BADGES[flag]).filter(Boolean);
    const badgesDisplay = badges.length ? formatter.format(badges) : 'None';

    embed.addFields({ name: 'Badges', value: badgesDisplay, inline: true });

    await interaction.reply({ embeds: [embed] });
}