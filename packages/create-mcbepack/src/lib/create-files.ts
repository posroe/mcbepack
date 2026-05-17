import fs from "node:fs";
import path from "node:path";

import { logger } from "@mcbepack/common/logger";

import { fileToCreateSchema } from "../schema/file.js";
import { FileCreateType } from "./enums.js";
import type { FileToCreate } from "./types.js";

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
            throw error;
        }
    }
}
