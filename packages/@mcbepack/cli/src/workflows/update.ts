import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import * as constants from "@mcbepack/common/constants";
import { logger } from "@mcbepack/common/logger";
import type { APIBehaviorManifest } from "@mcbepack/common/types";
import { getDependency } from "@mcbepack/common/utils";

import type { ReleaseChannel } from "../domain.js";
import { getProjectPaths } from "../lib/project-paths.js";

type PackageJson = Record<string, Record<string, string> | unknown>;

const dependencyFields = ["dependencies", "devDependencies", "peerDependencies"];
const minecraftPackageNames = [
    ...constants.packages.modules,
    ...constants.packages.plugins,
];

function readJsonFile<T>(filePath: string): T {
    return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

function writeJsonFile(filePath: string, value: unknown): void {
    writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf-8");
}

function getDependencies(packageJson: PackageJson, dependencyField: string): Record<string, string> | undefined {
    const dependencies = packageJson[dependencyField];
    return dependencies && typeof dependencies === "object" && !Array.isArray(dependencies)
        ? dependencies as Record<string, string>
        : undefined;
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

    try {
        const packageJsonPath = join(process.cwd(), "package.json");
        const manifestJsonPath = join(getProjectPaths().behaviorPackRoot, "manifest.json");

        if (!existsSync(packageJsonPath)) {
            logger.error("package.json not found in current directory");
            process.exit(1);
        }

        if (!existsSync(manifestJsonPath)) {
            logger.error("manifest.json not found in current directory");
            process.exit(1);
        }

        const packageJson = readJsonFile<PackageJson>(packageJsonPath);
        const manifestJson = readJsonFile<APIBehaviorManifest>(manifestJsonPath);
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
    } catch (error) {
        logger.error(`Error updating dependencies: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}
