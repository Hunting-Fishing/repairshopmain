
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  const [pendingChanges, setPendingChanges] = useState<any>(null);
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(skillAssessmentSchema),
    defaultValues: {
      skillId: "",
      proficiencyLevel: undefined,
      notes: "",
    },
  });

  const handleReview = async (values: any) => {
    setPendingChanges(values);
  };

  const handleCancel = () => {
    setPendingChanges(null);
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: any) => {
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
      setPendingChanges(null);
      form.reset();
      onOpenChange(false);
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
          <form onSubmit={form.handleSubmit(pendingChanges ? onSubmit : handleReview)} className="space-y-4">
            <SkillFormFields />
            <ProficiencyField />
            <NotesField />
            
            {pendingChanges ? (
              <div className="space-y-4">
                <div className="text-sm space-y-2 border rounded-lg p-4 bg-muted">
                  <h4 className="font-medium">Review Changes:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Skill Assessment Level: {pendingChanges.proficiencyLevel}</li>
                    {pendingChanges.notes && <li>Notes: {pendingChanges.notes}</li>}
                  </ul>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setPendingChanges(null)}>
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Confirm & Save"}
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  Review Changes
                </Button>
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
