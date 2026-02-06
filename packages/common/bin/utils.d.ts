import { Version } from "./types.js";
export declare function getVersions(packageName: string): Promise<string[]>;
export declare function getDependency(packageName: string, release: "stable" | "beta" | "preview"): Promise<{
    packageName: string;
    fullVersion: string;
    version: Version;
}>;
