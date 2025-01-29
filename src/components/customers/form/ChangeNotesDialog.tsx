import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChangeNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  onSubmit: () => void;
}

export const ChangeNotesDialog = ({
  open,
  onOpenChange,
  notes,
  onNotesChange,
  onSubmit,
}: ChangeNotesDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Change Notes</DialogTitle>
        <DialogDescription>
          Please provide any notes about the changes you're making
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <Textarea
          placeholder="Enter notes about your changes (optional)"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Save Changes</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);