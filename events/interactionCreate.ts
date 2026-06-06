import { ChatInputCommandInteraction, ClientEvents, Collection, Events, Interaction } from 'discord.js';

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, {
            execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
        }>;
    }
}

interface BotEvent {
    name: keyof ClientEvents;
    once?: boolean;
    execute: (interaction: Interaction) => Promise<void>;
}

const interactionCreate: BotEvent = {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        // only process chat input slash commands
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Yikes. An error occurred while executing ${interaction.commandName}:`);
            console.error(error);

            const errorMessage = 'There was an error while executing this command!';

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    },
};

export default interactionCreate;