import fs from "node:fs";

import { color, formatPath, logger } from "@mcbepack/common/logger";
import type { BuildFailure } from "esbuild";

import { getProjectPaths } from "../lib/project-paths.js";
import { bundleScripts, formatBundleMessages } from "../lib/script-bundler.js";
import { getCliVersion } from "../lib/package-info.js";

export async function packBuild(): Promise<void> {
    try {
        const projectPaths = getProjectPaths();

        logger.logo();
        logger.header("mcbepack", getCliVersion());
        logger.field("Project", color.bold(projectPaths.projectName));
        logger.field("Mode", color.cyan("production"));
        logger.field("Behavior", formatPath(projectPaths.behaviorPackRoot));
        logger.field("Resource", formatPath(projectPaths.resourcePackRoot));

        if (fs.existsSync(projectPaths.scriptsDir)) {
            logger.step("Compiling scripts...");
            const result = await bundleScripts();

            if (result.warnings.length > 0) {
                logger.warn("Compiled with warnings");
                logger.warningBlock(await formatBundleMessages(result.warnings, "warning"));
            }

            logger.success("Script bundle completed");
        } else {
            logger.info("No scripts directory found; skipped script bundle");
        }
    } catch (error) {
        const buildError = error as BuildFailure;

        if (buildError.errors?.length) {
            logger.error("Compilation errors");
            logger.errorBlock(await formatBundleMessages(buildError.errors, "error"));
        }

        logger.error(`Build failed: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}
