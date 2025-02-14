
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import type { ReportSchedule } from '../../types';

interface DialogActionsProps {
  onSave: () => void;
  onSubmitForApproval: () => void;
  isValid: boolean;
}

export function DialogActions({ onSave, onSubmitForApproval, isValid }: DialogActionsProps) {
  return (
    <div className="flex justify-end space-x-2 mt-4">
      <DialogTrigger asChild>
        <Button variant="outline">Cancel</Button>
      </DialogTrigger>
      <Button onClick={onSave} disabled={!isValid}>Save as Draft</Button>
      <Button onClick={onSubmitForApproval} variant="default" disabled={!isValid}>
        Submit for Approval
      </Button>
    </div>
  );
}
