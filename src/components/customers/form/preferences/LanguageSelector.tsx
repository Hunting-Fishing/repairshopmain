
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";

interface LanguageSelectorProps {
  form: UseFormReturn<CustomerFormValues>;
  labelClasses: string;
}

export function LanguageSelector({ form, labelClasses }: LanguageSelectorProps) {
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" }
  ];

  return (
    <FormField
      control={form.control}
      name="language_preference"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={labelClasses}>Preferred Language</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
