import { logger } from "@mcbepack/common";

import { packBuild } from "./pack-build.js";

export async function buildProject(): Promise<void> {
    await packBuild();
    logger.done("Build completed");
}
