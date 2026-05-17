import { execFileSync } from "node:child_process";

import { detect } from "package-manager-detector/detect";

import { packageManagerSchema } from "../schema/package-manager.js";
import { PackageManagerName } from "./enums.js";
import type { PackageManager } from "./types.js";

const fallbackPackageManager: PackageManager = { name: PackageManagerName.Bun };

export async function detectPackageManager(): Promise<PackageManager> {
    const detected = await detect();
    return packageManagerSchema.parse(detected ? { name: detected.name as PackageManagerName } : fallbackPackageManager);
}

export function installDependencies(projectRoot: string, packageManager: PackageManager): void {
    execFileSync(packageManager.name, ["install"], {
        cwd: projectRoot,
        stdio: "inherit"
    });
}
