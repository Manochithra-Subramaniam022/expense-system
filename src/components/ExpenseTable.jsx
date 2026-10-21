import React from 'react';
import { 
  Building2, 
  User, 
  Edit3, 
  Trash2, 
  Users, 
  CreditCard, 
  Inbox, 
  Calendar,
  Store,
  FileText
} from 'lucide-react';
import { formatCurrency, formatDate } from '../services/exportService';

export const ExpenseTable = ({ 
  expenses, 
  onEditExpense, 
  onDeleteExpense,
  onOpenAddModal 
}) => {
  if (expenses.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ 
          width: 56, 
          height: 56, 
          borderRadius: '50%', 
          background: 'rgba(255, 255, 255, 0.04)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: 'var(--text-muted)'
        }}>
          <Inbox size={28} />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>No Expense Records Found</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: 420, margin: '0 auto 20px' }}>
          No expenses match the current filter or date range. You can adjust your filters or record a new expense.
        </p>
        <button className="btn btn-primary" onClick={onOpenAddModal}>
          + Record New Expense
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* 1. DESKTOP TABLE VIEW (Shown on >= 769px) */}
      <div className="glass-panel table-wrapper desktop-only-table">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Subcategory & Payee</th>
              <th>Attendance / Employee Link</th>
              <th>Payment</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th style={{ textAlign: 'center', width: '90px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              const isCompany = expense.category === 'company';
              const isAttendance = Boolean(expense.linked_employee_id || expense.sync_status === 'linked_attendance');

              return (
                <tr key={expense.id}>
                  {/* Date */}
                  <td style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={14} style={{ opacity: 0.6 }} />
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </td>

                  {/* Category Pill */}
                  <td>
                    <span className={`badge-category ${isCompany ? 'company' : 'personal'}`}>
                      {isCompany ? <Building2 size={12} /> : <User size={12} />}
                      {expense.category}
                    </span>
                  </td>

                  {/* Subcategory & Vendor */}
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {expense.subcategory}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      {expense.vendor && <span style={{ marginRight: 6 }}>📍 {expense.vendor}</span>}
                      {expense.notes && <span style={{ opacity: 0.85 }}>• {expense.notes}</span>}
                    </div>
                  </td>

                  {/* Attendance Linkage */}
                  <td>
                    {isAttendance ? (
                      <div>
                        <span className="badge-attendance">
                          <Users size={11} />
                          {expense.sync_status === 'approved' ? 'Payroll Approved' : 'Attendance Synced'}
                        </span>
                        {expense.employee_name && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                            {expense.employee_name}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>

                  {/* Payment Method */}
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <CreditCard size={13} style={{ opacity: 0.7 }} />
                      {(expense.payment_method || 'Cash').split(' ')[0]}
                    </span>
                  </td>

                  {/* Amount */}
                  <td style={{ textAlign: 'right' }}>
                    <span className={`amount-text ${isCompany ? 'company' : 'personal'}`}>
                      {formatCurrency(expense.amount)}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <button
                        className="btn btn-secondary btn-icon-only"
                        onClick={() => onEditExpense(expense)}
                        title="Edit Expense"
                        aria-label="Edit Expense"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="btn btn-secondary btn-icon-only"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this expense record?')) {
                            onDeleteExpense(expense.id);
                          }
                        }}
                        title="Delete Expense"
                        aria-label="Delete Expense"
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 2. MOBILE CARD VIEW (Shown on <= 768px) */}
      <div className="mobile-cards-list">
        {expenses.map((expense) => {
          const isCompany = expense.category === 'company';
          const isAttendance = Boolean(expense.linked_employee_id || expense.sync_status === 'linked_attendance');

          return (
            <div 
              key={expense.id} 
              className={`mobile-expense-card glass-panel ${isCompany ? 'company-card' : 'personal-card'}`}
            >
              {/* Top Row: Category, Date, Payment */}
              <div className="mobile-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className={`badge-category ${isCompany ? 'company' : 'personal'}`}>
                    {isCompany ? <Building2 size={11} /> : <User size={11} />}
                    {expense.category}
                  </span>
                  <span className="mobile-card-date">
                    {formatDate(expense.date)}
                  </span>
                </div>

                <span className="mobile-card-paymethod">
                  {(expense.payment_method || 'Cash').split(' ')[0]}
                </span>
              </div>

              {/* Subcategory & Vendor */}
              <div className="mobile-card-body">
                <div className="mobile-card-title">
                  {expense.subcategory}
                </div>
                {expense.vendor && (
                  <div className="mobile-card-vendor">
                    <Store size={12} style={{ opacity: 0.7 }} />
                    <span>{expense.vendor}</span>
                  </div>
                )}
                {expense.notes && (
                  <div className="mobile-card-notes">
                    <FileText size={12} style={{ opacity: 0.7 }} />
                    <span>{expense.notes}</span>
                  </div>
                )}

                {/* Attendance Tag */}
                {isAttendance && (
                  <div className="mobile-card-attendance">
                    <span className="badge-attendance">
                      <Users size={11} />
                      <span>{expense.sync_status === 'approved' ? 'Payroll Approved' : 'Attendance Synced'}</span>
                    </span>
                    {expense.employee_name && (
                      <span className="mobile-card-empname">
                        {expense.employee_name}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Row: Large Amount & Touch Actions */}
              <div className="mobile-card-footer">
                <div className={`amount-text ${isCompany ? 'company' : 'personal'}`} style={{ fontSize: '1.2rem' }}>
                  {formatCurrency(expense.amount)}
                </div>

                <div className="mobile-card-actions">
                  <button
                    className="mobile-action-btn edit"
                    onClick={() => onEditExpense(expense)}
                    aria-label="Edit"
                  >
                    <Edit3 size={15} />
                    <span>Edit</span>
                  </button>
                  <button
                    className="mobile-action-btn delete"
                    onClick={() => {
                      if (window.confirm('Delete this expense?')) {
                        onDeleteExpense(expense.id);
                      }
                    }}
                    aria-label="Delete"
                  >
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
