import path from "node:path";

import { ExtensionType } from "../constants.js";
import type { GenerationContext } from "../context.js";
import type { FileToCreate } from "../schema.js";
import { copyTemplate, createFile, json } from "./file-factory.js";
import { createBehaviorManifest } from "./manifest.js";

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
