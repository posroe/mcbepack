import type { ProjectConfig } from "../lib/types.js";

export function generateProjectReadme(config: ProjectConfig): string {
    return `# ${config.name}

${config.description}

Generated with \`create-mcbepack\`.

## Commands

\`\`\`bash
${config.script?.enabled ? "bun run dev\nbun run build\n" : ""}bun run export:zip
bun run export:mcpack
bun run export:mcaddon
\`\`\`
`;
}
