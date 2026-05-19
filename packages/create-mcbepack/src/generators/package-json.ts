import { ScriptLanguage } from "../constants.js";
import type { ProjectConfig } from "../schema.js";

export function createPackageJson(config: ProjectConfig): Record<string, unknown> {
    return {
        name: config.name,
        scripts: createPackageScripts(config),
        devDependencies: createDevDependencies(config)
    };
}

function createPackageScripts(config: ProjectConfig): Record<string, string> {
    return {
        ...(config.script?.enabled
            ? {
                dev: "mcbepack dev",
                build: "mcbepack build",
            }
            : {}),
        "export:zip": "mcbepack export zip",
        "export:mcpack": "mcbepack export mcpack",
        "export:mcaddon": "mcbepack export mcaddon",
        ...(config.script?.enabled
            ? {
                "update:stable": "mcbepack update stable",
                "update:beta": "mcbepack update beta",
                "update:preview": "mcbepack update preview",
            }
            : {})
    };
}

function createDevDependencies(config: ProjectConfig): Record<string, string> {
    return {
        "@mcbepack/cli": "latest",
        ...(config.script?.enabled
            ? {
                "@mcbepack/api": "latest",
                ...(config.script.language === ScriptLanguage.TypeScript ? { typescript: "latest" } : {}),
                ...Object.fromEntries(
                    config.script.dependencies.map((dependency) => [dependency.packageName, dependency.fullVersion])
                )
            }
            : {})
    };
}
