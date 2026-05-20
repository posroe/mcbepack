import { execFileSync } from "node:child_process";

import { detect } from "package-manager-detector/detect";

import { DEFAULT_PACKAGE_MANAGER } from "../config/constants.js";
import type { PackageManager } from "../config/schema.js";
import { managerSchema } from "../config/schema.js";

const fallbackPackageManager: PackageManager = DEFAULT_PACKAGE_MANAGER;

export interface InstallCommand {
    command: string;
    args: string[];
    cwd: string;
}

export async function detectPackageManager(): Promise<PackageManager> {
    const detected = await detect();
    if (!detected) {
        return fallbackPackageManager;
    }

    const parsed = managerSchema.safeParse({ name: detected.name });
    return parsed.success ? parsed.data : fallbackPackageManager;
}

export function createInstallCommand(projectRoot: string, packageManager: PackageManager): InstallCommand {
    return {
        command: packageManager.name,
        args: ["install"],
        cwd: projectRoot
    };
}

export function runInstallCommand(command: InstallCommand): void {
    execFileSync(command.command, command.args, {
        cwd: command.cwd,
        stdio: "inherit"
    });
}