import path from "node:path";


export const NAMES = {
    behavior: "behavior_pack",
    resource: "resource_pack",
    manifest: "manifest.json",
    package: "package.json",
    project: path.basename(process.cwd()),
}

export const DIRECTORIES = {
    behavior: {
        origin: path.join(process.cwd(), "src", NAMES.behavior),
        destination: path.join(process.env.BASE_PATH!, process.env.BEHAVIOR_PATH!)
    },
    resource: {
        origin: path.join(process.cwd(), "src", NAMES.resource),
        destination: path.join(process.env.BASE_PATH!, process.env.RESOURCE_PATH!)
    },
    output: path.join(process.cwd(), "out"),
    scripts: {
        origin: path.join(process.cwd(), "scripts"),
        destination: path.join(process.cwd(), "src", NAMES.behavior, "scripts"),
    }
}