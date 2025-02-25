
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillAssessmentSchema } from "../schema";
import { SkillFormFields } from "../form/SkillFormFields";
import { ProficiencyField } from "../form/ProficiencyField";
import { NotesField } from "../form/NotesField";
import { SkillAssessmentReview } from "./SkillAssessmentReview";
import { useState } from "react";

interface SkillAssessmentFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function SkillAssessmentForm({
  onSubmit,
  onCancel,
  isSubmitting
}: SkillAssessmentFormProps) {
  const form = useForm({
    resolver: zodResolver(skillAssessmentSchema),
    defaultValues: {
      skillId: "",
      proficiencyLevel: undefined,
      notes: "",
    },
  });

  const [pendingChanges, setPendingChanges] = useState<any>(null);

  const handleReview = async (values: any) => {
    setPendingChanges(values);
  };

  const handleCancel = () => {
    setPendingChanges(null);
    form.reset();
    onCancel();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(pendingChanges ? onSubmit : handleReview)} className="space-y-4">
        <SkillFormFields />
        <ProficiencyField />
        <NotesField />
        
        {pendingChanges ? (
          <SkillAssessmentReview
            pendingChanges={pendingChanges}
            isSubmitting={isSubmitting}
            onBack={() => setPendingChanges(null)}
            onConfirm={() => form.handleSubmit(onSubmit)()}
          />
        ) : (
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              type="submit"
              loading={isSubmitting}
              loadingText="Reviewing..."
            >
              Review Changes
            </Button>
          </DialogFooter>
        )}
      </form>
    </Form>
  );
}
