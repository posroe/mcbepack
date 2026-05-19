import path from "node:path";

import dotenv from "dotenv";

import { logger } from "@mcbepack/common";

import pkg from "../package.json" with { type: "json" };

dotenv.config({
    path: `${process.cwd()}/.env.local`
});

function validateEnv(env: NodeJS.ProcessEnv, key: string) {
    try {
        const value = env[key];

        if (!value || value.length === 0 || typeof value !== "string") {
            throw new Error(`Missing required environment variable: ${key}`);
        }

        return value;
    } catch (error) {
        logger.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

export const name = {
    behavior: "behavior_pack",
    resource: "resource_pack",
    manifest: "manifest.json",
    package: "package.json",
    project: path.basename(process.cwd()),
}

export const directory = {
    behavior: {
        origin: path.join(process.cwd(), "src", name.behavior),
        destination: path.join(
            validateEnv(process.env, "BASE_PATH"),
            validateEnv(process.env, "BEHAVIOR_PATH")
        ),
    },
    resource: {
        origin: path.join(process.cwd(), "src", name.resource),
        destination: path.join(
            validateEnv(process.env, "BASE_PATH"),
            validateEnv(process.env, "RESOURCE_PATH")
        ),
    },
    output: path.join(process.cwd(), "out"),
    scripts: {
        origin: path.join(process.cwd(), "scripts"),
        destination: path.join(process.cwd(), "src", name.behavior, "scripts"),
    }
}

export const constants = {
    version: pkg.version,
}

export enum Extension {
    MCPACK = "mcpack",
    MCADDON = "mcaddon",
    ZIP = "zip",
}

export enum Release {
    STABLE = "stable",
    BETA = "beta",
    PREVIEW = "preview",
}