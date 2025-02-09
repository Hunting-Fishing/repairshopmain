
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

const workOrderSchema = z.object({
  customerId: z.string().min(1, "Customer selection is required"),
  vehicleInfo: z.string().min(1, "Vehicle information is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  jobTemplate: z.string().optional(),
});

type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

export function NewWorkOrderDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

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
      if (!user?.id) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You must be logged in to create work orders.",
        });
        return;
      }

      if (!profile?.organization_id) {
        toast({
          variant: "destructive",
          title: "Profile Error",
          description: "Organization information not found. Please try again later.",
        });
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

      toast({
        title: "Success",
        description: "Work order has been successfully created.",
      });
      setOpen(false);
      form.reset();
    } catch (error: any) {
      console.error("Error in work order creation:", error);
      toast({
        variant: "destructive",
        title: "Error Creating Work Order",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    }
  };

  if (profileError) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load profile information. Please refresh the page.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={profileLoading}>
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
            <Button 
              type="submit" 
              className="w-full"
              disabled={profileLoading || !profile?.organization_id}
            >
              Create Work Order
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
