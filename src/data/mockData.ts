
import { Currency, Employee, Invoice, InvoiceItem } from "../types";

export const employees: Employee[] = [
  {
    id: "emp-001",
    name: "Zeeshan Shaukat",
    address: "House No 16, Eden Avenue Housing Society, Ghazi Road near Bhatta Chowk",
    cnic: "32201-3512505-3",
    email: "zs@powermatch.dk",
    bankDetails: {
      accountHolder: "Zeeshan Shaukat",
      swiftBic: "TRWIBEB1XXX",
      iban: "BE31 9050 8321 1455",
      bankName: "Wise",
      bankAddress: "Rue du Trône 100, 3rd floor Brussels 1050 Belgium",
    },
  },
  {
    id: "emp-002",
    name: "Jane Smith",
    address: "123 Main St, Anytown, AT 12345",
    cnic: "45678-9012345-6",
    email: "jane.smith@example.com",
    bankDetails: {
      accountHolder: "Jane Smith",
      swiftBic: "ABCDEFGH",
      iban: "DE89 3704 0044 0532 0130 00",
      bankName: "Example Bank",
      bankAddress: "456 Bank St, Banking City, BC 67890",
    },
  },
];

export const invoices: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2023-001",
    date: "2023-05-01",
    dueDate: "2023-05-15",
    employeeId: "emp-001",
    items: [
      {
        id: "item-001",
        description: "Development",
        quantity: 1,
        unitPrice: 2750.79,
      },
    ],
    status: "paid",
    currency: "EUR",
    notes: "Monthly invoice for software development services",
    approvedBy: "Las Sabir - Founder PowerMatch",
    serviceType: "Software IT services provided to my employer",
    timePeriod: "May",
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2023-002",
    date: "2023-06-01",
    dueDate: "2023-06-15",
    employeeId: "emp-001",
    items: [
      {
        id: "item-002",
        description: "Development",
        quantity: 1,
        unitPrice: 2750.79,
      },
    ],
    status: "paid",
    currency: "EUR",
    notes: "Monthly invoice for software development services",
    approvedBy: "Las Sabir - Founder PowerMatch",
    serviceType: "Software IT services provided to my employer",
    timePeriod: "June",
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-2023-003",
    date: "2023-07-01",
    dueDate: "2023-07-15",
    employeeId: "emp-002",
    items: [
      {
        id: "item-003",
        description: "Design Work",
        quantity: 1,
        unitPrice: 1500.00,
      },
    ],
    status: "sent",
    currency: "USD",
    notes: "Invoice for design services",
    approvedBy: "Las Sabir - Founder PowerMatch",
    serviceType: "Design services provided to my employer",
    timePeriod: "July",
  },
];

export const getCurrencySymbol = (currency: Currency): string => {
  switch (currency) {
    case "EUR":
      return "€";
    case "USD":
      return "$";
    case "PKR":
      return "₨";
    default:
      return "";
  }
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toFixed(2)}`;
};
