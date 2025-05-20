
// Types based on Supabase schema

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeDB {
  id: string;
  name: string;
  address: string;
  cnic: string;
  email: string;
  bank_account_holder: string;
  bank_swift_bic: string;
  bank_iban: string;
  bank_name: string;
  bank_address: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

export interface InvoiceDB {
  id: string;
  invoice_number: string;
  date: string;
  due_date: string;
  employee_id: string;
  status: string;
  currency: string;
  notes: string | null;
  approved_by: string | null;
  service_type: string | null;
  time_period: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

export interface InvoiceItemDB {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
}
