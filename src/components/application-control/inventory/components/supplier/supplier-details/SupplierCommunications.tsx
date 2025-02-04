import { useState, useCallback } from "react";
import { MessageSquare, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSupplierRealtime } from "../hooks/useSupplierRealtime";
import { supabase } from "@/integrations/supabase/client";
import type { InventorySupplier, SupplierMessage } from "../../../types";

interface SupplierCommunicationsProps {
  supplier: InventorySupplier;
}

export function SupplierCommunications({ supplier }: SupplierCommunicationsProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<SupplierMessage[]>([]);
  const [priority, setPriority] = useState<string>("normal");
  const [category, setCategory] = useState<string>("general");
  const [responseRequired, setResponseRequired] = useState(false);

  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from('supplier_communications')
      .select('*')
      .eq('supplier_id', supplier.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);
  }, [supplier.id]);

  // Setup realtime updates
  useSupplierRealtime(supplier.id, fetchMessages);

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
          priority,
          category,
          response_required: responseRequired,
          status: 'sent'
        });

      if (error) throw error;

      toast.success('Message sent successfully');
      setMessage("");
      fetchMessages();
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
          <div className="min-h-[200px] max-h-[300px] overflow-y-auto border rounded-md p-4 space-y-4">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={msg.priority === 'high' ? 'destructive' : 'secondary'}>
                        {msg.priority}
                      </Badge>
                      <Badge variant="outline">{msg.category}</Badge>
                    </div>
                    {msg.response_required && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Response Required
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                  <p className="mt-1">{msg.message_content}</p>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                No messages yet
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="order">Order</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="responseRequired"
                checked={responseRequired}
                onCheckedChange={setResponseRequired}
              />
              <Label htmlFor="responseRequired">Response Required</Label>
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
        </div>
      </CardContent>
    </Card>
  );
}