
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const useMessageActions = (id: string, metadata?: { url?: string; type?: string; }) => {
  const [isForwardDialogOpen, setIsForwardDialogOpen] = useState(false);
  const [workOrderId, setWorkOrderId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const { toast } = useToast();

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
      link.download = '';
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
          file_name: '',
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
          customer_id: selectedCustomerId,
          file_url: metadata?.url,
          file_name: '',
          original_message_id: id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "File saved to customer records",
      });
      setSelectedCustomerId("");
      setIsForwardDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save to customer records",
        variant: "destructive",
      });
    }
  };

  return {
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
  };
};
