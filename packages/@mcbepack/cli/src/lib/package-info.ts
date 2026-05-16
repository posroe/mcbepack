import fs from "node:fs";

export function getCliVersion(): string | undefined {
    try {
        const packageJson = JSON.parse(fs.readFileSync(new URL("../../package.json", import.meta.url), "utf8")) as {
            version?: string;
        };
        return packageJson.version;
    } catch {
        return undefined;
    }
}
