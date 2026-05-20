#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import path from "node:path";

import { logger } from "@mcbepack/common";

import { DIRECTORIES } from "./config/constant.js";
import { Extension, ScriptLanguage } from "./config/enum.js";
import { buildBehaviorManifest, buildResourceManifest } from "./generator/manifest.js";
import { buildPackageJson } from "./generator/package.js";
import { buildReadme } from "./generator/readme.js";
import { confirmPrompt, createContext } from "./prompts.js";
import { FileGenerator } from "./utils.js";

try {
    const context = await createContext();

    const confirmed = await confirmPrompt(`Create project "${context.name}"?`);
    if (!confirmed) {
        logger.warn("Cancelled.");
        process.exit(0);
    }

    const projectRoot = path.join(process.cwd(), context.name);

    const generator = new FileGenerator(projectRoot);

    generator.create(path.join(projectRoot, "README.md"), buildReadme(context))
    generator.create(path.join(projectRoot, "package.json"), buildPackageJson(context))

    if (context.extensions.includes(Extension.Behavior)) {
        generator.create(path.join(projectRoot, "manifest.json"), buildBehaviorManifest(context))
        generator.copy(path.join(projectRoot, "pack_icon.png"), path.join(DIRECTORIES.template, "pack_icon.png"))
    }

    if (context.extensions.includes(Extension.Resource)) {
        generator.create(path.join(projectRoot, "manifest.json"), buildResourceManifest(context))
        generator.copy(path.join(projectRoot, "pack_icon.png"), path.join(DIRECTORIES.template, "pack_icon.png"))
    }

    if (context.script?.enabled) {
        const lang = context.script.language;

        generator.create(path.join(projectRoot, "scripts", lang === ScriptLanguage.TypeScript ? "index.ts" : "index.js"), "export {};\n")
        generator.copy(path.join(projectRoot, ".env.local"), path.join(DIRECTORIES.template, ".env.local.txt"))
        generator.copy(path.join(projectRoot, ".gitignore"), path.join(DIRECTORIES.template, ".gitignore.txt"))

        if (lang === ScriptLanguage.TypeScript) {
            generator.copy(path.join(projectRoot, "tsconfig.json"), path.join(DIRECTORIES.template, "tsconfig.json"))
        }
    }

    logger.step("Creating project files...");
    generator.generate();
    logger.done("Files created successfully.");

    logger.step("Installing dependencies...");
    execFileSync(context.packageManager, ["install"], { cwd: projectRoot, stdio: "inherit" });
    logger.done("Dependencies installed successfully.");

    logger.section(`Created "${context.name}".`);
    logger.field("Path: ", projectRoot);
    logger.section("Next steps");
    logger.item(`cd ${context.name}`);
    if (context.script?.enabled) logger.item(`${context.packageManager} run dev`);

} catch (err) {
    logger.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
}