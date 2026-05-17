import { CommandModule } from "yargs";

import { type ArchiveFormat, archiveFormats } from "../domain.js";
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
            choices: archiveFormats,
            demandOption: true
        }),
    handler: async (argv) => {
        await exportProject(argv.archiveFormat);
    }
};
