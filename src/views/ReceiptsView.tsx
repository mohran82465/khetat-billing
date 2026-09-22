import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Plus,
  RefreshCw,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  CreditCard,
  Building,
  ShieldCheck,
  X,
  ChevronRight,
  Stamp,
  AlertCircle,
} from 'lucide-react';
import { ReceiptVoucher } from '../data/mockData';

interface ReceiptsViewProps {
  receipts: ReceiptVoucher[];
  isArabic: boolean;
  onOpenCreateReceipt: () => void;
  onNavigateToInvoice: (invId: string) => void;
}

export const ReceiptsView: React.FC<ReceiptsViewProps> = ({
  receipts,
  isArabic,
  onOpenCreateReceipt,
  onNavigateToInvoice,
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptVoucher | null>(receipts[0] || null);
  const [methodFilter, setMethodFilter] = useState<'All' | 'mada' | 'sarie' | 'sadad' | 'card' | 'cheque'>('All');
  const [search, setSearch] = useState('');
  const [isBankSyncing, setIsBankSyncing] = useState(false);
  const [bankSyncDone, setBankSyncDone] = useState(false);

  const filteredReceipts = receipts.filter((r) => {
    if (methodFilter !== 'All' && r.methodCategory !== methodFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.customer.toLowerCase().includes(q) ||
        r.customerAr.includes(q) ||
        r.referenceNumber.toLowerCase().includes(q) ||
        r.allocatedInvoice.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleBankSync = () => {
    setIsBankSyncing(true);
    setTimeout(() => {
      setIsBankSyncing(false);
      setBankSyncDone(true);
      setTimeout(() => setBankSyncDone(false), 3000);
    }, 1400);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Toast Notification */}
      {bankSyncDone && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900 shadow-xl animate-in slide-in-from-top-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>
            {isArabic
              ? 'تمت مطابقة الحسابات البنكية (Al Rajhi & SNB) وسندات القبض بنجاح'
              : 'Treasury bank feed sync complete. 4 transactions automatically reconciled.'}
          </span>
        </div>
      )}

      {/* Top Banner */}
      <div className="p-4 lg:p-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#161c27]">
              {isArabic ? 'سندات القبض وإيصالات الدفع' : 'Receipts & Official Payment Vouchers'}
            </h1>
            <p className="text-xs text-[#70787d] mt-1">
              {isArabic
                ? 'إصدار سندات القبض المعتمدة مالياً، مطابقة الحوالات البنكية ومدى وسداد مع الفواتير الضريبية'
                : 'Treasury vouchers, automated bank feeds (SARIE / Mada / SADAD), and certified invoice settlements.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBankSync}
              disabled={isBankSyncing}
              className="flex items-center gap-2 rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff] transition-all cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isBankSyncing ? 'animate-spin text-[#004a60]' : ''}`} />
              <span>{isArabic ? 'تحديث البنوك' : 'Sync Bank Feeds'}</span>
            </button>
            <button
              onClick={onOpenCreateReceipt}
              className="flex items-center gap-2 rounded-lg bg-[#004a60] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#074e64] transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? '+ سند قبض جديد' : '+ Record Voucher'}</span>
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'تحصيلات اليوم' : "Today's Collections"}</span>
              <Receipt className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-[#161c27]">SAR 605,500</div>
            <div className="mt-1 text-[11px] text-emerald-700 font-semibold">2 Vouchers settled</div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'نسبة مطابقة البنوك' : 'Bank Reconciliation'}</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-emerald-700">98.2%</div>
            <div className="mt-1 text-[11px] text-[#70787d]">Automated Sarie matching</div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'دفعات بانتظار التخصيص' : 'Pending Allocation'}</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-amber-600">SAR 45,000</div>
            <div className="mt-1 text-[11px] text-amber-700">1 SADAD Bill #902188</div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'قنوات الدفع النشطة' : 'Treasury Channels'}</span>
              <CreditCard className="h-4 w-4 text-[#004a60]" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-[#161c27]">Mada / SARIE / SADAD</div>
            <div className="mt-1 text-[11px] text-[#70787d]">SNB & Al Rajhi Corporate</div>
          </div>
        </div>

        {/* Filter Tabs and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-[#e3e8f9] py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {(['All', 'mada', 'sarie', 'sadad', 'card', 'cheque'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setMethodFilter(method)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors shrink-0 ${
                  methodFilter === method
                    ? 'bg-[#004a60] text-white'
                    : 'bg-white text-[#40484d] border border-[#e3e8f9] hover:bg-[#f1f3ff]'
                }`}
              >
                {method === 'All' && (isArabic ? 'الكل (5)' : 'All Vouchers (5)')}
                {method === 'mada' && 'Mada / POS'}
                {method === 'sarie' && 'SARIE Wire'}
                {method === 'sadad' && 'SADAD'}
                {method === 'card' && 'Credit Cards'}
                {method === 'cheque' && 'Bank Cheque'}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isArabic ? 'بحث برقم السند أو العميل...' : 'Search Voucher ID, Ref, Client...'}
              className="w-full rounded-lg border border-[#e3e8f9] bg-white py-1.5 pl-8 pr-3 text-xs text-[#161c27] placeholder-[#70787d] focus:border-[#004a60] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area: Table + Document Sheet */}
      <div className="flex-1 flex overflow-hidden">
        {/* Table View */}
        <div className="flex-1 overflow-auto p-4 lg:p-6 pt-2">
          <div className="overflow-hidden rounded-xl border border-[#e3e8f9] bg-white shadow-xs">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="border-b border-[#e3e8f9] bg-[#f9f9ff] text-[11px] font-semibold uppercase text-[#70787d]">
                <tr>
                  <th className="p-3">{isArabic ? 'رقم السند والتاريخ' : 'Voucher ID & Time'}</th>
                  <th className="p-3">{isArabic ? 'الجهة المستلم منها' : 'Received From'}</th>
                  <th className="p-3">{isArabic ? 'طريقة الدفع والمرجع' : 'Payment Method & Ref'}</th>
                  <th className="p-3 text-right">{isArabic ? 'المبلغ المحصل' : 'Amount (SAR)'}</th>
                  <th className="p-3">{isArabic ? 'الفاتورة المخصصة' : 'Allocated Invoice'}</th>
                  <th className="p-3">{isArabic ? 'حالة المطابقة' : 'Status'}</th>
                  <th className="p-3 text-center">{isArabic ? 'عرض' : 'View'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8f9]">
                {filteredReceipts.map((r) => {
                  const isSelected = selectedReceipt?.id === r.id;
                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedReceipt(r)}
                      className={`cursor-pointer transition-colors hover:bg-[#f1f3ff]/60 ${
                        isSelected ? 'bg-[#e8eeff]/70 font-medium' : ''
                      }`}
                    >
                      <td className="p-3">
                        <div className="font-bold font-mono text-[#004a60]">{r.id}</div>
                        <div className="text-[10px] text-[#70787d]">
                          {r.date} • {r.time}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-[#161c27]">
                          {isArabic ? r.customerAr : r.customer}
                        </div>
                        <div className="text-[10px] text-[#70787d] font-mono">
                          TRN: {r.vatNumber}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-[#161c27]">{r.method}</div>
                        <div className="text-[10px] text-[#70787d] font-mono">
                          {r.referenceNumber}
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">
                        SAR {r.amount.toLocaleString()}
                      </td>
                      <td className="p-3">
                        {r.allocatedInvoice.startsWith('INV') ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToInvoice(r.allocatedInvoice);
                            }}
                            className="font-mono font-semibold text-[#004a60] hover:underline"
                          >
                            {r.allocatedInvoice}
                          </button>
                        ) : (
                          <span className="text-[10px] text-amber-700 font-semibold">
                            {r.allocatedInvoice}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            r.status === 'Reconciled'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.status === 'Cleared'
                              ? 'bg-[#aae2fd] text-[#004a60]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {r.status}
                        </span>
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

        {/* Detailed Official Receipt Voucher Document Sheet */}
        {selectedReceipt && (
          <aside className="w-104 border-l border-[#e3e8f9] bg-white flex flex-col h-full shadow-lg shrink-0 overflow-y-auto hidden xl:flex">
            {/* Sheet Header */}
            <div className="p-4 border-b border-[#e3e8f9] flex items-center justify-between bg-[#f9f9ff]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-[#004a60]">
                    {selectedReceipt.id}
                  </span>
                  <span className="rounded-sm bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
                    TREASURY RECONCILED
                  </span>
                </div>
                <div className="text-[11px] text-[#70787d] mt-0.5">
                  {selectedReceipt.date} • {selectedReceipt.time} AST
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-[#70787d] hover:text-[#161c27] p-1 rounded-md hover:bg-[#e3e8f9]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Official Printable Voucher Document */}
            <div className="p-4 space-y-4 text-xs">
              <div className="rounded-xl border-2 border-[#bfc8cd] bg-white p-5 shadow-sm space-y-4 relative">
                {/* Official Voucher Bilingual Header */}
                <div className="flex items-start justify-between border-b border-[#e3e8f9] pb-3">
                  <div>
                    <div className="text-sm font-bold text-[#004a60]">
                      شركة أكمي كورب المحدودة (المملكة العربية السعودية)
                    </div>
                    <div className="text-xs font-semibold text-[#161c27]">
                      ACME CORP LTD - KINGDOM OF SAUDI ARABIA
                    </div>
                    <div className="text-[10px] text-[#70787d] mt-0.5">
                      CR: 1010144928 • TRN: 310144928100003
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#004a60] uppercase tracking-wider">
                      سند قبض رسمي
                    </div>
                    <div className="text-xs font-bold text-[#161c27] tracking-wider uppercase">
                      RECEIPT VOUCHER
                    </div>
                    <div className="font-mono text-xs font-bold text-[#004a60] mt-0.5">
                      {selectedReceipt.id}
                    </div>
                  </div>
                </div>

                {/* Amount Highlight Box */}
                <div className="rounded-lg bg-[#f1f3ff] border border-[#aae2fd] p-3 text-center">
                  <div className="text-[10px] font-bold uppercase text-[#004a60]">
                    المبلغ المحصل / AMOUNT RECEIVED
                  </div>
                  <div className="text-xl font-bold font-mono text-[#004a60] mt-0.5">
                    SAR {selectedReceipt.amount.toLocaleString()}
                  </div>
                </div>

                {/* Payment Breakdown Fields */}
                <div className="space-y-2.5 text-[11px]">
                  <div className="flex justify-between border-b border-[#f1f3ff] pb-1.5">
                    <span className="text-[#70787d]">استلمنا من / Received From:</span>
                    <span className="font-bold text-[#161c27] text-right">
                      {selectedReceipt.customer}
                      <br />
                      <span className="text-[10px] font-normal text-[#70787d]">
                        {selectedReceipt.customerAr}
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#f1f3ff] pb-1.5">
                    <span className="text-[#70787d]">الرقم الضريبي / Client TRN:</span>
                    <span className="font-mono font-semibold text-[#161c27]">
                      {selectedReceipt.vatNumber}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#f1f3ff] pb-1.5">
                    <span className="text-[#70787d]">طريقة الدفع / Payment Mode:</span>
                    <span className="font-semibold text-[#161c27]">{selectedReceipt.method}</span>
                  </div>

                  <div className="flex justify-between border-b border-[#f1f3ff] pb-1.5">
                    <span className="text-[#70787d]">رقم العملية / Ref TXN:</span>
                    <span className="font-mono font-semibold text-[#004a60]">
                      {selectedReceipt.referenceNumber}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#f1f3ff] pb-1.5">
                    <span className="text-[#70787d]">تخصيص الفاتورة / Allocated To:</span>
                    <span className="font-mono font-bold text-[#004a60]">
                      {selectedReceipt.allocatedInvoice}
                    </span>
                  </div>
                </div>

                {/* Amount in Words */}
                <div className="rounded-lg bg-[#f9f9ff] p-2.5 border border-[#e3e8f9] space-y-1">
                  <div className="text-[10px] text-[#70787d]">مبلغ بالحروف / In Words (Arabic):</div>
                  <div className="font-semibold text-xs text-[#161c27]">{selectedReceipt.wordsAr}</div>
                  <div className="text-[10px] text-[#70787d] pt-1">In Words (English):</div>
                  <div className="font-semibold text-xs text-[#161c27] italic">{selectedReceipt.wordsEn}</div>
                </div>

                {/* Signatures & Seal Box */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="text-center text-[10px]">
                    <div className="font-semibold text-[#161c27]">أمين الصندوق / Cashier</div>
                    <div className="mt-4 border-b border-[#70787d] w-24 mx-auto" />
                    <div className="text-[8px] text-[#70787d] mt-1">Nafath OTP Signed</div>
                  </div>

                  {/* Circular Official Finance Stamp */}
                  <div className="h-18 w-18 rounded-full border-2 border-dashed border-[#004a60] flex flex-col items-center justify-center p-1 text-center rotate-[-10deg] bg-emerald-50/50">
                    <Stamp className="h-4 w-4 text-[#004a60]" />
                    <span className="text-[7px] font-bold text-[#004a60] uppercase leading-tight">
                      ACME TREASURY
                      <br />
                      RECONCILED
                    </span>
                  </div>

                  <div className="text-center text-[10px]">
                    <div className="font-semibold text-[#161c27]">المحاسب المالي / Accountant</div>
                    <div className="mt-4 border-b border-[#70787d] w-24 mx-auto" />
                    <div className="text-[8px] text-[#70787d] mt-1">Audit Approved</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => alert(`Printing official payment receipt voucher ${selectedReceipt.id}`)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#004a60] py-2.5 font-semibold text-white hover:bg-[#074e64] transition-all cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>{isArabic ? 'طباعة سند القبض الرسمي' : 'Print Official Receipt Voucher'}</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => alert(`Exporting receipt PDF: ${selectedReceipt.id}.pdf`)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-[#e3e8f9] bg-white py-2 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff] cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-[#70787d]" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      if (selectedReceipt.allocatedInvoice.startsWith('INV')) {
                        onNavigateToInvoice(selectedReceipt.allocatedInvoice);
                      } else {
                        alert('No specific invoice allocated yet.');
                      }
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-[#e3e8f9] bg-white py-2 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff] cursor-pointer"
                  >
                    <span>View Invoice</span>
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
