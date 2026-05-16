#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

import { color, logger } from "@mcbepack/common/logger";

import prompt from "./prompt.js";
import { collectProjectInfo } from "./utils/collect-info.js";
import { createFiles, previewFiles } from "./utils/create-files.js";
import { generateFileList } from "./utils/generate-files.js";

async function main() {
    try {
        logger.header("Create MCBEPack");

        const config = await collectProjectInfo();
        const files = generateFileList(config);

        previewFiles(files, config.name);

        logger.blank();
        const { confirmed } = await prompt.confirm({
            message: "Do you want to create this project?",
            default: true,
        });

        if (!confirmed) {
            logger.warn("Project creation cancelled");
            process.exit(0);
        }

        const projectRoot = path.join(process.cwd(), config.name);
        if (fs.existsSync(projectRoot)) {
            logger.error(`Directory ${config.name} already exists`);
            process.exit(1);
        }

        createFiles(files);

        logger.done(`Created project ${config.name}`);
        logger.field("Path", color.dim(projectRoot));

        logger.section("Next steps");
        logger.item(`${color.cyan("1.")} cd ${config.name}`);

        if (config.script?.enabled) {
            logger.item(`${color.cyan("2.")} bun install`);
            logger.item(`${color.cyan("3.")} bun run dev`);
        } else {
            logger.item(`${color.cyan("2.")} bun install`);
            logger.item(`${color.cyan("3.")} Start developing your project`);
        }

        logger.section("Available commands");
        if (config.script?.enabled) {
            logger.info("bun run dev             - Start development server");
            logger.info("bun run update:stable   - Update Script API packages");
        }
        logger.info("bun run build           - Build project files");
        logger.info("bun run export:zip      - Export a .zip archive");
        logger.info("bun run export:mcpack   - Export .mcpack archive(s)");
        logger.info("bun run export:mcaddon  - Export a .mcaddon archive");
    } catch (error) {
        logger.error(`Error occurred: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}

main();
