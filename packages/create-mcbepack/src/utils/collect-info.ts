import { v4 as uuidv4 } from "uuid";
import pc from "picocolors";
import { getDependency } from "@mcbepack/common";
import prompt from "../prompt";
import { ProjectConfig } from "../types";

export async function collectProjectInfo(): Promise<ProjectConfig> {
    console.log(pc.bold("Please provide project information\n"));

    const { extensions } = await prompt.extension();

    const { name, description, author, minimumEngineVersion } = await prompt.info();

    const uuids = {
        behavior: uuidv4(),
        resource: uuidv4(),
        scriptModule: uuidv4(),
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

            console.log(pc.dim("\nFetching dependencies..."));
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
