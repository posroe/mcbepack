# MCBEPACK

> A modern development toolkit for Minecraft Bedrock Edition addons

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![npm version](https://badge.fury.io/js/create-mcbepack.svg)](https://www.npmjs.com/package/create-mcbepack)

MCBEPACK is a comprehensive toolkit designed to streamline Minecraft Bedrock Edition addon development. It provides a modern development experience with TypeScript/JavaScript support, hot-reload capabilities, and seamless integration with Minecraft's Script API.

## ✨ Features

- 🚀 **Quick Project Scaffolding** - Create new projects in seconds with `create-mcbepack`
- 🔄 **Hot Reload Development** - Automatic file synchronization during development
- 📦 **Multiple Build Formats** - Export as `.zip`, `.mcpack`, or `.mcaddon`
- 🎯 **Full TypeScript Support** - Complete type definitions for Minecraft Script API
- 🔌 **Script API Integration** - Seamless integration with Minecraft's official Script API
- 🛠️ **Utility Libraries** - Built-in Database and Scoreboard helpers
- 📚 **Monorepo Architecture** - Well-organized package structure for maintainability

## 📦 Packages

This monorepo contains the following packages:

| Package                                         | Description                           | Version |
| ----------------------------------------------- | ------------------------------------- | ------- |
| [`create-mcbepack`](./packages/create-mcbepack) | CLI tool for scaffolding new projects | -       |
| [`@mcbepack/cli`](./packages/cli)               | Development and build tooling         | -       |
| [`@mcbepack/api`](./packages/api)               | Utility APIs for Script API           | -       |
| [`@mcbepack/common`](./packages/common)         | Shared utilities and constants        | -       |

### create-mcbepack

Interactive CLI tool for creating new MCBEPACK projects with customizable configurations.

```bash
bunx create-mcbepack
```

### @mcbepack/cli

Command-line interface for managing MCBEPACK projects.

**Available Commands:**

- `mcbepack dev` - Start development server with file watching
- `mcbepack build:zip` - Build addon as `.zip` archive
- `mcbepack build:mcpack` - Build addon as `.mcpack` file
- `mcbepack build:addon` - Build addon as `.mcaddon` file
- `mcbepack update:stable` - Update dependencies to stable release
- `mcbepack update:beta` - Update dependencies to beta release
- `mcbepack update:preview` - Update dependencies to preview release

### @mcbepack/api

Utility library providing convenient wrappers for Minecraft Script API functionality.

**Features:**

- `Database` - Persistent data storage using Dynamic Properties
- `Scoreboard` - Simplified scoreboard management

**Example:**

```typescript
import { Database } from "@mcbepack/api";

const db = new Database("playerData");
db.set("player123", { score: 100, level: 5 });
const data = db.get("player123");
```

### @mcbepack/common

Shared utilities, types, and constants used across all MCBEPACK packages.

## 🚀 Quick Start

### Creating a New Project

```bash
bunx create-mcbepack
```

The interactive CLI will guide you through:

1. Selecting pack types (Behavior Pack / Resource Pack)
2. Entering project metadata (name, description, author, version)
3. Choosing whether to use Script API
4. Selecting programming language (TypeScript / JavaScript)
5. Choosing game release channel (stable / beta / preview)
6. Selecting Script API packages to include

### Development Workflow

```bash
cd your-project-name
bun install
bun run dev
```

The development server will:

- Watch for file changes in your source directory
- Automatically compile TypeScript/JavaScript
- Sync changes to Minecraft's development folder
- Provide real-time feedback

### Building for Distribution

```bash
# Build as ZIP archive
bun run build:zip

# Build as MCPACK (single pack)
bun run build:mcpack

# Build as MCADDON (multiple packs)
bun run build:addon
```

## 🛠️ Development

### Prerequisites

- [Bun](https://bun.sh) v1.0 or higher
- Minecraft Bedrock Edition

### Setting Up the Monorepo

```bash
# Clone the repository
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

### Development Workflow

Each package can be developed independently:

```bash
# Watch mode for specific package
cd packages/cli
bun run dev
```

### Project Structure

```
mcbepack/
├── packages/
│   ├── create-mcbepack/    # Project scaffolding CLI
│   │   ├── src/           # Source code
│   │   ├── templates/     # Project templates
│   │   └── bin/           # Compiled CLI executable
│   ├── cli/               # Development and build tools
│   │   ├── src/           # Source code
│   │   └── bin/           # Compiled executables
│   ├── api/               # Utility APIs
│   │   ├── src/           # Source code
│   │   └── bin/           # Compiled library
│   └── common/            # Shared utilities
│       ├── src/           # Source code
│       └── bin/           # Compiled library
├── package.json           # Root package configuration
└── LICENSE               # GPL-3.0 License
```

## 📝 Configuration

Projects created with `create-mcbepack` include a `.env.local` file for configuring Minecraft paths:

```env
BASE_PATH="C:\Users\YourName\AppData\Roaming\Minecraft Bedrock\Users\Shared\games\com.mojang"
RESOURCE_PATH="development_resource_packs"
BEHAVIOR_PATH="development_behavior_packs"
```

Adjust these paths according to your Minecraft installation location.

## 📚 Documentation

- [MCBEPACK Documentation](https://docs.mbext.online/mcbepack) - Comprehensive guides and API reference
- [Minecraft Script API Documentation](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/) - Official Minecraft Script API docs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](./LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/bugphxne/create-mcbepack)
- [npm Package](https://npmjs.com/package/create-mcbepack)
- [Documentation](https://docs.mbext.online/mcbepack)
- [Issue Tracker](https://github.com/bugphxne/create-mcbepack/issues)

## 💡 Support

For questions, issues, or feature requests:

- Open an issue on [GitHub](https://github.com/bugphxne/create-mcbepack/issues)
- Consult the [documentation](https://docs.mbext.online/mcbepack)
- Check existing issues for solutions

## 🙏 Acknowledgments

Built for the Minecraft Bedrock Edition community with ❤️

---

**Note:** This project is not affiliated with or endorsed by Mojang Studios or Microsoft.
