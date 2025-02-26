
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormSection } from "../FormSection";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SocialProfilesSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function SocialProfilesSection({
  form,
  isModernTheme = false,
}: SocialProfilesSectionProps) {
  const inputClasses = (error?: boolean) => `
    transition-all duration-200
    ${isModernTheme
      ? "bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white rounded-lg"
      : "bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white"}
    ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
  `;

  return (
    <FormSection 
      title="Social Profiles" 
      description="Link social media accounts for enhanced customer insights"
      isModernTheme={isModernTheme}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="social_profiles"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel className="text-gray-700 font-medium">
                  LinkedIn Profile
                </FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-sm">Add LinkedIn profile for professional networking</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormControl>
                <Input
                  placeholder="Enter LinkedIn username or URL"
                  className={inputClasses()}
                  value={field.value?.linkedin || ''}
                  onChange={(e) => {
                    field.onChange({
                      ...field.value,
                      linkedin: e.target.value
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="social_profiles"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel className="text-gray-700 font-medium">
                  Twitter/X Handle
                </FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-sm">Add Twitter/X handle for social engagement</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormControl>
                <Input
                  placeholder="Enter Twitter/X username"
                  className={inputClasses()}
                  value={field.value?.twitter || ''}
                  onChange={(e) => {
                    field.onChange({
                      ...field.value,
                      twitter: e.target.value
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormSection>
  );
}
