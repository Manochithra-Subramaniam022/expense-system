import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Settings, 
  Users, 
  Database, 
  Sun, 
  Moon, 
  TrendingUp, 
  DownloadCloud 
} from 'lucide-react';

export const Header = ({ 
  cloudConfig, 
  onOpenAddModal, 
  onOpenSettings, 
  onOpenAttendance, 
  theme, 
  onToggleTheme 
}) => {
  return (
    <header className="app-header simple-header">
      {/* Brand */}
      <div className="brand-section">
        <div className="brand-logo-badge">
          <TrendingUp size={22} strokeWidth={2.4} />
        </div>
        <div className="brand-titles">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h1>COVAI MACHINES</h1>
            <button 
              className="simple-cloud-link" 
              onClick={onOpenSettings}
              title={cloudConfig.isConfigured ? 'Supabase Cloud Connected' : 'Local Storage Mode. Click to configure cloud'}
            >
              <span className={`status-dot ${cloudConfig.isConfigured ? 'connected' : 'local'}`}></span>
              <span>{cloudConfig.isConfigured ? 'Cloud' : 'Local'}</span>
            </button>
          </div>
          <div className="brand-subtitle">
            <span className="brand-tagline">Hey Vasanth, innaiku enna dhanda selavu pannuna?</span>
          </div>
        </div>
      </div>

      {/* Clean Right Actions */}
      <div className="header-actions">
        {/* Attendance Portal Button (Subtle Pill) */}
        <button 
          className="btn-pill-compact"
          onClick={onOpenAttendance}
          title="Attendance Integration"
        >
          <Users size={14} />
          <span>Attendance</span>
        </button>

        {/* Theme Toggle Button */}
        <button 
          className="btn-icon-simple"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Settings Button */}
        <button 
          className="btn-icon-simple"
          onClick={onOpenSettings}
          title="Settings, Budgets & Supabase"
          aria-label="Settings"
        >
          <Settings size={17} />
        </button>

        {/* Desktop Add Expense Button */}
        <button 
          className="btn btn-primary hide-on-mobile"
          onClick={onOpenAddModal}
        >
          <PlusCircle size={17} />
          <span>Add Expense</span>
        </button>
      </div>
    </header>
  );
};
