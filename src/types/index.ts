
export type Currency = "EUR" | "USD" | "PKR";

export interface Employee {
  id: string;
  name: string;
  address: string;
  cnic: string;
  email: string;
  bankDetails: {
    accountHolder: string;
    swiftBic: string;
    iban: string;
    bankName: string;
    bankAddress: string;
  };
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  employeeId: string;
  items: InvoiceItem[];
  status: InvoiceStatus;
  currency: Currency;
  notes?: string;
  approvedBy?: string;
  serviceType?: string;
  timePeriod?: string;
}
