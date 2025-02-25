
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { validationMessages } from "../schemas/validationMessages";

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

  // Form state persistence
  useEffect(() => {
    const formData = getValues();
    const customerId = formData.id;
    
    if (customerId) {
      localStorage.setItem(`customer_form_${customerId}`, JSON.stringify(formData));
    }
  }, [watchedFields, getValues]);

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
    const missingFields = Object.entries(validationMessages.required)
      .filter(([field, _]) => !values[field as keyof typeof values])
      .map(([field, _]) => getFieldLabel(field));

    if (missingFields.length > 0) {
      e.preventDefault();
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: `Please fill in the following fields: ${missingFields.join(', ')}`
      });
      return;
    }

    if (Object.keys(errors).length > 0) {
      e.preventDefault();
      const errorFields = Object.keys(errors)
        .map(field => getFieldLabel(field));
      
      toast({
        variant: "destructive",
        title: "Validation Errors",
        description: `Please check the following fields: ${errorFields.join(', ')}`
      });
      return;
    }

    // If we get here, allow the form to submit
    console.log('Submitting form with values:', values);
  };

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
