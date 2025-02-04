import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { InventorySupplier } from "../../../types";

interface SupplierCommunicationsProps {
  supplier: InventorySupplier;
}

export function SupplierCommunications({ supplier }: SupplierCommunicationsProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      setIsSending(true);

      const { error } = await supabase
        .from('supplier_communications')
        .insert({
          supplier_id: supplier.id,
          organization_id: supplier.organization_id,
          message_type: 'general',
          message_content: message.trim(),
        });

      if (error) throw error;

      toast.success('Message sent successfully');
      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Communications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="min-h-[200px] max-h-[300px] overflow-y-auto border rounded-md p-4">
            {/* Messages will be displayed here */}
            <div className="text-sm text-muted-foreground text-center py-4">
              No messages yet
            </div>
          </div>

          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px]"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={isSending || !message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}