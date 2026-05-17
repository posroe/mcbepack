#!/usr/bin/env node

import { logger } from "@mcbepack/common/logger";

import { createProject } from "./handler/create-project.js";

async function main() {
    try {
        await createProject();
    } catch (error) {
        logger.error(`Error occurred: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}

main();
