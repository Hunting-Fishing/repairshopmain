import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AssignmentRuleDialog } from "./AssignmentRuleDialog";
import { AssignmentRulesList } from "./AssignmentRulesList";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function AssignmentRules() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: rules, isLoading } = useQuery({
    queryKey: ["assignment-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("work_order_assignment_rules")
        .select("*")
        .order("priority", { ascending: true });

      if (error) {
        toast({
          title: "Error loading rules",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Assignment Rules</h3>
          <p className="text-sm text-muted-foreground">
            Configure how work orders are automatically assigned to technicians
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      <AssignmentRulesList rules={rules || []} isLoading={isLoading} />
      <AssignmentRuleDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}