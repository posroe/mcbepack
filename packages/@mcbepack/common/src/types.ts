export type Version = Array<number> | `${number}.${number}.${number}` | `${number}.${number}.${number}-${string}` | undefined;

export interface BaseManifest {
    format_version: number;
    header: {
        name: string;
        description: string;
        uuid: string;
        version: Version;
        min_engine_version: Version;
    };
    metadata: {
        authors: string[];
        generated_with: {
            [key: string]: Version;
        };
    };
}

export interface ResourceManifest extends BaseManifest {
    modules: {
        type: "resources",
        uuid: string;
        version: Version;
    }[];
    dependencies: Array<{
        uuid: string;
        version: Version;
    }>;
}

export interface BehaviorManifest extends BaseManifest {
    modules: {
        type: "data",
        uuid: string;
        version: Version;
    }[];
    dependencies: Array<{
        uuid: string;
        version: Version;
    }>;
}

export interface APIBehaviorManifest extends BaseManifest {
    capabilities: ['script_eval'];
    modules: {
        type: 'script',
        language: 'javascript',
        entry: string;
        uuid: string;
        version: Version;
    }[];
    dependencies: Array<{
        module_name: string;
        version: Version;
    } | {
        uuid: string;
        version: Version;
    }>;
}

export type Manifest = ResourceManifest | BehaviorManifest | APIBehaviorManifest | BaseManifest;