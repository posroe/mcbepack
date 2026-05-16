import { CommandModule } from "yargs";
import pc from "picocolors";
import { createBuildContext, formatBuildMessages } from "../utils/esbuild.js";
import { PackLinker } from "../utils/pack-linker.js";
import { getProjectPaths, validateEnv } from "../utils/paths.js";

export const devCommand: CommandModule = {
    command: "dev",
    describe: "Run the development server",
    handler: async () => {
        try {
            validateEnv();
            const paths = getProjectPaths();

            console.log(pc.cyan("Starting development server...\n"));

            const context = await createBuildContext("development", async (result) => {
                if (result.warnings.length > 0) {
                    console.error(pc.yellow("Compilation warnings:"));
                    console.error(await formatBuildMessages(result.warnings, "warning"));
                    return;
                }

                if (result.errors.length > 0) {
                    console.error(pc.red("Compilation errors:"));
                    console.error(await formatBuildMessages(result.errors, "error"));
                    return;
                }

                console.log(pc.green(`Rebuilt at ${new Date().toLocaleTimeString()}`));
            });
            await context.watch();

            const packLinker = new PackLinker(paths);
            packLinker.linkBehaviorPack();
            packLinker.linkResourcePack();

            console.log(pc.dim("Pack folders are linked into Minecraft development folders."));
            console.log(pc.dim("Watching for script changes...\n"));
        } catch (error) {
            console.error(pc.red("Failed to start dev server:"), error);
            process.exit(1);
        }
    }
};
