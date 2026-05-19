import { detect } from "package-manager-detector/detect";

import { PackageManagerName } from "../constants/enums.js";
import type { PackageManager } from "../schema/manager.js";
import { managerSchema } from "../schema/manager.js";

const fallbackPackageManager: PackageManager = { name: PackageManagerName.Bun };

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
