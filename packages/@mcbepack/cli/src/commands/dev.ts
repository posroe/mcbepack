import type { CommandModule } from "yargs";

import { color, formatDuration, formatPath, logger } from "@mcbepack/common";

import { Bundler } from "../classes/bundler.js";
import { Linker } from "../classes/linker.js";
import { constants, directory, name } from "../constants.js";

export const devCommand: CommandModule = {
    command: "dev",
    describe: "Run the development server",
    handler: async (): Promise<void> => {
        try {
            let startedAt = Date.now();
            let isFirstBuild = true;

            logger.logo();
            logger.header("mcbepack", constants.version);
            logger.field("Project", color.bold(name.project));
            logger.field("Mode", color.cyan("development"));
            logger.field("Behavior", formatPath(directory.behavior.destination));
            logger.field("Resource", formatPath(directory.resource.destination));

            logger.step("Linking packs into Minecraft...");

            const behaviorLinked = new Linker(
                directory.behavior.origin,
                directory.behavior.destination,
                `${name.project}_${name.behavior}`
            ).linkDir();

            const resourceLinked = new Linker(
                directory.resource.origin,
                directory.resource.destination,
                `${name.project}_${name.resource}`
            ).linkDir();

            if (behaviorLinked) {
                logger.success(`Behavior pack linked ${color.dim(formatPath(directory.behavior.destination))}`);
            }

            if (resourceLinked) {
                logger.success(`Resource pack linked ${color.dim(formatPath(directory.resource.destination))}`);
            }

            const bundler = new Bundler();

            const bundleWatcher = await bundler.watcher(async (result) => {
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
                    logger.field("Watching", color.dim("script changes"));
                    isFirstBuild = false;
                    return;
                }

                logger.success(`Rebuilt in ${duration} ${color.dim(`at ${new Date().toLocaleTimeString()}`)}`);
            }, () => {
                startedAt = Date.now();
                logger.step(isFirstBuild ? "Compiling scripts..." : "Compiling changed scripts...");
            });

            await bundleWatcher.watch();
        } catch (error) {
            logger.error(`Failed to start dev server: ${error instanceof Error ? error.message : String(error)}`);
            process.exit(1);
        }
    }
};
