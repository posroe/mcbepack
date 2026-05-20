import { type Manifest, MINECRAFT_PACKAGES, type Version } from "@mcbepack/common";

import pkg from "../../package.json" with { type: "json" };
import { MANIFEST_DEFAULTS } from "../config/constants.js";
import { Extension } from "../config/enum.js";
import type { ProjectConfig } from "../config/schema.js";

const minecraftPluginPackages = new Set<string>(MINECRAFT_PACKAGES.plugins);
const defaultManifestVersion = (): [number, number, number] => [...MANIFEST_DEFAULTS.version];
const defaultScriptCapabilities = (): ["script_eval"] => [...MANIFEST_DEFAULTS.capabilities.script];

export function createBaseManifest(config: ProjectConfig): Manifest {
    return {
        format_version: MANIFEST_DEFAULTS.formatVersion,
        header: {
            name: config.name,
            description: config.description,
            uuid: "",
            version: defaultManifestVersion(),
            min_engine_version: parseMinimumEngineVersion(config.minimumEngineVersion),
        },
        metadata: {
            authors: parseAuthors(config.author),
            generated_with: {
                "create-mcbepack": parsePackageVersion(pkg.version),
            },
        },
    };
}

export function createBehaviorManifest(config: ProjectConfig, baseManifest: Manifest): Manifest {
    const scriptDependencies = config.script?.enabled
        ? config.script.dependencies
            .filter((dependency) => !minecraftPluginPackages.has(dependency.packageName))
            .map((dependency) => ({
                module_name: dependency.packageName,
                version: dependency.version,
            }))
        : [];

    return {
        ...baseManifest,
        header: {
            ...baseManifest.header,
            uuid: config.uuids.behavior,
        },
        ...(config.script?.enabled ? { capabilities: defaultScriptCapabilities() } : {}),
        modules: config.script?.enabled
            ? [
                {
                    type: MANIFEST_DEFAULTS.modules.script,
                    language: MANIFEST_DEFAULTS.language,
                    entry: MANIFEST_DEFAULTS.scriptEntry,
                    uuid: config.uuids.scriptModule,
                    version: defaultManifestVersion(),
                },
            ]
            : [],
        dependencies: [
            ...scriptDependencies,
            ...(config.script?.enabled && config.extensions.includes(Extension.RESOURCE)
                ? [
                    {
                        uuid: config.uuids.resource,
                        version: defaultManifestVersion(),
                    },
                ]
                : [])
        ],
    };
}

export function createResourceManifest(config: ProjectConfig, baseManifest: Manifest): Manifest {
    return {
        ...baseManifest,
        header: {
            ...baseManifest.header,
            uuid: config.uuids.resource,
        },
        modules: [
            {
                type: MANIFEST_DEFAULTS.modules.resource,
                uuid: config.uuids.resourceModule,
                version: defaultManifestVersion(),
            },
        ],
        dependencies: config.extensions.includes(Extension.BEHAVIOR)
            ? [
                {
                    uuid: config.uuids.behavior,
                    version: defaultManifestVersion(),
                }
            ]
            : [],
    };
}

function parseAuthors(author: string): string[] {
    return author.split(",").map((value) => value.trim()).filter(Boolean);
}

function parseMinimumEngineVersion(version: string): [number, number, number] {
    const [major, minor, patch] = version.split(".").map(Number);

    if (major === undefined || minor === undefined || patch === undefined) {
        throw new Error(`Invalid minimum engine version: ${version}`);
    }

    return [major, minor, patch];
}

function parsePackageVersion(version: string): Version {
    return /^\d+\.\d+\.\d+(?:-.+)?$/.test(version) ? version : undefined;
}
