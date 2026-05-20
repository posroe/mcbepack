import { getReadmeScripts, PROJECT_FILES } from "../config/constants.js";
import type { GenerationContext } from "../config/context.js";
import type { ProjectFileDescriptor } from "../config/schema.js";
import { createFile } from "./file-factory.js";

export function generateProjectReadme(context: GenerationContext): string {
    const commands = getReadmeScripts(context);

    return `# ${context.config.name}

${context.config.description}

Generated with \`create-mcbepack\`.

## Commands

\`\`\`bash
${commands.map((command) => `${context.packageManager.name} run ${command.name}`).join("\n")}
\`\`\`
`;
}

export function generateReadmeFile(context: GenerationContext): ProjectFileDescriptor {
    return createFile({
        directory: context.projectRoot,
        name: PROJECT_FILES.readme,
        action: "create",
        content: generateProjectReadme(context),
    });
}
