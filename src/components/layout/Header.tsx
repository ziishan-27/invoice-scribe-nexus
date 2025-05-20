
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Header = () => {
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();
  
  // Function to get page title based on current location
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path === "/invoices") return "Invoices";
    if (path.startsWith("/invoices/")) {
      if (path.includes("/new")) return "Create Invoice";
      if (path.includes("/edit")) return "Edit Invoice";
      return "Invoice Details";
    }
    if (path === "/employees") return "Employees";
    if (path.startsWith("/employees/")) {
      if (path.includes("/new")) return "Add Employee";
      if (path.includes("/edit")) return "Edit Employee";
      return "Employee Details";
    }
    if (path === "/settings") return "Settings";
    return "InvoiceNexus";
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
      <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
      <div className="flex items-center space-x-4">
        <div className="hidden md:block relative">
          <Input
            type="text"
            placeholder="Search..."
            className="pl-8 w-64"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
          US
        </div>
      </div>
    </header>
  );
};
