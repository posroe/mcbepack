import path from "node:path";

import { ExtensionType } from "../constants.js";
import type { GenerationContext } from "../context.js";
import type { FileToCreate } from "../schema.js";
import { copyTemplate, createFile, json } from "./file-factory.js";
import { createResourceManifest } from "./manifest.js";

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
