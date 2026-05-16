# create-mcbepack

Interactive scaffolder for Minecraft Bedrock Edition add-on projects.

It creates the pack folders, manifests, optional Script API entry point, package scripts, and Minecraft development-path configuration expected by `@mcbepack/cli`.

## Usage

```bash
bunx create-mcbepack
```

The prompts ask for:

- behavior pack and/or resource pack
- project name, description, author, and minimum engine version
- optional Script API support
- TypeScript or JavaScript
- stable, beta, or preview Script API release channel
- Minecraft package modules to include

## Generated Scripts

Script API projects include:

```json
{
  "scripts": {
    "dev": "mcbepack dev",
    "build": "mcbepack build",
    "build:zip": "mcbepack build zip",
    "build:mcpack": "mcbepack build mcpack",
    "build:mcaddon": "mcbepack build mcaddon",
    "update:stable": "mcbepack update -t stable",
    "update:beta": "mcbepack update -t beta",
    "update:preview": "mcbepack update -t preview"
  }
}
```

Non-script projects include the build command and the three archive commands.

## Generated Layout

```text
my-addon/
|-- scripts/
|   `-- index.ts
|-- src/
|   |-- behavior_pack/
|   |   |-- manifest.json
|   |   `-- pack_icon.png
|   `-- resource_pack/
|       |-- manifest.json
|       `-- pack_icon.png
|-- .env.local
|-- .gitignore
|-- package.json
|-- README.md
`-- tsconfig.json
```

Some files are only created when the selected options need them.

## Local Development

From the repository root:

```bash
bun install
bun --cwd packages/create-mcbepack run build
```

## Related Packages

- [`@mcbepack/cli`](../@mcbepack/cli)
- [`@mcbepack/api`](../@mcbepack/api)
- [`@mcbepack/common`](../@mcbepack/common)

## License

GPL-3.0. See [LICENSE](./LICENSE).
