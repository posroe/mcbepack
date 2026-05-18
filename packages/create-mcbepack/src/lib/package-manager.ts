import { detect } from "package-manager-detector/detect";

import type { PackageManager } from "../schema/package-manager.js";
import { packageManagerSchema } from "../schema/package-manager.js";
import { PackageManagerName } from "./enums.js";

const fallbackPackageManager: PackageManager = { name: PackageManagerName.Bun };

export interface InstallCommand {
    command: string;
    args: string[];
    cwd: string;
}

export async function detectPackageManager(): Promise<PackageManager> {
    const detected = await detect();
    return packageManagerSchema.parse(detected ? { name: detected.name as PackageManagerName } : fallbackPackageManager);
}

export function createInstallCommand(projectRoot: string, packageManager: PackageManager): InstallCommand {
    return {
        command: packageManager.name,
        args: ["install"],
        cwd: projectRoot
    };
}
