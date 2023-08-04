// Attribution goes to from github.com/necrydark/Makima/master/commands/avatar.js for the inspiration

const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { randomColor } = require('../../util/bananabread.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Get the avatar URL of the selected user, or your own avatar.')
		.addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		if (user) {
			const embed = new EmbedBuilder()
				.setTitle(`:frame_photo: **${user.username}'s avatar**`)
				.setColor(randomColor)
				.setImage(`${user.displayAvatarURL({ extension: 'png', size: 1024 })}`)
				.addFields(
					{ name: 'Image links for download', value: `[.png](${user.avatarURL({ format: 'png' })}) | [.webp](${user.avatarURL({ dynamic: true })}) | [.jpg](${user.avatarURL({ format: 'jpg' })}) | [.gif](${user.avatarURL({ format: 'gif' })})` },
				)
				// .setDescription(`[png](${user.avatarURL({ format: 'png'})}) | [Webp](${user.avatarURL({dynamic: true})}) | [jpg](${user.avatarURL({format:'jpg'})}) | [gif](${user.avatarURL({format: 'gif'})})`)
				.setFooter({ text: `Requested by: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

			return interaction.reply({ embeds: [embed] });
		}
		else {
			const embed = new EmbedBuilder()
				.setTitle(`:frame_photo: **${interaction.user.username}'s avatar**`)
				.setColor(randomColor)
				.setImage(`${interaction.user.displayAvatarURL({ extension: 'png', size: 1024 })}`)
				.addFields(
					{ name: 'Image links (for download)', value: `[.png](${interaction.user.avatarURL({ format: 'png' })}) | [.webp](${interaction.user.avatarURL({ dynamic: true })}) | [.jpg](${interaction.user.avatarURL({ format: 'jpg' })}) | [.gif](${interaction.user.avatarURL({ format: 'gif' })})` },
				)
				// .setDescription(`[png](${interaction.user.avatarURL({ format: 'png'})}) | [Webp](${interaction.user.avatarURL({dynamic: true})}) | [jpg](${interaction.user.avatarURL({format:'jpg'})}) | [gif](${interaction.user.avatarURL({format: 'gif'})})`)
				.setFooter({ text: `Requested by: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

			return interaction.reply({ embeds: [embed] });
		}
	},
};