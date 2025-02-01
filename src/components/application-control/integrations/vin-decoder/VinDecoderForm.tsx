import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { VehicleInfo } from "../NhtsaVinDialog";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  vin: z.string().length(17, {
    message: "VIN must be exactly 17 characters long",
  }),
});

interface VinDecoderFormProps {
  onVehicleInfo: (info: VehicleInfo) => void;
  onClose: () => void;
}

export const VinDecoderForm = ({ onVehicleInfo, onClose }: VinDecoderFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vin: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      console.log("Fetching VIN data for:", values.vin);
      
      const { data: functionData, error: functionError } = await supabase.functions.invoke('vehicle-info', {
        body: {
          type: "decode",
          vin: values.vin,
        }
      });

      if (functionError) throw functionError;

      console.log("Raw NHTSA Response:", functionData);

      if (functionData.Results) {
        const vehicleInfo: VehicleInfo = {
          Make: '',
          Model: '',
          ModelYear: '',
          Trim: '',
          VehicleType: '',
          "Engine Number of Cylinders": '',
          "Displacement (L)": '',
          "Fuel Type - Primary": '',
          "Other Engine Info": '',
          Turbo: '',
          "Body Class": '',
          "Drive Type": '',
          "Gross Vehicle Weight Rating": '',
          "Plant Country": '',
          VIN: values.vin
        };

        // Populate the vehicleInfo object with data from the API response
        functionData.Results.forEach((result: any) => {
          if (result.Value && result.Value !== "Not Applicable" && result.Value.trim() !== "") {
            const key = result.Variable as keyof VehicleInfo;
            if (key in vehicleInfo) {
              vehicleInfo[key] = result.Value.trim();
            }
          }
        });

        console.log("Processed Vehicle Info:", vehicleInfo);
        onVehicleInfo(vehicleInfo);
        
        toast({
          title: "Success",
          description: "Vehicle information retrieved successfully",
        });
      } else {
        throw new Error("Invalid response from NHTSA");
      }
    } catch (error) {
      console.error("Error fetching vehicle information:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch vehicle information. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="vin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Identification Number (VIN)</FormLabel>
              <FormControl>
                <Input placeholder="Enter 17-character VIN" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Decoding..." : "Decode VIN"}
          </Button>
        </div>
      </form>
    </Form>
  );
};