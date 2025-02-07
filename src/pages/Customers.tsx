
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Users, Search, LayoutGrid, List } from "lucide-react";
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
import { CustomerTable, Customer } from "@/components/customers/customer-management/CustomerTable";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Customers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const { toast } = useToast();

  // Get theme preference from user profile
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

  const handleDelete = async (customer: Customer) => {
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
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-3 ${
            isModernTheme 
              ? 'bg-white/90 shadow-md'
              : 'bg-white/90 shadow-md'
          } rounded-full`}>
            <Users className={`h-7 w-7 ${
              isModernTheme ? 'text-blue-500' : 'text-[#F97316]'
            }`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Customers
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your customer database efficiently
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${
                isModernTheme 
                  ? 'bg-white/90 hover:bg-white focus:bg-white transition-colors border-transparent focus:border-blue-500'
                  : 'bg-white/90 hover:bg-white focus:bg-white transition-colors border-transparent focus:border-[#F97316]'
              } shadow-md`}
            />
          </div>
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => value && setViewMode(value as "list" | "grid")} 
            className="bg-white/90 p-1 rounded-lg shadow-md"
          >
            <ToggleGroupItem 
              value="list" 
              aria-label="List View" 
              className={`data-[state=on]:${isModernTheme ? 'bg-blue-500' : 'bg-[#F97316]'} data-[state=on]:text-white`}
            >
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="grid" 
              aria-label="Grid View" 
              className={`data-[state=on]:${isModernTheme ? 'bg-blue-500' : 'bg-[#F97316]'} data-[state=on]:text-white`}
            >
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
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
                    <div className={`p-2 ${
                      isModernTheme 
                        ? 'bg-white/90 rounded-lg shadow-sm'
                        : 'bg-white/90 rounded-lg shadow-sm'
                    }`}>
                      <Users className={`h-6 w-6 ${
                        isModernTheme ? 'text-blue-500' : 'text-[#F97316]'
                      }`} />
                    </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className={`${
                isModernTheme
                  ? 'bg-white/90 border border-blue-100/50 hover:shadow-md'
                  : 'bg-white border border-gray-200 hover:shadow-md'
              } rounded-lg shadow-sm p-4 transition-shadow`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 ${
                    isModernTheme
                      ? 'bg-blue-50'
                      : 'bg-[#FDE1D3]'
                  } rounded-full`}>
                    <Users className={`h-4 w-4 ${
                      isModernTheme ? 'text-blue-500' : 'text-[#F97316]'
                    }`} />
                  </div>
                  <h3 className="font-medium">{customer.first_name} {customer.last_name}</h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>{customer.email}</p>
                  <p>{customer.phone_number}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
