import path from "node:path";

import { logger } from "@mcbepack/common";

import { collectProjectInfo } from "../cli/collect-info.js";
import { promptConfirm } from "../cli/prompts.js";
import { printCreatedProjectSummary } from "../cli/summary.js";
import type { GenerationContext } from "../config/context.js";
import { projectFileDescriptorSchema } from "../config/schema.js";
import { createBaseManifest } from "../generators/manifest.js";
import { generateProjectFiles } from "../generators/project-files.js";
import { createInstallCommand, detectPackageManager, runInstallCommand } from "../utils/manager-detector.js";
import { createFiles } from "./file-writer.js";

export class ProjectCreationCancelledError extends Error {
    public constructor() {
        super("Project creation cancelled");
        this.name = "ProjectCreationCancelledError";
    }
}

export async function createProject(): Promise<void> {
    logger.step("Collecting project info...");
    const [packageManager, config] = await Promise.all([
        detectPackageManager(),
        collectProjectInfo(),
    ]);

    const projectRoot = path.join(process.cwd(), config.name);
    const context: GenerationContext = {
        config,
        projectRoot,
        packageManager,
        baseManifest: createBaseManifest(config),
    };

    logger.step("Confirming project creation...");
    await confirmProjectCreation();

    logger.step("Generating project file descriptors...");
    const files = projectFileDescriptorSchema.array().parse(generateProjectFiles(context));
    createFiles(projectRoot, files);

    logger.step("Installing dependencies...");
    runInstallCommand(createInstallCommand(projectRoot, packageManager));

    printCreatedProjectSummary(context);
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
