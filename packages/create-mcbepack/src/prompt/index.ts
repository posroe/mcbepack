import * as constants from "@mcbepack/common/constants";
import enquirer from "enquirer";

import { ExtensionType, ReleaseChannel, ScriptLanguage } from "../lib/enums.js";
import type { MinecraftPackageName } from "../lib/types.js";
import { projectConfigSchema } from "../schema/project.js";

export async function promptExtensions() {
    return enquirer.prompt<{ extensions: ExtensionType[] }>({
        type: "multiselect",
        name: "extensions",
        message: "Select an extension type",
        choices: [
            { name: ExtensionType.Behavior, message: "Behavior Pack" },
            { name: ExtensionType.Resource, message: "Resource Pack" },
        ],
        validate: (input) => input.length > 0 || "At least one extension type is required"
    });
}

export async function promptScriptApi() {
    return enquirer.prompt<{ api: boolean }>({
        type: "confirm",
        name: "api",
        message: "Do you want to add Script API to the behavior pack?",
        initial: true
    });
}

export async function promptProjectInfo() {
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
            message: "What is the author's name? Use commas to separate multiple authors.",
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

export async function promptScriptConfig() {
    return enquirer.prompt<{
        language: ScriptLanguage;
        release: ReleaseChannel;
        packages: MinecraftPackageName[];
    }>([
        {
            type: "select",
            name: "language",
            message: "Which language do you want to use?",
            choices: [ScriptLanguage.TypeScript, ScriptLanguage.JavaScript]
        },
        {
            type: "select",
            name: "release",
            message: "What release channel would you like to use?",
            choices: [ReleaseChannel.Stable, ReleaseChannel.Beta, ReleaseChannel.Preview],
        },
        {
            type: "multiselect",
            name: "packages",
            message: "Which packages would you like to add?",
            choices: [
                ...constants.packages.modules,
                ...constants.packages.plugins
            ],
            validate: (input) => input.length > 0 || "At least one package is required"
        }
    ]);
}

export async function promptConfirm(options: { message: string; default?: boolean }) {
    return enquirer.prompt<{ confirmed: boolean }>({
        type: "confirm",
        name: "confirmed",
        message: options.message,
        initial: options.default ?? true
    });
}
