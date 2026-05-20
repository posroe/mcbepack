import { color, logger } from "@mcbepack/common";

import { getEnabledCliScripts } from "../config/constants.js";
import type { GenerationContext } from "../config/context.js";

export function printCreatedProjectSummary(context: GenerationContext): void {
    logger.done(`Created project ${context.config.name}`);
    logger.field("Path", color.dim(context.projectRoot));

    logger.section("Next steps");
    logger.item(`${color.cyan("1.")} cd ${context.config.name}`);
    logger.item(`${color.cyan("2.")} ${getSecondStep(context)}`);

    logger.section("Available commands");
    printAvailableCommands(context);
}

function getSecondStep(context: GenerationContext): string {
    return context.config.script?.enabled
        ? `${context.packageManager.name} run dev`
        : "Start developing your project";
}

function printAvailableCommands(context: GenerationContext): void {
    const run = `${context.packageManager.name} run`;

    for (const script of getEnabledCliScripts(context)) {
        logger.info(`${run} ${script.name.padEnd(14)} - ${script.description}`);
    }
}
