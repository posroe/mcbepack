import fs from "node:fs";

import type { BuildFailure } from "esbuild";
import pc from "picocolors";
import { CommandModule } from "yargs";

import { ArchiveFormat, PackArchiver } from "../utils/archiver.js";
import { buildScripts, formatBuildMessages } from "../utils/esbuild.js";
import { getProjectPaths } from "../utils/paths.js";

interface BuildArgs {
    output?: ArchiveFormat;
}

export const buildCommand: CommandModule<object, BuildArgs> = {
    command: "build [output]",
    describe: "Build the project",
    builder: (yargs) => yargs
        .positional("output", {
            type: "string",
            description: "Optional archive output format",
            choices: ["mcpack", "mcaddon", "zip"] as const
        }),
    handler: async (argv) => {
        try {
            const paths = getProjectPaths();
            const { output } = argv;

            console.log(pc.cyan("Building project...\n"));

            if (fs.existsSync(paths.scriptsDir)) {
                const result = await buildScripts("production");

                if (result.warnings.length > 0) {
                    console.error(pc.yellow("Compilation warnings:"));
                    console.error(await formatBuildMessages(result.warnings, "warning"));
                }

                console.log(pc.green("Script bundle completed\n"));
            }

            if (output) {
                const archiver = new PackArchiver(paths);
                await archiver.archive(output);
            }

            console.log(pc.green("\nBuild completed successfully!\n"));
        } catch (error) {
            const buildError = error as BuildFailure;

            if (buildError.errors?.length) {
                console.error(pc.red("Compilation errors:"));
                console.error(await formatBuildMessages(buildError.errors, "error"));
            }

            console.error(pc.red("Build failed:"), error);
            process.exit(1);
        }
    }
};
