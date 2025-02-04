import { z } from "zod";

export const assignmentRuleFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  criteria: z.record(z.any()),
  priority: z.number().min(0),
  is_active: z.boolean(),
});

export type AssignmentRuleFormValues = z.infer<typeof assignmentRuleFormSchema>;