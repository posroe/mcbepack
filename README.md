# MCBEPACK

A comprehensive development toolkit for Minecraft Bedrock Edition addon development.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub release (latest by date)](https://img.shields.io/github/downloads/bugphxne/mcbepack-workspaces/total)](https://github.com/bugphxne/mcbepack-workspaces/releases)

## Overview

MCBEPACK is a professional-grade toolkit designed to streamline the development workflow for Minecraft Bedrock Edition addons. The toolkit provides a modern development environment with comprehensive TypeScript support, automated build processes, and seamless integration with Minecraft's Script API.

## Core Features

- **Rapid Project Initialization** - Automated project scaffolding with customizable configurations
- **Development Server** - Real-time file synchronization and hot-reload capabilities
- **Multiple Build Formats** - Support for `.zip`, `.mcpack`, and `.mcaddon` distribution formats
- **TypeScript Support** - Complete type definitions for Minecraft Script API
- **Script API Integration** - Native integration with Minecraft's official Script API
- **Utility Libraries** - Pre-built Database and Scoreboard management utilities
- **Monorepo Architecture** - Modular package structure for enhanced maintainability

## Package Structure

This repository is organized as a monorepo containing the following packages:

| Package                                         | Description                   | Version |
| ----------------------------------------------- | ----------------------------- | ------- |
| [`create-mcbepack`](./packages/create-mcbepack) | Project scaffolding CLI tool  | -       |
| [`@mcbepack/cli`](./packages/cli)               | Development and build tooling | -       |
| [`@mcbepack/api`](./packages/api)               | Script API utility library    | -       |
| [`@mcbepack/common`](./packages/common)         | Shared utilities and types    | -       |

### create-mcbepack

Interactive command-line interface for initializing new MCBEPACK projects with customizable configurations.

```bash
bunx create-mcbepack
```

### @mcbepack/cli

Command-line interface providing development and build management capabilities.

**Available Commands:**

- `mcbepack dev` - Initialize development server with file watching
- `mcbepack build -o zip` - Generate addon as `.zip` archive
- `mcbepack build -o mcpack` - Generate addon as `.mcpack` file
- `mcbepack build -o mcaddon` - Generate addon as `.mcaddon` file
- `mcbepack update -t stable` - Update dependencies to stable release channel
- `mcbepack update -t beta` - Update dependencies to beta release channel
- `mcbepack update -t preview` - Update dependencies to preview release channel

### @mcbepack/api

Utility library providing convenient abstractions for Minecraft Script API functionality.

**Available Utilities:**

- `Database` - Persistent data storage implementation using Dynamic Properties
- `Scoreboard` - Simplified scoreboard management interface

### @mcbepack/common

Shared utilities, type definitions, and constants utilized across all MCBEPACK packages.

## Installation and Usage

### Project Initialization

```bash
bunx create-mcbepack
```

The interactive CLI will guide you through the following configuration steps:

1. Pack type selection (Behavior Pack / Resource Pack)
2. Project metadata configuration (name, description, author, version)
3. Script API integration selection
4. Programming language selection (TypeScript / JavaScript)
5. Game release channel selection (stable / beta / preview)
6. Script API package selection

### Development Workflow

```bash
cd your-project-name
bun install
bun run dev
```

The development server provides the following capabilities:

- Automated file change detection in source directories
- Real-time TypeScript/JavaScript compilation
- Automatic synchronization to Minecraft's development directory
- Immediate feedback on compilation status

### Production Build

```bash
# Generate ZIP archive
bun run build:zip

# Generate MCPACK (single pack)
bun run build:mcpack

# Generate MCADDON (multiple packs)
bun run build:addon
```

## Development

### System Requirements

- [Bun](https://bun.sh) v1.0 or higher
- Minecraft Bedrock Edition

### Repository Setup

```bash
# Clone repository
git clone https://github.com/bugphxne/create-mcbepack.git
cd mcbepack

# Install dependencies
bun install

# Build all packages
cd packages/create-mcbepack && bun run build
cd ../cli && bun run build
cd ../api && bun run build
cd ../common && bun run build
```

### Package Development

Individual packages can be developed independently:

```bash
# Watch mode for specific package
cd packages/cli
bun run dev
```

## Configuration

Projects generated with `create-mcbepack` include a `.env.local` file for Minecraft path configuration:

```env
BASE_PATH="C:\Users\YourName\AppData\Roaming\Minecraft Bedrock\Users\Shared\games\com.mojang"
RESOURCE_PATH="development_resource_packs"
BEHAVIOR_PATH="development_behavior_packs"
```

Adjust these paths according to your Minecraft installation location.

## Documentation

- [MCBEPACK Documentation](https://docs.mbext.online/mcbepack) - Comprehensive guides and API reference
- [Minecraft Script API Documentation](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/) - Official Minecraft Script API documentation

## Contributing

Contributions are welcome. Please follow the guidelines below:

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/feature-name`)
3. Commit your changes (`git commit -m 'Add feature description'`)
4. Push to the branch (`git push origin feature/feature-name`)
5. Submit a Pull Request

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](./LICENSE) file for complete details.

## Support

For questions, issues, or feature requests:

- Submit an issue on [GitHub](https://github.com/bugphxne/create-mcbepack/issues)
- Consult the [documentation](https://docs.mbext.online/mcbepack)
- Review existing issues for solutions

## Acknowledgments

Developed for the Minecraft Bedrock Edition community.

## Disclaimer

This project is not affiliated with or endorsed by Mojang Studios or Microsoft Corporation.
