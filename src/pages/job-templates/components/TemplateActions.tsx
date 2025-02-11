
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Copy, Eye, History, MoreVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { JobTemplate } from "@/types/job-templates";
import { TemplatePreview } from "./TemplatePreview";
import { TemplateVersionHistory } from "./TemplateVersionHistory";

interface TemplateActionsProps {
  template: JobTemplate;
  onDuplicate: () => void;
}

export function TemplateActions({ template, onDuplicate }: TemplateActionsProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleDuplicate = async () => {
    try {
      const { data, error } = await supabase
        .rpc('duplicate_template', { template_id: template.id });
      
      if (error) throw error;
      
      toast.success("Template duplicated successfully");
      onDuplicate();
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast.error("Failed to duplicate template");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => setIsPreviewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsHistoryOpen(true)}>
            <History className="mr-2 h-4 w-4" />
            History
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
          </DialogHeader>
          <TemplatePreview template={template} />
        </DialogContent>
      </Dialog>

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
          </DialogHeader>
          <TemplateVersionHistory template={template} />
        </DialogContent>
      </Dialog>
    </>
  );
}
