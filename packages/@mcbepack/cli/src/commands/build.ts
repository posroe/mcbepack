import { logger } from "@mcbepack/common";
import type { CommandModule } from "yargs";

import { buildProject } from "../workflows/build.js";

export const buildCommand: CommandModule = {
    command: "build",
    describe: "Build the project",
    handler: async (): Promise<void> => {
        try {
            await buildProject();
        } catch (error) {
            logger.error(`Build failed: ${error instanceof Error ? error.message : String(error)}`);
            process.exit(1);
        }
    }
};
