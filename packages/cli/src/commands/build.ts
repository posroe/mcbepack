import { CommandModule } from "yargs";
import pc from "picocolors";
import { createCompiler } from "../utils/webpack";
import { PackArchiver, ArchiveFormat } from "../utils/archiver";
import { getProjectPaths } from "../utils/paths";
import fs from "fs";

interface BuildArgs {
    output: ArchiveFormat;
}

export const buildCommand: CommandModule<{}, BuildArgs> = {
    command: "build",
    describe: "Build the project",
    builder: (yargs) => {
        return yargs.option("output", {
            alias: "o",
            type: "string",
            description: "Output format",
            demandOption: true,
            choices: ["mcpack", "mcaddon", "zip"] as const
        });
    },
    handler: async (argv) => {
        try {
            const paths = getProjectPaths();
            const { output } = argv;

            console.log(pc.cyan("Building project...\n"));

            if (fs.existsSync(paths.scriptsDir)) {
                const compiler = createCompiler();

                await new Promise<void>((resolve, reject) => {
                    compiler.run((err, stats) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        if (stats?.hasErrors()) {
                            console.error(pc.red("Compilation errors:"));
                            console.error(stats.toString({ errors: true }));
                            reject(new Error("Compilation failed"));
                            return;
                        }

                        console.log(stats?.toString({
                            colors: true,
                            modules: false,
                            children: false,
                            chunks: false,
                            chunkModules: false,
                        }));

                        console.log(pc.green("\nWebpack compilation completed\n"));
                        resolve();
                    });
                });
            }

            const archiver = new PackArchiver(paths);
            await archiver.archive(output);

            console.log(pc.green("\nBuild completed successfully!\n"));
        } catch (error) {
            console.error(pc.red("Build failed:"), error);
            process.exit(1);
        }
    }
};
