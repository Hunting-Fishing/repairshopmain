
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, FileText, Bell, Plus } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface CustomerCommunicationsProps {
  customerId: string;
}

interface SendSMSFormData {
  phoneNumber: string;
  message: string;
}

export function CustomerCommunications({ customerId }: CustomerCommunicationsProps) {
  const queryClient = useQueryClient();
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);
  const form = useForm<SendSMSFormData>();

  const { data: communications, isLoading } = useQuery({
    queryKey: ["communications", customerId],
    queryFn: async () => {
      const [messagesResponse, smsResponse] = await Promise.all([
        supabase
          .from("customer_communications")
          .select(`
            *,
            sender:profiles(first_name, last_name)
          `)
          .eq("customer_id", customerId)
          .order("sent_at", { ascending: false }),
        supabase
          .from("sms_messages")
          .select("*")
          .eq("customer_id", customerId)
          .order("sent_at", { ascending: false })
      ]);

      if (messagesResponse.error) throw messagesResponse.error;
      if (smsResponse.error) throw smsResponse.error;

      return {
        messages: messagesResponse.data,
        sms: smsResponse.data
      };
    },
  });

  const { data: customer } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const sendSMSMutation = useMutation({
    mutationFn: async (data: SendSMSFormData) => {
      const response = await supabase.functions.invoke('send-sms', {
        body: {
          to: data.phoneNumber,
          content: data.message,
          customerId,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success("SMS sent successfully");
      setIsSMSDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["communications", customerId] });
    },
    onError: (error) => {
      toast.error(`Failed to send SMS: ${error.message}`);
    },
  });

  const handleSendSMS = form.handleSubmit((data) => {
    sendSMSMutation.mutate(data);
  });

  const getIcon = (type: string) => {
    const icons = {
      email: <Mail className="h-4 w-4" />,
      sms: <MessageSquare className="h-4 w-4" />,
      docusign: <FileText className="h-4 w-4" />,
      notification: <Bell className="h-4 w-4" />,
    };
    return icons[type as keyof typeof icons];
  };

  if (isLoading) return <div>Loading communications...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Communications</h2>
        <div className="space-x-2">
          <Dialog open={isSMSDialogOpen} onOpenChange={setIsSMSDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send SMS
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send SMS Message</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSendSMS} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    {...form.register("phoneNumber")}
                    defaultValue={customer?.phone_number}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    {...form.register("message")}
                    rows={4}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={sendSMSMutation.isPending}
                >
                  {sendSMSMutation.isPending ? "Sending..." : "Send SMS"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Communication
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {[...(communications?.messages ?? []), ...(communications?.sms ?? [])].sort((a, b) => {
          const dateA = new Date(a.sent_at);
          const dateB = new Date(b.sent_at);
          return dateB.getTime() - dateA.getTime();
        }).map((comm) => (
          <Card key={comm.id}>
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              {getIcon(comm.type ?? 'sms')}
              <CardTitle className="text-sm font-medium">
                {'type' in comm ? comm.type.charAt(0).toUpperCase() + comm.type.slice(1) : 'SMS'}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {format(new Date(comm.sent_at), "PPp")}
              </div>
              {'status' in comm && (
                <div className={`text-sm ml-auto ${
                  comm.status === 'delivered' ? 'text-green-600' :
                  comm.status === 'failed' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {comm.status}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="text-sm">{comm.content}</div>
                {'sender' in comm && (
                  <div className="text-sm text-muted-foreground">
                    Sent by: {comm.sender.first_name} {comm.sender.last_name}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
