#!/usr/bin/env node

import { logger } from "@mcbepack/common";

import { createProject, ProjectCreationCancelledError } from "./services/create-project.js";

try {
    await createProject();
} catch (error) {
    if (error instanceof ProjectCreationCancelledError) {
        process.exit(0);
    }

    logger.error(`Error occurred: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
}