
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Download, Eye, FileText, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useFileUrl } from '@/components/application-control/database/hooks/useFileUrl';
import { DocumentPreview } from '@/components/application-control/database/components/file-preview/DocumentPreview';
import { toast } from 'sonner';

interface ReportOutputViewerProps {
  templateId?: string;
}

export function ReportOutputViewer({ templateId }: ReportOutputViewerProps) {
  const [selectedOutput, setSelectedOutput] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: outputs, isLoading } = useQuery({
    queryKey: ['report-outputs', templateId],
    queryFn: async () => {
      const query = supabase
        .from('report_outputs')
        .select('*')
        .order('created_at', { ascending: false });

      if (templateId) {
        query.eq('template_id', templateId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const { data: fileUrl } = useFileUrl(
    'report-outputs',
    selectedOutput ? outputs?.find(o => o.id === selectedOutput)?.file_path || '' : ''
  );

  useEffect(() => {
    if (fileUrl) {
      setPreviewUrl(fileUrl);
    }
  }, [fileUrl]);

  const handlePreview = async (outputId: string) => {
    setSelectedOutput(outputId);
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('report-outputs')
        .download(filePath);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Error downloading file');
      console.error('Download error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Outputs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outputs?.map((output) => (
                <TableRow key={output.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {output.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {output.file_type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(output.created_at), 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell>
                    {output.file_size
                      ? `${Math.round(output.file_size / 1024)} KB`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePreview(output.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(output.file_path, output.name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {outputs?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No report outputs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={!!selectedOutput} onOpenChange={() => setSelectedOutput(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {outputs?.find(o => o.id === selectedOutput)?.name}
            </DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <DocumentPreview
              url={previewUrl}
              fileName={outputs?.find(o => o.id === selectedOutput)?.name || ''}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
