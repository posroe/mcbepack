import { z } from "zod";

import { PackageManagerName } from "../constants/create-options.js";

export const packageManagerSchema = z.object({
    name: z.nativeEnum(PackageManagerName)
});

export type PackageManager = z.infer<typeof packageManagerSchema>;
