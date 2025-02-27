
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FormNotificationsProps {
  customerType: string | undefined;
  isSaving: boolean;
}

export function FormNotifications({ customerType, isSaving }: FormNotificationsProps) {
  return (
    <>
      {!customerType && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a customer type to continue
          </AlertDescription>
        </Alert>
      )}

      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-md shadow-lg">
          Saving changes...
        </div>
      )}
    </>
  );
}
