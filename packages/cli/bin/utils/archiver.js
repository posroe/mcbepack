import fs from "fs";
import path from "path";
import archiver from "archiver";
import pc from "picocolors";
export class PackArchiver {
    paths;
    constructor(paths) {
        this.paths = paths;
        if (!fs.existsSync(this.paths.binPath)) {
            fs.mkdirSync(this.paths.binPath, { recursive: true });
        }
    }
    createArchive(outputPath, callback) {
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
    async createMcpack() {
        const promises = [];
        if (fs.existsSync(this.paths.behaviorRootPath)) {
            const outputPath = path.join(this.paths.binPath, `${this.paths.projectName}_behavior.mcpack`);
            promises.push(this.createArchive(outputPath, (archive) => {
                archive.directory(this.paths.behaviorRootPath, this.paths.projectName);
            }));
        }
        if (fs.existsSync(this.paths.resourceRootPath)) {
            const outputPath = path.join(this.paths.binPath, `${this.paths.projectName}_resource.mcpack`);
            promises.push(this.createArchive(outputPath, (archive) => {
                archive.directory(this.paths.resourceRootPath, this.paths.projectName);
            }));
        }
        await Promise.all(promises);
    }
    async createMcaddon() {
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
    async createZip() {
        const promises = [];
        if (fs.existsSync(this.paths.behaviorRootPath)) {
            const outputPath = path.join(this.paths.binPath, `${this.paths.projectName}_behavior.zip`);
            promises.push(this.createArchive(outputPath, (archive) => {
                archive.directory(this.paths.behaviorRootPath, this.paths.projectName);
            }));
        }
        if (fs.existsSync(this.paths.resourceRootPath)) {
            const outputPath = path.join(this.paths.binPath, `${this.paths.projectName}_resource.zip`);
            promises.push(this.createArchive(outputPath, (archive) => {
                archive.directory(this.paths.resourceRootPath, this.paths.projectName);
            }));
        }
        await Promise.all(promises);
    }
    async archive(format) {
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
