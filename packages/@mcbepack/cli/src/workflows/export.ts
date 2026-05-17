import { logger } from "@mcbepack/common/logger";

import type { ArchiveFormat } from "../domain.js";
import { PackArchiver } from "../lib/pack-archiver.js";
import { packBuild } from "../lib/pack-build.js";
import { getProjectPaths } from "../lib/project-paths.js";

export async function exportProject(archiveFormat: ArchiveFormat): Promise<void> {
    try {
        await packBuild();

        const projectPaths = getProjectPaths();
        const packArchiver = new PackArchiver(projectPaths);
        await packArchiver.archive(archiveFormat);

        logger.done("Export completed");
    } catch (error) {
        logger.error(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}
