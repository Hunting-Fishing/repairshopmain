import { z } from "zod";

export const skillAssessmentSchema = z.object({
  skillId: z.string().min(1, "Skill is required"),
  proficiencyLevel: z.string().transform((val) => parseInt(val, 10)),
  notes: z.string().optional(),
});

export type SkillAssessmentFormValues = z.infer<typeof skillAssessmentSchema>;

export interface Skill {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  category?: {
    name: string;
  };
}

export interface SkillCategory {
  id: string;
  name: string;
  description?: string;
  skills?: Skill[];
}

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

export const getProficiencyLabel = (level: number): string => {
  switch (level) {
    case 1: return "Beginner";
    case 2: return "Intermediate";
    case 3: return "Advanced";
    case 4: return "Expert";
    default: return "Unknown";
  }
};

export const getProficiencyColor = (level: number): string => {
  switch (level) {
    case 1: return "bg-red-100 text-red-800";
    case 2: return "bg-yellow-100 text-yellow-800";
    case 3: return "bg-green-100 text-green-800";
    case 4: return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};