import { SCRIPTS_BASE, SCRIPTS_SCRIPT_API } from "../config/constant.js";
import type { Context } from "../prompts.js";

export function buildReadme(context: Context): string {
    const pm = context.packageManager;
    const scripts = context.script?.enabled
        ? [...SCRIPTS_SCRIPT_API, ...SCRIPTS_BASE]
        : [...SCRIPTS_BASE];

    const cmds = scripts.map((s) => `${pm} run ${s.name.padEnd(16)} # ${s.desc}`).join("\n");

    return `# ${context.name}

${context.description}

> Generated with \`create-mcbepack\`

## Commands

\`\`\`bash
${cmds}
\`\`\`
`;
}