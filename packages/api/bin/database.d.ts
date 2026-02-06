import { World, Entity, Player, ItemStack } from "@minecraft/server";
/**
 * Supported storage types for the database
 * Can store data on World, Entity, Player, or ItemStack using dynamic properties
 */
export type StorageType = World | Entity | Player | ItemStack;
/**
 * Default pattern that all database entries must follow
 * Adds an 'id' field to the generic type T
 */
export type DefaultPattern<T> = {
    id: string;
} & T;
/**
 * A generic database class for Minecraft Bedrock Edition
 * Stores data using dynamic properties and provides CRUD operations
 *
 * @template T - The type of data to store (will automatically include an 'id' field)
 *
 * @example
 * ```typescript
 * // Create a database for player stats
 * const statsDb = new Database<{ kills: number, deaths: number }>("stats", world);
 *
 * // Create a new entry
 * const id = statsDb.create({ kills: 10, deaths: 5 });
 *
 * // Find an entry
 * const entry = statsDb.find((data) => data.id === id);
 * ```
 */
export declare class Database<T> {
    private collectionName;
    private storageType;
    /** In-memory cache of all database entries */
    private data;
    /**
     * Creates a new database instance
     *
     * @param collectionName - Name of the collection (1-16 characters, used as dynamic property key)
     * @param storageType - Where to store the data (World, Entity, Player, or ItemStack)
     * @throws Error if collection name is invalid or initialization fails
     */
    constructor(collectionName: string, storageType: StorageType);
    /**
     * Loads existing data from dynamic properties into memory
     * Called automatically during construction
     *
     * @private
     * @throws Error if data cannot be loaded or parsed
     */
    private initialize;
    /**
     * Persists in-memory data to dynamic properties
     * Called automatically after any data modification
     *
     * @private
     * @throws Error if data cannot be saved
     */
    private saveChanges;
    /**
     * Generates a unique ID for new database entries
     * Combines timestamp and random string in base36 format
     *
     * @private
     * @returns A unique identifier string
     */
    private generateId;
    /**
     * Creates a new entry in the database
     *
     * @param data - The data to store (id will be auto-generated)
     * @returns The generated ID of the new entry
     *
     * @example
     * ```typescript
     * const id = db.create({ name: "Steve", level: 5 });
     * ```
     */
    create(data: T): string;
    /**
     * Finds a single entry matching the predicate
     *
     * @param papredicate - Function to test each entry
     * @returns The first matching entry or null if not found
     *
     * @example
     * ```typescript
     * const player = db.find((data) => data.name === "Steve");
     * ```
     */
    find(papredicate: (data: DefaultPattern<T>) => boolean): DefaultPattern<T> | null | undefined;
    /**
     * Returns all entries in the database
     *
     * @returns Array of all database entries
     *
     * @example
     * ```typescript
     * const allPlayers = db.findMany();
     * ```
     */
    findMany(): DefaultPattern<T>[];
    /**
     * Finds all entries where a specific field matches a value
     *
     * @param key - The field name to match
     * @param value - The value to match
     * @returns Array of matching entries
     *
     * @example
     * ```typescript
     * const level5Players = db.findLike("level", 5);
     * ```
     */
    findLike<K extends keyof DefaultPattern<T>>(key: K, value: DefaultPattern<T>[K]): DefaultPattern<T>[];
    /**
     * Counts entries in the database
     *
     * @param predicate - Optional filter function
     * @returns Number of entries (matching predicate if provided)
     *
     * @example
     * ```typescript
     * const totalPlayers = db.count();
     * const highLevelPlayers = db.count((data) => data.level > 10);
     * ```
     */
    count(predicate?: (data: DefaultPattern<T>) => boolean): number;
    /**
     * Deletes a single entry matching the predicate
     *
     * @param predicate - Function to find the entry to delete
     *
     * @example
     * ```typescript
     * db.delete((data) => data.id === "abc123");
     * ```
     */
    delete(predicate: (data: DefaultPattern<T>) => boolean): void;
    /**
     * Updates a single entry matching the predicate
     *
     * @param predicate - Function to find the entry to update
     * @param data - Partial data to merge with existing entry
     *
     * @example
     * ```typescript
     * db.update((data) => data.id === "abc123", { level: 10 });
     * ```
     */
    update(predicate: (data: DefaultPattern<T>) => boolean, data: Partial<DefaultPattern<T>>): void;
    /**
     * Removes all entries from the database
     *
     * @example
     * ```typescript
     * db.clear(); // Deletes all data
     * ```
     */
    clear(): void;
}
