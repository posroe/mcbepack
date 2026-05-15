import { CommandModule } from "yargs";
import pc from "picocolors";
import type { Stats } from "webpack";
import { createCompiler } from "../utils/webpack.js";
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

            const compiler = createCompiler();
            compiler.watch({
                aggregateTimeout: 300,
                poll: 1000
            }, (err: Error | null | undefined, stats: Stats | undefined) => {
                if (stats?.hasWarnings()) {
                    console.error(pc.yellow("Compilation warnings:"));
                    console.error(stats.toString({ warnings: true }));
                    return;
                }

                if (err) {
                    console.error(pc.red("Webpack error:"), err);
                    return;
                }

                if (stats?.hasErrors()) {
                    console.error(pc.red("Compilation errors:"));
                    console.error(stats.toString({ errors: true }));
                    return;
                }

                console.log(pc.green(`Rebuilt at ${new Date().toLocaleTimeString()}`));
            });

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
