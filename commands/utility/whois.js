// Attribution goes to https://github.com/skillzl/eres/blob/main/commands/utils/whois.js for the original code
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { randomColor } = require('../../util/bananabread.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whois')
		.setDescription('Fetches a user\'s information. If no user is given, your own information will be displayed')
		.addUserOption(option => option.setName('target').setDescription('The user')
			.setRequired(false))
		.setDMPermission(true),
	async execute(interaction) {
		const user = interaction.options.getUser('target') || interaction.user;
		const formatter = new Intl.ListFormat('en-US', { style: 'narrow', type: 'conjunction' });

		function daysAgo(time) {
			const today = new Date();
			const createdOn = new Date(time);
			const msInDay = 24 * 60 * 60 * 1000;

			createdOn.setHours(0, 0, 0, 0);
			today.setHours(0, 0, 0, 0);

			const diff = (+today - +createdOn) / msInDay;

			return diff;
		}

		const DISCORD_BADGES = {
			STAFF: '<:staff_badge:1139567579371946064>',
			PARTNER: '<:partner_badge:1139567761287282698>',
			HYPESQUAD: '<:hypesquad_badge:1139568237764427806>',
			BUG_HUNTER_LEVEL_1: '<:bughunter_level1_badge:1139571311534931978>',
			BUG_HUNTER_LEVEL_2: '<:bughunter_level2_badge:1139571316542947468>',
			HYPESQUAD_ONLINE_HOUSE_1: '<:house1_badge:1139571326621843496>',
			HYPESQUAD_ONLINE_HOUSE_2: '<:house2_badge:1139571331671793685>',
			HYPESQUAD_ONLINE_HOUSE_3: '<:house3_badge:1139571337136963695>',
			PREMIUM_EARLY_SUPPORTER: '<:early_supporter_badge:1139571489671229631>',
			SYSTEM: '<:system_badge:1139571345039036487>',
			VERIFIED_BOT: '<:verified_bot_badge:1139571349262696509>',
			VERIFIED_DEVELOPER: '<:verified_developer_badge:1139571354325237790>',
			CERTIFIED_MODERATOR: '<:certified_moderator_badge:1139571322368835685>',
			ACTIVE_DEVELOPER: '<:active_developer_badge:1139571306313039872>',
		};

		const member = interaction.guild.members.cache.get(user.id);
		const roles = member.roles.cache.map(r => `${r}`).join(' ').substring(0, 248);

		const _createdAt = new Date(user.createdAt);
		const _joinedAt = new Date(member.joinedAt);

		const userFlags = user.flags.toArray();

		const embed = new EmbedBuilder()
			.setColor(randomColor())
			.setTitle(`${user.username}`)
			.setThumbnail(user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'png' }))
			.setDescription(`ID: ${user.id}`)
			.addFields(
				{ name: 'SYSTEM USER', value: user.system ? ':green_square' : ':red_square:', inline: true },
				{ name: 'NICKNAME', value: user.nickname ? user.nickname : user.username, inline: true },
				{ name: 'BOOSTING?', value: user.premiumSince?.toLocaleDateString('en-US') || 'Not boosting', inline: true },
				{ name: 'ROLES', value: roles, inline: true },
				{ name: 'TYPE', value: user.bot ? 'Bot' : 'Human', inline: true },
				{ name: 'BADGES', value: userFlags.length ? formatter.format(userFlags.map(flag => `${DISCORD_BADGES[flag]}`)) : 'None', inline: true },
				{ name: 'CREATED ON', value: `<t:${Math.floor(_createdAt / 1000) + 3600}:F>` + `\n${daysAgo(user.createdAt).toFixed(0)} (days ago)`, inline: true },
				{ name: 'JOINED AT', value: `<t:${Math.floor(_joinedAt / 1000) + 3600}:F>` + `\n${daysAgo(member.joinedAt).toFixed(0)} (days ago)`, inline: true },
			);

		await interaction.reply({ embeds: [embed] });

	},
};