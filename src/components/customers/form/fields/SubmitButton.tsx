
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
  const { formState: { isValid, errors }, getValues } = useFormContext();
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
    const values = getValues();
    const missingFields = [];
    
    // Check required fields based on customer type
    if (!values.first_name?.trim()) missingFields.push("First Name");
    if (!values.last_name?.trim()) missingFields.push("Last Name");
    if (!values.email?.trim()) missingFields.push("Email");
    
    // Only require customer_type if it's not already set to "Personal"
    if (!values.customer_type && values.customer_type !== "Personal") {
      missingFields.push("Customer Type");
    }

    if (missingFields.length > 0) {
      e.preventDefault();
      
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: `Please fill in the following fields: ${missingFields.join(', ')}`
      });
      return;
    }

    // If there are other validation errors (e.g., invalid email format)
    if (Object.keys(errors).length > 0) {
      e.preventDefault();
      const errorFields = Object.keys(errors)
        .filter(field => field !== 'timezone') // Exclude timezone from validation errors
        .map(field => getFieldLabel(field));
      
      if (errorFields.length > 0) {
        toast({
          variant: "destructive",
          title: "Validation Errors",
          description: `Please check the following fields: ${errorFields.join(', ')}`
        });
      }
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
