import { z } from "zod";

export const assignmentRuleFormSchema = z.object({
  training_name: z.string().min(1, "Training name is required"),
  description: z.string().optional(),
  completion_date: z.date().optional(),
  expiry_date: z.date().optional(),
});

export type AssignmentRuleFormValues = z.infer<typeof assignmentRuleFormSchema>;