
import { Button } from "@/components/ui/button";

interface DocumentPreviewProps {
  url: string;
  fileName: string;
}

export function DocumentPreview({ url, fileName }: DocumentPreviewProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <iframe
        src={url}
        className="w-full h-[500px] border-none"
        title={fileName}
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

