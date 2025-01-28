import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function CustomRoleDialog() {
  const [open, setOpen] = useState(false);
  const [roleName, setRoleName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      const { error } = await supabase
        .from("custom_roles")
        .insert([
          { 
            name: roleName,
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
          <div>
            <Input
              placeholder="Role name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Create Role</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}