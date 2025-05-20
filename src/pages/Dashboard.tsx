
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Users, CreditCard, DollarSign } from "lucide-react";

export const Dashboard = () => {
  const { invoices, employees } = useAppContext();

  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");
  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status === "sent" || invoice.status === "overdue"
  );
  const draftInvoices = invoices.filter((invoice) => invoice.status === "draft");

  const totalInvoiced = invoices.reduce((total, invoice) => {
    const invoiceTotal = invoice.items.reduce(
      (itemTotal, item) => itemTotal + item.quantity * item.unitPrice,
      0
    );
    return total + invoiceTotal;
  }, 0);

  const recentInvoices = [...invoices]
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">{invoices.length}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">{employees.length}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">{pendingInvoices.length}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">
                {formatCurrency(totalInvoiced, "EUR")}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Invoices</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/invoices">View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Invoice</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Employee</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice) => {
                  const employee = employees.find(
                    (emp) => emp.id === invoice.employeeId
                  );
                  const total = invoice.items.reduce(
                    (sum, item) => sum + item.quantity * item.unitPrice,
                    0
                  );
                  
                  return (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link to={`/invoices/${invoice.id}`} className="text-primary hover:underline">
                          {invoice.invoiceNumber}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {employee?.name || "Unknown"}
                      </td>
                      <td className="py-3 px-4">
                        {formatCurrency(total, invoice.currency)}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={invoice.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Invoice Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Paid</span>
                </div>
                <span className="font-medium">{paidInvoices.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Pending</span>
                </div>
                <span className="font-medium">{pendingInvoices.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                  <span>Draft</span>
                </div>
                <span className="font-medium">{draftInvoices.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild className="bg-primary hover:bg-primary-600">
                <Link to="/invoices/new">Create Invoice</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/employees/new">Add Employee</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/invoices">View Invoices</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/employees">View Employees</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
