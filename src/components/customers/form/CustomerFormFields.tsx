
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomerFormFieldsProps {
  form: UseFormReturn<CustomerFormValues>;
}

export const CustomerFormFields = ({ form }: CustomerFormFieldsProps) => (
  <div className="space-y-4">
    <FormField
      control={form.control}
      name="customer_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium">Customer Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-colors">
                <SelectValue placeholder="Select customer type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="Personal">Personal</SelectItem>
              <SelectItem value="Fleet">Fleet</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage className="text-[#F97316]" />
        </FormItem>
      )}
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">First Name</FormLabel>
            <FormControl>
              <Input {...field} className="bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-colors" />
            </FormControl>
            <FormMessage className="text-[#F97316]" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">Last Name</FormLabel>
            <FormControl>
              <Input {...field} className="bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-colors" />
            </FormControl>
            <FormMessage className="text-[#F97316]" />
          </FormItem>
        )}
      />
    </div>
    
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
          <FormControl>
            <Input type="email" {...field} className="bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-colors" />
          </FormControl>
          <FormMessage className="text-[#F97316]" />
        </FormItem>
      )}
    />
    
    <FormField
      control={form.control}
      name="phone_number"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium">Phone Number</FormLabel>
          <FormControl>
            <Input {...field} className="bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-colors" />
          </FormControl>
          <FormMessage className="text-[#F97316]" />
        </FormItem>
      )}
    />
  </div>
);
