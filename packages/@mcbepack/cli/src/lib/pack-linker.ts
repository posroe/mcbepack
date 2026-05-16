import fs from "node:fs";
import path from "node:path";

import { ProjectPaths } from "./project-paths.js";

export interface PackLinks {
    behaviorPack?: string;
    resourcePack?: string;
}

export class PackLinker {
    constructor(private readonly projectPaths: ProjectPaths) { }

    public linkAvailablePacks(): PackLinks {
        return {
            behaviorPack: this.linkBehaviorPack(),
            resourcePack: this.linkResourcePack()
        };
    }

    private linkPack(sourceDir: string, linkDir: string, linkName: string): string {
        const linkPath = path.join(linkDir, linkName);

        if (fs.existsSync(linkPath)) {
            const linkStats = fs.lstatSync(linkPath);

            if (linkStats.isSymbolicLink()) {
                fs.unlinkSync(linkPath);
            } else {
                fs.rmSync(linkPath, { recursive: true, force: true });
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
            this.projectPaths.behaviorPackLinkDir,
            `${this.projectPaths.projectName}_behavior`
        );
    }

    private linkResourcePack(): string | undefined {
        if (!fs.existsSync(this.projectPaths.resourcePackRoot)) {
            return undefined;
        }

        return this.linkPack(
            this.projectPaths.resourcePackRoot,
            this.projectPaths.resourcePackLinkDir,
            `${this.projectPaths.projectName}_resource`
        );
    }
}
