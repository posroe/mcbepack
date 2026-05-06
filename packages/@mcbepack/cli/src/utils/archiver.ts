import fs from "fs";
import path from "path";
import archiver from "archiver";
import pc from "picocolors";
import { ProjectPaths } from "./paths";

export type ArchiveFormat = "mcpack" | "mcaddon" | "zip";

export class PackArchiver {
    constructor(private paths: ProjectPaths) {
        if (!fs.existsSync(this.paths.binPath)) {
            fs.mkdirSync(this.paths.binPath, { recursive: true });
        }
    }

    private createArchive(outputPath: string, callback: (archive: archiver.Archiver) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            const output = fs.createWriteStream(outputPath);
            const archive = archiver("zip", { zlib: { level: 9 } });

            output.on("close", () => {
                console.log(pc.green(`Created: ${path.basename(outputPath)} (${archive.pointer()} bytes)`));
                resolve();
            });

            archive.on("error", (err) => reject(err));
            archive.pipe(output);

            callback(archive);

            archive.finalize();
        });
    }

    public async createMcpack(): Promise<void> {
        const promises: Promise<void>[] = [];

        if (fs.existsSync(this.paths.behaviorRootPath)) {
            const outputPath = path.join(this.paths.binPath, `${this.paths.projectName}_behavior.mcpack`);
            promises.push(
                this.createArchive(outputPath, (archive) => {
                    archive.directory(this.paths.behaviorRootPath, this.paths.projectName);
                })
            );
        }

        if (fs.existsSync(this.paths.resourceRootPath)) {
            const outputPath = path.join(this.paths.binPath, `${this.paths.projectName}_resource.mcpack`);
            promises.push(
                this.createArchive(outputPath, (archive) => {
                    archive.directory(this.paths.resourceRootPath, this.paths.projectName);
                })
            );
        }

        await Promise.all(promises);
    }

    public async createMcaddon(): Promise<void> {
        const outputPath = path.join(this.paths.binPath, `${this.paths.projectName}.mcaddon`);

        await this.createArchive(outputPath, (archive) => {
            if (fs.existsSync(this.paths.behaviorRootPath)) {
                archive.directory(this.paths.behaviorRootPath, "behavior_pack");
            }
            if (fs.existsSync(this.paths.resourceRootPath)) {
                archive.directory(this.paths.resourceRootPath, "resource_pack");
            }
        });
    }

    public async createZip(): Promise<void> {
        const promises: Promise<void>[] = [];

        if (fs.existsSync(this.paths.behaviorRootPath)) {
            const outputPath = path.join(this.paths.binPath, `${this.paths.projectName}_behavior.zip`);
            promises.push(
                this.createArchive(outputPath, (archive) => {
                    archive.directory(this.paths.behaviorRootPath, this.paths.projectName);
                })
            );
        }

        if (fs.existsSync(this.paths.resourceRootPath)) {
            const outputPath = path.join(this.paths.binPath, `${this.paths.projectName}_resource.zip`);
            promises.push(
                this.createArchive(outputPath, (archive) => {
                    archive.directory(this.paths.resourceRootPath, this.paths.projectName);
                })
            );
        }

        await Promise.all(promises);
    }

    public async archive(format: ArchiveFormat): Promise<void> {
        console.log(pc.cyan(`\nCreating ${format} archive...`));

        switch (format) {
            case "mcpack":
                await this.createMcpack();
                break;
            case "mcaddon":
                await this.createMcaddon();
                break;
            case "zip":
                await this.createZip();
                break;
        }
    }
}
