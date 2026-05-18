import { logger } from "@mcbepack/common";
import type { CommandModule } from "yargs";

import { startDevServer } from "../workflows/dev.js";

export const devCommand: CommandModule = {
    command: "dev",
    describe: "Run the development server",
    handler: async (): Promise<void> => {
        try {
            await startDevServer();
        } catch (error) {
            logger.error(`Failed to start dev server: ${error instanceof Error ? error.message : String(error)}`);
            process.exit(1);
        }
    }
};
