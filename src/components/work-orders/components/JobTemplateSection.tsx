
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useJobTemplates } from "@/hooks/use-job-templates";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const workOrderSchema = z.object({
  customerId: z.string().min(1, "Customer selection is required"),
  vehicleInfo: z.string().min(1, "Vehicle information is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  jobTemplate: z.string().optional(),
});

type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

interface JobTemplateSectionProps {
  form: UseFormReturn<WorkOrderFormValues>;
}

export function JobTemplateSection({ form }: JobTemplateSectionProps) {
  const { data: jobTemplates, isLoading } = useJobTemplates();
  const [open, setOpen] = useState(false);

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = jobTemplates?.find(t => t.id === templateId);
    if (template) {
      form.setValue('jobTemplate', templateId);
      form.setValue('jobDescription', template.description || '');
      setOpen(false);
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="jobTemplate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Job Template</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value && jobTemplates
                      ? jobTemplates.find((template) => template.id === field.value)?.name
                      : isLoading 
                        ? "Loading..."
                        : "Search templates..."}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search job templates..." />
                  <CommandEmpty>No templates found.</CommandEmpty>
                  <CommandGroup>
                    {(jobTemplates || []).map((template) => (
                      <CommandItem
                        value={template.name}
                        key={template.id}
                        onSelect={() => handleTemplateSelect(template.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            template.id === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {template.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="jobDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description</FormLabel>
            <FormControl>
              <Textarea 
                {...field}
                placeholder="Enter the job description..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
