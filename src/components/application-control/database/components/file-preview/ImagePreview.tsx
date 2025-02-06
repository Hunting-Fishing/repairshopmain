
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  url: string;
  fileName: string;
}

export function ImagePreview({ url, fileName }: ImagePreviewProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <img 
        src={url} 
        alt={fileName} 
        className="max-w-full h-auto max-h-[500px] object-contain"
      />
      <Button 
        className="mt-4" 
        onClick={() => window.open(url, '_blank')}
      >
        Download File
      </Button>
    </div>
  );
}

