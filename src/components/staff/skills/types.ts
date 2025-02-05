export interface Skill {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  category?: {
    name: string;
  } | null;
}

export interface SkillCategory {
  id: string;
  name: string;
  description?: string | null;
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
    } | null;
  };
  assessor?: {
    first_name: string;
    last_name: string;
  };
}