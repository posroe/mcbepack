This is a **MCBEPACK** project bootstrapped with [`create-mcbepack`](https://npmjs.com/package/create-mcbepack)

## Getting Started

First, install dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun run dev
```

You can start editing your addon by modifying files in the `src` directory. The development server will automatically watch for changes and sync them to your Minecraft development folder.

## Available Commands

### For general development

- **`bun run build:zip`** - Build the addon as a .zip file
- **`bun run build:mcpack`** - Build the addon as a .mcpack file
- **`bun run build:addon`** - Build the addon as a .mcaddon file

### For script development

- **`bun run dev`** - Start development server with file watching
- **`bun run update:stable`** - Update the addon to the latest stable version
- **`bun run update:beta`** - Update the addon to the latest beta version
- **`bun run update:preview`** - Update the addon to the latest preview version

## Development

Edit your addon code in the `scripts` directory. The development server will automatically:

- Compile TypeScript/JavaScript code
- Sync changes to the Minecraft development folder
- Watch for file changes and rebuild automatically

### Configuration

Update `.env.local` to configure your Minecraft installation paths:

```env
BASE_PATH="C:\Users\YourName\AppData\Roaming\Minecraft Bedrock\Users\Shared\games\com.mojang"
RESOURCE_PATH="development_resource_packs"
BEHAVIOR_PATH="development_behavior_packs"
```

## Learn More

To learn more about MCBEPACK, take a look at the following resources:

- [MCBEPACK Documentation](https://mcbepack.roverdosh.studio) - learn about MCBEPACK features and API
- [MCBEPACK GitHub Repository](https://github.com/posroe/create-mcbepack) - your feedback and contributions are welcome!
