import React from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  FileSpreadsheet, 
  FileText, 
  Download, 
  Users, 
  Building2, 
  User 
} from 'lucide-react';

export const ExpenseFilters = ({
  searchTerm,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  customStartDate,
  customEndDate,
  onCustomDatesChange,
  categoryFilter,
  onCategoryFilterChange,
  attendanceOnly,
  onAttendanceOnlyChange,
  onExportExcel,
  onExportCSV,
  onExportPDF,
  filteredCount
}) => {
  return (
    <div className="glass-panel filter-bar">
      <div className="filter-group">
        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="filter-input"
            style={{ paddingLeft: 32, width: '100%' }}
            placeholder="Search vendor, items, notes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Date Filter Preset */}
        <select
          className="filter-select"
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="this_week">This Week (Mon - Sun)</option>
          <option value="this_month">This Month</option>
          <option value="custom">Custom Date Range</option>
        </select>

        {/* Custom Date Pickers */}
        {dateFilter === 'custom' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="date"
              className="filter-input"
              style={{ padding: '6px 10px' }}
              value={customStartDate}
              onChange={(e) => onCustomDatesChange(e.target.value, customEndDate)}
            />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>to</span>
            <input
              type="date"
              className="filter-input"
              style={{ padding: '6px 10px' }}
              value={customEndDate}
              onChange={(e) => onCustomDatesChange(customStartDate, e.target.value)}
            />
          </div>
        )}

        {/* Category Filter */}
        <select
          className="filter-select"
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="company">🏢 Company Only</option>
          <option value="personal">👤 Personal Only</option>
        </select>

        {/* Attendance Only Toggle */}
        <label 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 6, 
            cursor: 'pointer', 
            fontSize: '0.82rem', 
            color: attendanceOnly ? 'var(--accent-attendance)' : 'var(--text-secondary)',
            fontWeight: attendanceOnly ? 600 : 500,
            padding: '6px 10px',
            background: attendanceOnly ? 'var(--accent-attendance-light)' : 'transparent',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid',
            borderColor: attendanceOnly ? 'rgba(6, 182, 212, 0.4)' : 'transparent'
          }}
        >
          <input
            type="checkbox"
            checked={attendanceOnly}
            onChange={(e) => onAttendanceOnlyChange(e.target.checked)}
          />
          <Users size={14} />
          <span>Attendance Linked</span>
        </label>
      </div>

      {/* Export Actions */}
      <div className="filter-group">
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: 4 }}>
          {filteredCount} {filteredCount === 1 ? 'record' : 'records'}
        </span>

        {/* Export Excel */}
        <button
          className="btn btn-outline"
          onClick={onExportExcel}
          title="Export to Microsoft Excel spreadsheet (.xlsx)"
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <FileSpreadsheet size={15} style={{ color: '#10b981' }} />
          <span>Excel</span>
        </button>

        {/* Export CSV */}
        <button
          className="btn btn-outline"
          onClick={onExportCSV}
          title="Export to CSV (.csv)"
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <Download size={15} style={{ color: '#3b82f6' }} />
          <span>CSV</span>
        </button>

        {/* Export PDF */}
        <button
          className="btn btn-outline"
          onClick={onExportPDF}
          title="Generate clean printable PDF report"
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <FileText size={15} style={{ color: '#ef4444' }} />
          <span>PDF Report</span>
        </button>
      </div>
    </div>
  );
};
