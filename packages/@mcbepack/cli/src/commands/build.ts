import type { CommandModule } from "yargs";

import { logger } from "@mcbepack/common";

import { bundler } from "../services/bundler.js";
import { statusLog } from "../services/utils.js";


export const buildCommand: CommandModule = {
    command: "build",
    describe: "Build the project",
    handler: async (): Promise<void> => {
        try {
            statusLog("production");
            await bundler();
            logger.done("Build completed");
        } catch (error) {
            logger.error(`Build failed: ${error instanceof Error ? error.message : String(error)}`);
            process.exit(1);
        }
    }
};
