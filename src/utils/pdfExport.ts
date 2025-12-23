import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { BillItem, StoreInfo } from '../types';

export function exportBillToPDF(
  bill: BillItem[],
  storeInfo: StoreInfo,
  customerMobile?: string,
  billNumber?: string
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header with store info
  doc.setFontSize(20);
  doc.setTextColor(30, 136, 229); // Blue
  doc.text(storeInfo.name, pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(storeInfo.address, pageWidth / 2, 28, { align: 'center' });
  doc.text(`Phone: ${storeInfo.phone}`, pageWidth / 2, 34, { align: 'center' });
  
  if (storeInfo.gstNumber) {
    doc.text(`GSTIN: ${storeInfo.gstNumber}`, pageWidth / 2, 40, { align: 'center' });
  }
  
  // Bill details
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const startY = storeInfo.gstNumber ? 50 : 44;
  doc.text(`Bill No: ${billNumber || 'N/A'}`, 14, startY);
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 14, startY, { align: 'right' });
  
  if (customerMobile) {
    doc.text(`Customer: ${customerMobile}`, 14, startY + 6);
  }
  
  // Table
  const tableData = bill.map(item => [
    item.name,
    item.quantity.toString(),
    `₹${item.price.toFixed(2)}`,
    `₹${(item.quantity * item.price).toFixed(2)}`
  ]);
  
  const subtotal = bill.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;
  
  autoTable(doc, {
    startY: startY + 12,
    head: [['Item', 'Qty', 'Price', 'Amount']],
    body: tableData,
    foot: [
      ['', '', 'Subtotal:', `₹${subtotal.toFixed(2)}`],
      ['', '', 'GST (18%):', `₹${gst.toFixed(2)}`],
      ['', '', 'Total:', `₹${total.toFixed(2)}`]
    ],
    theme: 'striped',
    headStyles: { fillColor: [30, 136, 229] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }
  });
  
  // Footer
  const finalY = (doc as any).lastAutoTable.finalY || startY + 100;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for your business!', pageWidth / 2, finalY + 15, { align: 'center' });
  doc.text('Powered by Retail Bandhu', pageWidth / 2, finalY + 21, { align: 'center' });
  
  // Save
  doc.save(`bill-${billNumber || Date.now()}.pdf`);
}

export function exportReportToPDF(
  reportType: string,
  data: any[],
  dateRange: string
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(18);
  doc.setTextColor(30, 136, 229);
  doc.text(`${reportType} Report`, pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Period: ${dateRange}`, pageWidth / 2, 28, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, 34, { align: 'center' });
  
  // Table based on report type
  let tableData: any[] = [];
  let headers: string[] = [];
  
  if (reportType === 'Sales') {
    headers = ['Date', 'Bills', 'Items Sold', 'Revenue'];
    tableData = data.map(d => [
      d.date,
      d.bills?.toString() || '0',
      d.itemsSold?.toString() || '0',
      `₹${(d.revenue || 0).toFixed(2)}`
    ]);
  } else if (reportType === 'Products') {
    headers = ['Product', 'Quantity Sold', 'Revenue', 'Stock'];
    tableData = data.map(d => [
      d.name,
      d.sold?.toString() || '0',
      `₹${(d.revenue || 0).toFixed(2)}`,
      d.stock?.toString() || '0'
    ]);
  } else if (reportType === 'Customers') {
    headers = ['Customer', 'Orders', 'Total Spent', 'Last Visit'];
    tableData = data.map(d => [
      d.name || d.phone,
      d.orders?.toString() || '0',
      `₹${(d.totalSpent || 0).toFixed(2)}`,
      d.lastVisit || 'N/A'
    ]);
  }
  
  autoTable(doc, {
    startY: 45,
    head: [headers],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [30, 136, 229] }
  });
  
  // Footer
  const finalY = (doc as any).lastAutoTable.finalY || 100;
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Retail Bandhu - Voice + AI Billing for Indian Retailers', pageWidth / 2, finalY + 15, { align: 'center' });
  
  // Save
  doc.save(`${reportType.toLowerCase()}-report-${Date.now()}.pdf`);
}

export function exportAnalyticsToPDF(
  title: string,
  summary: { label: string; value: string }[],
  chartData?: any[]
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(30, 136, 229);
  doc.text(title, pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, 28, { align: 'center' });
  
  // Summary metrics
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  let yPos = 45;
  
  summary.forEach(metric => {
    doc.text(`${metric.label}:`, 20, yPos);
    doc.setFont(undefined, 'bold');
    doc.text(metric.value, 100, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 8;
  });
  
  // Chart data table if provided
  if (chartData && chartData.length > 0) {
    const tableHeaders = Object.keys(chartData[0]);
    const tableData = chartData.map(row => tableHeaders.map(key => String(row[key])));
    
    autoTable(doc, {
      startY: yPos + 10,
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [30, 136, 229] }
    });
  }
  
  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  const finalY = (doc as any).lastAutoTable?.finalY || yPos + 20;
  doc.text('Retail Bandhu Analytics', pageWidth / 2, finalY + 15, { align: 'center' });
  
  // Save
  doc.save(`analytics-${Date.now()}.pdf`);
}
