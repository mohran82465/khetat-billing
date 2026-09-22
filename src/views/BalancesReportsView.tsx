import React, { useState } from 'react';
import {
  BarChart3,
  Search,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
  Send,
  ShieldAlert,
} from 'lucide-react';
import { AccountLedger } from '../data/mockData';

interface BalancesReportsViewProps {
  ledgers: AccountLedger[];
  isArabic: boolean;
  onSendDunning: (ledger: AccountLedger) => void;
}

export const BalancesReportsView: React.FC<BalancesReportsViewProps> = ({
  ledgers,
  isArabic,
  onSendDunning,
}) => {
  const [fiscalQuarter, setFiscalQuarter] = useState('Q4 2024 (Current)');
  const [riskFilter, setRiskFilter] = useState<'All' | 'high' | 'moderate' | 'low'>('All');
  const [search, setSearch] = useState('');

  const filteredLedgers = ledgers.filter((l) => {
    if (riskFilter !== 'All' && l.riskTier !== riskFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.crn.includes(q) ||
        l.trn.includes(q)
      );
    }
    return true;
  });

  const totalOutstandingAll = ledgers.reduce((acc, curr) => acc + curr.totalOutstanding, 0);
  const current0to30Total = ledgers.reduce((acc, curr) => acc + curr.current0to30, 0);
  const aging31to60Total = ledgers.reduce((acc, curr) => acc + curr.aging31to60, 0);
  const aging61to90Total = ledgers.reduce((acc, curr) => acc + curr.aging61to90, 0);
  const overdue90plusTotal = ledgers.reduce((acc, curr) => acc + curr.overdue90plus, 0);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Banner */}
      <div className="p-4 lg:p-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#161c27]">
              {isArabic ? 'تقارير أرصدة العملاء والتقادم' : 'Customer Balances & Debt Aging Reports'}
            </h1>
            <p className="text-xs text-[#70787d] mt-1">
              {isArabic
                ? 'تحليل أعمار الديون، معدل دوران التحصيل (DSO)، كشوفات الحساب التلقائية ومستويات المخاطر الائتمانية'
                : 'Aging debt buckets, DSO collection analytics, automated Statements of Account, and risk classifications.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={fiscalQuarter}
              onChange={(e) => setFiscalQuarter(e.target.value)}
              className="rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-semibold text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
            >
              <option>Q4 2024 (Current)</option>
              <option>Q3 2024</option>
              <option>Q2 2024</option>
              <option>FY-2024 Annual</option>
            </select>

            <button
              onClick={() => alert('Exporting batch Statement of Accounts (SOA) for all clients...')}
              className="flex items-center gap-2 rounded-lg bg-[#004a60] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#074e64] transition-all cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>{isArabic ? 'تصدير كشف الأرصدة' : 'Export SOA (Excel)'}</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'إجمالي الرصيد القائم' : 'Total Outstanding Debt'}</span>
              <TrendingUp className="h-4 w-4 text-[#004a60]" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-[#161c27]">
              SAR {totalOutstandingAll.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-[#70787d]">
              Collected YTD: SAR 7,130,000
            </div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'الأرصدة الحالية (0-30 يوم)' : 'Current (0-30 Days)'}</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-emerald-700">
              SAR {current0to30Total.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-emerald-700 font-semibold">
              66.0% within credit terms
            </div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'متأخرات (61-90 يوم)' : 'Due (61-90 Days)'}</span>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-amber-600">
              SAR {aging61to90Total.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-amber-700">Action: Soft Dunning Active</div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'مخاطر حرجة (90+ يوم)' : 'Critical (90+ Days)'}</span>
              <ShieldAlert className="h-4 w-4 text-rose-600" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-rose-600">
              SAR {overdue90plusTotal.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-rose-700 font-semibold">
              Legal Dunning Escalation
            </div>
          </div>
        </div>

        {/* Visual Aging Bar Distribution */}
        <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 mb-6 shadow-xs">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-[#161c27]">Aging Buckets Portfolio Distribution</span>
            <span className="text-[#70787d] font-mono">DSO Average: 34.2 Days</span>
          </div>

          {/* Stacked Percentage Bar */}
          <div className="h-3 w-full rounded-full bg-[#f1f3ff] overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${(current0to30Total / totalOutstandingAll) * 100}%` }}
              title="0-30 Days"
            />
            <div
              className="bg-[#004a60] h-full"
              style={{ width: `${(aging31to60Total / totalOutstandingAll) * 100}%` }}
              title="31-60 Days"
            />
            <div
              className="bg-amber-500 h-full"
              style={{ width: `${(aging61to90Total / totalOutstandingAll) * 100}%` }}
              title="61-90 Days"
            />
            <div
              className="bg-rose-500 h-full"
              style={{ width: `${(overdue90plusTotal / totalOutstandingAll) * 100}%` }}
              title="90+ Days"
            />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-2 border-t border-[#f1f3ff] text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-[#40484d]">Current 0-30d (66.0%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#004a60]" />
              <span className="text-[#40484d]">31-60d (11.8%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="text-[#40484d]">61-90d (9.8%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span className="text-[#40484d]">90+ Days (12.4%)</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-[#e3e8f9] py-3">
          <div className="flex items-center gap-2">
            {(['All', 'high', 'moderate', 'low'] as const).map((risk) => (
              <button
                key={risk}
                onClick={() => setRiskFilter(risk)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  riskFilter === risk
                    ? 'bg-[#004a60] text-white'
                    : 'bg-white text-[#40484d] border border-[#e3e8f9] hover:bg-[#f1f3ff]'
                }`}
              >
                {risk === 'All' && (isArabic ? 'جميع الحسابات' : 'All Accounts')}
                {risk === 'high' && (isArabic ? 'عالي المخاطر' : 'High Risk')}
                {risk === 'moderate' && (isArabic ? 'متوسط المخاطر' : 'Moderate')}
                {risk === 'low' && (isArabic ? 'منخفض المخاطر' : 'Low Risk')}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isArabic ? 'بحث في سجلات الحسابات...' : 'Search ledger entity, CRN...'}
              className="w-full rounded-lg border border-[#e3e8f9] bg-white py-1.5 pl-8 pr-3 text-xs text-[#161c27] placeholder-[#70787d] focus:border-[#004a60] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-auto p-4 lg:p-6 pt-2">
        <div className="overflow-hidden rounded-xl border border-[#e3e8f9] bg-white shadow-xs">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="border-b border-[#e3e8f9] bg-[#f9f9ff] text-[11px] font-semibold uppercase text-[#70787d]">
              <tr>
                <th className="p-3">{isArabic ? 'اسم الحساب' : 'Customer Account'}</th>
                <th className="p-3">{isArabic ? 'تصنيف المخاطر' : 'Risk Tier'}</th>
                <th className="p-3 text-right">{isArabic ? 'المفوتر YTD' : 'Invoiced YTD'}</th>
                <th className="p-3 text-right">{isArabic ? '0-30 يوم' : '0-30 Days'}</th>
                <th className="p-3 text-right">{isArabic ? '31-60 يوم' : '31-60 Days'}</th>
                <th className="p-3 text-right">{isArabic ? '61-90 يوم' : '61-90 Days'}</th>
                <th className="p-3 text-right text-rose-700">{isArabic ? '90+ يوم' : '90+ Days'}</th>
                <th className="p-3 text-right">{isArabic ? 'الإجمالي القائم' : 'Total Outstanding'}</th>
                <th className="p-3">{isArabic ? 'استهلاك الحد' : 'Credit Limit'}</th>
                <th className="p-3 text-center">{isArabic ? 'إجراء' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e8f9]">
              {filteredLedgers.map((l) => (
                <tr key={l.id} className="hover:bg-[#f1f3ff]/60 transition-colors">
                  <td className="p-3">
                    <div className="font-semibold text-[#161c27]">{l.name}</div>
                    <div className="text-[10px] text-[#70787d] font-mono">
                      CRN: {l.crn} • TRN: {l.trn}
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        l.riskTier === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : l.riskTier === 'moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {l.riskTier}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono text-[#40484d]">
                    SAR {l.invoicedYtd.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono text-[#161c27]">
                    SAR {l.current0to30.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono text-[#161c27]">
                    SAR {l.aging31to60.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono font-semibold text-amber-600">
                    SAR {l.aging61to90.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-rose-600">
                    SAR {l.overdue90plus.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-[#004a60]">
                    SAR {l.totalOutstanding.toLocaleString()}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-14 rounded-full bg-[#e3e8f9] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            l.creditUtilPercent > 90
                              ? 'bg-rose-600'
                              : l.creditUtilPercent > 60
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${l.creditUtilPercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-[#70787d]">
                        {l.creditUtilPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() =>
                          alert(`Statement of Account (SOA) exported for ${l.name}`)
                        }
                        title="Export Statement of Account"
                        className="rounded p-1 text-[#004a60] hover:bg-[#e8eeff]"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      {l.riskTier === 'high' && (
                        <button
                          onClick={() => onSendDunning(l)}
                          title="Trigger Formal Dunning Notice"
                          className="rounded p-1 text-rose-600 hover:bg-rose-50"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
