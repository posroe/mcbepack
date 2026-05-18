import { type Manifest, MINECRAFT_PACKAGES, type Version } from "@mcbepack/common";

import pkg from "../../package.json" with { type: "json" };
import {
    MANIFEST_LANGUAGE,
    RESOURCE_MODULE_TYPE,
    SCRIPT_ENTRY_JS,
    SCRIPT_MODULE_TYPE
} from "../constants/manifest.js";
import { ExtensionType } from "../lib/enums.js";
import type { ProjectConfig } from "../schema/project.js";

const minecraftPluginPackages = new Set<string>(MINECRAFT_PACKAGES.plugins);
const scriptCapabilities: ["script_eval"] = ["script_eval"];

export function createBaseManifest(config: ProjectConfig): Manifest {
    return {
        format_version: 2,
        header: {
            name: config.name,
            description: config.description,
            uuid: "",
            version: [1, 0, 0],
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
        ...(config.script?.enabled ? { capabilities: scriptCapabilities } : {}),
        modules: config.script?.enabled
            ? [
                {
                    type: SCRIPT_MODULE_TYPE,
                    language: MANIFEST_LANGUAGE,
                    entry: SCRIPT_ENTRY_JS,
                    uuid: config.uuids.scriptModule,
                    version: [1, 0, 0],
                },
            ]
            : [],
        dependencies: [
            ...scriptDependencies,
            ...(config.script?.enabled && config.extensions.includes(ExtensionType.Resource)
                ? [
                    {
                        uuid: config.uuids.resource,
                        version: [1, 0, 0],
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
                type: RESOURCE_MODULE_TYPE,
                uuid: config.uuids.resourceModule,
                version: [1, 0, 0],
            },
        ],
        dependencies: config.extensions.includes(ExtensionType.Behavior)
            ? [
                {
                    uuid: config.uuids.behavior,
                    version: [1, 0, 0],
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
