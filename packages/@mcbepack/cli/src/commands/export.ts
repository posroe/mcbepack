import type { CommandModule } from "yargs";

import { logger } from "@mcbepack/common";

import { Archiver } from "../classes/archiver.js";
import { DIRECTORIES, NAMES } from "../config/constant.js";
import { Extension } from "../config/enum.js";
import { bundler } from "../services/bundler.js";
import { statusLog } from "../services/utils.js";

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
            statusLog("production");

            await bundler();

            logger.step(`Creating ${extension} archive...`);

            const archiver = new Archiver(
                [
                    {
                        origin: DIRECTORIES.behavior.origin,
                        name: `${NAMES.project}_${NAMES.behavior}`
                    },
                    {
                        origin: DIRECTORIES.resource.origin,
                        name: `${NAMES.project}_${NAMES.resource}`
                    }
                ],
                DIRECTORIES.output
            );

            if (extension === Extension.MCADDON) {
                await archiver.createCompound(extension, NAMES.project);
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