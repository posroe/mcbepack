import { readFileSync, writeFileSync } from "node:fs";

import chalk from "chalk";

import { APIBehaviorManifest, formatPath, logger } from "@mcbepack/common";

import pkg from "../../package.json" with { type: "json" };
import { DIRECTORIES, NAMES } from "../config/constant.js";


export function validateEnv(env: NodeJS.ProcessEnv, keys: string[]) {
    try {
        const values = keys.map((key) => {
            const value = env[key];

            if (!value || value.length === 0 || typeof value !== "string") {
                throw new Error(`Missing required environment variable: ${key}`);
            }

            return value;
        });

        return values;
    } catch (error) {
        logger.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

export function statusLog(mode: "production" | "development") {
    logger.logo();
    logger.header("mcbepack", pkg.version);
    logger.field("Project", chalk.bold(NAMES.project));
    logger.field("Mode", chalk.cyan(mode));
    logger.field("Behavior", formatPath(DIRECTORIES.behavior.destination));
    logger.field("Resource", formatPath(DIRECTORIES.resource.destination));
}

export function isJson(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isStringRecord(value: unknown): value is Record<string, string> {
    return typeof value === "object"
        && value !== null
        && !Array.isArray(value)
        && Object.values(value).every((entry) => typeof entry === "string");
}

export function readJsonFile(filePath: string): unknown {
    return JSON.parse(readFileSync(filePath, "utf-8"));
}

export function writeJsonFile(filePath: string, value: unknown): void {
    writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf-8");
}

export function isApiBehaviorManifest(value: unknown): value is APIBehaviorManifest {
    return typeof value === "object"
        && value !== null
        && "dependencies" in value
        && Array.isArray(value.dependencies);
}
