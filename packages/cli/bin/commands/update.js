import pc from "picocolors";
export const updateCommand = {
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
