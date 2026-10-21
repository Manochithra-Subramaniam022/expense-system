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

export const INITIAL_EXPENSES = [
  // Today's expenses
  {
    id: 'exp-101',
    category: 'company',
    subcategory: 'Employee Daily Allowance / Food',
    amount: 650,
    date: getRelativeDate(0),
    payment_method: 'UPI / GPay / PhonePe',
    vendor: 'Annapoorna Tea & Bakery',
    notes: 'Morning tea and snacks for 12 factory shift technicians',
    linked_employee_id: 'EMP-002',
    employee_name: 'Senthil Kumar (Field Service Tech)',
    attendance_date: getRelativeDate(0),
    expense_type: 'food_allowance',
    sync_status: 'linked_attendance'
  },
  {
    id: 'exp-102',
    category: 'personal',
    subcategory: 'Fuel & Personal Vehicle',
    amount: 1500,
    date: getRelativeDate(0),
    payment_method: 'Credit Card',
    vendor: 'HP Petrol Bunk Avinashi Road',
    notes: 'Car petrol refill',
    linked_employee_id: null,
    employee_name: null,
    attendance_date: null,
    expense_type: 'general',
    sync_status: 'unlinked'
  },
  {
    id: 'exp-103',
    category: 'company',
    subcategory: 'Machine Maintenance & Tools',
    amount: 3200,
    date: getRelativeDate(0),
    payment_method: 'Cash',
    vendor: 'Lakshmi Industrial Hardware',
    notes: 'Hydraulic seal replacement & lubricating coolant for CNC lathe 2',
    linked_employee_id: 'EMP-005',
    employee_name: 'R. Vignesh (Maintenance Engineer)',
    attendance_date: getRelativeDate(0),
    expense_type: 'general',
    sync_status: 'linked_attendance'
  },

  // Yesterday
  {
    id: 'exp-104',
    category: 'personal',
    subcategory: 'Groceries & Household',
    amount: 2450,
    date: getRelativeDate(-1),
    payment_method: 'UPI / GPay / PhonePe',
    vendor: 'Nilgiris Supermarket',
    notes: 'Monthly staples & fruits',
    linked_employee_id: null,
    employee_name: null,
    attendance_date: null,
    expense_type: 'general',
    sync_status: 'unlinked'
  },
  {
    id: 'exp-105',
    category: 'company',
    subcategory: 'Field Travel & Conveyance',
    amount: 1800,
    date: getRelativeDate(-1),
    payment_method: 'UPI / GPay / PhonePe',
    vendor: 'Toll & Diesel Reimbursement',
    notes: 'Client site emergency machine repair in Tiruppur',
    linked_employee_id: 'EMP-002',
    employee_name: 'Senthil Kumar (Field Service Tech)',
    attendance_date: getRelativeDate(-1),
    expense_type: 'site_allowance',
    sync_status: 'linked_attendance'
  },

  // Earlier this week
  {
    id: 'exp-106',
    category: 'company',
    subcategory: 'Raw Materials & Spares',
    amount: 28500,
    date: getRelativeDate(-3),
    payment_method: 'Company Bank Transfer (IMPS/NEFT)',
    vendor: 'Coimbatore Precision Steel Traders',
    notes: 'EN8 Bright steel rods and alloy bar lot for shaft production',
    linked_employee_id: null,
    employee_name: null,
    attendance_date: null,
    expense_type: 'general',
    sync_status: 'unlinked'
  },
  {
    id: 'exp-107',
    category: 'company',
    subcategory: 'Salary Advance',
    amount: 5000,
    date: getRelativeDate(-4),
    payment_method: 'Cash',
    vendor: 'Petty Cash Voucher #402',
    notes: 'Emergency medical advance for Karthik Raja (Lathe operator)',
    linked_employee_id: 'EMP-001',
    employee_name: 'Karthik Raja (Senior Lathe Operator)',
    attendance_date: getRelativeDate(-4),
    expense_type: 'advance',
    sync_status: 'approved'
  },
  {
    id: 'exp-108',
    category: 'personal',
    subcategory: 'Dining & Snacks',
    amount: 1850,
    date: getRelativeDate(-5),
    payment_method: 'UPI / GPay / PhonePe',
    vendor: 'Junior Kuppanna',
    notes: 'Family dinner over weekend',
    linked_employee_id: null,
    employee_name: null,
    attendance_date: null,
    expense_type: 'general',
    sync_status: 'unlinked'
  },

  // Earlier this month
  {
    id: 'exp-109',
    category: 'company',
    subcategory: 'Office Rent & Utilities',
    amount: 45000,
    date: getRelativeDate(-12),
    payment_method: 'Company Bank Transfer (IMPS/NEFT)',
    vendor: 'SIDCO Industrial Estate Authority',
    notes: 'Factory shed rental & TNEB power bill for past billing cycle',
    linked_employee_id: null,
    employee_name: null,
    attendance_date: null,
    expense_type: 'general',
    sync_status: 'unlinked'
  },
  {
    id: 'exp-110',
    category: 'personal',
    subcategory: 'Healthcare & Medicine',
    amount: 3200,
    date: getRelativeDate(-14),
    payment_method: 'Credit Card',
    vendor: 'Apollo Pharmacy',
    notes: 'Routine health checkup medicines & health supplements',
    linked_employee_id: null,
    employee_name: null,
    attendance_date: null,
    expense_type: 'general',
    sync_status: 'unlinked'
  },
  {
    id: 'exp-111',
    category: 'company',
    subcategory: 'Client Hospitality',
    amount: 3400,
    date: getRelativeDate(-16),
    payment_method: 'Credit Card',
    vendor: 'The Residency Towers',
    notes: 'Lunch meeting with client from Bangalore regarding custom automation rig',
    linked_employee_id: null,
    employee_name: null,
    attendance_date: null,
    expense_type: 'general',
    sync_status: 'unlinked'
  },
  {
    id: 'exp-112',
    category: 'personal',
    subcategory: 'Mobile & Subscriptions',
    amount: 1999,
    date: getRelativeDate(-18),
    payment_method: 'UPI / GPay / PhonePe',
    vendor: 'Airtel Broadband & Postpaid',
    notes: 'Home fiber internet & family plan bill',
    linked_employee_id: null,
    employee_name: null,
    attendance_date: null,
    expense_type: 'general',
    sync_status: 'unlinked'
  }
];
