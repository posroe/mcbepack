import { Version } from "@mcbepack/common";

export interface ProjectConfig {
    name: string;
    description: string;
    author: string;
    minimumEngineVersion: string;
    extensions: string[];
    script?: {
        enabled: boolean;
        language: "typescript" | "javascript";
        release: string;
        packages: string[];
        dependencies: Array<{
            packageName: string;
            version: Version;
            fullVersion: string;
        }>;
    };
    uuids: {
        behavior: string;
        resource: string;
        scriptModule: string;
    };
}

export interface ProjectPaths {
    root: string;
    behaviorPack: string;
    resourcePack: string;
    scripts: string;
}

export interface FileToCreate {
    path: string;
    content: string | Buffer;
    type: "file" | "copy";
    source?: string;
}
