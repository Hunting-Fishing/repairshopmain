import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Users, Search, Filter } from "lucide-react";
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

export default function Customers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

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

  return (
    <div className="space-y-8 animate-fade-in p-6">
      <div className="bg-gradient-to-r from-[#FEC6A1] to-[#FDE1D3] rounded-xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white/90 rounded-full shadow-md">
            <Users className="h-7 w-7 text-[#F97316]" />
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
            className="pl-10 bg-white/90 hover:bg-white focus:bg-white transition-colors border-transparent focus:border-[#F97316] shadow-md"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-[#F97316] hover:bg-[#EA580C] transition-colors shadow-md hover:shadow-lg"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] bg-gradient-to-b from-white to-[#FDE1D3]/10 border-[#FEC6A1]/20">
            <ScrollArea className="max-h-[85vh]">
              <DialogHeader className="bg-gradient-to-r from-[#FEC6A1] to-[#FDE1D3] p-8 rounded-t-lg">
                <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-white/90 rounded-lg shadow-sm">
                    <Users className="h-6 w-6 text-[#F97316]" />
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

      <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
        <CustomerTable 
          customers={filteredCustomers} 
          isLoading={isLoading}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
