import fs from "node:fs";
import path from "node:path";

import { detect } from "package-manager-detector/detect";

import { PackageManager } from "./config/enum.js";

export function json(v: unknown): string {
    return `${JSON.stringify(v, null, 2)}\n`;
}

export async function detectPackageManager(): Promise<PackageManager> {
    const detected = await detect();
    const name = detected?.name as PackageManager | undefined;
    return Object.values(PackageManager).includes(name as PackageManager)
        ? (name as PackageManager)
        : PackageManager.Bun;
}

export type File =
    | { action: "create"; destinationDir: string; content: string | Buffer }
    | { action: "copy"; destinationDir: string; originDir: string };

export class FileGenerator {
    private files: File[] = [];

    constructor(
        private projectRoot: string
    ) { }

    public create(destinationDir: string, content: string | Buffer) {
        this.files.push({ action: "create", destinationDir, content });
    }

    public copy(destinationDir: string, originDir: string) {
        this.files.push({ action: "copy", destinationDir, originDir });
    }

    public generate() {
        if (fs.existsSync(this.projectRoot)) {
            throw new Error(`Directory already exists: ${path.basename(this.projectRoot)}`);
        }
        fs.mkdirSync(this.projectRoot);

        const created = new Set<string>([this.projectRoot]);

        for (const file of this.files) {
            const dir = path.dirname(file.destinationDir);
            if (!created.has(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                created.add(dir);
            }
            if (file.action === "copy") {
                fs.copyFileSync(file.originDir, file.destinationDir);
            } else {
                fs.writeFileSync(file.destinationDir, file.content);
            }
        }
    }
}