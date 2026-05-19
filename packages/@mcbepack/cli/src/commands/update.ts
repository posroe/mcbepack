import type { CommandModule } from "yargs";

import { logger } from "@mcbepack/common";

import { Release } from "../constants.js";
import { runUpdate } from "../services/update-runner.js";

interface UpdateArgs {
    release: Release;
}

export const updateCommand: CommandModule<object, UpdateArgs> = {
    command: "update <release>",
    describe: "Update the project dependencies",
    builder: (yargs) => yargs
        .positional("release", {
            type: "string",
            description: "Release channel",
            choices: Object.values(Release),
            demandOption: true
        }),
    handler: async (argv) => {
        try {
            await runUpdate(argv.release);
        } catch (error) {
            logger.error(`Error updating dependencies: ${error instanceof Error ? error.message : String(error)}`);
            process.exit(1);
        }
    }
};
