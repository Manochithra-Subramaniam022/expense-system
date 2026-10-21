import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  CalendarDays, 
  BarChart3, 
  PieChart, 
  Building2, 
  User, 
  ArrowUpRight, 
  TrendingUp, 
  FileSpreadsheet, 
  FileText, 
  Users, 
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '../services/exportService';

export const ReportsView = ({ 
  expenses, 
  budgets, 
  onExportExcel, 
  onExportPDF 
}) => {
  const [reportType, setReportType] = useState('daily'); // 'daily' | 'weekly' | 'monthly'

  // Daily report state
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDay, setSelectedDay] = useState(todayStr);

  // Weekly report state - current week start
  const now = new Date();
  const currentDay = now.getDay();
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const currentMonday = new Date(now);
  currentMonday.setDate(now.getDate() + diffToMonday);
  const [selectedWeekStart, setSelectedWeekStart] = useState(currentMonday.toISOString().split('T')[0]);

  // Monthly report state
  const [selectedMonth, setSelectedMonth] = useState(now.toISOString().slice(0, 7)); // YYYY-MM

  // ---------------- DAILY COMPUTATIONS ----------------
  const dailyData = useMemo(() => {
    const dayExpenses = expenses.filter(e => e.date === selectedDay);
    const total = dayExpenses.reduce((s, e) => s + Number(e.amount), 0);
    const company = dayExpenses.filter(e => e.category === 'company').reduce((s, e) => s + Number(e.amount), 0);
    const personal = dayExpenses.filter(e => e.category === 'personal').reduce((s, e) => s + Number(e.amount), 0);
    const attendanceLinked = dayExpenses.filter(e => e.sync_status === 'linked_attendance' || e.linked_employee_id);

    // Group by subcategory
    const subcategories = {};
    dayExpenses.forEach(e => {
      subcategories[e.subcategory] = (subcategories[e.subcategory] || 0) + Number(e.amount);
    });
    const subcategoryList = Object.entries(subcategories)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);

    return {
      expenses: dayExpenses,
      total,
      company,
      personal,
      attendanceLinked,
      subcategories: subcategoryList
    };
  }, [expenses, selectedDay]);

  // ---------------- WEEKLY COMPUTATIONS ----------------
  const weeklyData = useMemo(() => {
    const startDate = new Date(selectedWeekStart);
    const days = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    let weekTotal = 0;
    let weekCompany = 0;
    let weekPersonal = 0;
    const weekExpensesList = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];

      const dayItems = expenses.filter(e => e.date === dateStr);
      const dayComp = dayItems.filter(e => e.category === 'company').reduce((s, e) => s + Number(e.amount), 0);
      const dayPers = dayItems.filter(e => e.category === 'personal').reduce((s, e) => s + Number(e.amount), 0);
      const daySum = dayComp + dayPers;

      weekTotal += daySum;
      weekCompany += dayComp;
      weekPersonal += dayPers;
      weekExpensesList.push(...dayItems);

      days.push({
        dateStr,
        name: dayNames[i],
        formatted: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        company: dayComp,
        personal: dayPers,
        total: daySum
      });
    }

    const maxDayTotal = Math.max(...days.map(d => d.total), 1);

    return {
      days,
      weekTotal,
      weekCompany,
      weekPersonal,
      expenses: weekExpensesList,
      maxDayTotal,
      dailyAverage: Math.round(weekTotal / 7)
    };
  }, [expenses, selectedWeekStart]);

  // ---------------- MONTHLY COMPUTATIONS ----------------
  const monthlyData = useMemo(() => {
    const monthExpenses = expenses.filter(e => e.date.startsWith(selectedMonth));
    const total = monthExpenses.reduce((s, e) => s + Number(e.amount), 0);
    const company = monthExpenses.filter(e => e.category === 'company').reduce((s, e) => s + Number(e.amount), 0);
    const personal = monthExpenses.filter(e => e.category === 'personal').reduce((s, e) => s + Number(e.amount), 0);
    const attendanceLinked = monthExpenses.filter(e => e.sync_status === 'linked_attendance' || e.linked_employee_id);

    // Group by Subcategories
    const compSubs = {};
    const persSubs = {};
    const paymentMethods = {};

    monthExpenses.forEach(e => {
      if (e.category === 'company') {
        compSubs[e.subcategory] = (compSubs[e.subcategory] || 0) + Number(e.amount);
      } else {
        persSubs[e.subcategory] = (persSubs[e.subcategory] || 0) + Number(e.amount);
      }
      paymentMethods[e.payment_method] = (paymentMethods[e.payment_method] || 0) + Number(e.amount);
    });

    const topCompanySubs = Object.entries(compSubs)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);

    const topPersonalSubs = Object.entries(persSubs)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);

    const paymentMethodsList = Object.entries(paymentMethods)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);

    const companyBudget = budgets?.company_monthly || 200000;
    const personalBudget = budgets?.personal_monthly || 45000;

    return {
      expenses: monthExpenses,
      total,
      company,
      personal,
      attendanceLinked,
      topCompanySubs,
      topPersonalSubs,
      paymentMethodsList,
      companyBudget,
      personalBudget,
      companyPct: Math.round((company / companyBudget) * 100),
      personalPct: Math.round((personal / personalBudget) * 100)
    };
  }, [expenses, selectedMonth, budgets]);

  return (
    <div style={{ marginTop: 8 }}>
      {/* Report Switcher Header */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '16px 20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 16,
          marginBottom: 20 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ padding: 8, borderRadius: 8, background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Financial Reports & Analytics</h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Comprehensive Daily, Weekly, and Monthly breakdown with Attendance audit
            </div>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg-input)', padding: 4, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            className={`btn ${reportType === 'daily' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            onClick={() => setReportType('daily')}
          >
            <Calendar size={14} />
            <span>Daily Report</span>
          </button>

          <button
            className={`btn ${reportType === 'weekly' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            onClick={() => setReportType('weekly')}
          >
            <CalendarDays size={14} />
            <span>Weekly Report</span>
          </button>

          <button
            className={`btn ${reportType === 'monthly' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            onClick={() => setReportType('monthly')}
          >
            <TrendingUp size={14} />
            <span>Monthly Report</span>
          </button>
        </div>
      </div>

      {/* ---------------- 1. DAILY REPORT ---------------- */}
      {reportType === 'daily' && (
        <div>
          {/* Daily Filter Bar */}
          <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Select Date:</span>
              <input
                type="date"
                className="filter-input"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              />
              {selectedDay === todayStr && (
                <span className="badge-attendance" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                  Today
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className="btn btn-outline" 
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                onClick={() => onExportExcel(dailyData.expenses, `Daily_${selectedDay}`)}
              >
                <FileSpreadsheet size={14} style={{ color: '#10b981' }} />
                <span>Export Day to Excel</span>
              </button>
              <button 
                className="btn btn-outline" 
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                onClick={() => onExportPDF(dailyData.expenses, `Daily_${selectedDay}`)}
              >
                <FileText size={14} style={{ color: '#ef4444' }} />
                <span>Export Day PDF</span>
              </button>
            </div>
          </div>

          {/* Daily Metrics */}
          <div className="stats-grid">
            <div className="glass-panel stat-card total">
              <div className="stat-header">
                <span className="stat-title">Total Spend for Day</span>
                <Calendar size={18} style={{ color: '#818cf8' }} />
              </div>
              <div className="stat-amount">{formatCurrency(dailyData.total)}</div>
              <div className="stat-footer">
                <span>{dailyData.expenses.length} transactions recorded</span>
                <span>{formatDate(selectedDay)}</span>
              </div>
            </div>

            <div className="glass-panel stat-card company">
              <div className="stat-header">
                <span className="stat-title">Company Spend</span>
                <Building2 size={18} style={{ color: 'var(--accent-company)' }} />
              </div>
              <div className="stat-amount" style={{ color: 'var(--accent-company-text)' }}>{formatCurrency(dailyData.company)}</div>
              <div className="stat-footer">
                <span>{dailyData.total ? `${Math.round((dailyData.company / dailyData.total) * 100)}% of day's total` : '0%'}</span>
                <span>{dailyData.expenses.filter(e => e.category === 'company').length} items</span>
              </div>
            </div>

            <div className="glass-panel stat-card personal">
              <div className="stat-header">
                <span className="stat-title">Personal Spend</span>
                <User size={18} style={{ color: 'var(--accent-personal)' }} />
              </div>
              <div className="stat-amount" style={{ color: 'var(--accent-personal-text)' }}>{formatCurrency(dailyData.personal)}</div>
              <div className="stat-footer">
                <span>{dailyData.total ? `${Math.round((dailyData.personal / dailyData.total) * 100)}% of day's total` : '0%'}</span>
                <span>{dailyData.expenses.filter(e => e.category === 'personal').length} items</span>
              </div>
            </div>

            <div className="glass-panel stat-card attendance">
              <div className="stat-header">
                <span className="stat-title">Attendance Linked Spend</span>
                <Users size={18} style={{ color: 'var(--accent-attendance)' }} />
              </div>
              <div className="stat-amount" style={{ color: '#22d3ee' }}>
                {formatCurrency(dailyData.attendanceLinked.reduce((s, e) => s + Number(e.amount), 0))}
              </div>
              <div className="stat-footer">
                <span>{dailyData.attendanceLinked.length} linked employee/shift entries</span>
              </div>
            </div>
          </div>

          {/* Day Itemization & Subcategories */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginTop: 20 }}>
            {/* Day Items List */}
            <div className="glass-panel" style={{ padding: 20 }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Day Itemization Breakdown</h3>
              {dailyData.expenses.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No expenses recorded on this date.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {dailyData.expenses.map(e => (
                    <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>{e.subcategory}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {e.vendor || e.notes || 'General entry'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className={`amount-text ${e.category}`}>{formatCurrency(e.amount)}</div>
                        <span className={`badge-category ${e.category}`} style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                          {e.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subcategories Breakdown */}
            <div className="glass-panel" style={{ padding: 20 }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Top Spending Areas for Day</h3>
              {dailyData.subcategories.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No spending recorded.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {dailyData.subcategories.map(sub => {
                    const pct = Math.round((sub.amount / dailyData.total) * 100);
                    return (
                      <div key={sub.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                          <span style={{ fontWeight: 600 }}>{sub.name}</span>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(sub.amount)} ({pct}%)</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill normal" style={{ width: `${pct}%`, background: '#6366f1' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 2. WEEKLY REPORT ---------------- */}
      {reportType === 'weekly' && (
        <div>
          {/* Weekly Filter Bar */}
          <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Week Starting (Monday):</span>
              <input
                type="date"
                className="filter-input"
                value={selectedWeekStart}
                onChange={(e) => setSelectedWeekStart(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className="btn btn-outline" 
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                onClick={() => onExportExcel(weeklyData.expenses, `Weekly_${selectedWeekStart}`)}
              >
                <FileSpreadsheet size={14} style={{ color: '#10b981' }} />
                <span>Export Week to Excel</span>
              </button>
              <button 
                className="btn btn-outline" 
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                onClick={() => onExportPDF(weeklyData.expenses, `Weekly_${selectedWeekStart}`)}
              >
                <FileText size={14} style={{ color: '#ef4444' }} />
                <span>Export Week PDF</span>
              </button>
            </div>
          </div>

          {/* Weekly Summary Cards */}
          <div className="stats-grid">
            <div className="glass-panel stat-card total">
              <div className="stat-header">
                <span className="stat-title">Total Week Outflow</span>
                <CalendarDays size={18} style={{ color: '#818cf8' }} />
              </div>
              <div className="stat-amount">{formatCurrency(weeklyData.weekTotal)}</div>
              <div className="stat-footer">
                <span>Avg: {formatCurrency(weeklyData.dailyAverage)} / day</span>
                <span>{weeklyData.expenses.length} transactions</span>
              </div>
            </div>

            <div className="glass-panel stat-card company">
              <div className="stat-header">
                <span className="stat-title">Company Spend (Week)</span>
                <Building2 size={18} style={{ color: 'var(--accent-company)' }} />
              </div>
              <div className="stat-amount" style={{ color: 'var(--accent-company-text)' }}>{formatCurrency(weeklyData.weekCompany)}</div>
              <div className="stat-footer">
                <span>{weeklyData.weekTotal ? `${Math.round((weeklyData.weekCompany / weeklyData.weekTotal) * 100)}% of week` : '0%'}</span>
              </div>
            </div>

            <div className="glass-panel stat-card personal">
              <div className="stat-header">
                <span className="stat-title">Personal Spend (Week)</span>
                <User size={18} style={{ color: 'var(--accent-personal)' }} />
              </div>
              <div className="stat-amount" style={{ color: 'var(--accent-personal-text)' }}>{formatCurrency(weeklyData.weekPersonal)}</div>
              <div className="stat-footer">
                <span>{weeklyData.weekTotal ? `${Math.round((weeklyData.weekPersonal / weeklyData.weekTotal) * 100)}% of week` : '0%'}</span>
              </div>
            </div>
          </div>

          {/* Weekly Interactive Bar Chart */}
          <div className="glass-panel" style={{ padding: 24, marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Day-by-Day Expense Progression</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Visual comparison between Company and Personal spending per day
                </span>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, background: 'var(--accent-company)', borderRadius: 2 }} />
                  <span>Company</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, background: 'var(--accent-personal)', borderRadius: 2 }} />
                  <span>Personal</span>
                </div>
              </div>
            </div>

            {/* Bar columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12, alignItems: 'end', minHeight: 220, paddingTop: 30, borderBottom: '1px solid var(--border-subtle)' }}>
              {weeklyData.days.map((d) => {
                const compHeight = weeklyData.maxDayTotal > 0 ? (d.company / weeklyData.maxDayTotal) * 160 : 0;
                const persHeight = weeklyData.maxDayTotal > 0 ? (d.personal / weeklyData.maxDayTotal) * 160 : 0;

                return (
                  <div key={d.dateStr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {d.total > 0 ? formatCurrency(d.total) : '₹0'}
                    </div>

                    <div style={{ width: '100%', maxWidth: 44, display: 'flex', flexDirection: 'column-reverse', gap: 2 }}>
                      {/* Personal bar */}
                      <div 
                        style={{ 
                          width: '100%', 
                          height: `${Math.max(persHeight, d.personal > 0 ? 6 : 0)}px`, 
                          background: 'var(--accent-personal)', 
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.3s ease'
                        }} 
                        title={`Personal: ${formatCurrency(d.personal)}`}
                      />
                      {/* Company bar */}
                      <div 
                        style={{ 
                          width: '100%', 
                          height: `${Math.max(compHeight, d.company > 0 ? 6 : 0)}px`, 
                          background: 'var(--accent-company)', 
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.3s ease'
                        }} 
                        title={`Company: ${formatCurrency(d.company)}`}
                      />
                    </div>

                    <div style={{ textAlign: 'center', marginTop: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{d.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{d.formatted}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 3. MONTHLY REPORT ---------------- */}
      {reportType === 'monthly' && (
        <div>
          {/* Monthly Filter Bar */}
          <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Select Month:</span>
              <input
                type="month"
                className="filter-input"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className="btn btn-outline" 
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                onClick={() => onExportExcel(monthlyData.expenses, `Monthly_${selectedMonth}`)}
              >
                <FileSpreadsheet size={14} style={{ color: '#10b981' }} />
                <span>Export Month to Excel</span>
              </button>
              <button 
                className="btn btn-outline" 
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                onClick={() => onExportPDF(monthlyData.expenses, `Monthly_${selectedMonth}`)}
              >
                <FileText size={14} style={{ color: '#ef4444' }} />
                <span>Export Month PDF</span>
              </button>
            </div>
          </div>

          {/* Monthly Budget Performance Overview */}
          <div className="stats-grid">
            <div className="glass-panel stat-card total">
              <div className="stat-header">
                <span className="stat-title">Total Monthly Outflow</span>
                <TrendingUp size={18} style={{ color: '#818cf8' }} />
              </div>
              <div className="stat-amount">{formatCurrency(monthlyData.total)}</div>
              <div className="stat-footer">
                <span>{monthlyData.expenses.length} total entries</span>
                <span>Period: {selectedMonth}</span>
              </div>
            </div>

            <div className="glass-panel stat-card company">
              <div className="stat-header">
                <span className="stat-title">Company Monthly Outflow</span>
                <Building2 size={18} style={{ color: 'var(--accent-company)' }} />
              </div>
              <div className="stat-amount" style={{ color: 'var(--accent-company-text)' }}>{formatCurrency(monthlyData.company)}</div>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: 4 }}>
                  <span>Budget: {formatCurrency(monthlyData.companyBudget)}</span>
                  <span style={{ fontWeight: 700, color: monthlyData.companyPct > 90 ? 'var(--accent-warning)' : 'inherit' }}>
                    {monthlyData.companyPct}%
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className={`progress-bar-fill ${monthlyData.companyPct > 95 ? 'danger' : monthlyData.companyPct > 75 ? 'warning' : 'normal'}`}
                    style={{ width: `${Math.min(monthlyData.companyPct, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="glass-panel stat-card personal">
              <div className="stat-header">
                <span className="stat-title">Personal Monthly Outflow</span>
                <User size={18} style={{ color: 'var(--accent-personal)' }} />
              </div>
              <div className="stat-amount" style={{ color: 'var(--accent-personal-text)' }}>{formatCurrency(monthlyData.personal)}</div>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: 4 }}>
                  <span>Budget: {formatCurrency(monthlyData.personalBudget)}</span>
                  <span style={{ fontWeight: 700, color: monthlyData.personalPct > 90 ? 'var(--accent-warning)' : 'inherit' }}>
                    {monthlyData.personalPct}%
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className={`progress-bar-fill ${monthlyData.personalPct > 95 ? 'danger' : monthlyData.personalPct > 75 ? 'warning' : 'normal'}`}
                    style={{ width: `${Math.min(monthlyData.personalPct, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="glass-panel stat-card attendance">
              <div className="stat-header">
                <span className="stat-title">Attendance Linked Total</span>
                <Users size={18} style={{ color: 'var(--accent-attendance)' }} />
              </div>
              <div className="stat-amount" style={{ color: '#22d3ee' }}>
                {formatCurrency(monthlyData.attendanceLinked.reduce((s, e) => s + Number(e.amount), 0))}
              </div>
              <div className="stat-footer">
                <span>{monthlyData.attendanceLinked.length} payroll-sync items</span>
              </div>
            </div>
          </div>

          {/* Monthly Detailed Breakdown Panels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginTop: 24 }}>
            {/* Top Company Subcategories */}
            <div className="glass-panel" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Building2 size={18} style={{ color: 'var(--accent-company)' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Company Expense Categories</h3>
              </div>
              {monthlyData.topCompanySubs.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No company expenses for this month.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {monthlyData.topCompanySubs.map(item => {
                    const pct = Math.round((item.amount / (monthlyData.company || 1)) * 100);
                    return (
                      <div key={item.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                          <span style={{ fontWeight: 600 }}>{item.name}</span>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(item.amount)} ({pct}%)</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill normal" style={{ width: `${pct}%`, background: 'var(--accent-company)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top Personal Subcategories */}
            <div className="glass-panel" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <User size={18} style={{ color: 'var(--accent-personal)' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Personal Expense Categories</h3>
              </div>
              {monthlyData.topPersonalSubs.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No personal expenses for this month.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {monthlyData.topPersonalSubs.map(item => {
                    const pct = Math.round((item.amount / (monthlyData.personal || 1)) * 100);
                    return (
                      <div key={item.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                          <span style={{ fontWeight: 600 }}>{item.name}</span>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(item.amount)} ({pct}%)</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill normal" style={{ width: `${pct}%`, background: 'var(--accent-personal)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payment Method Distribution */}
            <div className="glass-panel" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <CreditCard size={18} style={{ color: '#f59e0b' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Payment Method Distribution</h3>
              </div>
              {monthlyData.paymentMethodsList.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No payment records.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {monthlyData.paymentMethodsList.map(pm => {
                    const pct = Math.round((pm.amount / (monthlyData.total || 1)) * 100);
                    return (
                      <div key={pm.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                          <span style={{ fontWeight: 600 }}>{pm.name}</span>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(pm.amount)} ({pct}%)</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill normal" style={{ width: `${pct}%`, background: '#f59e0b' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
