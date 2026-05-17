import path from "node:path";

import type { Manifest } from "@mcbepack/common/types";

import { ExtensionType, ScriptLanguage } from "../lib/enums.js";
import type { FileToCreate, ProjectConfig } from "../lib/types.js";
import { fileToCreateSchema } from "../schema/file.js";
import { copyTemplate, createFile, json } from "./file-entry.js";
import { createBaseManifest, createBehaviorManifest, createResourceManifest } from "./manifest.js";
import { createPackageJson } from "./package-json.js";
import { generateProjectReadme } from "./readme.js";

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
        ...createBehaviorPackFiles(context),
        ...createResourcePackFiles(context),
        ...createProjectConfigFiles(context)
    ];

    return fileToCreateSchema.array().parse(files);
}

function createBehaviorPackFiles(context: GenerationContext): FileToCreate[] {
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

function createResourcePackFiles(context: GenerationContext): FileToCreate[] {
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

function createProjectConfigFiles(context: GenerationContext): FileToCreate[] {
    return [
        createTextFile(context, "package.json", json(createPackageJson(context.config))),
        ...createScriptProjectFiles(context)
    ];
}

function createScriptProjectFiles(context: GenerationContext): FileToCreate[] {
    const { config, projectRoot } = context;

    if (!config.script?.enabled) {
        return [];
    }

    const scriptEntry = config.script.language === ScriptLanguage.TypeScript ? "index.ts" : "index.js";
    const files = [
        copyTemplate(path.join(projectRoot, ".env.local"), ".env.local.txt"),
        copyTemplate(path.join(projectRoot, ".gitignore"), ".gitignore.txt"),
        createFile(path.join(projectRoot, "scripts", scriptEntry), "console.log('Hello World!');")
    ];

    if (config.script.language === ScriptLanguage.TypeScript) {
        files.push(copyTemplate(path.join(projectRoot, "tsconfig.json"), "tsconfig.json"));
    }

    return files;
}

function createTextFile(context: GenerationContext, relativePath: string, content: string): FileToCreate {
    return createFile(path.join(context.projectRoot, relativePath), content);
}
