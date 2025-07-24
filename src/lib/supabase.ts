import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface AccountCode {
  id: string;
  code: string;
  name: string;
  category?: string;
  is_active: boolean;
}

export interface Material {
  id: string;
  material_code?: string;
  barcode?: string;
  name: string;
  category?: string;
  initial_stock: number;
  current_stock: number;
  min_stock: number;
  unit?: string;
  price: number;
  location?: string;
  note?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  material_id: string;
  type: 'in' | 'out';
  quantity: number;
  transaction_date: string;
  reference_number?: string;
  note?: string;
  user_name?: string;
  created_at: string;
}

export interface BudgetRequest {
  id: string;
  request_no?: string;
  requester: string;
  request_date: string;
  account_code: string;
  account_name?: string;
  amount: number;
  note?: string;
  material_list?: any;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
}

export interface Approval {
  id: string;
  request_id: string;
  decision: 'APPROVE' | 'REJECT';
  approver_name?: string;
  remark?: string;
  created_at: string;
}