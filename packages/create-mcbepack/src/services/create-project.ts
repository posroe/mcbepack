import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { logger } from "@mcbepack/common";

import type { GenerationContext } from "../context.js";
import { generateBehaviorPack } from "../generators/behavior-pack.js";
import { createFile } from "../generators/file-factory.js";
import { createBaseManifest } from "../generators/manifest.js";
import { generateProjectReadme } from "../generators/readme.js";
import { generateResourcePack } from "../generators/resource-pack.js";
import { generateScriptProject } from "../generators/script-project.js";
import { promptConfirm } from "../prompts.js";
import type { FileToCreate, ProjectConfig } from "../schema.js";
import { fileToCreateSchema } from "../schema.js";
import { collectProjectInfo } from "./collect-info.js";
import { createFiles } from "./file-writer.js";
import { createInstallCommand, detectPackageManager, type InstallCommand } from "./manager-detector.js";
import { printCreatedProjectSummary } from "./summary.js";

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

    createFiles(generateFileList(config, projectRoot));

    logger.step("Installing dependencies...");
    runInstallCommand(createInstallCommand(projectRoot, packageManager));
    printCreatedProjectSummary(config, projectRoot, packageManager);
}

function runInstallCommand(command: InstallCommand): void {
    execFileSync(command.command, command.args, {
        cwd: command.cwd,
        stdio: "inherit"
    });
}

function generateFileList(config: ProjectConfig, projectRoot: string): FileToCreate[] {
    const context: GenerationContext = {
        config,
        projectRoot,
        baseManifest: createBaseManifest(config)
    };

    const files = [
        createTextFile(context, "README.md", generateProjectReadme(config)),
        ...generateBehaviorPack(context),
        ...generateResourcePack(context),
        ...generateScriptProject(context)
    ];

    return fileToCreateSchema.array().parse(files);
}

function createTextFile(context: GenerationContext, relativePath: string, content: string): FileToCreate {
    return createFile(path.join(context.projectRoot, relativePath), content);
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
