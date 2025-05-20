
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Settings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            This information will appear on your invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Your Company Name"
                defaultValue="InvoiceNexus Inc."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Input
                id="companyAddress"
                placeholder="Your Company Address"
                defaultValue="123 Invoice Street, City, Country"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="companyEmail">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                placeholder="Your Email"
                defaultValue="contact@invoicenexus.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="companyPhone">Phone</Label>
              <Input
                id="companyPhone"
                placeholder="Your Phone"
                defaultValue="+1 (555) 123-4567"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="companyLogo">Logo</Label>
              <div className="flex items-center gap-2">
                <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-500 text-xs">No logo</span>
                </div>
                <Button variant="outline" size="sm">
                  Upload Logo
                </Button>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary-600 mt-4">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Defaults</CardTitle>
          <CardDescription>
            Default settings for new invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="defaultCurrency">Default Currency</Label>
              <select
                id="defaultCurrency"
                className="w-full p-2 border rounded-md"
                defaultValue="EUR"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="PKR">PKR</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paymentTerms">Payment Terms (days)</Label>
              <Input
                id="paymentTerms"
                type="number"
                defaultValue="15"
                min="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="invoiceNotes">Default Invoice Notes</Label>
              <textarea
                id="invoiceNotes"
                className="w-full p-2 border rounded-md h-24"
                placeholder="Enter default notes for invoices"
                defaultValue="Thank you for your business!"
              ></textarea>
            </div>
            <Button className="bg-primary hover:bg-primary-600 mt-4">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
