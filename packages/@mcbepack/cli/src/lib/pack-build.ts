import fs from "node:fs";

import { color, formatPath, logger } from "@mcbepack/common/logger";
import type { BuildFailure } from "esbuild";

import { getCliVersion } from "./package-info.js";
import { getProjectPaths } from "./project-paths.js";
import { bundleScripts, formatBundleMessages } from "./script-bundler.js";

export async function packBuild(): Promise<void> {
    const projectPaths = getProjectPaths();

    logger.logo();
    logger.header("mcbepack", getCliVersion());
    logger.field("Project", color.bold(projectPaths.projectName));
    logger.field("Mode", color.cyan("production"));
    logger.field("Behavior", formatPath(projectPaths.behaviorPackRoot));
    logger.field("Resource", formatPath(projectPaths.resourcePackRoot));

    try {
        if (!fs.existsSync(projectPaths.scriptsDir)) {
            logger.info("No scripts directory found; skipped script bundle");
            return;
        }

        logger.step("Compiling scripts...");
        const result = await bundleScripts();

        if (result.warnings.length > 0) {
            logger.warn("Compiled with warnings");
            logger.warningBlock(await formatBundleMessages(result.warnings, "warning"));
        }

        logger.success("Script bundle completed");
    } catch (error) {
        const buildError = error as BuildFailure;

        if (buildError.errors?.length) {
            logger.error("Compilation errors");
            logger.errorBlock(await formatBundleMessages(buildError.errors, "error"));
        }

        logger.error(`Build failed: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
}
