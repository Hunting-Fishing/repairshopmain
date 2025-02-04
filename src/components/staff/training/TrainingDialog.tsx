import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignmentRuleFormSchema } from "./schema";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { TrainingFormFields } from "./form/TrainingFormFields";
import { TrainingDateFields } from "./form/TrainingDateFields";

interface TrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrainingDialog({ open, onOpenChange }: TrainingDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(assignmentRuleFormSchema),
    defaultValues: {
      training_name: "",
      description: "",
      completion_date: undefined,
      expiry_date: undefined,
    },
  });

  const onSubmit = async (values: any) => {
    const { error } = await supabase
      .from("staff_training")
      .insert(values);

    if (error) {
      toast({
        title: "Error creating training record",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Training record created",
      description: "The training record has been created successfully.",
    });
    
    queryClient.invalidateQueries({ queryKey: ["staff-training"] });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Training Record</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TrainingFormFields />
            <TrainingDateFields />
            <DialogFooter>
              <Button type="submit">Add Training</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}