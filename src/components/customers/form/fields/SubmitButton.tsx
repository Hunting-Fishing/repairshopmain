
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  label: string;
  isSubmitting?: boolean;
}

export function SubmitButton({ label, isSubmitting = false }: SubmitButtonProps) {
  const { formState: { isValid } } = useFormContext();

  return (
    <Button
      type="submit"
      disabled={!isValid || isSubmitting}
      className="w-full md:w-auto"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        label
      )}
    </Button>
  );
}
