import fs from "node:fs";
import path from "node:path";

import { logger } from "@mcbepack/common";

import type { ProjectFileDescriptor } from "../config/schema.js";

export class FileCreationError extends Error {
    constructor(public readonly filePath: string, cause: unknown) {
        super(`Failed to create file: ${filePath}`, { cause });
        this.name = "FileCreationError";
    }
}

export function createFiles(projectRoot: string, files: ProjectFileDescriptor[]): void {
    logger.step(`Creating project files...`);

    try {
        fs.mkdirSync(projectRoot);
    } catch (error) {
        if (isFileExistsError(error)) {
            throw new Error(`Directory ${path.basename(projectRoot)} already exists`);
        }

        throw new FileCreationError(projectRoot, error);
    }

    const createdDirectories = new Set<string>([projectRoot]);

    for (const file of files) {
        try {
            createParentDirectory(file.path, createdDirectories);

            if (file.action === "copy") {
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

function createParentDirectory(filePath: string, createdDirectories: Set<string>): void {
    const directory = path.dirname(filePath);

    if (createdDirectories.has(directory)) {
        return;
    }

    fs.mkdirSync(directory, { recursive: true });
    createdDirectories.add(directory);
}

function isFileExistsError(error: unknown): error is NodeJS.ErrnoException {
    return error instanceof Error && "code" in error && error.code === "EEXIST";
}
