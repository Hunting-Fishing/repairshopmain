
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "./RichTextEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmailTemplates } from "../hooks/useEmailTemplates";
import type { EmailTemplate } from "../types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";

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
  const { session } = useAuth();
  const { categories, createTemplate, updateTemplate } = useEmailTemplates();

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
        organization_id: profile.organization_id,
        notification_settings: notificationSettings,
        notification_recipients: [],
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter template name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
            />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              onVariableSelect={(variable) => {
                // Handle variable insertion
              }}
            />
          </div>

          <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium text-sm">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify_on_send">Notify on Send</Label>
                  <p className="text-sm text-gray-500">
                    Receive notifications when this template is sent
                  </p>
                </div>
                <Switch
                  id="notify_on_send"
                  checked={notificationSettings.notify_on_send}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      notify_on_send: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify_on_error">Notify on Error</Label>
                  <p className="text-sm text-gray-500">
                    Receive notifications when sending fails
                  </p>
                </div>
                <Switch
                  id="notify_on_error"
                  checked={notificationSettings.notify_on_error}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      notify_on_error: checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>
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
            disabled={!name || !subject || !content}
          >
            {template ? "Update" : "Create"} Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
