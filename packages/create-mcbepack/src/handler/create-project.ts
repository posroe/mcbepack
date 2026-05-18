import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { logger } from "@mcbepack/common";

import { generateFileList } from "../generated/files.js";
import { createFiles } from "../lib/create-files.js";
import { createInstallCommand, detectPackageManager } from "../lib/package-manager.js";
import { printCreatedProjectSummary } from "../log/project-summary.js";
import { promptConfirm } from "../prompt/index.js";
import { collectProjectInfo } from "./collect-project-info.js";

export class ProjectCreationCancelledError extends Error {
    public constructor() {
        super("Project creation cancelled");
        this.name = "ProjectCreationCancelledError";
    }
}

export async function createProject(): Promise<void> {
    const packageManager = await detectPackageManager();
    const config = await collectProjectInfo();
    const projectRoot = path.join(process.cwd(), config.name);

    await confirmProjectCreation();
    ensureProjectRootAvailable(projectRoot, config.name);

    createFiles(generateFileList(config));

    logger.step("Installing dependencies...");
    runInstallCommand(createInstallCommand(projectRoot, packageManager));
    printCreatedProjectSummary(config, projectRoot, packageManager);
}

function runInstallCommand(command: { command: string; args: string[]; cwd: string }): void {
    execFileSync(command.command, command.args, {
        cwd: command.cwd,
        stdio: "inherit"
    });
}

async function confirmProjectCreation(): Promise<void> {
    const { confirmed } = await promptConfirm({
        message: "Do you want to create this project?",
        default: true,
    });

    if (!confirmed) {
        logger.warn("Project creation cancelled");
        throw new ProjectCreationCancelledError();
    }
}

function ensureProjectRootAvailable(projectRoot: string, projectName: string): void {
    if (fs.existsSync(projectRoot)) {
        throw new Error(`Directory ${projectName} already exists`);
    }
}
