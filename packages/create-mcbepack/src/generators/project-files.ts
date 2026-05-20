import type { GenerationContext } from "../config/context.js";
import { Extension, ScriptLanguage } from "../config/enum.js";
import type { ProjectFileDescriptor } from "../config/schema.js";
import { generateBehaviorManifestFile, generateBehaviorPackIconFile, generateResourceManifestFile, generateResourcePackIconFile } from "./pack.js";
import { generateReadmeFile } from "./readme.js";
import { generateEnvTemplateFile, generateGitignoreTemplateFile, generatePackageJsonFile, generateScriptEntryFile, generateTsconfigTemplateFile } from "./script-project.js";

export function generateProjectFiles(context: GenerationContext): ProjectFileDescriptor[] {
    const files: ProjectFileDescriptor[] = [];

    files.push(generateReadmeFile(context));

    if (context.config.extensions.includes(Extension.BEHAVIOR)) {
        files.push(generateBehaviorPackIconFile(context));
        files.push(generateBehaviorManifestFile(context));
    }

    if (context.config.extensions.includes(Extension.RESOURCE)) {
        files.push(generateResourcePackIconFile(context));
        files.push(generateResourceManifestFile(context));
    }

    files.push(generatePackageJsonFile(context));

    if (context.config.script?.enabled) {
        files.push(generateEnvTemplateFile(context));
        files.push(generateGitignoreTemplateFile(context));
        files.push(generateScriptEntryFile(context));

        if (context.config.script.language === ScriptLanguage.TYPESCRIPT) {
            files.push(generateTsconfigTemplateFile(context));
        }
    }

    return files;
}
