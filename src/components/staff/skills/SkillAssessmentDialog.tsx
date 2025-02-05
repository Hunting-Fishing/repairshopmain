
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillAssessmentSchema } from "./schema";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { SkillFormFields } from "./form/SkillFormFields";
import { ProficiencyField } from "./form/ProficiencyField";
import { NotesField } from "./form/NotesField";
import { useState } from "react";

interface SkillAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId?: string;
}

export function SkillAssessmentDialog({ open, onOpenChange, profileId }: SkillAssessmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(skillAssessmentSchema),
    defaultValues: {
      skillId: "",
      proficiencyLevel: undefined,
      notes: "",
    },
  });

  const onSubmit = async (values: any) => {
    if (!profileId) return;
    
    try {
      setIsSubmitting(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('No authenticated user found');
      }

      const { error } = await supabase
        .from('staff_skill_assessments')
        .insert({
          profile_id: profileId,
          skill_id: values.skillId,
          proficiency_level: values.proficiencyLevel,
          notes: values.notes,
          assessed_by: session.user.id,
        });

      if (error) throw error;

      toast.success("Assessment added successfully");
      queryClient.invalidateQueries({ queryKey: ['skill-assessments', profileId] });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error adding skill assessment:', error);
      toast.error('Failed to add assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Skill Assessment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <SkillFormFields />
            <ProficiencyField />
            <NotesField />
            <Button type="submit" disabled={isSubmitting}>
              Add Assessment
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
