import path from "node:path";

import pc from "picocolors";

const symbol = {
    app: pc.cyan(">"),
    wait: pc.cyan("wait"),
    ready: pc.green("ready"),
    warn: pc.yellow("warn"),
    error: pc.red("error"),
    info: pc.dim("-")
};

export function formatDuration(ms: number): string {
    if (ms < 1000) {
        return `${ms}ms`;
    }

    return `${(ms / 1000).toFixed(1)}s`;
}

export function formatPath(filePath: string): string {
    const relativePath = path.relative(process.cwd(), filePath);
    return relativePath && !relativePath.startsWith("..") ? relativePath : filePath;
}

export const log = {
    banner(name: string, version?: string): void {
        const versionText = version ? pc.dim(` ${version}`) : "";
        console.log(`\n  ${symbol.app} ${pc.bold(name)}${versionText}`);
    },
    detail(label: string, value: string): void {
        console.log(`  ${symbol.info} ${pc.dim(label)} ${value}`);
    },
    wait(message: string): void {
        console.log(`\n  ${symbol.wait} ${message}`);
    },
    ready(message: string): void {
        console.log(`  ${symbol.ready} ${message}`);
    },
    warn(message: string): void {
        console.error(`\n  ${symbol.warn} ${pc.yellow(message)}`);
    },
    error(message: string): void {
        console.error(`\n  ${symbol.error} ${pc.red(message)}`);
    }
};
