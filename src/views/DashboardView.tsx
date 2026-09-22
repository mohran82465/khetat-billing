import React from 'react';
import {
  Hotel,
  Home,
  Building2,
  Key,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Activity,
  FileText,
  AlertCircle,
} from 'lucide-react';
import {
  ACTIVE_HOSPITALITY_SUBSCRIPTIONS,
  HOSPITALITY_PLANS,
  HOSPITALITY_RENEWAL_REMINDERS,
} from '../data/hospitalityData';

interface DashboardViewProps {
  isArabic: boolean;
  onNavigate: (view: string, subTab?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ isArabic, onNavigate }) => {
  const totalKeys = ACTIVE_HOSPITALITY_SUBSCRIPTIONS.reduce((acc, c) => acc + c.keysCount, 0);
  const totalMRR = ACTIVE_HOSPITALITY_SUBSCRIPTIONS.reduce((acc, c) => acc + c.mrr, 0);

  const recentFolios = [
    {
      id: 'FOLIO-2026-9812',
      property: 'The Chedi Hegra Desert Sanctuary (AlUla)',
      guest: 'Royal Protocol / International Delegation',
      room: 'Royal Canyon Villa 08',
      amount: 14850,
      zatcaHash: '3b7f8...99e1',
      status: 'ZATCA Cleared',
      time: '4 mins ago',
    },
    {
      id: 'FOLIO-2026-9811',
      property: 'Dar Al-Taqwa Luxury Suites (Madinah)',
      guest: 'Sheikh Abdulaziz Al-Omran',
      room: 'Executive Suite 502',
      amount: 4200,
      zatcaHash: '8a2c1...44f2',
      status: 'ZATCA Cleared',
      time: '12 mins ago',
    },
    {
      id: 'FOLIO-2026-9810',
      property: 'KAFD Sky Tower Executive Apartments (Riyadh)',
      guest: 'Saudi Aramco Corporate Housing',
      room: 'Penthouse Unit 32B',
      amount: 9500,
      zatcaHash: '7c1d4...11b9',
      status: 'ZATCA Cleared',
      time: '28 mins ago',
    },
    {
      id: 'FOLIO-2026-9809',
      property: 'Durrat Al-Arous Marina Chalets (Jeddah)',
      guest: 'Mohammed Al-Ghamdi',
      room: 'Lagoon Villa 14',
      amount: 6800,
      zatcaHash: '5e9a2...77d3',
      status: 'ZATCA Cleared',
      time: '45 mins ago',
    },
  ];

  const regions = [
    { name: 'Riyadh & Central', properties: 48, keys: 6840, share: '37%' },
    { name: 'Holy Cities (Makkah & Madinah)', properties: 34, keys: 5920, share: '32%' },
    { name: 'AlUla & Red Sea Coast', properties: 22, keys: 1850, share: '10%' },
    { name: 'Jeddah & Western', properties: 26, keys: 2640, share: '14%' },
    { name: 'Eastern Province (Al Khobar)', properties: 12, keys: 1200, share: '7%' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f9f9ff] overflow-y-auto">
      {/* Top Welcome & Context Banner */}
      <div className="bg-gradient-to-r from-[#003647] via-[#004a60] to-[#074e64] text-white p-6 shrink-0 border-b border-[#003647]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-200 border border-emerald-400/30">
                <ShieldCheck className="h-3.5 w-3.5" />
                ZATCA Phase 2 Fatoora Cryptographic Engine Active
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white/80">
                KSA Hospitality OS
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              {isArabic ? 'لوحة تحكم منظومة الضيافة السعودية' : 'Saudi Hospitality Command Hub'}
            </h1>
            <p className="text-xs text-white/80 mt-1 max-w-2xl">
              {isArabic
                ? 'متابعة تشغيل وفوترة الفنادق والفلل والشقق المخدومة في كافة مناطق المملكة مع الامتثال الضريبي الكامل وتكامل أختام هيئة الزكاة والضريبة والجمارك.'
                : 'Operating system for Saudi hospitality. Manage hotels, villas, and apartments with a ZATCA-compliant platform built for scale.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('subscriptions', 'subscriptions_active')}
              className="flex items-center gap-2 rounded-xl bg-white text-[#004a60] px-4 py-2.5 text-xs font-bold shadow-md hover:bg-[#f1f3ff] transition-all"
            >
              <CreditCard className="h-4 w-4" />
              <span>{isArabic ? 'إدارة الاشتراكات' : 'Hospitality Subscriptions'}</span>
            </button>
            <button
              onClick={() => onNavigate('invoices')}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 text-white px-4 py-2.5 text-xs font-bold shadow-md hover:bg-emerald-600 transition-all"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{isArabic ? 'بوابة فواتير ZATCA' : 'ZATCA Invoices'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full space-y-6 flex-1">
        {/* Core KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 */}
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs hover:border-[#004a60]/40 transition-all">
            <div className="flex items-center justify-between text-[#70787d] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">
                {isArabic ? 'المنشآت تحت الإدارة' : 'Properties Managed'}
              </span>
              <div className="h-8 w-8 rounded-lg bg-[#e8eeff] text-[#004a60] flex items-center justify-center">
                <Hotel className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-[#161c27]">142</div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +18.5% YTD
              </span>
            </div>
            <div className="text-[11px] text-[#70787d] mt-2 flex items-center gap-2">
              <span>Hotels: 52</span> • <span>Villas: 48</span> • <span>Aparthotels: 42</span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs hover:border-[#004a60]/40 transition-all">
            <div className="flex items-center justify-between text-[#70787d] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">
                {isArabic ? 'إجمالي الغرف والمفاتيح' : 'Managed Room Keys'}
              </span>
              <div className="h-8 w-8 rounded-lg bg-[#e8eeff] text-[#004a60] flex items-center justify-center">
                <Key className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-[#004a60]">18,450</div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Active Folios
              </span>
            </div>
            <div className="text-[11px] text-[#70787d] mt-2">
              Across 7 key tourism regions in Saudi Arabia
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs hover:border-[#004a60]/40 transition-all">
            <div className="flex items-center justify-between text-[#70787d] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">
                {isArabic ? 'الإيراد الشهري للمنظومة' : 'Platform SaaS MRR'}
              </span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-emerald-700">SAR 1.48M</div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +14.2% MoM
              </span>
            </div>
            <div className="text-[11px] text-[#70787d] mt-2">
              SAR 17.76M Annualized Contract Value (ARR)
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs hover:border-[#004a60]/40 transition-all">
            <div className="flex items-center justify-between text-[#70787d] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">
                {isArabic ? 'نسبة اعتماد ZATCA' : 'ZATCA Clearance Rate'}
              </span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-[#161c27]">99.98%</div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                0 Rejections
              </span>
            </div>
            <div className="text-[11px] text-[#70787d] mt-2">
              42,190 guest folios cryptographically cleared
            </div>
          </div>
        </div>

        {/* Middle Section: Property Types Breakdown + Regional Coverage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Property Types Spectrum */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#161c27]">
                  {isArabic ? 'توزيع منشآت الضيافة المشتركة' : 'Hospitality Segment Distribution'}
                </h3>
                <p className="text-xs text-[#70787d]">
                  {isArabic
                    ? 'فنادق، فلل فاخرة، وشقق مخدومة تعمل بنظام التشغيل والفوترة الموحد'
                    : 'Turnkey operating system tailored to Hotels, Private Villas, and Serviced Apartments.'}
                </p>
              </div>
              <button
                onClick={() => onNavigate('subscriptions', 'subscriptions_plans')}
                className="text-xs font-bold text-[#004a60] hover:underline flex items-center gap-1"
              >
                <span>{isArabic ? 'عرض الباقات' : 'View Plans'}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Hotels */}
              <div className="bg-[#f9f9ff] border border-blue-200/70 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-xs mb-1">
                    <Hotel className="h-4 w-4" />
                    <span>Hotels & Resorts</span>
                  </div>
                  <div className="text-xl font-bold text-[#161c27]">52 Properties</div>
                  <div className="text-xs text-[#70787d] mt-0.5">11,200 Managed Keys</div>
                </div>
                <div className="mt-4 pt-2 border-t border-blue-100 flex items-center justify-between text-xs">
                  <span className="text-[#70787d]">SAR 42/key/mo</span>
                  <span className="font-bold text-blue-800">58% of MRR</span>
                </div>
              </div>

              {/* Luxury Villas */}
              <div className="bg-[#f9f9ff] border border-amber-200/70 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1">
                    <Home className="h-4 w-4" />
                    <span>Villas & Chalets</span>
                  </div>
                  <div className="text-xl font-bold text-[#161c27]">48 Compounds</div>
                  <div className="text-xs text-[#70787d] mt-0.5">850 Luxury Units</div>
                </div>
                <div className="mt-4 pt-2 border-t border-amber-100 flex items-center justify-between text-xs">
                  <span className="text-[#70787d]">Smart IoT Lock sync</span>
                  <span className="font-bold text-amber-800">18% of MRR</span>
                </div>
              </div>

              {/* Serviced Apartments */}
              <div className="bg-[#f9f9ff] border border-emerald-200/70 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-1">
                    <Building2 className="h-4 w-4" />
                    <span>Serviced Apartments</span>
                  </div>
                  <div className="text-xl font-bold text-[#161c27]">42 Aparthotels</div>
                  <div className="text-xs text-[#70787d] mt-0.5">6,400 Residences</div>
                </div>
                <div className="mt-4 pt-2 border-t border-emerald-100 flex items-center justify-between text-xs">
                  <span className="text-[#70787d]">SADAD billing link</span>
                  <span className="font-bold text-emerald-800">24% of MRR</span>
                </div>
              </div>
            </div>

            {/* Quick action bar */}
            <div className="bg-[#004a60]/5 rounded-xl p-3 border border-[#004a60]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-[#004a60] font-semibold">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span>Next Scheduled Batch Run: 01 Oct 2026 (SAR 382,000 automated ZATCA invoicing)</span>
              </div>
              <button
                onClick={() => onNavigate('subscriptions', 'subscriptions_cycles')}
                className="font-bold text-[#004a60] hover:underline"
              >
                Inspect Billing Cycles →
              </button>
            </div>
          </div>

          {/* Regional Footprint */}
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#161c27]">
                {isArabic ? 'التغطية الجغرافية في المملكة' : 'KSA Regional Coverage'}
              </h3>
              <p className="text-xs text-[#70787d]">
                {isArabic ? 'انتشار الغرف والمنشآت الفندقية' : 'Key hospitality hubs & room share'}
              </p>
            </div>

            <div className="space-y-3">
              {regions.map((reg, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#161c27] flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-[#004a60]" />
                      {reg.name}
                    </span>
                    <span className="text-[#70787d]">
                      {reg.properties} props ({reg.keys} keys)
                    </span>
                  </div>
                  <div className="w-full bg-[#f1f3ff] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#004a60] h-1.5 rounded-full" style={{ width: reg.share }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live ZATCA Realtime Folio Invoicing Feed */}
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#161c27]">
                  {isArabic ? 'سجل فواتير النزلاء المعتمدة لحظياً عبر ZATCA' : 'Live Guest Folio & ZATCA Clearance Feed'}
                </h3>
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-[#70787d]">
                {isArabic
                  ? 'إصدار الفواتير الضريبية وتوليد الختم المشفر ورمز QR فور تسجيل المغادرة'
                  : 'Real-time cryptographic folio clearance across front-desk checkouts and banqueting.'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('invoices')}
              className="text-xs font-bold text-[#004a60] hover:underline"
            >
              {isArabic ? 'عرض كل فواتير المبيعات' : 'View All Invoices →'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#e3e8f9] text-[#70787d] uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Folio ID</th>
                  <th className="py-2.5 px-3">Property Name</th>
                  <th className="py-2.5 px-3">Room / Unit</th>
                  <th className="py-2.5 px-3">Guest / Corporate</th>
                  <th className="py-2.5 px-3 text-right">Amount (SAR)</th>
                  <th className="py-2.5 px-3">Cryptographic Stamp</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8f9]">
                {recentFolios.map((folio) => (
                  <tr key={folio.id} className="hover:bg-[#f9f9ff] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#004a60]">{folio.id}</td>
                    <td className="py-3 px-3 font-semibold text-[#161c27]">{folio.property}</td>
                    <td className="py-3 px-3 text-[#40484d]">{folio.room}</td>
                    <td className="py-3 px-3 text-[#40484d]">{folio.guest}</td>
                    <td className="py-3 px-3 font-bold text-[#161c27] text-right">
                      SAR {folio.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {folio.zatcaHash}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        {folio.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
