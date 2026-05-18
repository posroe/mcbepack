import path from "node:path";

import type { Manifest } from "@mcbepack/common/types";

import { ExtensionType } from "../lib/enums.js";
import type { FileToCreate } from "../schema/file.js";
import type { ProjectConfig } from "../schema/project.js";
import { copyTemplate, createFile, json } from "./file-entry.js";
import { createBehaviorManifest } from "./manifest.js";

interface GenerationContext {
    config: ProjectConfig;
    projectRoot: string;
    baseManifest: Manifest;
}

export function generateBehaviorPack(context: GenerationContext): FileToCreate[] {
    if (!context.config.extensions.includes(ExtensionType.Behavior)) {
        return [];
    }

    const behaviorPackRoot = path.join(context.projectRoot, "src", "behavior_pack");
    const behaviorManifest = createBehaviorManifest(context.config, context.baseManifest);

    return [
        copyTemplate(path.join(behaviorPackRoot, "pack_icon.png"), "pack_icon.png"),
        createFile(path.join(behaviorPackRoot, "manifest.json"), json(behaviorManifest))
    ];
}
