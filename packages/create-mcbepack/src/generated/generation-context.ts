import type { Manifest } from "@mcbepack/common";

import type { ProjectConfig } from "../schema/project.js";

export interface GenerationContext {
    config: ProjectConfig;
    projectRoot: string;
    baseManifest: Manifest;
}
