#!/usr/bin/env node

import { logger } from "@mcbepack/common";

import { createProject, ProjectCreationCancelledError } from "./handler/create-project.js";

async function main(): Promise<void> {
    try {
        await createProject();
    } catch (error) {
        if (error instanceof ProjectCreationCancelledError) {
            process.exit(0);
        }

        logger.error(`Error occurred: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}

main();
