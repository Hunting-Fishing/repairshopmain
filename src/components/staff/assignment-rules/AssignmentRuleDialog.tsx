import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignmentRuleFormSchema } from "./schema";
import { AssignmentRuleForm } from "./AssignmentRuleForm";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface AssignmentRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignmentRuleDialog({ open, onOpenChange }: AssignmentRuleDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(assignmentRuleFormSchema),
    defaultValues: {
      name: "",
      criteria: {},
      priority: 0,
      is_active: true,
    },
  });

  const onSubmit = async (values: any) => {
    const { error } = await supabase
      .from("work_order_assignment_rules")
      .insert(values);

    if (error) {
      toast({
        title: "Error creating rule",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Rule created",
      description: "The assignment rule has been created successfully.",
    });
    
    queryClient.invalidateQueries({ queryKey: ["assignment-rules"] });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Assignment Rule</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AssignmentRuleForm />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}