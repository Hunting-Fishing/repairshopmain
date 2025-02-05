
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, FileText, Bell, Plus } from "lucide-react";
import { format } from "date-fns";

interface CustomerCommunicationsProps {
  customerId: string;
}

export function CustomerCommunications({ customerId }: CustomerCommunicationsProps) {
  const { data: communications, isLoading } = useQuery({
    queryKey: ["communications", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_communications")
        .select(`
          *,
          sender:profiles(first_name, last_name)
        `)
        .eq("customer_id", customerId)
        .order("sent_at", { ascending: false });

      if (error) throw error;
      return data;
    },
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Communication
        </Button>
      </div>

      <div className="grid gap-4">
        {communications?.map((comm) => (
          <Card key={comm.id}>
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              {getIcon(comm.type)}
              <CardTitle className="text-sm font-medium">
                {comm.type.charAt(0).toUpperCase() + comm.type.slice(1)}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {format(new Date(comm.sent_at), "PPp")}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="text-sm">{comm.content}</div>
                <div className="text-sm text-muted-foreground">
                  Sent by: {comm.sender.first_name} {comm.sender.last_name}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
