
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useJobTemplates, useTemplateCategories } from "@/hooks/use-job-templates";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { AlertCircle, Check, ChevronRight, FileQuestion, Folder, Search, Star, Tool, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useDebounce } from "use-debounce";
import { Badge } from "@/components/ui/badge";
import type { JobTemplate } from "@/types/job-templates";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  const { data: templates = [], isLoading: isLoadingTemplates, error: templatesError } = useJobTemplates();
  const { data: categories = [], isLoading: isLoadingCategories } = useTemplateCategories();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebounce(searchValue, 300);

  const handleTemplateSelect = (template: JobTemplate) => {
    form.setValue('jobTemplate', template.name);
    form.setValue('jobDescription', template.description || template.name);
    setOpen(false);
  };

  const getDifficultyColor = (level?: number) => {
    if (!level) return "bg-gray-100 text-gray-800";
    const colors = {
      1: "bg-green-100 text-green-800",
      2: "bg-blue-100 text-blue-800",
      3: "bg-yellow-100 text-yellow-800",
      4: "bg-orange-100 text-orange-800",
      5: "bg-red-100 text-red-800"
    };
    return colors[level as keyof typeof colors] || colors[3];
  };

  // Memoize filtered templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((template): template is JobTemplate => {
      if (!template?.name) return false;
      const searchLower = debouncedSearch.toLowerCase();
      return (
        template.name.toLowerCase().includes(searchLower) ||
        template.description?.toLowerCase().includes(searchLower) ||
        template.category?.toLowerCase().includes(searchLower)
      );
    });
  }, [templates, debouncedSearch]);

  // Group templates by category
  const groupedTemplates = useMemo(() => {
    return filteredTemplates.reduce((acc, template) => {
      const categoryName = categories.find(c => c.id === template.category_id)?.name || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(template);
      return acc;
    }, {} as Record<string, JobTemplate[]>);
  }, [filteredTemplates, categories]);

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
                    disabled={isLoadingTemplates}
                  >
                    {isLoadingTemplates ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner className="h-4 w-4" />
                        Loading templates...
                      </div>
                    ) : templatesError ? (
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
                  <ScrollArea className="h-[300px]">
                    {isLoadingTemplates ? (
                      <div className="p-4 text-center">
                        <LoadingSpinner className="mx-auto h-4 w-4" />
                        <p className="text-sm text-muted-foreground mt-2">
                          Loading templates...
                        </p>
                      </div>
                    ) : templatesError ? (
                      <div className="p-4 text-center text-destructive">
                        <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                        <p>Failed to load templates</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Please try again later
                        </p>
                      </div>
                    ) : Object.keys(groupedTemplates).length === 0 ? (
                      <CommandEmpty>No templates found</CommandEmpty>
                    ) : (
                      Object.entries(groupedTemplates).map(([category, items]) => (
                        <CommandGroup key={category} heading={category}>
                          {items.map((template) => (
                            <CommandItem
                              key={template.id}
                              value={template.name}
                              onSelect={() => handleTemplateSelect(template)}
                              className="flex flex-col gap-1 p-2"
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                  <Check
                                    className={cn(
                                      "h-4 w-4",
                                      template.name === field.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <span className="font-medium">{template.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {template.difficulty_level && (
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Badge variant="secondary" className={getDifficultyColor(template.difficulty_level)}>
                                          Level {template.difficulty_level}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Difficulty Level {template.difficulty_level}
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                  {template.usage_stats?.success_rate && (
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Badge variant="outline" className="flex items-center gap-1">
                                          <Star className="h-3 w-3" />
                                          {Math.round(template.usage_stats.success_rate)}%
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Success Rate
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              </div>
                              {template.description && (
                                <p className="text-sm text-muted-foreground pl-6">
                                  {template.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 pl-6 mt-1">
                                {template.estimated_duration_range && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {template.estimated_duration_range.min}-{template.estimated_duration_range.max} min
                                  </div>
                                )}
                                {template.required_tools && template.required_tools.length > 0 && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Tool className="h-3 w-3" />
                                    {template.required_tools.length} tools required
                                  </div>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))
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
