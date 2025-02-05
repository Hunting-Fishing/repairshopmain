import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillAssessmentSchema } from "./schema";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { SkillFormFields } from "./form/SkillFormFields";
import { ProficiencyField } from "./form/ProficiencyField";
import { NotesField } from "./form/NotesField";

interface SkillAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId?: string;
}

export function SkillAssessmentDialog({ open, onOpenChange, profileId }: SkillAssessmentDialogProps) {
  const { toast } = useToast();
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
      const { error } = await supabase
        .from('staff_skill_assessments')
        .insert({
          profile_id: profileId,
          skill_id: values.skillId,
          proficiency_level: values.proficiencyLevel,
          notes: values.notes,
          assessed_by: (await supabase.auth.getSession()).data.session?.user.id,
        });

      if (error) throw error;

      toast({ title: "Assessment added successfully" });
      queryClient.invalidateQueries({ queryKey: ['skill-assessments', profileId] });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error adding skill assessment:', error);
      toast({ 
        title: "Error",
        description: "Failed to add assessment",
        variant: "destructive"
      });
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
            <Button type="submit">Add Assessment</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}