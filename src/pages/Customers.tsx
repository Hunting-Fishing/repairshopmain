
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomerTable } from "@/components/customers/customer-management/CustomerTable";
import { CustomerHeader } from "@/components/customers/page/CustomerHeader";
import { CustomerSearchBar } from "@/components/customers/page/CustomerSearchBar";
import { CustomerViewToggle } from "@/components/customers/page/CustomerViewToggle";
import { CustomerGrid } from "@/components/customers/page/CustomerGrid";

export default function Customers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const { toast } = useToast();

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("theme_preference")
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: customers = [], refetch, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching customers",
          description: error.message,
        });
        throw error;
      }

      return data;
    },
  });

  const handleDelete = async (customer: any) => {
    try {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", customer.id);

      if (error) throw error;

      toast({
        title: "Customer deleted",
        description: "The customer has been successfully deleted.",
      });
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting customer",
        description: error.message,
      });
    }
  };

  const handleCustomerAdded = () => {
    setIsDialogOpen(false);
    refetch();
    toast({
      title: "Customer added",
      description: "The customer has been successfully added.",
    });
  };

  const filteredCustomers = customers.filter(customer => 
    customer.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isModernTheme = userProfile?.theme_preference === 'modern';

  return (
    <div className="space-y-8 animate-fade-in p-6">
      <div className={`rounded-xl p-8 shadow-lg ${
        isModernTheme 
          ? 'bg-gradient-to-br from-[#F8FAFC]/80 via-[#EFF6FF] to-[#DBEAFE]/50'
          : 'bg-gradient-to-r from-[#FEC6A1] to-[#FDE1D3]'
      }`}>
        <CustomerHeader isModernTheme={isModernTheme} />
        
        <div className="flex items-center gap-4 mt-6">
          <CustomerSearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isModernTheme={isModernTheme}
          />
          <CustomerViewToggle 
            viewMode={viewMode}
            onViewChange={setViewMode}
            isModernTheme={isModernTheme}
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className={`${
                  isModernTheme
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-[#F97316] hover:bg-[#EA580C]'
                } transition-colors shadow-md hover:shadow-lg`}
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className={`sm:max-w-[800px] max-h-[90vh] ${
              isModernTheme
                ? 'bg-gradient-to-b from-white to-blue-50/10 border-blue-100/20'
                : 'bg-gradient-to-b from-white to-[#FDE1D3]/10 border-[#FEC6A1]/20'
            }`}>
              <ScrollArea className="max-h-[85vh]">
                <DialogHeader className={`${
                  isModernTheme
                    ? 'bg-gradient-to-br from-[#F8FAFC]/80 via-[#EFF6FF] to-[#DBEAFE]/50'
                    : 'bg-gradient-to-r from-[#FEC6A1] to-[#FDE1D3]'
                } p-8 rounded-t-lg`}>
                  <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    Add New Customer
                  </DialogTitle>
                </DialogHeader>
                <div className="p-8">
                  <CustomerForm onSuccess={handleCustomerAdded} />
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className={`${
        isModernTheme
          ? 'bg-white/80 backdrop-blur-sm'
          : 'bg-white'
      } rounded-xl shadow-lg p-6 animate-fade-in`}>
        {viewMode === "list" ? (
          <CustomerTable 
            customers={filteredCustomers} 
            isLoading={isLoading}
            onDelete={handleDelete}
          />
        ) : (
          <CustomerGrid 
            customers={filteredCustomers}
            isModernTheme={isModernTheme}
          />
        )}
      </div>
    </div>
  );
}
