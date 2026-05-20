import { randomUUID } from "node:crypto";

import { getDependency, logger } from "@mcbepack/common";

import { Extension, ScriptLanguage } from "../config/enum.js";
import type { ProjectConfig } from "../config/schema.js";
import { projectConfigSchema } from "../config/schema.js";
import { promptExtensions, promptProjectInfo, promptScriptApi, promptScriptConfig } from "./prompts.js";

export async function collectProjectInfo(): Promise<ProjectConfig> {
    const { extensions } = await promptExtensions();

    const { name, description, author, minimumEngineVersion } = await promptProjectInfo();

    const uuids = {
        behavior: randomUUID(),
        resource: randomUUID(),
        scriptModule: randomUUID(),
        resourceModule: randomUUID(),
    };

    const config: ProjectConfig = {
        name,
        description,
        author,
        minimumEngineVersion,
        extensions,
        uuids,
    };

    if (extensions.includes(Extension.BEHAVIOR)) {
        const { api } = await promptScriptApi();

        if (api) {
            const { language, release, packages } = await promptScriptConfig();

            logger.step("Fetching dependencies...");
            const dependencies = await Promise.all(
                packages.map((packageName) => getDependency(packageName, release))
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
                language: ScriptLanguage.JAVASCRIPT,
                release: "",
                packages: [],
                dependencies: [],
            };
        }
    }

    return projectConfigSchema.parse(config);
}
