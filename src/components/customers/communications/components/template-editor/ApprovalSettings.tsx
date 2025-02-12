
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { ApprovalStatus } from "../../types/template-system";

interface ApprovalSettingsProps {
  approvalRequired: boolean;
  setApprovalRequired: (required: boolean) => void;
  approvalStatus: ApprovalStatus;
  onRequestApproval?: () => void;
  approvedBy?: string;
  approvedAt?: string;
  reviewRequestedBy?: string;
  reviewRequestedAt?: string;
}

export function ApprovalSettings({
  approvalRequired,
  setApprovalRequired,
  approvalStatus,
  onRequestApproval,
  approvedBy,
  approvedAt,
  reviewRequestedBy,
  reviewRequestedAt,
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
    <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
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

        {approvalStatus === "pending_review" && (
          <div className="text-sm text-muted-foreground">
            Review requested by {reviewRequestedBy} on{" "}
            {new Date(reviewRequestedAt!).toLocaleDateString()}
          </div>
        )}

        {approvalStatus === "approved" && (
          <div className="text-sm text-muted-foreground">
            Approved by {approvedBy} on{" "}
            {new Date(approvedAt!).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
