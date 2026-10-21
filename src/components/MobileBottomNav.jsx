import React from 'react';
import { 
  Receipt, 
  BarChart3, 
  Building2, 
  User, 
  Plus 
} from 'lucide-react';

export const MobileBottomNav = ({ 
  activeTab, 
  onSelectTab, 
  onOpenAddModal, 
  companyCount, 
  personalCount 
}) => {
  return (
    <div className="mobile-bottom-nav">
      {/* 1. All Expenses */}
      <button 
        className={`mobile-nav-item ${activeTab === 'all_expenses' ? 'active' : ''}`}
        onClick={() => onSelectTab('all_expenses')}
        aria-label="Expenses"
      >
        <Receipt size={20} />
        <span className="mobile-nav-label">Expenses</span>
      </button>

      {/* 2. Reports */}
      <button 
        className={`mobile-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
        onClick={() => onSelectTab('reports')}
        aria-label="Reports"
      >
        <BarChart3 size={20} />
        <span className="mobile-nav-label">Reports</span>
      </button>

      {/* 3. CENTER FLOATING ACTION BUTTON (Add Expense) */}
      <div className="mobile-fab-container">
        <button 
          className="mobile-fab-btn" 
          onClick={onOpenAddModal}
          aria-label="Add Expense"
          title="Add New Expense"
        >
          <Plus size={26} strokeWidth={2.6} />
        </button>
      </div>

      {/* 4. Company Expenses */}
      <button 
        className={`mobile-nav-item ${activeTab === 'company' ? 'active' : ''}`}
        onClick={() => onSelectTab('company')}
        aria-label="Company"
      >
        <div style={{ position: 'relative' }}>
          <Building2 size={20} style={{ color: activeTab === 'company' ? 'var(--accent-company)' : 'inherit' }} />
          {companyCount > 0 && (
            <span className="mobile-tab-badge company">{companyCount}</span>
          )}
        </div>
        <span className="mobile-nav-label">Company</span>
      </button>

      {/* 5. Personal Expenses */}
      <button 
        className={`mobile-nav-item ${activeTab === 'personal' ? 'active' : ''}`}
        onClick={() => onSelectTab('personal')}
        aria-label="Personal"
      >
        <div style={{ position: 'relative' }}>
          <User size={20} style={{ color: activeTab === 'personal' ? 'var(--accent-personal)' : 'inherit' }} />
          {personalCount > 0 && (
            <span className="mobile-tab-badge personal">{personalCount}</span>
          )}
        </div>
        <span className="mobile-nav-label">Personal</span>
      </button>
    </div>
  );
};
