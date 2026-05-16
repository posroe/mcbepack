#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

import pc from "picocolors";

import prompt from "./prompt.js";
import { collectProjectInfo } from "./utils/collect-info.js";
import { createFiles, previewFiles } from "./utils/create-files.js";
import { generateFileList } from "./utils/generate-files.js";

async function main() {
    try {
        console.log(pc.bold(pc.cyan("\nCreate MCBEPack\n")));

        const config = await collectProjectInfo();
        const files = generateFileList(config);

        previewFiles(files, config.name);

        console.log();
        const { confirmed } = await prompt.confirm({
            message: "Do you want to create this project?",
            default: true,
        });

        if (!confirmed) {
            console.log(pc.yellow("\nProject creation cancelled"));
            process.exit(0);
        }

        const projectRoot = path.join(process.cwd(), config.name);
        if (fs.existsSync(projectRoot)) {
            console.log(pc.red(`\nDirectory ${config.name} already exists`));
            process.exit(1);
        }

        createFiles(files);

        console.log(`\n${pc.green("Success!")} Created project ${pc.cyan(config.name)}`);
        console.log(pc.dim(`   at: ${projectRoot}\n`));

        console.log(pc.bold("Next steps:\n"));
        console.log(`  ${pc.cyan("1.")} cd ${config.name}`);

        if (config.script?.enabled) {
            console.log(`  ${pc.cyan("2.")} bun install`);
            console.log(`  ${pc.cyan("3.")} bun run dev\n`);
        } else {
            console.log(`  ${pc.cyan("2.")} bun install`);
            console.log(`  ${pc.cyan("3.")} Start developing your project\n`);
        }

        console.log(pc.dim("Available commands:"));
        if (config.script?.enabled) {
            console.log(pc.dim("   - bun run dev             - Start development server"));
            console.log(pc.dim("   - bun run update:stable   - Update Script API packages"));
        }
        console.log(pc.dim("   - bun run build           - Build project files"));
        console.log(pc.dim("   - bun run build:zip       - Build a .zip archive"));
        console.log(pc.dim("   - bun run build:mcpack    - Build .mcpack archive(s)"));
        console.log(pc.dim("   - bun run build:mcaddon   - Build a .mcaddon archive"));
    } catch (error) {
        console.error(pc.red("\nError occurred:"), error);
        process.exit(1);
    }
}

main();
