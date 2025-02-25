
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  label: string;
  isSubmitting?: boolean;
}

export function SubmitButton({ label, isSubmitting = false }: SubmitButtonProps) {
  const { formState: { isValid, errors } } = useFormContext();
  const { toast } = useToast();

  const getFieldLabel = (fieldName: string): string => {
    const labels: Record<string, string> = {
      first_name: "First Name",
      last_name: "Last Name",
      email: "Email",
      customer_type: "Customer Type"
    };
    return labels[fieldName] || fieldName;
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isValid) {
      e.preventDefault();
      const errorFields = Object.keys(errors);
      const missingFields = errorFields.map(field => getFieldLabel(field));
      
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: missingFields.length > 0
          ? `Please fill in the following required fields: ${missingFields.join(', ')}`
          : "Please fill out all required fields marked with an asterisk (*) before saving."
      });
    }
  };

  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className={cn(
        "w-full md:w-auto",
        !isValid && "opacity-50 cursor-not-allowed hover:bg-primary"
      )}
      onClick={handleClick}
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
