
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { RichTextEditor } from "../RichTextEditor";
import { SendEmailFormData } from "./types";

interface EmailFormProps {
  form: UseFormReturn<SendEmailFormData>;
  isScheduled: boolean;
  isPending: boolean;
  customerEmail?: string;
}

export function EmailForm({ form, isScheduled, isPending, customerEmail }: EmailFormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="to">To</Label>
        <Input
          id="to"
          {...form.register("to")}
          defaultValue={customerEmail}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          {...form.register("subject")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Message</Label>
        <RichTextEditor
          content={form.watch("content") || ""}
          onChange={(content) => form.setValue("content", content)}
          onVariableSelect={(variable) => {
            const editor = form.getValues("content");
            form.setValue("content", editor + " " + variable);
          }}
          availableVariables={[
            "{{customer_name}}",
            "{{customer_email}}",
            "{{customer_phone}}"
          ]}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full"
        disabled={isPending}
      >
        {isPending 
          ? (isScheduled ? "Scheduling..." : "Sending...") 
          : (isScheduled ? "Schedule Email" : "Send Email")}
      </Button>
    </>
  );
}
