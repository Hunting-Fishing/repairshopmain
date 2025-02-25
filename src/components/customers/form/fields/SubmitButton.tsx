
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
  const { formState: { isValid, errors, isDirty }, getValues } = useFormContext();
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
    
    // Base required fields for all customer types
    if (!values.first_name?.trim()) missingFields.push("First Name");
    if (!values.last_name?.trim()) missingFields.push("Last Name");
    if (!values.email?.trim()) missingFields.push("Email");

    // Business-specific fields validation
    if (values.customer_type === "Business") {
      if (!values.company_size) missingFields.push("Company Size");
      if (!values.business_classification_id) missingFields.push("Business Classification");
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
        .filter(field => {
          // Filter out optional fields based on customer type
          if (values.customer_type !== "Business") {
            return !["company_size", "business_classification_id", "preferred_contact_time"].includes(field);
          }
          // Filter out timezone validation
          return field !== "timezone";
        })
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
      disabled={isSubmitting || (!isDirty && !isValid)} // Allow submission if form is valid and has changes
      className={cn(
        "w-full md:w-auto",
        (!isDirty || !isValid) && "opacity-50 cursor-not-allowed hover:bg-primary"
      )}
      onClick={handleClick}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {label === "Add Customer" ? "Creating..." : "Updating..."}
        </>
      ) : (
        label
      )}
    </Button>
  );
}
