import fs from "node:fs";
import path from "node:path";

import { constants } from "@mcbepack/common";
import { build, type BuildOptions, type BuildResult, context, formatMessages, type Message } from "esbuild";

type BuildMode = "development" | "production";

function getScriptEntry(): string {
    const tsEntry = path.join(process.cwd(), "scripts", "index.ts");
    const jsEntry = path.join(process.cwd(), "scripts", "index.js");

    if (fs.existsSync(tsEntry)) {
        return tsEntry;
    }

    if (fs.existsSync(jsEntry)) {
        return jsEntry;
    }

    throw new Error("This project does not use script api.");
}

function createBuildOptions(mode: BuildMode = "development"): BuildOptions {
    return {
        entryPoints: [getScriptEntry()],
        bundle: true,
        format: "esm",
        platform: "neutral",
        mainFields: ["module", "main"],
        target: "es2020",
        outfile: path.resolve(process.cwd(), "src", "behavior_pack", "scripts", "index.js"),
        external: constants.packages.modules,
        sourcemap: false,
        minify: mode === "production",
        logLevel: "silent"
    };
}

export async function formatBuildMessages(messages: Message[], kind: "error" | "warning"): Promise<string> {
    return (await formatMessages(messages, { kind, color: true })).join("");
}

export function buildScripts(mode?: BuildMode): Promise<BuildResult> {
    return build(createBuildOptions(mode));
}

export function createBuildContext(
    mode?: BuildMode,
    onEnd?: (result: BuildResult) => void | Promise<void>,
    onStart?: () => void | Promise<void>
) {
    return context({
        ...createBuildOptions(mode),
        plugins: onEnd || onStart
            ? [
                {
                    name: "mcbepack-watch",
                    setup(build) {
                        if (onStart) {
                            build.onStart(onStart);
                        }

                        if (onEnd) {
                            build.onEnd(onEnd);
                        }
                    }
                }
            ]
            : undefined
    });
}
