import { logger } from "@mcbepack/common";
import type { CommandModule } from "yargs";

import { ARCHIVE_FORMATS, type ArchiveFormat } from "../domain.js";
import { exportProject } from "../workflows/export.js";

interface ExportArgs {
    archiveFormat: ArchiveFormat;
}

export const exportCommand: CommandModule<object, ExportArgs> = {
    command: "export <archiveFormat>",
    describe: "Build and export an archive",
    builder: (yargs) => yargs
        .positional("archiveFormat", {
            type: "string",
            description: "Archive output format",
            choices: ARCHIVE_FORMATS,
            demandOption: true
        }),
    handler: async (argv) => {
        try {
            await exportProject(argv.archiveFormat);
        } catch (error) {
            logger.error(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
            process.exit(1);
        }
    }
};
