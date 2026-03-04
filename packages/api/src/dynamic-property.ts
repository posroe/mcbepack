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
 * Record type with auto-generated id field
 */
export type WithId<T> = { id: string } & T;

/**
 * Where clause for filtering records
 */
export type WhereInput<T> = {
    [K in keyof WithId<T>]?: WithId<T>[K] | {
        equals?: WithId<T>[K];
        not?: WithId<T>[K];
        in?: WithId<T>[K][];
        notIn?: WithId<T>[K][];
    };
};

/**
 * Order by clause for sorting
 */
export type OrderByInput<T> = {
    [K in keyof WithId<T>]?: 'asc' | 'desc';
};

/**
 * Arguments for findUnique operation
 */
export type FindUniqueArgs<T> = {
    where: WhereInput<T>;
};

/**
 * Arguments for findFirst operation
 */
export type FindFirstArgs<T> = {
    where?: WhereInput<T>;
    orderBy?: OrderByInput<T>;
};

/**
 * Arguments for findMany operation
 */
export type FindManyArgs<T> = {
    where?: WhereInput<T>;
    orderBy?: OrderByInput<T>;
    take?: number;
    skip?: number;
};

/**
 * Arguments for create operation
 */
export type CreateArgs<T> = {
    data: Omit<T, "id">;
};

/**
 * Arguments for createMany operation
 */
export type CreateManyArgs<T> = {
    data: Omit<T, "id">[];
};

/**
 * Arguments for update operation
 */
export type UpdateArgs<T> = {
    where: WhereInput<T>;
    data: Partial<T>;
};

/**
 * Arguments for updateMany operation
 */
export type UpdateManyArgs<T> = {
    where: WhereInput<T>;
    data: Partial<T>;
};

/**
 * Arguments for delete operation
 */
export type DeleteArgs<T> = {
    where: WhereInput<T>;
};

/**
 * Arguments for deleteMany operation
 */
export type DeleteManyArgs<T> = {
    where: WhereInput<T>;
};

/**
 * Arguments for upsert operation
 */
export type UpsertArgs<T> = {
    where: WhereInput<T>;
    create: Omit<T, "id">;
    update: Partial<T>;
};

/**
 * Arguments for count operation
 */
export type CountArgs<T> = {
    where?: WhereInput<T>;
};

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
export class DynamicProperty<T> {
    /** In-memory cache of all database entries */
    private sets = new Set<WithId<T>>();

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
            system.run(() => {
                world.afterEvents.worldLoad.subscribe(() => {
                    // Retrieve stored JSON string from dynamic properties
                    const data = this.storageType.getDynamicProperty(this.collectionName) as string;
                    if (data) {
                        // Parse JSON and populate in-memory cache
                        const entries = JSON.parse(data);
                        for (const data of entries) {
                            this.sets.add(data);
                        }
                    }
                })
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
            const entries = Array.from(this.sets.values());
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
    public create(data: Omit<T, "id">): string {
        if ("id" in data) {
            throw new Error("ID cannot be provided during creation");
        }
        const id = this.generateId();
        // Merge user data with generated ID
        this.sets.add({
            id,
            ...data
        } as WithId<T>);
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
    public find(papredicate: (data: WithId<T>) => boolean) {
        try {
            return Array.from(this.sets.values()).find(papredicate);
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
        return Array.from(this.sets.values());
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
    public findLike<K extends keyof WithId<T>>(key: K, value: WithId<T>[K]) {
        return Array.from(this.sets.values()).filter((data) => data[key] === value);
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
    public count(predicate?: (data: WithId<T>) => boolean) {
        return predicate ? Array.from(this.sets.values()).filter(predicate).length : this.sets.size;
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
    public delete(predicate: (data: WithId<T>) => boolean) {
        const data = this.find(predicate);
        if (data) {
            this.sets.delete(data);
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
    public update(predicate: (data: WithId<T>) => boolean, data: Partial<WithId<T>>) {
        const existingData = this.find(predicate);
        if (existingData) {
            // Remove old entry
            this.sets.delete(existingData);
            // Add updated entry (merge existing with new data)
            this.sets.add({
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
        this.sets.clear();
        this.saveChanges();
    }
}