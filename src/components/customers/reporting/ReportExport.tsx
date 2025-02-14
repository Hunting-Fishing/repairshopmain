
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ReportExportProps {
  templateId: string;
  data: any[];
}

export function ReportExport({ templateId, data }: ReportExportProps) {
  const handleExport = async () => {
    // Export logic will be implemented here
    console.log('Exporting report', { templateId, data });
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export
    </Button>
  );
}
