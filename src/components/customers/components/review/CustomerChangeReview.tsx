
import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomerFormValues } from "../../types/customerTypes";

interface CustomerChangeReviewProps {
  isOpen: boolean;
  onClose: () => void;
  pendingChanges: {
    values: CustomerFormValues;
    changes: Record<string, { old: any; new: any }>;
  } | null;
  notes: string;
  onNotesChange: (notes: string) => void;
  onConfirm: () => void;
}

export function CustomerChangeReview({
  isOpen,
  onClose,
  pendingChanges,
  notes,
  onNotesChange,
  onConfirm,
}: CustomerChangeReviewProps) {
  if (!isOpen || !pendingChanges) return null;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Review Changes</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Changes to be made:</Label>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(pendingChanges.changes).map(([field, values]) => (
              <li key={field}>
                {field}: {values.old?.toString() || "none"} → {values.new?.toString()}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <Label>Notes about changes (optional):</Label>
          <Textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Enter any notes about these changes..."
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm}>Confirm Changes</Button>
      </DialogFooter>
    </DialogContent>
  );
}
