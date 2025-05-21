
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, User, RefreshCw } from "lucide-react";

export const EmployeesList = () => {
  const { employees, getInvoicesByEmployeeId, refreshData, loading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
    console.log("EmployeesList: Current employees data:", employees);
  }, [employees]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
      console.log("Data refreshed. Employee count:", employees.length);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search employees..."
              className="pl-8 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing || loading}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing || loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-600">
          <Link to="/employees/new">
            <Plus className="mr-2 h-4 w-4" /> New Employee
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-primary rounded-full mb-2"></div>
          <p>Loading employees...</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">CNIC</th>
                  <th className="text-left py-3 px-4">Invoices</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => {
                    const employeeInvoices = getInvoicesByEmployeeId(employee.id);
                    return (
                      <tr key={employee.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Link
                            to={`/employees/${employee.id}`}
                            className="text-primary hover:underline flex items-center"
                          >
                            <User className="h-4 w-4 mr-2" />
                            {employee.name}
                          </Link>
                        </td>
                        <td className="py-3 px-4">{employee.email}</td>
                        <td className="py-3 px-4">{employee.cnic}</td>
                        <td className="py-3 px-4">{employeeInvoices.length}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                            >
                              <Link to={`/employees/${employee.id}`}>
                                <FileText className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      {employees.length === 0 ? (
                        <>
                          No employees found in the database. 
                          <div className="mt-2">
                            <Link to="/employees/new" className="text-primary hover:underline">
                              Add your first employee
                            </Link>
                          </div>
                        </>
                      ) : (
                        "No employees match your search."
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
