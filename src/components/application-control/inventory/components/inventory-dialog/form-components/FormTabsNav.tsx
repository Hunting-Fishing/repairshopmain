
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageOpen, ScanLine, Microscope, DollarSign, Info } from "lucide-react";

export function FormTabsNav() {
  return (
    <TabsList className="w-full justify-start mb-6 sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl border shadow-lg">
      <TabsTrigger value="basic" className="flex items-center gap-2 data-[state=active]:bg-primary/10 transition-all duration-300">
        <PackageOpen className="h-4 w-4" />
        Basic Info
      </TabsTrigger>
      <TabsTrigger value="identification" className="flex items-center gap-2 data-[state=active]:bg-primary/10 transition-all duration-300">
        <ScanLine className="h-4 w-4" />
        Identification
      </TabsTrigger>
      <TabsTrigger value="details" className="flex items-center gap-2 data-[state=active]:bg-primary/10 transition-all duration-300">
        <Microscope className="h-4 w-4" />
        Details
      </TabsTrigger>
      <TabsTrigger value="pricing" className="flex items-center gap-2 data-[state=active]:bg-primary/10 transition-all duration-300">
        <DollarSign className="h-4 w-4" />
        Pricing
      </TabsTrigger>
      <TabsTrigger value="additional" className="flex items-center gap-2 data-[state=active]:bg-primary/10 transition-all duration-300">
        <Info className="h-4 w-4" />
        Additional
      </TabsTrigger>
    </TabsList>
  );
}
