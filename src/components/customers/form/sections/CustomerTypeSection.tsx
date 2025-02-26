import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormSection } from "../FormSection";
import { CustomerTypeSelect } from "../fields/CustomerTypeSelect";
import { FormInput } from "../fields/FormInput";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, Hash, Truck, Phone, Mail, CreditCard, FileText, Shield, Car } from "lucide-react";

const businessClassifications = [
  { id: "corp", name: "Corporation" },
  { id: "llc", name: "Limited Liability Company" },
  { id: "partner", name: "Partnership" },
  { id: "sole", name: "Sole Proprietorship" },
  { id: "nonprofit", name: "Non-Profit Organization" }
];

const companySizes = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" }
];

const paymentTermsOptions = [
  { value: "net30", label: "Net 30" },
  { value: "net60", label: "Net 60" },
  { value: "net90", label: "Net 90" },
];

const billingMethods = [
  { value: "email", label: "Email" },
  { value: "mail", label: "Mail" },
  { value: "portal", label: "Online Portal" },
];

interface CustomerTypeSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function CustomerTypeSection({
  form,
  isModernTheme = false,
}: CustomerTypeSectionProps) {
  const customerType = form.watch("customer_type");

  return (
    <FormSection 
      title="Customer Type" 
      description="Select the type of customer and related information"
      isModernTheme={isModernTheme}
    >
      <div className="space-y-6">
        <CustomerTypeSelect 
          form={form} 
          isModernTheme={isModernTheme} 
        />

        {customerType === "Business" && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            <FormInput
              form={form}
              name="company_name"
              label="Company Name"
              placeholder="Enter company name"
              helpText="Legal business name as registered"
              required
              isModernTheme={isModernTheme}
              icon={<Building2 className="h-4 w-4 text-gray-500" />}
            />

            <FormInput
              form={form}
              name="pst_number"
              label="PST Number"
              placeholder="Enter PST number"
              helpText="Provincial Sales Tax number"
              required
              isModernTheme={isModernTheme}
              icon={<Hash className="h-4 w-4 text-gray-500" />}
            />

            <FormField
              control={form.control}
              name="business_classification_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Business Classification
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white rounded-lg">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {businessClassifications.map((classification) => (
                        <SelectItem
                          key={classification.id}
                          value={classification.id}
                          className="cursor-pointer"
                        >
                          {classification.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Company Size
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white rounded-lg">
                        <SelectValue placeholder="Select company size">
                          <span className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            {field.value}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companySizes.map((size) => (
                        <SelectItem
                          key={size.value}
                          value={size.value}
                          className="cursor-pointer"
                        >
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        )}

        {customerType === "Fleet" && (
          <div className="space-y-8 animate-in fade-in-50 duration-500">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Fleet Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  form={form}
                  name="fleet_details.account_number"
                  label="Fleet Account Number"
                  placeholder="Enter fleet account number"
                  helpText="Unique identifier for your fleet"
                  isModernTheme={isModernTheme}
                  icon={<Truck className="h-4 w-4 text-gray-500" />}
                />
                
                <FormInput
                  form={form}
                  name="fleet_details.vehicle_count"
                  label="Number of Vehicles"
                  placeholder="Enter total vehicles"
                  type="number"
                  required
                  isModernTheme={isModernTheme}
                  icon={<Car className="h-4 w-4 text-gray-500" />}
                />

                <FormInput
                  form={form}
                  name="fleet_details.manager_name"
                  label="Fleet Manager Name"
                  placeholder="Enter manager's name"
                  required
                  isModernTheme={isModernTheme}
                  icon={<Users className="h-4 w-4 text-gray-500" />}
                />

                <FormInput
                  form={form}
                  name="fleet_details.manager_contact"
                  label="Manager's Direct Contact"
                  placeholder="Enter manager's phone"
                  required
                  isModernTheme={isModernTheme}
                  icon={<Phone className="h-4 w-4 text-gray-500" />}
                />

                <FormInput
                  form={form}
                  name="fleet_details.service_schedule"
                  label="Preferred Service Schedule"
                  placeholder="e.g., every 10,000 km"
                  helpText="Regular maintenance interval"
                  isModernTheme={isModernTheme}
                  icon={<FileText className="h-4 w-4 text-gray-500" />}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Payment & Billing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  form={form}
                  name="payment_billing.fleet_card_provider"
                  label="Fleet Card Provider"
                  placeholder="Enter card provider"
                  isModernTheme={isModernTheme}
                  icon={<CreditCard className="h-4 w-4 text-gray-500" />}
                />

                <FormInput
                  form={form}
                  name="payment_billing.billing_contact"
                  label="Billing Contact"
                  placeholder="Enter billing contact name"
                  required
                  isModernTheme={isModernTheme}
                  icon={<Users className="h-4 w-4 text-gray-500" />}
                />

                <FormInput
                  form={form}
                  name="payment_billing.billing_email"
                  label="Billing Email"
                  placeholder="Enter billing email"
                  type="email"
                  required
                  isModernTheme={isModernTheme}
                  icon={<Mail className="h-4 w-4 text-gray-500" />}
                />

                <FormField
                  control={form.control}
                  name="payment_billing.payment_terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Payment Terms
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white rounded-lg">
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentTermsOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="cursor-pointer"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormInput
                  form={form}
                  name="payment_billing.tax_exempt_number"
                  label="Tax Exempt Number"
                  placeholder="Enter tax exempt number"
                  helpText="If applicable"
                  isModernTheme={isModernTheme}
                  icon={<Hash className="h-4 w-4 text-gray-500" />}
                />

                <FormInput
                  form={form}
                  name="payment_billing.credit_limit"
                  label="Credit Limit"
                  placeholder="Enter credit limit"
                  type="number"
                  helpText="If extending credit"
                  isModernTheme={isModernTheme}
                  icon={<CreditCard className="h-4 w-4 text-gray-500" />}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Insurance & Compliance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  form={form}
                  name="insurance_compliance.insurance_provider"
                  label="Insurance Provider"
                  placeholder="Enter insurance provider"
                  required
                  isModernTheme={isModernTheme}
                  icon={<Shield className="h-4 w-4 text-gray-500" />}
                />

                <FormInput
                  form={form}
                  name="insurance_compliance.policy_number"
                  label="Policy Number"
                  placeholder="Enter policy number"
                  required
                  isModernTheme={isModernTheme}
                  icon={<FileText className="h-4 w-4 text-gray-500" />}
                />

                <FormInput
                  form={form}
                  name="insurance_compliance.dot_number"
                  label="DOT Number"
                  placeholder="Enter DOT number"
                  helpText="If applicable"
                  isModernTheme={isModernTheme}
                  icon={<Hash className="h-4 w-4 text-gray-500" />}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
}
