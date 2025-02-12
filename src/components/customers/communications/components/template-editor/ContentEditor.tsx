
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "../RichTextEditor";
import { NotificationRecipients } from "./NotificationRecipients";
import { ComponentsLibrary } from "./ComponentsLibrary";
import { VersionHistory } from "./VersionHistory";

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
  const handleInsertComponent = (componentContent: string) => {
    setContent(content + componentContent);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="editor" className="w-full">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          {templateId && <TabsTrigger value="history">History</TabsTrigger>}
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="components">
          <ComponentsLibrary onInsert={handleInsertComponent} />
        </TabsContent>

        {templateId && (
          <TabsContent value="history">
            <VersionHistory templateId={templateId} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
