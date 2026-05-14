import {
    World,
    Entity,
    Player,
    ItemStack,
    world,
    system
} from "@minecraft/server";

/**
 * Supported storage types for the database
 * Can store data on World, Entity, Player, or ItemStack using dynamic properties
 */
export type Storage = World | Entity | Player | ItemStack;

/**
 * Record type with auto-generated id field
 */
export type WithId<T> = Omit<T, "id"> & {
    id: string;
};

export class DynamicProperty<T> {
    private name: string;
    private storage: Storage;
    private values: WithId<T>[] = [];

    constructor(name: string, storage: Storage) {
        this.name = name;
        this.storage = storage;
        this.init();
    }

    /**
     * Loads all values from dynamic properties into memory
     * 
     * @private
     */
    private init(): void {
        system.run(() => {
            world.afterEvents.worldLoad.subscribe(() => {
                const keys = this.storage.getDynamicPropertyIds();
                for (const key of keys) {
                    const value = this.storage.getDynamicProperty(key);
                    if (typeof value === "string") {
                        this.values.push(JSON.parse(value));
                    }
                }
            })
        })
    }

    /**
     * Generates a unique ID for new database entries
     * Combines timestamp and random string in base36 format
     * 
     * @private
     * @returns A unique identifier string
     */
    private generateId(): string {
        // Use timestamp for uniqueness across time
        const timestamp = Date.now().toString(36);
        // Add random component for uniqueness within same millisecond
        const random = Math.random().toString(36).substring(2, 10);
        return timestamp + random;
    }

    /**
     * Finds entries in the database
     * 
     * @example
     * ```typescript
     * const value = db.find((value) => value.id === "1"); // Finds the entry with id "1"
     * ```
     * 
     * @param predicate - Predicate function to filter entries
     * @returns The entry if found, otherwise undefined
     */
    public find(predicate: (value: WithId<T>) => boolean) {
        return this.values.find(predicate);
    }

    /**
     * Creates a new entry in the database
     * 
     * @example
     * ```typescript
     * const value = db.create({ name: "New Value" }); // Creates a new entry
     * ```
     * 
     * @param value - The data to store (id will be auto-generated)
     * @returns The created entry
     */
    public create(value: Omit<T, "id">): WithId<T> {
        const id = this.generateId();

        const data = { ...value, id };
        this.values.push(data);
        this.storage.setDynamicProperty(
            `${this.name}:${id}`,
            JSON.stringify(data),
        );

        return data;
    }

    /**
     * Deletes entries from the database
     * 
     * @example
     * ```typescript
     * db.delete((value) => value.id === "1"); // Deletes the entry with id "1"
     * ```
     * 
     * @param predicate - Predicate function to filter entries
     */
    public delete(predicate: (value: WithId<T>) => boolean): void {
        const values = this.values.filter(predicate)

        values.forEach((value) => {
            this.storage.setDynamicProperty(
                `${this.name}:${value.id}`,
                undefined
            );
        });

        this.values = this.values.filter((value) => !values.some(v => v.id === value.id));
    }

    /**
     * Updates entries in the database
     * 
     * @example
     * ```typescript
     * db.update((value) => value.id === "1", (value) => ({ ...value, name: "New Name" })); // Updates the entry with id "1"
     * ```
     * 
     * @param predicate - Predicate function to filter entries
     * @param prev - Function to update the entries
     */
    public update(predicate: (value: WithId<T>) => boolean, prev: (value: WithId<T>) => WithId<T>): void {
        const values = this.values.filter(predicate).map(prev)

        values.forEach((value) => {
            this.storage.setDynamicProperty(
                `${this.name}:${value.id}`,
                JSON.stringify(value)
            );
        });

        this.values = this.values.map(value => values.find(v => v.id === value.id) ?? value);
    }

    /**
     * Gets the number of entries in the database
     * 
     * @example
     * ```typescript
     * const count = db.count(); // Gets the number of entries
     * ```
     * 
     * @param predicate - Optional predicate function to filter entries
     * @returns The number of entries
     */
    public count(predicate?: (value: WithId<T>) => boolean): number {
        if (predicate) {
            return this.values.filter(predicate).length;
        }
        return this.values.length;
    }

    /**
     * Removes all entries from the database
     * 
     * @example
     * ```typescript
     * db.clear(); // Deletes all data
     * ```
     */
    public clear(): void {
        this.values.forEach((value) => {
            this.storage.setDynamicProperty(`${this.name}:${value.id}`, undefined);
        });
        this.values = [];
    }
}