# create-mcbepack

Interactive CLI tool for scaffolding MCBEPACK projects

[![npm version](https://badge.fury.io/js/create-mcbepack.svg)](https://www.npmjs.com/package/create-mcbepack)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Overview

`create-mcbepack` is an interactive command-line tool that facilitates rapid scaffolding of Minecraft Bedrock Edition addon projects with best practices and modern development tooling.

## Features

- **Interactive Project Setup** - Guided prompts for project configuration
- **Multiple Pack Types** - Support for Behavior Packs and Resource Packs
- **Script API Integration** - Optional Script API setup with package selection
- **Language Choice** - TypeScript or JavaScript support
- **Release Channel Selection** - Choose between stable, beta, or preview releases
- **Auto-generated Configuration** - Automatic manifest, package.json, and tsconfig generation
- **Project Templates** - Pre-configured templates with best practices

## Usage

### Quick Start

```bash
bunx create-mcbepack
```

### Interactive Prompts

The CLI will guide you through the following steps:

1. **Pack Type Selection**
   - Choose between Behavior Pack and/or Resource Pack

2. **Project Information**
   - Project name
   - Description
   - Author name(s)
   - Minimum engine version

3. **Script API Configuration** (if Behavior Pack is selected)
   - Enable/disable Script API
   - Select programming language (TypeScript/JavaScript)
   - Choose game release channel (stable/beta/preview)
   - Select Script API packages to include:
     - `@minecraft/server`
     - `@minecraft/server-ui`
     - `@minecraft/server-net`
     - `@minecraft/server-admin`
     - `@minecraft/server-gametest`
     - `@minecraft/vanilla-data`
     - `@minecraft/math`

4. **Project Preview**
   - Review generated file structure
   - Confirm project creation

### Example

```bash
$ bunx create-mcbepack

Create MCBEPack

? Select a extension type?
  ◉ Behavior Pack
  ◉ Resource Pack

? What is the name of the project? my-awesome-addon
? What is the description of the project? An amazing Minecraft addon
? What is the author's name? YourName
? What is the minimum engine version required? 1.21.0

? Do you want to add a script api to behavior? Yes
? Which language do you want to use? typescript
? What game type would you like to use? stable
? Which packages would you like to add?
  ◉ @minecraft/server
  ◉ @minecraft/server-ui

Success! Created project my-awesome-addon
   at: /path/to/my-awesome-addon

Next steps:

  1. cd my-awesome-addon
  2. bun install
  3. bun run dev

Available commands:
   • bun run dev    - Start development server
   • bun run build:zip  - Build project
   • bun run build:mcpack  - Build project
   • bun run build:addon  - Build project
```

## Generated Project Structure

```
my-awesome-addon/
├── scripts/              # TypeScript/JavaScript source files (if Script API enabled)
│   └── index.ts
├── .env.local           # Minecraft path configuration
├── .gitignore
├── package.json
├── tsconfig.json        # TypeScript configuration (if TypeScript selected)
├── pack_icon.png
└── README.md
```

## Configuration Files

### package.json

Automatically generated with:

- Project metadata
- Script API dependencies (if enabled)
- Development scripts
- Peer dependencies (`@mcbepack/cli`, `@mcbepack/api`)

### tsconfig.json

Pre-configured TypeScript settings optimized for Minecraft addon development:

- ESNext target
- Bundler module resolution
- Source maps disabled for production

### .env.local

Minecraft installation paths configuration:

```env
BASE_PATH="C:\Users\YourName\AppData\Roaming\Minecraft Bedrock\Users\Shared\games\com.mojang"
RESOURCE_PATH="development_resource_packs"
BEHAVIOR_PATH="development_behavior_packs"
```

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/bugphxne/create-mcbepack.git
cd mcbepack/packages/create-mcbepack

# Install dependencies
bun install

# Build
bun run build

# Test locally
bun run test
```

### Project Structure

```
create-mcbepack/
├── src/
│   ├── index.ts          # Main CLI entry point
│   ├── prompt.ts         # Interactive prompts
│   ├── types.ts          # TypeScript type definitions
│   └── utils/
│       ├── collect-info.ts    # Project information collection
│       ├── create-files.ts    # File generation
│       └── generate-files.ts  # File list generation
├── templates/            # Project templates
│   ├── README.md
│   ├── tsconfig.json
│   ├── .env.local
│   ├── .gitignore
│   └── pack_icon.png
└── bin/                  # Compiled output
```

## Related Packages

- [`@mcbepack/cli`](../cli) - Development and build tooling
- [`@mcbepack/api`](../api) - Utility APIs for Script API
- [`@mcbepack/common`](../common) - Shared utilities

## License

GPL-3.0 - see [LICENSE](../../LICENSE) for details

## Resources

- [GitHub Repository](https://github.com/bugphxne/create-mcbepack)
- [npm Package](https://www.npmjs.com/package/create-mcbepack)
- [Documentation](https://docs.mbext.online/mcbepack)
- [Issue Tracker](https://github.com/bugphxne/create-mcbepack/issues)
