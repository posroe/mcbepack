import fs from "node:fs";
import path from "node:path";

import type { CommandModule } from "yargs";

import { logger } from "@mcbepack/common";

import { DIRECTORIES, NAMES } from "../config/constant.js";
import { Release } from "../config/enum.js";
import { updateManifest } from "../services/manifest-updates.js";
import { updatePackage } from "../services/package-updates.js";
import { isApiBehaviorManifest, isJson, readJsonFile, writeJsonFile } from "../services/utils.js";

export const updateCommand: CommandModule<object, {
    release: Release;
}> = {
    command: "update <release>",
    describe: "Update the project dependencies",
    builder: (yargs) => yargs
        .positional("release", {
            type: "string",
            description: "Release channel",
            choices: Object.values(Release),
            demandOption: true
        }),
    handler: async ({ release }) => {
        try {
            logger.step(`Updating dependencies to ${release}...`);

            const packageJsonPath = path.join(process.cwd(), NAMES.package);
            const manifestJsonPath = path.join(DIRECTORIES.behavior.origin, NAMES.manifest);
            if (!fs.existsSync(manifestJsonPath)) {
                throw new Error("manifest.json not found in current directory");
            }

            const packageJson = readJsonFile(packageJsonPath);
            const manifestJson = readJsonFile(manifestJsonPath);

            if (!isJson(packageJson)) {
                throw new Error("package.json is not a valid package object");
            }

            if (!isApiBehaviorManifest(manifestJson)) {
                throw new Error("manifest.json is not a valid behavior manifest");
            }

            const packageUpdates = await updatePackage(packageJson, release);
            const manifestUpdates = await updateManifest(manifestJson, release);

            if (manifestUpdates > 0) {
                writeJsonFile(manifestJsonPath, manifestJson);
            }

            if (packageUpdates > 0 || manifestUpdates > 0) {
                const packagesPlural = packageUpdates === 1 ? "entry" : "entries";
                const manifestsPlural = manifestUpdates === 1 ? "entry" : "entries";
                logger.done(`Updated ${packageUpdates} package ${packagesPlural} and ${manifestUpdates} manifest ${manifestsPlural}`);
                return;
            }

            logger.done("All dependencies are up to date");
        } catch (error) {
            logger.error(`Error updating dependencies: ${error instanceof Error ? error.message : String(error)}`);
            process.exit(1);
        }
    }
};
