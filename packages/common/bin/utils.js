import fetch from "node-fetch";
export async function getVersions(packageName) {
    const url = `https://registry.npmjs.org/${packageName}?fields=versions`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Package ${packageName} not found`);
    }
    const data = await response.json();
    return Object.keys(data.versions);
}
export async function getDependency(packageName, release) {
    const versions = await getVersions(packageName);
    const patterns = {
        stable: /^\d+\.\d+\.\d+$/,
        beta: /^\d+\.\d+\.\d+-beta\.[\d.]+-stable$/,
        preview: /^\d+\.\d+\.\d+-beta\.[\d.]+-preview\.\d+$/
    };
    let version = versions.filter(v => v.match(patterns[release])).pop();
    if (!version) {
        version = versions.filter(v => v.match(patterns.stable)).pop();
    }
    const shouldExtractSemver = release !== "stable" && version.includes("-");
    const semanticVersion = shouldExtractSemver
        ? version.split(".").slice(0, 3).join(".")
        : version;
    return {
        packageName,
        fullVersion: version,
        version: semanticVersion
    };
}
