
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { useAuth } from "@/hooks/useAuth";

export const NewInvoice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFormSubmitStart = () => {
    setIsSubmitting(true);
  };

  const handleFormSubmitComplete = (success: boolean) => {
    setIsSubmitting(false);
    if (success) {
      navigate("/invoices");
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Invoice</h1>
      </div>
      <InvoiceForm 
        onSubmitStart={handleFormSubmitStart} 
        onSubmitComplete={handleFormSubmitComplete} 
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default NewInvoice;
