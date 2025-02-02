import { useNavigate, useParams } from "react-router-dom";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { useToast } from "@/hooks/use-toast";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Customer details have been saved.",
    });
    navigate("/customers");
  };

  return (
    <div className="container mx-auto py-6">
      <CustomerForm 
        mode={id ? "edit" : "create"}
        initialData={id ? { id } : undefined}
        onSuccess={handleSuccess}
      />
    </div>
  );
}