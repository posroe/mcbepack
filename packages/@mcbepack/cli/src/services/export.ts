import { logger } from "@mcbepack/common";

import { getProjectPaths } from "../config/project-paths.js";
import type { ArchiveFormat } from "../types/cli-options.js";
import { PackArchiver } from "./pack-archiver.js";
import { packBuild } from "./pack-build.js";

export async function exportProject(archiveFormat: ArchiveFormat): Promise<void> {
    await packBuild();

    const projectPaths = getProjectPaths();
    const packArchiver = new PackArchiver(projectPaths);
    await packArchiver.archive(archiveFormat);

    logger.done("Export completed");
}
