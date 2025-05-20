
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/data/mockData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Edit, Trash, FileText } from "lucide-react";
import { useMemo } from "react";

export const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, getInvoicesByEmployeeId, deleteEmployee } = useAppContext();

  const employee = useMemo(() => {
    return employees.find((e) => e.id === id);
  }, [employees, id]);

  const employeeInvoices = useMemo(() => {
    if (!id) return [];
    return getInvoicesByEmployeeId(id);
  }, [getInvoicesByEmployeeId, id]);

  if (!employee) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Employee not found</p>
      </div>
    );
  }

  const handleDelete = () => {
    deleteEmployee(employee.id);
    navigate("/employees");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{employee.name}</h2>
          <p className="text-gray-500">{employee.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="flex items-center gap-1">
            <Link to={`/employees/edit/${employee.id}`}>
              <Edit className="h-4 w-4" /> Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-1">
                <Trash className="h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  employee {employee.name} and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{employee.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{employee.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">CNIC</p>
                <p className="font-medium">{employee.cnic}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{employee.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bank Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Account Holder</p>
                <p className="font-medium">{employee.bankDetails.accountHolder}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Swift/BIC</p>
                <p className="font-medium">{employee.bankDetails.swiftBic}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IBAN</p>
                <p className="font-medium">{employee.bankDetails.iban}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bank Name & Address</p>
                <p className="font-medium">
                  {employee.bankDetails.bankName}, {employee.bankDetails.bankAddress}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoices</CardTitle>
            <Button asChild size="sm" className="bg-primary hover:bg-primary-600">
              <Link to={`/invoices/new?employeeId=${employee.id}`}>
                Create Invoice
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {employeeInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Invoice #</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeInvoices.map((invoice) => {
                    const total = invoice.items.reduce(
                      (sum, item) => sum + item.quantity * item.unitPrice,
                      0
                    );

                    return (
                      <tr key={invoice.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Link
                            to={`/invoices/${invoice.id}`}
                            className="text-primary hover:underline"
                          >
                            {invoice.invoiceNumber}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(invoice.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          {formatCurrency(total, invoice.currency)}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={invoice.status} />
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link to={`/invoices/${invoice.id}`}>
                              <FileText className="h-4 w-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>No invoices found for this employee.</p>
              <Button
                asChild
                variant="link"
                className="mt-2 text-primary"
              >
                <Link to={`/invoices/new?employeeId=${employee.id}`}>
                  Create their first invoice
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
