import React from 'react';
import { 
  Building2, 
  User, 
  TrendingUp, 
  Calendar,
  Layers
} from 'lucide-react';
import { formatCurrency } from '../services/exportService';

export const StatsOverview = ({ expenses, budgets }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate start of current week (Monday)
  const now = new Date();
  const currentDay = now.getDay();
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const weekStartStr = monday.toISOString().split('T')[0];

  // Current month string YYYY-MM
  const currentMonthPrefix = now.toISOString().slice(0, 7);

  // Filter calculations
  const todayExpenses = expenses.filter(e => e.date === todayStr);
  const weekExpenses = expenses.filter(e => e.date >= weekStartStr);
  const monthExpenses = expenses.filter(e => e.date.startsWith(currentMonthPrefix));

  const todayTotal = todayExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const weekTotal = weekExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const monthTotal = monthExpenses.reduce((s, e) => s + Number(e.amount), 0);

  // Month category splits
  const monthCompany = monthExpenses
    .filter(e => e.category === 'company')
    .reduce((s, e) => s + Number(e.amount), 0);

  const monthPersonal = monthExpenses
    .filter(e => e.category === 'personal')
    .reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="simple-overview-container">
      <div className="glass-panel simple-overview-card">
        {/* Top Header: Month Total */}
        <div className="overview-top-row">
          <div>
            <div className="overview-label">Total Spent This Month</div>
            <div className="overview-main-amount">{formatCurrency(monthTotal)}</div>
          </div>
          <div className="overview-today-badge">
            <Calendar size={13} />
            <span>Today: <strong>{formatCurrency(todayTotal)}</strong></span>
          </div>
        </div>

        {/* 2 Equal Columns: Company vs Personal */}
        <div className="overview-split-grid">
          {/* Company Column */}
          <div className="overview-col company-col">
            <div className="overview-col-header">
              <span className="col-icon-box company">
                <Building2 size={15} />
              </span>
              <span className="col-name">Company</span>
            </div>
            <div className="col-amount company">
              {formatCurrency(monthCompany)}
            </div>
            <div className="col-meta">
              {monthExpenses.filter(e => e.category === 'company').length} expenses
            </div>
          </div>

          {/* Personal Column */}
          <div className="overview-col personal-col">
            <div className="overview-col-header">
              <span className="col-icon-box personal">
                <User size={15} />
              </span>
              <span className="col-name">Personal</span>
            </div>
            <div className="col-amount personal">
              {formatCurrency(monthPersonal)}
            </div>
            <div className="col-meta">
              {monthExpenses.filter(e => e.category === 'personal').length} expenses
            </div>
          </div>
        </div>

        {/* Subtle quick note */}
        <div className="overview-quick-footer">
          <span>This Week: {formatCurrency(weekTotal)} ({weekExpenses.length} transactions)</span>
        </div>
      </div>
    </div>
  );
};
