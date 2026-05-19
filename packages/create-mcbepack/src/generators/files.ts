import path from "node:path";

import type { FileToCreate } from "../schema/file.js";
import { fileToCreateSchema } from "../schema/file.js";
import type { ProjectConfig } from "../schema/project.js";
import { generateBehaviorPack } from "./behavior-pack.js";
import type { GenerationContext } from "./context.js";
import { createFile } from "./file-factory.js";
import { createBaseManifest } from "./manifest-builder.js";
import { generateProjectReadme } from "./readme-builder.js";
import { generateResourcePack } from "./resource-pack.js";
import { generateScriptProject } from "./script-project.js";

export function generateFileList(config: ProjectConfig, projectRoot: string): FileToCreate[] {
    const context: GenerationContext = {
        config,
        projectRoot,
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
