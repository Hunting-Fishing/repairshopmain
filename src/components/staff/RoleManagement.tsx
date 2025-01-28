import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserCircle, PencilIcon, Check, X } from "lucide-react";
import { useState } from "react";

type StaffMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: "owner" | "management" | "technician" | "service_advisor" | "parts" | "hr" | "custom";
};

export function RoleManagement() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: staffMembers } = useQuery({
    queryKey: ["staff-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, role")
        .order("role");
      
      if (error) throw error;
      return data as StaffMember[];
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: StaffMember["role"] }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
      toast.success("Role updated successfully");
      setEditingId(null);
    },
    onError: (error) => {
      toast.error("Failed to update role");
      console.error("Error updating role:", error);
    },
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-500";
      case "management":
        return "bg-blue-500";
      case "technician":
        return "bg-green-500";
      case "service_advisor":
        return "bg-yellow-500";
      case "parts":
        return "bg-orange-500";
      case "hr":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  const roles: StaffMember["role"][] = [
    "owner",
    "management",
    "technician",
    "service_advisor",
    "parts",
    "hr",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Roles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {staffMembers?.map((member) => (
            <div key={member.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <UserCircle className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {member.first_name} {member.last_name}
                  </p>
                  {editingId === member.id ? (
                    <div className="flex items-center space-x-2">
                      <Select
                        defaultValue={member.role}
                        onValueChange={(value: StaffMember["role"]) => {
                          updateRole.mutate({ userId: member.id, newRole: value });
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role.replace("_", " ").toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleBadgeColor(member.role)}>
                        {member.role.replace("_", " ").toUpperCase()}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(member.id)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}