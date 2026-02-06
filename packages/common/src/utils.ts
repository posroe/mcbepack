import fetch from "node-fetch";
import { Version } from "./types.js";

export async function getVersions(packageName: string) {
    const url = `https://registry.npmjs.org/${packageName}?fields=versions`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Package ${packageName} not found`);
    }

    const data = await response.json() as { versions: string[] };
    return Object.keys(data.versions);
}

export async function getDependency(packageName: string, release: "stable" | "beta" | "preview"): Promise<{
    packageName: string;
    fullVersion: string;
    version: Version;
}> {
    const versions = await getVersions(packageName);

    const patterns: Record<typeof release, RegExp> = {
        stable: /^\d+\.\d+\.\d+$/,
        beta: /^\d+\.\d+\.\d+-beta\.[\d.]+-stable$/,
        preview: /^\d+\.\d+\.\d+-beta\.[\d.]+-preview\.\d+$/
    };

    let version = versions.filter(v => v.match(patterns[release])).pop();

    if (!version) {
        version = versions.filter(v => v.match(patterns.stable)).pop();
    }

    const shouldExtractSemver = release !== "stable" && version!.includes("-");
    const semanticVersion = shouldExtractSemver
        ? version!.split(".").slice(0, 3).join(".")
        : version!;

    return {
        packageName,
        fullVersion: version!,
        version: semanticVersion as Version
    };
}