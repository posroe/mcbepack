import path from "node:path";
import { fileURLToPath } from "node:url";

import { FileCreateType } from "../lib/enums.js";
import type { FileToCreate } from "../schema/file.js";
import { fileToCreateSchema } from "../schema/file.js";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);
const templatesDir = path.join(currentDir, "..", "..", "templates");

export function createFile(filePath: string, content: string | Buffer): FileToCreate {
    return fileToCreateSchema.parse({
        path: filePath,
        content,
        type: FileCreateType.File,
    });
}

export function copyTemplate(filePath: string, templateName: string): FileToCreate {
    return fileToCreateSchema.parse({
        path: filePath,
        content: "",
        type: FileCreateType.Copy,
        source: path.join(templatesDir, templateName),
    });
}

export function json(value: unknown): string {
    return JSON.stringify(value, null, 2);
}
