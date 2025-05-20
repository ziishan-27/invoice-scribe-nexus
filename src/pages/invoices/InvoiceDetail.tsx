
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
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
import { Edit, Trash, Printer, Save, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices, employees, deleteInvoice, updateInvoice } = useAppContext();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const invoice = useMemo(() => {
    return invoices.find((i) => i.id === id);
  }, [invoices, id]);

  const employee = useMemo(() => {
    if (!invoice) return null;
    return employees.find((e) => e.id === invoice.employeeId);
  }, [employees, invoice]);

  if (!invoice || !employee) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Invoice not found</p>
      </div>
    );
  }

  const total = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    navigate("/invoices");
  };

  const handleStatusChange = (status: string) => {
    updateInvoice({
      ...invoice,
      status: status as any,
    });
  };

  const handlePrint = () => {
    setIsGeneratingPdf(true);

    // Simulate PDF generation with a delay
    setTimeout(() => {
      toast.success("PDF generated successfully");
      setIsGeneratingPdf(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{invoice.invoiceNumber}</h2>
          <p className="text-gray-500">
            Created on {new Date(invoice.date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={handlePrint}
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf ? (
              <>Generating...</>
            ) : (
              <>
                <Printer className="h-4 w-4" /> Print PDF
              </>
            )}
          </Button>
          <Button asChild variant="outline" className="flex items-center gap-1">
            <Link to={`/invoices/edit/${invoice.id}`}>
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
                  invoice {invoice.invoiceNumber}.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <StatusBadge status={invoice.status} />
              <Select
                value={invoice.status}
                onValueChange={handleStatusChange}
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "sent", label: "Sent" },
                  { value: "paid", label: "Paid" },
                  { value: "overdue", label: "Overdue" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="font-medium">{employee.name}</p>
              <p className="text-sm text-gray-500">{employee.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(total, invoice.currency)}
            </p>
            <p className="text-sm text-gray-500">
              Due: {new Date(invoice.dueDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-right py-3 px-4">Quantity</th>
                  <th className="text-right py-3 px-4">Unit Price</th>
                  <th className="text-right py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 px-4">{item.description}</td>
                    <td className="py-3 px-4 text-right">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(item.unitPrice, invoice.currency)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(
                        item.quantity * item.unitPrice,
                        invoice.currency
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="font-medium">
                  <td colSpan={3} className="py-3 px-4 text-right">
                    Total:
                  </td>
                  <td className="py-3 px-4 text-right">
                    {formatCurrency(total, invoice.currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{employee.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{employee.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">CNIC</p>
                <p className="font-medium">{employee.cnic}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{employee.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bank Details</CardTitle>
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

      {invoice.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{invoice.notes}</p>
          </CardContent>
        </Card>
      )}

      {invoice.serviceType && (
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoice.serviceType && (
                <div>
                  <p className="text-sm text-gray-500">Type of Service</p>
                  <p className="font-medium">{invoice.serviceType}</p>
                </div>
              )}
              {invoice.timePeriod && (
                <div>
                  <p className="text-sm text-gray-500">Time Period</p>
                  <p className="font-medium">{invoice.timePeriod}</p>
                </div>
              )}
              {invoice.approvedBy && (
                <div>
                  <p className="text-sm text-gray-500">Approved By</p>
                  <p className="font-medium">{invoice.approvedBy}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Simple Select component
function Select({
  value,
  onValueChange,
  options,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="border rounded p-1 text-sm"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
