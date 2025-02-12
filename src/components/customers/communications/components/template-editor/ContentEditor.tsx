
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "../RichTextEditor";
import { NotificationRecipients } from "./NotificationRecipients";

interface ContentEditorProps {
  content: string;
  setContent: (content: string) => void;
  templateId?: string;
  selectedRecipients: string[];
  onRecipientsChange: (recipients: string[]) => void;
}

export function ContentEditor({ 
  content, 
  setContent, 
  templateId,
  selectedRecipients,
  onRecipientsChange 
}: ContentEditorProps) {
  return (
    <div className="space-y-6">
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
      
      {templateId && (
        <NotificationRecipients
          templateId={templateId}
          selectedRecipients={selectedRecipients}
          onRecipientsChange={onRecipientsChange}
        />
      )}
    </div>
  );
}
