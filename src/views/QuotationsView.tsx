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
  Layers,
  Receipt,
  Printer,
  LayoutGrid,
  List,
  Percent,
  Eye,
  Check,
  Sparkles,
  Calculator,
  Tag,
  Phone,
  Mail,
  FileText,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { Quotation, QuotationItem, QuotationTaxBreakdown } from '../data/mockData';

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
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Sent' | 'Accepted' | 'Draft' | 'Expired'>('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [quoteForPrintModal, setQuoteForPrintModal] = useState<Quotation | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredQuotes = quotations.filter((q) => {
    if (statusFilter !== 'All' && q.status !== statusFilter) return false;
    if (search) {
      const query = search.toLowerCase();
      return (
        q.id.toLowerCase().includes(query) ||
        q.customer.toLowerCase().includes(query) ||
        q.crNumber.includes(query) ||
        (q.planName && q.planName.toLowerCase().includes(query)) ||
        (q.planNameAr && q.planNameAr.includes(query)) ||
        (q.tierName && q.tierName.toLowerCase().includes(query)) ||
        (q.tierNameAr && q.tierNameAr.includes(query)) ||
        (q.tierCode && q.tierCode.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const handleInspectQuote = (quote: Quotation) => {
    setSelectedQuote(quote);
    setIsMobileDrawerOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#f8faff]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-60 bg-[#004a60] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="p-4 lg:p-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-bold text-[#161c27]">
                {isArabic ? 'عروض الأسعار والاتفاقيات التجارية' : 'Quotations & Commercial Pipeline'}
              </h1>
              <span className="text-[11px] font-mono font-bold bg-[#e8eeff] text-[#004a60] px-2 py-0.5 rounded-md border border-[#bcd7f5]">
                {filteredQuotes.length} {isArabic ? 'عرض' : 'Quotes'}
              </span>
            </div>
            <p className="text-xs text-[#70787d] mt-1 max-w-3xl">
              {isArabic
                ? 'إنشاء عروض أسعار مرتبطة مباشرة بباقات ومستويات المنظومة مع تفقيط الضرائب والرسوم، التوقيع الرقمي عبر نفاذ، وتحويل العروض تلقائياً لأوامر بيع.'
                : 'Create commercial proposals linked to plans, tiers, and multi-tax schedules with Nafath digital e-sign and instant sales order conversion.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white rounded-lg border border-[#e3e8f9] p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#004a60] text-white' : 'text-[#70787d] hover:text-[#161c27]'
                }`}
                title={isArabic ? 'عرض الجدول' : 'Table View'}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  viewMode === 'cards' ? 'bg-[#004a60] text-white' : 'text-[#70787d] hover:text-[#161c27]'
                }`}
                title={isArabic ? 'عرض البطاقات' : 'Cards View'}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            {/* Create Quotation Button */}
            <button
              onClick={onOpenCreateQuotation}
              className="flex items-center gap-2 rounded-xl bg-[#004a60] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#074e64] transition-all cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? '+ عرض سعر جديد' : '+ New Quotation'}</span>
            </button>
          </div>
        </div>

        {/* Responsive KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
          <div className="rounded-xl border border-[#e3e8f9] bg-white p-3.5 sm:p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[#70787d] text-[11px] sm:text-xs font-medium">
              <span>{isArabic ? 'إجمالي خط العروض' : 'Active Proposals Pipeline'}</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-1.5 sm:mt-2 text-lg sm:text-xl font-bold font-mono text-[#161c27]">
              SAR 1,280,750
            </div>
            <div className="mt-1 text-[10px] sm:text-[11px] text-emerald-700 font-semibold">
              +18.5% YoY Growth
            </div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-3.5 sm:p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[#70787d] text-[11px] sm:text-xs font-medium">
              <span>{isArabic ? 'نسبة القبول والتحويل' : 'Conversion Win Rate'}</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-1.5 sm:mt-2 text-lg sm:text-xl font-bold font-mono text-[#161c27]">68.4%</div>
            <div className="mt-1 text-[10px] sm:text-[11px] text-[#70787d]">
              {isArabic ? 'أعلى من معيار السوق (55%)' : 'Above industry benchmark (55%)'}
            </div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-3.5 sm:p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[#70787d] text-[11px] sm:text-xs font-medium">
              <span>{isArabic ? 'عروض توشك على الانتهاء' : 'Expiring in 48h'}</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-1.5 sm:mt-2 text-lg sm:text-xl font-bold font-mono text-amber-600">
              1 {isArabic ? 'عرض' : 'Quote'}
            </div>
            <div className="mt-1 text-[10px] sm:text-[11px] text-amber-700 font-semibold">
              QT-2024-0891 (28h left)
            </div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-3.5 sm:p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[#70787d] text-[11px] sm:text-xs font-medium">
              <span>{isArabic ? 'متوسط قيمة الصفقة' : 'Average Deal Size'}</span>
              <FileCheck2 className="h-4 w-4 text-[#004a60]" />
            </div>
            <div className="mt-1.5 sm:mt-2 text-lg sm:text-xl font-bold font-mono text-[#161c27]">
              SAR 256,150
            </div>
            <div className="mt-1 text-[10px] sm:text-[11px] text-[#70787d]">
              {isArabic ? 'معيار عقود B2B للمنشآت' : 'B2B Enterprise Standard'}
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-[#e3e8f9] py-3 bg-white/70 px-2 sm:px-4 rounded-xl">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {(['All', 'Sent', 'Accepted', 'Draft', 'Expired'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#004a60] text-white shadow-2xs'
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

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isArabic ? 'بحث برقم العرض، العميل، الباقة...' : 'Search Quote ID, Client, Plan...'}
              className="w-full rounded-xl border border-[#e3e8f9] bg-white py-1.5 pl-8 pr-3 text-xs text-[#161c27] placeholder-[#70787d] focus:border-[#004a60] focus:outline-hidden shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area: Responsive List + Desktop Side-Sheet */}
      <div className="flex-1 flex overflow-hidden">
        {/* Quotations List: Table or Cards */}
        <div className="flex-1 overflow-auto p-4 lg:p-6 pt-2">
          {filteredQuotes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#c3cce6] bg-white p-8 text-center my-6">
              <FileCheck2 className="h-10 w-10 text-[#70787d] mx-auto mb-2 opacity-50" />
              <h3 className="font-bold text-sm text-[#161c27]">
                {isArabic ? 'لا توجد عروض أسعار مطابقة للبحث' : 'No matching quotations found'}
              </h3>
              <p className="text-xs text-[#70787d] mt-1">
                {isArabic ? 'جرب تغيير شروط البحث أو الفلترة أو قم بإنشاء عرض جديد' : 'Try adjusting your search criteria or create a new quotation'}
              </p>
              <button
                onClick={onOpenCreateQuotation}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#004a60] text-white text-xs font-semibold hover:bg-[#074e64] cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isArabic ? 'إنشاء عرض سعر الآن' : 'Create Quotation Now'}</span>
              </button>
            </div>
          ) : viewMode === 'cards' ? (
            /* Responsive Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
              {filteredQuotes.map((q) => {
                const isSelected = selectedQuote?.id === q.id;
                return (
                  <div
                    key={q.id}
                    onClick={() => handleInspectQuote(q)}
                    className={`rounded-2xl border transition-all cursor-pointer p-4 bg-white flex flex-col justify-between hover:shadow-md ${
                      isSelected
                        ? 'border-[#004a60] ring-2 ring-[#004a60]/20 shadow-xs'
                        : 'border-[#e3e8f9] hover:border-[#bcd7f5]'
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#f0f4fd]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-[#004a60]">{q.id}</span>
                          <span className="text-[10px] rounded bg-[#e8eeff] px-1.5 py-0.2 font-mono text-[#004a60] font-bold">
                            {q.version}
                          </span>
                        </div>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
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
                      </div>

                      {/* Customer Entity */}
                      <div className="mt-2.5">
                        <h4 className="font-bold text-sm text-[#161c27]">{q.customer}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#70787d] font-mono mt-0.5">
                          <span>CR: {q.crNumber}</span>
                          <span>•</span>
                          <span>TRN: {q.trnNumber}</span>
                        </div>
                      </div>

                      {/* Plan & Tier Badge if linked */}
                      {q.planName ? (
                        <div className="mt-3 p-2.5 rounded-xl bg-[#f5f9ff] border border-[#d6e5fa] space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#004a60] flex items-center gap-1">
                              <Layers className="h-3.5 w-3.5 text-[#004a60]" />
                              <span>{isArabic ? q.planNameAr || q.planName : q.planName}</span>
                            </span>
                            {q.tierCode && (
                              <span className="font-mono text-[9px] font-bold bg-[#004a60] text-white px-1.5 py-0.5 rounded">
                                {q.tierCode}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-[#40484d]">
                            <span className="line-clamp-1">{isArabic ? q.tierNameAr || q.tierName : q.tierName}</span>
                            {q.propertiesCount && (
                              <span className="font-mono font-bold text-[#004a60] shrink-0">
                                {q.propertiesCount} {isArabic ? 'وحدات' : 'Units'}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 p-2 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-[#70787d]">
                          <span>{q.category}</span>
                        </div>
                      )}

                      {/* Applied Taxes Badges */}
                      <div className="mt-2.5">
                        <div className="text-[10px] font-semibold text-[#70787d] mb-1">
                          {isArabic ? 'الضرائب المطبقة:' : 'Applied Taxes:'}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {q.taxesBreakdown && q.taxesBreakdown.length > 0 ? (
                            q.taxesBreakdown.map((tx) => (
                              <span
                                key={tx.taxId}
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-semibold"
                              >
                                <Percent className="h-2.5 w-2.5" />
                                <span>{tx.code} ({tx.rate}%)</span>
                              </span>
                            ))
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-mono">
                              VAT (15%)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Financial Summary & Actions */}
                    <div className="mt-4 pt-3 border-t border-[#f0f4fd]">
                      <div className="flex items-end justify-between mb-3">
                        <div>
                          <div className="text-[10px] text-[#70787d]">
                            {isArabic ? 'الصافي:' : 'Net:'}{' '}
                            <span className="font-mono">SAR {q.totalNet.toLocaleString()}</span>
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold">
                            {isArabic ? 'الضريبة:' : 'Tax:'}{' '}
                            <span className="font-mono">SAR {q.vatAmount.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-[#70787d]">
                            {isArabic ? 'الإجمالي مع الضريبة' : 'Grand Total'}
                          </div>
                          <div className="text-base font-black font-mono text-[#004a60]">
                            SAR {q.grandTotal.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInspectQuote(q);
                          }}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#f1f5fd] hover:bg-[#e2ecfd] text-[#004a60] text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="h-3 w-3" />
                          <span>{isArabic ? 'معاينة' : 'Details'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuoteForPrintModal(q);
                          }}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-[#e3e8f9] hover:bg-[#f1f3ff] text-[#40484d] text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          <Printer className="h-3 w-3 text-[#70787d]" />
                          <span>{isArabic ? 'PDF رسمي' : 'Print PDF'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onConvertToSalesOrder(q);
                          }}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#004a60] hover:bg-[#074e64] text-white text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          <ArrowRight className="h-3 w-3" />
                          <span>{isArabic ? 'أمر بيع' : 'Convert'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Responsive Table View */
            <div className="overflow-hidden rounded-2xl border border-[#e3e8f9] bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="border-b border-[#e3e8f9] bg-[#f9f9ff] text-[11px] font-semibold uppercase text-[#70787d]">
                    <tr>
                      <th className="p-3">{isArabic ? 'رقم العرض' : 'Quotation ID'}</th>
                      <th className="p-3">{isArabic ? 'الجهة المستفيدة' : 'Client Entity'}</th>
                      <th className="p-3">{isArabic ? 'الباقة والمستوى (Plan & Tier)' : 'Plan & Tier'}</th>
                      <th className="p-3">{isArabic ? 'الضرائب المطبقة' : 'Applied Taxes'}</th>
                      <th className="p-3 text-right">{isArabic ? 'الإجمالي مع الضريبة' : 'Grand Total (SAR)'}</th>
                      <th className="p-3">{isArabic ? 'الحالة' : 'Status'}</th>
                      <th className="p-3 text-center">{isArabic ? 'الإجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e3e8f9]">
                    {filteredQuotes.map((q) => {
                      const isSelected = selectedQuote?.id === q.id;
                      return (
                        <tr
                          key={q.id}
                          onClick={() => handleInspectQuote(q)}
                          className={`cursor-pointer transition-colors hover:bg-[#f1f3ff]/60 ${
                            isSelected ? 'bg-[#e8eeff]/70 font-medium' : ''
                          }`}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold font-mono text-[#004a60]">{q.id}</span>
                              <span className="text-[10px] rounded bg-[#e8eeff] px-1 py-0.2 font-mono text-[#004a60] font-bold">
                                {q.version}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#70787d]">{q.dateIssued}</div>
                          </td>

                          <td className="p-3">
                            <div className="font-semibold text-[#161c27]">{q.customer}</div>
                            <div className="text-[10px] text-[#70787d] font-mono">CR: {q.crNumber}</div>
                          </td>

                          <td className="p-3">
                            {q.planName ? (
                              <div>
                                <div className="font-bold text-[#004a60] flex items-center gap-1">
                                  <Layers className="h-3 w-3 text-[#004a60]" />
                                  <span>{isArabic ? q.planNameAr || q.planName : q.planName}</span>
                                </div>
                                <div className="text-[10px] text-[#50585e] flex items-center gap-1 mt-0.5">
                                  {q.tierCode && (
                                    <span className="font-mono font-bold text-[#004a60] bg-[#eef7ff] px-1 rounded">
                                      {q.tierCode}
                                    </span>
                                  )}
                                  <span className="truncate max-w-[140px]">
                                    {isArabic ? q.tierNameAr || q.tierName : q.tierName}
                                  </span>
                                  {q.propertiesCount && (
                                    <span className="text-[10px] text-gray-500 font-mono">
                                      ({q.propertiesCount} {isArabic ? 'وحدات' : 'u'})
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-[#70787d] text-[11px]">{q.category}</span>
                            )}
                          </td>

                          <td className="p-3">
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {q.taxesBreakdown && q.taxesBreakdown.length > 0 ? (
                                q.taxesBreakdown.map((tb) => (
                                  <span
                                    key={tb.taxId}
                                    className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-mono font-bold"
                                  >
                                    {tb.code} ({tb.rate}%)
                                  </span>
                                ))
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-[9px] font-mono">
                                  VAT (15%)
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-3 text-right font-mono font-bold text-[#161c27]">
                            SAR {q.grandTotal.toLocaleString()}
                            <div className="text-[10px] font-normal text-emerald-700">
                              Tax: SAR {q.vatAmount.toLocaleString()}
                            </div>
                          </td>

                          <td className="p-3">
                            <span
                              className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
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

                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuoteForPrintModal(q);
                                }}
                                title={isArabic ? 'معاينة العرض الرسمي للطباعة' : 'Print Formal PDF'}
                                className="p-1 rounded-lg hover:bg-[#e8eeff] text-[#004a60] transition-colors cursor-pointer"
                              >
                                <Printer className="h-3.5 w-3.5" />
                              </button>
                              <ChevronRight className="h-4 w-4 text-[#70787d]" />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Side-Sheet: Detailed Quotation Inspector (xl and up) */}
        {selectedQuote && (
          <aside className="w-96 border-l border-[#e3e8f9] bg-white flex flex-col h-full shadow-lg shrink-0 overflow-y-auto hidden xl:flex">
            <QuotationInspectorContent
              quote={selectedQuote}
              isArabic={isArabic}
              onClose={() => setSelectedQuote(null)}
              onConvertToSalesOrder={onConvertToSalesOrder}
              onOpenPrintModal={() => setQuoteForPrintModal(selectedQuote)}
              onShowToast={showToast}
            />
          </aside>
        )}
      </div>

      {/* Mobile & Tablet Slide-Over Drawer / Bottom Sheet (< xl) */}
      {selectedQuote && isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs xl:hidden p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[88vh] flex flex-col shadow-2xl border border-[#e3e8f9] overflow-hidden">
            <QuotationInspectorContent
              quote={selectedQuote}
              isArabic={isArabic}
              onClose={() => setIsMobileDrawerOpen(false)}
              onConvertToSalesOrder={(q) => {
                setIsMobileDrawerOpen(false);
                onConvertToSalesOrder(q);
              }}
              onOpenPrintModal={() => {
                setIsMobileDrawerOpen(false);
                setQuoteForPrintModal(selectedQuote);
              }}
              onShowToast={showToast}
            />
          </div>
        </div>
      )}

      {/* FORMAL PRINTABLE / PDF QUOTATION MODAL */}
      {quoteForPrintModal && (
        <FormalQuotationModal
          quote={quoteForPrintModal}
          isArabic={isArabic}
          onClose={() => setQuoteForPrintModal(null)}
          onShowToast={showToast}
        />
      )}
    </div>
  );
};

// Sub-Component: Quotation Inspector Content (Used in Desktop Side-Sheet & Mobile Drawer)
interface QuotationInspectorProps {
  quote: Quotation;
  isArabic: boolean;
  onClose: () => void;
  onConvertToSalesOrder: (quote: Quotation) => void;
  onOpenPrintModal: () => void;
  onShowToast: (msg: string) => void;
}

const QuotationInspectorContent: React.FC<QuotationInspectorProps> = ({
  quote,
  isArabic,
  onClose,
  onConvertToSalesOrder,
  onOpenPrintModal,
  onShowToast,
}) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#e3e8f9] flex items-center justify-between bg-[#f9f9ff] shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-mono text-[#004a60]">{quote.id}</span>
            <span className="text-[10px] rounded bg-[#e8eeff] px-1.5 py-0.2 font-mono text-[#004a60] font-bold">
              {quote.version}
            </span>
            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                quote.status === 'Accepted'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-[#e8eeff] text-[#004a60]'
              }`}
            >
              {quote.statusLabel}
            </span>
          </div>
          <div className="text-xs font-bold text-[#161c27] mt-1">{quote.customer}</div>
        </div>
        <button
          onClick={onClose}
          className="text-[#70787d] hover:text-[#161c27] p-1.5 rounded-lg hover:bg-[#e3e8f9] cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="p-4 space-y-4 text-xs overflow-y-auto flex-1">
        {/* Expiring Alert if applicable */}
        {quote.isExpiringSoon && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <span className="font-bold">{isArabic ? 'تنبيه انتهاء الصلاحية:' : 'Validity Alert:'}</span>{' '}
              {isArabic
                ? `ينتهي هذا العرض خلال ${quote.expiresInHours} ساعة. يرجى المتابعة مع العميل.`
                : `This proposal expires in ${quote.expiresInHours} hours. Follow up with client contact.`}
            </div>
          </div>
        )}

        {/* Customer 360 Box */}
        <div className="rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[#70787d]">{isArabic ? 'جهة الاتصال الرئيسية:' : 'Primary Contact:'}</span>
            <span className="font-semibold text-[#161c27]">{quote.contactName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#70787d]">{isArabic ? 'البريد الإلكتروني:' : 'Email:'}</span>
            <span className="font-mono text-[#004a60] text-[11px]">{quote.contactEmail}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#70787d]">{isArabic ? 'السجل التجاري:' : 'CR Number:'}</span>
            <span className="font-mono text-[#161c27]">{quote.crNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#70787d]">{isArabic ? 'الرقم الضريبي:' : 'TRN Tax ID:'}</span>
            <span className="font-mono text-[#161c27]">{quote.trnNumber}</span>
          </div>
        </div>

        {/* Plan & Tier Specification Card */}
        {quote.planName ? (
          <div className="rounded-xl border border-[#bcd7f5] bg-gradient-to-br from-[#f8faff] to-[#eef7ff] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#004a60] text-xs flex items-center gap-1.5">
                <Layers className="h-4 w-4" />
                <span>{isArabic ? 'الباقة ومستوى التسعير (Plan & Tier):' : 'Plan & Tier Subscription:'}</span>
              </span>
              {quote.tierCode && (
                <span className="font-mono font-bold text-[10px] bg-[#004a60] text-white px-2 py-0.5 rounded">
                  {quote.tierCode}
                </span>
              )}
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#bcd7f5]/80 space-y-1">
              <div className="font-bold text-xs text-[#161c27]">
                {isArabic ? quote.planNameAr || quote.planName : quote.planName}
              </div>
              <div className="text-[11px] text-[#50585e]">
                {isArabic ? quote.tierNameAr || quote.tierName : quote.tierName}
              </div>
              {quote.propertiesCount && (
                <div className="text-[11px] font-mono font-bold text-[#004a60] pt-1 border-t border-gray-100 flex justify-between">
                  <span>{isArabic ? 'عدد العقارات المشتركة:' : 'Enrolled Properties:'}</span>
                  <span>{quote.propertiesCount} {isArabic ? 'عقار / وحدة' : 'Units'}</span>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Line Items Breakdown */}
        <div>
          <div className="font-bold text-[#161c27] mb-2 flex items-center justify-between">
            <span>{isArabic ? 'نطاق الخدمات والاشتراك:' : 'Scope & Service Breakdown:'}</span>
            <span className="text-[10px] font-mono text-[#70787d]">{quote.items.length} {isArabic ? 'بنود' : 'Items'}</span>
          </div>
          <div className="space-y-2">
            {quote.items.map((it, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#e3e8f9] p-3 bg-white space-y-1 shadow-2xs"
              >
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-xs text-[#161c27]">{it.title}</div>
                  <div className="font-mono font-bold text-xs text-[#004a60] shrink-0">
                    SAR {it.price.toLocaleString()}
                  </div>
                </div>
                <div className="text-[10px] text-[#70787d]">{it.scope}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Itemized Taxes Breakdown */}
        <div className="rounded-xl border border-[#bcd7f5] p-3.5 space-y-2 bg-[#f9fbff]">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#bcd7f5]/60">
            <span className="font-bold text-[#004a60] flex items-center gap-1.5">
              <Calculator className="h-3.5 w-3.5" />
              <span>{isArabic ? 'جدول احتساب الضرائب والرسوم:' : 'Tax & Financial Schedule:'}</span>
            </span>
          </div>

          <div className="flex justify-between text-[#70787d]">
            <span>{isArabic ? 'المبلغ الصافي قبل الضريبة:' : 'Subtotal Net:'}</span>
            <span className="font-mono font-semibold text-[#161c27]">
              SAR {quote.totalNet.toLocaleString()}
            </span>
          </div>

          {/* Itemized Taxes */}
          <div className="space-y-1.5 pt-1 border-t border-[#bcd7f5]/40">
            {quote.taxesBreakdown && quote.taxesBreakdown.length > 0 ? (
              quote.taxesBreakdown.map((tb) => (
                <div key={tb.taxId} className="flex justify-between text-[11px] text-[#40484d]">
                  <span className="flex items-center gap-1">
                    <span className="font-mono font-bold text-[#004a60]">[{tb.code}]</span>
                    <span>{isArabic ? tb.nameAr : tb.name} ({tb.rate}%):</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-800">
                    +SAR {tb.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex justify-between text-[11px] text-[#40484d]">
                <span>{isArabic ? 'ضريبة القيمة المضافة (15%):' : 'Value Added Tax (15%):'}</span>
                <span className="font-mono font-bold text-emerald-800">
                  +SAR {quote.vatAmount.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between text-[11px] text-emerald-800 font-bold pt-1 border-t border-[#bcd7f5]/40">
            <span>{isArabic ? 'إجمالي مبالغ الضرائب والرسوم:' : 'Total Taxes & Surcharges:'}</span>
            <span className="font-mono">
              SAR {quote.vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="border-t border-[#bcd7f5] pt-2 flex justify-between font-mono font-black text-sm text-[#004a60]">
            <span>{isArabic ? 'الإجمالي النهائي للعرض:' : 'Grand Total:'}</span>
            <span>SAR {quote.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Legal & Digital Signature Verification */}
        <div className="rounded-xl border border-[#e3e8f9] p-3 space-y-2 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[#161c27]">
              <FileSignature className="h-3.5 w-3.5 text-[#004a60]" />
              <span>{isArabic ? 'التوقيع الرقمي المعتمد (نفاذ)' : 'Nafath Digital e-Sign'}</span>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
              Verified
            </span>
          </div>
          <div className="text-[11px] text-[#40484d]">{quote.eSignStatus}</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>{isArabic ? 'متوافق مع المرحلة الثانية لهيئة الزكاة والضريبة والجمارك (ZATCA)' : 'ZATCA Phase 2 Compliant Quotation Format'}</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="p-4 border-t border-[#e3e8f9] bg-[#f9f9ff] space-y-2 shrink-0">
        <button
          onClick={() => onConvertToSalesOrder(quote)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#004a60] py-2.5 font-bold text-xs text-white hover:bg-[#074e64] transition-all cursor-pointer shadow-xs"
        >
          <ArrowRight className="h-4 w-4" />
          <span>{isArabic ? 'تحويل العرض إلى أمر بيع (Sales Order)' : 'Convert to Sales Order'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              onShowToast(
                isArabic
                  ? `تم إرسال رابط التوقيع عبر نفاذ ورمز OTP إلى ${quote.contactEmail}`
                  : `Proposal link resent via Nafath OTP to ${quote.contactEmail}`
              );
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#e3e8f9] bg-white py-2 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff] cursor-pointer"
          >
            <Send className="h-3.5 w-3.5 text-[#70787d]" />
            <span>{isArabic ? 'إرسال نفاذ' : 'Resend e-Sign'}</span>
          </button>

          <button
            onClick={onOpenPrintModal}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#004a60] bg-[#eef7ff] py-2 text-xs font-bold text-[#004a60] hover:bg-[#e2ecfd] cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-[#004a60]" />
            <span>{isArabic ? 'معاينة PDF' : 'Formal PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Sub-Component: Formal Quotation Document Modal (Print & PDF View)
interface FormalModalProps {
  quote: Quotation;
  isArabic: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

const FormalQuotationModal: React.FC<FormalModalProps> = ({
  quote,
  isArabic,
  onClose,
  onShowToast,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col my-auto max-h-[94vh]">
        {/* Modal Controls Toolbar (Hidden during print) */}
        <div className="p-3.5 bg-[#f0f4fa] border-b border-[#d6e0f0] flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-[#004a60]">
              {isArabic ? 'معاينة العرض التجاري الرسمي للطباعة أو التصدير PDF' : 'Official Commercial Quotation Document'}
            </span>
            <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-gray-300 font-bold text-[#161c27]">
              {quote.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004a60] text-white text-xs font-bold hover:bg-[#074e64] cursor-pointer shadow-2xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>{isArabic ? 'طباعة العرض (Print)' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 font-sans text-gray-800 space-y-6 print:p-0 print:m-0">
          {/* Document Letterhead */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-[#004a60] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#004a60] text-white">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#004a60] tracking-wide">
                    KHETAT HOSPITALITY OS
                  </h2>
                  <div className="text-xs text-gray-500 font-bold">
                    منظومة خطط السحابية لإدارة وتشغيل العقارات الفندقية والسياحية
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-gray-500 mt-2 space-y-0.5">
                <div>الرياض، المملكة العربية السعودية • طريق الملك فهد</div>
                <div>س.ت (CR): 1010892049 • الرقم الضريبي (TRN): 310491827100003</div>
              </div>
            </div>

            <div className="text-left sm:text-right bg-[#f8faff] p-3 rounded-xl border border-[#bcd7f5] shrink-0">
              <div className="text-xs uppercase font-bold text-[#004a60]">
                {isArabic ? 'عرض سعر رسمي' : 'COMMERCIAL QUOTATION'}
              </div>
              <div className="text-base font-black font-mono text-[#161c27]">{quote.id}</div>
              <div className="text-[11px] text-gray-600 mt-1">
                <span>{isArabic ? 'تاريخ الإصدار:' : 'Issued:'}</span>{' '}
                <span className="font-semibold">{quote.dateIssued}</span>
              </div>
              <div className="text-[11px] text-gray-600">
                <span>{isArabic ? 'ساري حتى:' : 'Valid Until:'}</span>{' '}
                <span className="font-semibold">{quote.validUntil}</span>
              </div>
            </div>
          </div>

          {/* Client & Entity Information Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 space-y-1">
              <div className="text-[10px] font-bold uppercase text-gray-500">
                {isArabic ? 'العميل المستفيد (Client Information):' : 'Billed To Client Entity:'}
              </div>
              <div className="font-bold text-sm text-[#161c27]">{quote.customer}</div>
              <div className="text-xs text-gray-600">
                {isArabic ? 'مسؤول الاتصال:' : 'Contact:'} {quote.contactName} ({quote.contactEmail})
              </div>
              <div className="text-xs font-mono text-gray-700">
                <span>CR: {quote.crNumber}</span> • <span>TRN: {quote.trnNumber}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 space-y-1">
              <div className="text-[10px] font-bold uppercase text-gray-500">
                {isArabic ? 'تفاصيل الاتفاقية ونوع التعاقد:' : 'Contract & Subscription Terms:'}
              </div>
              <div className="font-bold text-sm text-[#004a60]">
                {quote.planName ? (isArabic ? quote.planNameAr || quote.planName : quote.planName) : quote.category}
              </div>
              <div className="text-xs text-gray-600">
                {isArabic ? 'المستوى المختار:' : 'Tier:'}{' '}
                <span className="font-semibold">
                  {quote.tierName ? (isArabic ? quote.tierNameAr || quote.tierName : quote.tierName) : 'Standard Tier'}
                </span>{' '}
                {quote.tierCode && <span className="font-mono text-[#004a60]">({quote.tierCode})</span>}
              </div>
              <div className="text-xs text-gray-600">
                {isArabic ? 'حالة التوقيع الرقمي:' : 'Digital e-Sign:'}{' '}
                <span className="font-semibold text-emerald-800">{quote.eSignStatus}</span>
              </div>
            </div>
          </div>

          {/* Subscription Scope & Package Table */}
          <div>
            <h3 className="font-bold text-xs uppercase text-[#004a60] mb-2 flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              <span>{isArabic ? 'بنود ونطاق اشتراك الباقات والمستويات (Subscription Scope):' : 'Subscription Scope & Tiers:'}</span>
            </h3>
            <table className="w-full text-xs border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-[#f0f4fa] text-gray-700 font-bold border-b border-gray-200">
                <tr>
                  <th className="p-2.5 text-left">{isArabic ? 'الباقة والمستوى / البيان' : 'Item & Description'}</th>
                  <th className="p-2.5 text-center">{isArabic ? 'عدد العقارات / الوحدات' : 'Units'}</th>
                  <th className="p-2.5 text-right">{isArabic ? 'السعر الصافي (ر.س)' : 'Net Amount (SAR)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {quote.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2.5">
                      <div className="font-bold text-[#161c27]">{it.title}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{it.scope}</div>
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold text-[#004a60]">
                      {it.propertiesCount || quote.propertiesCount || 1}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#161c27]">
                      SAR {it.price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Official ZATCA Compliant Tax Schedule */}
          <div>
            <h3 className="font-bold text-xs uppercase text-[#004a60] mb-2 flex items-center gap-1.5">
              <Percent className="h-4 w-4" />
              <span>{isArabic ? 'جدول الضرائب والرسوم المطبقة (Tax Schedule):' : 'Itemized Tax & Surcharges Schedule:'}</span>
            </h3>
            <table className="w-full text-xs border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-[#f0f4fa] text-gray-700 font-bold border-b border-gray-200 text-[11px]">
                <tr>
                  <th className="p-2 text-left">{isArabic ? 'كود الضريبة' : 'Tax Code'}</th>
                  <th className="p-2 text-left">{isArabic ? 'بيان الضريبة / الرسم' : 'Tax Name & Category'}</th>
                  <th className="p-2 text-center">{isArabic ? 'النسبة' : 'Rate'}</th>
                  <th className="p-2 text-right">{isArabic ? 'المبلغ الخاضع' : 'Taxable Base'}</th>
                  <th className="p-2 text-right">{isArabic ? 'قيمة الضريبة (ر.س)' : 'Tax Amount (SAR)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {quote.taxesBreakdown && quote.taxesBreakdown.length > 0 ? (
                  quote.taxesBreakdown.map((tb) => (
                    <tr key={tb.taxId} className="hover:bg-gray-50">
                      <td className="p-2 font-mono font-bold text-[#004a60]">{tb.code}</td>
                      <td className="p-2 font-medium">{isArabic ? tb.nameAr : tb.name}</td>
                      <td className="p-2 text-center font-mono font-bold">{tb.rate}%</td>
                      <td className="p-2 text-right font-mono text-gray-600">SAR {quote.totalNet.toLocaleString()}</td>
                      <td className="p-2 text-right font-mono font-bold text-emerald-800">
                        SAR {tb.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2 font-mono font-bold text-[#004a60]">VAT-15</td>
                    <td className="p-2 font-medium">{isArabic ? 'ضريبة القيمة المضافة القياسية (15%)' : 'Standard Value Added Tax (15%)'}</td>
                    <td className="p-2 text-center font-mono font-bold">15%</td>
                    <td className="p-2 text-right font-mono text-gray-600">SAR {quote.totalNet.toLocaleString()}</td>
                    <td className="p-2 text-right font-mono font-bold text-emerald-800">
                      SAR {quote.vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Grand Total Strip */}
          <div className="flex justify-end">
            <div className="w-full sm:w-80 rounded-xl bg-[#f0f4fa] p-4 border border-[#bcd7f5] space-y-2 text-xs">
              <div className="flex justify-between text-gray-700">
                <span>{isArabic ? 'المجموع الصافي (Subtotal):' : 'Subtotal Net:'}</span>
                <span className="font-mono font-bold">SAR {quote.totalNet.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-bold">
                <span>{isArabic ? 'إجمالي الضرائب والرسوم:' : 'Total Taxes:'}</span>
                <span className="font-mono">
                  SAR {quote.vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="border-t-2 border-[#004a60] pt-2 flex justify-between font-mono font-black text-base text-[#004a60]">
                <span>{isArabic ? 'الإجمالي النهائي (Grand Total):' : 'Grand Total:'}</span>
                <span>SAR {quote.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Legal Stamp & Nafath Seal Section */}
          <div className="pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs items-center">
            <div className="space-y-1">
              <div className="font-bold text-gray-800">{isArabic ? 'الشروط والأحكام:' : 'Terms & Acceptance:'}</div>
              <div className="text-[10px] text-gray-500 leading-relaxed">
                {isArabic
                  ? 'هذا العرض ملزم لكلا الطرفين عند التوقيع الرقمي عبر منصة نفاذ الوطنية. يتم تفعيل اشتراكات الباقة فورياً وتصدير الفاتورة الضريبية وفق متطلبات هيئة الزكاة والضريبة والجمارك.'
                  : 'This quotation is legally binding upon digital acceptance via Nafath National e-Sign. Service activations and Phase 2 tax invoices will be issued automatically.'}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 text-right">
              <div className="text-[10px] text-gray-500 space-y-0.5">
                <div className="font-bold text-emerald-800 flex items-center justify-end gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{isArabic ? 'موقّع إلكترونياً عبر نفاذ' : 'Digitally Signed via Nafath'}</span>
                </div>
                <div>{isArabic ? 'رمز التحقق الرقمي:' : 'Cryptographic Stamp:'} 9A8B-7721-ZATCA</div>
              </div>
              <div className="h-16 w-16 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center p-1">
                <div className="text-[8px] font-mono text-center text-gray-600">
                  ZATCA QR SEAL
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
