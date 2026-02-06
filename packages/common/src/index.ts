export * from "./utils.js";
export * from "./types.js";
export * as constants from "./constants.js";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production" | "test";
            BASE_PATH: string;
            RESOURCE_PATH: string;
            BEHAVIOR_PATH: string;
        }
    }
}