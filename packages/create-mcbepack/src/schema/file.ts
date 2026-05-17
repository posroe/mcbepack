import { z } from "zod";

import { FileCreateType } from "../lib/enums.js";

export const fileToCreateSchema = z.object({
    path: z.string().min(1),
    content: z.union([z.string(), z.instanceof(Buffer)]),
    type: z.nativeEnum(FileCreateType),
    source: z.string().min(1).optional()
});

export type FileToCreate = z.infer<typeof fileToCreateSchema>;
