import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Check, 
  Save, 
  Copy, 
  RefreshCw, 
  Trash2, 
  DollarSign, 
  Shield, 
  AlertCircle 
} from 'lucide-react';
import { SUPABASE_SQL_SCHEMA, saveSupabaseConfig } from '../services/supabaseClient';

export const SettingsModal = ({ 
  isOpen, 
  onClose, 
  cloudConfig, 
  onUpdateCloudConfig, 
  budgets, 
  onSaveBudgets, 
  onResetData 
}) => {
  const [supabaseUrl, setSupabaseUrl] = useState(cloudConfig.url || '');
  const [supabaseKey, setSupabaseKey] = useState(cloudConfig.key || '');
  const [companyBudget, setCompanyBudget] = useState(budgets?.company_monthly || 200000);
  const [personalBudget, setPersonalBudget] = useState(budgets?.personal_monthly || 45000);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveCloud = (e) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl, supabaseKey);
    onUpdateCloudConfig();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDisconnect = () => {
    saveSupabaseConfig('', '');
    setSupabaseUrl('');
    setSupabaseKey('');
    onUpdateCloudConfig();
  };

  const handleSaveBudgets = (e) => {
    e.preventDefault();
    onSaveBudgets({
      company_monthly: Number(companyBudget),
      personal_monthly: Number(personalBudget)
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 660 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 8, borderRadius: 8, background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <Database size={20} />
            </div>
            <div>
              <h2>Settings & Cloud Configuration</h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Supabase database sync, category budgets & data management
              </div>
            </div>
          </div>
          <button className="btn btn-outline btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* 1. Supabase Cloud Sync Section */}
        <div style={{ marginBottom: 24, padding: 18, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Database size={16} style={{ color: 'var(--accent-company)' }} />
              <span>Supabase Cloud Database</span>
            </h3>
            <span className={`status-dot ${cloudConfig.isConfigured ? 'connected' : 'local'}`} title={cloudConfig.isConfigured ? 'Connected' : 'Local mode'} />
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            Connect your own free Supabase PostgreSQL cloud database to sync expenses across all your devices and team. If empty, the app runs securely in your browser's persistent local storage.
          </p>

          <form onSubmit={handleSaveCloud}>
            <div className="form-group">
              <label className="form-label">Supabase Project URL</label>
              <input
                type="url"
                placeholder="https://xyzcompany.supabase.co"
                className="form-input"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Supabase Anon Public API Key</label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="form-input"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                onClick={handleCopySchema}
              >
                <Copy size={13} />
                <span>{copiedSchema ? 'Copied SQL Schema!' : 'Copy Supabase SQL Schema'}</span>
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                {cloudConfig.isConfigured && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ fontSize: '0.78rem', color: '#ef4444' }}
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </button>
                )}
                <button type="submit" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                  <Save size={14} />
                  <span>Save Supabase Config</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 2. Monthly Budget Thresholds */}
        <div style={{ marginBottom: 24, padding: 18, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <DollarSign size={16} style={{ color: 'var(--accent-personal)' }} />
            <span>Monthly Category Budget Limits</span>
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            Set monthly spending targets. When spending crosses 75% or 95% of these limits, color-coded warning banners and progress meters will alert you.
          </p>

          <form onSubmit={handleSaveBudgets}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Company Monthly Budget (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  className="form-input"
                  value={companyBudget}
                  onChange={(e) => setCompanyBudget(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Personal Monthly Budget (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  className="form-input"
                  value={personalBudget}
                  onChange={(e) => setPersonalBudget(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="submit" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                <Save size={14} />
                <span>Save Budget Limits</span>
              </button>
            </div>
          </form>
        </div>

        {/* 3. Reset / Data Management */}
        <div style={{ padding: 16, background: 'rgba(239, 68, 68, 0.04)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                Clear All Expense Records
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Permanently clears all local expense records from your system.
              </div>
            </div>

            <button
              className="btn btn-outline"
              style={{ fontSize: '0.78rem', color: 'var(--accent-danger, #ef4444)', borderColor: 'rgba(239, 68, 68, 0.4)' }}
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all expense records? This cannot be undone.')) {
                  onResetData();
                  onClose();
                }
              }}
            >
              <Trash2 size={13} />
              <span>Clear All Expenses</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, color: '#34d399', fontSize: '0.82rem', fontWeight: 600 }}>
            <Check size={16} />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn btn-outline" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
