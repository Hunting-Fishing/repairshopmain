
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { skillAssessmentSchema } from "../schema";

export function useSkillAssessmentSubmit(profileId: string | undefined, onSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (values: any) => {
    if (!profileId) return;
    
    try {
      setIsSubmitting(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('No authenticated user found');
      }

      const { error } = await supabase
        .from('skill_assessments')
        .insert({
          profile_id: profileId,
          skill_id: values.skillId,
          proficiency_level: values.proficiencyLevel,
          notes: values.notes,
          assessed_by: session.user.id,
          organization_id: (await supabase
            .from('profiles')
            .select('organization_id')
            .eq('id', session.user.id)
            .single()
          ).data?.organization_id
        });

      if (error) throw error;

      toast.success("Assessment added successfully");
      queryClient.invalidateQueries({ queryKey: ['skill-assessments', profileId] });
      onSuccess();
    } catch (error) {
      console.error('Error adding skill assessment:', error);
      toast.error('Failed to add assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
}
