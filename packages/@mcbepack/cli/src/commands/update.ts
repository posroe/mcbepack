import { CommandModule } from "yargs";

import { type ReleaseChannel, releaseChannels } from "../domain.js";
import { updateProjectDependencies } from "../workflows/update.js";

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
            choices: releaseChannels,
            demandOption: true
        }),
    handler: async (argv) => {
        await updateProjectDependencies(argv.releaseChannel);
    }
};
