import React, { useState } from 'react';
import {
  FileCheck2,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Download,
  Send,
  ArrowRight,
  ShieldCheck,
  Building2,
  X,
  ChevronRight,
  FileSignature,
} from 'lucide-react';
import { Quotation } from '../data/mockData';

interface QuotationsViewProps {
  quotations: Quotation[];
  isArabic: boolean;
  onOpenCreateQuotation: () => void;
  onConvertToSalesOrder: (quote: Quotation) => void;
}

export const QuotationsView: React.FC<QuotationsViewProps> = ({
  quotations,
  isArabic,
  onOpenCreateQuotation,
  onConvertToSalesOrder,
}) => {
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(quotations[0] || null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Sent' | 'Accepted' | 'Draft' | 'Expired'>('All');
  const [search, setSearch] = useState('');

  const filteredQuotes = quotations.filter((q) => {
    if (statusFilter !== 'All' && q.status !== statusFilter) return false;
    if (search) {
      const query = search.toLowerCase();
      return (
        q.id.toLowerCase().includes(query) ||
        q.customer.toLowerCase().includes(query) ||
        q.crNumber.includes(query)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Banner */}
      <div className="p-4 lg:p-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#161c27]">
              {isArabic ? 'عروض الأسعار والاتفاقيات' : 'Quotations & Commercial Pipeline'}
            </h1>
            <p className="text-xs text-[#70787d] mt-1">
              {isArabic
                ? 'إدارة العروض التجارية، التوقيع الرقمي عبر نفاذ، وتحويل العروض المقبولة إلى أوامر بيع تلقائياً'
                : 'Manage enterprise B2B quotations, digital signatures via Nafath, and instant conversion to Sales Orders.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCreateQuotation}
              className="flex items-center gap-2 rounded-lg bg-[#004a60] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#074e64] transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? '+ عرض سعر جديد' : '+ New Quotation'}</span>
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'قيمة العروض النشطة' : 'Active Proposals Pipeline'}</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-[#161c27]">SAR 1,280,750</div>
            <div className="mt-1 text-[11px] text-emerald-700 font-semibold">+18.5% YoY Growth</div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'نسبة التحويل' : 'Conversion Win Rate'}</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-[#161c27]">68.4%</div>
            <div className="mt-1 text-[11px] text-[#70787d]">Above industry benchmark (55%)</div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'عروض قاربت على الانتهاء' : 'Expiring in 48h'}</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-amber-600">1 Quote</div>
            <div className="mt-1 text-[11px] text-amber-700 font-semibold">QT-2024-0891 (28h left)</div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'متوسط قيمة الصفقة' : 'Average Deal Size'}</span>
              <FileCheck2 className="h-4 w-4 text-[#004a60]" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-[#161c27]">SAR 256,150</div>
            <div className="mt-1 text-[11px] text-[#70787d]">B2B Enterprise Standard</div>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-[#e3e8f9] py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {(['All', 'Sent', 'Accepted', 'Draft', 'Expired'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors shrink-0 ${
                  statusFilter === st
                    ? 'bg-[#004a60] text-white'
                    : 'bg-white text-[#40484d] border border-[#e3e8f9] hover:bg-[#f1f3ff]'
                }`}
              >
                {st === 'All' && (isArabic ? 'الكل' : 'All Proposals')}
                {st === 'Sent' && (isArabic ? 'مرسل للمراجعة' : 'Sent / Review')}
                {st === 'Accepted' && (isArabic ? 'مقبول' : 'Accepted')}
                {st === 'Draft' && (isArabic ? 'مسودة' : 'Draft')}
                {st === 'Expired' && (isArabic ? 'منتهي الصلاحية' : 'Expired')}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isArabic ? 'بحث في عروض الأسعار...' : 'Search Quotation ID, Client...'}
              className="w-full rounded-lg border border-[#e3e8f9] bg-white py-1.5 pl-8 pr-3 text-xs text-[#161c27] placeholder-[#70787d] focus:border-[#004a60] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Main Content: Table + Side Sheet */}
      <div className="flex-1 flex overflow-hidden">
        {/* Quotations Table */}
        <div className="flex-1 overflow-auto p-4 lg:p-6 pt-2">
          <div className="overflow-hidden rounded-xl border border-[#e3e8f9] bg-white shadow-xs">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="border-b border-[#e3e8f9] bg-[#f9f9ff] text-[11px] font-semibold uppercase text-[#70787d]">
                <tr>
                  <th className="p-3">{isArabic ? 'رقم العرض والفئة' : 'Quotation ID & Category'}</th>
                  <th className="p-3">{isArabic ? 'الجهة المستفيدة' : 'Client Entity'}</th>
                  <th className="p-3">{isArabic ? 'الصلاحية والانتهاء' : 'Validity & Expiry'}</th>
                  <th className="p-3 text-right">{isArabic ? 'الإجمالي مع الضريبة' : 'Grand Total (SAR)'}</th>
                  <th className="p-3">{isArabic ? 'الحالة' : 'Status'}</th>
                  <th className="p-3">{isArabic ? 'مسؤول الحساب' : 'Account Lead'}</th>
                  <th className="p-3 text-center">{isArabic ? 'معاينة' : 'Details'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8f9]">
                {filteredQuotes.map((q) => {
                  const isSelected = selectedQuote?.id === q.id;
                  return (
                    <tr
                      key={q.id}
                      onClick={() => setSelectedQuote(q)}
                      className={`cursor-pointer transition-colors hover:bg-[#f1f3ff]/60 ${
                        isSelected ? 'bg-[#e8eeff]/70 font-medium' : ''
                      }`}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold font-mono text-[#004a60]">{q.id}</span>
                          <span className="text-[10px] rounded bg-[#e8eeff] px-1 py-0.2 font-mono text-[#004a60]">
                            {q.version}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#70787d]">{q.category}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-[#161c27]">{q.customer}</div>
                        <div className="text-[10px] text-[#70787d] font-mono">
                          CR: {q.crNumber}
                        </div>
                      </td>
                      <td className="p-3">
                        <div>{q.dateIssued}</div>
                        {q.isExpiringSoon ? (
                          <div className="text-[10px] font-semibold text-rose-600 flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            Expires in {q.expiresInHours} hrs
                          </div>
                        ) : (
                          <div className="text-[10px] text-[#70787d]">Valid until {q.validUntil}</div>
                        )}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#161c27]">
                        SAR {q.grandTotal.toLocaleString()}
                        <div className="text-[10px] font-normal text-[#70787d]">
                          VAT: SAR {q.vatAmount.toLocaleString()}
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            q.status === 'Accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : q.status === 'Sent'
                              ? 'bg-[#aae2fd] text-[#004a60]'
                              : q.status === 'Expired'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {q.statusLabel}
                        </span>
                        {q.convertedSo && (
                          <div className="text-[9px] font-mono text-emerald-700 font-bold mt-0.5">
                            SO: {q.convertedSo}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-[#40484d] text-[11px]">{q.creator}</td>
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

        {/* Side-Sheet: Detailed Quotation Inspector */}
        {selectedQuote && (
          <aside className="w-96 border-l border-[#e3e8f9] bg-white flex flex-col h-full shadow-lg shrink-0 overflow-y-auto hidden xl:flex">
            {/* Sheet Header */}
            <div className="p-4 border-b border-[#e3e8f9] flex items-center justify-between bg-[#f9f9ff]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-[#004a60]">
                    {selectedQuote.id}
                  </span>
                  <span
                    className={`rounded-sm px-1.5 py-0.5 text-[9px] font-bold ${
                      selectedQuote.status === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#e8eeff] text-[#004a60]'
                    }`}
                  >
                    {selectedQuote.statusLabel}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#161c27] mt-1">
                  {selectedQuote.customer}
                </div>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="text-[#70787d] hover:text-[#161c27] p-1 rounded-md hover:bg-[#e3e8f9]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sheet Content */}
            <div className="p-4 space-y-4 text-xs">
              {/* Expiring Alert if applicable */}
              {selectedQuote.isExpiringSoon && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-[11px]">
                    <span className="font-bold">Validity Action Required:</span> This proposal expires in{' '}
                    <span className="font-bold">{selectedQuote.expiresInHours} hours</span>. Follow up with client contact.
                  </div>
                </div>
              )}

              {/* Customer 360 Box */}
              <div className="rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#70787d]">Primary Contact:</span>
                  <span className="font-semibold text-[#161c27]">{selectedQuote.contactName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70787d]">Email:</span>
                  <span className="font-mono text-[#004a60]">{selectedQuote.contactEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70787d]">CR Number:</span>
                  <span className="font-mono text-[#161c27]">{selectedQuote.crNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70787d]">TRN Tax ID:</span>
                  <span className="font-mono text-[#161c27]">{selectedQuote.trnNumber}</span>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="font-bold text-[#161c27] mb-2">Scope Breakdown</div>
                <div className="space-y-2">
                  {selectedQuote.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-[#e3e8f9] p-2.5 bg-white flex justify-between items-start"
                    >
                      <div>
                        <div className="font-semibold text-[#161c27]">{it.title}</div>
                        <div className="text-[10px] text-[#70787d]">{it.scope}</div>
                      </div>
                      <div className="font-mono font-bold text-[#161c27]">
                        SAR {it.price.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="rounded-lg border border-[#e3e8f9] p-3 space-y-1.5 bg-[#f9f9ff]">
                <div className="flex justify-between text-[#70787d]">
                  <span>Subtotal Net:</span>
                  <span className="font-mono">SAR {selectedQuote.totalNet.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#70787d]">
                  <span>Value Added Tax (15%):</span>
                  <span className="font-mono text-emerald-700">
                    SAR {selectedQuote.vatAmount.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-[#e3e8f9] pt-2 flex justify-between font-mono font-bold text-sm text-[#004a60]">
                  <span>Grand Total:</span>
                  <span>SAR {selectedQuote.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Legal & Digital Signature Verification */}
              <div className="rounded-lg border border-[#e3e8f9] p-3 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#161c27]">
                  <FileSignature className="h-3.5 w-3.5 text-[#004a60]" />
                  <span>Nafath Digital e-Sign</span>
                </div>
                <div className="text-[11px] text-[#40484d]">{selectedQuote.eSignStatus}</div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>ZATCA Phase 2 Compliant Quotation Format</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => onConvertToSalesOrder(selectedQuote)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#004a60] py-2.5 font-semibold text-white hover:bg-[#074e64] transition-all cursor-pointer"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>Convert to Sales Order</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => alert(`Resending proposal link via SMS OTP to ${selectedQuote.contactEmail}`)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-[#e3e8f9] bg-white py-2 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff] cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5 text-[#70787d]" />
                    <span>Resend e-Sign</span>
                  </button>
                  <button
                    onClick={() => alert(`Downloading formal PDF for ${selectedQuote.id}`)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-[#e3e8f9] bg-white py-2 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff] cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-[#70787d]" />
                    <span>Formal PDF</span>
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
