import path from "node:path";

import { PROJECT_DIRECTORIES, PROJECT_FILES, SCRIPT_PROJECT, TEMPLATE_FILES } from "../config/constants.js";
import type { GenerationContext } from "../config/context.js";
import type { ProjectFileDescriptor } from "../config/schema.js";
import { createFile, json, template } from "./file-factory.js";
import { createPackageJson } from "./package-json.js";

export function generatePackageJsonFile(context: GenerationContext): ProjectFileDescriptor {
    return createFile({
        directory: context.projectRoot,
        name: PROJECT_FILES.packageJson,
        action: "create",
        content: json(createPackageJson(context.config)),
    });
}

export function generateEnvTemplateFile(context: GenerationContext): ProjectFileDescriptor {
    return createFile({
        directory: context.projectRoot,
        name: PROJECT_FILES.env,
        action: "copy",
        source: template(TEMPLATE_FILES.env),
    });
}

export function generateGitignoreTemplateFile(context: GenerationContext): ProjectFileDescriptor {
    return createFile({
        directory: context.projectRoot,
        name: PROJECT_FILES.gitignore,
        action: "copy",
        source: template(TEMPLATE_FILES.gitignore),
    });
}

export function generateTsconfigTemplateFile(context: GenerationContext): ProjectFileDescriptor {
    return createFile({
        directory: context.projectRoot,
        name: PROJECT_FILES.tsconfig,
        action: "copy",
        source: template(TEMPLATE_FILES.tsconfig),
    });
}

export function generateScriptEntryFile(context: GenerationContext): ProjectFileDescriptor {
    if (!context.config.script?.enabled) {
        throw new Error("Cannot generate script entry without Script API enabled");
    }

    return createFile({
        directory: path.join(context.projectRoot, PROJECT_DIRECTORIES.scripts),
        name: SCRIPT_PROJECT.entries[context.config.script.language],
        action: "create",
        content: SCRIPT_PROJECT.initialContent,
    });
}
