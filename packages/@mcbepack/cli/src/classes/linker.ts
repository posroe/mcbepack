import fs from "node:fs";
import path from "node:path";

export class Linker {
    constructor(
        private readonly originDir: string,
        private readonly destinationDir: string,
        private readonly dirName: string
    ) { }

    public linkDir(): string | undefined {
        if (!fs.existsSync(this.originDir)) {
            return undefined;
        }

        const linkPath = path.join(this.destinationDir, this.dirName);
        this.unlinkManagedPath(linkPath);

        fs.mkdirSync(this.destinationDir, { recursive: true });
        this.createLink(linkPath);
        return linkPath;
    }

    private createLink(linkPath: string): void {
        try {
            fs.symlinkSync(this.originDir, linkPath, process.platform === "win32" ? "junction" : "dir");
        } catch (error) {
            if (!this.isNodeError(error) || error.code !== "EEXIST") {
                throw error;
            }

            this.unlinkManagedPath(linkPath);
            fs.symlinkSync(this.originDir, linkPath, process.platform === "win32" ? "junction" : "dir");
        }
    }

    private unlinkManagedPath(linkPath: string): void {
        const linkStats = this.lstatIfExists(linkPath);

        if (!linkStats) {
            return;
        }

        if (linkStats.isSymbolicLink()) {
            fs.unlinkSync(linkPath);
            return;
        }

        throw new Error(`Refusing to replace unmanaged path: ${linkPath}`);
    }

    private lstatIfExists(pathName: string): fs.Stats | undefined {
        try {
            return fs.lstatSync(pathName);
        } catch (error) {
            if (this.isNodeError(error) && error.code === "ENOENT") {
                return undefined;
            }

            throw error;
        }
    }

    private isNodeError(error: unknown): error is NodeJS.ErrnoException {
        return error instanceof Error && "code" in error;
    }
}