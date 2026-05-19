import chalk from "chalk";
import type { CommandModule } from "yargs";

import { formatDuration, formatPath, logger } from "@mcbepack/common";

import { Bundler } from "../classes/bundler.js";
import { Linker } from "../classes/linker.js";
import { DIRECTORIES, NAMES } from "../constants.js";
import { statusLog, validateEnv } from "../services/utils.js";

export const devCommand: CommandModule = {
    command: "dev",
    describe: "Run the development server",
    handler: async (): Promise<void> => {

        validateEnv(process.env, ["BASE_PATH", "BEHAVIOR_PATH", "RESOURCE_PATH"]);

        try {
            let startedAt = Date.now();
            let isFirstBuild = true;

            statusLog("development");

            logger.step("Linking packs into Minecraft...");

            const behaviorLinked = new Linker(
                DIRECTORIES.behavior.origin,
                DIRECTORIES.behavior.destination,
                `${NAMES.project}_${NAMES.behavior}`
            ).linkDir();

            const resourceLinked = new Linker(
                DIRECTORIES.resource.origin,
                DIRECTORIES.resource.destination,
                `${NAMES.project}_${NAMES.resource}`
            ).linkDir();

            if (behaviorLinked) {
                logger.success(`Behavior pack linked ${chalk.dim(formatPath(DIRECTORIES.behavior.destination))}`);
            }

            if (resourceLinked) {
                logger.success(`Resource pack linked ${chalk.dim(formatPath(DIRECTORIES.resource.destination))}`);
            }

            const bundler = new Bundler();

            const watcher = await bundler.watcher(async (result) => {
                if (result.warnings.length > 0) {
                    logger.warn("Compiled with warnings");
                    logger.warningBlock(await Bundler.formatMessages(result.warnings, "warning"));
                    return;
                }

                if (result.errors.length > 0) {
                    logger.error("Failed to compile");
                    logger.errorBlock(await Bundler.formatMessages(result.errors, "error"));
                    return;
                }

                const duration = formatDuration(Date.now() - startedAt);

                if (isFirstBuild) {
                    logger.success(`Ready in ${duration}`);
                    logger.field("Watching", chalk.dim("script changes"));
                    isFirstBuild = false;
                    return;
                }

                logger.success(`Rebuilt in ${duration} ${chalk.dim(`at ${new Date().toLocaleTimeString()}`)}`);
            }, () => {
                startedAt = Date.now();
                logger.step(isFirstBuild ? "Compiling scripts..." : "Compiling changed scripts...");
            });

            await watcher.watch();
        } catch (error) {
            logger.error(`Failed to start dev server: ${error instanceof Error ? error.message : String(error)}`);
            process.exit(1);
        }
    }
};
