
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Employee, Invoice } from "../types";
import { employees as initialEmployees, invoices as initialInvoices } from "../data/mockData";
import { useToast } from "@/components/ui/use-toast";

interface AppContextType {
  employees: Employee[];
  invoices: Invoice[];
  addEmployee: (employee: Employee) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (id: string) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;
  getInvoicesByEmployeeId: (employeeId: string) => Invoice[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const { toast } = useToast();

  const addEmployee = (employee: Employee) => {
    setEmployees([...employees, employee]);
    toast({
      title: "Employee Added",
      description: `${employee.name} has been added successfully.`,
    });
  };

  const updateEmployee = (employee: Employee) => {
    setEmployees(employees.map((emp) => (emp.id === employee.id ? employee : emp)));
    toast({
      title: "Employee Updated",
      description: `${employee.name}'s information has been updated.`,
    });
  };

  const deleteEmployee = (id: string) => {
    const employeeToDelete = employees.find(emp => emp.id === id);
    if (employeeToDelete) {
      setEmployees(employees.filter((emp) => emp.id !== id));
      toast({
        title: "Employee Deleted",
        description: `${employeeToDelete.name} has been removed.`,
      });
    }
  };

  const addInvoice = (invoice: Invoice) => {
    setInvoices([...invoices, invoice]);
    toast({
      title: "Invoice Created",
      description: `Invoice ${invoice.invoiceNumber} has been created.`,
    });
  };

  const updateInvoice = (invoice: Invoice) => {
    setInvoices(invoices.map((inv) => (inv.id === invoice.id ? invoice : inv)));
    toast({
      title: "Invoice Updated",
      description: `Invoice ${invoice.invoiceNumber} has been updated.`,
    });
  };

  const deleteInvoice = (id: string) => {
    const invoiceToDelete = invoices.find(inv => inv.id === id);
    if (invoiceToDelete) {
      setInvoices(invoices.filter((inv) => inv.id !== id));
      toast({
        title: "Invoice Deleted",
        description: `Invoice ${invoiceToDelete.invoiceNumber} has been deleted.`,
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
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getEmployeeById,
        getInvoicesByEmployeeId,
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
