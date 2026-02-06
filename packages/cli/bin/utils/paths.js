import path from "path";
export function validateEnv() {
    const required = ['BASE_PATH', 'BEHAVIOR_PATH', 'RESOURCE_PATH'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}
export function getProjectPaths() {
    const projectName = path.basename(process.cwd());
    return {
        scriptsDir: path.join(process.cwd(), "scripts"),
        behaviorPath: path.join(process.env.BASE_PATH, process.env.BEHAVIOR_PATH),
        resourcePath: path.join(process.env.BASE_PATH, process.env.RESOURCE_PATH),
        behaviorRootPath: path.join(process.cwd(), "src", "behavior_pack"),
        resourceRootPath: path.join(process.cwd(), "src", "resource_pack"),
        binPath: path.join(process.cwd(), "bin"),
        projectName
    };
}
