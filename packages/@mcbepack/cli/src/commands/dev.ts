import { CommandModule } from "yargs";
import pc from "picocolors";
import { createCompiler } from "../utils/webpack";
import { FileSync } from "../utils/file-sync";
import { getProjectPaths, validateEnv } from "../utils/paths";

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
            }, (err, stats) => {
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

            const fileSync = new FileSync(paths);
            fileSync.watchBehaviorPack();
            fileSync.watchResourcePack();

            console.log(pc.dim("Watching for file changes...\n"));
        } catch (error) {
            console.error(pc.red("Failed to start dev server:"), error);
            process.exit(1);
        }
    }
};
