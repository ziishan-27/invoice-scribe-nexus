
import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppContext } from "@/contexts/AppContext";
import { Currency, Invoice, InvoiceStatus, InvoiceItem } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";

// Form validation schema
const invoiceFormSchema = z.object({
  invoiceNumber: z.string().min(1, { message: "Invoice number is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  dueDate: z.string().min(1, { message: "Due date is required" }),
  employeeId: z.string().min(1, { message: "Employee is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  currency: z.string().min(1, { message: "Currency is required" }),
  notes: z.string().optional(),
  approvedBy: z.string().optional(),
  serviceType: z.string().optional(),
  timePeriod: z.string().optional(),
  items: z.array(z.object({
    id: z.string(),
    description: z.string().min(1, { message: "Description is required" }),
    quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
    unitPrice: z.number().min(0, { message: "Unit price cannot be negative" })
  })).min(1, { message: "At least one item is required" })
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
  invoice?: Invoice;
  onSubmitStart?: () => void;
  onSubmitComplete?: (success: boolean) => void;
  isSubmitting?: boolean;
}

export const InvoiceForm = ({ 
  invoice, 
  onSubmitStart, 
  onSubmitComplete,
  isSubmitting = false
}: InvoiceFormProps) => {
  const { employees, addInvoice, updateInvoice } = useAppContext();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);

  const isEditing = !!invoice;

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceNumber: invoice?.invoiceNumber || `INV-${new Date().getTime()}`,
      date: invoice?.date || new Date().toISOString().split('T')[0],
      dueDate: invoice?.dueDate || new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      employeeId: invoice?.employeeId || "",
      status: invoice?.status || "draft",
      currency: invoice?.currency || "EUR",
      notes: invoice?.notes || "",
      approvedBy: invoice?.approvedBy || "",
      serviceType: invoice?.serviceType || "Software IT services",
      timePeriod: invoice?.timePeriod || "",
      items: invoice?.items || [
        {
          id: uuidv4(),
          description: "Development",
          quantity: 1,
          unitPrice: 0
        }
      ]
    }
  });

  // Create field array for invoice items
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  // Calculate total whenever items change
  useEffect(() => {
    const values = form.getValues();
    const calculatedTotal = values.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
    setTotal(calculatedTotal);
  }, [form.watch("items")]);

  // Submit handler
  const onSubmit = async (data: InvoiceFormValues) => {
    try {
      if (onSubmitStart) onSubmitStart();
      
      const invoiceData: Invoice = {
        id: invoice?.id || uuidv4(),
        invoiceNumber: data.invoiceNumber,
        date: data.date,
        dueDate: data.dueDate,
        employeeId: data.employeeId,
        status: data.status as InvoiceStatus,
        currency: data.currency as Currency,
        items: data.items as InvoiceItem[],
        notes: data.notes,
        approvedBy: data.approvedBy,
        serviceType: data.serviceType,
        timePeriod: data.timePeriod,
      };

      console.log("Submitting invoice data:", invoiceData);
      
      if (isEditing) {
        await updateInvoice(invoiceData);
        toast.success("Invoice updated successfully");
      } else {
        await addInvoice(invoiceData);
        toast.success("Invoice created successfully");
      }

      if (onSubmitComplete) onSubmitComplete(true);
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice");
      if (onSubmitComplete) onSubmitComplete(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="PKR">PKR</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Service</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Period</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., May 2025" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="approvedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approved By</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        className="min-h-[100px]" 
                        placeholder="Additional notes or terms..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Invoice Items</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({
                id: uuidv4(),
                description: "",
                quantity: 1,
                unitPrice: 0
              })}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.length === 0 && (
                <p className="text-center text-gray-500 py-4">No items added yet. Click "Add Item" to begin.</p>
              )}

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-4 items-start border-b pb-4">
                  <div className="col-span-5">
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index > 0 ? 'sr-only' : ''}>Description</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Item description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index > 0 ? 'sr-only' : ''}>Quantity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`items.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index > 0 ? 'sr-only' : ''}>Unit Price</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1 flex items-center pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={fields.length === 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount:</p>
                  <p className="text-xl font-bold">
                    {form.watch("currency") === "EUR" ? "€" : 
                     form.watch("currency") === "USD" ? "$" : 
                     "PKR "}{total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/invoices")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Invoice" : "Create Invoice"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

