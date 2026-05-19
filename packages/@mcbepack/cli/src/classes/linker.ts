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

        if (fs.existsSync(linkPath)) {
            const linkStats = fs.lstatSync(linkPath);

            if (linkStats.isSymbolicLink()) {
                fs.unlinkSync(linkPath);
            } else {
                throw new Error(`Refusing to replace unmanaged path: ${linkPath}`);
            }
        }

        fs.mkdirSync(this.destinationDir, { recursive: true });
        fs.symlinkSync(this.originDir, linkPath, process.platform === "win32" ? "junction" : "dir");
        return linkPath;
    }
}