import type { Manifest } from "@mcbepack/common";

import type { ProjectConfig } from "./schema.js";

export interface GenerationContext {
    config: ProjectConfig;
    projectRoot: string;
    baseManifest: Manifest;
}
