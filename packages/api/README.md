# @mcbepack/api

Utility library for Minecraft Bedrock Script API

[![npm version](https://badge.fury.io/js/@mcbepack/api.svg)](https://www.npmjs.com/package/@mcbepack/api)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Overview

`@mcbepack/api` provides utility classes and helper functions for working with Minecraft Bedrock Edition's Script API, simplifying common tasks such as data persistence and scoreboard management.

## Features

- **DynamicProperty** - Prisma-like database with auto-generated IDs and query methods
- **Advancedboard** - Simplified scoreboard management with chainable methods
- **Type-Safe** - Full TypeScript support with type definitions
- **Script API Integration** - Built on official Minecraft Script API

## Installation

This package is automatically installed as a peer dependency when creating a project with `create-mcbepack`.

```bash
bun add @mcbepack/api
```

## API Reference

### DynamicProperty

A Prisma-like database class that stores data using Minecraft's Dynamic Properties with auto-generated IDs.

#### Constructor

```typescript
new DynamicProperty<T>(collectionName: string, storageType: StorageType)
```

**Parameters:**

- `collectionName` - Unique identifier for the database collection (1-16 characters)
- `storageType` - Storage location: `World`, `Entity`, `Player`, or `ItemStack`

**Note:** All records automatically include an `id` field. Your type `T` should not include an `id` field.

#### Methods

##### `create(data: Omit<T, "id">): string`

Creates a new entry with an auto-generated ID.

```typescript
const db = new DynamicProperty<{ name: string; score: number }>(
  "players",
  world,
);
const id = db.create({ name: "Steve", score: 100 });
console.log(id); // "lx3k9a2b7f"
```

##### `find(predicate: (data: WithId<T>) => boolean): WithId<T> | null`

Finds the first entry matching the predicate.

```typescript
const player = db.find((data) => data.name === "Steve");
if (player) {
  console.log(player.id, player.name, player.score);
}
```

##### `findMany(): WithId<T>[]`

Returns all entries in the database.

```typescript
const allPlayers = db.findMany();
for (const player of allPlayers) {
  console.log(`${player.name}: ${player.score}`);
}
```

##### `findLike<K extends keyof WithId<T>>(key: K, value: WithId<T>[K]): WithId<T>[]`

Finds all entries where a specific field matches a value.

```typescript
const highScorers = db.findLike("score", 100);
```

##### `update(predicate: (data: WithId<T>) => boolean, data: Partial<WithId<T>>): void`

Updates the first entry matching the predicate.

```typescript
db.update((data) => data.id === "abc123", { score: 150 });
```

##### `delete(predicate: (data: WithId<T>) => boolean): void`

Deletes the first entry matching the predicate.

```typescript
db.delete((data) => data.name === "Steve");
```

##### `count(predicate?: (data: WithId<T>) => boolean): number`

Counts entries in the database, optionally filtered by predicate.

```typescript
const totalPlayers = db.count();
const highLevelPlayers = db.count((data) => data.score > 100);
```

##### `clear(): void`

Removes all entries from the database.

```typescript
db.clear();
```

#### Example Usage

```typescript
import { DynamicProperty } from "@mcbepack/api";
import { world } from "@minecraft/server";

interface PlayerStats {
  kills: number;
  deaths: number;
  level: number;
}

// Create a database for player statistics
const statsDb = new DynamicProperty<PlayerStats>("playerStats", world);

// Store player data
world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player;

  // Check if player already exists
  const existing = statsDb.find((data) => data.id === player.id);

  if (!existing) {
    statsDb.create({
      kills: 0,
      deaths: 0,
      level: 1,
    });
  }
});

// Update player data
world.afterEvents.entityDie.subscribe((event) => {
  if (event.deadEntity.typeId === "minecraft:player") {
    const playerId = event.deadEntity.id;

    statsDb.update(
      (data) => data.id === playerId,
      (stats) => ({ deaths: (stats?.deaths ?? 0) + 1 }),
    );
  }
});

// Retrieve and display data
const allStats = statsDb.findMany();
for (const stats of allStats) {
  console.log(
    `Player ${stats.id}: Level ${stats.level}, K/D: ${stats.kills}/${stats.deaths}`,
  );
}
```

### Advancedboard

A simplified scoreboard management utility with chainable methods.

#### Initialization

```typescript
import { Advancedboard } from "@mcbepack/api";
import { world } from "@minecraft/server";

// Initialize the scoreboard (required before use)
Advancedboard.initialize(world.scoreboard);
```

#### Methods

##### `get(name: string, player: Player): number`

Gets a player's score from a scoreboard objective. Returns 0 if not set.

```typescript
const kills = Advancedboard.get("kills", player);
console.log(`Player has ${kills} kills`);
```

##### `set(name: string, player: Player, value: number): Advancedboard`

Sets a player's score in a scoreboard objective. Returns the class for chaining.

```typescript
Advancedboard.set("health", player, 100);
```

##### `add(name: string, player: Player, value: number): Advancedboard`

Adds a value to a player's current score. Returns the class for chaining.

```typescript
Advancedboard.add("kills", player, 1);
```

##### `reset(name: string, player: Player): Advancedboard`

Resets a player's score to 0. Returns the class for chaining.

```typescript
Advancedboard.reset("deaths", player);
```

##### `delete(name: string, player: Player, value: number): Advancedboard`

Subtracts a value from a player's current score. Returns the class for chaining.

```typescript
Advancedboard.delete("coins", player, 50);
```

#### Example Usage

```typescript
import { Advancedboard } from "@mcbepack/api";
import { world } from "@minecraft/server";

// Initialize
Advancedboard.initialize(world.scoreboard);

// Track player kills with method chaining
world.afterEvents.entityDie.subscribe((event) => {
  const killer = event.damageSource.damagingEntity;

  if (killer && killer.typeId === "minecraft:player") {
    Advancedboard.add("kills", killer, 1).add("totalScore", killer, 10);
  }
});

// Display player stats
world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player;
  const kills = Advancedboard.get("kills", player);
  const deaths = Advancedboard.get("deaths", player);

  player.sendMessage(`Your K/D: ${kills}/${deaths}`);
});
```

## Advanced Usage

### Per-Entity Storage

Store data specific to individual entities:

```typescript
import { DynamicProperty } from "@mcbepack/api";
import { world } from "@minecraft/server";

interface EntityData {
  customName: string;
  spawnTime: number;
}

world.afterEvents.entitySpawn.subscribe((event) => {
  const entity = event.entity;
  const db = new DynamicProperty<EntityData>("entityData", entity);

  db.create({
    customName: "Special Mob",
    spawnTime: Date.now(),
  });
});
```

### Type Safety

Leverage TypeScript for type-safe data storage:

```typescript
interface QuestData {
  title: string;
  completed: boolean;
  progress: number;
  rewards: string[];
}

const questDb = new DynamicProperty<QuestData>("quests", world);

// TypeScript ensures type safety
const questId = questDb.create({
  title: "Defeat the Dragon",
  completed: false,
  progress: 50,
  rewards: ["diamond", "emerald"],
});

// Type error if structure does not match
// questDb.create({ invalid: "data" }); // Error: missing required fields
```

### Querying with Predicates

Use powerful predicate functions for complex queries:

```typescript
interface Player {
  name: string;
  level: number;
  guild: string;
}

const playerDb = new DynamicProperty<Player>("players", world);

// Find high-level players in a specific guild
const elitePlayers = playerDb
  .findMany()
  .filter((player) => player.level > 50 && player.guild === "Warriors");

// Count players by condition
const beginnerCount = playerDb.count((player) => player.level < 10);
```

## Related Packages

- [`create-mcbepack`](../create-mcbepack) - Project scaffolding tool
- [`@mcbepack/cli`](../cli) - Development and build tooling
- [`@mcbepack/common`](../common) - Shared utilities

## License

GPL-3.0 - see [LICENSE](../../LICENSE) for details

## Resources

- [GitHub Repository](https://github.com/bugphxne/create-mcbepack)
- [Documentation](https://docs.mbext.online/mcbepack)
- [Minecraft Script API Documentation](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/)
- [Issue Tracker](https://github.com/bugphxne/create-mcbepack/issues)
