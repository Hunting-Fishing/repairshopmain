
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useJobTemplates } from "@/pages/job-templates/hooks/useJobTemplates";
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
  const { data: templates, isLoading } = useJobTemplates();
  const [open, setOpen] = useState(false);

  // Function to get all unique tasks across categories
  const getAllTasks = () => {
    if (!templates) return [];
    return Object.values(templates).flat().map((task, index) => ({
      id: `task-${index}`,
      name: task
    }));
  };

  // Handle template selection
  const handleTemplateSelect = (taskName: string) => {
    form.setValue('jobTemplate', taskName);
    form.setValue('jobDescription', taskName);
    setOpen(false);
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
                    {field.value
                      ? field.value
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
                    {getAllTasks().map((task) => (
                      <CommandItem
                        value={task.name}
                        key={task.id}
                        onSelect={() => handleTemplateSelect(task.name)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            task.name === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {task.name}
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
