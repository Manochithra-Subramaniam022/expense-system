import React from 'react';
import { 
  Building2, 
  User, 
  Calendar, 
  CalendarDays, 
  TrendingDown, 
  AlertTriangle, 
  Users, 
  Sparkles 
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

  // Attendance linked company expenses
  const attendanceLinkedMonth = monthExpenses
    .filter(e => e.sync_status === 'linked_attendance' || e.linked_employee_id)
    .reduce((s, e) => s + Number(e.amount), 0);

  // Budgets & Percentages
  const companyBudget = budgets?.company_monthly || 200000;
  const personalBudget = budgets?.personal_monthly || 45000;

  const companyPercent = Math.min(Math.round((monthCompany / companyBudget) * 100), 100);
  const personalPercent = Math.min(Math.round((monthPersonal / personalBudget) * 100), 100);

  const getStatusClass = (pct) => {
    if (pct >= 95) return 'danger';
    if (pct >= 75) return 'warning';
    return 'normal';
  };

  return (
    <div style={{ marginBottom: 28 }}>
      <div className="stats-grid">
        {/* Today's Expense Card */}
        <div className="glass-panel stat-card total">
          <div className="stat-header">
            <span className="stat-title">Today's Expenses</span>
            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div className="stat-amount">{formatCurrency(todayTotal)}</div>
          <div className="stat-footer">
            <span>
              {todayExpenses.length} entries recorded
            </span>
            <span>
              C: {formatCurrency(todayExpenses.filter(e => e.category === 'company').reduce((s,e) => s + Number(e.amount), 0))} | P: {formatCurrency(todayExpenses.filter(e => e.category === 'personal').reduce((s,e) => s + Number(e.amount), 0))}
            </span>
          </div>
        </div>

        {/* This Week Card */}
        <div className="glass-panel stat-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div className="stat-header">
            <span className="stat-title">This Week (Mon - Today)</span>
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
              <CalendarDays size={18} />
            </div>
          </div>
          <div className="stat-amount">{formatCurrency(weekTotal)}</div>
          <div className="stat-footer">
            <span>{weekExpenses.length} transactions</span>
            <span style={{ color: 'var(--text-secondary)' }}>Weekly rolling</span>
          </div>
        </div>

        {/* Company Month Card */}
        <div className="glass-panel stat-card company">
          <div className="stat-header">
            <span className="stat-title">Company Expenses (Month)</span>
            <div className="stat-icon" style={{ background: 'var(--accent-company-light)', color: 'var(--accent-company)' }}>
              <Building2 size={18} />
            </div>
          </div>
          <div className="stat-amount" style={{ color: '#a5b4fc' }}>{formatCurrency(monthCompany)}</div>
          
          {/* Company Budget progress */}
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 4, color: 'var(--text-secondary)' }}>
              <span>Budget: {formatCurrency(companyBudget)}</span>
              <span style={{ fontWeight: 600 }}>{companyPercent}% used</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className={`progress-bar-fill ${getStatusClass(companyPercent)}`}
                style={{ width: `${companyPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Personal Month Card */}
        <div className="glass-panel stat-card personal">
          <div className="stat-header">
            <span className="stat-title">Personal Expenses (Month)</span>
            <div className="stat-icon" style={{ background: 'var(--accent-personal-light)', color: 'var(--accent-personal)' }}>
              <User size={18} />
            </div>
          </div>
          <div className="stat-amount" style={{ color: '#6ee7b7' }}>{formatCurrency(monthPersonal)}</div>

          {/* Personal Budget progress */}
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 4, color: 'var(--text-secondary)' }}>
              <span>Budget: {formatCurrency(personalBudget)}</span>
              <span style={{ fontWeight: 600 }}>{personalPercent}% used</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className={`progress-bar-fill ${getStatusClass(personalPercent)}`}
                style={{ width: `${personalPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Attendance Integration Ribbon */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '12px 18px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: 12,
          background: 'rgba(6, 182, 212, 0.04)',
          border: '1px solid rgba(6, 182, 212, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ padding: 6, borderRadius: 8, background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-attendance)' }}>
            <Users size={18} />
          </div>
          <div>
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Attendance-Linked Company Expenses: {formatCurrency(attendanceLinkedMonth)} this month
            </span>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              Includes field technician travel, staff shift refreshment allowance, and salary advance vouchers.
            </div>
          </div>
        </div>

        {(companyPercent >= 90 || personalPercent >= 90) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-warning)', fontSize: '0.78rem', fontWeight: 600 }}>
            <AlertTriangle size={15} />
            <span>Budget limit alert threshold active</span>
          </div>
        )}
      </div>
    </div>
  );
};
