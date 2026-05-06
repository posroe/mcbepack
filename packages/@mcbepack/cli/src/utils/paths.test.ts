import { afterEach, describe, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { getProjectPaths, validateEnv } from "./paths";

const originalCwd = process.cwd();
const originalEnv = { ...process.env };

afterEach(() => {
    process.chdir(originalCwd);
    process.env = { ...originalEnv };
});

describe("paths", () => {
    test("validates required Minecraft environment variables", () => {
        delete process.env.BASE_PATH;
        delete process.env.BEHAVIOR_PATH;
        delete process.env.RESOURCE_PATH;

        expect(() => validateEnv()).toThrow("Missing required environment variables: BASE_PATH, BEHAVIOR_PATH, RESOURCE_PATH");
    });

    test("resolves project paths from cwd and environment", () => {
        const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mcbepack-paths-"));
        process.chdir(projectRoot);
        process.env.BASE_PATH = path.join(projectRoot, "minecraft");
        process.env.BEHAVIOR_PATH = "development_behavior_packs";
        process.env.RESOURCE_PATH = "development_resource_packs";

        const paths = getProjectPaths();

        expect(paths.projectName).toBe(path.basename(projectRoot));
        expect(paths.scriptsDir).toBe(path.join(projectRoot, "scripts"));
        expect(paths.behaviorRootPath).toBe(path.join(projectRoot, "src", "behavior_pack"));
        expect(paths.resourceRootPath).toBe(path.join(projectRoot, "src", "resource_pack"));
        expect(paths.behaviorPath).toBe(path.join(projectRoot, "minecraft", "development_behavior_packs"));
        expect(paths.resourcePath).toBe(path.join(projectRoot, "minecraft", "development_resource_packs"));
        expect(paths.binPath).toBe(path.join(projectRoot, "out"));
    });
});
