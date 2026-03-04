import fs from "fs";
import path from "path";
import chokidar from "chokidar";
import pc from "picocolors";
import { ProjectPaths } from "./paths";

type SyncAction = "copy" | "unlink" | "unlinkDir";

export class FileSync {
    constructor(private paths: ProjectPaths) { }

    private syncFile(filePath: string, action: SyncAction): void {
        const destPath = this.getDestPath(filePath);
        if (!destPath) return;
        try {
            if (action === "copy") {
                fs.mkdirSync(path.dirname(destPath), { recursive: true });
                fs.copyFileSync(filePath, destPath);
                console.log(pc.green(`Synced: ${path.basename(filePath)}`));
            } else if (action === "unlink") {
                if (fs.existsSync(destPath)) {
                    fs.unlinkSync(destPath);
                    console.log(pc.red(`Unlinked: ${path.basename(filePath)}`));
                }
            } else if (action === "unlinkDir") {
                if (fs.existsSync(destPath)) {
                    fs.rmSync(destPath, { recursive: true, force: true });
                    console.log(pc.red(`Unlinked Dir: ${path.basename(filePath)}`));
                }
            }
        } catch (error) {
            console.error(pc.red(`Error syncing ${filePath}:`), error);
        }
    }

    private setupInitialSync(rootPath: string, destPath: string): void {
        const targetPath = path.join(destPath, this.paths.projectName);

        if (fs.existsSync(targetPath)) {
            fs.rmSync(targetPath, { recursive: true, force: true });
        }
        fs.mkdirSync(targetPath, { recursive: true });
        fs.cpSync(rootPath, targetPath, { recursive: true });
    }

    private getDestPath(filePath: string): string | undefined {
        if (filePath.startsWith(this.paths.behaviorRootPath)) {
            return path.join(
                this.paths.behaviorPath,
                path.basename(process.cwd()),
                path.relative(this.paths.behaviorRootPath, filePath)
            );
        }
        else if (filePath.startsWith(this.paths.resourceRootPath)) {
            return path.join(
                this.paths.resourcePath,
                path.basename(process.cwd()),
                path.relative(this.paths.resourceRootPath, filePath)
            );
        }
        return undefined;
    }

    public watchBehaviorPack(): void {
        if (!fs.existsSync(this.paths.behaviorRootPath)) return;

        this.setupInitialSync(this.paths.behaviorRootPath, this.paths.behaviorPath);

        chokidar.watch(this.paths.behaviorRootPath, { ignoreInitial: true })
            .on("add", (filePath) => this.syncFile(filePath, "copy"))
            .on("change", (filePath) => this.syncFile(filePath, "copy"))
            .on("unlink", (filePath) => this.syncFile(filePath, "unlink"))
            .on("unlinkDir", (filePath) => this.syncFile(filePath, "unlinkDir"));
    }

    public watchResourcePack(): void {
        if (!fs.existsSync(this.paths.resourceRootPath)) return;

        this.setupInitialSync(this.paths.resourceRootPath, this.paths.resourcePath);

        chokidar.watch(this.paths.resourceRootPath, { ignoreInitial: true })
            .on("add", (filePath) => this.syncFile(filePath, "copy"))
            .on("change", (filePath) => this.syncFile(filePath, "copy"))
            .on("unlink", (filePath) => this.syncFile(filePath, "unlink"))
            .on("unlinkDir", (filePath) => this.syncFile(filePath, "unlinkDir"));
    }
}
