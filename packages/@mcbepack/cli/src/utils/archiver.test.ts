import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { PackArchiver } from "./archiver";
import { ProjectPaths } from "./paths";

function createProjectPaths(): ProjectPaths {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "mcbepack-archive-"));
    const paths = {
        projectName: "sample-addon",
        scriptsDir: path.join(root, "scripts"),
        behaviorRootPath: path.join(root, "src", "behavior_pack"),
        resourceRootPath: path.join(root, "src", "resource_pack"),
        behaviorPath: path.join(root, "minecraft", "development_behavior_packs"),
        resourcePath: path.join(root, "minecraft", "development_resource_packs"),
        binPath: path.join(root, "out"),
    };

    fs.mkdirSync(paths.behaviorRootPath, { recursive: true });
    fs.mkdirSync(paths.resourceRootPath, { recursive: true });
    fs.writeFileSync(path.join(paths.behaviorRootPath, "manifest.json"), "{}");
    fs.writeFileSync(path.join(paths.resourceRootPath, "manifest.json"), "{}");

    return paths;
}

describe("PackArchiver", () => {
    test("creates zip, mcpack, and mcaddon outputs", async () => {
        const paths = createProjectPaths();
        const archiver = new PackArchiver(paths);

        await archiver.archive("zip");
        await archiver.archive("mcpack");
        await archiver.archive("mcaddon");

        expect(fs.existsSync(path.join(paths.binPath, "sample-addon_behavior.zip"))).toBe(true);
        expect(fs.existsSync(path.join(paths.binPath, "sample-addon_resource.zip"))).toBe(true);
        expect(fs.existsSync(path.join(paths.binPath, "sample-addon_behavior.mcpack"))).toBe(true);
        expect(fs.existsSync(path.join(paths.binPath, "sample-addon_resource.mcpack"))).toBe(true);
        expect(fs.existsSync(path.join(paths.binPath, "sample-addon.mcaddon"))).toBe(true);
    });
});
