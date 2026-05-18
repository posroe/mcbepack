import path from "node:path";

export interface ProjectPaths {
    behaviorPackRoot: string;
    resourcePackRoot: string;
    outputDir: string;
    scriptsDir: string;
    projectName: string;
}

export interface MinecraftLinkPaths {
    behaviorPackLinkDir: string;
    resourcePackLinkDir: string;
}

interface MinecraftEnv {
    BASE_PATH: string;
    BEHAVIOR_PATH: string;
    RESOURCE_PATH: string;
}

function isMinecraftEnv(env: NodeJS.ProcessEnv): env is NodeJS.ProcessEnv & MinecraftEnv {
    return typeof env.BASE_PATH === "string"
        && env.BASE_PATH.length > 0
        && typeof env.BEHAVIOR_PATH === "string"
        && env.BEHAVIOR_PATH.length > 0
        && typeof env.RESOURCE_PATH === "string"
        && env.RESOURCE_PATH.length > 0;
}

export function validateMinecraftEnv(env: NodeJS.ProcessEnv): MinecraftEnv {
    const requiredKeys = ["BASE_PATH", "BEHAVIOR_PATH", "RESOURCE_PATH"];
    const missingKeys = requiredKeys.filter((key) => !env[key]);

    if (!isMinecraftEnv(env)) {
        throw new Error(`Missing required environment variables: ${missingKeys.join(", ")}`);
    }

    return env;
}

export function getProjectPaths(): ProjectPaths {
    const projectName = path.basename(process.cwd());

    return {
        behaviorPackRoot: path.join(process.cwd(), "src", "behavior_pack"),
        resourcePackRoot: path.join(process.cwd(), "src", "resource_pack"),
        outputDir: path.join(process.cwd(), "out"),
        scriptsDir: path.join(process.cwd(), "scripts"),
        projectName
    };
}

export function getMinecraftLinkPaths(): MinecraftLinkPaths {
    const env = validateMinecraftEnv(process.env);

    return {
        behaviorPackLinkDir: path.join(env.BASE_PATH, env.BEHAVIOR_PATH),
        resourcePackLinkDir: path.join(env.BASE_PATH, env.RESOURCE_PATH)
    };
}
