import { describe, expect, mock, test } from "bun:test";

mock.module("@minecraft/server", () => ({
    world: {
        afterEvents: {
            worldLoad: {
                subscribe: mock(),
            },
        },
    },
    system: {
        run: (callback: () => void) => callback(),
    },
}));

const { DynamicProperty } = await import("./dynamic-property");

function createStorage(initial?: unknown[]) {
    const properties = new Map<string, string>();
    if (initial) {
        properties.set("stats", JSON.stringify(initial));
    }

    return {
        getDynamicProperty: mock((key: string) => properties.get(key)),
        setDynamicProperty: mock((key: string, value: string) => {
            properties.set(key, value);
        }),
        read(key: string) {
            return properties.get(key);
        },
    };
}

describe("DynamicProperty", () => {
    test("loads existing data and performs CRUD operations", () => {
        const storage = createStorage([{ id: "existing", name: "Steve", kills: 1 }]);
        const db = new DynamicProperty<{ name: string; kills: number }>("stats", storage as never);

        expect(db.find((entry) => entry.id === "existing")?.kills).toBe(1);

        const id = db.create({ name: "Alex", kills: 0 });
        expect(db.count()).toBe(2);
        expect(db.findLike("name", "Alex")[0].id).toBe(id);

        db.update((entry) => entry.id === id, { kills: 5 });
        expect(db.find((entry) => entry.id === id)?.kills).toBe(5);

        db.delete((entry) => entry.id === "existing");
        expect(db.count()).toBe(1);

        db.clear();
        expect(db.findMany()).toEqual([]);
        expect(JSON.parse(storage.read("stats")!)).toEqual([]);
    });

    test("rejects invalid collection names", () => {
        expect(() => new DynamicProperty("", createStorage() as never)).toThrow("Collection name must be between 1 and 16 characters");
        expect(() => new DynamicProperty("this-name-is-too-long", createStorage() as never)).toThrow("Collection name must be between 1 and 16 characters");
    });
});
