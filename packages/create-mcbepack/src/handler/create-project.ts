import fs from "node:fs";
import path from "node:path";

import { logger } from "@mcbepack/common/logger";

import { generateFileList } from "../generate/files.js";
import { createFiles } from "../lib/create-files.js";
import { detectPackageManager, installDependencies } from "../lib/package-manager.js";
import { printCreatedProjectSummary } from "../log/project-summary.js";
import { promptConfirm } from "../prompt/index.js";
import { collectProjectInfo } from "./collect-project-info.js";

export async function createProject(): Promise<void> {
    const packageManager = await detectPackageManager();
    const config = await collectProjectInfo();
    const projectRoot = path.join(process.cwd(), config.name);

    await confirmProjectCreation();
    ensureProjectRootAvailable(projectRoot, config.name);

    createFiles(generateFileList(config));

    logger.step("Installing dependencies...");
    installDependencies(projectRoot, packageManager);
    printCreatedProjectSummary(config, projectRoot, packageManager);
}

async function confirmProjectCreation(): Promise<void> {
    const { confirmed } = await promptConfirm({
        message: "Do you want to create this project?",
        default: true,
    });

    if (!confirmed) {
        logger.warn("Project creation cancelled");
        process.exit(0);
    }
}

function ensureProjectRootAvailable(projectRoot: string, projectName: string): void {
    if (fs.existsSync(projectRoot)) {
        logger.error(`Directory ${projectName} already exists`);
        process.exit(1);
    }
}
