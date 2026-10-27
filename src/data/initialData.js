// Helper to get formatted relative date YYYY-MM-DD
export const getRelativeDate = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const PERSONAL_SUBCATEGORIES = [
  'Groceries & Household',
  'Fuel & Personal Vehicle',
  'Dining & Snacks',
  'Healthcare & Medicine',
  'Mobile & Subscriptions',
  'Shopping & Apparel',
  'Family & Children',
  'Personal Investment / Savings',
  'Miscellaneous Personal'
];

export const COMPANY_SUBCATEGORIES = [
  'Raw Materials & Spares',
  'Machine Maintenance & Tools',
  'Employee Daily Allowance / Food',
  'Field Travel & Conveyance',
  'Office Rent & Utilities',
  'Salary Advance',
  'Vendor Payment',
  'Client Hospitality',
  'Safety & Workshop Supplies',
  'Miscellaneous Company'
];

export const PAYMENT_METHODS = [
  'UPI / GPay / PhonePe',
  'Cash',
  'Company Bank Transfer (IMPS/NEFT)',
  'Credit Card',
  'Debit Card'
];

export const ATTENDANCE_EXPENSE_TYPES = [
  { id: 'general', label: 'General Operational Expense' },
  { id: 'site_allowance', label: 'Field Site Allowance (Attendance Linked)' },
  { id: 'food_allowance', label: 'Daily Food / Tea Refreshment (Staff)' },
  { id: 'reimbursement', label: 'Employee Expense Reimbursement' },
  { id: 'advance', label: 'Salary Advance / Petty Cash' }
];

export const SAMPLE_EMPLOYEES = [
  { id: 'EMP-001', name: 'Karthik Raja (Senior Lathe Operator)' },
  { id: 'EMP-002', name: 'Senthil Kumar (Field Service Tech)' },
  { id: 'EMP-003', name: 'Muthu Vel (CNC Machinist)' },
  { id: 'EMP-004', name: 'Praveen Kumar (Assembly Tech)' },
  { id: 'EMP-005', name: 'R. Vignesh (Maintenance Engineer)' }
];

export const DEFAULT_BUDGETS = {
  personal_monthly: 45000,
  company_monthly: 200000
};

export const INITIAL_EXPENSES = [];

