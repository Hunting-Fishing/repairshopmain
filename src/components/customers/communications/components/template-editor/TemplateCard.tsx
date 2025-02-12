
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Archive, Clock, Edit, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import type { EmailTemplate } from "../../types";
import { format } from "date-fns";

interface TemplateCardProps {
  template: EmailTemplate;
  onEdit: () => void;
  onArchive: (archive: boolean) => void;
}

export function TemplateCard({ template, onEdit, onArchive }: TemplateCardProps) {
  return (
    <Card className={template.is_archived ? "opacity-75" : ""}>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1">{template.name}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onArchive(!template.is_archived)}
              title={template.is_archived ? "Unarchive template" : "Archive template"}
            >
              {template.is_archived ? (
                <RotateCcw className="h-4 w-4" />
              ) : (
                <Archive className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              title="Edit template"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {template.subject}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Updated {format(new Date(template.updated_at), "MMM d, yyyy")}
          </div>
          {template.is_archived && (
            <div className="text-xs text-muted-foreground">
              Archived on {format(new Date(template.last_archive_date!), "MMM d, yyyy")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
