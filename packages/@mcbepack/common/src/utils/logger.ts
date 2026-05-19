import path from "node:path";

import chalk from "chalk";

type LogStatus = "ready" | "wait" | "warn" | "error" | "info" | "update" | "keep";
type LogStream = typeof process.stdout | typeof process.stderr;

const statusLabel: Record<LogStatus, string> = {
    ready: chalk.green("✓"),
    wait: chalk.cyan("○"),
    warn: chalk.yellow("⚠"),
    error: chalk.red("⨯"),
    info: chalk.dim("-"),
    update: chalk.green("✓"),
    keep: chalk.dim("·")
};

export function formatDuration(ms: number): string {
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

export function formatPath(filePath: string): string {
    const relativePath = path.relative(process.cwd(), filePath);
    return relativePath && !relativePath.startsWith("..") ? relativePath : filePath;
}

export const color = chalk;

function line(status: LogStatus, message: string): string {
    return `  ${statusLabel[status]} ${message}`;
}

function plain(message: string): string {
    return `  ${message}`;
}

function write(stream: LogStream, status: LogStatus, message: string, options: { before?: boolean; after?: boolean } = {}): void {
    const lines = message.split(/\r?\n/);
    const outputLines = lines.at(-1) === "" ? lines.slice(0, -1) : lines;

    if (options.before) {
        stream.write("\n");
    }

    for (const outputLine of outputLines) {
        stream.write(`${line(status, outputLine)}\n`);
    }

    if (options.after) {
        stream.write("\n");
    }
}

function writePlain(stream: LogStream, message: string, options: { before?: boolean; after?: boolean } = {}): void {
    const lines = message.split(/\r?\n/);
    const outputLines = lines.at(-1) === "" ? lines.slice(0, -1) : lines;

    if (options.before) {
        stream.write("\n");
    }

    for (const outputLine of outputLines) {
        stream.write(`${plain(outputLine)}\n`);
    }

    if (options.after) {
        stream.write("\n");
    }
}

export const logger = {
    logo(): void {
        const orange = chalk.hex("#ff6200");
        const light = chalk.whiteBright;
        const row = (cells: boolean[]) => cells
            .map((cell) => cell ? orange("██") : light("██"))
            .join("");

        process.stdout.write([
            "",
            `  ${row([true, true, true, true, true])}`,
            `  ${row([true, false, false, false, true])}`,
            `  ${row([true, false, true, false, true])}`,
            `  ${row([true, false, true, false, true])}`,
            `  ${row([true, false, true, true, true])}`,
            "",
            ""
        ].join("\n"));
    },
    header(name: string, version?: string): void {
        const versionText = version ? chalk.dim(` ${version}`) : "";
        writePlain(process.stdout, `${chalk.green("◼")} ${chalk.bold(name)}${versionText}`);
    },
    field(label: string, value: string): void {
        writePlain(process.stdout, `${chalk.dim("-")} ${chalk.dim(label)} ${value}`);
    },
    section(message: string): void {
        writePlain(process.stdout, chalk.bold(message), { before: true });
    },
    item(message: string): void {
        writePlain(process.stdout, message);
    },
    blank(): void {
        process.stdout.write("\n");
    },
    step(message: string): void {
        write(process.stdout, "wait", message, { before: true });
    },
    success(message: string): void {
        write(process.stdout, "ready", message);
    },
    info(message: string): void {
        write(process.stdout, "info", chalk.dim(message));
    },
    warn(message: string): void {
        write(process.stderr, "warn", chalk.yellow(message), { before: true });
    },
    error(message: string): void {
        write(process.stderr, "error", chalk.red(message), { before: true });
    },
    warningBlock(message: string): void {
        writePlain(process.stderr, message);
    },
    errorBlock(message: string): void {
        writePlain(process.stderr, message);
    },
    done(message: string): void {
        write(process.stdout, "ready", chalk.green(message), { before: true, after: true });
    },
    change(name: string, from: string, to: string): void {
        write(process.stdout, "update", `${chalk.bold(name)} ${chalk.dim(`${from} -> ${chalk.white(to)}`)}`);
    },
    current(name: string, version: string): void {
        write(process.stdout, "keep", `${chalk.bold(name)} ${chalk.dim(`already up to date (${version})`)}`);
    }
};
