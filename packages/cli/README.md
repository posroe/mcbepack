# @mcbepack/cli

> Development and build tooling for MCBEPACK projects

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

`@mcbepack/cli` provides command-line tools for developing and building Minecraft Bedrock Edition addons. It includes a development server with hot-reload capabilities and multiple build format options.

## Features

- 🔄 **Development Server** - Watch mode with automatic file synchronization
- 📦 **Multiple Build Formats** - Export as `.zip`, `.mcpack`, or `.mcaddon`
- 🔌 **Script API Compilation** - Webpack-based bundling for Script API projects
- 📁 **Smart File Sync** - Automatic synchronization to Minecraft development folders
- 🔄 **Dependency Updates** - Update Script API packages to latest versions
- 🎯 **Environment Configuration** - `.env.local` support for custom paths

## Installation

This package is automatically installed as a peer dependency when creating a project with `create-mcbepack`.

```bash
bun add -D @mcbepack/cli
```

## Commands

### `mcbepack dev`

Start the development server with file watching and automatic synchronization.

```bash
bun run dev
# or
mcbepack dev
```

**Features:**

- Watches `scripts/` directory for changes
- Compiles TypeScript/JavaScript with Webpack
- Syncs compiled files to Minecraft development folder
- Provides real-time feedback on file changes

### `mcbepack build:zip`

Build the addon as a `.zip` archive.

```bash
bun run build:zip
# or
mcbepack build:zip
```

Creates a compressed archive containing all pack files, suitable for distribution or manual installation.

### `mcbepack build:mcpack`

Build the addon as a `.mcpack` file.

```bash
bun run build:mcpack
# or
mcbepack build:mcpack
```

Creates a Minecraft pack file that can be double-clicked to install directly into Minecraft.

### `mcbepack build:addon`

Build the addon as a `.mcaddon` file.

```bash
bun run build:addon
# or
mcbepack build:addon
```

Creates a Minecraft addon file containing both behavior and resource packs (if applicable).

### `mcbepack update:stable`

Update Script API dependencies to the latest stable release.

```bash
bun run update:stable
# or
mcbepack update:stable
```

### `mcbepack update:beta`

Update Script API dependencies to the latest beta release.

```bash
bun run update:beta
# or
mcbepack update:beta
```

### `mcbepack update:preview`

Update Script API dependencies to the latest preview release.

```bash
bun run update:preview
# or
mcbepack update:preview
```

## Configuration

### Environment Variables

Create a `.env.local` file in your project root:

```env
BASE_PATH="C:\Users\YourName\AppData\Roaming\Minecraft Bedrock\Users\Shared\games\com.mojang"
RESOURCE_PATH="development_resource_packs"
BEHAVIOR_PATH="development_behavior_packs"
```

**Variables:**

- `BASE_PATH` - Path to Minecraft's `com.mojang` directory
- `RESOURCE_PATH` - Relative path to resource packs folder
- `BEHAVIOR_PATH` - Relative path to behavior packs folder

### Project Structure

The CLI expects the following project structure:

```
your-project/
├── scripts/              # Source files (TypeScript/JavaScript)
│   └── index.ts
├── behavior/             # Auto-generated behavior pack (if applicable)
├── resource/             # Auto-generated resource pack (if applicable)
├── .env.local           # Environment configuration
└── package.json
```

## Development Workflow

1. **Start Development Server**

   ```bash
   bun run dev
   ```

2. **Edit Source Files**
   - Modify files in `scripts/` directory
   - Changes are automatically detected and compiled

3. **Test in Minecraft**
   - Files are synced to Minecraft's development folder
   - Reload the world or restart Minecraft to see changes

4. **Build for Distribution**
   ```bash
   bun run build:mcaddon
   ```

## Technical Details

### File Watching

The development server uses `chokidar` for efficient file watching:

- Monitors `scripts/` directory for changes
- Triggers recompilation on file add/change/delete
- Syncs compiled output to Minecraft folders

### Webpack Configuration

For Script API projects, the CLI uses Webpack with:

- TypeScript support via `ts-loader`
- ESNext target
- Bundler module resolution
- Source map generation (development only)

### Build Process

The build commands:

1. Compile source files (if Script API enabled)
2. Copy pack files to temporary directory
3. Create archive using `archiver`
4. Output to project root

## API

### Programmatic Usage

```typescript
import { devCommand, buildCommand, updateCommand } from "@mcbepack/cli";

// Use commands programmatically
```

## Dependencies

- `chokidar` - File watching
- `webpack` - Module bundling
- `ts-loader` - TypeScript compilation
- `archiver` - Archive creation
- `yargs` - Command-line parsing
- `dotenv` - Environment variable loading
- `picocolors` - Terminal colors

## Related Packages

- [`create-mcbepack`](../create-mcbepack) - Project scaffolding tool
- [`@mcbepack/api`](../api) - Utility APIs for Script API
- [`@mcbepack/common`](../common) - Shared utilities

## Troubleshooting

### Files Not Syncing

1. Check `.env.local` paths are correct
2. Ensure Minecraft development folders exist
3. Verify file permissions

### Compilation Errors

1. Check TypeScript configuration in `tsconfig.json`
2. Ensure all dependencies are installed
3. Verify source file syntax

### Build Failures

1. Check for file permission issues
2. Ensure sufficient disk space
3. Verify pack manifest files are valid

## License

GPL-3.0 - see [LICENSE](./LICENSE) for details

## Links

- [GitHub Repository](https://github.com/bugphxne/create-mcbepack)
- [Documentation](https://docs.mbext.online/mcbepack)
- [Issue Tracker](https://github.com/bugphxne/create-mcbepack/issues)
