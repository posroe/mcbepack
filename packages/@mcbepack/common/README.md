# @mcbepack/common

Shared TypeScript types, constants, and package-version helpers used by the MCBEPACK workspace.

Most users do not need to install this package directly. It is consumed by `create-mcbepack` and `@mcbepack/cli`.

## Exports

- `constants.packages.modules` - Minecraft Script API module package names
- `constants.packages.plugins` - supported helper/data package names
- `getVersions(packageName)` - fetches available versions from npm
- `getDependency(packageName, release)` - resolves a stable, beta, or preview dependency version
- Manifest and version types used by generated packs

## Install

```bash
bun add @mcbepack/common
```

## Related Packages

- [`create-mcbepack`](../../create-mcbepack)
- [`@mcbepack/cli`](../cli)
- [`@mcbepack/api`](../api)

## License

GPL-3.0. See [LICENSE](./LICENSE).
