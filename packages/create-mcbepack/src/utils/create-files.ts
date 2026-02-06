import fs from "node:fs";
import path from "node:path";
import pc from "picocolors";
import { FileToCreate } from "../types";

export function createFiles(files: FileToCreate[]): void {
    console.log(`\nCreating ${files.length} files...\n`);

    for (const file of files) {
        try {

            const dir = path.dirname(file.path);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            if (file.type === "copy" && file.source) {
                fs.copyFileSync(file.source, file.path);
            } else {
                fs.writeFileSync(file.path, file.content);
            }

            console.log(`  ${pc.green("✓")} ${path.relative(process.cwd(), file.path)}`);
        } catch (error) {
            console.error(`  ${pc.red("✗")} ${path.relative(process.cwd(), file.path)}`);
            throw error;
        }
    }
}

export function previewFiles(files: FileToCreate[], projectName: string): void {
    console.log(`\nFiles to be created in ${pc.cyan(projectName)}:\n`);

    const projectRoot = path.join(process.cwd(), projectName);
    const tree = buildFileTree(files, projectRoot);
    printTree(tree);
}

interface TreeNode {
    name: string;
    type: "file" | "directory";
    children?: Map<string, TreeNode>;
}

function buildFileTree(files: FileToCreate[], projectRoot: string): TreeNode {
    const root: TreeNode = {
        name: path.basename(projectRoot),
        type: "directory",
        children: new Map(),
    };

    for (const file of files) {
        const relativePath = path.relative(projectRoot, file.path);
        const parts = relativePath.split(path.sep);

        let current = root;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLast = i === parts.length - 1;

            if (!current.children) {
                current.children = new Map();
            }

            if (!current.children.has(part)) {
                current.children.set(part, {
                    name: part,
                    type: isLast ? "file" : "directory",
                    children: isLast ? undefined : new Map(),
                });
            }

            current = current.children.get(part)!;
        }
    }

    return root;
}

function printTree(node: TreeNode, prefix: string = "", isLast: boolean = true): void {
    const connector = isLast ? "└── " : "├── ";

    if (prefix === "") {
        console.log(`  ${pc.cyan(node.name)}/`);
    } else {
        const displayName = node.type === "directory" ? `${pc.cyan(node.name)}/` : node.name;
        console.log(`  ${prefix}${connector}${displayName}`);
    }

    if (node.children) {
        const children = Array.from(node.children.values());
        children.forEach((child, index) => {
            const isLastChild = index === children.length - 1;
            const newPrefix = prefix + (isLast ? "    " : "│   ");
            printTree(child, newPrefix, isLastChild);
        });
    }
}
