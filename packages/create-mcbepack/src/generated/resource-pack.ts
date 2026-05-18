import path from "node:path";

import type { Manifest } from "@mcbepack/common/types";

import { ExtensionType } from "../lib/enums.js";
import type { FileToCreate } from "../schema/file.js";
import type { ProjectConfig } from "../schema/project.js";
import { copyTemplate, createFile, json } from "./file-entry.js";
import { createResourceManifest } from "./manifest.js";

interface GenerationContext {
    config: ProjectConfig;
    projectRoot: string;
    baseManifest: Manifest;
}

export function generateResourcePack(context: GenerationContext): FileToCreate[] {
    if (!context.config.extensions.includes(ExtensionType.Resource)) {
        return [];
    }

    const resourcePackRoot = path.join(context.projectRoot, "src", "resource_pack");
    const resourceManifest = createResourceManifest(context.config, context.baseManifest);

    return [
        copyTemplate(path.join(resourcePackRoot, "pack_icon.png"), "pack_icon.png"),
        createFile(path.join(resourcePackRoot, "manifest.json"), json(resourceManifest))
    ];
}
