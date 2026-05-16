import { CommandModule } from "yargs";

import { buildProject } from "../workflows/build.js";

export const buildCommand: CommandModule = {
    command: "build",
    describe: "Build the project",
    handler: buildProject
};
