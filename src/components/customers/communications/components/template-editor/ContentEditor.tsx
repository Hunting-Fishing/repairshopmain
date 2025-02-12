
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "../RichTextEditor";

interface ContentEditorProps {
  content: string;
  setContent: (content: string) => void;
}

export function ContentEditor({ content, setContent }: ContentEditorProps) {
  return (
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
  );
}
