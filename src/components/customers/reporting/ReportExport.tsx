
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportExportProps {
  templateId: string;
  data: any[];
}

export function ReportExport({ templateId, data }: ReportExportProps) {
  const [format, setFormat] = useState<'csv' | 'xlsx' | 'pdf'>('csv');
  const { toast } = useToast();

  const exportData = async () => {
    try {
      // Convert data to the selected format
      let blob: Blob;
      let filename: string;

      if (format === 'csv') {
        const csvContent = convertToCSV(data);
        blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        filename = `report_${templateId}.csv`;
      } else if (format === 'xlsx') {
        // For simplicity, we'll use CSV for now
        const csvContent = convertToCSV(data);
        blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        filename = `report_${templateId}.xlsx`;
      } else {
        // For simplicity, we'll use CSV for now
        const csvContent = convertToCSV(data);
        blob = new Blob([csvContent], { type: 'application/pdf' });
        filename = `report_${templateId}.pdf`;
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast({
        title: "Export Successful",
        description: `Report exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your report",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={format}
        onValueChange={(value) => setFormat(value as 'csv' | 'xlsx' | 'pdf')}
      >
        <option value="csv">CSV</option>
        <option value="xlsx">Excel</option>
        <option value="pdf">PDF</option>
      </Select>
      <Button onClick={exportData}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
  );
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(',')
    )
  ];
  
  return csvRows.join('\n');
}
