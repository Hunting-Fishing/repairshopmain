import { z } from "zod";

export const skillAssessmentSchema = z.object({
  skillId: z.string().min(1, "Skill is required"),
  proficiencyLevel: z.string().transform((val) => parseInt(val, 10)),
  notes: z.string().optional(),
});

export type SkillAssessmentFormValues = z.infer<typeof skillAssessmentSchema>;