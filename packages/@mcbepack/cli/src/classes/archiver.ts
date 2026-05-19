import fs from "node:fs";
import path from "node:path";

import archiver from "archiver";

import { logger } from "@mcbepack/common";

export class Archiver {
    constructor(
        private readonly dir: {
            origin: string;
            name: string;
        }[],
        private readonly destinationDir: string,
    ) {
        if (!fs.existsSync(this.destinationDir)) {
            fs.mkdirSync(this.destinationDir, { recursive: true });
        }
    }

    private compact(outputPath: string, addFiles: (archive: archiver.Archiver) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            const output = fs.createWriteStream(outputPath);
            const archive = archiver("zip", { zlib: { level: 9 } });

            output.on("close", () => {
                logger.success(`Created ${path.basename(outputPath)} (${archive.pointer()} bytes)`);
                resolve();
            });

            archive.on("error", (err) => reject(err));
            archive.pipe(output);
            addFiles(archive);
            archive.finalize();
        });
    }

    public async create(extension: string) {
        const archives: Promise<void>[] = [];

        for (const dir of this.dir) {
            archives.push(
                this.compact(
                    path.join(this.destinationDir, `${dir.name}.${extension}`),
                    (archive) => archive.directory(dir.origin, dir.name)
                )
            )
        }

        return await Promise.all(archives);
    }

    public async createCompound(extension: string, dirName: string) {
        return await this.compact(
            path.join(this.destinationDir, `${dirName}.${extension}`),
            (archive) => {
                for (const dir of this.dir) {
                    archive.directory(dir.origin, dir.name);
                }
            }
        );
    }
}
