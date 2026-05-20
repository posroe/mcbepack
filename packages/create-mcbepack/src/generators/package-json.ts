import { getEnabledCliScripts } from "../config/constants.js";
import { ScriptLanguage } from "../config/enum.js";
import type { ProjectConfig } from "../config/schema.js";

export function createPackageJson(config: ProjectConfig): Record<string, unknown> {
    return {
        name: config.name,
        scripts: Object.fromEntries(
            getEnabledCliScripts({ config }).map((script) => [script.name, script.command])
        ),
        devDependencies: createDevDependencies(config)
    };
}

function createDevDependencies(config: ProjectConfig): Record<string, string> {
    return {
        "@mcbepack/cli": "latest",
        ...(config.script?.enabled
            ? {
                "@mcbepack/api": "latest",
                ...(config.script.language === ScriptLanguage.TYPESCRIPT ? { typescript: "latest" } : {}),
                ...Object.fromEntries(
                    config.script.dependencies.map((dependency) => [dependency.packageName, dependency.fullVersion])
                )
            }
            : {})
    };
}
