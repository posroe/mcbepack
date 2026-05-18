import fs from "node:fs";
import path from "node:path";

import { logger } from "@mcbepack/common";
import archiver from "archiver";

import type { ArchiveFormat } from "../domain.js";
import { ProjectPaths } from "./project-paths.js";

export class PackArchiver {
    constructor(private readonly projectPaths: ProjectPaths) {
        if (!fs.existsSync(this.projectPaths.outputDir)) {
            fs.mkdirSync(this.projectPaths.outputDir, { recursive: true });
        }
    }

    public async archive(archiveFormat: ArchiveFormat): Promise<void> {
        logger.step(`Creating ${archiveFormat} archive...`);

        switch (archiveFormat) {
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

    private createArchive(outputPath: string, addFiles: (archive: archiver.Archiver) => void): Promise<void> {
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

    private async createMcpack(): Promise<void> {
        const archives: Promise<void>[] = [];

        if (fs.existsSync(this.projectPaths.behaviorPackRoot)) {
            archives.push(
                this.createArchive(
                    path.join(this.projectPaths.outputDir, `${this.projectPaths.projectName}_behavior.mcpack`),
                    (archive) => archive.directory(this.projectPaths.behaviorPackRoot, this.projectPaths.projectName)
                )
            );
        }

        if (fs.existsSync(this.projectPaths.resourcePackRoot)) {
            archives.push(
                this.createArchive(
                    path.join(this.projectPaths.outputDir, `${this.projectPaths.projectName}_resource.mcpack`),
                    (archive) => archive.directory(this.projectPaths.resourcePackRoot, this.projectPaths.projectName)
                )
            );
        }

        await Promise.all(archives);
    }

    private async createMcaddon(): Promise<void> {
        await this.createArchive(
            path.join(this.projectPaths.outputDir, `${this.projectPaths.projectName}.mcaddon`),
            (archive) => {
                if (fs.existsSync(this.projectPaths.behaviorPackRoot)) {
                    archive.directory(this.projectPaths.behaviorPackRoot, "behavior_pack");
                }

                if (fs.existsSync(this.projectPaths.resourcePackRoot)) {
                    archive.directory(this.projectPaths.resourcePackRoot, "resource_pack");
                }
            }
        );
    }

    private async createZip(): Promise<void> {
        const archives: Promise<void>[] = [];

        if (fs.existsSync(this.projectPaths.behaviorPackRoot)) {
            archives.push(
                this.createArchive(
                    path.join(this.projectPaths.outputDir, `${this.projectPaths.projectName}_behavior.zip`),
                    (archive) => archive.directory(this.projectPaths.behaviorPackRoot, this.projectPaths.projectName)
                )
            );
        }

        if (fs.existsSync(this.projectPaths.resourcePackRoot)) {
            archives.push(
                this.createArchive(
                    path.join(this.projectPaths.outputDir, `${this.projectPaths.projectName}_resource.zip`),
                    (archive) => archive.directory(this.projectPaths.resourcePackRoot, this.projectPaths.projectName)
                )
            );
        }

        await Promise.all(archives);
    }
}
