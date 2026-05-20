import fs from "node:fs";

import type { BuildFailure } from "esbuild";

import { logger } from "@mcbepack/common";

import { Bundler } from "../classes/bundler.js";
import { DIRECTORIES } from "../config/constant.js";

function isBuildFailure(error: unknown): error is BuildFailure {
    return typeof error === "object"
        && error !== null
        && "errors" in error
        && Array.isArray(error.errors);
}

export async function bundler(): Promise<void> {
    try {
        if (!fs.existsSync(DIRECTORIES.scripts.origin)) {
            logger.info("No scripts directory found; skipped script bundle");
            return;
        }

        logger.step("Compiling scripts...");

        const result = await new Bundler().build();

        if (result.warnings.length > 0) {
            logger.warn("Compiled with warnings");
            logger.warningBlock(await Bundler.formatMessages(result.warnings, "warning"));
        }

        logger.success("Script bundle completed");
    } catch (error) {
        if (isBuildFailure(error) && error.errors.length > 0) {
            logger.error("Compilation errors");
            logger.errorBlock(await Bundler.formatMessages(error.errors, "error"));
        }

        logger.error(`Build failed: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
}
