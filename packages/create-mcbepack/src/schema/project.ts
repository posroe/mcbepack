import { z } from "zod";

import type { Version } from "@mcbepack/common";

import { ExtensionType, ReleaseChannel, ScriptLanguage } from "../constants/enums.js";

export const projectDependencySchema = z.object({
    packageName: z.string().min(1),
    version: z.custom<Version>(),
    fullVersion: z.string().min(1)
});

export const projectUuidsSchema = z.object({
    behavior: z.string().uuid(),
    resource: z.string().uuid(),
    scriptModule: z.string().uuid(),
    resourceModule: z.string().uuid()
});

export const scriptConfigSchema = z.object({
    enabled: z.boolean(),
    language: z.nativeEnum(ScriptLanguage),
    release: z.union([z.nativeEnum(ReleaseChannel), z.literal("")]),
    packages: z.array(z.string().min(1)),
    dependencies: z.array(projectDependencySchema)
});

export const projectConfigSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    author: z.string(),
    minimumEngineVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    extensions: z.array(z.nativeEnum(ExtensionType)).min(1),
    script: scriptConfigSchema.optional(),
    uuids: projectUuidsSchema
});

export type ProjectDependency = z.infer<typeof projectDependencySchema>;
export type ProjectUuids = z.infer<typeof projectUuidsSchema>;
export type ScriptConfig = z.infer<typeof scriptConfigSchema>;
export type ProjectConfig = z.infer<typeof projectConfigSchema>;
