import fetch from "node-fetch";

import { Version } from "./types.js";

interface NpmVersionsResponse {
    versions: Record<string, unknown>;
}

function isNpmVersionsResponse(value: unknown): value is NpmVersionsResponse {
    return typeof value === "object"
        && value !== null
        && "versions" in value
        && typeof value.versions === "object"
        && value.versions !== null
        && !Array.isArray(value.versions);
}

function toManifestVersion(version: string): Version {
    return version;
}

export async function getVersions(packageName: string): Promise<string[]> {
    const url = `https://registry.npmjs.org/${packageName}?fields=versions`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Package ${packageName} not found`);
    }

    const data: unknown = await response.json();
    if (!isNpmVersionsResponse(data)) {
        throw new Error(`Invalid registry response for ${packageName}`);
    }

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

    if (!version) {
        throw new Error(`No ${release} version found for ${packageName}`);
    }

    const shouldExtractSemver = release !== "stable" && version.includes("-");
    const semanticVersion = shouldExtractSemver
        ? version.split(".").slice(0, 3).join(".")
        : version;

    return {
        packageName,
        fullVersion: version,
        version: toManifestVersion(semanticVersion)
    };
}
