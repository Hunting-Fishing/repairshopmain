
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { SkillAssessmentForm } from "./components/SkillAssessmentForm";
import { useSkillAssessmentSubmit } from "./hooks/useSkillAssessmentSubmit";
import { useForm } from "react-hook-form";
import { skillAssessmentSchema } from "./schema";

interface SkillAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId?: string;
}

export function SkillAssessmentDialog({
  open,
  onOpenChange,
  profileId
}: SkillAssessmentDialogProps) {
  const [pendingChanges, setPendingChanges] = useState<any>(null);
  const form = useForm({
    resolver: zodResolver(skillAssessmentSchema),
    defaultValues: {
      skillId: "",
      proficiencyLevel: undefined,
      notes: "",
    },
  });

  const handleSuccess = () => {
    setPendingChanges(null);
    form.reset();
    onOpenChange(false);
  };

  const { isSubmitting, handleSubmit } = useSkillAssessmentSubmit(profileId, handleSuccess);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Skill Assessment</DialogTitle>
        </DialogHeader>
        <SkillAssessmentForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
