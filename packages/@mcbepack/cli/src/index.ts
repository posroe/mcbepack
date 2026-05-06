#!/usr/bin/env node

import "@mcbepack/common";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import dotenv from "dotenv";
import { devCommand } from "./commands/dev";
import { buildCommand } from "./commands/build";
import { updateCommand } from "./commands/update";

dotenv.config({
    path: process.cwd() + "/.env.local"
});

process.env.NODE_NO_WARNINGS = "1";

yargs(hideBin(process.argv))
    .command(devCommand)
    .command(buildCommand)
    .command(updateCommand)
    .demandCommand(1, "You need to specify a command")
    .help()
    .alias("h", "help")
    .version()
    .alias("v", "version")
    .parse();