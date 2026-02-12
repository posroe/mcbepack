# @mcbepack/common

Shared utilities and constants for MCBEPACK packages

[![npm version](https://badge.fury.io/js/create-mcbepack.svg)](https://www.npmjs.com/package/@mcbepack/common)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Overview

`@mcbepack/common` provides shared utilities, type definitions, and constants used across all MCBEPACK packages. This package ensures consistency and reduces code duplication throughout the monorepo.

## Features

- **Utility Functions** - Common helper functions
- **Type Definitions** - Shared TypeScript types
- **Constants** - Package names and configuration values
- **Environment Types** - Process environment type definitions

## Installation

This package is automatically installed as a dependency by other MCBEPACK packages.

```bash
bun add @mcbepack/common
```

## API Reference

### Constants

#### `packages`

Available Minecraft Script API packages.

```typescript
import { constants } from "@mcbepack/common";

console.log(constants.packages.modules);
// ['@minecraft/server', '@minecraft/server-ui', '@minecraft/server-net', ...]

console.log(constants.packages.plugins);
// ['@minecraft/vanilla-data', '@minecraft/math']
```

**Structure:**

```typescript
{
  modules: [
    '@minecraft/server',
    '@minecraft/server-ui',
    '@minecraft/server-net',
    '@minecraft/server-admin',
    '@minecraft/server-gametest'
  ],
  plugins: [
    '@minecraft/vanilla-data',
    '@minecraft/math'
  ]
}
```

### Utilities

#### `getDependency(packageName: string, release: string): Promise<DependencyInfo>`

Fetch dependency information for a Minecraft Script API package.

**Parameters:**

- `packageName` - Name of the package (e.g., `@minecraft/server`)
- `release` - Release channel (`stable`, `beta`, or `preview`)

**Returns:**

```typescript
{
  packageName: string;
  version: string;
  fullVersion: string;
}
```

**Example:**

```typescript
import { getDependency } from "@mcbepack/common";

const dep = await getDependency("@minecraft/server", "stable");
console.log(dep);
// {
//   packageName: "@minecraft/server",
//   version: "1.8.0",
//   fullVersion: "1.8.0-stable"
// }
```

### Types

#### `ProjectConfig`

Configuration for a MCBEPACK project.

```typescript
interface ProjectConfig {
  name: string;
  description: string;
  author: string;
  minimumEngineVersion: string;
  extensions: string[];
  uuids: {
    behavior: string;
    resource: string;
    scriptModule: string;
  };
  script?: {
    enabled: boolean;
    language: "typescript" | "javascript";
    release: "stable" | "beta" | "preview";
    packages: string[];
    dependencies: DependencyInfo[];
  };
}
```

#### `DependencyInfo`

Information about a Script API dependency.

```typescript
interface DependencyInfo {
  packageName: string;
  version: string;
  fullVersion: string;
}
```

#### `ManifestModule`

Minecraft manifest module definition.

```typescript
interface ManifestModule {
  type: string;
  uuid: string;
  version: [number, number, number];
  description?: string;
  entry?: string;
}
```

### Environment Variables

Type definitions for process environment variables:

```typescript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      BASE_PATH: string;
      RESOURCE_PATH: string;
      BEHAVIOR_PATH: string;
    }
  }
}
```

**Usage:**

```typescript
// TypeScript will provide autocomplete and type checking
const basePath = process.env.BASE_PATH;
const nodeEnv = process.env.NODE_ENV; // "development" | "production" | "test"
```

## Usage Examples

### Fetching Dependencies

```typescript
import { getDependency, constants } from "@mcbepack/common";

async function setupProject() {
  const dependencies = await Promise.all(
    constants.packages.modules.map((pkg) => getDependency(pkg, "stable")),
  );

  console.log("Dependencies:", dependencies);
}
```

### Using Constants

```typescript
import { constants } from "@mcbepack/common";

// List all available packages
const allPackages = [
  ...constants.packages.modules,
  ...constants.packages.plugins,
];

console.log("Available packages:", allPackages);
```

### Type Safety

```typescript
import type { ProjectConfig, DependencyInfo } from "@mcbepack/common";

const config: ProjectConfig = {
  name: "my-addon",
  description: "An awesome addon",
  author: "Developer",
  minimumEngineVersion: "1.21.0",
  extensions: ["behavior"],
  uuids: {
    behavior: "uuid-here",
    resource: "uuid-here",
    scriptModule: "uuid-here",
  },
  script: {
    enabled: true,
    language: "typescript",
    release: "stable",
    packages: ["@minecraft/server"],
    dependencies: [],
  },
};
```

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/bugphxne/create-mcbepack.git
cd mcbepack/packages/common

# Install dependencies
bun install

# Build
bun run build
```

### Project Structure

```
common/
├── src/
│   ├── index.ts          # Main exports
│   ├── constants.ts      # Package constants
│   ├── types.ts          # Type definitions
│   └── utils.ts          # Utility functions
└── bin/                  # Compiled output
```

## Dependencies

- `node-fetch` - HTTP requests for dependency fetching

## Related Packages

- [`create-mcbepack`](../create-mcbepack) - Project scaffolding tool
- [`@mcbepack/cli`](../cli) - Development and build tooling
- [`@mcbepack/api`](../api) - Utility APIs for Script API

## Contributing

This package is part of the MCBEPACK monorepo. When adding new shared functionality:

1. Ensure it is truly shared across multiple packages
2. Add comprehensive type definitions
3. Document all exports
4. Update this README

## License

GPL-3.0 - see [LICENSE](../../LICENSE) for details

## Resources

- [GitHub Repository](https://github.com/bugphxne/create-mcbepack)
- [Documentation](https://docs.mbext.online/mcbepack)
- [Issue Tracker](https://github.com/bugphxne/create-mcbepack/issues)
