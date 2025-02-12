
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useTemplateVersions } from "../../hooks/useTemplateVersions";
import { format } from "date-fns";
import { History, RotateCcw } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface VersionHistoryProps {
  templateId: string;
}

export function VersionHistory({ templateId }: VersionHistoryProps) {
  const { versions, isLoading, restoreVersion } = useTemplateVersions(templateId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!versions.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <History className="mx-auto h-8 w-8 mb-2 opacity-50" />
        <p>No version history available</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {versions.map((version) => (
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
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Name: {version.metadata.name}</p>
                <p>Subject: {version.metadata.subject}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => restoreVersion.mutate(version)}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
