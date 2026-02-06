// Import Minecraft server types for storage
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
export type StorageType = World | Entity | Player | ItemStack;

/**
 * Default pattern that all database entries must follow
 * Adds an 'id' field to the generic type T
 */
export type DefaultPattern<T> = { id: string; } & T;

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
export class Database<T> {
    /** In-memory cache of all database entries */
    private data = new Set<DefaultPattern<T>>();

    /**
     * Creates a new database instance
     * 
     * @param collectionName - Name of the collection (1-16 characters, used as dynamic property key)
     * @param storageType - Where to store the data (World, Entity, Player, or ItemStack)
     * @throws Error if collection name is invalid or initialization fails
     */
    constructor(
        private collectionName: string,
        private storageType: StorageType
    ) {
        // Validate collection name length (Minecraft dynamic property limitation)
        if (collectionName.length < 1 || collectionName.length > 16) {
            throw new Error('Collection name must be between 1 and 16 characters');
        }
        // Load existing data from storage
        this.initialize();
    }

    /**
     * Loads existing data from dynamic properties into memory
     * Called automatically during construction
     * 
     * @private
     * @throws Error if data cannot be loaded or parsed
     */
    private initialize(): void {
        try {
            console.log("Database 1");
            world.afterEvents.worldLoad.subscribe(() => {
                // Retrieve stored JSON string from dynamic properties
                const storedData = this.storageType.getDynamicProperty(this.collectionName) as string;
                if (storedData) {
                    // Parse JSON and populate in-memory cache
                    const entries = JSON.parse(storedData);
                    for (const data of entries) {
                        this.data.add(data);
                    }
                }
            })
        } catch (error) {
            throw new Error(`Failed to initialize database: ${error}`);
        }
    }

    /**
     * Persists in-memory data to dynamic properties
     * Called automatically after any data modification
     * 
     * @private
     * @throws Error if data cannot be saved
     */
    private saveChanges(): void {
        try {
            // Convert Set to Array and serialize to JSON
            const entries = Array.from(this.data.values());
            this.storageType.setDynamicProperty(this.collectionName, JSON.stringify(entries));
        } catch (error) {
            throw new Error(`Failed to save changes: ${error}`);
        }
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
    public create(data: T): string {
        const id = this.generateId();
        // Merge user data with generated ID
        this.data.add({
            ...data,
            id
        });
        // Persist to storage
        this.saveChanges();
        return id;
    }

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
    public find(papredicate: (data: DefaultPattern<T>) => boolean) {
        try {
            return Array.from(this.data.values()).find(papredicate);
        } catch (error) {
            return null;
        }
    }

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
    public findMany() {
        return Array.from(this.data.values());
    }

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
    public findLike<K extends keyof DefaultPattern<T>>(key: K, value: DefaultPattern<T>[K]) {
        return Array.from(this.data.values()).filter((data) => data[key] === value);
    }

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
    public count(predicate?: (data: DefaultPattern<T>) => boolean) {
        return predicate ? Array.from(this.data.values()).filter(predicate).length : this.data.size;
    }

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
    public delete(predicate: (data: DefaultPattern<T>) => boolean) {
        const data = this.find(predicate);
        if (data) {
            this.data.delete(data);
            this.saveChanges();
        }
    }

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
    public update(predicate: (data: DefaultPattern<T>) => boolean, data: Partial<DefaultPattern<T>>) {
        const existingData = this.find(predicate);
        if (existingData) {
            // Remove old entry
            this.data.delete(existingData);
            // Add updated entry (merge existing with new data)
            this.data.add({
                ...existingData,
                ...data
            });
            this.saveChanges();
        }
    }

    /**
     * Removes all entries from the database
     * 
     * @example
     * ```typescript
     * db.clear(); // Deletes all data
     * ```
     */
    public clear() {
        this.data.clear();
        this.saveChanges();
    }
}