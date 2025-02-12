
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTemplateApprovers } from "../../hooks/useTemplateApprovers";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, X } from "lucide-react";

interface ApproverManagementProps {
  templateId: string;
  categoryId?: string;
}

export function ApproverManagement({ templateId, categoryId }: ApproverManagementProps) {
  const { approvers, isLoading, addApprover, removeApprover, updateApprover } = useTemplateApprovers();
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const handleAddApprover = async () => {
    if (!selectedUserId) return;

    await addApprover.mutateAsync({
      user_id: selectedUserId,
      organization_id: "organization_id", // This should come from context or props
      can_approve_all: false,
      category_ids: categoryId ? [categoryId] : [],
      allowed_approval_levels: ["primary"],
    });

    setSelectedUserId("");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Approvers</CardTitle>
        <CardDescription>
          Manage who can approve changes to this template
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {/* This should be populated with users from your organization */}
                <SelectItem value="user1">John Doe</SelectItem>
                <SelectItem value="user2">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleAddApprover}
              disabled={!selectedUserId}
              size="sm"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Approver
            </Button>
          </div>

          <div className="space-y-2">
            {approvers.map((approver) => (
              <div
                key={approver.id}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span>{approver.profiles?.first_name} {approver.profiles?.last_name}</span>
                  {approver.can_approve_all && (
                    <Badge variant="secondary">Can approve all</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Approve all
                    </span>
                    <Switch
                      checked={approver.can_approve_all}
                      onCheckedChange={(checked) =>
                        updateApprover.mutate({
                          id: approver.id,
                          can_approve_all: checked,
                        })
                      }
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeApprover.mutate(approver.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
