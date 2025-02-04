import { z } from "zod";
import { staffDetailsSchema } from "./schema";

export type StaffDetailsFormValues = z.infer<typeof staffDetailsSchema>;