
import { Skeleton } from "@/components/ui/skeleton";
import { TemplateGrid } from "./job-templates/components/TemplateGrid";
import { useJobTemplates, COLUMN_NAMES } from "./job-templates/hooks/useJobTemplates";

interface JobTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  estimated_hours: number | null;
  parts_required: any[];
  is_active: boolean;
}

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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Job Templates</h1>
      <TemplateGrid templates={templates || {}} columnNames={COLUMN_NAMES} />
    </div>
  );
}
