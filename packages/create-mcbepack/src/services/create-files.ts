import fs from "node:fs";
import path from "node:path";

import { logger } from "@mcbepack/common";

import { FileCreateType } from "../constants/create-options.js";
import type { FileToCreate } from "../schema/file.js";
import { fileToCreateSchema } from "../schema/file.js";

export class FileCreationError extends Error {
    constructor(public readonly filePath: string, cause: unknown) {
        super(`Failed to create file: ${filePath}`, { cause });
        this.name = "FileCreationError";
    }
}

export function createFiles(files: FileToCreate[]): void {
    const filesToCreate = fileToCreateSchema.array().parse(files);

    logger.step(`Creating project files...`);

    for (const file of filesToCreate) {
        try {
            const dir = path.dirname(file.path);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            if (file.type === FileCreateType.Copy && file.source) {
                fs.copyFileSync(file.source, file.path);
            } else {
                fs.writeFileSync(file.path, file.content);
            }

        } catch (error) {
            logger.error(path.relative(process.cwd(), file.path));
            throw new FileCreationError(file.path, error);
        }
    }
}
