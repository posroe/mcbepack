import { z } from "zod";

import { PackageManagerName } from "../constants/enums.js";

export const managerSchema = z.object({
    name: z.nativeEnum(PackageManagerName)
});

export type PackageManager = z.infer<typeof managerSchema>;
