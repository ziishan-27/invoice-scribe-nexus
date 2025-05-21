
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "@/components/employees/EmployeeForm";
import { useAuth } from "@/hooks/useAuth";
import { useAppContext } from "@/contexts/AppContext";

export const NewEmployee = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { loading } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);
  
  const handleFormSubmitStart = () => {
    setIsSubmitting(true);
  };

  const handleFormSubmitComplete = (success: boolean) => {
    setIsSubmitting(false);
    if (success) {
      navigate("/employees");
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add New Employee</h1>
      </div>
      <EmployeeForm 
        onSubmitStart={handleFormSubmitStart} 
        onSubmitComplete={handleFormSubmitComplete} 
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default NewEmployee;
