
import { ScrollArea } from "@/components/ui/scroll-area";
import { JobTemplate } from "@/types/job-templates";
import { format } from "date-fns";

interface TemplateVersionHistoryProps {
  template: JobTemplate;
}

export function TemplateVersionHistory({ template }: TemplateVersionHistoryProps) {
  if (!template.version_history?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No version history available
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {template.version_history.map((version, index) => (
          <div
            key={version.id}
            className="relative pl-6 pb-4 border-l last:pb-0"
          >
            <div className="absolute left-0 top-2 w-2 h-2 -ml-1 rounded-full bg-primary" />
            <div className="mb-1">
              <span className="font-medium">Version {version.version_number}</span>
              <span className="mx-2">•</span>
              <span className="text-muted-foreground">
                {format(new Date(version.created_at), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {version.changes}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              by {version.created_by.first_name} {version.created_by.last_name}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
