# MCBEPACK Project

This add-on was created with `create-mcbepack`.

## Start

Install dependencies:

```bash
bun install
```

Run the development watcher:

```bash
bun run dev
```

The dev command compiles Script API code from `scripts/` when present and syncs files from `src/behavior_pack` and `src/resource_pack` into Minecraft's development folders.

## Build

```bash
bun run build:zip
bun run build:mcpack
bun run build:mcaddon
```

Build outputs are written to `dist/`.

## Configure Minecraft Paths

Edit `.env.local` if your Minecraft Bedrock installation uses a different location:

```env
BASE_PATH="C:\Users\YourName\AppData\Roaming\Minecraft Bedrock\Users\Shared\games\com.mojang"
RESOURCE_PATH="development_resource_packs"
BEHAVIOR_PATH="development_behavior_packs"
```

## Project Structure

```text
.
|-- scripts/
|-- src/
|   |-- behavior_pack/
|   `-- resource_pack/
|-- .env.local
|-- package.json
`-- tsconfig.json
```

Some folders only exist when they were selected during project creation.
