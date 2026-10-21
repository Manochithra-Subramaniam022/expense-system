import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  User, 
  Check, 
  IndianRupee, 
  Calendar, 
  Tag, 
  CreditCard, 
  Users, 
  FileText, 
  Store 
} from 'lucide-react';
import { 
  PERSONAL_SUBCATEGORIES, 
  COMPANY_SUBCATEGORIES, 
  PAYMENT_METHODS, 
  ATTENDANCE_EXPENSE_TYPES, 
  SAMPLE_EMPLOYEES 
} from '../data/initialData';

export const ExpenseModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingExpense = null 
}) => {
  const [category, setCategory] = useState('company');
  const [subcategory, setSubcategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [vendor, setVendor] = useState('');
  const [notes, setNotes] = useState('');

  // Attendance integration fields (for Company expenses)
  const [isAttendanceLinked, setIsAttendanceLinked] = useState(false);
  const [linkedEmployeeId, setLinkedEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseType, setExpenseType] = useState('general');
  const [syncStatus, setSyncStatus] = useState('unlinked');

  useEffect(() => {
    if (editingExpense) {
      setCategory(editingExpense.category || 'company');
      setSubcategory(editingExpense.subcategory || '');
      setAmount(editingExpense.amount || '');
      setDate(editingExpense.date || new Date().toISOString().split('T')[0]);
      setPaymentMethod(editingExpense.payment_method || PAYMENT_METHODS[0]);
      setVendor(editingExpense.vendor || '');
      setNotes(editingExpense.notes || '');

      const isLinked = Boolean(editingExpense.linked_employee_id || editingExpense.sync_status === 'linked_attendance');
      setIsAttendanceLinked(isLinked);
      setLinkedEmployeeId(editingExpense.linked_employee_id || '');
      setEmployeeName(editingExpense.employee_name || '');
      setAttendanceDate(editingExpense.attendance_date || editingExpense.date || '');
      setExpenseType(editingExpense.expense_type || 'general');
      setSyncStatus(editingExpense.sync_status || 'unlinked');
    } else {
      // Default reset
      setCategory('company');
      setSubcategory(COMPANY_SUBCATEGORIES[0]);
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod(PAYMENT_METHODS[0]);
      setVendor('');
      setNotes('');
      setIsAttendanceLinked(false);
      setLinkedEmployeeId('');
      setEmployeeName('');
      setAttendanceDate(new Date().toISOString().split('T')[0]);
      setExpenseType('general');
      setSyncStatus('unlinked');
    }
  }, [editingExpense, isOpen]);

  // Handle category switch
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (newCat === 'company') {
      setSubcategory(COMPANY_SUBCATEGORIES[0]);
    } else {
      setSubcategory(PERSONAL_SUBCATEGORIES[0]);
      setIsAttendanceLinked(false);
    }
  };

  const handleEmployeeSelect = (empId) => {
    setLinkedEmployeeId(empId);
    const emp = SAMPLE_EMPLOYEES.find(e => e.id === empId);
    setEmployeeName(emp ? emp.name : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const payload = {
      id: editingExpense?.id || `exp-${Date.now()}`,
      category,
      subcategory,
      amount: parseFloat(amount),
      date,
      payment_method: paymentMethod,
      vendor: vendor.trim(),
      notes: notes.trim(),
      // Attendance fields
      linked_employee_id: (category === 'company' && isAttendanceLinked) ? linkedEmployeeId : null,
      employee_name: (category === 'company' && isAttendanceLinked) ? employeeName : null,
      attendance_date: (category === 'company' && isAttendanceLinked) ? attendanceDate : null,
      expense_type: (category === 'company' && isAttendanceLinked) ? expenseType : 'general',
      sync_status: (category === 'company' && isAttendanceLinked) ? (syncStatus === 'unlinked' ? 'linked_attendance' : syncStatus) : 'unlinked',
      updated_at: new Date().toISOString()
    };

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  const currentSubcategories = category === 'company' ? COMPANY_SUBCATEGORIES : PERSONAL_SUBCATEGORIES;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingExpense ? 'Edit Expense Record' : 'Record New Expense'}</h2>
          <button className="btn btn-outline btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Category Toggle */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="category-toggle-grid">
              <button
                type="button"
                className={`category-toggle-btn company ${category === 'company' ? 'selected' : ''}`}
                onClick={() => handleCategoryChange('company')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#818cf8' }}>
                  <Building2 size={16} /> Company Expense
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  Factory, spares, employee allowances, bills
                </span>
              </button>

              <button
                type="button"
                className={`category-toggle-btn personal ${category === 'personal' ? 'selected' : ''}`}
                onClick={() => handleCategoryChange('personal')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#34d399' }}>
                  <User size={16} /> Personal Expense
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  Home, fuel, dining, family & savings
                </span>
              </button>
            </div>
          </div>

          {/* Amount & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Amount (₹ INR) *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-secondary)' }}>₹</span>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  placeholder="0.00"
                  className="form-input"
                  style={{ paddingLeft: 28, fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700 }}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Expense Date *</label>
              <input
                type="date"
                required
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Subcategory & Payment Method */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Subcategory</label>
              <select
                className="form-select"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              >
                {currentSubcategories.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Vendor / Payee */}
          <div className="form-group">
            <label className="form-label">Vendor / Payee / Store Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Coimbatore Steel Traders, Shell Fuel, Annapoorna..."
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
            />
          </div>

          {/* Notes / Description */}
          <div className="form-group">
            <label className="form-label">Purpose / Notes</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Provide context or invoice reference number..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* ATTENDANCE SYSTEM INTEGRATION HOOK (Only for Company expenses) */}
          {category === 'company' && (
            <div className="attendance-callout">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-attendance)', fontWeight: 700, fontSize: '0.86rem' }}>
                  <Users size={16} />
                  <span>Attendance System Linkage</span>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={isAttendanceLinked}
                    onChange={(e) => setIsAttendanceLinked(e.target.checked)}
                  />
                  <span>Link to Employee / Shift</span>
                </label>
              </div>

              {isAttendanceLinked ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.74rem' }}>Select Employee</label>
                    <select
                      className="form-select"
                      style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                      value={linkedEmployeeId}
                      onChange={(e) => handleEmployeeSelect(e.target.value)}
                    >
                      <option value="">-- Choose Employee --</option>
                      {SAMPLE_EMPLOYEES.map((emp) => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.74rem' }}>Expense Type</label>
                    <select
                      className="form-select"
                      style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                      value={expenseType}
                      onChange={(e) => setExpenseType(e.target.value)}
                    >
                      {ATTENDANCE_EXPENSE_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.74rem' }}>Attendance / Shift Date</label>
                    <input
                      type="date"
                      className="form-input"
                      style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.74rem' }}>Sync Status</label>
                    <select
                      className="form-select"
                      style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                      value={syncStatus}
                      onChange={(e) => setSyncStatus(e.target.value)}
                    >
                      <option value="linked_attendance">Linked to Attendance</option>
                      <option value="approved">Approved & Deducted/Reimbursed</option>
                      <option value="unlinked">Unlinked</option>
                    </select>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Enable this to associate this expense with a factory worker, technician site visit, or daily attendance allowance.
                </p>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>{editingExpense ? 'Save Changes' : 'Save Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
