
import { useRef, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { FormInput, FormInputRef } from "./fields/FormInput";
import { User, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomerFormFieldsProps {
  form: UseFormReturn<CustomerFormValues>;
  customerId: string;
  isModernTheme?: boolean;
}

export function CustomerFormFields({
  form,
  customerId,
  isModernTheme = false,
}: CustomerFormFieldsProps) {
  const { toast } = useToast();
  
  // Create refs for each field
  const firstNameRef = useRef<FormInputRef>(null);
  const lastNameRef = useRef<FormInputRef>(null);
  const emailRef = useRef<FormInputRef>(null);
  const phoneRef = useRef<FormInputRef>(null);

  const fields = [
    {
      name: "first_name",
      label: "First Name",
      required: true,
      ref: firstNameRef,
      icon: <User className="h-4 w-4 text-gray-500" />,
      nextRef: lastNameRef
    },
    {
      name: "last_name",
      label: "Last Name",
      required: true,
      ref: lastNameRef,
      icon: <User className="h-4 w-4 text-gray-500" />,
      nextRef: emailRef
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      ref: emailRef,
      icon: <Mail className="h-4 w-4 text-gray-500" />,
      nextRef: phoneRef
    },
    {
      name: "phone_number",
      label: "Phone Number",
      type: "tel",
      required: true,
      ref: phoneRef,
      icon: <Phone className="h-4 w-4 text-gray-500" />,
      nextRef: null
    }
  ];

  useEffect(() => {
    // Subscribe to form errors
    const subscription = form.watch((value, { name }) => {
      const field = fields.find(f => f.name === name);
      if (!field) return;

      const currentValue = value[field.name as keyof CustomerFormValues];
      if (!currentValue && field.required) {
        field.ref.current?.scrollIntoView();
        toast({
          title: "Required Field",
          description: `Please fill in the ${field.label.toLowerCase()} field`,
          variant: "destructive",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, fields, toast]);

  const handleFieldBlur = (currentField: typeof fields[0]) => {
    const value = form.getValues(currentField.name as keyof CustomerFormValues);
    if (!value && currentField.required) {
      currentField.ref.current?.scrollIntoView();
    } else if (currentField.nextRef?.current) {
      currentField.nextRef.current.focus();
    }
  };

  return (
    <div className="grid gap-6">
      {fields.map((field) => (
        <FormInput
          key={field.name}
          ref={field.ref}
          form={form}
          name={field.name as keyof CustomerFormValues}
          label={field.label}
          type={field.type || "text"}
          required={field.required}
          icon={field.icon}
          isModernTheme={isModernTheme}
          onBlur={() => handleFieldBlur(field)}
        />
      ))}
    </div>
  );
}
