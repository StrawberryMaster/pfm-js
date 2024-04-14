import path from 'path';

const scripts = [
    { path: './deploy-commands.ts', log: './deploy-commands.log', name: 'deploy-commands.ts' },
    { path: './index.ts', log: './index.log', name: 'index.ts' },
];

scripts.forEach(script => {
    const logPath = path.resolve(__dirname, script.log);
    const fileContent = Bun.file(logPath);

    if (fileContent.length !== 0) {
        Bun.write(logPath, '');
        console.log(`The log file ${script.log} has been cleaned.`);
    } else {
        console.log(`The log file ${script.log} is already empty, skipping.`);
    }
});