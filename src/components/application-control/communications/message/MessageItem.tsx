
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMessageActions } from "./message-actions/useMessageActions";
import { ForwardDialog } from "./message-dialogs/ForwardDialog";
import { FileContent } from "./message-content/FileContent";

interface MessageItemProps {
  id: string;
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

export function MessageItem({ 
  id, 
  content, 
  content_type, 
  metadata, 
  sender, 
  created_at 
}: MessageItemProps) {
  const {
    isForwardDialogOpen,
    setIsForwardDialogOpen,
    workOrderId,
    setWorkOrderId,
    selectedCustomerId,
    setSelectedCustomerId,
    workOrders,
    handleDownload,
    handleShare,
    handleSaveToWorkOrder,
    handleSaveToCustomerFile,
  } = useMessageActions(id, metadata);

  const renderContent = () => {
    if (content_type === 'file') {
      return (
        <FileContent
          content={content}
          metadata={metadata}
          onDownload={handleDownload}
          onShare={handleShare}
          onForward={() => setIsForwardDialogOpen(true)}
          onSaveToCustomerFile={handleSaveToCustomerFile}
        />
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

      <ForwardDialog
        isOpen={isForwardDialogOpen}
        onOpenChange={setIsForwardDialogOpen}
        workOrderId={workOrderId}
        onWorkOrderIdChange={setWorkOrderId}
        onCustomerSelect={setSelectedCustomerId}
        onSaveToWorkOrder={handleSaveToWorkOrder}
        onSaveToCustomerFile={handleSaveToCustomerFile}
        workOrders={workOrders}
      />
    </div>
  );
}
