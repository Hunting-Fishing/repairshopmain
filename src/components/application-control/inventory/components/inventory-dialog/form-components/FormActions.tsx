
import { Button } from "@/components/ui/button";
import { Loader2, Save, X } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
  changes: Record<string, any> | null;
  onCancel: () => void;
}

export function FormActions({ isSubmitting, changes, onCancel }: FormActionsProps) {
  return (
    <div className="border-t bg-white dark:bg-gray-900 p-4 flex justify-between items-center shadow-lg rounded-b-lg">
      <div className="flex items-center gap-2">
        {changes && Object.keys(changes).length > 0 && (
          <span className="text-sm text-muted-foreground bg-primary/5 px-3 py-1 rounded-full">
            {Object.keys(changes).length} field(s) modified
          </span>
        )}
      </div>
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          type="button" 
          onClick={onCancel}
          className="min-w-[100px] border-border/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-300"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="min-w-[100px] bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Item
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
