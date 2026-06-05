import fs from 'node:fs';
import path from 'node:path';
import { REST, Routes } from 'discord.js';
import { clientId, token } from './config.json';

const commands = [];
const foldersPath = path.join(import.meta.dir, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(
        (file: string) => file.endsWith('.js') || file.endsWith('.ts')
    );

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        
        const command = await import(filePath);

        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.error(`Zoinks: a command @ ${filePath} is missing a required data or execute property.`);
        }
    }
}

const rest = new REST().setToken(token);

try {
    console.log(`Now refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
    ) as any[];

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
    console.error('Error deploying commands:', error);
}