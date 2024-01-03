import { spawn } from 'child_process';
import fs, { WriteStream } from 'fs';

async function runScript(scriptPath: string, outputPath: string, scriptName: string): Promise<void> {
  const process = spawn('bun', [scriptPath]);
  const outStream = fs.createWriteStream(outputPath, { flags: 'a' });

  for await (const data of process.stdout) {
    const now = new Date().toISOString();
    outStream.write(`[${now}] [${scriptName}] ${data}`);
  }

  for await (const data of process.stderr) {
    const now = new Date().toISOString();
    outStream.write(`[${now}] [${scriptName}] ${data}`);
  }

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
  { path: './deploy-commands.ts', log: './deploy-commands.log', name: 'deploy-commands.ts' },
  { path: './index.ts', log: './index.log', name: 'index.ts' },
];

Promise.all(scripts.map(script => runScript(script.path, script.log, script.name)))
  .catch((error) => console.error(`Error: ${error.message}`));