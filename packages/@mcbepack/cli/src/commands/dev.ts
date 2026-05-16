import fs from "node:fs";

import pc from "picocolors";
import { CommandModule } from "yargs";

import { formatDuration, formatPath, log } from "../utils/cli-log.js";
import { createBuildContext, formatBuildMessages } from "../utils/esbuild.js";
import { PackLinker } from "../utils/pack-linker.js";
import { getProjectPaths, validateEnv } from "../utils/paths.js";

function getPackageVersion(): string | undefined {
    try {
        const packageJson = JSON.parse(fs.readFileSync(new URL("../../package.json", import.meta.url), "utf8")) as { version?: string };
        return packageJson.version;
    } catch {
        return undefined;
    }
}

export const devCommand: CommandModule = {
    command: "dev",
    describe: "Run the development server",
    handler: async () => {
        try {
            validateEnv();
            const paths = getProjectPaths();
            let startedAt = Date.now();
            let isFirstBuild = true;

            log.banner("mcbepack", getPackageVersion());
            log.detail("Project", pc.bold(paths.projectName));
            log.detail("Mode", pc.cyan("development"));
            log.detail("Behavior", formatPath(paths.behaviorRootPath));
            log.detail("Resource", formatPath(paths.resourceRootPath));

            log.wait("Linking packs into Minecraft...");
            const packLinker = new PackLinker(paths);
            const behaviorLink = packLinker.linkBehaviorPack();
            const resourceLink = packLinker.linkResourcePack();

            if (behaviorLink) {
                log.ready(`Behavior pack linked ${pc.dim(formatPath(behaviorLink))}`);
            }

            if (resourceLink) {
                log.ready(`Resource pack linked ${pc.dim(formatPath(resourceLink))}`);
            }

            const context = await createBuildContext("development", async (result) => {
                if (result.warnings.length > 0) {
                    log.warn("Compiled with warnings");
                    console.error(await formatBuildMessages(result.warnings, "warning"));
                    return;
                }

                if (result.errors.length > 0) {
                    log.error("Failed to compile");
                    console.error(await formatBuildMessages(result.errors, "error"));
                    return;
                }

                const duration = formatDuration(Date.now() - startedAt);

                if (isFirstBuild) {
                    log.ready(`Ready in ${duration}`);
                    log.detail("Watching", pc.dim("script changes"));
                    isFirstBuild = false;
                    return;
                }

                log.ready(`Rebuilt in ${duration} ${pc.dim(`at ${new Date().toLocaleTimeString()}`)}`);
            }, () => {
                startedAt = Date.now();
                log.wait(isFirstBuild ? "Compiling scripts..." : "Compiling changed scripts...");
            });
            await context.watch();
        } catch (error) {
            log.error("Failed to start dev server");
            console.error(error);
            process.exit(1);
        }
    }
};
