
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Users, CreditCard, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary-900 tracking-tight">Dashboard</h1>
        <Button asChild className="bg-primary hover:bg-primary-600 shadow-md">
          <Link to="/invoices/new">Create Invoice</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Total Invoices</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-primary-800">{invoices.length}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span>Total Employees</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-blue-700">{employees.length}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <span>Pending Invoices</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-amber-700">{pendingInvoices.length}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span>Total Amount</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-green-700">
                {formatCurrency(totalInvoiced, "EUR")}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-white border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Invoices
            </CardTitle>
            <Button asChild variant="outline" size="sm" className="shadow-sm">
              <Link to="/invoices">View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-4 px-6 text-gray-500 font-medium">Invoice</th>
                  <th className="text-left py-4 px-6 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-4 px-6 text-gray-500 font-medium">Employee</th>
                  <th className="text-left py-4 px-6 text-gray-500 font-medium">Amount</th>
                  <th className="text-left py-4 px-6 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.length > 0 ? (
                  recentInvoices.map((invoice) => {
                    const employee = employees.find(
                      (emp) => emp.id === invoice.employeeId
                    );
                    const total = invoice.items.reduce(
                      (sum, item) => sum + item.quantity * item.unitPrice,
                      0
                    );
                    
                    return (
                      <tr key={invoice.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <Link to={`/invoices/${invoice.id}`} className="text-primary-700 hover:text-primary font-medium hover:underline">
                            {invoice.invoiceNumber}
                          </Link>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {new Date(invoice.date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-gray-800 font-medium">
                          {employee?.name || "Unknown"}
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-900">
                          {formatCurrency(total, invoice.currency)}
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={invoice.status} />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      No invoices found. Create your first invoice now!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-primary-50 to-white border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Invoice Status
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="font-medium text-gray-700">Paid</span>
                </div>
                <span className="font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  {paidInvoices.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="font-medium text-gray-700">Pending</span>
                </div>
                <span className="font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  {pendingInvoices.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                  <span className="font-medium text-gray-700">Draft</span>
                </div>
                <span className="font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                  {draftInvoices.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-primary-50 to-white border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <Button asChild className="bg-primary hover:bg-primary-600 shadow-md transition-all">
                <Link to="/invoices/new" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Create Invoice
                </Link>
              </Button>
              <Button asChild variant="outline" className="shadow-md hover:bg-gray-50 transition-all">
                <Link to="/employees/new" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Add Employee
                </Link>
              </Button>
              <Button asChild variant="outline" className="shadow-md hover:bg-gray-50 transition-all">
                <Link to="/invoices" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  View Invoices
                </Link>
              </Button>
              <Button asChild variant="outline" className="shadow-md hover:bg-gray-50 transition-all">
                <Link to="/employees" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  View Employees
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
