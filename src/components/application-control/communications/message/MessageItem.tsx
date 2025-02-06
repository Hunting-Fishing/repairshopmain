
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CustomerSearchCommand } from "@/components/search/CustomerSearchCommand";
import { 
  MoreVertical, 
  Download, 
  Eye, 
  Share2, 
  FileIcon, 
  Forward,
  Save,
  Send,
  UserCircle2,
  MessageSquare,
  Users,
  AlertCircle 
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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
  id: string;
}

export function MessageItem({ id, content, content_type, metadata, sender, created_at }: MessageItemProps) {
  const [isForwardDialogOpen, setIsForwardDialogOpen] = useState(false);
  const [workOrderId, setWorkOrderId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const { toast } = useToast();

  // Fetch active work orders
  const { data: workOrders } = useQuery({
    queryKey: ["workOrders", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_repair_jobs")
        .select("id, description, status")
        .eq("status", "in-progress");
      
      if (error) throw error;
      return data;
    }
  });

  const handleDownload = async () => {
    if (metadata?.url) {
      const link = document.createElement('a');
      link.href = metadata.url;
      link.download = content;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "File downloaded successfully",
      });
    }
  };

  const handleShare = async () => {
    if (metadata?.url) {
      await navigator.clipboard.writeText(metadata.url);
      toast({
        title: "Success",
        description: "Link copied to clipboard",
      });
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };

  const handleSaveToWorkOrder = async () => {
    if (!workOrderId.trim()) {
      toast({
        title: "Error",
        description: "Please select a work order",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("work_order_attachments")
        .insert({
          work_order_id: workOrderId,
          file_url: metadata?.url,
          file_name: content,
          original_message_id: id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `File saved to work order #${workOrderId}`,
      });
      setWorkOrderId("");
      setIsForwardDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save to work order",
        variant: "destructive",
      });
    }
  };

  const handleSaveToCustomerFile = async () => {
    if (!selectedCustomerId) {
      toast({
        title: "Error",
        description: "Please select a customer first",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("customer_attachments")
        .insert({
          file_url: metadata?.url,
          file_name: content,
          original_message_id: id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "File saved to customer records",
      });
      setSelectedCustomerId("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save to customer records",
        variant: "destructive",
      });
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
                    <DropdownMenuSeparator />
                    <Dialog open={isForwardDialogOpen} onOpenChange={setIsForwardDialogOpen}>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Forward className="mr-2 h-4 w-4" />
                          Forward
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Forward File</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">Send to Work Order</h4>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Enter Work Order #"
                                value={workOrderId}
                                onChange={(e) => setWorkOrderId(e.target.value)}
                              />
                              <Button onClick={handleSaveToWorkOrder}>
                                <Send className="h-4 w-4 mr-2" />
                                Send
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Forward to:</h4>
                            <div className="space-y-2">
                              <Button variant="outline" className="w-full justify-start" onClick={handleSaveToCustomerFile}>
                                <UserCircle2 className="mr-2 h-4 w-4" />
                                Customer File
                              </Button>
                              <Button variant="outline" className="w-full justify-start">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Other Chat
                              </Button>
                              <Button variant="outline" className="w-full justify-start">
                                <Users className="mr-2 h-4 w-4" />
                                Group
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <DropdownMenuItem onClick={handleSaveToCustomerFile}>
                      <Save className="mr-2 h-4 w-4" />
                      Save to Customer File
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
                <DropdownMenuContent align="end">
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
                  <DropdownMenuSeparator />
                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Forward className="mr-2 h-4 w-4" />
                        Forward
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Forward File</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Send to Work Order</h4>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter Work Order #"
                              value={workOrderId}
                              onChange={(e) => setWorkOrderId(e.target.value)}
                            />
                            <Button onClick={handleSaveToWorkOrder}>
                              <Send className="h-4 w-4 mr-2" />
                              Send
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Forward to:</h4>
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start" onClick={handleSaveToCustomerFile}>
                              <UserCircle2 className="mr-2 h-4 w-4" />
                              Customer File
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Other Chat
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <Users className="mr-2 h-4 w-4" />
                              Group
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <DropdownMenuItem onClick={handleSaveToCustomerFile}>
                    <Save className="mr-2 h-4 w-4" />
                    Save to Customer File
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

      <Dialog open={isForwardDialogOpen} onOpenChange={setIsForwardDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Forward File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <h4 className="font-medium">Send to Work Order</h4>
              <div className="flex gap-2">
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={workOrderId}
                  onChange={(e) => setWorkOrderId(e.target.value)}
                >
                  <option value="">Select a work order...</option>
                  {workOrders?.map((wo) => (
                    <option key={wo.id} value={wo.id}>
                      #{wo.id} - {wo.description}
                    </option>
                  ))}
                </select>
                <Button onClick={handleSaveToWorkOrder}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Forward to:</h4>
              <div className="space-y-2">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Select Customer</h4>
                  <CustomerSearchCommand onSelect={handleCustomerSelect} />
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={handleSaveToCustomerFile}
                    disabled={!selectedCustomerId}
                  >
                    <UserCircle2 className="mr-2 h-4 w-4" />
                    Save to Customer File
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "This feature will be available soon",
                    });
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Other Chat
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "This feature will be available soon",
                    });
                  }}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Group
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
