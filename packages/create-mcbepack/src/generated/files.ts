import path from "node:path";

import type { Manifest } from "@mcbepack/common/types";

import type { FileToCreate } from "../schema/file.js";
import { fileToCreateSchema } from "../schema/file.js";
import type { ProjectConfig } from "../schema/project.js";
import { generateBehaviorPack } from "./behavior-pack.js";
import { createFile } from "./file-entry.js";
import { createBaseManifest } from "./manifest.js";
import { generateProjectReadme } from "./readme.js";
import { generateResourcePack } from "./resource-pack.js";
import { generateScriptProject } from "./script-project.js";

interface GenerationContext {
    config: ProjectConfig;
    projectRoot: string;
    baseManifest: Manifest;
}

export function generateFileList(config: ProjectConfig): FileToCreate[] {
    const context: GenerationContext = {
        config,
        projectRoot: path.join(process.cwd(), config.name),
        baseManifest: createBaseManifest(config)
    };

    const files = [
        createTextFile(context, "README.md", generateProjectReadme(config)),
        ...generateBehaviorPack(context),
        ...generateResourcePack(context),
        ...generateScriptProject(context)
    ];

    return fileToCreateSchema.array().parse(files);
}

function createTextFile(context: GenerationContext, relativePath: string, content: string): FileToCreate {
    return createFile(path.join(context.projectRoot, relativePath), content);
}
