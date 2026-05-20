import { SCRIPTS_BASE, SCRIPTS_SCRIPT_API } from "../config/constant.js";
import { ScriptLanguage } from "../config/enum.js";
import type { Context } from "../prompts.js";
import { json } from "../utils.js";

export function buildPackageJson(context: Context) {
    const scripts = context.script?.enabled
        ? [...SCRIPTS_SCRIPT_API, ...SCRIPTS_BASE]
        : [...SCRIPTS_BASE];

    const devDeps: Record<string, string> = { "@mcbepack/cli": "latest" };

    if (context.script?.enabled) {
        devDeps["@mcbepack/api"] = "latest";
        if (context.script.language === ScriptLanguage.TypeScript) {
            devDeps["typescript"] = "latest";
        }
        for (const dep of context.script.dependencies) {
            devDeps[dep.packageName] = dep.fullVersion;
        }
    }

    return json({
        name: context.name,
        scripts: Object.fromEntries(scripts.map((s) => [s.name, s.cmd])),
        devDependencies: devDeps,
    })
}