import { z } from "zod";

import type { Version } from "@mcbepack/common";

import { Extension, PackageManagerName, Release, ScriptLanguage } from "./enum.js";

const fileDestinationSchema = z.object({
    directory: z.string().min(1),
    path: z.string().min(1),
    name: z.string().min(1),
    extension: z.string(),
});

export const projectFileDescriptorSchema = z.discriminatedUnion("action", [
    fileDestinationSchema.extend({
        action: z.literal("create"),
        content: z.union([z.string(), z.instanceof(Buffer)])
    }),
    fileDestinationSchema.extend({
        action: z.literal("copy"),
        source: z.string().min(1)
    })
]);

export type ProjectFileDescriptor = z.infer<typeof projectFileDescriptorSchema>;

export const fileToCreateSchema = projectFileDescriptorSchema;
export type FileToCreate = ProjectFileDescriptor;

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
    release: z.union([z.nativeEnum(Release), z.literal("")]),
    packages: z.array(z.string().min(1)),
    dependencies: z.array(projectDependencySchema)
});

export type ScriptConfig = z.infer<typeof scriptConfigSchema>;

export const projectConfigSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    author: z.string(),
    minimumEngineVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    extensions: z.array(z.nativeEnum(Extension)).min(1),
    script: scriptConfigSchema.optional(),
    uuids: projectUuidsSchema
});

export type ProjectConfig = z.infer<typeof projectConfigSchema>;
