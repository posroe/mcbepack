import { z } from "zod";

import type { Version } from "@mcbepack/common";

import { ExtensionType, FileCreateType, PackageManagerName, ReleaseChannel, ScriptLanguage } from "./constants.js";

export const fileToCreateSchema = z.object({
    path: z.string().min(1),
    content: z.union([z.string(), z.instanceof(Buffer)]),
    type: z.nativeEnum(FileCreateType),
    source: z.string().min(1).optional()
});

export type FileToCreate = z.infer<typeof fileToCreateSchema>;

export const managerSchema = z.object({
    name: z.nativeEnum(PackageManagerName)
});

export type PackageManager = z.infer<typeof managerSchema>;

export const projectDependencySchema = z.object({
    packageName: z.string().min(1),
    version: z.custom<Version>(),
    fullVersion: z.string().min(1)
});

export type ProjectDependency = z.infer<typeof projectDependencySchema>;

export const projectUuidsSchema = z.object({
    behavior: z.string().uuid(),
    resource: z.string().uuid(),
    scriptModule: z.string().uuid(),
    resourceModule: z.string().uuid()
});

export type ProjectUuids = z.infer<typeof projectUuidsSchema>;

export const scriptConfigSchema = z.object({
    enabled: z.boolean(),
    language: z.nativeEnum(ScriptLanguage),
    release: z.union([z.nativeEnum(ReleaseChannel), z.literal("")]),
    packages: z.array(z.string().min(1)),
    dependencies: z.array(projectDependencySchema)
});

export type ScriptConfig = z.infer<typeof scriptConfigSchema>;

export const projectConfigSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    author: z.string(),
    minimumEngineVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    extensions: z.array(z.nativeEnum(ExtensionType)).min(1),
    script: scriptConfigSchema.optional(),
    uuids: projectUuidsSchema
});

export type ProjectConfig = z.infer<typeof projectConfigSchema>;
