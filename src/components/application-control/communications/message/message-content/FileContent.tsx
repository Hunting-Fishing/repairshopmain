
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, Eye, FileIcon, Forward, MoreVertical, Save, Share2 } from "lucide-react";

interface FileContentProps {
  content: string;
  metadata?: {
    url?: string;
    type?: string;
  };
  onDownload: () => void;
  onShare: () => void;
  onForward: () => void;
  onSaveToCustomerFile: () => void;
}

export function FileContent({
  content,
  metadata,
  onDownload,
  onShare,
  onForward,
  onSaveToCustomerFile,
}: FileContentProps) {
  const isImage = metadata?.type?.startsWith('image/');

  if (isImage) {
    return (
      <div className="relative group">
        <img 
          src={metadata?.url} 
          alt={content}
          className="max-w-[300px] max-h-[200px] rounded-lg object-cover cursor-pointer hover:opacity-90"
          onClick={() => window.open(metadata?.url, '_blank')}
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => window.open(metadata?.url, '_blank')}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e) => {
                e.preventDefault();
                onForward();
              }}>
                <Forward className="mr-2 h-4 w-4" />
                Forward
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSaveToCustomerFile}>
                <Save className="mr-2 h-4 w-4" />
                Save to Customer File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-secondary p-3 rounded-lg">
      <FileIcon className="h-8 w-8 text-muted-foreground" />
      <div className="flex-1">
        <p className="font-medium truncate">{content}</p>
        <p className="text-xs text-muted-foreground">
          {metadata?.type || 'Unknown file type'}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => window.open(metadata?.url, '_blank')}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
            onForward();
          }}>
            <Forward className="mr-2 h-4 w-4" />
            Forward
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSaveToCustomerFile}>
            <Save className="mr-2 h-4 w-4" />
            Save to Customer File
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
