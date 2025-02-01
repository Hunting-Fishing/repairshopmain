import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkOrderForm } from "./WorkOrderForm";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const workOrderSchema = z.object({
  customerId: z.string().min(1, "Customer selection is required"),
  vehicleInfo: z.string().min(1, "Vehicle information is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});

type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

export function NewWorkOrderDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      customerId: "",
      vehicleInfo: "",
      jobDescription: "",
    },
  });

  const onSubmit = async (data: WorkOrderFormValues) => {
    try {
      console.log("Form data:", data);
      // TODO: Implement work order creation
      toast({
        title: "Work Order Created",
        description: "The work order has been successfully created.",
      });
      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Work Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Work Order</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <WorkOrderForm form={form} />
            <Button type="submit" className="w-full">Create Work Order</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}