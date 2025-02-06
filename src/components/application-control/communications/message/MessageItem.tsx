
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Download, Eye, Share2, FileIcon, ImageIcon } from "lucide-react";

interface MessageItemProps {
  content: string;
  content_type?: string;
  metadata?: {
    url?: string;
    type?: string;
  };
  sender?: {
    first_name?: string;
    last_name?: string;
  };
  created_at: string;
}

export function MessageItem({ content, content_type, metadata, sender, created_at }: MessageItemProps) {
  const handleDownload = async () => {
    if (metadata?.url) {
      const link = document.createElement('a');
      link.href = metadata.url;
      link.download = content; // Use original filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = () => {
    if (metadata?.url) {
      navigator.clipboard.writeText(metadata.url);
    }
  };

  const renderContent = () => {
    if (content_type === 'file') {
      const isImage = metadata?.type?.startsWith('image/');
      
      return (
        <div className="flex items-center gap-2 mt-2">
          {isImage ? (
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
                    <DropdownMenuItem onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Copy Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ) : (
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
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => window.open(metadata?.url, '_blank')}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      );
    }
    
    return <p>{content}</p>;
  };

  return (
    <div className="bg-muted p-3 rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <Avatar className="h-6 w-6">
          <AvatarFallback>
            {sender?.first_name?.[0]}
            {sender?.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">
          {sender?.first_name} {sender?.last_name}
        </span>
        <span className="text-xs text-muted-foreground">
          {new Date(created_at).toLocaleString()}
        </span>
      </div>
      {renderContent()}
    </div>
  );
}
