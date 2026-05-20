import type { Manifest } from "@mcbepack/common";

import pkg from "../../package.json" with { type: "json" };
import { Extension } from "../config/enum.js";
import type { Context } from "../prompts.js";
import { json } from "../utils.js";

const pluginPackages = new Set<string>();
export const ver = (): [number, number, number] => [1, 0, 0];

export function buildBaseManifest(context: Context): Manifest {
    return {
        format_version: 2,
        header: {
            name: context.name,
            description: context.description,
            uuid: "",
            version: ver(),
            min_engine_version: context.minEngineVersion,
        },
        metadata: {
            authors: context.author.split(",").map((s) => s.trim()).filter(Boolean),
            generated_with: {
                "create-mcbepack": pkg.version
            },
        },
    };
}

export function buildBehaviorManifest(context: Context): string {
    const base = buildBaseManifest(context);
    const scriptDeps = context.script?.enabled
        ? context.script.dependencies
            .filter((d) => !pluginPackages.has(d.packageName))
            .map((d) => ({ module_name: d.packageName, version: d.version }))
        : [];

    const resourceDep =
        context.script?.enabled && context.extensions.includes(Extension.Resource)
            ? [
                {
                    uuid: context.uuids.resource,
                    version: ver()
                }
            ]
            : [];

    return json({
        ...base,
        header: {
            ...base.header,
            uuid: context.uuids.behavior
        },
        ...(context.script?.enabled ? { capabilities: ["script_eval"] } : {}),
        modules: context.script?.enabled
            ? [
                {
                    type: "script",
                    language: "javascript",
                    entry: "scripts/index.js",
                    uuid: context.uuids.scriptModule,
                    version: ver(),
                }
            ]
            : [],
        dependencies: [...scriptDeps, ...resourceDep],
    });
}

export function buildResourceManifest(context: Context): string {
    const base = buildBaseManifest(context);
    return json({
        ...base,
        header: {
            ...base.header,
            uuid: context.uuids.resource
        },
        modules: [
            {
                type: "resources",
                uuid: context.uuids.resourceModule,
                version: ver()
            }
        ],
        dependencies: context.extensions.includes(Extension.Behavior)
            ? [
                {
                    uuid: context.uuids.behavior,
                    version: ver()
                }
            ]
            : [],
    });
}