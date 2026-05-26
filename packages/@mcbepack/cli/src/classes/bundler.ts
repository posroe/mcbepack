import fs from "node:fs";
import path from "node:path";

import {
    build,
    type BuildContext,
    type BuildOptions,
    type BuildResult,
    context,
    formatMessages,
    type Message
} from "esbuild";

import { MINECRAFT_PACKAGES } from "@mcbepack/common";

import { DIRECTORIES } from "../config/constant.js";

export class Bundler {
    private readonly buildOptions: BuildOptions = {
        entryPoints: [Bundler.getScriptEntry()],
        bundle: true,
        format: "esm",
        platform: "neutral",
        mainFields: ["module", "main"],
        target: "esnext",
        outfile: path.resolve(DIRECTORIES.scripts.destination, "index.js"),
        external: [...MINECRAFT_PACKAGES.modules],
        sourcemap: false,
        logLevel: "silent"
    };

    private static getScriptEntry(): string {
        const tsEntry = path.join(DIRECTORIES.scripts.origin, "index.ts");
        const jsEntry = path.join(DIRECTORIES.scripts.origin, "index.js");

        if (fs.existsSync(tsEntry)) {
            return tsEntry;
        }

        if (fs.existsSync(jsEntry)) {
            return jsEntry;
        }

        throw new Error("This project does not use Script API.");
    }

    public static async formatMessages(messages: Message[], kind: "error" | "warning"): Promise<string> {
        return (await formatMessages(messages, { kind, color: true })).join("");
    }

    public async build(): Promise<BuildResult> {
        return build({ ...this.buildOptions, minify: true });
    }

    public async watcher(
        onEnd?: (result: BuildResult) => void | Promise<void>,
        onStart?: () => void | Promise<void>
    ): Promise<BuildContext> {
        const buildOptions: BuildOptions = { ...this.buildOptions };

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
}