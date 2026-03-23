import fs from "fs/promises";
import path from "path";
import enquirer from "enquirer";

export async function getSkinPath() {
    const files = await fs.readdir(process.cwd());
    const pngFiles = files.filter(file => file.endsWith('.png'));
    if (pngFiles.length === 0) {
        console.error('No .png files found in the current directory');
        process.exit(1);
    }
    const { skinFile } = await enquirer.prompt<{ skinFile: string }>({
        type: 'select',
        name: 'skinFile',
        message: 'Which skin do you want to use?',
        choices: pngFiles
    });
    return path.resolve(process.cwd(), skinFile);
}

export async function getSkinBase64(filePath: string) {
    const buffer = await fs.readFile(filePath);
    return `data:image/png;base64,${buffer.toString('base64')}`;
}