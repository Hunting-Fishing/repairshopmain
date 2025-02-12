
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UserCircle } from "lucide-react";

interface NotificationRecipientsProps {
  templateId: string;
  selectedRecipients: string[];
  onRecipientsChange: (recipients: string[]) => void;
}

export function NotificationRecipients({
  templateId,
  selectedRecipients,
  onRecipientsChange,
}: NotificationRecipientsProps) {
  const { toast } = useToast();

  const { data: staff, isLoading } = useQuery({
    queryKey: ["staff-members"],
    queryFn: async () => {
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("organization_id")
        .single();

      if (!userProfile?.organization_id) {
        throw new Error("No organization found");
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, role")
        .eq("organization_id", userProfile.organization_id)
        .eq("status", "active");

      if (error) throw error;
      return data;
    },
  });

  const handleRecipientToggle = (recipientId: string) => {
    const newRecipients = selectedRecipients.includes(recipientId)
      ? selectedRecipients.filter((id) => id !== recipientId)
      : [...selectedRecipients, recipientId];
    onRecipientsChange(newRecipients);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <UserCircle className="h-4 w-4" />
        <span>Notification Recipients</span>
      </div>
      <ScrollArea className="h-[200px] rounded-md border p-4">
        <div className="space-y-4">
          {staff?.map((member) => (
            <div key={member.id} className="flex items-center space-x-2">
              <Checkbox
                id={member.id}
                checked={selectedRecipients.includes(member.id)}
                onCheckedChange={() => handleRecipientToggle(member.id)}
              />
              <label
                htmlFor={member.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {member.first_name} {member.last_name} ({member.role})
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
