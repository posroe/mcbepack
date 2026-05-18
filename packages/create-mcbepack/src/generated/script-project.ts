import path from "node:path";

import { ScriptLanguage } from "../lib/enums.js";
import type { FileToCreate } from "../schema/file.js";
import type { ProjectConfig } from "../schema/project.js";
import { copyTemplate, createFile, json } from "./file-entry.js";
import { createPackageJson } from "./package-json.js";

interface GenerationContext {
    config: ProjectConfig;
    projectRoot: string;
}

export function generateScriptProject(context: GenerationContext): FileToCreate[] {
    const { config, projectRoot } = context;
    const files = [
        createFile(path.join(projectRoot, "package.json"), json(createPackageJson(config))),
    ];

    if (!config.script?.enabled) {
        return files;
    }

    const scriptEntry = config.script.language === ScriptLanguage.TypeScript ? "index.ts" : "index.js";

    files.push(
        copyTemplate(path.join(projectRoot, ".env.local"), ".env.local.txt"),
        copyTemplate(path.join(projectRoot, ".gitignore"), ".gitignore.txt"),
        createFile(path.join(projectRoot, "scripts", scriptEntry), "console.log('Hello World!');")
    );

    if (config.script.language === ScriptLanguage.TypeScript) {
        files.push(copyTemplate(path.join(projectRoot, "tsconfig.json"), "tsconfig.json"));
    }

    return files;
}
