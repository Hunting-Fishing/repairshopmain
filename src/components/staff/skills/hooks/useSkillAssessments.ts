
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SkillAssessment } from "../types";
import { logError, handleQueryError } from "@/utils/error-handling";

export function useSkillAssessments(profileId?: string) {
  return useQuery({
    queryKey: ['skill-assessments', profileId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('staff_skill_assessments')
          .select(`
            id,
            proficiency_level,
            assessment_date,
            notes,
            skill:skills(
              name,
              category:skill_categories(name)
            ),
            assessor:profiles!staff_skill_assessments_assessed_by_fkey(
              first_name,
              last_name
            )
          `)
          .eq('profile_id', profileId)
          .order('assessment_date', { ascending: false });

        if (error) throw error;
        
        const transformedData = data.map((assessment): SkillAssessment => ({
          id: assessment.id,
          proficiency_level: assessment.proficiency_level,
          assessment_date: assessment.assessment_date,
          notes: assessment.notes,
          skill: {
            name: assessment.skill?.[0]?.name || '',
            category: assessment.skill?.[0]?.category?.[0] ? {
              name: assessment.skill[0].category[0].name
            } : null
          },
          assessor: assessment.assessor?.[0] ? {
            first_name: assessment.assessor[0].first_name,
            last_name: assessment.assessor[0].last_name
          } : undefined
        }));

        return transformedData;
      } catch (error: unknown) {
        if (error instanceof Error) {
          await logError(error, {
            table_name: 'staff_skill_assessments',
            action_type: 'query',
          });
          handleQueryError(error, 'load skill assessments');
        }
        throw error;
      }
    },
    enabled: !!profileId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
