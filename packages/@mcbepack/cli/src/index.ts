#!/usr/bin/env node

import dotenv from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { logger } from "@mcbepack/common";

import { buildCommand } from "./commands/build.js";
import { devCommand } from "./commands/dev.js";
import { exportCommand } from "./commands/export.js";
import { updateCommand } from "./commands/update.js";
import { validateMinecraftEnv } from "./config/project-paths.js";

dotenv.config({
    path: `${process.cwd()}/.env.local`
});

try {
    validateMinecraftEnv(process.env);
} catch (error) {
    logger.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
}

void yargs(hideBin(process.argv))
    .command(devCommand)
    .command(buildCommand)
    .command(exportCommand)
    .command(updateCommand)
    .scriptName("mcbepack")
    .demandCommand(1, "You need to specify a command")
    .help()
    .alias("h", "help")
    .version()
    .alias("v", "version")
    .parse();
