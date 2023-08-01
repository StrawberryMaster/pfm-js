// Fortune - sends a random quote from a list of quotes. My favorite command! :D

const quotes = ['\'First thing that\'s different, no more Dad. He threatened to turn me into the government so I made him and the government go away." \n\- Rick Sanchez',
	'"My friend\'s name was Megatron and he had [...] three things you should demand to know of any powerful institution. [...] In whose interest do you exercise power? [...] To whom are you accountable? [...] How can we get rid of you?" \n\- Optimus Prime',
	'"Our enemies are innovative and resourceful, and so are we. They never stop thinking about new ways to harm our country and our people, and neither do we." \n\- George W. Bush',
	'"I want to see Fegelein at once! If he\'s gone AWOL, it\'s desertion! Treason! Bring me Fegelein! Fegelein! Fegelein!" \n\- Adolf Hitler',
	'"In \'The Lion, the Witch and the Wardrobe\', a bunch of hippies walk around and paint stuff. They eat lunch, and then they find a magical camel, which they have to eat to stay alive. And that\'s pretty much it. I give it a B-minus." \n\- Eric Cartman',
	'"I want death to find me planting my cabbages." \n\- Michel de Montaigne',
	'"Maybe I should just kill Mike. I\'m the chief of police, I could cover it up." \n\- Jim Hopper',
	'"See, baby, I got everything... Mink sheets... Mink coats... Mink curtains in the window. When I walk down the stairs, I\'m walking down on... mink carpet." \n\- Jizzy B',
	'"Nothing drives down real estate prices like a good old-fashioned gang war. Apart from an outbreak of plague, but that may be going too far in this case." \n\- Donald Love',
	'"I always look orange. And so do you. The light is the worst." \n\- Donald Trump',
	'"Tell me... Have you and JoJo kissed yet? I\'ll take that as a no. You thought your first kiss would be JoJo, but it was I, Dio!" \n\- Dio Brando',
	'"If you think nothing can get to you, you\'re lying to yourself. At best you\'re temporarily dead. A lightning bolt could re-animate you without a warning." \n\- Max Payne',
	'"I was thinking about why so many in the radical left participate in \'speedrunning\'. The reason is the left\'s lack of worth ethic... (\'go fast\' rather than \'do it right\') and, in a Petersonian sense... to elevate alternative sexual archetypes in the marketplace (\'fastest hedgehog\')... you\'re a beta male, Sonic." \n\- Shadow the Hedgehog',
	'"Welcome to Good Burger, home of the Good Burger. Can I take your order?" \n\- Ed, \'Good Burger\'',
	'"I\'m saving my earnings for an electron microscope! I\'ve only got nineteen thousand, four hundred and seventy-two dollars and eighteen cents to go!" \n\- Edd',
	'"Behold, the Melt-inator 6-5000! It has a melting capacity... of 7! That\'s on a scale from 1 to 5, so that\'s a big number." \n\- Dr. Heinz Doofenshmirtz'];

const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fortune')
		.setDescription('Sends a random quote from a list of quotes.'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Fortune of the day')
			.setDescription(quotes[Math.floor(Math.random() * quotes.length)])
			.setTimestamp()
			.setFooter({ text: 'Use /fortune to get a new quote.' });

		await interaction.reply({ embeds: [embed] });
	},
};