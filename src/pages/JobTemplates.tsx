
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { TemplateGrid } from "./job-templates/components/TemplateGrid";
import { useJobTemplates } from "@/hooks/use-job-templates";
import { useEffect } from "react";

export default function JobTemplates() {
  const { data: templates, isLoading, error, refetch } = useJobTemplates();

  useEffect(() => {
    // Ensure templates are fetched when component mounts
    console.log('JobTemplates component mounted');
    refetch();
  }, [refetch]);

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Job Templates</h1>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || 'Failed to load job templates'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-2xl font-bold">Job Templates</h1>
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  // Group templates by category and include full template data
  const groupedTemplates = templates?.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, typeof templates>) || {};

  // Map category codes to display names
  const categoryNames: Record<string, string> = {
    MAIN: 'Main Tasks',
    BASIC: 'Basic Services',
    ENGINE: 'Engine Services',
    TRANSMISSION: 'Transmission Services',
    BRAKE: 'Brake Services',
    SUSPENSION: 'Suspension Services',
    ELECTRICAL: 'Electrical Services',
    HVAC: 'HVAC Services',
    EXHAUST: 'Exhaust Services',
    STEERING: 'Steering Services',
    TIRE: 'Tire Services',
    BODY: 'Body Services',
    DIAGNOSTIC: 'Diagnostic Services',
    MAINTENANCE: 'Maintenance Services',
    PERFORMANCE: 'Performance Services',
    SAFETY: 'Safety Services',
    MISC: 'Miscellaneous Services'
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Job Templates</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Manage your organization's job templates
      </p>
      {templates?.length === 0 ? (
        <Alert>
          <AlertTitle>No templates found</AlertTitle>
          <AlertDescription>
            No job templates are currently available. Please check your organization settings or add new templates.
          </AlertDescription>
        </Alert>
      ) : (
        <TemplateGrid templates={groupedTemplates} columnNames={categoryNames} />
      )}
    </div>
  );
}
