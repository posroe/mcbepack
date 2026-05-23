# @mcbepack/api

Helper utilities for Minecraft Bedrock Script API projects.

## Installation

```bash
bun add @mcbepack/api
```

Generated mcbepack Script API projects include this package by default.

This package expects `@minecraft/server` to be provided by your Script API
runtime. It is built against `@minecraft/server` 2.4.0 or newer.

## Exports

```ts
import { Advancedboard, DynamicProperty } from "@mcbepack/api";
```

## DynamicProperty

`DynamicProperty<T>` stores JSON records in Minecraft dynamic properties. Each
record receives a generated string `id`, and created records are cached in
`values`.

Dynamic properties can be stored on a `World`, `Entity`, `Player`, or
`ItemStack`.

```ts
import { world } from "@minecraft/server";
import { DynamicProperty } from "@mcbepack/api";

type PlayerStats = {
  name: string;
  kills: number;
};

const stats = new DynamicProperty<PlayerStats>("stats", world);

const steve = stats.create({ name: "Steve", kills: 0 });

stats.update(
  (entry) => entry.id === steve.id,
  (entry) => ({ ...entry, kills: entry.kills + 1 }),
);

const current = stats.find((entry) => entry.id === steve.id);
```

### Methods

| Method | Description |
| --- | --- |
| `create(value)` | Creates a record, stores it, and returns the created record with `id`. |
| `find(predicate)` | Returns the first matching record, or `undefined`. |
| `count(predicate?)` | Returns the total number of records, or matching records when a predicate is passed. |
| `update(predicate, updater)` | Updates every matching record with the returned value from `updater`. |
| `delete(predicate)` | Deletes every matching record. |
| `clear()` | Deletes all records in this collection. |

Stored dynamic property keys use the format `db:<name>:<id>`.

> Existing data is loaded after the Minecraft `worldLoad` event. If you need to
> read previously saved records, access `values` after the world has loaded.

## Advancedboard

`Advancedboard` wraps common scoreboard operations. It automatically creates a
scoreboard objective when the objective does not exist.

```ts
import { world } from "@minecraft/server";
import { Advancedboard } from "@mcbepack/api";

Advancedboard.initialize(world.scoreboard);

world.afterEvents.playerSpawn.subscribe(({ player }) => {
  Advancedboard.add("joins", player, 1);

  const joins = Advancedboard.get("joins", player);
  player.sendMessage(`Joins: ${joins}`);
});
```

### Methods

| Method | Description |
| --- | --- |
| `initialize(scoreboard)` | Sets the scoreboard instance used by the helper. |
| `get(name, player)` | Gets a player's score, returning `0` when no score is set. |
| `set(name, player, value)` | Sets a player's score. |
| `add(name, player, value)` | Adds to a player's current score. |
| `reset(name, player)` | Sets a player's score to `0`. |
| `delete(name, player, value)` | Subtracts from a player's current score. |

If `initialize` is not called, `Advancedboard` falls back to `world.scoreboard`.

## Related Packages

- [`create-mcbepack`](../../create-mcbepack)
- [`@mcbepack/cli`](../cli)
- [`@mcbepack/common`](../common)

## License

GPL-3.0. See [LICENSE](./LICENSE).
