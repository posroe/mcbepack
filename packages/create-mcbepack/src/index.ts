#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import path from "node:path";

import chalk from "chalk";

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
    const projectRoot = path.join(process.cwd(), context.name);

    const confirmed = await confirmPrompt(`Do you want to continue with the following configuration?`);
    if (!confirmed) {
        logger.warn("Project creation cancelled.");
        process.exit(0);
    }

    const generator = new FileGenerator(projectRoot);

    generator.create(
        path.join(projectRoot, "README.md"),
        buildReadme(context)
    );
    generator.create(
        path.join(projectRoot, "package.json"),
        buildPackageJson(context)
    );

    if (context.extensions.includes(Extension.Behavior)) {
        generator.create(
            path.join(projectRoot, DIRECTORIES.behavior, "manifest.json"),
            buildBehaviorManifest(context)
        );
        generator.copy(
            path.join(projectRoot, DIRECTORIES.behavior, "pack_icon.png"),
            path.join(DIRECTORIES.template, "pack_icon.png")
        );
    }

    if (context.extensions.includes(Extension.Resource)) {
        generator.create(
            path.join(projectRoot, DIRECTORIES.resource, "manifest.json"),
            buildResourceManifest(context)
        );
        generator.copy(
            path.join(projectRoot, DIRECTORIES.resource, "pack_icon.png"),
            path.join(DIRECTORIES.template, "pack_icon.png")
        );
    }

    if (context.script?.enabled) {
        const lang = context.script.language;

        generator.create(
            path.join(projectRoot, "scripts", lang === ScriptLanguage.TypeScript ? "index.ts" : "index.js"),
            "export {};\n"
        );
        generator.copy(
            path.join(projectRoot, ".env.local"),
            path.join(DIRECTORIES.template, ".env.local.txt")
        );
        generator.copy(
            path.join(projectRoot, ".gitignore"),
            path.join(DIRECTORIES.template, ".gitignore.txt")
        );

        if (lang === ScriptLanguage.TypeScript) {
            generator.copy(
                path.join(projectRoot, "tsconfig.json"),
                path.join(DIRECTORIES.template, "tsconfig.json")
            );
        }
    }

    generator.generate();

    execFileSync(context.packageManager, ["install"], { cwd: projectRoot, stdio: "inherit" });

    logger.done(`Created project ${context.name}`);
    logger.field("Path", chalk.dim(projectRoot));

    logger.section("Next steps");
    logger.item(`${chalk.cyan("1.")} cd ${context.name}`);

    if (context.script?.enabled) {
        logger.item(`${chalk.cyan("2.")} ${context.packageManager} dev`);
    } else {
        logger.item(`${chalk.cyan("2.")} Start developing your project`);
    }

    logger.section("Available commands");

    if (context.script?.enabled) {
        logger.info(`${context.packageManager} run dev             - Start development server`);
        logger.info(`${context.packageManager} run build           - Build project files`);
    }

    logger.info(`${context.packageManager} run export:zip      - Export a .zip archive`);
    logger.info(`${context.packageManager} run export:mcpack   - Export .mcpack archive(s)`);
    logger.info(`${context.packageManager} run export:mcaddon  - Export a .mcaddon archive`);

    if (context.script?.enabled) {
        logger.info(`${context.packageManager} run update:stable   - Update Script API (stable) packages`);
        logger.info(`${context.packageManager} run update:beta     - Update Script API (beta) packages`);
        logger.info(`${context.packageManager} run update:preview  - Update Script API (preview) packages`);
    }
} catch (err) {
    logger.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
}
