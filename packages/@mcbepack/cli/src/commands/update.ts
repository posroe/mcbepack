import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { APIBehaviorManifest, constants, getDependency } from "@mcbepack/common";
import pc from "picocolors";
import { CommandModule } from "yargs";

import { getProjectPaths } from "../utils/paths.js";

interface UpdateArgs {
    type?: "stable" | "beta" | "preview"
}

export const updateCommand: CommandModule<object, UpdateArgs> = {
    command: "update [type]",
    describe: "Update the project dependencies",
    builder: (yargs) => yargs
        .positional("type", {
            type: "string",
            description: "Optional update type",
            choices: ["stable", "beta", "preview"] as const,
            default: "stable" as const
        }),
    handler: async (argv) => {
        const { type = "stable" } = argv;

        console.log(pc.cyan(`Updating dependencies to ${pc.bold(type)} version...\n`));

        try {
            const packageJsonPath = join(process.cwd(), "package.json");
            const manifestJsonPath = join(getProjectPaths().behaviorRootPath, "manifest.json");

            if (!existsSync(packageJsonPath)) {
                console.error(pc.red("package.json not found in current directory"));
                process.exit(1);
            }

            if (!existsSync(manifestJsonPath)) {
                console.error(pc.red("manifest.json not found in current directory"));
                process.exit(1);
            }

            const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
            const manifestJson = JSON.parse(readFileSync(manifestJsonPath, "utf-8")) as APIBehaviorManifest;

            const dependencyTypes = ["dependencies", "devDependencies", "peerDependencies"];
            const minecraftPackages = [
                ...constants.packages.modules,
                ...constants.packages.plugins,
            ];

            let updated = false;
            let updatedCount = 0;
            let manifestUpdatedCount = 0;

            for (const packageName of minecraftPackages) {
                for (const dependencyType of dependencyTypes) {
                    if (!packageJson[dependencyType]) {
                        continue;
                    }

                    if (packageJson[dependencyType][packageName]) {
                        try {
                            const dependency = await getDependency(packageName, type);
                            const currentVersion = packageJson[dependencyType][packageName];

                            if (currentVersion !== dependency.fullVersion) {
                                packageJson[dependencyType][packageName] = dependency.fullVersion;
                                console.log(pc.green(`  [updated] ${pc.bold(packageName)}`));
                                console.log(pc.dim(`    ${currentVersion} -> ${pc.white(dependency.fullVersion)}`));
                                updated = true;
                                updatedCount++;
                            } else {
                                console.log(`  [current] ${pc.bold(packageName)}`);
                                console.log(pc.dim(`    Is already up to date (${currentVersion})`));
                            }
                        } catch (error) {
                            console.error(pc.red(`  Failed to update ${packageName}: ${error instanceof Error ? error.message : String(error)}`));
                        }
                    }
                }

                const manifestDep = manifestJson.dependencies.find(
                    (dep) => "module_name" in dep && dep.module_name === packageName
                );

                if (manifestDep) {
                    try {
                        const dependency = await getDependency(packageName, type);
                        const currentVersion = "version" in manifestDep ? manifestDep.version : undefined;

                        if (currentVersion !== dependency.version) {
                            manifestJson.dependencies = manifestJson.dependencies.map((dep) => {
                                if ("module_name" in dep && dep.module_name === packageName) {
                                    return { ...dep, version: dependency.version };
                                }
                                return dep;
                            });
                            updated = true;
                            manifestUpdatedCount++;
                        }
                    } catch (error) {
                        console.error(pc.red(`  Failed to update manifest for ${packageName}: ${error instanceof Error ? error.message : String(error)}`));
                    }
                }
            }

            if (updated) {
                writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf-8");
                writeFileSync(manifestJsonPath, JSON.stringify(manifestJson, null, 2) + "\n", "utf-8");
                console.log(pc.green(`\nUpdated ${updatedCount} package entr${updatedCount === 1 ? "y" : "ies"} and ${manifestUpdatedCount} manifest entr${manifestUpdatedCount === 1 ? "y" : "ies"} successfully!`));
                console.log(pc.dim(`Run ${pc.bold("bun install")} to install the new versions`));
            } else {
                console.log(pc.green("\nAll dependencies are up to date!"));
            }
        } catch (error) {
            console.error(pc.red(`\nError updating dependencies: ${error instanceof Error ? error.message : String(error)}`));
            process.exit(1);
        }
    }
};
