import { randomUUID } from "node:crypto";

import enquirer from "enquirer";

import { getDependency, MINECRAFT_PACKAGES } from "@mcbepack/common";

import { Extension, PackageManager, Release, ScriptLanguage } from "./config/enum.js";
import { detectPackageManager } from "./utils.js";

export interface Context {
    name: string;
    description: string;
    author: string;
    minEngineVersion: string;
    extensions: Extension[];
    packageManager: PackageManager;
    uuids: {
        behavior: string;
        resource: string;
        scriptModule: string;
        resourceModule: string;
    };
    script?: {
        enabled: boolean;
        language: ScriptLanguage;
        release: Release;
        packages: string[];
        dependencies: Awaited<ReturnType<typeof getDependency>>[];
    };
}

export async function createContext(): Promise<Context> {
    const { extensions } = await enquirer.prompt<{ extensions: Extension[] }>({
        type: "multiselect",
        name: "extensions",
        message: "What types of development do you need?",
        choices: Object.values(Extension),
        validate: (v) => v.length > 0 || "At least one extension type is required",
    });

    const info = await enquirer.prompt<{
        name: string;
        description: string;
        author: string;
        minEngineVersion: string;
    }>([
        {
            type: "input",
            name: "name",
            message: "What is the name of your project?"
        },
        {
            type: "input",
            name: "description",
            message: "What is the description of your project?"
        },
        {
            type: "input",
            name: "author",
            message: "What is the author's name? Use commas to separate multiple authors.",
        },
        {
            type: "input",
            name: "minEngineVersion",
            message: "What is the minimum engine version required?",
            initial: "1.26.0",
            validate: (v) => /^\d+\.\d+\.\d+$/.test(v) || "Minimum engine version must be in the format x.x.x",
        }
    ]);

    const context: Context = {
        ...info,
        extensions,
        packageManager: await detectPackageManager(),
        uuids: {
            behavior: randomUUID(),
            resource: randomUUID(),
            scriptModule: randomUUID(),
            resourceModule: randomUUID(),
        },
    };

    if (extensions.includes(Extension.Behavior)) {
        const { useScript } = await enquirer.prompt<{ useScript: boolean }>({
            type: "confirm",
            name: "useScript",
            message: "Do you want to add Script API to the behavior pack?",
            initial: true,
        });

        if (useScript) {
            const scriptConfig = await enquirer.prompt<{
                language: ScriptLanguage;
                release: Release;
                packages: string[];
            }>([
                {
                    type: "select",
                    name: "language",
                    message: "Which language do you want to use?",
                    choices: Object.values(ScriptLanguage),
                },
                {
                    type: "select",
                    name: "release",
                    message: "What release channel would you like to use?",
                    choices: Object.values(Release),
                },
                {
                    type: "multiselect",
                    name: "packages",
                    message: "Which packages would you like to add?",
                    choices: [...MINECRAFT_PACKAGES.modules, ...MINECRAFT_PACKAGES.plugins],
                    validate: (v) => v.length > 0 || "At least one package is required",
                },
            ]);

            const dependencies = await Promise.all(
                scriptConfig.packages.map((pkg) => getDependency(pkg, scriptConfig.release))
            );

            context.script = { enabled: true, ...scriptConfig, dependencies };
        }
    }

    return context;
}

export async function confirmPrompt(message: string, initial = true): Promise<boolean> {
    const { ok } = await enquirer.prompt<{ ok: boolean }>({
        type: "confirm",
        name: "ok",
        message,
        initial,
    });
    return ok;
}
