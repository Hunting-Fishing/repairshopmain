
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useJobTemplates } from "@/hooks/use-job-templates";

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

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = jobTemplates?.find(t => t.id === templateId);
    if (template) {
      form.setValue('jobTemplate', templateId);
      form.setValue('jobDescription', template.description || '');
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="jobTemplate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Template</FormLabel>
            <Select onValueChange={handleTemplateSelect} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={isLoading ? "Loading..." : "Select a job template"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {jobTemplates?.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
