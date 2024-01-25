// Psst: as of 29-11-2023, zlib.createBrotliDecompress is not
// implemented in bun. This will only work on Node.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { randomColor } = require('../../util/bananabread.js');
const axios = require('axios');

function getOption(interaction, optionName) {
	return interaction.options.getString(optionName);
}

async function handleRequest(url, interaction) {
	try {
		return await axios.get(url);
	}
	catch (error) {
		if (error.response) {
			interaction.reply({ content: `${error.response.data.message}`, ephemeral: true });
		}
		else if (error.request) {
			interaction.reply({ content: 'There was an error making the request.', ephemeral: true });
		}
		else {
			interaction.reply({ content: 'An unexpected error occurred.', ephemeral: true });
		}
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('minecraft')
		.setDescription('Fetches a Minecraft user or server\'s information.')
		.addStringOption(option =>
			option.setName('player')
				.setDescription('A player\'s username'))
		.addStringOption(option =>
			option.setName('server')
				.setDescription('A server\'s IP address')),
	async execute(interaction) {
		const minecraftUser = getOption(interaction, 'player');
		const minecraftServer = getOption(interaction, 'server');

		if (minecraftUser) {
			const minecraftUserApi = `https://playerdb.co/api/player/minecraft/${minecraftUser}`;
			const mcUserRes = await handleRequest(minecraftUserApi, interaction);

			const player = mcUserRes.data.data.player;

			if (player) {
				const mcUserSkin = `https://crafatar.com/renders/body/${player.id}`;
				const embed = new EmbedBuilder()
					.setAuthor({ name: player.username, iconURL: player.avatar })
					.setColor(randomColor())
					.setImage(mcUserSkin);

				await interaction.reply({ embeds: [embed] });
			}
		}

		if (minecraftServer) {
			const minecraftServerApi = `https://api.mcsrvstat.us/3/${minecraftServer}`;
			const mcServerRes = await handleRequest(minecraftServerApi, interaction);

			const minecraftServerIconApi = `https://api.mcsrvstat.us/icon/${minecraftServer}`;
			console.log(minecraftServerIconApi);

			const server = mcServerRes.data;

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
	},
};