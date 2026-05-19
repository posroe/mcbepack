import type { CommandModule } from "yargs";

import { color, formatPath, logger } from "@mcbepack/common";

import { Archiver } from "../classes/archiver.js";
import { constants, directory, name } from "../constants.js";
import { bundler } from "../services/bundler.js";
import { Extension } from "../enum.js";


export const exportCommand: CommandModule<object, {
    extension: Extension;
}> = {
    command: "export <extension>",
    describe: "Build and export an archive",
    builder: (yargs) => yargs
        .positional("extension", {
            type: "string",
            description: "Archive output format",
            choices: Object.values(Extension),
            demandOption: true
        }),
    handler: async ({ extension }) => {
        try {
            logger.logo();
            logger.header("mcbepack", constants.version);
            logger.field("Project", color.bold(name.project));
            logger.field("Mode", color.cyan("production"));
            logger.field("Behavior", formatPath(directory.behavior.origin));
            logger.field("Resource", formatPath(directory.resource.origin));

            await bundler();

            logger.step(`Creating ${extension} archive...`);

            const archiver = new Archiver(
                [
                    {
                        origin: directory.behavior.origin,
                        name: `${name.project}_${name.behavior}`
                    },
                    {
                        origin: directory.resource.origin,
                        name: `${name.project}_${name.resource}`
                    }
                ],
                directory.output
            );

            if (extension === Extension.MCADDON) {
                await archiver.createCompound(extension, name.project);
            } else {
                await archiver.create(extension);
            }

            logger.done("Export completed");
        } catch (error) {
            logger.error(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
            process.exit(1);
        }
    }
};