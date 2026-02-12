import path from "node:path";
import { fileURLToPath } from "node:url";
import { Manifest, APIBehaviorManifest, constants } from "@mcbepack/common";
import { ProjectConfig, FileToCreate } from "../types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        content: "",
        type: "copy",
        source: path.join(templatesDir, "README.md"),
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
                source: path.join(templatesDir, ".env.local"),
            });

            files.push({
                path: path.join(projectRoot, ".gitignore"),
                content: "",
                type: "copy",
                source: path.join(templatesDir, ".gitignore"),
            });

            const packageJson = {
                scripts: {
                    dev: "mcbepack dev",
                    "build:zip": "mcbepack build -o zip",
                    "build:mcpack": "mcbepack build -o mcpack",
                    "build:addon": "mcbepack build -o addon",
                    "update:stable": "mcbepack update -o stable",
                    "update:beta": "mcbepack update -o beta",
                    "update:preview": "mcbepack update -o preview",
                },
                devDependencies: Object.fromEntries(
                    config.script.dependencies.map(dep => [dep.packageName, dep.fullVersion])
                ),
                peerDependencies: {
                    "@mcbepack/cli": "latest",
                    "@mcbepack/api": "latest",
                    ...(config.script.language === "typescript" ? { "typescript": "latest" } : {})
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
                    uuid: config.uuids.resource,
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
                    "build:zip": "mcbepack build -o zip",
                    "build:mcpack": "mcbepack build -o mcpack",
                    "build:addon": "mcbepack build -o addon",
                },
                peerDependencies: {
                    "@mcbepack/cli": "latest"
                }
            }, null, 2),
            type: "file",
        });
    }

    return files;
}
