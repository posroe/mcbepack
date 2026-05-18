import type { CommandModule } from "yargs";

import { logger } from "@mcbepack/common";

import { updateProjectDependencies } from "../services/update.js";
import { RELEASE_CHANNELS, type ReleaseChannel } from "../types/cli-options.js";

interface UpdateArgs {
    releaseChannel: ReleaseChannel;
}

export const updateCommand: CommandModule<object, UpdateArgs> = {
    command: "update <releaseChannel>",
    describe: "Update the project dependencies",
    builder: (yargs) => yargs
        .positional("releaseChannel", {
            type: "string",
            description: "Release channel",
            choices: RELEASE_CHANNELS,
            demandOption: true
        }),
    handler: async (argv) => {
        try {
            await updateProjectDependencies(argv.releaseChannel);
        } catch (error) {
            logger.error(`Error updating dependencies: ${error instanceof Error ? error.message : String(error)}`);
            process.exit(1);
        }
    }
};
