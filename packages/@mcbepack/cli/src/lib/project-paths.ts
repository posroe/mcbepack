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

function requireMinecraftEnv(): void {
    const requiredKeys = ["BASE_PATH", "BEHAVIOR_PATH", "RESOURCE_PATH"];
    const missingKeys = requiredKeys.filter((key) => !process.env[key]);

    if (missingKeys.length > 0) {
        throw new Error(`Missing required environment variables: ${missingKeys.join(", ")}`);
    }
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
    requireMinecraftEnv();

    return {
        behaviorPackLinkDir: path.join(process.env.BASE_PATH!, process.env.BEHAVIOR_PATH!),
        resourcePackLinkDir: path.join(process.env.BASE_PATH!, process.env.RESOURCE_PATH!)
    };
}
