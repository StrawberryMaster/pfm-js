import { spawn, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import readline from 'node:readline';

const DEPLOY_PATH = path.join(import.meta.dir, 'deploy-commands.ts'); 
const INDEX_PATH = path.join(import.meta.dir, 'index.ts');

const DEPLOY_LOG = path.join(import.meta.dir, 'deploy-commands.log');
const INDEX_LOG = path.join(import.meta.dir, 'index.log');

let botProcess: ChildProcess | null = null;
let botOutStream: fs.WriteStream | null = null;

function createWriteStream(outputPath: string): fs.WriteStream {
  const outStream = fs.createWriteStream(outputPath, { flags: 'a' });
  outStream.on('error', (err) => console.error(`Error creating write stream: ${err.message}`));
  return outStream;
}

async function handleDataStream(dataStream: Readable, outStream: fs.WriteStream, scriptName: string): Promise<void> {
  try {
    for await (const chunk of dataStream) {
      const now = new Date().toISOString();
      outStream.write(`[${now}] [${scriptName}] ${chunk}`);
    }
  } catch (err: any) {
    console.error(`Stream reading error on ${scriptName}: ${err.message}`);
  }
}

async function runDeploy(): Promise<boolean> {
  console.log('\n--- Deploying commands... ---');
  return new Promise((resolve) => {
    const deployProcess = spawn('bun', [DEPLOY_PATH]);
    const outStream = createWriteStream(DEPLOY_LOG);

    handleDataStream(deployProcess.stdout!, outStream, 'deploy-commands.ts');
    handleDataStream(deployProcess.stderr!, outStream, 'deploy-commands.ts');

    deployProcess.on('close', (code: number | null) => {
      outStream.end();
      if (code === 0) {
        console.log('✅ Slash commands updated');
        resolve(true);
      } else {
        console.error(`❌ Slash command deployment failed (exit code: ${code}). See: ${DEPLOY_LOG}`);
        resolve(false);
      }
    });
  });
}

async function startBot(): Promise<void> {
  if (botProcess) {
    console.log('Y\'know, this bot is already running.');
    return;
  }

  console.log('\n--- Booting PFM... ---');
  botProcess = spawn('bun', [INDEX_PATH]);
  botOutStream = createWriteStream(INDEX_LOG);

  handleDataStream(botProcess.stdout!, botOutStream, 'index.ts');
  handleDataStream(botProcess.stderr!, botOutStream, 'index.ts');

  console.log('🚀 index.ts started successfully');
  console.log('👉 Psst: here are vailable commands:');
  console.log('   "rs" or "reload"   - Restart the bot process');
  console.log('   "deploy"           - Stop bot, redeploy slash commands, and restart');
  console.log('   "stop" or "exit"   - Safely shut down the bot and exit\n');

  botProcess.on('close', (code: number | null) => {
    if (botProcess) {
      console.log(`⚠️ index.ts exited unexpectedly with code ${code}`);
      botProcess = null;
    }
  });
}

async function stopBot(): Promise<void> {
  if (!botProcess) return;

  console.log('Stopping bot process...');
  const processToKill = botProcess;
  botProcess = null;

  return new Promise<void>((resolve) => {
    processToKill.once('close', () => {
      if (botOutStream) {
        botOutStream.end();
        botOutStream = null;
      }
      console.log('🛑 Bot process stopped');
      resolve();
    });

    processToKill.kill('SIGINT');

    setTimeout(() => {
      try {
        processToKill.kill('SIGKILL');
      } catch {}
    }, 3000);
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', async (line: string) => {
  const input = line.trim().toLowerCase();

  switch (input) {
    case 'rs':
    case 'reload':
    case 'restart':
      await stopBot();
      await startBot();
      break;

    case 'deploy':
      await stopBot();
      const deploySuccess = await runDeploy();
      if (deploySuccess) {
        await startBot();
      } else {
        console.log('Bot was not restarted due to deployment errors.');
      }
      break;

    case 'stop':
    case 'exit':
    case 'shutdown':
      console.log('Shutting down bootstrapper...');
      await stopBot();
      rl.close();
      process.exit(0);
      break;

    default:
      console.log('Unknown command. Try: "rs" (restart), "deploy", or "stop" (exit).');
      break;
  }
});

const initialDeploySuccess = await runDeploy();
if (initialDeploySuccess) {
  await startBot();
} else {
  console.warn('⚠️ Starting bot with last known deployed command registry due to deployment failure');
  await startBot();
}