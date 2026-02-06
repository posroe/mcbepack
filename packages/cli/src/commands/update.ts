import { CommandModule } from "yargs";
import pc from "picocolors";

interface UpdateArgs {
    type?: string;
}

export const updateCommand: CommandModule<{}, UpdateArgs> = {
    command: "update",
    describe: "Update the project",
    builder: (yargs) => {
        return yargs.option("type", {
            alias: "t",
            type: "string",
            description: "Update type",
        });
    },
    handler: async (argv) => {
        const { type } = argv;

        console.log(pc.yellow("Update command is not yet implemented"));

        if (type) {
            console.log(pc.dim(`Update type: ${type}`));
        }
    }
};
