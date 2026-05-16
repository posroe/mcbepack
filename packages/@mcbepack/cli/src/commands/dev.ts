import { CommandModule } from "yargs";

import { startDevServer } from "../workflows/dev.js";

export const devCommand: CommandModule = {
    command: "dev",
    describe: "Run the development server",
    handler: startDevServer
};
