
import { Skeleton } from "@/components/ui/skeleton";
import { TemplateGrid } from "./job-templates/components/TemplateGrid";
import { useJobTemplates } from "@/hooks/use-job-templates";

export default function JobTemplates() {
  const { data: templates, isLoading } = useJobTemplates();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Job Templates</h1>
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  // Group templates by category
  const groupedTemplates = templates?.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template.name);
    return acc;
  }, {} as Record<string, string[]>) || {};

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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Job Templates</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Manage your organization's job templates
      </p>
      <TemplateGrid templates={groupedTemplates} columnNames={categoryNames} />
    </div>
  );
}
