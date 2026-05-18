import fs from "node:fs";
import path from "node:path";

import type { MinecraftLinkPaths, ProjectPaths } from "./project-paths.js";

export interface PackLinks {
    behaviorPack?: string;
    resourcePack?: string;
}

export class PackLinker {
    constructor(
        private readonly projectPaths: ProjectPaths,
        private readonly minecraftLinkPaths: MinecraftLinkPaths
    ) { }

    public linkAvailablePacks(): PackLinks {
        const behaviorPack = this.linkBehaviorPack();
        const resourcePack = this.linkResourcePack();
        const packLinks: PackLinks = {};

        if (behaviorPack) {
            packLinks.behaviorPack = behaviorPack;
        }

        if (resourcePack) {
            packLinks.resourcePack = resourcePack;
        }

        return packLinks;
    }

    private linkPack(sourceDir: string, linkDir: string, linkName: string): string {
        const linkPath = path.join(linkDir, linkName);

        if (fs.existsSync(linkPath)) {
            const linkStats = fs.lstatSync(linkPath);

            if (linkStats.isSymbolicLink()) {
                fs.unlinkSync(linkPath);
            } else {
                throw new Error(`Refusing to replace unmanaged path: ${linkPath}`);
            }
        }

        fs.mkdirSync(linkDir, { recursive: true });
        fs.symlinkSync(sourceDir, linkPath, process.platform === "win32" ? "junction" : "dir");
        return linkPath;
    }

    private linkBehaviorPack(): string | undefined {
        if (!fs.existsSync(this.projectPaths.behaviorPackRoot)) {
            return undefined;
        }

        return this.linkPack(
            this.projectPaths.behaviorPackRoot,
            this.minecraftLinkPaths.behaviorPackLinkDir,
            `${this.projectPaths.projectName}_behavior`
        );
    }

    private linkResourcePack(): string | undefined {
        if (!fs.existsSync(this.projectPaths.resourcePackRoot)) {
            return undefined;
        }

        return this.linkPack(
            this.projectPaths.resourcePackRoot,
            this.minecraftLinkPaths.resourcePackLinkDir,
            `${this.projectPaths.projectName}_resource`
        );
    }
}
