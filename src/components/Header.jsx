import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Settings, 
  Users, 
  Database, 
  Sun, 
  Moon, 
  TrendingUp, 
  DownloadCloud,
  CheckCircle2 
} from 'lucide-react';

export const Header = ({ 
  cloudConfig, 
  onOpenAddModal, 
  onOpenSettings, 
  onOpenAttendance, 
  theme, 
  onToggleTheme 
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('To install on iOS: Tap the Share button in Safari, then select "Add to Home Screen". On Android/Chrome, tap the three dots menu > "Install app".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-logo-badge">
          <TrendingUp size={26} strokeWidth={2.4} />
        </div>
        <div className="brand-titles">
          <h1>COVAI MACHINES</h1>
          <div className="brand-subtitle">
            <span>Owner Expense Tracker</span>
            <span>•</span>
            <span className="attendance-badge-pill">
              <Users size={12} /> Attendance Ready
            </span>
          </div>
        </div>
      </div>

      <div className="header-actions">
        {/* Cloud Connection status chip */}
        <button 
          className="cloud-status-chip"
          onClick={onOpenSettings}
          title={cloudConfig.isConfigured ? 'Connected to Supabase Cloud DB' : 'Using Browser Local Storage. Click to configure Supabase Cloud'}
        >
          <span className={`status-dot ${cloudConfig.isConfigured ? 'connected' : 'local'}`}></span>
          <span>{cloudConfig.isConfigured ? 'Supabase Cloud Sync' : 'Local Storage Mode'}</span>
          <Database size={13} style={{ marginLeft: 4, opacity: 0.7 }} />
        </button>

        {/* Attendance Portal Hook Button */}
        <button 
          className="btn btn-outline"
          onClick={onOpenAttendance}
          style={{ borderColor: 'rgba(6, 182, 212, 0.4)', color: 'var(--accent-attendance)' }}
        >
          <Users size={16} />
          <span>Attendance Integration</span>
        </button>

        {/* Install PWA Button */}
        <button 
          className="btn btn-outline"
          onClick={handleInstallClick}
          title="Install as Progressive Mobile App on your device"
          style={{ borderColor: 'rgba(99, 102, 241, 0.4)', color: '#818cf8' }}
        >
          <DownloadCloud size={16} />
          <span className="hide-on-mobile-xs">Install App</span>
        </button>

        {/* Theme Toggle Button */}
        <button 
          className="btn btn-outline btn-icon-only"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Settings Button */}
        <button 
          className="btn btn-outline btn-icon-only"
          onClick={onOpenSettings}
          title="Settings & Budgets"
        >
          <Settings size={17} />
        </button>

        {/* Add Expense Primary Button (Desktop view; also accessible via mobile bottom nav) */}
        <button 
          className="btn btn-primary hide-on-mobile"
          onClick={onOpenAddModal}
        >
          <PlusCircle size={18} />
          <span>Add Expense</span>
        </button>
      </div>
    </header>
  );
};
