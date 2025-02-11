
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useJobTemplates, JobTemplate } from "@/hooks/use-job-templates";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, FileQuestion, Folder, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useDebounce } from "use-debounce";

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
  const { data: templates = [], isLoading, error } = useJobTemplates();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebounce(searchValue, 300);

  const handleTemplateSelect = (template: JobTemplate) => {
    form.setValue('jobTemplate', template.name);
    form.setValue('jobDescription', template.description || template.name);
    setOpen(false);
  };

  // Memoize filtered templates to prevent unnecessary re-filtering
  const filteredTemplates = useMemo(() => {
    return templates.filter((template): template is JobTemplate => {
      if (!template?.name) return false;
      return template.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    });
  }, [templates, debouncedSearch]);

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
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner className="h-4 w-4" />
                        Loading templates...
                      </div>
                    ) : error ? (
                      <div className="flex items-center gap-2 text-destructive">
                        <FileQuestion className="h-4 w-4" />
                        Error loading templates
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4" />
                          {field.value || "Select a template..."}
                        </div>
                        <Search className="h-4 w-4 opacity-50" />
                      </>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search templates..." 
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <ScrollArea className="h-[200px]">
                    {isLoading ? (
                      <div className="p-4 text-center">
                        <LoadingSpinner className="mx-auto h-4 w-4" />
                        <p className="text-sm text-muted-foreground mt-2">
                          Loading templates...
                        </p>
                      </div>
                    ) : error ? (
                      <div className="p-4 text-center text-destructive">
                        <FileQuestion className="mx-auto h-8 w-8 mb-2" />
                        <p>Failed to load templates</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Please try again later
                        </p>
                      </div>
                    ) : templates.length === 0 ? (
                      <div className="p-4 text-center">
                        <Folder className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          No templates available
                        </p>
                      </div>
                    ) : filteredTemplates.length === 0 ? (
                      <CommandEmpty>No matching templates found.</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {filteredTemplates.map((template) => (
                          <CommandItem
                            key={template.id}
                            value={template.name}
                            onSelect={() => handleTemplateSelect(template)}
                            className="flex items-center gap-2"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                template.name === field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{template.name}</span>
                              {template.description && (
                                <span className="text-sm text-muted-foreground">
                                  {template.description.length > 50
                                    ? `${template.description.slice(0, 50)}...`
                                    : template.description}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </ScrollArea>
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
