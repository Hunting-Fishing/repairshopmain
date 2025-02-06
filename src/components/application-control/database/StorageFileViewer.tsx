
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ImagePreview } from "./components/file-preview/ImagePreview";
import { DocumentPreview } from "./components/file-preview/DocumentPreview";
import { getFileType } from "./utils/fileTypeUtils";
import { useFileUrl } from "./hooks/useFileUrl";

interface StorageFileViewerProps {
  bucketName: string;
  fileName: string;
  onClose: () => void;
}

export function StorageFileViewer({ bucketName, fileName, onClose }: StorageFileViewerProps) {
  const { data: url } = useFileUrl(bucketName, fileName);
  const fileType = getFileType(fileName);

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
          <>
            {fileType === 'image' && (
              <ImagePreview url={url} fileName={fileName} />
            )}
            {(fileType === 'pdf' || fileType === 'excel') && (
              <DocumentPreview url={url} fileName={fileName} />
            )}
            {fileType === 'other' && (
              <div className="flex justify-center">
                <Button onClick={() => window.open(url, '_blank')}>
                  Download File
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

