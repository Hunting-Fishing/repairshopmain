
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateReport } from "./services/reportService";
import { toast } from "sonner";

interface ReportExportProps {
  templateId: string;
  data: any[];
}

export function ReportExport({ templateId, data }: ReportExportProps) {
  const handleExport = async () => {
    try {
      const job = await generateReport({ 
        templateId,
        parameters: { data }
      });
      
      toast.success("Report generation started", {
        description: "You'll be notified when it's ready"
      });
      
      console.log('Export job created:', job);
    } catch (error: any) {
      toast.error("Failed to start export", {
        description: error.message
      });
    }
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export
    </Button>
  );
}
