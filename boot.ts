import { spawn } from 'child_process';
import fs, { WriteStream } from 'fs';

function runScript(scriptPath: string, outputPath: string, scriptName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn('node', [scriptPath]);
    const outStream: WriteStream = fs.createWriteStream(outputPath, { flags: 'a' });

    process.stdout?.pipe(outStream);
    process.stderr?.pipe(outStream);

    console.log(`${scriptName} started successfully.`);

    process.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`[JINKIES] Process exited with code ${code}.`));
      }
      resolve();
    });
  });
}

Promise.all([
  runScript('./deploy-commands.js', './deploy-commands.log', 'deploy-commands.js'),
  runScript('./index.js', './index.log', 'index.js'),
]).catch((error) => console.error(`Error: ${error.message}`));