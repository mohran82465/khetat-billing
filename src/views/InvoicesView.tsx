import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  QrCode,
  Copy,
  Printer,
  ChevronRight,
  X,
  CreditCard,
  Building,
} from 'lucide-react';
import { Invoice } from '../data/mockData';

interface InvoicesViewProps {
  invoices: Invoice[];
  isArabic: boolean;
  onOpenCreateInvoice: () => void;
  onRecordPayment: (invoice: Invoice) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  isArabic,
  onOpenCreateInvoice,
  onRecordPayment,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(invoices[0] || null);
  const [filterType, setFilterType] = useState<'All' | 'Tax Invoice' | 'Simplified' | 'Overdue'>('All');
  const [search, setSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const filteredInvoices = invoices.filter((inv) => {
    if (filterType === 'Tax Invoice' && inv.type !== 'Tax Invoice') return false;
    if (filterType === 'Simplified' && inv.type !== 'Simplified') return false;
    if (filterType === 'Overdue' && inv.settlementStatus !== 'Overdue') return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        inv.id.toLowerCase().includes(q) ||
        inv.buyerName.toLowerCase().includes(q) ||
        inv.buyerNameAr.includes(q) ||
        inv.buyerTrn.includes(q)
      );
    }
    return true;
  });

  const handleBatchSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncToast(true);
      setTimeout(() => setSyncToast(false), 3000);
    }, 1200);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Toast Notification */}
      {syncToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900 shadow-xl animate-in slide-in-from-top-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>
            {isArabic
              ? 'تم مزامنة جميع الفواتير بنجاح مع بوابة ZATCA Phase 2'
              : 'ZATCA Phase 2 batch clearance synchronization complete. All hashes verified.'}
          </span>
        </div>
      )}

      {/* Top Header */}
      <div className="p-4 lg:p-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-bold text-[#161c27]">
                {isArabic ? 'فواتير المبيعات الضريبية' : 'Tax Invoices & ZATCA Portal'}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                <ShieldCheck className="h-3 w-3" />
                Phase 2 Cleared
              </span>
            </div>
            <p className="text-xs text-[#70787d] mt-1">
              {isArabic
                ? 'إصدار الفواتير الضريبية القياسية والمبسطة المتوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك'
                : 'ZATCA Phase 2 Fatoora Portal • Real-time Clearance & Reporting API with Cryptographic Signatures.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchSync}
              disabled={isSyncing}
              className="flex items-center gap-2 rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff] transition-all cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-[#004a60]' : ''}`} />
              <span>{isArabic ? 'مزامنة ZATCA' : 'Batch Sync ZATCA'}</span>
            </button>
            <button
              onClick={onOpenCreateInvoice}
              className="flex items-center gap-2 rounded-lg bg-[#004a60] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#074e64] transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? '+ فاتورة جديدة' : '+ Create Invoice'}</span>
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'فواتير معتمدة اليوم' : 'Cleared Today (ZATCA)'}</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-[#161c27]">100% Cleared</div>
            <div className="mt-1 text-[11px] text-emerald-700">5 of 5 cleared instantly</div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'بانتظار الإرسال' : 'Pending Reporting'}</span>
              <Clock className="h-4 w-4 text-[#004a60]" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-[#161c27]">0 Invoices</div>
            <div className="mt-1 text-[11px] text-[#70787d]">24h B2C reporting SLA compliant</div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'إجمالي المبيعات المفوترة' : 'Invoiced Receivables YTD'}</span>
              <FileText className="h-4 w-4 text-[#004a60]" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-[#161c27]">SAR 2,840,900</div>
            <div className="mt-1 text-[11px] text-[#70787d]">VAT Collected: SAR 426,135</div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'شهادة التشفير CSID' : 'Cryptographic CSID'}</span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-emerald-700">Valid & Active</div>
            <div className="mt-1 text-[11px] text-[#70787d]">Expires: 14 Dec 2026</div>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-[#e3e8f9] py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {(['All', 'Tax Invoice', 'Simplified', 'Overdue'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors shrink-0 ${
                  filterType === tab
                    ? 'bg-[#004a60] text-white'
                    : 'bg-white text-[#40484d] border border-[#e3e8f9] hover:bg-[#f1f3ff]'
                }`}
              >
                {tab === 'All' && (isArabic ? 'الكل (5)' : 'All Invoices (5)')}
                {tab === 'Tax Invoice' && (isArabic ? 'ضريبية B2B' : 'Tax Invoices (B2B)')}
                {tab === 'Simplified' && (isArabic ? 'مبسطة B2C' : 'Simplified (B2C)')}
                {tab === 'Overdue' && (isArabic ? 'متأخرة السداد' : 'Overdue (1)')}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isArabic ? 'بحث برقم الفاتورة أو الرقم الضريبي...' : 'Search Invoice ID, TRN, Buyer...'}
              className="w-full rounded-lg border border-[#e3e8f9] bg-white py-1.5 pl-8 pr-3 text-xs text-[#161c27] placeholder-[#70787d] focus:border-[#004a60] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Invoices Table */}
        <div className="flex-1 overflow-auto p-4 lg:p-6 pt-2">
          <div className="overflow-hidden rounded-xl border border-[#e3e8f9] bg-white shadow-xs">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="border-b border-[#e3e8f9] bg-[#f9f9ff] text-[11px] font-semibold uppercase text-[#70787d]">
                <tr>
                  <th className="p-3">{isArabic ? 'رقم الفاتورة ونوعها' : 'Invoice & Type'}</th>
                  <th className="p-3">{isArabic ? 'الطرف المشتري / العميل' : 'Buyer / Entity'}</th>
                  <th className="p-3">{isArabic ? 'تاريخ الإصدار والاستحقاق' : 'Issue / Due Date'}</th>
                  <th className="p-3 text-right">{isArabic ? 'الإجمالي مع الضريبة' : 'Amount (SAR)'}</th>
                  <th className="p-3">{isArabic ? 'حالة ZATCA' : 'ZATCA Clearance'}</th>
                  <th className="p-3">{isArabic ? 'حالة السداد' : 'Settlement'}</th>
                  <th className="p-3">{isArabic ? 'الختم الرقمي' : 'Digital Hash'}</th>
                  <th className="p-3 text-center">{isArabic ? 'إجراء' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8f9]">
                {filteredInvoices.map((inv) => {
                  const isSelected = selectedInvoice?.id === inv.id;
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      className={`cursor-pointer transition-colors hover:bg-[#f1f3ff]/60 ${
                        isSelected ? 'bg-[#e8eeff]/70 font-medium' : ''
                      }`}
                    >
                      <td className="p-3">
                        <div className="font-bold font-mono text-[#004a60]">{inv.id}</div>
                        <div className="text-[10px] text-[#70787d]">
                          {inv.type} • {inv.codeType}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-[#161c27]">
                          {isArabic ? inv.buyerNameAr : inv.buyerName}
                        </div>
                        <div className="text-[10px] text-[#70787d] font-mono">
                          TRN: {inv.buyerTrn}
                        </div>
                      </td>
                      <td className="p-3 text-[11px]">
                        <div>{inv.issueDate}</div>
                        <div className="text-[10px] text-[#70787d]">Due: {inv.dueDate}</div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#161c27]">
                        SAR {inv.totalAmount.toLocaleString()}
                        <div className="text-[10px] font-normal text-[#70787d]">
                          VAT: {inv.vatAmount.toLocaleString()}
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            inv.zatcaStatus === 'Cleared'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inv.zatcaStatus === 'Reported'
                              ? 'bg-[#aae2fd] text-[#004a60]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <ShieldCheck className="h-3 w-3" />
                          {inv.zatcaStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            inv.settlementStatus === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inv.settlementStatus === 'Overdue'
                              ? 'bg-rose-100 text-rose-800'
                              : inv.settlementStatus === 'Partially Paid'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {inv.settlementStatus}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-[#70787d]">
                        {inv.zatcaHash.slice(0, 8)}...{inv.zatcaHash.slice(-6)}
                      </td>
                      <td className="p-3 text-center">
                        <ChevronRight className="h-4 w-4 text-[#70787d] mx-auto" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed ZATCA Tax Invoice Preview Drawer */}
        {selectedInvoice && (
          <aside className="w-104 border-l border-[#e3e8f9] bg-white flex flex-col h-full shadow-lg shrink-0 overflow-y-auto hidden xl:flex">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#e3e8f9] flex items-center justify-between bg-[#f9f9ff]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-[#004a60]">
                    {selectedInvoice.id}
                  </span>
                  <span className="rounded-sm bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
                    ZATCA PHASE 2 CLEARED
                  </span>
                </div>
                <div className="text-[11px] text-[#70787d] mt-0.5">
                  UUID: {selectedInvoice.zatcaUuid}
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-[#70787d] hover:text-[#161c27] p-1 rounded-md hover:bg-[#e3e8f9]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Fatoora Document Canvas */}
            <div className="p-4 space-y-4 text-xs">
              {/* Official Invoice Sheet Card */}
              <div className="rounded-xl border border-[#bfc8cd]/80 bg-white p-4 shadow-sm space-y-4">
                {/* Official Bilingual Header */}
                <div className="flex items-start justify-between border-b border-[#e3e8f9] pb-3">
                  <div>
                    <div className="text-xs font-bold text-[#004a60] uppercase tracking-wider">
                      فاتورة ضريبية
                    </div>
                    <div className="text-xs font-bold text-[#161c27] tracking-wider uppercase">
                      TAX INVOICE
                    </div>
                    <div className="text-[10px] text-[#70787d] mt-1">
                      ZATCA Standard Specification UBL 2.1
                    </div>
                  </div>

                  {/* ZATCA Phase 2 TLV QR Code Representation */}
                  <div className="flex flex-col items-center">
                    <div className="h-20 w-20 border border-[#161c27] p-1 rounded bg-white flex items-center justify-center">
                      {/* Stylized QR Code SVG */}
                      <svg viewBox="0 0 100 100" className="w-full h-full text-[#161c27]">
                        <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                        <rect x="5" y="5" width="20" height="20" fill="white" />
                        <rect x="10" y="10" width="10" height="10" fill="currentColor" />

                        <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                        <rect x="75" y="5" width="20" height="20" fill="white" />
                        <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                        <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                        <rect x="5" y="75" width="20" height="20" fill="white" />
                        <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                        {/* Random pattern mimicking TLV payload */}
                        <rect x="35" y="10" width="10" height="15" fill="currentColor" />
                        <rect x="50" y="5" width="15" height="10" fill="currentColor" />
                        <rect x="40" y="35" width="20" height="20" fill="currentColor" />
                        <rect x="65" y="40" width="10" height="20" fill="currentColor" />
                        <rect x="35" y="65" width="15" height="10" fill="currentColor" />
                        <rect x="55" y="70" width="20" height="10" fill="currentColor" />
                        <rect x="80" y="65" width="15" height="15" fill="currentColor" />
                      </svg>
                    </div>
                    <span className="text-[8px] font-mono text-[#70787d] mt-0.5">ZATCA TLV Base64</span>
                  </div>
                </div>

                {/* Seller & Buyer Grid */}
                <div className="grid grid-cols-2 gap-3 text-[11px] border-b border-[#e3e8f9] pb-3">
                  <div>
                    <div className="font-bold text-[#70787d] uppercase text-[9px]">
                      {isArabic ? 'المورد / البائع' : 'Seller (المورد)'}
                    </div>
                    <div className="font-semibold text-[#161c27]">Acme Corp Ltd (KSA)</div>
                    <div className="text-[10px] text-[#70787d]">King Fahd Rd, Riyadh</div>
                    <div className="font-mono text-[10px] text-[#004a60] font-semibold">
                      TRN: 310144928100003
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-[#70787d] uppercase text-[9px]">
                      {isArabic ? 'العميل / المشتري' : 'Buyer (المشتري)'}
                    </div>
                    <div className="font-semibold text-[#161c27]">
                      {isArabic ? selectedInvoice.buyerNameAr : selectedInvoice.buyerName}
                    </div>
                    <div className="text-[10px] text-[#70787d]">{selectedInvoice.buyerAddress}</div>
                    <div className="font-mono text-[10px] text-[#004a60] font-semibold">
                      TRN: {selectedInvoice.buyerTrn}
                    </div>
                  </div>
                </div>

                {/* Line Items Table */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#70787d] mb-2">
                    {isArabic ? 'بنود الفاتورة' : 'Invoice Line Items'}
                  </div>
                  <table className="w-full text-left text-[11px]">
                    <thead className="border-b border-[#e3e8f9] text-[9px] uppercase text-[#70787d]">
                      <tr>
                        <th className="pb-1">Description</th>
                        <th className="pb-1 text-center">Qty</th>
                        <th className="pb-1 text-right">Unit</th>
                        <th className="pb-1 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f3ff]">
                      {selectedInvoice.lineItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2">
                            <div className="font-semibold text-[#161c27]">{item.description}</div>
                            <div className="text-[9px] text-[#70787d]">{item.descriptionAr}</div>
                          </td>
                          <td className="py-2 text-center font-mono">{item.qty}</td>
                          <td className="py-2 text-right font-mono">{item.unitPrice.toLocaleString()}</td>
                          <td className="py-2 text-right font-mono font-bold">
                            {item.subtotal.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Calculations */}
                <div className="border-t border-[#e3e8f9] pt-3 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#70787d]">Total Taxable Amount:</span>
                    <span className="font-mono font-semibold">
                      SAR {selectedInvoice.taxableAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#70787d]">Value Added Tax (15% VAT):</span>
                    <span className="font-mono font-semibold text-emerald-700">
                      SAR {selectedInvoice.vatAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#e3e8f9] pt-2 font-mono font-bold text-sm text-[#004a60]">
                    <span>Total Amount Due:</span>
                    <span>SAR {selectedInvoice.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Cryptographic Hash Row */}
                <div className="rounded-lg bg-[#f1f3ff] p-2.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#70787d]">
                    <span>ZATCA SHA-256 HASH</span>
                    <button
                      onClick={() => handleCopyHash(selectedInvoice.zatcaHash)}
                      className="flex items-center gap-1 text-[#004a60] hover:underline"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{copiedHash ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="mt-1 font-mono text-[9px] break-all text-[#40484d]">
                    {selectedInvoice.zatcaHash}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onRecordPayment(selectedInvoice)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#004a60] py-2.5 font-semibold text-white hover:bg-[#074e64] transition-all cursor-pointer"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>{isArabic ? 'تسجيل سند قبض / دفعة' : 'Record Payment Receipt'}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => alert(`Printing official tax invoice ${selectedInvoice.id}`)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-[#e3e8f9] bg-white py-2 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff] cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5 text-[#70787d]" />
                    <span>Print PDF</span>
                  </button>
                  <button
                    onClick={() =>
                      alert(`Exported ZATCA UBL 2.1 XML package for ${selectedInvoice.id}`)
                    }
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-[#e3e8f9] bg-white py-2 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff] cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-[#70787d]" />
                    <span>XML (UBL 2.1)</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
