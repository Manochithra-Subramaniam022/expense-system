import React, { useState } from 'react';
import { 
  X, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Code, 
  Copy, 
  Building2, 
  ShieldCheck, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { SAMPLE_EMPLOYEES } from '../data/initialData';
import { formatCurrency } from '../services/exportService';

export const AttendancePortalModal = ({ 
  isOpen, 
  onClose, 
  onSimulateSync 
}) => {
  const [copied, setCopied] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(false);

  if (!isOpen) return null;

  const sampleWebhookPayload = `{
  "event": "attendance.field_visit_completed",
  "employee_id": "EMP-002",
  "employee_name": "Senthil Kumar (Field Service Tech)",
  "attendance_date": "${new Date().toISOString().split('T')[0]}",
  "shift": "Morning Shift A",
  "expense_details": {
    "category": "company",
    "subcategory": "Field Travel & Conveyance",
    "amount": 950.00,
    "payment_method": "UPI / GPay / PhonePe",
    "expense_type": "site_allowance",
    "vendor": "Diesel & Toll Pass (Tiruppur Mill Visit)",
    "notes": "Emergency repair on textile spinning machine #4. Verified by GPS punch.",
    "sync_status": "linked_attendance"
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleWebhookPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulate = () => {
    onSimulateSync();
    setSyncFeedback(true);
    setTimeout(() => setSyncFeedback(false), 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 8, borderRadius: 8, background: 'var(--accent-attendance-light)', color: 'var(--accent-attendance)' }}>
              <Users size={20} />
            </div>
            <div>
              <h2>Attendance System Integration Portal</h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Covai Machines • Future-ready automated company expense synchronization
              </div>
            </div>
          </div>
          <button className="btn btn-outline btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Integration Architecture Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
          <div style={{ padding: 14, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--accent-attendance)', fontWeight: 700, fontSize: '0.84rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={14} /> 1. Field Allowances
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              When a service technician checks in at an off-site machine client, conveyance allowances sync automatically.
            </p>
          </div>

          <div style={{ padding: 14, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: '#818cf8', fontWeight: 700, fontSize: '0.84rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building2 size={14} /> 2. Shift Tea & Food
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Calculates daily factory refreshment bills dynamically based on total biometric present headcount.
            </p>
          </div>

          <div style={{ padding: 14, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.84rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={14} /> 3. Payroll Deduction
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Any owner salary advances or personal loans tagged here automatically link to end-of-month salary slips.
            </p>
          </div>
        </div>

        {/* Live Simulation Action */}
        <div 
          style={{ 
            padding: 16, 
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid rgba(6, 182, 212, 0.3)',
            marginBottom: 20
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={16} style={{ color: 'var(--accent-attendance)' }} />
                <span>Test Live Attendance Sync Event</span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Triggers a simulated dispatch event from the attendance machine: Technician site allowance of ₹950.
              </div>
            </div>

            <button 
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)', boxShadow: '0 4px 12px rgba(6, 182, 212, 0.35)' }}
              onClick={handleSimulate}
            >
              <Zap size={15} />
              <span>Simulate Attendance Sync</span>
            </button>
          </div>

          {syncFeedback && (
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, color: '#22d3ee', fontSize: '0.8rem', fontWeight: 600 }}>
              <CheckCircle2 size={15} />
              <span>Simulated expense successfully dispatched and recorded into your company expenses!</span>
            </div>
          )}
        </div>

        {/* Integration API & Webhook Payload Schema */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Code size={14} /> Webhook / API Schema (For Attendance System Developer)
            </span>
            <button 
              className="btn btn-outline" 
              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
              onClick={handleCopy}
            >
              <Copy size={12} />
              <span>{copied ? 'Copied!' : 'Copy Schema'}</span>
            </button>
          </div>

          <pre 
            style={{ 
              background: 'var(--bg-input)', 
              padding: 14, 
              borderRadius: 'var(--radius-sm)', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.75rem', 
              color: '#38bdf8', 
              overflowX: 'auto',
              border: '1px solid var(--border-subtle)',
              lineHeight: 1.4
            }}
          >
            {sampleWebhookPayload}
          </pre>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
