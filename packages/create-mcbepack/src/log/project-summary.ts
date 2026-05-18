import { color, logger } from "@mcbepack/common/logger";

import type { PackageManager } from "../schema/package-manager.js";
import type { ProjectConfig } from "../schema/project.js";

export function printCreatedProjectSummary(
    config: ProjectConfig,
    projectRoot: string,
    packageManager: PackageManager
): void {
    logger.done(`Created project ${config.name}`);
    logger.field("Path", color.dim(projectRoot));

    logger.section("Next steps");
    logger.item(`${color.cyan("1.")} cd ${config.name}`);
    logger.item(`${color.cyan("2.")} ${getSecondStep(config, packageManager)}`);

    logger.section("Available commands");
    printAvailableCommands(config, packageManager);
}

function getSecondStep(config: ProjectConfig, packageManager: PackageManager): string {
    return config.script?.enabled
        ? `${packageManager.name} run dev`
        : "Start developing your project";
}

function printAvailableCommands(config: ProjectConfig, packageManager: PackageManager): void {
    const run = `${packageManager.name} run`;

    if (config.script?.enabled) {
        logger.info(`${run} dev             - Start development server`);
        logger.info(`${run} build           - Build project files`);
    }

    logger.info(`${run} export:zip      - Export a .zip archive`);
    logger.info(`${run} export:mcpack   - Export .mcpack archive(s)`);
    logger.info(`${run} export:mcaddon  - Export a .mcaddon archive`);

    if (config.script?.enabled) {
        logger.info(`${run} update:stable   - Update Script API (stable) packages`);
        logger.info(`${run} update:beta     - Update Script API (beta) packages`);
        logger.info(`${run} update:preview  - Update Script API (preview) packages`);
    }
}
