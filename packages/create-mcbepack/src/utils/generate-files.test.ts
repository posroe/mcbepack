import { afterEach, describe, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { generateFileList } from "./generate-files";
import { ProjectConfig } from "../types";

const originalCwd = process.cwd();

afterEach(() => {
    process.chdir(originalCwd);
});

function withTempCwd() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mcbepack-create-"));
    process.chdir(dir);
    return dir;
}

function baseConfig(overrides: Partial<ProjectConfig> = {}): ProjectConfig {
    return {
        name: "sample-addon",
        description: "Sample add-on",
        author: "Alex, Jamie",
        minimumEngineVersion: "1.21.0",
        extensions: ["behavior", "resource"],
        uuids: {
            behavior: "00000000-0000-4000-8000-000000000001",
            resource: "00000000-0000-4000-8000-000000000002",
            scriptModule: "00000000-0000-4000-8000-000000000003",
        },
        ...overrides,
    };
}

function findFile(files: ReturnType<typeof generateFileList>, suffix: string) {
    const normalizedSuffix = suffix.replaceAll("/", path.sep);
    const file = files.find((item) => item.path.endsWith(normalizedSuffix));
    expect(file).toBeDefined();
    return file!;
}

describe("generateFileList", () => {
    test("creates Script API project files with installable dev dependencies", () => {
        const cwd = withTempCwd();
        const files = generateFileList(baseConfig({
            script: {
                enabled: true,
                language: "typescript",
                release: "stable",
                packages: ["@minecraft/server", "@minecraft/server-ui"],
                dependencies: [
                    {
                        packageName: "@minecraft/server",
                        version: "2.0.0",
                        fullVersion: "2.0.0",
                    },
                    {
                        packageName: "@minecraft/server-ui",
                        version: "2.0.0",
                        fullVersion: "2.0.0",
                    },
                ],
            },
        }));

        const packageJson = JSON.parse(String(findFile(files, "package.json").content));
        expect(packageJson.scripts["build:mcaddon"]).toBe("mcbepack build -o mcaddon");
        expect(packageJson.scripts["build:addon"]).toBeUndefined();
        expect(packageJson.devDependencies["@mcbepack/cli"]).toBe("latest");
        expect(packageJson.devDependencies["@mcbepack/api"]).toBe("latest");
        expect(packageJson.devDependencies.typescript).toBe("latest");
        expect(packageJson.devDependencies["@minecraft/server"]).toBe("2.0.0");
        expect(packageJson.peerDependencies).toBeUndefined();

        const behaviorManifest = JSON.parse(String(findFile(files, "src/behavior_pack/manifest.json").content));
        expect(behaviorManifest.header.uuid).toBe("00000000-0000-4000-8000-000000000001");
        expect(behaviorManifest.modules[0]).toMatchObject({
            type: "script",
            language: "javascript",
            entry: "scripts/index.js",
            uuid: "00000000-0000-4000-8000-000000000003",
        });
        expect(behaviorManifest.dependencies).toContainEqual({
            module_name: "@minecraft/server",
            version: "2.0.0",
        });
        expect(behaviorManifest.dependencies).toContainEqual({
            uuid: "00000000-0000-4000-8000-000000000002",
            version: [1, 0, 0],
        });

        expect(findFile(files, path.join(cwd, "sample-addon", "scripts", "index.ts"))).toBeDefined();
    });

    test("uses build:mcaddon for non-script projects", () => {
        withTempCwd();
        const files = generateFileList(baseConfig({
            extensions: ["resource"],
        }));

        const packageJson = JSON.parse(String(findFile(files, "package.json").content));
        expect(packageJson.scripts).toEqual({
            "build:zip": "mcbepack build -o zip",
            "build:mcpack": "mcbepack build -o mcpack",
            "build:mcaddon": "mcbepack build -o mcaddon",
        });
        expect(packageJson.devDependencies["@mcbepack/cli"]).toBe("latest");
        expect(packageJson.peerDependencies).toBeUndefined();
    });
});
