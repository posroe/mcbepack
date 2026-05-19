import { type APIBehaviorManifest,getDependency, logger, MINECRAFT_PACKAGES } from "@mcbepack/common";

import { Release } from "../enum.js";

export async function updateManifest(manifestJson: APIBehaviorManifest, release: Release): Promise<number> {
    let updates = 0;

    const minecraftPackageNames = [
        ...MINECRAFT_PACKAGES.modules,
        ...MINECRAFT_PACKAGES.plugins,
    ]

    for (const packageName of minecraftPackageNames) {
        const manifestDependency = manifestJson.dependencies.find(
            (dependency) => "module_name" in dependency && dependency.module_name === packageName
        );

        if (!manifestDependency) {
            continue;
        }

        try {
            const latestDependency = await getDependency(packageName, release);
            const currentVersion = "version" in manifestDependency ? manifestDependency.version : undefined;

            if (currentVersion !== latestDependency.version) {
                manifestJson.dependencies = manifestJson.dependencies.map((dependency) => {
                    if ("module_name" in dependency && dependency.module_name === packageName) {
                        return { ...dependency, version: latestDependency.version };
                    }
                    return dependency;
                });
                updates++;
            }
        } catch (error) {
            logger.error(`Failed to update manifest for ${packageName}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    return updates;
}
