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

GPL-3.0 - see [LICENSE](./LICENSE) for details

## Resources

- [GitHub Repository](https://github.com/bugphxne/create-mcbepack)
- [Documentation](https://docs.mbext.online/mcbepack)
- [Issue Tracker](https://github.com/bugphxne/create-mcbepack/issues)
