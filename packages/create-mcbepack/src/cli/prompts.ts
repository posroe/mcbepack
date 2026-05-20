import enquirer from "enquirer";

import { MINECRAFT_PACKAGES } from "@mcbepack/common";

import { PACK_DEFINITIONS } from "../config/constants.js";
import { Extension, Release, ScriptLanguage } from "../config/enum.js";
import { projectConfigSchema } from "../config/schema.js";

export async function promptExtensions(): Promise<{ extensions: Extension[] }> {
    return enquirer.prompt<{ extensions: Extension[] }>({
        type: "multiselect",
        name: "extensions",
        message: "Select an extension type",
        choices: Object.values(PACK_DEFINITIONS).map((pack) => ({
            name: pack.extension,
            message: pack.displayName,
        })),
        validate: (input) => input.length > 0 || "At least one extension type is required"
    });
}

export async function promptScriptApi(): Promise<{ api: boolean }> {
    return enquirer.prompt<{ api: boolean }>({
        type: "confirm",
        name: "api",
        message: "Do you want to add Script API to the behavior pack?",
        initial: true
    });
}

export async function promptProjectInfo(): Promise<{
    name: string;
    description: string;
    author: string;
    minimumEngineVersion: string;
}> {
    return enquirer.prompt<{
        name: string;
        description: string;
        author: string;
        minimumEngineVersion: string;
    }>([
        {
            type: "input",
            name: "name",
            message: "What is the name of the project?",
        },
        {
            type: "input",
            name: "description",
            message: "What is the description of the project?",
        },
        {
            type: "input",
            name: "author",
            message: "What is the author's name? Use commas to separate multiple authors."
        },
        {
            type: "input",
            name: "minimumEngineVersion",
            message: "What is the minimum engine version required?",
            validate: (input) => {
                if (input.length === 0) return "Minimum engine version is required";
                return projectConfigSchema.shape.minimumEngineVersion.safeParse(input).success
                    || "Minimum engine version must be in the format x.x.x";
            }
        }
    ]);
}

export async function promptScriptConfig(): Promise<{
    language: ScriptLanguage;
    release: Release;
    packages: string[];
}> {
    return enquirer.prompt<{
        language: ScriptLanguage;
        release: Release;
        packages: string[];
    }>([
        {
            type: "select",
            name: "language",
            message: "Which language do you want to use?",
            choices: [ScriptLanguage.TYPESCRIPT, ScriptLanguage.JAVASCRIPT]
        },
        {
            type: "select",
            name: "release",
            message: "What release channel would you like to use?",
            choices: [Release.STABLE, Release.BETA, Release.PREVIEW],
        },
        {
            type: "multiselect",
            name: "packages",
            message: "Which packages would you like to add?",
            choices: [
                ...MINECRAFT_PACKAGES.modules,
                ...MINECRAFT_PACKAGES.plugins
            ],
            validate: (input) => input.length > 0 || "At least one package is required"
        }
    ]);
}

export async function promptConfirm(options: { message: string; default?: boolean }): Promise<{ confirmed: boolean }> {
    return enquirer.prompt<{ confirmed: boolean }>({
        type: "confirm",
        name: "confirmed",
        message: options.message,
        initial: options.default ?? true
    });
}
