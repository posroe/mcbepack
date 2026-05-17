import { randomUUID } from "node:crypto";

import * as constants from "@mcbepack/common/constants";
import type { APIBehaviorManifest, Manifest } from "@mcbepack/common/types";

import { ExtensionType } from "../lib/enums.js";
import type { ProjectConfig } from "../lib/types.js";

const minecraftPluginPackages = new Set<string>(constants.packages.plugins);

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
                "create-mcbepack": [1, 0, 0],
            },
        },
    };
}

export function createBehaviorManifest(config: ProjectConfig, baseManifest: Manifest): APIBehaviorManifest {
    const manifest: APIBehaviorManifest = {
        ...baseManifest,
        header: {
            ...baseManifest.header,
            uuid: config.uuids.behavior,
        },
        capabilities: ["script_eval"],
        modules: [],
        dependencies: [],
    };

    if (!config.script?.enabled) {
        return manifest;
    }

    manifest.modules = [
        {
            type: "script",
            language: "javascript",
            entry: "scripts/index.js",
            uuid: config.uuids.scriptModule,
            version: [1, 0, 0],
        },
    ];

    manifest.dependencies = config.script.dependencies
        .filter((dependency) => !minecraftPluginPackages.has(dependency.packageName))
        .map((dependency) => ({
            module_name: dependency.packageName,
            version: dependency.version,
        }));

    if (config.extensions.includes(ExtensionType.Resource)) {
        manifest.dependencies.push({
            uuid: config.uuids.resource,
            version: [1, 0, 0],
        });
    }

    return manifest;
}

export function createResourceManifest(config: ProjectConfig, baseManifest: Manifest): Manifest {
    const manifest: Manifest = {
        ...baseManifest,
        header: {
            ...baseManifest.header,
            uuid: config.uuids.resource,
        },
        modules: [
            {
                type: "resources",
                uuid: randomUUID(),
                version: [1, 0, 0],
            },
        ],
        dependencies: [],
    };

    if (config.extensions.includes(ExtensionType.Behavior)) {
        manifest.dependencies = [
            {
                uuid: config.uuids.behavior,
                version: [1, 0, 0],
            }
        ];
    }

    return manifest;
}

function parseAuthors(author: string): string[] {
    return author.split(",").map((value) => value.trim()).filter(Boolean);
}

function parseMinimumEngineVersion(version: string): [number, number, number] {
    return version.split(".").map(Number) as [number, number, number];
}
