import { z } from "zod";

export const skillAssessmentSchema = z.object({
  skillId: z.string().min(1, "Skill is required"),
  proficiencyLevel: z.string().transform((val) => parseInt(val, 10)),
  notes: z.string().optional(),
});

export type SkillAssessmentFormValues = z.infer<typeof skillAssessmentSchema>;

export interface SkillAssessment {
  id: string;
  proficiency_level: number;
  assessment_date?: string;
  notes?: string;
  skill?: {
    name: string;
    category?: {
      name: string;
    };
  };
  assessor?: {
    first_name: string;
    last_name: string;
  };
}
