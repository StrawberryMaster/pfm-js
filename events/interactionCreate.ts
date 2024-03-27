import { Interaction, ClientEvents } from 'discord.js';

type Command = {
    execute: (interaction: Interaction) => Promise<void>;
};

type Commands = {
    get: (name: string) => Command | undefined;
};

type Client = {
    commands: Commands;
};

interface InteractionCreate {
    name: keyof ClientEvents;
    execute: (interaction: Interaction) => Promise<void>;
}

const interactionCreate: InteractionCreate = {
    name: "interactionCreate",
    async execute(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        const command = (interaction.client as unknown as Client).commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(`Yikes. An error occurred while executing ${interaction.commandName}.`);
            console.error(error);
        }
    },
};

export default interactionCreate;