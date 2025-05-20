
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "@/components/employees/EmployeeForm";
import { useAuth } from "@/hooks/useAuth";

export const NewEmployee = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add New Employee</h1>
      </div>
      <EmployeeForm />
    </div>
  );
};

export default NewEmployee;
