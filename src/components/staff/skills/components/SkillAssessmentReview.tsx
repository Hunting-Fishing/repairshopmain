
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface SkillAssessmentReviewProps {
  pendingChanges: any;
  isSubmitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export function SkillAssessmentReview({
  pendingChanges,
  isSubmitting,
  onBack,
  onConfirm
}: SkillAssessmentReviewProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm space-y-2 border rounded-lg p-4 bg-muted">
        <h4 className="font-medium">Review Changes:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Skill Assessment Level: {pendingChanges.proficiencyLevel}</li>
          {pendingChanges.notes && <li>Notes: {pendingChanges.notes}</li>}
        </ul>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Confirm & Save"}
        </Button>
      </DialogFooter>
    </div>
  );
}
