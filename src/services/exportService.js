import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

/**
 * Format standard date
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Export expenses to Excel (.xlsx) with multiple sheets
 */
export const exportToExcel = (expenses, periodName = 'Report') => {
  const wb = XLSX.utils.book_new();

  // 1. Prepare Summary Sheet
  const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const companyExpenses = expenses.filter((e) => e.category === 'company');
  const personalExpenses = expenses.filter((e) => e.category === 'personal');
  const totalCompany = companyExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalPersonal = personalExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const attendanceLinked = expenses.filter((e) => e.sync_status === 'linked_attendance' || e.linked_employee_id);

  const summaryData = [
    ['COVAI MACHINES - EXPENSE & ATTENDANCE SUMMARY'],
    ['Generated On', new Date().toLocaleString()],
    ['Report Period', periodName],
    [''],
    ['Category', 'Count', 'Total Amount (INR)', 'Percentage'],
    ['Company Expenses', companyExpenses.length, totalCompany, totalAmount ? `${((totalCompany / totalAmount) * 100).toFixed(1)}%` : '0%'],
    ['Personal Expenses', personalExpenses.length, totalPersonal, totalAmount ? `${((totalPersonal / totalAmount) * 100).toFixed(1)}%` : '0%'],
    ['Total Overall', expenses.length, totalAmount, '100%'],
    [''],
    ['Attendance Linked Items', attendanceLinked.length, attendanceLinked.reduce((s, e) => s + Number(e.amount), 0), '']
  ];
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  // Format mapping helper
  const mapRow = (e) => ({
    'Date': e.date,
    'Category': e.category.toUpperCase(),
    'Subcategory': e.subcategory,
    'Amount (₹)': Number(e.amount),
    'Payment Method': e.payment_method,
    'Vendor / Payee': e.vendor || '-',
    'Notes / Purpose': e.notes || '-',
    'Linked Employee': e.employee_name || '-',
    'Attendance Date': e.attendance_date || '-',
    'Expense Type': e.expense_type || 'general',
    'Sync Status': e.sync_status || 'unlinked'
  });

  // 2. All Expenses Sheet
  const allWs = XLSX.utils.json_to_sheet(expenses.map(mapRow));
  XLSX.utils.book_append_sheet(wb, allWs, 'All Expenses');

  // 3. Company Expenses Sheet
  if (companyExpenses.length > 0) {
    const compWs = XLSX.utils.json_to_sheet(companyExpenses.map(mapRow));
    XLSX.utils.book_append_sheet(wb, compWs, 'Company Expenses');
  }

  // 4. Personal Expenses Sheet
  if (personalExpenses.length > 0) {
    const persWs = XLSX.utils.json_to_sheet(personalExpenses.map(mapRow));
    XLSX.utils.book_append_sheet(wb, persWs, 'Personal Expenses');
  }

  // Save file
  const fileName = `Covai_Machines_Expenses_${periodName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

/**
 * Export expenses to CSV
 */
export const exportToCSV = (expenses, fileNamePrefix = 'Expenses') => {
  const headers = [
    'Date',
    'Category',
    'Subcategory',
    'Amount',
    'Payment Method',
    'Vendor',
    'Notes',
    'Linked Employee',
    'Attendance Date',
    'Sync Status'
  ];

  const rows = expenses.map((e) => [
    e.date,
    e.category,
    `"${(e.subcategory || '').replace(/"/g, '""')}"`,
    e.amount,
    `"${(e.payment_method || '').replace(/"/g, '""')}"`,
    `"${(e.vendor || '').replace(/"/g, '""')}"`,
    `"${(e.notes || '').replace(/"/g, '""')}"`,
    `"${(e.employee_name || '').replace(/"/g, '""')}"`,
    e.attendance_date || '',
    e.sync_status || 'unlinked'
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${fileNamePrefix}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export printable summary PDF report using jsPDF
 */
export const exportToPDF = (expenses, periodName = 'Report') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header banner
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('COVAI MACHINES', 14, 12);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Expense Report: ${periodName} | Generated: ${new Date().toLocaleDateString()}`, 14, 20);

  // Summary Metrics
  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const company = expenses.filter((e) => e.category === 'company').reduce((s, e) => s + Number(e.amount), 0);
  const personal = expenses.filter((e) => e.category === 'personal').reduce((s, e) => s + Number(e.amount), 0);
  const attCount = expenses.filter((e) => e.sync_status === 'linked_attendance' || e.linked_employee_id).length;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Financial Overview', 14, 38);

  // Overview box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 42, pageWidth - 28, 24, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL EXPENDITURE', 20, 50);
  doc.text('COMPANY EXPENSES', 75, 50);
  doc.text('PERSONAL EXPENSES', 130, 50);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Rs. ${total.toLocaleString('en-IN')}`, 20, 58);
  doc.setTextColor(79, 70, 229); // Indigo
  doc.text(`Rs. ${company.toLocaleString('en-IN')}`, 75, 58);
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text(`Rs. ${personal.toLocaleString('en-IN')}`, 130, 58);

  // Detailed Table
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(`Expense Itemization (${expenses.length} records)`, 14, 76);

  // Table header
  let y = 82;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 8, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('DATE', 16, y + 5.5);
  doc.text('CATEGORY', 40, y + 5.5);
  doc.text('SUBCATEGORY & VENDOR', 75, y + 5.5);
  doc.text('PAYMENT', 135, y + 5.5);
  doc.text('AMOUNT (INR)', 170, y + 5.5);

  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  sortedExpenses.forEach((item) => {
    if (y > 275) {
      doc.addPage();
      y = 20;
    }

    doc.text(item.date, 16, y);
    doc.setFont('helvetica', 'bold');
    if (item.category === 'company') {
      doc.setTextColor(79, 70, 229);
      doc.text('COMPANY', 40, y);
    } else {
      doc.setTextColor(16, 185, 129);
      doc.text('PERSONAL', 40, y);
    }
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);

    const desc = `${item.subcategory}${item.vendor ? ' • ' + item.vendor : ''}`;
    const truncatedDesc = desc.length > 34 ? desc.slice(0, 32) + '...' : desc;
    doc.text(truncatedDesc, 75, y);

    const payMethod = (item.payment_method || 'Cash').split(' ')[0];
    doc.text(payMethod, 135, y);

    doc.setFont('helvetica', 'bold');
    doc.text(`Rs. ${Number(item.amount).toLocaleString('en-IN')}`, 170, y);
    doc.setFont('helvetica', 'normal');

    // Small divider line
    doc.setDrawColor(241, 245, 249);
    doc.line(14, y + 2, pageWidth - 14, y + 2);

    y += 7;
  });

  // Footer notes on Attendance integration
  if (y > 265) {
    doc.addPage();
    y = 20;
  }
  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`* ${attCount} company expenses are linked or flagged for Covai Machines Attendance & Payroll sync.`, 14, y);

  doc.save(`Covai_Expense_Report_${periodName.replace(/\s+/g, '_')}.pdf`);
};
