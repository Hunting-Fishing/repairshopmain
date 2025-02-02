import { useNavigate } from "react-router-dom";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { Suspense } from "react";

export default function CustomerDetail() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/customers"); // Navigate back to customers list after success
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerForm onSuccess={handleSuccess} />
    </Suspense>
  );
}