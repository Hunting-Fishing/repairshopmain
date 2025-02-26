
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { CustomerRelationship } from "../types/customerTypes";
import { supabase } from "@/integrations/supabase/client";
import { CustomerRelationshipDialog } from "./CustomerRelationshipDialog";
import { RelationshipHierarchyView } from "./RelationshipHierarchyView";
import { useToast } from "@/hooks/use-toast";

interface CustomerRelationshipsProps {
  customerId: string;
}

export function CustomerRelationships({ customerId }: CustomerRelationshipsProps) {
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: relationships, isLoading } = useQuery({
    queryKey: ["customer-relationships", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_relationship_hierarchy")
        .select("*")
        .or(`parent_customer_id.eq.${customerId},related_customer_id.eq.${customerId}`);

      if (error) throw error;
      return data as CustomerRelationship[];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (relationshipId: string) => {
      const { error } = await supabase
        .from("customer_relationships")
        .delete()
        .eq("id", relationshipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-relationships"] });
      toast({
        title: "Relationship deleted",
        description: "The relationship has been removed successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete relationship: " + error.message,
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return <div className="p-4">Loading relationships...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Related Accounts</h3>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Relationship
        </Button>
      </div>

      {relationships?.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>No relationships found</p>
          <p className="text-sm">Add relationships to connect this customer with others</p>
        </div>
      ) : (
        <RelationshipHierarchyView 
          relationships={relationships} 
          onDelete={(id) => {
            if (confirm("Are you sure you want to delete this relationship?")) {
              deleteMutation.mutate(id);
            }
          }}
        />
      )}

      <CustomerRelationshipDialog
        customerId={customerId}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </div>
  );
}
