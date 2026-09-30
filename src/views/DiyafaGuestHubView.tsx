import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Building,
  Search,
  Filter,
  ShieldCheck,
  Award,
  Link2,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  ExternalLink,
  Plus,
  Download,
  CheckCircle2,
  Building2,
  Tag,
  CreditCard,
  FileText,
} from 'lucide-react';

interface DiyafaGuestHubViewProps {
  activeSubTab?: string;
  isArabic: boolean;
  onNavigateToMudabbirGuests?: () => void;
}

interface DiyafaRegisteredGuest {
  id: string;
  name: string;
  nameAr: string;
  phone: string;
  email: string;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'VIP Club';
  tierAr: string;
  loyaltyPoints: number;
  registeredDate: string;
  nationalIdMasked: string;
  verifiedStatus: boolean;
  linkedMudabbirGuestId?: string;
  linkedOperatorName?: string;
  totalMudabbirStays: number;
  status: 'Active' | 'Dormant';
}

interface DiyafaCorporateAccount {
  id: string;
  companyName: string;
  companyNameAr: string;
  crNumber: string;
  taxNumber: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  contractTier: 'Tier-1 Enterprise' | 'Strategic Partner' | 'Standard Corporate';
  contractTierAr: string;
  activeReservations: number;
  creditLimitSar: number;
  paymentTerms: string;
  status: 'Active' | 'Under Review';
}

export const DiyafaGuestHubView: React.FC<DiyafaGuestHubViewProps> = ({
  activeSubTab = 'diyafa_guests',
  isArabic,
  onNavigateToMudabbirGuests,
}) => {
  const [tab, setTab] = useState<'diyafa_guests' | 'diyafa_corporates'>(
    (activeSubTab === 'diyafa_corporates' ? 'diyafa_corporates' : 'diyafa_guests')
  );

  React.useEffect(() => {
    if (activeSubTab === 'diyafa_corporates' || activeSubTab === 'diyafa_guests') {
      setTab(activeSubTab);
    }
  }, [activeSubTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');

  const registeredGuests: DiyafaRegisteredGuest[] = [
    {
      id: 'DYF-90412',
      name: 'Ahmed Mohamed Al-Ghamdi',
      nameAr: 'أحمد محمد الغامدي',
      phone: '+966 50 123 4567',
      email: 'ahmed.mohamed@example.com',
      tier: 'Gold',
      tierAr: 'ذهبي',
      loyaltyPoints: 18400,
      registeredDate: '2025-11-20',
      nationalIdMasked: '1082****73',
      verifiedStatus: true,
      linkedMudabbirGuestId: 'MDB-GST-101',
      linkedOperatorName: 'Al Noor Hotel Group',
      totalMudabbirStays: 3,
      status: 'Active',
    },
    {
      id: 'DYF-88219',
      name: 'Fahad Abdullah Al-Otaibi',
      nameAr: 'فهد عبدالله العتيبي',
      phone: '+966 55 987 6543',
      email: 'fahad.otaibi@khetat-corp.sa',
      tier: 'Platinum',
      tierAr: 'بلاتيني',
      loyaltyPoints: 34500,
      registeredDate: '2025-08-14',
      nationalIdMasked: '1049****34',
      verifiedStatus: true,
      linkedMudabbirGuestId: 'MDB-GST-102',
      linkedOperatorName: 'Nuzul Boutique Hotels & Chalets',
      totalMudabbirStays: 5,
      status: 'Active',
    },
    {
      id: 'DYF-71044',
      name: 'Nouf Saud Al-Mutairi',
      nameAr: 'نوف سعود المطيري',
      phone: '+966 54 321 0987',
      email: 'nouf.mutairi@hospitality.sa',
      tier: 'Silver',
      tierAr: 'فضي',
      loyaltyPoints: 8900,
      registeredDate: '2026-01-10',
      nationalIdMasked: '1066****89',
      verifiedStatus: true,
      linkedMudabbirGuestId: 'MDB-GST-103',
      linkedOperatorName: 'Rawabi Luxury Chalets Co.',
      totalMudabbirStays: 2,
      status: 'Active',
    },
    {
      id: 'DYF-64019',
      name: 'Dr. Ziyad Tariq Al-Husseini',
      nameAr: 'د. زياد طارق الحسيني',
      phone: '+966 56 654 3210',
      email: 'ziyad.husseini@med-sa.org',
      tier: 'Gold',
      tierAr: 'ذهبي',
      loyaltyPoints: 21000,
      registeredDate: '2025-10-05',
      nationalIdMasked: '1033****12',
      verifiedStatus: true,
      linkedMudabbirGuestId: 'MDB-GST-104',
      linkedOperatorName: 'Al Noor Hotel Group',
      totalMudabbirStays: 4,
      status: 'Active',
    },
    {
      id: 'DYF-51203',
      name: 'Sultan Khalid Al-Dosari',
      nameAr: 'سلطان خالد الدوسري',
      phone: '+966 53 112 3344',
      email: 'sultan.d@energy-sa.com',
      tier: 'VIP Club',
      tierAr: 'نادي كبار الشخصيات',
      loyaltyPoints: 52000,
      registeredDate: '2025-04-18',
      nationalIdMasked: '1011****55',
      verifiedStatus: true,
      linkedMudabbirGuestId: 'MDB-GST-105',
      linkedOperatorName: 'Dur Hospitality Partners',
      totalMudabbirStays: 7,
      status: 'Active',
    },
    {
      id: 'DYF-44910',
      name: 'Mariam Adel Al-Subaie',
      nameAr: 'مريم عادل السبيعي',
      phone: '+966 50 887 7665',
      email: 'mariam.subaie@fintech.sa',
      tier: 'Silver',
      tierAr: 'فضي',
      loyaltyPoints: 6400,
      registeredDate: '2026-03-01',
      nationalIdMasked: '1099****33',
      verifiedStatus: true,
      linkedMudabbirGuestId: 'MDB-GST-106',
      linkedOperatorName: 'Shaza Executive Residences',
      totalMudabbirStays: 2,
      status: 'Active',
    },
  ];

  const corporateAccounts: DiyafaCorporateAccount[] = [
    {
      id: 'CORP-01',
      companyName: 'Saudi Aramco Hospitality Services',
      companyNameAr: 'أرامكو السعودية لخدمات الإعاشة والضيافة',
      crNumber: '2050000001',
      taxNumber: '300000000100003',
      contactPerson: 'Eng. Khalid Al-Falih',
      contactEmail: 'corporate-stays@aramco.com',
      contactPhone: '+966 13 874 0000',
      contractTier: 'Strategic Partner',
      contractTierAr: 'شريك استراتيجي',
      activeReservations: 18,
      creditLimitSar: 500000,
      paymentTerms: 'Net 30 Days',
      status: 'Active',
    },
    {
      id: 'CORP-02',
      companyName: 'SABIC Executive Accommodations',
      companyNameAr: 'الشركة السعودية للصناعات الأساسية (سابك)',
      crNumber: '1010000123',
      taxNumber: '300000012300003',
      contactPerson: 'Mansour Al-Ghamdi',
      contactEmail: 'travel-desk@sabic.com',
      contactPhone: '+966 11 225 8000',
      contractTier: 'Tier-1 Enterprise',
      contractTierAr: 'مؤسسة فئة أولى',
      activeReservations: 12,
      creditLimitSar: 350000,
      paymentTerms: 'Net 30 Days',
      status: 'Active',
    },
    {
      id: 'CORP-03',
      companyName: 'STC Solutions Corporate Stay',
      companyNameAr: 'إس تي سي حلول - قطاع الأعمال',
      crNumber: '1010186178',
      taxNumber: '300018617800003',
      contactPerson: 'Reem Al-Qahtani',
      contactEmail: 'business-travel@stc.com.sa',
      contactPhone: '+966 11 455 5555',
      contractTier: 'Tier-1 Enterprise',
      contractTierAr: 'مؤسسة فئة أولى',
      activeReservations: 9,
      creditLimitSar: 250000,
      paymentTerms: 'Net 15 Days',
      status: 'Active',
    },
    {
      id: 'CORP-04',
      companyName: 'Elm Information Security Company',
      companyNameAr: 'شركة علم لأمن المعلومات',
      crNumber: '1010069210',
      taxNumber: '300006921000003',
      contactPerson: 'Tariq Al-Omari',
      contactEmail: 'logistics@elm.sa',
      contactPhone: '+966 11 258 7777',
      contractTier: 'Standard Corporate',
      contractTierAr: 'شركات قياسية',
      activeReservations: 5,
      creditLimitSar: 150000,
      paymentTerms: 'Net 30 Days',
      status: 'Active',
    },
  ];

  const filteredGuests = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return registeredGuests.filter((g) => {
      const matchSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.nameAr.includes(q) ||
        g.phone.includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.id.toLowerCase().includes(q);
      const matchTier = selectedTier === 'all' || g.tier === selectedTier;
      return matchSearch && matchTier;
    });
  }, [registeredGuests, searchQuery, selectedTier]);

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* ARCHITECTURAL CONTEXT BANNER */}
      <div className="bg-gradient-to-r from-[#003848] to-[#004a60] rounded-2xl p-5 text-white shadow-sm overflow-hidden relative">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white tracking-wider uppercase">
                {isArabic ? 'حسابات منصة ضيافة الرسمية' : 'Diyafa Consumer & Corporate Registry'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-emerald-950">
                {isArabic ? 'سجلات معتمدة' : 'Verified Diyafa Profiles'}
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              {isArabic ? 'منصة النزلاء والشركات (ضيافة)' : 'Diyafa Guest & Corporate Accounts'}
            </h1>
            <p className="text-xs text-white/80 leading-relaxed">
              {isArabic
                ? 'تحتوي هذه الصفحة على الحسابات المسجلة رسمياً على تطبيق ومنصة ضيافة (حسابات أفراد وشركات). ضيوف مشغلي مدبّر يبقون منفصلين في «الملفات ← النزلاء» حتى يتم ربطهم هنا لمنع التكرار.'
                : 'Contains registered consumer accounts and corporate entities on Diyafa. Mudabbir operator guests remain separate under Profiles → Guests until explicitly associated, keeping profiles deduplicated.'}
            </p>
          </div>

          {onNavigateToMudabbirGuests && (
            <button
              type="button"
              onClick={onNavigateToMudabbirGuests}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
            >
              <span>{isArabic ? 'إدارة نزلاء مدبّر (Profiles → Guests)' : 'Manage Mudabbir Guests'}</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          )}
        </div>
      </div>

      {/* Sub-tab selection */}
      <div className="flex items-center gap-2 border-b border-[#e3e8f9] pb-3">
        <button
          type="button"
          onClick={() => setTab('diyafa_guests')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'diyafa_guests'
              ? 'bg-[#004a60] text-white shadow-xs'
              : 'text-[#70787d] hover:bg-[#e8eeff] hover:text-[#004a60]'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>{isArabic ? 'النزلاء المسجلون (ضيافة)' : 'Registered Guests (Diyafa)'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {registeredGuests.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab('diyafa_corporates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'diyafa_corporates'
              ? 'bg-[#004a60] text-white shadow-xs'
              : 'text-[#70787d] hover:bg-[#e8eeff] hover:text-[#004a60]'
          }`}
        >
          <Building className="h-4 w-4" />
          <span>{isArabic ? 'الشركات المتعاقدة' : 'Corporate Accounts'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {corporateAccounts.length}
          </span>
        </button>
      </div>

      {/* TAB 1: REGISTERED DIYAFA GUESTS */}
      {tab === 'diyafa_guests' && (
        <div className="space-y-4">
          {/* Search Toolbar */}
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 h-4 w-4 text-[#70787d]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isArabic
                    ? 'بحث بالاسم، رقم الجوال، حساب ضيافة، أو البريد...'
                    : 'Search by name, mobile, Diyafa ID, or email...'
                }
                className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] py-2 pl-9 pr-8 rtl:pr-9 rtl:pl-8 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden"
              >
                <option value="all">{isArabic ? 'كافة المستويات' : 'All Tiers'}</option>
                <option value="Platinum">Platinum</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="VIP Club">VIP Club</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f9f9ff] text-[11px] text-[#70787d] font-semibold border-b border-[#e3e8f9] uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">{isArabic ? 'حساب ضيافة' : 'Diyafa Account'}</th>
                    <th className="px-4 py-3.5">{isArabic ? 'الاسم ومعلومات الاتصال' : 'Name & Contact'}</th>
                    <th className="px-4 py-3.5">{isArabic ? 'مستوى العضوية' : 'Tier & Loyalty'}</th>
                    <th className="px-4 py-3.5">{isArabic ? 'الربط مع نزيل مدبّر' : 'Associated Mudabbir Profile'}</th>
                    <th className="px-4 py-3.5">{isArabic ? 'تاريخ التسجيل' : 'Registered Date'}</th>
                    <th className="px-4 py-3.5 text-center">{isArabic ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8f9]">
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-[#f9f9ff]/70 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center font-mono">
                            DYF
                          </div>
                          <div>
                            <span className="font-mono font-bold text-xs text-[#004a60] block">
                              {guest.id}
                            </span>
                            <span className="text-[10px] text-[#70787d] font-mono">
                              Nafath: {guest.nationalIdMasked}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-bold text-[#161c27]">
                          {isArabic ? guest.nameAr : guest.name}
                        </div>
                        <div className="text-[11px] text-[#70787d] flex items-center gap-2 font-mono">
                          <span>{guest.phone}</span>
                          <span>•</span>
                          <span>{guest.email}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          guest.tier === 'Platinum'
                            ? 'bg-purple-100 text-purple-900 border border-purple-300'
                            : guest.tier === 'Gold'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : guest.tier === 'VIP Club'
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : 'bg-slate-100 text-slate-800 border border-slate-300'
                        }`}>
                          <Award className="h-3 w-3" />
                          <span>{isArabic ? guest.tierAr : guest.tier}</span>
                        </span>
                        <div className="text-[10px] font-semibold text-[#004a60] mt-0.5">
                          {guest.loyaltyPoints.toLocaleString()} {isArabic ? 'نقطة' : 'pts'}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        {guest.linkedMudabbirGuestId ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#e8eeff] text-[#004a60] border border-[#c3cce6]">
                              <Link2 className="h-3 w-3" />
                              <span>{guest.linkedMudabbirGuestId}</span>
                            </span>
                            <div className="text-[11px] text-[#70787d]">
                              {guest.linkedOperatorName} ({guest.totalMudabbirStays} {isArabic ? 'إقامات' : 'stays'})
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#70787d] italic">
                            {isArabic ? 'غير مرتبط بنزيل مدبّر' : 'Standalone account'}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px] text-[#70787d]">
                        {guest.registeredDate}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{isArabic ? 'نشط وموثق' : 'Verified'}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CORPORATES */}
      {tab === 'diyafa_corporates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {corporateAccounts.map((corp) => (
              <div
                key={corp.id}
                className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-2xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#004a60] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#161c27]">
                        {isArabic ? corp.companyNameAr : corp.companyName}
                      </h3>
                      <p className="text-[11px] text-[#70787d] font-mono">
                        CR: {corp.crNumber} • VAT: {corp.taxNumber}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e8eeff] text-[#004a60]">
                    {isArabic ? corp.contractTierAr : corp.contractTier}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#f1f3ff] text-xs">
                  <div>
                    <span className="text-[11px] text-[#70787d] block">{isArabic ? 'مسؤول الحساب' : 'Contact Person'}</span>
                    <span className="font-semibold text-[#161c27]">{corp.contactPerson}</span>
                    <span className="text-[10px] text-[#70787d] block font-mono">{corp.contactPhone}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#70787d] block">{isArabic ? 'حد الائتمان والشروط' : 'Credit & Terms'}</span>
                    <span className="font-bold text-emerald-700">
                      {corp.creditLimitSar.toLocaleString()} SAR
                    </span>
                    <span className="text-[10px] text-[#70787d] block">{corp.paymentTerms}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9] flex items-center justify-between text-xs">
                  <span className="text-[#70787d]">{isArabic ? 'الحجوزات النشطة عبر الفنادق' : 'Active Stays across Hotels'}</span>
                  <span className="font-bold text-[#004a60]">{corp.activeReservations} Bookings</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
