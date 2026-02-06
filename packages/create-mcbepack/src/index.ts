#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import pc from "picocolors";
import { collectProjectInfo } from "./utils/collect-info";
import { generateFileList } from "./utils/generate-files";
import { createFiles, previewFiles } from "./utils/create-files";
import prompt from "./prompt";

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
            console.log(`  ${pc.cyan("2.")} Start developing your project\n`);
        }

        if (config.script?.enabled) {
            console.log(pc.dim("Available commands:"));
            console.log(pc.dim("   • bun run dev    - Start development server"));
            console.log(pc.dim("   • bun run build:zip  - Build project"));
            console.log(pc.dim("   • bun run build:mcpack  - Build project"));
            console.log(pc.dim("   • bun run build:addon  - Build project"));
        } else {
            console.log(pc.dim("Available commands:"));
            console.log(pc.dim("   • bun run build:zip  - Build project"));
            console.log(pc.dim("   • bun run build:mcpack  - Build project"));
            console.log(pc.dim("   • bun run build:addon  - Build project"));
        }

    } catch (error) {
        console.error(pc.red("\nError occurred:"), error);
        process.exit(1);
    }
}

main();