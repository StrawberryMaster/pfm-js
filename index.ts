/* SM from the future: you're probably a dummy and forgot
 * how to run this. So here's a reminder: bun index.ts,
 * or 'bun .' You're welcome.
 * Bonus: you can also run bun boot.ts */

// Require the necessary discord.js classes
const { Client } = require('discord.js');
import fs from 'fs';
import path from 'path';
import { token } from './config.json';
import { Collection, GatewayIntentBits } from 'discord.js';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Set up the commands collection
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Loop over all the files in the commands folder and set them as commands
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.js') || file.endsWith('.ts'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
        else {
			console.error(`Zoinks: a command @ ${filePath} is missing a required data or execute property.`);
		}
    }
}

// Set up the events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file: string) => file.endsWith('.ts') || file.endsWith('.js'));

(async () => {
  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(filePath);
    if (event.default.once) {
      client.once(event.default.name, (...args: any) => event.default.execute(...args));
    }
    else {
      client.on(event.default.name, (...args: any) => event.default.execute(...args));
    }
  }
})();
// Log in to Discord with your client's token
client.login(token);