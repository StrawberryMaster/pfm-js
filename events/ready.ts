import { Client, User } from 'discord.js';

interface ExecuteFunction {
  (client: Client): void;
}

interface Module {
  name: string;
  once: boolean;
  execute: ExecuteFunction;
}

const module: Module = {
  name: 'ready',
  once: true,
  execute(client: Client) {
    console.log(`Up and ready to go! Logged in as ${(client.user as User).tag}.`);
  },
};

export default module;