# MCBEPACK

MCBEPACK is a small toolkit for building Minecraft Bedrock Edition add-ons with a cleaner project structure, repeatable builds, and optional Script API support.

It is split into focused packages: one package creates new projects, one runs the development/build workflow, one provides Script API helpers, and one holds shared types/utilities used by the rest of the workspace.

## Packages

| Package | Purpose |
| --- | --- |
| [`create-mcbepack`](./packages/create-mcbepack) | Interactive project scaffolder |
| [`@mcbepack/cli`](./packages/@mcbepack/cli) | Development server, file sync, builds, and dependency updates |
| [`@mcbepack/api`](./packages/@mcbepack/api) | Script API helper utilities |
| [`@mcbepack/common`](./packages/@mcbepack/common) | Shared constants, types, and npm version helpers |

## Quick Start

Create a new add-on project:

```bash
bunx create-mcbepack
```

Then follow the generated project's next steps:

```bash
cd your-project
bun install
bun run dev
```

Build distribution archives:

```bash
bun run build:zip
bun run build:mcpack
bun run build:mcaddon
```

## Repository Development

Install dependencies from the repository root:

```bash
bun install
```

Build every workspace package:

```bash
bun run build
```

Work on one package at a time:

```bash
cd packages/@mcbepack/cli
bun run dev
```

## Requirements

- Bun 1.0 or newer
- Minecraft Bedrock Edition
- A configured Minecraft `com.mojang` development directory when using `mcbepack dev`

Generated projects use `.env.local` to point the CLI at Minecraft's development pack folders.

## License

GPL-3.0. See [LICENSE](./LICENSE).

## Disclaimer

MCBEPACK is a community project and is not affiliated with Mojang Studios or Microsoft.
