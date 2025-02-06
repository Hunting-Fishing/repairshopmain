
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";

interface StorageFileViewerProps {
  bucketName: string;
  fileName: string;
  onClose: () => void;
}

export function StorageFileViewer({ bucketName, fileName, onClose }: StorageFileViewerProps) {
  const { data: url } = useQuery({
    queryKey: ['file-url', bucketName, fileName],
    queryFn: async () => {
      const { data } = await supabase
        .storage
        .from(bucketName)
        .createSignedUrl(fileName, 3600); // 1 hour expiry
      
      return data?.signedUrl;
    },
  });

  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  const isPDF = fileName.toLowerCase().endsWith('.pdf');
  const isExcel = fileName.toLowerCase().endsWith('.xlsx') || fileName.toLowerCase().endsWith('.xls');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>File Preview: {fileName}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {url && (
          <div className="flex flex-col items-center justify-center">
            {isImage && (
              <img 
                src={url} 
                alt={fileName} 
                className="max-w-full h-auto max-h-[500px] object-contain"
              />
            )}
            {(isPDF || isExcel) && (
              <iframe
                src={url}
                className="w-full h-[500px] border-none"
                title={fileName}
              />
            )}
            <Button 
              className="mt-4" 
              onClick={() => window.open(url, '_blank')}
            >
              Download File
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
