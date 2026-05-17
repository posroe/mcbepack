import { color, formatDuration, formatPath, logger } from "@mcbepack/common/logger";

import { PackLinker } from "../lib/pack-linker.js";
import { getCliVersion } from "../lib/package-info.js";
import { getMinecraftLinkPaths, getProjectPaths } from "../lib/project-paths.js";
import { createBundleWatcher, formatBundleMessages } from "../lib/script-bundler.js";

export async function startDevServer(): Promise<void> {
    try {
        const projectPaths = getProjectPaths();
        const minecraftLinkPaths = getMinecraftLinkPaths();
        let startedAt = Date.now();
        let isFirstBuild = true;

        logger.logo();
        logger.header("mcbepack", getCliVersion());
        logger.field("Project", color.bold(projectPaths.projectName));
        logger.field("Mode", color.cyan("development"));
        logger.field("Behavior", formatPath(projectPaths.behaviorPackRoot));
        logger.field("Resource", formatPath(projectPaths.resourcePackRoot));

        logger.step("Linking packs into Minecraft...");
        const packLinks = new PackLinker(projectPaths, minecraftLinkPaths).linkAvailablePacks();

        if (packLinks.behaviorPack) {
            logger.success(`Behavior pack linked ${color.dim(formatPath(packLinks.behaviorPack))}`);
        }

        if (packLinks.resourcePack) {
            logger.success(`Resource pack linked ${color.dim(formatPath(packLinks.resourcePack))}`);
        }

        const bundleWatcher = await createBundleWatcher(async (result) => {
            if (result.warnings.length > 0) {
                logger.warn("Compiled with warnings");
                logger.warningBlock(await formatBundleMessages(result.warnings, "warning"));
                return;
            }

            if (result.errors.length > 0) {
                logger.error("Failed to compile");
                logger.errorBlock(await formatBundleMessages(result.errors, "error"));
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
