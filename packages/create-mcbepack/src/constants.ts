export enum ExtensionType {
    Behavior = "behavior",
    Resource = "resource"
}

export enum ScriptLanguage {
    TypeScript = "typescript",
    JavaScript = "javascript"
}

export enum ReleaseChannel {
    Stable = "stable",
    Beta = "beta",
    Preview = "preview"
}

export enum FileCreateType {
    File = "file",
    Copy = "copy"
}

export enum PackageManagerName {
    Npm = "npm",
    Yarn = "yarn",
    Pnpm = "pnpm",
    Bun = "bun",
    Deno = "deno"
}

export const MANIFEST_LANGUAGE = "javascript" as const;
export const SCRIPT_MODULE_TYPE = "script" as const;
export const RESOURCE_MODULE_TYPE = "resources" as const;
export const SCRIPT_ENTRY_JS = "scripts/index.js" as const;
