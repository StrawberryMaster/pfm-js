import fs from 'fs';
import path from 'path';

const scripts = [
    { path: './deploy-commands.ts', log: './deploy-commands.log', name: 'deploy-commands.ts' },
    { path: './index.ts', log: './index.log', name: 'index.ts' },
];

scripts.forEach(script => {
    const logPath = path.resolve(__dirname, script.log);
    const fileContent = fs.readFileSync(logPath, 'utf-8');

    if (fileContent.length !== 0) {
        fs.writeFileSync(logPath, '');
        console.log(`The log file ${script.log} has been cleaned.`);
    } else {
        console.log(`The log file ${script.log} is already empty, skipping.`);
    }
});