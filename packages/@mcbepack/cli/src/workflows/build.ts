import { logger } from "@mcbepack/common/logger";
import { packBuild } from "../lib/pack-build.js";

export async function buildProject() {
    await packBuild();
    logger.done("Build completed");
}