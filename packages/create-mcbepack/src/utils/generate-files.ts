import path from "node:path";
import { fileURLToPath } from "node:url";

import * as constants from "@mcbepack/common/constants";
import type { APIBehaviorManifest, Manifest } from "@mcbepack/common/types";

import type { FileToCreate, ProjectConfig } from "../types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateProjectReadme(config: ProjectConfig): string {
    const hasScripts = Boolean(config.script?.enabled);
    const startSection = hasScripts
        ? `Run the development watcher:

\`\`\`bash
bun run dev
\`\`\`

The dev command links available pack folders into Minecraft's development folders and watches Script API code from \`scripts/\`.
`
        : "Edit files in `src/`, then run a build command when you are ready to package the add-on.\n";
    const configSection = hasScripts
        ? `## Configure Minecraft Paths

Edit \`.env.local\` if your Minecraft Bedrock installation uses a different location:

\`\`\`env
BASE_PATH="C:\\Users\\YourName\\AppData\\Roaming\\Minecraft Bedrock\\Users\\Shared\\games\\com.mojang"
RESOURCE_PATH="development_resource_packs"
BEHAVIOR_PATH="development_behavior_packs"
\`\`\`

`
        : "";
    const treeEntries = [
        ...(hasScripts ? ["scripts/"] : []),
        "src/",
        ...(hasScripts ? [".env.local"] : []),
        "package.json",
        ...(config.script?.language === "typescript" ? ["tsconfig.json"] : [])
    ];
    const packEntries = [
        ...(config.extensions.includes("behavior") ? ["behavior_pack/"] : []),
        ...(config.extensions.includes("resource") ? ["resource_pack/"] : [])
    ];
    const tree = treeEntries.map((entry, index) => {
        const connector = index === treeEntries.length - 1 ? "`-- " : "|-- ";

        if (entry !== "src/") {
            return `${connector}${entry}`;
        }

        const packLines = packEntries.map((packEntry, packIndex) => {
            const packConnector = packIndex === packEntries.length - 1 ? "`-- " : "|-- ";
            return `|   ${packConnector}${packEntry}`;
        });

        return [`${connector}${entry}`, ...packLines].join("\n");
    }).join("\n");

    return `# ${config.name}

${config.description}

This add-on was created with [\`create-mcbepack\`](https://npmjs.com/package/create-mcbepack).

## Start

Install dependencies:

\`\`\`bash
bun install
\`\`\`

${startSection}
## Build

Build project files:

\`\`\`bash
bun run build
\`\`\`

Export archives:

\`\`\`bash
bun run export:zip
bun run export:mcpack
bun run export:mcaddon
\`\`\`

Archive outputs are written to \`out/\`.

${configSection}## Project Structure

\`\`\`text
.
${tree}
\`\`\`

Some folders only exist when they were selected during project creation.
`;
}

export function generateFileList(config: ProjectConfig): FileToCreate[] {
    const files: FileToCreate[] = [];
    const projectRoot = path.join(process.cwd(), config.name);
    const templatesDir = path.join(__dirname, "..", "..", "templates");

    const baseManifest: Manifest = {
        format_version: 2,
        header: {
            name: config.name,
            description: config.description,
            uuid: "",
            version: [1, 0, 0],
            min_engine_version: config.minimumEngineVersion.split('.').map(Number) as [number, number, number],
        },
        metadata: {
            authors: config.author.split(',').map(a => a.trim()),
            generated_with: {
                "create-mcbepack": [1, 0, 0],
            },
        },
    };

    files.push({
        path: path.join(projectRoot, "README.md"),
        content: generateProjectReadme(config),
        type: "file",
    });

    if (config.extensions.includes("behavior")) {
        const bpRoot = path.join(projectRoot, "src", "behavior_pack");

        files.push({
            path: path.join(bpRoot, "pack_icon.png"),
            content: "",
            type: "copy",
            source: path.join(templatesDir, "pack_icon.png"),
        });

        const bpManifest: APIBehaviorManifest = {
            ...baseManifest,
            header: {
                ...baseManifest.header,
                uuid: config.uuids.behavior,
            },
            capabilities: ['script_eval'],
            modules: [],
            dependencies: [],
        };

        if (config.script?.enabled) {
            bpManifest.modules = [
                {
                    type: "script",
                    language: "javascript",
                    entry: "scripts/index.js",
                    uuid: config.uuids.scriptModule,
                    version: [1, 0, 0],
                },
            ];

            bpManifest.dependencies = [
                ...config.script.dependencies
                    .filter(dep => !constants.packages.plugins.includes(dep.packageName))
                    .map(dep => ({
                        module_name: dep.packageName,
                        version: dep.version,
                    })),
            ];

            if (config.extensions.includes("resource")) {
                bpManifest.dependencies.push({
                    uuid: config.uuids.resource,
                    version: [1, 0, 0],
                });
            }

            files.push({
                path: path.join(projectRoot, ".env.local"),
                content: "",
                type: "copy",
                source: path.join(templatesDir, ".env.local.txt"),
            });

            files.push({
                path: path.join(projectRoot, ".gitignore"),
                content: "",
                type: "copy",
                source: path.join(templatesDir, ".gitignore.txt"),
            });

            const packageJson = {
                name: config.name,
                scripts: {
                    dev: "mcbepack dev",
                    build: "mcbepack build",
                    "export:zip": "mcbepack export zip",
                    "export:mcpack": "mcbepack export mcpack",
                    "export:mcaddon": "mcbepack export mcaddon",
                    "update:stable": "mcbepack update stable",
                    "update:beta": "mcbepack update beta",
                    "update:preview": "mcbepack update preview",
                },
                devDependencies: {
                    "@mcbepack/cli": "latest",
                    "@mcbepack/api": "latest",
                    ...(config.script.language === "typescript" ? { "typescript": "latest" } : {}),
                    ...Object.fromEntries(
                        config.script.dependencies.map(dep => [dep.packageName, dep.fullVersion])
                    )
                }
            };

            files.push({
                path: path.join(projectRoot, "package.json"),
                content: JSON.stringify(packageJson, null, 2),
                type: "file",
            });

            const scriptsDir = path.join(projectRoot, "scripts");
            if (config.script.language === "typescript") {
                files.push({
                    path: path.join(scriptsDir, "index.ts"),
                    content: "console.log('Hello World!');",
                    type: "file",
                });

                files.push({
                    path: path.join(projectRoot, "tsconfig.json"),
                    content: "",
                    type: "copy",
                    source: path.join(templatesDir, "tsconfig.json"),
                });
            } else {
                files.push({
                    path: path.join(scriptsDir, "index.js"),
                    content: "console.log('Hello World!');",
                    type: "file",
                });
            }
        }

        files.push({
            path: path.join(bpRoot, "manifest.json"),
            content: JSON.stringify(bpManifest, null, 2),
            type: "file",
        });
    }

    if (config.extensions.includes("resource")) {
        const rpRoot = path.join(projectRoot, "src", "resource_pack");

        files.push({
            path: path.join(rpRoot, "pack_icon.png"),
            content: "",
            type: "copy",
            source: path.join(templatesDir, "pack_icon.png"),
        });

        const rpManifest: Manifest = {
            ...baseManifest,
            header: {
                ...baseManifest.header,
                uuid: config.uuids.resource,
            },
            modules: [
                {
                    type: "resources",
                    uuid: crypto.randomUUID(),
                    version: [1, 0, 0],
                },
            ],
            dependencies: [],
        };

        if (config.extensions.includes("behavior")) {
            rpManifest.dependencies = [
                {
                    uuid: config.uuids.behavior,
                    version: [1, 0, 0],
                }
            ];
        }

        files.push({
            path: path.join(rpRoot, "manifest.json"),
            content: JSON.stringify(rpManifest, null, 2),
            type: "file",
        });
    }

    if (!config.script?.enabled) {
        files.push({
            path: path.join(projectRoot, "package.json"),
            content: JSON.stringify({
                scripts: {
                    build: "mcbepack build",
                    "export:zip": "mcbepack export zip",
                    "export:mcpack": "mcbepack export mcpack",
                    "export:mcaddon": "mcbepack export mcaddon",
                },
                devDependencies: {
                    "@mcbepack/cli": "latest"
                }
            }, null, 2),
            type: "file",
        });
    }

    return files;
}
