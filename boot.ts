import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

function createWriteStream(outputPath: string): fs.WriteStream {
  const outStream = fs.createWriteStream(outputPath, { flags: 'a' });
  outStream.on('error', (err) => console.error(`Error creating write stream: ${err.message}`));
  return outStream;
}

async function handleDataStream(dataStream: Readable, outStream: fs.WriteStream, scriptName: string): Promise<void> {
  for await (const data of dataStream) {
    const now = new Date().toISOString();
    outStream.write(`[${now}] [${scriptName}] ${data}`);
  }
}

async function runScript(scriptPath: string, outputPath: string, scriptName: string): Promise<void> {
  const process = spawn('bun', [scriptPath]);
  const outStream = createWriteStream(outputPath);

  await Promise.all([
    handleDataStream(process.stdout, outStream, scriptName),
    handleDataStream(process.stderr, outStream, scriptName),
  ]);

  console.log(`${scriptName} started successfully.`);

  await new Promise<void>((resolve, reject) => {
    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Jinkies! ${scriptName} exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

const scripts = [
  { path: path.join(__dirname, 'deploy-commands.ts'), log: path.join(__dirname, 'deploy-commands.log'), name: 'deploy-commands.ts' },
  { path: path.join(__dirname, 'index.ts'), log: path.join(__dirname, 'index.log'), name: 'index.ts' },
];

Promise.all(scripts.map(script => runScript(script.path, script.log, script.name)))
  .catch((error) => console.error(`Error: ${error.message}`));
