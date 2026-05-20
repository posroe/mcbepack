import path from "node:path";
import { fileURLToPath } from "node:url";

import type { ProjectFileDescriptor } from "../config/schema.js";

interface CreateFileOptions {
    directory: string;
    name: string;
    action: "create" | "copy";
    content?: string | Buffer;
    source?: string;
}

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);
const templatesDir = path.join(currentDir, "..", "..", "templates");

export function createFile(options: CreateFileOptions): ProjectFileDescriptor {
    const destination = {
        directory: options.directory,
        name: options.name,
        extension: path.extname(options.name),
        path: path.join(options.directory, options.name),
    };

    if (options.action === "copy") {
        if (!options.source) {
            throw new Error(`Copy file requires source: ${options.name}`);
        }

        return {
            action: "copy",
            ...destination,
            source: options.source,
        };
    }

    if (options.content === undefined) {
        throw new Error(`Create file requires content: ${options.name}`);
    }

    return {
        action: "create",
        ...destination,
        content: options.content,
    };
}

export function template(templateName: string): string {
    return path.join(templatesDir, templateName);
}

export function json(value: unknown): string {
    return `${JSON.stringify(value, null, 2)}\n`;
}
