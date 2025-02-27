
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface FormNotificationsProps {
  customerType: string | undefined;
  isSaving: boolean;
  completionPercentage: number;
  dirtyFields: number;
}

export function FormNotifications({ 
  customerType, 
  isSaving,
  completionPercentage,
  dirtyFields
}: FormNotificationsProps) {
  return (
    <div className="space-y-4">
      {!customerType && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a customer type to continue
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Form Completion</span>
          <span className="text-sm text-muted-foreground">{Math.round(completionPercentage)}%</span>
        </div>
        <Progress 
          value={completionPercentage} 
          className="h-2" 
          aria-label="Form completion progress"
        />
      </div>

      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2" role="status">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Saving changes...</span>
        </div>
      )}

      {dirtyFields > 0 && !isSaving && (
        <div className="fixed bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>You have {dirtyFields} unsaved {dirtyFields === 1 ? 'change' : 'changes'}</span>
        </div>
      )}
    </div>
  );
}
