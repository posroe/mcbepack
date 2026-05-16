import { randomUUID } from "node:crypto";

import { logger } from "@mcbepack/common/logger";
import { getDependency } from "@mcbepack/common/utils";

import prompt from "../prompt.js";
import { ProjectConfig } from "../types.js";

export async function collectProjectInfo(): Promise<ProjectConfig> {
    logger.section("Please provide project information");

    const { extensions } = await prompt.extension();

    const { name, description, author, minimumEngineVersion } = await prompt.info();

    const uuids = {
        behavior: randomUUID(),
        resource: randomUUID(),
        scriptModule: randomUUID(),
    };

    const config: ProjectConfig = {
        name,
        description,
        author,
        minimumEngineVersion,
        extensions,
        uuids,
    };

    if (extensions.includes("behavior")) {
        const { api } = await prompt.api();

        if (api) {
            const { language, release, packages } = await prompt.script();

            logger.step("Fetching dependencies...");
            const dependencies = await Promise.all(
                packages.map(async (packageName) => {
                    const dep = await getDependency(packageName, release);
                    return {
                        packageName: dep.packageName,
                        version: dep.version,
                        fullVersion: dep.fullVersion,
                    };
                })
            );

            config.script = {
                enabled: true,
                language,
                release,
                packages,
                dependencies,
            };
        } else {
            config.script = {
                enabled: false,
                language: "javascript",
                release: "",
                packages: [],
                dependencies: [],
            };
        }
    }

    return config;
}
