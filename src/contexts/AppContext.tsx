
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Employee, Invoice } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { EmployeeDB, InvoiceDB, InvoiceItemDB } from "@/types/supabase";

// Convert database models to application models
const mapEmployeeFromDB = (employeeDB: EmployeeDB): Employee => {
  return {
    id: employeeDB.id,
    name: employeeDB.name,
    address: employeeDB.address,
    cnic: employeeDB.cnic,
    email: employeeDB.email,
    bankDetails: {
      accountHolder: employeeDB.bank_account_holder,
      swiftBic: employeeDB.bank_swift_bic,
      iban: employeeDB.bank_iban,
      bankName: employeeDB.bank_name,
      bankAddress: employeeDB.bank_address,
    }
  };
};

const mapInvoiceFromDB = async (invoiceDB: InvoiceDB): Promise<Invoice> => {
  // Fetch invoice items
  const { data: itemsData, error: itemsError } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', invoiceDB.id);

  if (itemsError) {
    console.error("Error fetching invoice items:", itemsError);
    throw itemsError;
  }

  const items = (itemsData || []).map((item: InvoiceItemDB) => ({
    id: item.id,
    description: item.description,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unit_price),
  }));

  return {
    id: invoiceDB.id,
    invoiceNumber: invoiceDB.invoice_number,
    date: invoiceDB.date,
    dueDate: invoiceDB.due_date,
    employeeId: invoiceDB.employee_id,
    status: invoiceDB.status as any,
    currency: invoiceDB.currency as any,
    notes: invoiceDB.notes || undefined,
    approvedBy: invoiceDB.approved_by || undefined,
    serviceType: invoiceDB.service_type || undefined,
    timePeriod: invoiceDB.time_period || undefined,
    items,
  };
};

interface AppContextType {
  employees: Employee[];
  invoices: Invoice[];
  loading: boolean;
  addEmployee: (employee: Employee) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  addInvoice: (invoice: Invoice) => Promise<void>;
  updateInvoice: (invoice: Invoice) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  getEmployeeById: (id: string) => Employee | undefined;
  getInvoicesByEmployeeId: (employeeId: string) => Invoice[];
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();

  const fetchEmployees = async () => {
    try {
      const { data: employeesData, error } = await supabase
        .from('employees')
        .select('*');

      if (error) {
        throw error;
      }

      const mappedEmployees = employeesData.map(mapEmployeeFromDB);
      setEmployees(mappedEmployees);
    } catch (error: any) {
      console.error("Error fetching employees:", error.message);
      toast({
        title: "Error",
        description: "Failed to load employees data.",
        variant: "destructive",
      });
    }
  };

  const fetchInvoices = async () => {
    try {
      const { data: invoicesData, error } = await supabase
        .from('invoices')
        .select('*');

      if (error) {
        throw error;
      }

      const mappedInvoicesPromises = invoicesData.map(mapInvoiceFromDB);
      const mappedInvoices = await Promise.all(mappedInvoicesPromises);
      setInvoices(mappedInvoices);
    } catch (error: any) {
      console.error("Error fetching invoices:", error.message);
      toast({
        title: "Error",
        description: "Failed to load invoices data.",
        variant: "destructive",
      });
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchEmployees(), fetchInvoices()]);
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      refreshData();
    } else {
      setLoading(false);
    }
  }, [session]);

  const addEmployee = async (employee: Employee) => {
    try {
      const newEmployeeData = {
        name: employee.name,
        address: employee.address,
        cnic: employee.cnic,
        email: employee.email,
        bank_account_holder: employee.bankDetails.accountHolder,
        bank_swift_bic: employee.bankDetails.swiftBic,
        bank_iban: employee.bankDetails.iban,
        bank_name: employee.bankDetails.bankName,
        bank_address: employee.bankDetails.bankAddress,
        user_id: user?.id
      };

      const { data, error } = await supabase
        .from('employees')
        .insert(newEmployeeData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newEmployee = mapEmployeeFromDB(data);
      setEmployees([...employees, newEmployee]);

      toast({
        title: "Employee Added",
        description: `${newEmployee.name} has been added successfully.`,
      });
    } catch (error: any) {
      console.error("Error adding employee:", error);
      toast({
        title: "Error",
        description: `Failed to add employee: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const updateEmployee = async (employee: Employee) => {
    try {
      const updatedEmployeeData = {
        name: employee.name,
        address: employee.address,
        cnic: employee.cnic,
        email: employee.email,
        bank_account_holder: employee.bankDetails.accountHolder,
        bank_swift_bic: employee.bankDetails.swiftBic,
        bank_iban: employee.bankDetails.iban,
        bank_name: employee.bankDetails.bankName,
        bank_address: employee.bankDetails.bankAddress,
      };

      const { error } = await supabase
        .from('employees')
        .update(updatedEmployeeData)
        .eq('id', employee.id);

      if (error) {
        throw error;
      }

      setEmployees(employees.map((emp) => (emp.id === employee.id ? employee : emp)));
      
      toast({
        title: "Employee Updated",
        description: `${employee.name}'s information has been updated.`,
      });
    } catch (error: any) {
      console.error("Error updating employee:", error);
      toast({
        title: "Error",
        description: `Failed to update employee: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const employeeToDelete = employees.find(emp => emp.id === id);
      
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setEmployees(employees.filter((emp) => emp.id !== id));
      
      if (employeeToDelete) {
        toast({
          title: "Employee Deleted",
          description: `${employeeToDelete.name} has been removed.`,
        });
      }
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      toast({
        title: "Error",
        description: `Failed to delete employee: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const addInvoice = async (invoice: Invoice) => {
    try {
      // Insert invoice
      const invoiceData = {
        invoice_number: invoice.invoiceNumber,
        date: invoice.date,
        due_date: invoice.dueDate,
        employee_id: invoice.employeeId,
        status: invoice.status,
        currency: invoice.currency,
        notes: invoice.notes || null,
        approved_by: invoice.approvedBy || null,
        service_type: invoice.serviceType || null,
        time_period: invoice.timePeriod || null,
        user_id: user?.id
      };

      const { data: newInvoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single();

      if (invoiceError) {
        throw invoiceError;
      }

      // Insert invoice items
      const invoiceItems = invoice.items.map(item => ({
        invoice_id: newInvoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItems);

      if (itemsError) {
        throw itemsError;
      }

      // Fetch the complete invoice with items
      const completeInvoice = await mapInvoiceFromDB(newInvoice);
      setInvoices([...invoices, completeInvoice]);

      toast({
        title: "Invoice Created",
        description: `Invoice ${completeInvoice.invoiceNumber} has been created.`,
      });
    } catch (error: any) {
      console.error("Error adding invoice:", error);
      toast({
        title: "Error",
        description: `Failed to create invoice: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const updateInvoice = async (invoice: Invoice) => {
    try {
      // Update invoice data
      const invoiceData = {
        invoice_number: invoice.invoiceNumber,
        date: invoice.date,
        due_date: invoice.dueDate,
        employee_id: invoice.employeeId,
        status: invoice.status,
        currency: invoice.currency,
        notes: invoice.notes || null,
        approved_by: invoice.approvedBy || null,
        service_type: invoice.serviceType || null,
        time_period: invoice.timePeriod || null,
      };

      const { error: invoiceError } = await supabase
        .from('invoices')
        .update(invoiceData)
        .eq('id', invoice.id);

      if (invoiceError) {
        throw invoiceError;
      }

      // Delete existing invoice items
      const { error: deleteItemsError } = await supabase
        .from('invoice_items')
        .delete()
        .eq('invoice_id', invoice.id);

      if (deleteItemsError) {
        throw deleteItemsError;
      }

      // Insert updated invoice items
      const invoiceItems = invoice.items.map(item => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice
      }));

      const { error: insertItemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItems);

      if (insertItemsError) {
        throw insertItemsError;
      }

      setInvoices(invoices.map((inv) => (inv.id === invoice.id ? invoice : inv)));
      
      toast({
        title: "Invoice Updated",
        description: `Invoice ${invoice.invoiceNumber} has been updated.`,
      });
    } catch (error: any) {
      console.error("Error updating invoice:", error);
      toast({
        title: "Error",
        description: `Failed to update invoice: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      const invoiceToDelete = invoices.find(inv => inv.id === id);
      
      // Invoice items will be automatically deleted due to CASCADE constraint
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setInvoices(invoices.filter((inv) => inv.id !== id));
      
      if (invoiceToDelete) {
        toast({
          title: "Invoice Deleted",
          description: `Invoice ${invoiceToDelete.invoiceNumber} has been deleted.`,
        });
      }
    } catch (error: any) {
      console.error("Error deleting invoice:", error);
      toast({
        title: "Error",
        description: `Failed to delete invoice: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const getEmployeeById = (id: string) => {
    return employees.find((employee) => employee.id === id);
  };

  const getInvoicesByEmployeeId = (employeeId: string) => {
    return invoices.filter((invoice) => invoice.employeeId === employeeId);
  };

  return (
    <AppContext.Provider
      value={{
        employees,
        invoices,
        loading,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getEmployeeById,
        getInvoicesByEmployeeId,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
