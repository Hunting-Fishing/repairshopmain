
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
  const { 
    formState: { errors }, 
    getValues,
    watch 
  } = useFormContext();
  
  const { toast } = useToast();

  // Watch critical fields for changes
  const watchedFields = watch([
    'first_name',
    'last_name',
    'email',
    'country',
    'timezone',
    'phone_number',
    'street_address',
    'city',
    'state_province',
    'postal_code',
    'customer_type'
  ]);

  // Check if any watched field has a value
  const hasChanges = watchedFields.some(field => field);

  const getFieldLabel = (fieldName: string): string => {
    const labels: Record<string, string> = {
      first_name: "First Name",
      last_name: "Last Name",
      email: "Email",
      country: "Country",
      timezone: "Timezone",
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
    if (!values.country?.trim()) missingFields.push("Country");
    if (!values.timezone?.trim()) missingFields.push("Timezone");

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
          // Filter out optional fields and fields that shouldn't block submission
          const fieldsToIgnore = [
            'company_size',
            'business_classification_id',
            'preferred_contact_time',
            'language_preference'
          ];
          
          // Don't block submission for these fields
          if (fieldsToIgnore.includes(field)) return false;
          
          // For business type, only include business-specific fields
          if (values.customer_type !== "Business") {
            return !["company_size", "business_classification_id"].includes(field);
          }
          
          return true;
        })
        .map(field => getFieldLabel(field));
      
      if (errorFields.length > 0) {
        toast({
          variant: "destructive",
          title: "Validation Errors",
          description: `Please check the following fields: ${errorFields.join(', ')}`
        });
        return;
      }
    }

    // If we get here, allow the form to submit
    console.log('Submitting form with values:', values);
  };

  // For edit mode, we want to enable the button if there are any values
  // For create mode, we need all required fields
  const isEditMode = label.toLowerCase().includes('update');
  const shouldDisable = isSubmitting;

  return (
    <Button
      type="submit"
      disabled={shouldDisable}
      className={cn(
        "w-full md:w-auto",
        shouldDisable && "opacity-50 cursor-not-allowed hover:bg-primary"
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
