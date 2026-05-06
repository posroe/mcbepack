# @mcbepack/cli

Command-line tooling for MCBEPACK projects.

The CLI handles three jobs: running a local development loop, syncing pack files into Minecraft's development folders, and building distributable archives.

## Install

Generated projects include this package automatically:

```bash
bun add -D @mcbepack/cli
```

## Project Layout

The CLI expects this shape:

```text
your-addon/
|-- scripts/
|   `-- index.ts
|-- src/
|   |-- behavior_pack/
|   |   `-- manifest.json
|   `-- resource_pack/
|       `-- manifest.json
|-- .env.local
|-- package.json
`-- tsconfig.json
```

`scripts/index.ts` or `scripts/index.js` is bundled into `src/behavior_pack/scripts/index.js` when Script API is enabled.

## Configuration

Create `.env.local` in the project root:

```env
BASE_PATH="C:\Users\YourName\AppData\Roaming\Minecraft Bedrock\Users\Shared\games\com.mojang"
RESOURCE_PATH="development_resource_packs"
BEHAVIOR_PATH="development_behavior_packs"
```

## Commands

Start the development watcher:

```bash
mcbepack dev
```

Build archives:

```bash
mcbepack build -o zip
mcbepack build -o mcpack
mcbepack build -o mcaddon
```

Update selected Minecraft Script API packages in `package.json` and `src/behavior_pack/manifest.json`:

```bash
mcbepack update -t stable
mcbepack update -t beta
mcbepack update -t preview
```

## Outputs

Build artifacts are written to the project's `out/` directory.

- `zip` creates separate behavior/resource `.zip` files when those packs exist.
- `mcpack` creates separate behavior/resource `.mcpack` files when those packs exist.
- `mcaddon` creates one `.mcaddon` containing the available packs.

## Related Packages

- [`create-mcbepack`](../../create-mcbepack)
- [`@mcbepack/api`](../api)
- [`@mcbepack/common`](../common)

## License

GPL-3.0. See [LICENSE](./LICENSE).
