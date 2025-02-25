
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubmitButtonProps {
  label: string;
  isSubmitting?: boolean;
}

export function SubmitButton({ label, isSubmitting = false }: SubmitButtonProps) {
  const { formState: { isValid, errors } } = useFormContext();
  const { toast } = useToast();

  const handleDisabledClick = () => {
    if (!isValid) {
      const errorFields = Object.keys(errors);
      toast({
        variant: "destructive",
        title: "Unable to save changes",
        description: errorFields.length > 0
          ? `Please check the following fields: ${errorFields.join(', ')}`
          : "Please fill out all required fields correctly before saving."
      });
    }
  };

  return (
    <Button
      type="submit"
      disabled={!isValid || isSubmitting}
      className="w-full md:w-auto"
      onClick={!isValid ? handleDisabledClick : undefined}
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
