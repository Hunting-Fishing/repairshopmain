
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEmailTemplates } from "../hooks/useEmailTemplates";
import type { EmailTemplate } from "../types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TemplateBasicInfo } from "./template-editor/TemplateBasicInfo";
import { ContentEditor } from "./template-editor/ContentEditor";
import { NotificationSettings } from "./template-editor/NotificationSettings";
import { ApprovalSettings } from "./template-editor/ApprovalSettings";
import { toast } from "sonner";

interface TemplateEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: EmailTemplate;
}

export function TemplateEditor({
  open,
  onOpenChange,
  template,
}: TemplateEditorProps) {
  const [name, setName] = useState(template?.name || "");
  const [subject, setSubject] = useState(template?.subject || "");
  const [content, setContent] = useState(template?.content || "");
  const [categoryId, setCategoryId] = useState(template?.category_id || "");
  const [status, setStatus] = useState<EmailTemplate["status"]>(template?.status || "draft");
  const [notificationSettings, setNotificationSettings] = useState(
    template?.notification_settings || {
      notify_on_send: false,
      notify_on_error: true,
    }
  );
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(
    template?.notification_recipients?.map((r) => r.recipient_id) || []
  );
  const [approvalRequired, setApprovalRequired] = useState(
    template?.approval_required || false
  );
  const [approvalStatus, setApprovalStatus] = useState(
    template?.approval_status || "draft"
  );
  const { session } = useAuth();
  const { categories, createTemplate, updateTemplate } = useEmailTemplates();

  const handleRequestApproval = async () => {
    if (!template?.id) return;
    
    try {
      const { error } = await supabase
        .from('email_templates')
        .update({
          approval_status: 'pending_review',
          review_requested_at: new Date().toISOString(),
          review_requested_by: session?.user?.id,
        })
        .eq('id', template.id);

      if (error) throw error;
      
      setApprovalStatus('pending_review');
      toast.success("Approval request submitted successfully");
    } catch (error) {
      console.error("Error requesting approval:", error);
      toast.error("Failed to request approval");
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', session?.user?.id)
        .single();

      if (!profile?.organization_id) {
        throw new Error('Organization not found');
      }

      const templateData = {
        name,
        subject,
        content,
        category_id: categoryId || null,
        status,
        variables: [],
        is_default: false,
        is_archived: false,
        organization_id: profile.organization_id,
        notification_settings: notificationSettings,
        notification_recipients: selectedRecipients.map(id => ({ recipient_id: id })),
        approval_status: approvalStatus,
        approval_required: approvalRequired,
      };

      if (template) {
        await updateTemplate.mutateAsync({
          id: template.id,
          ...templateData,
        });
      } else {
        await createTemplate.mutateAsync(templateData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {template ? "Edit Template" : "Create New Template"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <TemplateBasicInfo
            name={name}
            setName={setName}
            subject={subject}
            setSubject={setSubject}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            categories={categories}
          />

          <ContentEditor
            content={content}
            setContent={setContent}
            templateId={template?.id}
            selectedRecipients={selectedRecipients}
            onRecipientsChange={setSelectedRecipients}
          />

          <NotificationSettings
            notificationSettings={notificationSettings}
            setNotificationSettings={setNotificationSettings}
          />

          <ApprovalSettings
            templateId={template?.id || ""}
            categoryId={categoryId}
            approvalRequired={approvalRequired}
            setApprovalRequired={setApprovalRequired}
            approvalStatus={approvalStatus}
            onRequestApproval={handleRequestApproval}
            approvedBy={template?.approved_by}
            approvedAt={template?.approved_at}
            reviewRequestedBy={template?.review_requested_by}
            reviewRequestedAt={template?.review_requested_at}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setStatus("draft");
              handleSubmit();
            }}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => {
              setStatus("active");
              handleSubmit();
            }}
            disabled={!name || !subject || !content || (approvalRequired && approvalStatus !== 'approved')}
          >
            {template ? "Update" : "Create"} Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
