
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, XCircle, AlertCircle, Users } from "lucide-react";
import type { ApprovalStatus } from "../../types/template-system";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApproverManagement } from "./ApproverManagement";

interface ApprovalSettingsProps {
  templateId: string;
  categoryId?: string;
  approvalRequired: boolean;
  setApprovalRequired: (required: boolean) => void;
  approvalStatus: ApprovalStatus;
  onRequestApproval?: () => void;
  approvedBy?: string;
  approvedAt?: string;
  reviewRequestedBy?: string;
  reviewRequestedAt?: string;
  approvalLevel?: "primary" | "secondary" | "final";
  onApprovalLevelChange?: (level: "primary" | "secondary" | "final") => void;
}

export function ApprovalSettings({
  templateId,
  categoryId,
  approvalRequired,
  setApprovalRequired,
  approvalStatus,
  onRequestApproval,
  approvedBy,
  approvedAt,
  reviewRequestedBy,
  reviewRequestedAt,
  approvalLevel = "primary",
  onApprovalLevelChange,
}: ApprovalSettingsProps) {
  const getStatusBadge = () => {
    switch (approvalStatus) {
      case "approved":
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </Badge>
        );
      case "pending_review":
        return (
          <Badge variant="secondary">
            <Clock className="w-4 h-4 mr-1" />
            Pending Review
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="w-4 h-4 mr-1" />
            Draft
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
        <h3 className="font-medium text-sm">Approval Settings</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="approval_required">Require Approval</Label>
            <p className="text-sm text-gray-500">
              Template changes will need approval before becoming active
            </p>
          </div>
          <Switch
            id="approval_required"
            checked={approvalRequired}
            onCheckedChange={setApprovalRequired}
          />
        </div>

        {approvalRequired && (
          <div className="space-y-2 border-t pt-2">
            <Label htmlFor="approval_level">Approval Level Required</Label>
            <Select 
              value={approvalLevel} 
              onValueChange={onApprovalLevelChange}
            >
              <SelectTrigger id="approval_level" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Primary Approval
                  </div>
                </SelectItem>
                <SelectItem value="secondary">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Secondary Approval
                  </div>
                </SelectItem>
                <SelectItem value="final">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Final Approval
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Status</span>
            {getStatusBadge()}
          </div>

          {approvalStatus === "draft" && approvalRequired && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onRequestApproval}
            >
              Request Approval
            </Button>
          )}

          {approvalStatus === "pending_review" && reviewRequestedBy && reviewRequestedAt && (
            <div className="text-sm text-muted-foreground">
              Review requested by {reviewRequestedBy} on{" "}
              {new Date(reviewRequestedAt).toLocaleDateString()}
            </div>
          )}

          {approvalStatus === "approved" && approvedBy && approvedAt && (
            <div className="text-sm text-muted-foreground">
              Approved by {approvedBy} on{" "}
              {new Date(approvedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {approvalRequired && (
        <ApproverManagement templateId={templateId} categoryId={categoryId} />
      )}
    </div>
  );
}
