/* SM from the future: you're probably a dummy and forgot
 * how to run this. So here's a reminder: bun index.ts,
 * or 'bun .' You're welcome.
 * Bonus: you can also run bun boot.ts */

import fs from 'node:fs';
import path from 'node:path';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { token } from './config.json';

// extend Client so TypeScript recognizes the custom commands collection
class ExtendedClient extends Client {
  commands = new Collection<string, any>();
}

const client = new ExtendedClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const foldersPath = path.join(import.meta.dir, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Loop over all the files in the commands folder and set them as commands
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(
    (file: string) => file.endsWith('.js') || file.endsWith('.ts')
  );

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.error(`Zoinks: a command @ ${filePath} is missing a required data or execute property.`);
    }
  }
}

// Load events
const eventsPath = path.join(import.meta.dir, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(
  (file: string) => file.endsWith('.ts') || file.endsWith('.js')
);

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = await import(filePath);
  
  // fallback in case events are exported as named exports or default exports
  const eventModule = event.default || event;

  if (eventModule.once) {
    client.once(eventModule.name, (...args: any[]) => eventModule.execute(...args));
  } else {
    client.on(eventModule.name, (...args: any[]) => eventModule.execute(...args));
  }
}

// Log in to Discord
client.login(token);