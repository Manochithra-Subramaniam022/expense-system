import { createClient } from '@supabase/supabase-js';

// Configuration keys in localStorage
const SUPABASE_URL_KEY = 'covai_expense_supabase_url';
const SUPABASE_KEY_KEY = 'covai_expense_supabase_key';

export const getSupabaseConfig = () => {
  const url = localStorage.getItem(SUPABASE_URL_KEY) || import.meta.env.VITE_SUPABASE_URL || '';
  const key = localStorage.getItem(SUPABASE_KEY_KEY) || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return { url, key, isConfigured: Boolean(url && key) };
};

export const saveSupabaseConfig = (url, key) => {
  if (url) localStorage.setItem(SUPABASE_URL_KEY, url.trim());
  else localStorage.removeItem(SUPABASE_URL_KEY);

  if (key) localStorage.setItem(SUPABASE_KEY_KEY, key.trim());
  else localStorage.removeItem(SUPABASE_KEY_KEY);
  
  // Re-initialize client
  initClient();
};

let supabase = null;

const initClient = () => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (isConfigured) {
    try {
      supabase = createClient(url, key);
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      supabase = null;
    }
  } else {
    supabase = null;
  }
};

initClient();

export const getClient = () => supabase;

/**
 * SQL Schema script to copy-paste directly into Supabase SQL editor
 */
export const SUPABASE_SQL_SCHEMA = `-- Covai Machines Expense Management System Schema
-- Run this in your Supabase SQL Editor:

-- 1. Create Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('personal', 'company')),
  subcategory TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  date DATE NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'Cash',
  notes TEXT,
  vendor TEXT,
  receipt_url TEXT,
  
  -- Attendance System Integration Fields
  linked_employee_id TEXT,
  employee_name TEXT,
  attendance_date DATE,
  expense_type TEXT DEFAULT 'general', -- 'general', 'reimbursement', 'site_allowance', 'food_allowance', 'advance'
  sync_status TEXT DEFAULT 'unlinked', -- 'unlinked', 'linked_attendance', 'approved'
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Budget Limits Table
CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY, -- 'personal_monthly', 'company_monthly'
  limit_amount NUMERIC(12, 2) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- 4. Public Policies for Demo/Owner access (adjust with Supabase Auth as needed)
CREATE POLICY "Allow public read-write for demo owner" ON expenses
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read-write for demo budgets" ON budgets
  FOR ALL USING (true) WITH CHECK (true);
`;
