import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, codeBlock } from 'discord.js';
import { randomColor } from '../../util/bananabread';

export const data = new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rolls one or more dice with optional modifiers and displays advanced calculations.')
    .addIntegerOption(option =>
        option.setName('sides')
            .setDescription('Number of sides on each die (e.g., 6, 20).')
            .setRequired(true)
            .setMinValue(2)
    )
    .addIntegerOption(option =>
        option.setName('amount')
            .setDescription('Number of dice to roll (default: 1).')
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(100)
    )
    .addIntegerOption(option =>
        option.setName('modifier')
            .setDescription('An integer to add or subtract from the total (e.g. +5, -3).')
            .setRequired(false)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const sides = interaction.options.getInteger('sides', true);
    const amount = interaction.options.getInteger('amount') ?? 1;
    const modifier = interaction.options.getInteger('modifier') ?? 0;

    // roll the dice
    const rolls: number[] = [];
    for (let i = 0; i < amount; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    // run all the fancy mathematical calculations
    const rawSum = rolls.reduce((acc, val) => acc + val, 0);
    const total = rawSum + modifier;

    const minPossible = amount + modifier;
    const maxPossible = (amount * sides) + modifier;
    const expectedValue = (amount * (sides + 1) / 2) + modifier;
    const actualAverage = rawSum / amount;

    // construct the formula string
    const modifierSign = modifier >= 0 ? '+' : '-';
    const absModifier = Math.abs(modifier);
    
    let formulaString = '';
    if (amount > 15) {
        formulaString = `(sum of ${amount} dice: ${rawSum})${modifier !== 0 ? ` ${modifierSign} ${absModifier}` : ''} = **${total}**`;
    } else {
        formulaString = `${rolls.join(' + ')}${modifier !== 0 ? ` ${modifierSign} ${absModifier}` : ''} = **${total}**`;
    }

    const embed = new EmbedBuilder()
        .setColor(randomColor())
        .setTitle(`:game_die: Rolled ${amount}d${sides}${modifier !== 0 ? `${modifier >= 0 ? '+' : ''}${modifier}` : ''}`)
        .setDescription(`## **Total: ${total}**`)
        .setTimestamp()
        .setFooter({ 
            text: 'Roll again with /roll.', 
            iconURL: interaction.user.displayAvatarURL()
        });

    // handle single vs multiple dice display elements
    if (amount > 1) {
        const rawRollsString = rolls.length > 25 
            ? `${rolls.slice(0, 25).join(', ')}... (+${rolls.length - 25} more)`
            : rolls.join(', ');

        embed.addFields(
            { name: 'Individual rolls', value: codeBlock(rawRollsString) },
            { name: 'Math formula', value: formulaString }
        );
    } else if (modifier !== 0) {
        embed.addFields({ name: 'Math formula', value: formulaString });
    }

    // add statistical analysis on screen
    embed.addFields(
        { 
            name: 'Range bounds', 
            value: `Minimum: **${minPossible}**\nMaximum: **${maxPossible}**`, 
            inline: true 
        },
        { 
            name: 'Expected value (avg)', 
            value: `Theoretical: **${expectedValue.toFixed(1)}**${amount > 1 ? `\nActual avg: **${actualAverage.toFixed(1)}**` : ''}`, 
            inline: true 
        }
    );

    await interaction.reply({ embeds: [embed] });
}