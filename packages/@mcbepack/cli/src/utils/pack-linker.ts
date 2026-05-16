import fs from "node:fs";
import path from "node:path";

import { ProjectPaths } from "./paths.js";

export class PackLinker {
    constructor(private paths: ProjectPaths) { }

    private linkPack(rootPath: string, destPath: string): string {
        const targetPath = path.join(destPath, this.paths.projectName);

        if (fs.existsSync(targetPath)) {
            const targetStats = fs.lstatSync(targetPath);

            if (targetStats.isSymbolicLink()) {
                fs.unlinkSync(targetPath);
            } else {
                fs.rmSync(targetPath, { recursive: true, force: true });
            }
        }

        fs.mkdirSync(destPath, { recursive: true });
        fs.symlinkSync(rootPath, targetPath, process.platform === "win32" ? "junction" : "dir");
        return targetPath;
    }

    public linkBehaviorPack(): string | undefined {
        if (!fs.existsSync(this.paths.behaviorRootPath)) return undefined;

        return this.linkPack(this.paths.behaviorRootPath, this.paths.behaviorPath);
    }

    public linkResourcePack(): string | undefined {
        if (!fs.existsSync(this.paths.resourceRootPath)) return undefined;

        return this.linkPack(this.paths.resourceRootPath, this.paths.resourcePath);
    }
}
