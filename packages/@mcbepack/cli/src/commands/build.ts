import type { CommandModule } from "yargs";

import { color, formatPath, logger } from "@mcbepack/common";

import { constants, directory, name } from "../constants.js";
import { bundler } from "../services/bundler.js";


export const buildCommand: CommandModule = {
    command: "build",
    describe: "Build the project",
    handler: async (): Promise<void> => {
        try {
            logger.logo();
            logger.header("mcbepack", constants.version);
            logger.field("Project", color.bold(name.project));
            logger.field("Mode", color.cyan("production"));
            logger.field("Behavior", formatPath(directory.behavior.origin));
            logger.field("Resource", formatPath(directory.resource.origin));

            await bundler();
            logger.done("Build completed");
        } catch (error) {
            logger.error(`Build failed: ${error instanceof Error ? error.message : String(error)}`);
            process.exit(1);
        }
    }
};
