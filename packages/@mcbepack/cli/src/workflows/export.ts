import { logger } from "@mcbepack/common/logger";

import type { ArchiveFormat } from "../domain.js";
import { PackArchiver } from "../lib/pack-archiver.js";
import { getProjectPaths } from "../lib/project-paths.js";
import { packBuild } from "../lib/pack-build.js";

export async function exportProject(archiveFormat: ArchiveFormat): Promise<void> {
    await packBuild();

    const projectPaths = getProjectPaths();
    const packArchiver = new PackArchiver(projectPaths);
    await packArchiver.archive(archiveFormat);

    logger.done("Export completed");
}
