export interface Skill {
  id: string;
  name: string;
  category?: {
    name: string;
  };
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
    } | null;
  };
  assessor?: {
    first_name: string;
    last_name: string;
  };
}