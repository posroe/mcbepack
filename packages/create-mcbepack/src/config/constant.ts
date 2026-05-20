import path from "node:path";
import { fileURLToPath } from "node:url";

import { Extension } from "./enum.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const SCRIPTS_BASE = [
    { name: "export:zip", cmd: "mcbepack export zip", desc: "Export .zip" },
    { name: "export:mcpack", cmd: "mcbepack export mcpack", desc: "Export .mcpack" },
    { name: "export:mcaddon", cmd: "mcbepack export mcaddon", desc: "Export .mcaddon" },
] as const;

export const SCRIPTS_SCRIPT_API = [
    { name: "dev", cmd: "mcbepack dev", desc: "Dev server" },
    { name: "build", cmd: "mcbepack build", desc: "Build" },
    { name: "update:stable", cmd: "mcbepack update stable", desc: "Update stable" },
    { name: "update:beta", cmd: "mcbepack update beta", desc: "Update beta" },
    { name: "update:preview", cmd: "mcbepack update preview", desc: "Update preview" },
] as const;

export const DIRECTORIES = {
    template: path.join(__dirname, "..", "templates"),
    [Extension.Behavior]: path.join(__dirname, "..", "templates", "behavior_pack"),
    [Extension.Resource]: path.join(__dirname, "..", "templates", "resource_pack"),
} as const;