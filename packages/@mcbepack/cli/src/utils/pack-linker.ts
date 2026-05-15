import fs from "fs";
import path from "path";
import pc from "picocolors";
import { ProjectPaths } from "./paths.js";

export class PackLinker {
    constructor(private paths: ProjectPaths) { }

    private linkPack(rootPath: string, destPath: string): void {
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
        console.log(pc.green(`Linked: ${targetPath} -> ${rootPath}`));
    }

    public linkBehaviorPack(): void {
        if (!fs.existsSync(this.paths.behaviorRootPath)) return;

        this.linkPack(this.paths.behaviorRootPath, this.paths.behaviorPath);
    }

    public linkResourcePack(): void {
        if (!fs.existsSync(this.paths.resourceRootPath)) return;

        this.linkPack(this.paths.resourceRootPath, this.paths.resourcePath);
    }
}
