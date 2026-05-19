import { execFileSync } from "node:child_process";

import { resolveCommand } from "package-manager-detector/commands";
import { detect } from "package-manager-detector/detect";

import { getDependency, logger, MINECRAFT_PACKAGES } from "@mcbepack/common";

import { DependencyScope, Release } from "../enum.js";
import { isStringRecord } from "./utils.js";

type PackageJson = Record<string, Record<string, string> | unknown>;

function getDependencies(
    packageJson: PackageJson,
    dependencyScope: DependencyScope
): Record<string, string> | undefined {
    const dependencies = packageJson[dependencyScope];
    if (!isStringRecord(dependencies)) {
        return undefined;
    }

    return dependencies;
}

async function installPackage(updates: string[]): Promise<void> {
    try {
        const packageManager = await detect();
        if (!packageManager) {
            throw new Error("Could not detect package manager");
        }

        const command = resolveCommand(packageManager.agent, "add", updates);
        if (!command) {
            throw new Error(`Could not resolve add command for ${packageManager.agent}`);
        }

        logger.step(`Running ${command.command} ${command.args.join(" ")}`);
        execFileSync(command.command, command.args, {
            cwd: process.cwd(),
            stdio: "inherit"
        });
    } catch (error) {
        logger.error(`Failed to update package manager dependencies: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function updatePackage(packageJson: PackageJson, release: Release) {

    const updates: string[] = [];

    const minecraftPackageNames = [
        ...MINECRAFT_PACKAGES.modules,
        ...MINECRAFT_PACKAGES.plugins,
    ];

    for (const packageName of minecraftPackageNames) {
        for (const dependencyScope of Object.values(DependencyScope)) {
            try {
                const dependencies = getDependencies(packageJson, dependencyScope);

                if (!dependencies?.[packageName]) {
                    continue;
                }

                const latestDependency = await getDependency(packageName, release);
                const currentVersion = dependencies[packageName];

                if (currentVersion !== latestDependency.fullVersion) {
                    logger.change(packageName, currentVersion, latestDependency.fullVersion);
                    updates.push(`${packageName}@${latestDependency.fullVersion}`);
                } else {
                    logger.current(packageName, currentVersion);
                }
            } catch (error) {
                logger.error(`Failed to update ${packageName}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }

    if (updates.length > 0) {
        await installPackage(updates);
    }

    return updates.length;
}