import path from "node:path";

import { PACK_DEFINITIONS, PROJECT_DIRECTORIES } from "../config/constants.js";
import type { GenerationContext } from "../config/context.js";
import { Extension } from "../config/enum.js";
import type { ProjectFileDescriptor } from "../config/schema.js";
import { createFile, json, template } from "./file-factory.js";
import { createBehaviorManifest, createResourceManifest } from "./manifest.js";

export function generateBehaviorManifestFile(context: GenerationContext): ProjectFileDescriptor {
    const pack = PACK_DEFINITIONS[Extension.BEHAVIOR];

    return createFile({
        directory: getPackDirectory(context, Extension.BEHAVIOR),
        name: pack.manifest,
        action: "create",
        content: json(createBehaviorManifest(context.config, context.baseManifest)),
    });
}

export function generateResourceManifestFile(context: GenerationContext): ProjectFileDescriptor {
    const pack = PACK_DEFINITIONS[Extension.RESOURCE];

    return createFile({
        directory: getPackDirectory(context, Extension.RESOURCE),
        name: pack.manifest,
        action: "create",
        content: json(createResourceManifest(context.config, context.baseManifest)),
    });
}

export function generateBehaviorPackIconFile(context: GenerationContext): ProjectFileDescriptor {
    return generatePackIconFile(context, Extension.BEHAVIOR);
}

export function generateResourcePackIconFile(context: GenerationContext): ProjectFileDescriptor {
    return generatePackIconFile(context, Extension.RESOURCE);
}

function generatePackIconFile(context: GenerationContext, extension: Extension): ProjectFileDescriptor {
    const pack = PACK_DEFINITIONS[extension];

    return createFile({
        directory: getPackDirectory(context, extension),
        name: pack.icon,
        action: "copy",
        source: template(pack.icon),
    });
}

function getPackDirectory(context: GenerationContext, extension: Extension): string {
    return path.join(
        context.projectRoot,
        PROJECT_DIRECTORIES.source,
        PACK_DEFINITIONS[extension].directoryName
    );
}
