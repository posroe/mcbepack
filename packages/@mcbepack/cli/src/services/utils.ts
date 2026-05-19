import { APIBehaviorManifest } from "@mcbepack/common";
import { readFileSync, writeFileSync } from "node:fs";

type PackageJson = Record<string, Record<string, string> | unknown>;

export function isJson(value: unknown): value is PackageJson {
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
