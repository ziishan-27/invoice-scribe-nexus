
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employee } from "@/types";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

// Define the form validation schema using Zod
const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  cnic: z.string().min(5, "CNIC must be at least 5 characters"),
  bankDetails: z.object({
    accountHolder: z.string().min(2, "Account holder name is required"),
    swiftBic: z.string().min(2, "SWIFT/BIC code is required"),
    iban: z.string().min(5, "IBAN is required"),
    bankName: z.string().min(2, "Bank name is required"),
    bankAddress: z.string().min(5, "Bank address is required"),
  }),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  initialData?: Employee;
  isEditing?: boolean;
}

const EmployeeForm = ({ initialData, isEditing = false }: EmployeeFormProps) => {
  const navigate = useNavigate();
  const { addEmployee, updateEmployee } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with default values or existing employee data
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      address: "",
      cnic: "",
      bankDetails: {
        accountHolder: "",
        swiftBic: "",
        iban: "",
        bankName: "",
        bankAddress: "",
      },
    },
  });

  const onSubmit = async (data: EmployeeFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditing && initialData) {
        // Fix: Ensure all required properties from Employee interface are included
        const updatedEmployee: Employee = {
          id: initialData.id,
          name: data.name,
          email: data.email,
          address: data.address,
          cnic: data.cnic,
          bankDetails: {
            accountHolder: data.bankDetails.accountHolder,
            swiftBic: data.bankDetails.swiftBic,
            iban: data.bankDetails.iban,
            bankName: data.bankDetails.bankName,
            bankAddress: data.bankDetails.bankAddress,
          }
        };
        await updateEmployee(updatedEmployee);
        toast({
          title: "Employee Updated",
          description: "Employee information has been updated successfully.",
        });
      } else {
        await addEmployee(data as Employee);
        toast({
          title: "Employee Added",
          description: "New employee has been added successfully.",
        });
      }
      navigate("/employees");
    } catch (error) {
      console.error("Error saving employee:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save employee information. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cnic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNIC</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter CNIC number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bankDetails.accountHolder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Holder</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter account holder name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankDetails.swiftBic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SWIFT/BIC Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SWIFT/BIC code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="bankDetails.iban"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IBAN</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter IBAN" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bankDetails.bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bankDetails.bankAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bank address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/employees")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Employee" : "Save Employee"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EmployeeForm;
