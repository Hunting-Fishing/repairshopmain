
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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const workOrderSchema = z.object({
  customerId: z.string().min(1, "Customer selection is required"),
  vehicleInfo: z.string().min(1, "Vehicle information is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  jobTemplate: z.string().optional(),
});

type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

export function NewWorkOrderDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile(user?.id);

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
      setIsSubmitting(true);

      if (!user?.id) {
        toast.error("You must be logged in to create work orders");
        return;
      }

      if (!profile?.organization_id) {
        toast.error("Organization information not found");
        return;
      }

      const { error: insertError } = await supabase
        .from('customer_repair_jobs')
        .insert({
          customer_id: data.customerId,
          vehicle_id: data.vehicleInfo,
          description: data.jobDescription,
          job_type: data.jobTemplate || 'general',
          created_by: user.id,
          updated_by: user.id,
          organization_id: profile.organization_id,
          status: 'quoted'
        });

      if (insertError) {
        console.error("Error creating work order:", insertError);
        throw insertError;
      }

      toast.success("Work order created successfully");
      setOpen(false);
      form.reset();
    } catch (error: any) {
      console.error("Error in work order creation:", error);
      toast.error(error.message || "Failed to create work order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonDisabled = profileLoading || !profile?.organization_id || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={buttonDisabled}>
          {profileLoading ? (
            <>
              <LoadingSpinner className="mr-2 h-4 w-4" />
              Loading...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              New Work Order
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Work Order</DialogTitle>
        </DialogHeader>
        {profileError ? (
          <div className="p-4 text-center text-red-500">
            Failed to load profile information. Please try again.
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <WorkOrderForm form={form} />
              <Button 
                type="submit" 
                className="w-full"
                disabled={buttonDisabled}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  'Create Work Order'
                )}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
