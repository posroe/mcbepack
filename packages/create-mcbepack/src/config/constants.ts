import type { GenerationContext } from "./context.js";
import { Extension, PackageManagerName, ScriptLanguage } from "./enum.js";

export const PROJECT_FILES = {
    packageJson: "package.json",
    readme: "README.md",
    manifest: "manifest.json",
    packIcon: "pack_icon.png",
    env: ".env.local",
    gitignore: ".gitignore",
    tsconfig: "tsconfig.json",
} as const;

export const PROJECT_DIRECTORIES = {
    source: "src",
    scripts: "scripts",
    templates: "templates",
} as const;

export const TEMPLATE_FILES = {
    env: ".env.local.txt",
    gitignore: ".gitignore.txt",
    icon: PROJECT_FILES.packIcon,
    tsconfig: PROJECT_FILES.tsconfig,
} as const;

export const MANIFEST_DEFAULTS = {
    formatVersion: 2,
    version: [1, 0, 0],
    language: "javascript",
    modules: {
        script: "script",
        resource: "resources",
    },
    capabilities: {
        script: ["script_eval"],
    },
    scriptEntry: "scripts/index.js",
} as const;

export const PACK_DEFINITIONS = {
    [Extension.BEHAVIOR]: {
        extension: Extension.BEHAVIOR,
        directoryName: "behavior_pack",
        displayName: "Behavior Pack",
        manifest: PROJECT_FILES.manifest,
        icon: PROJECT_FILES.packIcon,
    },
    [Extension.RESOURCE]: {
        extension: Extension.RESOURCE,
        directoryName: "resource_pack",
        displayName: "Resource Pack",
        manifest: PROJECT_FILES.manifest,
        icon: PROJECT_FILES.packIcon,
    },
} as const;

export const SCRIPT_PROJECT = {
    entries: {
        [ScriptLanguage.JAVASCRIPT]: "index.js",
        [ScriptLanguage.TYPESCRIPT]: "index.ts",
    },
    initialContent: "export {};\n",
} as const;

export interface CliScriptDefinition {
    name: string;
    command: string;
    description: string;
    requiresScriptApi: boolean;
    includeInReadme: boolean;
}

export const CLI_SCRIPTS = [
    {
        name: "dev",
        command: "mcbepack dev",
        description: "Start development server",
        requiresScriptApi: true,
        includeInReadme: true,
    },
    {
        name: "build",
        command: "mcbepack build",
        description: "Build project files",
        requiresScriptApi: true,
        includeInReadme: true,
    },
    {
        name: "export:zip",
        command: "mcbepack export zip",
        description: "Export a .zip archive",
        requiresScriptApi: false,
        includeInReadme: true,
    },
    {
        name: "export:mcpack",
        command: "mcbepack export mcpack",
        description: "Export .mcpack archive(s)",
        requiresScriptApi: false,
        includeInReadme: true,
    },
    {
        name: "export:mcaddon",
        command: "mcbepack export mcaddon",
        description: "Export a .mcaddon archive",
        requiresScriptApi: false,
        includeInReadme: true,
    },
    {
        name: "update:stable",
        command: "mcbepack update stable",
        description: "Update Script API (stable) packages",
        requiresScriptApi: true,
        includeInReadme: false,
    },
    {
        name: "update:beta",
        command: "mcbepack update beta",
        description: "Update Script API (beta) packages",
        requiresScriptApi: true,
        includeInReadme: false,
    },
    {
        name: "update:preview",
        command: "mcbepack update preview",
        description: "Update Script API (preview) packages",
        requiresScriptApi: true,
        includeInReadme: false,
    },
] as const satisfies readonly CliScriptDefinition[];

export const DEFAULT_PACKAGE_MANAGER = {
    name: PackageManagerName.BUN,
} as const;

export function getEnabledCliScripts(context: Pick<GenerationContext, "config">): CliScriptDefinition[] {
    return CLI_SCRIPTS.filter((script) => !script.requiresScriptApi || context.config.script?.enabled === true);
}

export function getReadmeScripts(context: Pick<GenerationContext, "config">): CliScriptDefinition[] {
    return getEnabledCliScripts(context).filter((script) => script.includeInReadme);
}
