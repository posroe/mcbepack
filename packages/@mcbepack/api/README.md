# @mcbepack/api

Small helper utilities for Minecraft Bedrock Script API projects.

## Install

```bash
bun add @mcbepack/api
```

Generated Script API projects include this package by default.

## DynamicProperty

`DynamicProperty<T>` stores JSON records in Minecraft dynamic properties. Each record receives a generated `id`.

```ts
import { world } from "@minecraft/server";
import { DynamicProperty } from "@mcbepack/api";

type PlayerStats = {
  name: string;
  kills: number;
};

const stats = new DynamicProperty<PlayerStats>("stats", world);

const id = stats.create({ name: "Steve", kills: 0 });
const steve = stats.find((entry) => entry.id === id);

stats.update((entry) => entry.id === id, { kills: 1 });
```

Available methods:

- `create(data)`
- `find(predicate)`
- `findMany()`
- `findLike(key, value)`
- `count(predicate?)`
- `update(predicate, data)`
- `delete(predicate)`
- `clear()`

Collection names must be 1-16 characters because they are used as dynamic property keys.

## Advancedboard

`Advancedboard` wraps common scoreboard operations and creates objectives only when they do not already exist.

```ts
import { world } from "@minecraft/server";
import { Advancedboard } from "@mcbepack/api";

Advancedboard.initialize(world.scoreboard);

world.afterEvents.playerSpawn.subscribe(({ player }) => {
  Advancedboard.add("joins", player, 1);
  player.sendMessage(`Joins: ${Advancedboard.get("joins", player)}`);
});
```

Available methods:

- `initialize(scoreboard)`
- `get(name, player)`
- `set(name, player, value)`
- `add(name, player, value)`
- `reset(name, player)`
- `delete(name, player, value)`

## Related Packages

- [`create-mcbepack`](../../create-mcbepack)
- [`@mcbepack/cli`](../cli)
- [`@mcbepack/common`](../common)

## License

GPL-3.0. See [LICENSE](./LICENSE).
