import fs from "node:fs";
import path from "node:path";

import { MINECRAFT_PACKAGES } from "@mcbepack/common";
import { build, type BuildContext, type BuildOptions, type BuildResult, context, formatMessages, type Message } from "esbuild";

function getScriptEntry(): string {
    const tsEntry = path.join(process.cwd(), "scripts", "index.ts");
    const jsEntry = path.join(process.cwd(), "scripts", "index.js");

    if (fs.existsSync(tsEntry)) {
        return tsEntry;
    }

    if (fs.existsSync(jsEntry)) {
        return jsEntry;
    }

    throw new Error("This project does not use Script API.");
}

function createBuildOptions(): BuildOptions {
    return {
        entryPoints: [getScriptEntry()],
        bundle: true,
        format: "esm",
        platform: "neutral",
        mainFields: ["module", "main"],
        target: "es2020",
        outfile: path.resolve(process.cwd(), "src", "behavior_pack", "scripts", "index.js"),
        external: [...MINECRAFT_PACKAGES.modules],
        sourcemap: false,
        minify: true,
        logLevel: "silent"
    };
}

export async function formatBundleMessages(messages: Message[], kind: "error" | "warning"): Promise<string> {
    return (await formatMessages(messages, { kind, color: true })).join("");
}

export function bundleScripts(): Promise<BuildResult> {
    return build(createBuildOptions());
}

export function createBundleWatcher(
    onEnd?: (result: BuildResult) => void | Promise<void>,
    onStart?: () => void | Promise<void>
): Promise<BuildContext> {
    const buildOptions = createBuildOptions();

    if (onEnd || onStart) {
        buildOptions.plugins = [
            {
                name: "mcbepack-watch",
                setup(build): void {
                    if (onStart) {
                        build.onStart(onStart);
                    }

                    if (onEnd) {
                        build.onEnd(onEnd);
                    }
                }
            }
        ];
    }

    return context(buildOptions);
}
