import { beforeEach, describe, expect, mock, test } from "bun:test";

const fetchMock = mock();

mock.module("node-fetch", () => ({
    default: fetchMock,
}));

const { getDependency, getVersions } = await import("./utils");

beforeEach(() => {
    fetchMock.mockReset();
});

function mockRegistryResponse(versions: string[]) {
    fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
            versions: Object.fromEntries(versions.map((version) => [version, {}])),
        }),
    });
}

describe("common utils", () => {
    test("returns npm versions for a package", async () => {
        mockRegistryResponse(["1.0.0", "1.1.0"]);

        await expect(getVersions("@minecraft/server")).resolves.toEqual(["1.0.0", "1.1.0"]);
        expect(fetchMock).toHaveBeenCalledWith("https://registry.npmjs.org/@minecraft/server?fields=versions");
    });

    test("throws when npm registry response is not ok", async () => {
        fetchMock.mockResolvedValue({
            ok: false,
            json: async () => ({}),
        });

        await expect(getVersions("missing-package")).rejects.toThrow("Package missing-package not found");
    });

    test("resolves stable versions", async () => {
        mockRegistryResponse(["1.0.0", "1.2.0-beta.1.20.0-stable", "1.1.0"]);

        await expect(getDependency("@minecraft/server", "stable")).resolves.toEqual({
            packageName: "@minecraft/server",
            fullVersion: "1.1.0",
            version: "1.1.0",
        });
    });

    test("resolves beta and extracts manifest semver", async () => {
        mockRegistryResponse(["1.0.0", "1.2.0-beta.1.21.0-stable"]);

        await expect(getDependency("@minecraft/server", "beta")).resolves.toEqual({
            packageName: "@minecraft/server",
            fullVersion: "1.2.0-beta.1.21.0-stable",
            version: "1.2.0-beta",
        });
    });

    test("falls back to stable when requested channel is unavailable", async () => {
        mockRegistryResponse(["1.0.0", "1.1.0"]);

        await expect(getDependency("@minecraft/server", "preview")).resolves.toEqual({
            packageName: "@minecraft/server",
            fullVersion: "1.1.0",
            version: "1.1.0",
        });
    });
});
