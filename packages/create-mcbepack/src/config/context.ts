import type { Manifest } from "@mcbepack/common";

import type { PackageManager, ProjectConfig } from "./schema.js";

export interface GenerationContext {
    config: ProjectConfig;
    projectRoot: string;
    packageManager: PackageManager;
    baseManifest: Manifest;
}
