import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { UserCircle } from "lucide-react";

export function RoleManagement() {
  const { data: staffMembers } = useQuery({
    queryKey: ["staff-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, role")
        .order("role");
      
      if (error) throw error;
      return data;
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
                  <Badge className={getRoleBadgeColor(member.role)}>
                    {member.role.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}