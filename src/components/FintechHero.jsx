import React, { useMemo } from 'react';
import { 
  Building2, 
  User, 
  Calendar 
} from 'lucide-react';
import { formatCurrency } from '../services/exportService';

export const FintechHero = ({
  expenses = [],
  budgets,
  cloudConfig,
  onOpenAddModal,
  onOpenSettings,
  onOpenAttendance,
  theme,
  onToggleTheme,
  activeTab,
  onSelectTab
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentMonthPrefix = now.toISOString().slice(0, 7);

  // Month calculations
  const monthExpenses = useMemo(() => {
    return expenses.filter(e => e.date.startsWith(currentMonthPrefix));
  }, [expenses, currentMonthPrefix]);

  const monthTotal = useMemo(() => {
    return monthExpenses.reduce((s, e) => s + Number(e.amount), 0);
  }, [monthExpenses]);

  const todayExpenses = useMemo(() => {
    return expenses.filter(e => e.date === todayStr);
  }, [expenses, todayStr]);

  const todayTotal = useMemo(() => {
    return todayExpenses.reduce((s, e) => s + Number(e.amount), 0);
  }, [todayExpenses]);

  const companyExpenses = useMemo(() => {
    return monthExpenses.filter(e => e.category === 'company');
  }, [monthExpenses]);

  const companyTotal = useMemo(() => {
    return companyExpenses.reduce((s, e) => s + Number(e.amount), 0);
  }, [companyExpenses]);

  const personalExpenses = useMemo(() => {
    return monthExpenses.filter(e => e.category === 'personal');
  }, [monthExpenses]);

  const personalTotal = useMemo(() => {
    return personalExpenses.reduce((s, e) => s + Number(e.amount), 0);
  }, [personalExpenses]);

  return (
    <div className="fintech-master-card clean-dashboard-card">
      {/* 1. DEDICATED GREETING (Exact style from reference image: "Hello" / "Alexandra") */}
      <div className="hero-greeting-block">
        <div className="greeting-hello">Hello</div>
        <div className="greeting-name">Vasanth,</div>
        <div className="greeting-tagline">
          innaiku enna dhanda selavu pannuna?
        </div>
      </div>

      {/* 2. AIRY, UNBOXED BALANCE & CATEGORY SPLIT */}
      <div className="hero-balance-section">
        {/* Main Month Outflow Display */}
        <div className="hero-balance-main">
          <div className="hero-balance-eyebrow">
            <span className="eyebrow-text">Total Spent (This Month)</span>
            <span className="today-badge">
              <Calendar size={11} />
              <span>Today: <strong>{formatCurrency(todayTotal)}</strong></span>
            </span>
          </div>

          <div className="hero-balance-amount">
            {formatCurrency(monthTotal)}
          </div>
        </div>

        {/* Lightweight Split Action Chips */}
        <div className="hero-split-chips" role="group" aria-label="Filter by category">
          <button 
            type="button"
            className={`hero-split-chip company ${activeTab === 'company' ? 'active' : ''}`}
            onClick={() => onSelectTab(activeTab === 'company' ? 'all_expenses' : 'company')}
            title="Filter by Company Expenses"
          >
            <div className="chip-meta">
              <span className="chip-icon-box"><Building2 size={13} /></span>
              <span className="chip-title">Company</span>
            </div>
            <div className="chip-amount">{formatCurrency(companyTotal)}</div>
          </button>

          <button 
            type="button"
            className={`hero-split-chip personal ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => onSelectTab(activeTab === 'personal' ? 'all_expenses' : 'personal')}
            title="Filter by Personal Expenses"
          >
            <div className="chip-meta">
              <span className="chip-icon-box"><User size={13} /></span>
              <span className="chip-title">Personal</span>
            </div>
            <div className="chip-amount">{formatCurrency(personalTotal)}</div>
          </button>
        </div>
      </div>
    </div>
  );
};
