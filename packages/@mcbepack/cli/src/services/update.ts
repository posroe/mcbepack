import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { getDependency, logger, MINECRAFT_PACKAGES } from "@mcbepack/common";
import type { APIBehaviorManifest } from "@mcbepack/common/types/manifest";

import { getProjectPaths } from "../config/project-paths.js";
import type { ReleaseChannel } from "../types/cli-options.js";

type PackageJson = Record<string, Record<string, string> | unknown>;

const dependencyFields = ["dependencies", "devDependencies", "peerDependencies"];
const minecraftPackageNames = [
    ...MINECRAFT_PACKAGES.modules,
    ...MINECRAFT_PACKAGES.plugins,
];

function readJsonFile(filePath: string): unknown {
    return JSON.parse(readFileSync(filePath, "utf-8"));
}

function writeJsonFile(filePath: string, value: unknown): void {
    writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf-8");
}

function getDependencies(packageJson: PackageJson, dependencyField: string): Record<string, string> | undefined {
    const dependencies = packageJson[dependencyField];
    if (!isStringRecord(dependencies)) {
        return undefined;
    }

    return dependencies;
}

async function updatePackageJson(packageJson: PackageJson, releaseChannel: ReleaseChannel): Promise<number> {
    let updatedPackages = 0;

    for (const packageName of minecraftPackageNames) {
        for (const dependencyField of dependencyFields) {
            const dependencies = getDependencies(packageJson, dependencyField);

            if (!dependencies?.[packageName]) {
                continue;
            }

            try {
                const latestDependency = await getDependency(packageName, releaseChannel);
                const currentVersion = dependencies[packageName];

                if (currentVersion !== latestDependency.fullVersion) {
                    dependencies[packageName] = latestDependency.fullVersion;
                    logger.change(packageName, currentVersion, latestDependency.fullVersion);
                    updatedPackages++;
                } else {
                    logger.current(packageName, currentVersion);
                }
            } catch (error) {
                logger.error(`Failed to update ${packageName}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }

    return updatedPackages;
}

async function updateManifest(manifestJson: APIBehaviorManifest, releaseChannel: ReleaseChannel): Promise<number> {
    let updatedManifestEntries = 0;

    for (const packageName of minecraftPackageNames) {
        const manifestDependency = manifestJson.dependencies.find(
            (dependency) => "module_name" in dependency && dependency.module_name === packageName
        );

        if (!manifestDependency) {
            continue;
        }

        try {
            const latestDependency = await getDependency(packageName, releaseChannel);
            const currentVersion = "version" in manifestDependency ? manifestDependency.version : undefined;

            if (currentVersion !== latestDependency.version) {
                manifestJson.dependencies = manifestJson.dependencies.map((dependency) => {
                    if ("module_name" in dependency && dependency.module_name === packageName) {
                        return { ...dependency, version: latestDependency.version };
                    }
                    return dependency;
                });
                updatedManifestEntries++;
            }
        } catch (error) {
            logger.error(`Failed to update manifest for ${packageName}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    return updatedManifestEntries;
}

export async function updateProjectDependencies(releaseChannel: ReleaseChannel): Promise<void> {
    logger.step(`Updating dependencies to ${releaseChannel}...`);

    const packageJsonPath = join(process.cwd(), "package.json");
    const manifestJsonPath = join(getProjectPaths().behaviorPackRoot, "manifest.json");

    if (!existsSync(packageJsonPath)) {
        throw new Error("package.json not found in current directory");
    }

    if (!existsSync(manifestJsonPath)) {
        throw new Error("manifest.json not found in current directory");
    }

    const packageJson = readJsonFile(packageJsonPath);
    const manifestJson = readJsonFile(manifestJsonPath);

    if (!isPackageJson(packageJson)) {
        throw new Error("package.json is not a valid package object");
    }

    if (!isApiBehaviorManifest(manifestJson)) {
        throw new Error("manifest.json is not a valid behavior manifest");
    }

    const updatedPackages = await updatePackageJson(packageJson, releaseChannel);
    const updatedManifestEntries = await updateManifest(manifestJson, releaseChannel);

    if (updatedPackages > 0 || updatedManifestEntries > 0) {
        writeJsonFile(packageJsonPath, packageJson);
        writeJsonFile(manifestJsonPath, manifestJson);
        logger.done(`Updated ${updatedPackages} package entr${updatedPackages === 1 ? "y" : "ies"} and ${updatedManifestEntries} manifest entr${updatedManifestEntries === 1 ? "y" : "ies"}`);
        logger.info("Run bun install to install the new versions");
        return;
    }

    logger.done("All dependencies are up to date");
}

function isPackageJson(value: unknown): value is PackageJson {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringRecord(value: unknown): value is Record<string, string> {
    return typeof value === "object"
        && value !== null
        && !Array.isArray(value)
        && Object.values(value).every((entry) => typeof entry === "string");
}

function isApiBehaviorManifest(value: unknown): value is APIBehaviorManifest {
    return typeof value === "object"
        && value !== null
        && "dependencies" in value
        && Array.isArray(value.dependencies);
}
