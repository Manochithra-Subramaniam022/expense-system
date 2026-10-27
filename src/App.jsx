import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { FintechHero } from './components/FintechHero';
import { ExpenseFilters } from './components/ExpenseFilters';
import { ExpenseTable } from './components/ExpenseTable';
import { ReportsView } from './components/ReportsView';
import { ExpenseModal } from './components/ExpenseModal';
import { SettingsModal } from './components/SettingsModal';
import { AttendancePortalModal } from './components/AttendancePortalModal';
import { MobileBottomNav } from './components/MobileBottomNav';

import { 
  INITIAL_EXPENSES, 
  DEFAULT_BUDGETS, 
  SAMPLE_EMPLOYEES,
  getRelativeDate 
} from './data/initialData';
import { 
  getSupabaseConfig, 
  getClient 
} from './services/supabaseClient';
import { 
  exportToExcel, 
  exportToCSV, 
  exportToPDF 
} from './services/exportService';

import { 
  Receipt, 
  BarChart3, 
  Building2, 
  User, 
  Filter,
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

const STORAGE_KEY_EXPENSES = 'covai_expenses_data';
const STORAGE_KEY_BUDGETS = 'covai_expenses_budgets';
const STORAGE_KEY_THEME = 'covai_expenses_theme';

export function App() {
  // Theme state - default to light & premium
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (!saved || saved === 'dark') {
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
      return 'light';
    }
    return saved;
  });

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Cloud Config state
  const [cloudConfig, setCloudConfig] = useState(getSupabaseConfig);

  // Budgets state
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BUDGETS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default */ }
    }
    return DEFAULT_BUDGETS;
  });

  // Expenses state
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EXPENSES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out any legacy static mock demo expenses (exp-101 to exp-112)
          const staticIds = new Set([
            'exp-101', 'exp-102', 'exp-103', 'exp-104', 'exp-105', 'exp-106',
            'exp-107', 'exp-108', 'exp-109', 'exp-110', 'exp-111', 'exp-112'
          ]);
          return parsed.filter(item => !staticIds.has(item.id));
        }
      } catch (e) { /* use initial */ }
    }
    return INITIAL_EXPENSES;
  });

  // Save to localStorage when expenses change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  // Try initial fetch from Supabase if configured
  useEffect(() => {
    const fetchFromSupabase = async () => {
      const client = getClient();
      if (!client) return;

      try {
        const { data, error } = await client
          .from('expenses')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          console.warn('Supabase fetch error:', error);
        } else if (data && data.length > 0) {
          setExpenses(data);
        }
      } catch (err) {
        console.warn('Could not sync with Supabase:', err);
      }
    };

    if (cloudConfig.isConfigured) {
      fetchFromSupabase();
    }
  }, [cloudConfig]);

  // Main View Navigation
  // 'all_expenses' | 'reports' | 'company' | 'personal'
  const [activeTab, setActiveTab] = useState('all_expenses');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | 'yesterday' | 'this_week' | 'this_month' | 'custom'
  const [customStartDate, setCustomStartDate] = useState(getRelativeDate(-7));
  const [customEndDate, setCustomEndDate] = useState(getRelativeDate(0));
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'company' | 'personal'
  const [attendanceOnly, setAttendanceOnly] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Sync with Supabase helper
  const syncExpenseToSupabase = async (expense, action = 'upsert') => {
    const client = getClient();
    if (!client) return;
    try {
      if (action === 'upsert') {
        await client.from('expenses').upsert(expense);
      } else if (action === 'delete') {
        await client.from('expenses').delete().eq('id', expense.id);
      }
    } catch (e) {
      console.warn('Supabase sync background error:', e);
    }
  };

  // Handle Save Expense (Add or Edit)
  const handleSaveExpense = (expenseData) => {
    if (editingExpense) {
      setExpenses(prev => prev.map(e => e.id === expenseData.id ? expenseData : e));
      showToast('Expense updated successfully');
    } else {
      setExpenses(prev => [expenseData, ...prev]);
      showToast('Expense added successfully');
    }
    syncExpenseToSupabase(expenseData, 'upsert');
    setEditingExpense(null);
  };

  // Handle Delete Expense
  const handleDeleteExpense = (expenseId) => {
    const itemToDelete = expenses.find(e => e.id === expenseId);
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
    if (itemToDelete) {
      syncExpenseToSupabase(itemToDelete, 'delete');
    }
    showToast('Expense removed');
  };

  // Open Edit Modal
  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsAddModalOpen(true);
  };

  // Simulate Attendance Sync Event
  const handleSimulateAttendanceSync = () => {
    const randomEmployee = SAMPLE_EMPLOYEES[Math.floor(Math.random() * SAMPLE_EMPLOYEES.length)];
    const newSimulatedExpense = {
      id: `exp-att-${Date.now()}`,
      category: 'company',
      subcategory: 'Field Travel & Conveyance',
      amount: 850 + Math.floor(Math.random() * 400),
      date: getRelativeDate(0),
      payment_method: 'UPI / GPay / PhonePe',
      vendor: 'Coimbatore-Tiruppur Site Conveyance Voucher',
      notes: `Automated sync via Biometric Attendance field check-in for machine maintenance.`,
      linked_employee_id: randomEmployee.id,
      employee_name: randomEmployee.name,
      attendance_date: getRelativeDate(0),
      expense_type: 'site_allowance',
      sync_status: 'linked_attendance',
      updated_at: new Date().toISOString()
    };

    setExpenses(prev => [newSimulatedExpense, ...prev]);
    syncExpenseToSupabase(newSimulatedExpense, 'upsert');
    showToast(`Synced ₹${newSimulatedExpense.amount} field allowance for ${randomEmployee.name}`);
  };

  // Handle Clear / Reset Data
  const handleResetData = () => {
    setExpenses([]);
    setBudgets(DEFAULT_BUDGETS);
    localStorage.removeItem(STORAGE_KEY_EXPENSES);
    localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(DEFAULT_BUDGETS));
    showToast('All expense records cleared');
  };

  // Save budgets
  const handleSaveBudgets = (newBudgets) => {
    setBudgets(newBudgets);
    localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(newBudgets));
    showToast('Budget limits updated');
  };

  // ---------------- FILTERING LOGIC ----------------
  const todayStr = getRelativeDate(0);
  const yesterdayStr = getRelativeDate(-1);

  // Current week start (Monday)
  const now = new Date();
  const currentDay = now.getDay();
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const weekStartStr = monday.toISOString().split('T')[0];

  // Current month prefix
  const currentMonthPrefix = now.toISOString().slice(0, 7);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // 1. Tab level category override
      if (activeTab === 'company' && expense.category !== 'company') return false;
      if (activeTab === 'personal' && expense.category !== 'personal') return false;

      // 2. Dropdown category filter
      if (categoryFilter !== 'all' && expense.category !== categoryFilter) return false;

      // 3. Attendance only
      if (attendanceOnly && !expense.linked_employee_id && expense.sync_status !== 'linked_attendance') return false;

      // 4. Date Filter
      if (dateFilter === 'today' && expense.date !== todayStr) return false;
      if (dateFilter === 'yesterday' && expense.date !== yesterdayStr) return false;
      if (dateFilter === 'this_week' && expense.date < weekStartStr) return false;
      if (dateFilter === 'this_month' && !expense.date.startsWith(currentMonthPrefix)) return false;
      if (dateFilter === 'custom') {
        if (customStartDate && expense.date < customStartDate) return false;
        if (customEndDate && expense.date > customEndDate) return false;
      }

      // 5. Search Text Filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesSubcategory = (expense.subcategory || '').toLowerCase().includes(query);
        const matchesVendor = (expense.vendor || '').toLowerCase().includes(query);
        const matchesNotes = (expense.notes || '').toLowerCase().includes(query);
        const matchesEmployee = (expense.employee_name || '').toLowerCase().includes(query);
        const matchesPayment = (expense.payment_method || '').toLowerCase().includes(query);

        if (!matchesSubcategory && !matchesVendor && !matchesNotes && !matchesEmployee && !matchesPayment) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [
    expenses, 
    activeTab, 
    categoryFilter, 
    attendanceOnly, 
    dateFilter, 
    customStartDate, 
    customEndDate, 
    searchTerm, 
    todayStr, 
    yesterdayStr, 
    weekStartStr, 
    currentMonthPrefix
  ]);

  // Exports
  const handleExportExcel = (itemsToExport = filteredExpenses, label = 'Expenses') => {
    exportToExcel(itemsToExport, label);
    showToast('Exported to Excel (.xlsx)');
  };

  const handleExportCSV = (itemsToExport = filteredExpenses) => {
    exportToCSV(itemsToExport, 'Covai_Machines_Expenses');
    showToast('Exported to CSV');
  };

  const handleExportPDF = (itemsToExport = filteredExpenses, label = 'Report') => {
    exportToPDF(itemsToExport, label);
    showToast('Exported PDF report');
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 2000,
          background: '#1e293b',
          color: '#f8fafc',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          fontSize: '0.86rem',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={18} style={{ color: '#10b981' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Luminous Deep Sapphire Master Fintech Hero Card (Screen 1 & 3) */}
      <FintechHero
        expenses={expenses}
        budgets={budgets}
        cloudConfig={cloudConfig}
        onOpenAddModal={() => { setEditingExpense(null); setIsAddModalOpen(true); }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAttendance={() => setIsAttendanceOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSelectCategory={(catName) => setSearchTerm(catName)}
      />

      {/* 2. Sleek Bottom Curved Sheet (Recent Transactions & Reports) */}
      {/* 2. Sleek Bottom Sheet */}
      <div className="fintech-bottom-sheet">
        {/* Navigation Tabs Bar */}
        <div className="sheet-header-nav">
          <div className="sheet-title-group">
            <h2 className="sheet-title">
              {activeTab === 'reports' 
                ? 'Analytics & Reports' 
                : activeTab === 'filters' 
                ? 'Search, Filters & Export' 
                : activeTab === 'company'
                ? 'Company Expenses'
                : activeTab === 'personal'
                ? 'Personal Expenses'
                : 'Recent Transactions'}
            </h2>
            <span className="sheet-count-badge">
              {activeTab === 'reports' 
                ? 'Detailed Summary' 
                : activeTab === 'filters'
                ? `${filteredExpenses.length} matching`
                : activeTab === 'company'
                ? `${expenses.filter(e => e.category === 'company').length} records`
                : activeTab === 'personal'
                ? `${expenses.filter(e => e.category === 'personal').length} records`
                : `${expenses.length} records`}
            </span>
          </div>

          <nav className="nav-tab-bar" aria-label="Main Navigation">
            <button
              className={`nav-tab-btn ${activeTab === 'all_expenses' ? 'active' : ''}`}
              onClick={() => setActiveTab('all_expenses')}
            >
              <Receipt size={15} />
              <span>All Expenses</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'company' ? 'active' : ''}`}
              onClick={() => setActiveTab('company')}
            >
              <Building2 size={15} style={{ color: 'var(--accent-company)' }} />
              <span>Company</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <User size={15} style={{ color: 'var(--accent-personal)' }} />
              <span>Personal</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'filters' ? 'active' : ''}`}
              onClick={() => setActiveTab('filters')}
            >
              <Filter size={15} />
              <span>Search & Filters</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <BarChart3 size={15} />
              <span>Reports</span>
            </button>
          </nav>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'reports' ? (
          <ReportsView
            expenses={expenses}
            budgets={budgets}
            onExportExcel={handleExportExcel}
            onExportPDF={handleExportPDF}
          />
        ) : activeTab === 'filters' ? (
          <div>
            {/* The Full Search, Filter & Export Box - only displayed in this dedicated tab! */}
            <ExpenseFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              onCustomDatesChange={(start, end) => { setCustomStartDate(start); setCustomEndDate(end); }}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              attendanceOnly={attendanceOnly}
              onAttendanceOnlyChange={setAttendanceOnly}
              onExportExcel={() => handleExportExcel(filteredExpenses, 'Filtered_Expenses')}
              onExportCSV={() => handleExportCSV(filteredExpenses)}
              onExportPDF={() => handleExportPDF(filteredExpenses, 'Filtered_Report')}
              filteredCount={filteredExpenses.length}
            />

            {/* Filtered Results Table */}
            <ExpenseTable
              expenses={filteredExpenses}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
              onOpenAddModal={() => { setEditingExpense(null); setIsAddModalOpen(true); }}
            />

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Database Mode: <strong>{cloudConfig.isConfigured ? 'Supabase Cloud Connected' : 'Local Storage'}</strong>
              </div>
              <button 
                className="btn btn-outline" 
                style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                onClick={() => setIsSettingsOpen(true)}
              >
                ⚙️ Database & Budget Settings
              </button>
            </div>
          </div>

        ) : activeTab === 'company' ? (
          <ExpenseTable
            expenses={expenses.filter(e => e.category === 'company')}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
            onOpenAddModal={() => { setEditingExpense(null); setIsAddModalOpen(true); }}
          />
        ) : activeTab === 'personal' ? (
          <ExpenseTable
            expenses={expenses.filter(e => e.category === 'personal')}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
            onOpenAddModal={() => { setEditingExpense(null); setIsAddModalOpen(true); }}
          />
        ) : (
          /* Landing Page: All Expenses - Completely clean without any filter box! */
          <ExpenseTable
            expenses={expenses}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
            onOpenAddModal={() => { setEditingExpense(null); setIsAddModalOpen(true); }}
          />
        )}
      </div>



      {/* Add / Edit Expense Modal */}
      <ExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditingExpense(null); }}
        onSave={handleSaveExpense}
        editingExpense={editingExpense}
      />

      {/* Attendance Integration Modal */}
      <AttendancePortalModal
        isOpen={isAttendanceOpen}
        onClose={() => setIsAttendanceOpen(false)}
        onSimulateSync={handleSimulateAttendanceSync}
      />

      {/* Settings & Supabase Cloud Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        cloudConfig={cloudConfig}
        onUpdateCloudConfig={() => setCloudConfig(getSupabaseConfig())}
        budgets={budgets}
        onSaveBudgets={handleSaveBudgets}
        onResetData={handleResetData}
      />

      {/* Progressive Web App Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAddModal={() => { setEditingExpense(null); setIsAddModalOpen(true); }}
        companyCount={expenses.filter(e => e.category === 'company').length}
        personalCount={expenses.filter(e => e.category === 'personal').length}
      />
    </div>
  );
}

export default App;
