# @mcbepack/api

Utility library for Minecraft Bedrock Script API

[![npm version](https://badge.fury.io/js/create-mcbepack.svg)](https://www.npmjs.com/package/@mcbepack/cli)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Overview

`@mcbepack/api` provides utility classes and helper functions for working with Minecraft Bedrock Edition's Script API, simplifying common tasks such as data persistence and scoreboard management.

## Features

- **Database** - Persistent data storage using Dynamic Properties
- **Scoreboard** - Simplified scoreboard management
- **Type-Safe** - Full TypeScript support with type definitions
- **Script API Integration** - Built on official Minecraft Script API

## Installation

This package is automatically installed as a peer dependency when creating a project with `create-mcbepack`.

```bash
bun add @mcbepack/api
```

## API Reference

### Database

A persistent key-value storage system using Minecraft's Dynamic Properties.

#### Constructor

```typescript
new Database<T>(collectionName: string, storageType?: World | Entity)
```

**Parameters:**

- `collectionName` - Unique identifier for the database collection
- `storageType` - Storage location (default: `world`)
  - `world` - Global world storage
  - `Entity` - Per-entity storage

#### Methods

##### `set(key: string, value: T): void`

Store data in the database.

```typescript
const db = new Database<PlayerData>("players");
db.set("player123", { name: "Steve", score: 100 });
```

##### `get(key: string): T | undefined`

Retrieve data from the database.

```typescript
const data = db.get("player123");
if (data) {
  console.log(data.name); // "Steve"
}
```

##### `delete(key: string): void`

Remove data from the database.

```typescript
db.delete("player123");
```

##### `has(key: string): boolean`

Check if a key exists in the database.

```typescript
if (db.has("player123")) {
  console.log("Player exists!");
}
```

##### `clear(): void`

Remove all data from the database.

```typescript
db.clear();
```

##### `keys(): string[]`

Get all keys in the database.

```typescript
const allKeys = db.keys();
console.log(allKeys); // ["player123", "player456", ...]
```

##### `values(): T[]`

Get all values in the database.

```typescript
const allPlayers = db.values();
```

##### `entries(): [string, T][]`

Get all key-value pairs in the database.

```typescript
const allEntries = db.entries();
for (const [key, value] of allEntries) {
  console.log(`${key}: ${value.name}`);
}
```

#### Example Usage

```typescript
import { Database } from "@mcbepack/api";
import { world } from "@minecraft/server";

interface PlayerStats {
  kills: number;
  deaths: number;
  level: number;
}

// Create a database for player statistics
const statsDb = new Database<PlayerStats>("playerStats");

// Store player data
world.afterEvents.playerSpawn.subscribe((event) => {
  const playerId = event.player.id;

  if (!statsDb.has(playerId)) {
    statsDb.set(playerId, {
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
    const stats = statsDb.get(playerId);

    if (stats) {
      stats.deaths++;
      statsDb.set(playerId, stats);
    }
  }
});

// Retrieve and display data
const stats = statsDb.get("player123");
if (stats) {
  console.log(`Level: ${stats.level}, K/D: ${stats.kills}/${stats.deaths}`);
}
```

### Scoreboard

Simplified scoreboard management utilities.

#### Methods

##### `getObjective(objectiveName: string): ScoreboardObjective | undefined`

Get a scoreboard objective by name.

```typescript
import { getObjective } from "@mcbepack/api";

const objective = getObjective("kills");
```

##### `createObjective(objectiveName: string, displayName?: string): ScoreboardObjective`

Create a new scoreboard objective.

```typescript
import { createObjective } from "@mcbepack/api";

const objective = createObjective("kills", "Total Kills");
```

##### `removeObjective(objectiveName: string): void`

Remove a scoreboard objective.

```typescript
import { removeObjective } from "@mcbepack/api";

removeObjective("kills");
```

#### Example Usage

```typescript
import { createObjective, getObjective } from "@mcbepack/api";
import { world } from "@minecraft/server";

// Create a kills tracker
const killsObjective = createObjective("kills", "Total Kills");

// Track player kills
world.afterEvents.entityDie.subscribe((event) => {
  const killer = event.damageSource.damagingEntity;

  if (killer && killer.typeId === "minecraft:player") {
    const currentScore = killsObjective.getScore(killer) ?? 0;
    killsObjective.setScore(killer, currentScore + 1);
  }
});

// Display scores
const objective = getObjective("kills");
if (objective) {
  const participants = objective.getParticipants();
  for (const participant of participants) {
    const score = objective.getScore(participant);
    console.log(`${participant.displayName}: ${score} kills`);
  }
}
```

## Advanced Usage

### Per-Entity Storage

Store data specific to individual entities:

```typescript
import { Database } from "@mcbepack/api";
import { world } from "@minecraft/server";

interface EntityData {
  customName: string;
  spawnTime: number;
}

world.afterEvents.entitySpawn.subscribe((event) => {
  const entity = event.entity;
  const db = new Database<EntityData>("entityData", entity);

  db.set("metadata", {
    customName: "Special Mob",
    spawnTime: Date.now(),
  });
});
```

### Type Safety

Leverage TypeScript for type-safe data storage:

```typescript
interface QuestData {
  id: string;
  completed: boolean;
  progress: number;
  rewards: string[];
}

const questDb = new Database<QuestData>("quests");

// TypeScript ensures type safety
questDb.set("quest1", {
  id: "quest1",
  completed: false,
  progress: 50,
  rewards: ["diamond", "emerald"],
});

// Type error if structure does not match
// questDb.set("quest2", { invalid: "data" }); // Error
```

## Dependencies

- `@minecraft/server` - Minecraft Script API

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
