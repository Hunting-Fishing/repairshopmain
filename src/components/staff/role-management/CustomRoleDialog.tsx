
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCustomRoles } from "./hooks/useCustomRoles";

export function CustomRoleDialog() {
  const [open, setOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const { data: existingRoles } = useCustomRoles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      // Check for duplicates (case insensitive)
      const isDuplicate = existingRoles?.some(
        role => role.name.toLowerCase() === roleName.toLowerCase()
      );

      if (isDuplicate) {
        toast.error("A role with this name already exists");
        return;
      }

      const { error } = await supabase
        .from("custom_roles")
        .insert([
          { 
            name: roleName.trim(),
            organization_id: session.user.id 
          }
        ]);

      if (error) throw error;

      toast.success("Custom role created successfully");
      setOpen(false);
      setRoleName("");
    } catch (error) {
      console.error("Error creating custom role:", error);
      toast.error("Failed to create custom role");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Plus className="h-4 w-4 mr-1" />
          Add Custom Role
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Custom Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Role name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
            />
            {existingRoles && existingRoles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Existing Custom Roles:</p>
                <ScrollArea className="h-24 rounded-md border">
                  <div className="p-4">
                    {existingRoles.map((role) => (
                      <div key={role.id} className="text-sm py-1">
                        {role.name}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
          <Button type="submit" disabled={!roleName.trim()}>Create Role</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
