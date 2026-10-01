import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Building2,
  Hotel,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Link2,
  Unlink,
  Eye,
  Plus,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  ChevronDown,
  Download,
  RefreshCw,
  Home,
  Tag,
  ArrowRight,
  UserCheck,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
  Award,
} from 'lucide-react';
import {
  MudabbirGuest,
  INITIAL_MUDABBIR_GUESTS,
  DiyafaAccount,
} from '../data/guestsData';
import { GuestDetailsModal } from '../components/guests/GuestDetailsModal';
import { AssociateDiyafaModal } from '../components/guests/AssociateDiyafaModal';
import { ImportMudabbirGuestModal } from '../components/guests/ImportMudabbirGuestModal';

export type GuestSortField =
  | 'name'
  | 'lastStayDate'
  | 'totalStaysCount'
  | 'totalSpendSar'
  | 'platform'
  | 'diyafaStatus'
  | 'createdDate';

export type SortDirection = 'asc' | 'desc';

interface ProfilesGuestsViewProps {
  isArabic: boolean;
}

export const ProfilesGuestsView: React.FC<ProfilesGuestsViewProps> = ({ isArabic }) => {
  const [guests, setGuests] = useState<MudabbirGuest[]>(INITIAL_MUDABBIR_GUESTS);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'Mudabbir' | 'Diyafa'>('all');
  const [selectedOperator, setSelectedOperator] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedDiyafaStatus, setSelectedDiyafaStatus] = useState<'all' | 'registered' | 'not_registered' | 'match_suggested'>('all');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');

  // Sorting state
  const [sortField, setSortField] = useState<GuestSortField>('lastStayDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleToggleSort = (field: GuestSortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'name' || field === 'platform' ? 'asc' : 'desc');
    }
  };

  // Modals state
  const [selectedGuestForDetails, setSelectedGuestForDetails] = useState<MudabbirGuest | null>(null);
  const [selectedGuestForAssociate, setSelectedGuestForAssociate] = useState<MudabbirGuest | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Distinct lists for filters
  const operatorsList = useMemo(() => {
    const map = new Map<string, { id: string; name: string; nameAr: string }>();
    guests.forEach((g) => {
      if (!map.has(g.operatorName)) {
        map.set(g.operatorName, { id: g.operatorId, name: g.operatorName, nameAr: g.operatorNameAr });
      }
    });
    return Array.from(map.values());
  }, [guests]);

  const propertiesList = useMemo(() => {
    const filteredByOp = selectedOperator === 'all'
      ? guests
      : guests.filter((g) => g.operatorName === selectedOperator);
    const map = new Map<string, { id: string; name: string; nameAr: string }>();
    filteredByOp.forEach((g) => {
      if (!map.has(g.propertyName)) {
        map.set(g.propertyName, { id: g.propertyId, name: g.propertyName, nameAr: g.propertyNameAr });
      }
    });
    return Array.from(map.values());
  }, [guests, selectedOperator]);

  // KPIs
  const stats = useMemo(() => {
    const total = guests.length;
    const mudabbirCount = guests.filter(
      (g) => (g.platform || 'Mudabbir') === 'Mudabbir' || g.platform === 'Both' || !g.id.startsWith('DYF')
    ).length;
    const diyafaCount = guests.filter(
      (g) => g.platform === 'Diyafa' || g.platform === 'Both' || g.diyafaStatus === 'registered' || g.id.startsWith('DYF')
    ).length;
    const registered = guests.filter((g) => g.diyafaStatus === 'registered').length;
    const notRegistered = guests.filter((g) => g.diyafaStatus === 'not_registered').length;
    const matchesAvailable = guests.filter((g) => g.diyafaStatus === 'match_suggested').length;
    const linkedRate = total > 0 ? Math.round((registered / total) * 100) : 0;
    return { total, mudabbirCount, diyafaCount, registered, notRegistered, matchesAvailable, linkedRate };
  }, [guests]);

  // Filtered & Sorted Guests (Mudabbir & Diyafa unified with multi-criteria sort)
  const sortedAndFilteredGuests = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const filtered = guests.filter((g) => {
      const matchesSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.nameAr.includes(q) ||
        g.phone.includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.nationalIdOrPassport.toLowerCase().includes(q) ||
        g.operatorName.toLowerCase().includes(q) ||
        g.propertyName.toLowerCase().includes(q) ||
        (g.platform && g.platform.toLowerCase().includes(q)) ||
        (g.source && g.source.toLowerCase().includes(q));

      const guestPlatform = g.platform || (g.id.startsWith('DYF') ? 'Diyafa' : 'Mudabbir');
      const matchesPlatform =
        selectedPlatform === 'all' ||
        (selectedPlatform === 'Mudabbir' && (guestPlatform === 'Mudabbir' || guestPlatform === 'Both' || !g.id.startsWith('DYF'))) ||
        (selectedPlatform === 'Diyafa' && (guestPlatform === 'Diyafa' || guestPlatform === 'Both' || g.diyafaStatus === 'registered' || g.id.startsWith('DYF')));

      const matchesOperator = selectedOperator === 'all' || g.operatorName === selectedOperator;
      const matchesProperty = selectedProperty === 'all' || g.propertyName === selectedProperty;
      const matchesStatus = selectedDiyafaStatus === 'all' || g.diyafaStatus === selectedDiyafaStatus;
      const matchesType = selectedPropertyType === 'all' || g.propertyType === selectedPropertyType;

      return matchesSearch && matchesPlatform && matchesOperator && matchesProperty && matchesStatus && matchesType;
    });

    // Apply Sorting
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name': {
          const nameA = isArabic ? a.nameAr || a.name : a.name;
          const nameB = isArabic ? b.nameAr || b.name : b.name;
          comparison = nameA.localeCompare(nameB, isArabic ? 'ar' : 'en');
          break;
        }
        case 'lastStayDate':
          comparison = new Date(a.lastStayDate).getTime() - new Date(b.lastStayDate).getTime();
          break;
        case 'totalStaysCount':
          comparison = a.totalStaysCount - b.totalStaysCount;
          break;
        case 'totalSpendSar':
          comparison = a.totalSpendSar - b.totalSpendSar;
          break;
        case 'platform': {
          const platA = a.platform || (a.id.startsWith('DYF') ? 'Diyafa' : 'Mudabbir');
          const platB = b.platform || (b.id.startsWith('DYF') ? 'Diyafa' : 'Mudabbir');
          comparison = platA.localeCompare(platB);
          break;
        }
        case 'diyafaStatus': {
          const rankMap: Record<string, number> = {
            registered: 3,
            match_suggested: 2,
            not_registered: 1,
          };
          comparison = (rankMap[a.diyafaStatus] || 0) - (rankMap[b.diyafaStatus] || 0);
          break;
        }
        case 'createdDate':
          comparison = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [
    guests,
    searchQuery,
    selectedPlatform,
    selectedOperator,
    selectedProperty,
    selectedDiyafaStatus,
    selectedPropertyType,
    sortField,
    sortDirection,
    isArabic,
  ]);

  // Handlers
  const handleAssociateAccount = (guestId: string, diyafaAccount: DiyafaAccount) => {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === guestId
          ? {
              ...g,
              diyafaStatus: 'registered',
              diyafaAccount,
              potentialMatch: undefined,
            }
          : g
      )
    );
    const guestObj = guests.find((g) => g.id === guestId);
    showToast(
      isArabic
        ? `تم ربط النزيل "${guestObj?.nameAr || guestObj?.name}" بحساب ضيافة ${diyafaAccount.accountId} بنجاح. تم منع تكرار السجل.`
        : `Guest "${guestObj?.name}" associated with Diyafa ${diyafaAccount.accountId}. Duplicate prevented.`
    );
  };

  const handleUnlinkAccount = (guestId: string) => {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === guestId
          ? {
              ...g,
              diyafaStatus: 'not_registered',
              diyafaAccount: undefined,
            }
          : g
      )
    );
    if (selectedGuestForDetails?.id === guestId) {
      setSelectedGuestForDetails((prev) =>
        prev ? { ...prev, diyafaStatus: 'not_registered', diyafaAccount: undefined } : null
      );
    }
    showToast(
      isArabic
        ? 'تم فك ارتباط النزيل عن حساب ضيافة بنجاح.'
        : 'Guest account unlinked from Diyafa successfully.'
    );
  };

  const handleAddGuest = (newGuest: MudabbirGuest) => {
    setGuests((prev) => [newGuest, ...prev]);
    showToast(
      isArabic
        ? `تم استيراد النزيل "${newGuest.name}" من مشغل مدبّر بنجاح (غير مسجل في ضيافة).`
        : `Guest "${newGuest.name}" imported from Mudabbir operator (Not registered on Diyafa).`
    );
  };

  const handleAutoResolveAllMatches = () => {
    const matchCount = guests.filter((g) => g.diyafaStatus === 'match_suggested').length;
    if (matchCount === 0) {
      showToast(isArabic ? 'لا توجد تطابقات معلقة حالياً' : 'No pending matches available');
      return;
    }

    setGuests((prev) =>
      prev.map((g) => {
        if (g.diyafaStatus === 'match_suggested' && g.potentialMatch) {
          return {
            ...g,
            diyafaStatus: 'registered',
            diyafaAccount: {
              accountId: g.potentialMatch.diyafaAccountId,
              membershipTier: g.potentialMatch.membershipTier,
              membershipTierAr: g.potentialMatch.membershipTier === 'Gold' ? 'ذهبي' : 'فضي',
              linkedAt: new Date().toISOString().split('T')[0],
              registeredEmail: g.potentialMatch.matchedEmail,
              registeredPhone: g.potentialMatch.matchedPhone,
              loyaltyPoints: 12500,
              autoLinked: true,
            },
            potentialMatch: undefined,
          };
        }
        return g;
      })
    );

    showToast(
      isArabic
        ? `تم توحيد وربط ${matchCount} سجلات مع حسابات ضيافة المطابقة بنجاح دون إنشاء حسابات مكررة!`
        : `Successfully linked ${matchCount} matching profiles with Diyafa accounts, preventing duplicates!`
    );
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'ID,Guest Name,Phone,Email,Platform,Source,Operator,Property,Total Stays,Spend SAR,Last Stay,Diyafa Status,Diyafa Account',
        ...sortedAndFilteredGuests.map(
          (g) =>
            `"${g.id}","${g.name}","${g.phone}","${g.email}","${g.platform || (g.id.startsWith('DYF') ? 'Diyafa' : 'Mudabbir')}","${g.source}","${g.operatorName}","${g.propertyName}","${g.totalStaysCount}","${g.totalSpendSar}","${g.lastStayDate}","${g.diyafaStatus}","${g.diyafaAccount?.accountId || 'N/A'}"`
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `khetat_guests_unified_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold px-1.5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ARCHITECTURAL BUSINESS CONTEXT BANNER */}
      <div className="bg-gradient-to-r from-[#004a60] to-[#075f7a] rounded-2xl p-5 text-white shadow-sm overflow-hidden relative">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white tracking-wider uppercase">
                {isArabic ? 'ملفات النزلاء المركزية في خطط' : 'Khetat Central Profile Hub'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-900">
                Mudabbir + Diyafa
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              {isArabic ? 'سجل النزلاء الموحد (Guests Directory)' : 'Unified Guests Directory'}
            </h1>
            <p className="text-xs text-white/80 leading-relaxed">
              {isArabic
                ? 'دليل موحد وشامل لجميع النزلاء الواردين من مشغلي مدبّر (الفنادق والشاليهات) والنزلاء المسجلين عبر منصة وتطبيق ضيافة، مع أدوات الربط والفرز المتقدم وفق معايير متعددة ومنع تكرار السجلات.'
                : 'Consolidated guest directory listing profiles from both Mudabbir operators and the Diyafa platform, featuring advanced sorting criteria, account matching, and deduplication.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {stats.matchesAvailable > 0 && (
              <button
                type="button"
                onClick={handleAutoResolveAllMatches}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  {isArabic
                    ? `ربط التطابقات التلقائية (${stats.matchesAvailable})`
                    : `Link Matches (${stats.matchesAvailable})`}
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white text-[#004a60] hover:bg-[#f1f3ff] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? 'إضافة / استيراد نزيل' : '+ Add / Import Guest'}</span>
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Export CSV"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{isArabic ? 'تصدير' : 'Export'}</span>
            </button>
          </div>
        </div>

        {/* INTERACTIVE ARCHITECTURE & RELATIONSHIP TREE COLLAPSIBLE */}
        <div className="mt-5 pt-4 border-t border-white/15">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-amber-300" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {isArabic ? 'هيكل علاقات المنصة المركزية (Khetat Relationship Hierarchy)' : 'Khetat Platform Architecture & Guest Isolation'}
              </span>
            </div>
            <span className="text-[10px] text-white/70">
              {isArabic ? 'مدبّر ↔ خطط ↔ ضيافة' : 'Mudabbir ↔ Khetat ↔ Diyafa'}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3 text-xs">
            {/* Tree Diagram Box */}
            <div className="lg:col-span-2 bg-black/25 backdrop-blur-xs rounded-xl p-3.5 border border-white/10 font-mono text-[11px] leading-relaxed">
              <div className="text-amber-300 font-bold mb-1">
                Khetat Central Architecture:
              </div>
              <div className="text-white/90">
                <span className="text-emerald-300 font-bold">Khetat</span><br/>
                │<br/>
                └── <span className="text-blue-300 font-bold">Profiles</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;│<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;├── <span className="text-amber-200 font-semibold">Operators</span> (Organizations → Properties → Contacts)<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;│<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;└── <span className="text-purple-200 font-bold">Guests</span> (Guests coming from Mudabbir → Operator &amp; Property)
              </div>
            </div>

            {/* Example Card Box */}
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3.5 border border-white/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    {isArabic ? 'حالة عملية: أحمد محمد' : 'Concrete Isolation Case'}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-200 text-[9px] font-mono">
                    Not Registered
                  </span>
                </div>
                <div className="space-y-0.5 text-[11px] text-white/90 font-mono">
                  <div>Guest: <span className="text-white font-bold">Ahmed Mohamed</span></div>
                  <div>Source: <span className="text-amber-200">Mudabbir PMS</span></div>
                  <div>Operator: Al Noor Hotel</div>
                  <div>Property: Al Noor Riyadh</div>
                  <div className="text-rose-200">Diyafa Account: Not Registered</div>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-white/70">
                  {isArabic ? 'منع الازدواجية تلقائياً' : 'Duplicate prevention active'}
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('Ahmed Mohamed')}
                  className="px-2 py-0.5 rounded bg-white text-[#004a60] text-[10px] font-bold hover:bg-white/90 cursor-pointer transition-colors"
                >
                  {isArabic ? 'عرض السجل' : 'Find Ahmed'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Guests */}
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#70787d]">
              {isArabic ? 'إجمالي النزلاء (مدبّر + ضيافة)' : 'Total Guests Directory'}
            </span>
            <div className="p-2 rounded-xl bg-[#e8eeff] text-[#004a60]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#161c27]">
              {stats.total.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-[#70787d]">
              {isArabic ? 'سجل موحد' : 'profiles'}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#f1f3ff] flex items-center justify-between text-[11px] text-[#70787d]">
            <span>{isArabic ? `${stats.mudabbirCount} مدبّر • ${stats.diyafaCount} ضيافة` : `${stats.mudabbirCount} Mudabbir • ${stats.diyafaCount} Diyafa`}</span>
            <span className="font-semibold text-[#004a60]">{propertiesList.length} Properties</span>
          </div>
        </div>

        {/* Card 2: Registered on Diyafa (Linked) */}
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800">
              {isArabic ? 'مرتبطون بحساب ضيافة' : 'Registered on Diyafa (Linked)'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-700">
              {stats.registered.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {stats.linkedRate}%
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#f1f3ff] text-[11px] text-[#70787d]">
            {isArabic ? 'ملف موحد - بدون ازدواجية' : 'Unified identity • 0 duplicates'}
          </div>
        </div>

        {/* Card 3: Not Registered on Diyafa (Mudabbir Only) */}
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#70787d]">
              {isArabic ? 'غير مسجلين في ضيافة' : 'Not Registered on Diyafa'}
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#161c27]">
              {stats.notRegistered.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
              {isArabic ? 'مدبّر فقط' : 'Mudabbir Only'}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#f1f3ff] text-[11px] text-[#70787d]">
            {isArabic ? 'معزول تماماً عن حسابات المنصة' : 'Kept strictly segregated'}
          </div>
        </div>

        {/* Card 4: Potential Matches Detected */}
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-800">
              {isArabic ? 'تطابقات محتملة جاهزة للربط' : 'Potential Matches Found'}
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-blue-700">
              {stats.matchesAvailable.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full">
              {isArabic ? 'إجراء متاح' : 'Actionable'}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#f1f3ff] text-[11px] text-blue-700 flex items-center justify-between">
            <span>{isArabic ? 'تطابق برقم الجوال والهوية' : 'Match on phone & ID'}</span>
            {stats.matchesAvailable > 0 && (
              <button
                type="button"
                onClick={handleAutoResolveAllMatches}
                className="font-bold underline cursor-pointer"
              >
                {isArabic ? 'ربط الكل' : 'Link all'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PLATFORM SOURCE SELECTOR TABS & SEARCH */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs space-y-3">
        {/* Top bar: Source filter tabs + Search input */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Source Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#f1f3ff] rounded-xl border border-[#e3e8f9] w-fit">
            <button
              type="button"
              onClick={() => setSelectedPlatform('all')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedPlatform === 'all'
                  ? 'bg-[#004a60] text-white shadow-xs'
                  : 'text-[#50585e] hover:text-[#004a60] hover:bg-white/60'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>{isArabic ? 'كافة النزلاء (الكل)' : 'All Guests'}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                  selectedPlatform === 'all' ? 'bg-white/20 text-white' : 'bg-[#e8eeff] text-[#004a60]'
                }`}
              >
                {guests.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlatform('Mudabbir')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedPlatform === 'Mudabbir'
                  ? 'bg-[#004a60] text-white shadow-xs'
                  : 'text-[#50585e] hover:text-[#004a60] hover:bg-white/60'
              }`}
            >
              <Building2 className="h-3.5 w-3.5 text-sky-500" />
              <span>{isArabic ? 'مشغلو مدبّر' : 'Mudabbir Operators'}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                  selectedPlatform === 'Mudabbir' ? 'bg-white/20 text-white' : 'bg-[#e8eeff] text-[#004a60]'
                }`}
              >
                {stats.mudabbirCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlatform('Diyafa')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedPlatform === 'Diyafa'
                  ? 'bg-[#004a60] text-white shadow-xs'
                  : 'text-[#50585e] hover:text-[#004a60] hover:bg-white/60'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>{isArabic ? 'منصة ضيافة' : 'Diyafa Platform'}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                  selectedPlatform === 'Diyafa' ? 'bg-white/20 text-white' : 'bg-[#e8eeff] text-[#004a60]'
                }`}
              >
                {stats.diyafaCount}
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 h-4 w-4 text-[#70787d]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isArabic
                  ? 'بحث باسم النزيل، رقم الجوال، البريد، رقم الهوية، المشغل، أو العقار...'
                  : 'Search by guest name, phone, email, national ID, operator, or property...'
              }
              className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] py-2 pl-9 pr-8 rtl:pr-9 rtl:pl-8 text-xs text-[#161c27] placeholder:text-[#70787d] focus:bg-white focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 rtl:left-2.5 rtl:right-auto top-1/2 -translate-y-1/2 text-xs text-[#70787d] hover:text-[#161c27] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Reset */}
          {(selectedPlatform !== 'all' ||
            selectedOperator !== 'all' ||
            selectedProperty !== 'all' ||
            selectedDiyafaStatus !== 'all' ||
            selectedPropertyType !== 'all' ||
            searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedPlatform('all');
                setSelectedOperator('all');
                setSelectedProperty('all');
                setSelectedDiyafaStatus('all');
                setSelectedPropertyType('all');
              }}
              className="text-xs text-[#004a60] hover:underline font-semibold shrink-0 cursor-pointer self-end lg:self-center"
            >
              {isArabic ? 'إعادة ضبط التصفية' : 'Reset filters'}
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-[#f1f3ff]">
          {/* Operator Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#70787d] mb-1">
              {isArabic ? 'المشغّل (Operator)' : 'Operator'}
            </label>
            <select
              value={selectedOperator}
              onChange={(e) => {
                setSelectedOperator(e.target.value);
                setSelectedProperty('all');
              }}
              className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-1.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden transition-all"
            >
              <option value="all">{isArabic ? 'كافة المشغلين (All Operators)' : 'All Operators'}</option>
              {operatorsList.map((op) => (
                <option key={op.id} value={op.name}>
                  {isArabic ? op.nameAr : op.name}
                </option>
              ))}
            </select>
          </div>

          {/* Property Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#70787d] mb-1">
              {isArabic ? 'العقار (Property)' : 'Property'}
            </label>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-1.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden transition-all"
            >
              <option value="all">{isArabic ? 'كافة العقارات والفنادق' : 'All Properties'}</option>
              {propertiesList.map((prop) => (
                <option key={prop.id} value={prop.name}>
                  {isArabic ? prop.nameAr : prop.name}
                </option>
              ))}
            </select>
          </div>

          {/* Diyafa Account Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#70787d] mb-1">
              {isArabic ? 'حالة حساب ضيافة (Diyafa Status)' : 'Diyafa Account Status'}
            </label>
            <select
              value={selectedDiyafaStatus}
              onChange={(e) => setSelectedDiyafaStatus(e.target.value as any)}
              className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-1.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden transition-all font-semibold"
            >
              <option value="all">{isArabic ? 'كافة الحالات' : 'All Account Statuses'}</option>
              <option value="not_registered">
                {isArabic ? 'غير مسجل في ضيافة (مدبّر فقط)' : 'Not Registered (Mudabbir Only)'}
              </option>
              <option value="registered">
                {isArabic ? 'مرتبط بحساب ضيافة (معتمد)' : 'Registered on Diyafa (Linked)'}
              </option>
              <option value="match_suggested">
                {isArabic ? 'تطابق متاح للربط (Match Found)' : 'Match Found (Actionable)'}
              </option>
            </select>
          </div>

          {/* Property Type Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#70787d] mb-1">
              {isArabic ? 'نوع العقار' : 'Property Type'}
            </label>
            <select
              value={selectedPropertyType}
              onChange={(e) => setSelectedPropertyType(e.target.value)}
              className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-1.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden transition-all"
            >
              <option value="all">{isArabic ? 'كافة الأنواع' : 'All Types'}</option>
              <option value="Hotel">{isArabic ? 'فنادق' : 'Hotels'}</option>
              <option value="Chalet">{isArabic ? 'شاليهات' : 'Chalets'}</option>
              <option value="Hotel Apartment">{isArabic ? 'شقق فندقية' : 'Hotel Apartments'}</option>
              <option value="Resort">{isArabic ? 'منتجعات' : 'Resorts'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* DEDICATED SORTING CRITERIA CONTROLS BAR */}
      <div className="bg-[#f9f9ff] border border-[#e3e8f9] rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 text-[#004a60] font-bold shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
            <span>{isArabic ? 'معيار الفرز (Sort Criteria):' : 'Sort Criteria:'}</span>
          </div>

          {/* Quick Sort Options */}
          <div className="flex items-center flex-wrap gap-1.5">
            {[
              { field: 'lastStayDate' as GuestSortField, label: isArabic ? 'الأحدث إقامة' : 'Recent Stay' },
              { field: 'totalStaysCount' as GuestSortField, label: isArabic ? 'الأكثر إقامة' : 'Most Stays' },
              { field: 'totalSpendSar' as GuestSortField, label: isArabic ? 'الأعلى إنفاقاً' : 'Highest Spend' },
              { field: 'name' as GuestSortField, label: isArabic ? 'الاسم أبجدياً' : 'Name (A-Z)' },
              { field: 'platform' as GuestSortField, label: isArabic ? 'المنصة والمصدر' : 'Platform & Source' },
              { field: 'diyafaStatus' as GuestSortField, label: isArabic ? 'حالة ضيافة' : 'Diyafa Status' },
            ].map((item) => {
              const isSelected = sortField === item.field;
              return (
                <button
                  key={item.field}
                  type="button"
                  onClick={() => handleToggleSort(item.field)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#004a60] text-white shadow-2xs font-bold'
                      : 'bg-white text-[#50585e] border border-[#e3e8f9] hover:bg-[#f1f3ff] hover:text-[#004a60]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isSelected && (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Direction Toggle & Count Indicator */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xs text-[#70787d] font-medium">
            {isArabic
              ? `${sortedAndFilteredGuests.length} نزيل متاح`
              : `${sortedAndFilteredGuests.length} guests sorted`}
          </span>
          <button
            type="button"
            onClick={() => setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#c3cce6] hover:bg-[#f1f3ff] text-[#004a60] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title={isArabic ? 'عكس اتجاه الفرز' : 'Toggle Ascending/Descending'}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>
              {sortDirection === 'asc'
                ? isArabic ? 'تصاعدي (A-Z)' : 'Ascending'
                : isArabic ? 'تنازلي (Z-A)' : 'Descending'}
            </span>
          </button>
        </div>
      </div>

      {/* ADMIN GUESTS TABLE */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f9f9ff] text-[11px] text-[#70787d] font-semibold border-b border-[#e3e8f9] uppercase tracking-wider select-none">
              <tr>
                {/* 1. Guest Name */}
                <th
                  onClick={() => handleToggleSort('name')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-[#e8eeff]/50 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{isArabic ? 'اسم النزيل' : 'Guest Name'}</span>
                    {sortField === 'name' ? (
                      sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-[#004a60]" /> : <ArrowDown className="h-3 w-3 text-[#004a60]" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 text-[#70787d]/40" />
                    )}
                  </div>
                </th>

                {/* 2. Contact */}
                <th className="px-4 py-3.5">{isArabic ? 'الجوال والبريد' : 'Contact'}</th>

                {/* 3. Platform & Source */}
                <th
                  onClick={() => handleToggleSort('platform')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-[#e8eeff]/50 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{isArabic ? 'المنصة والمصدر' : 'Platform & Source'}</span>
                    {sortField === 'platform' ? (
                      sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-[#004a60]" /> : <ArrowDown className="h-3 w-3 text-[#004a60]" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 text-[#70787d]/40" />
                    )}
                  </div>
                </th>

                {/* 4. Operator */}
                <th className="px-4 py-3.5">{isArabic ? 'المشغّل (Operator)' : 'Operator'}</th>

                {/* 5. Property */}
                <th className="px-4 py-3.5">{isArabic ? 'العقار (Property)' : 'Property'}</th>

                {/* 6. Stays & Spend */}
                <th
                  onClick={() => handleToggleSort('totalStaysCount')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-[#e8eeff]/50 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{isArabic ? 'الإقامات والإنفاق' : 'Stays & Spend'}</span>
                    {sortField === 'totalStaysCount' || sortField === 'totalSpendSar' ? (
                      sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-[#004a60]" /> : <ArrowDown className="h-3 w-3 text-[#004a60]" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 text-[#70787d]/40" />
                    )}
                  </div>
                </th>

                {/* 7. Last Stay */}
                <th
                  onClick={() => handleToggleSort('lastStayDate')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-[#e8eeff]/50 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{isArabic ? 'آخر إقامة' : 'Last Stay'}</span>
                    {sortField === 'lastStayDate' ? (
                      sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-[#004a60]" /> : <ArrowDown className="h-3 w-3 text-[#004a60]" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 text-[#70787d]/40" />
                    )}
                  </div>
                </th>

                {/* 8. Diyafa Status */}
                <th
                  onClick={() => handleToggleSort('diyafaStatus')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-[#e8eeff]/50 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{isArabic ? 'حالة حساب ضيافة' : 'Diyafa Status'}</span>
                    {sortField === 'diyafaStatus' ? (
                      sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-[#004a60]" /> : <ArrowDown className="h-3 w-3 text-[#004a60]" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 text-[#70787d]/40" />
                    )}
                  </div>
                </th>

                {/* 9. Created / Registered */}
                <th
                  onClick={() => handleToggleSort('createdDate')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-[#e8eeff]/50 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{isArabic ? 'تاريخ التسجيل' : 'Registered Date'}</span>
                    {sortField === 'createdDate' ? (
                      sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-[#004a60]" /> : <ArrowDown className="h-3 w-3 text-[#004a60]" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 text-[#70787d]/40" />
                    )}
                  </div>
                </th>

                {/* 10. Actions */}
                <th className="px-4 py-3.5 text-center">{isArabic ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e8f9]">
              {sortedAndFilteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center text-[#70787d]">
                    <Users className="h-10 w-10 text-[#70787d]/40 mx-auto mb-2" />
                    <p className="font-bold text-sm text-[#161c27]">
                      {isArabic ? 'لا توجد سجلات نزلاء مطابقة' : 'No guest records found'}
                    </p>
                    <p className="text-xs text-[#70787d] mt-1 max-w-sm mx-auto">
                      {isArabic
                        ? 'جرّب تعديل معايير البحث أو تصفية المنصة والمشغل.'
                        : 'Try adjusting your search criteria or platform/operator selection.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsImportModalOpen(true)}
                      className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#004a60] text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{isArabic ? 'إضافة / استيراد نزيل' : 'Add / Import Guest'}</span>
                    </button>
                  </td>
                </tr>
              ) : (
                sortedAndFilteredGuests.map((guest) => {
                  const isRegistered = guest.diyafaStatus === 'registered';
                  const isMatchSuggested = guest.diyafaStatus === 'match_suggested';
                  const isDiyafaOrigin = guest.platform === 'Diyafa' || guest.id.startsWith('DYF');

                  return (
                    <tr
                      key={guest.id}
                      className="hover:bg-[#f9f9ff]/70 transition-colors group"
                    >
                      {/* 1. Guest Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`h-8 w-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                              isDiyafaOrigin
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-[#e8eeff] text-[#004a60]'
                            }`}
                          >
                            {guest.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#161c27]">
                                {isArabic ? guest.nameAr : guest.name}
                              </span>
                              {guest.vipStatus && (
                                <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                  VIP
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#70787d] block font-mono">
                              ID: {guest.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Phone & Email */}
                      <td className="px-4 py-3.5">
                        <div className="font-mono text-xs text-[#161c27]">{guest.phone}</div>
                        <div className="text-[11px] text-[#70787d] truncate max-w-[150px]" title={guest.email}>
                          {guest.email}
                        </div>
                      </td>

                      {/* 3. Platform & Source */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="space-y-1">
                          {isDiyafaOrigin ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <UserCheck className="h-3 w-3 text-emerald-700" />
                              <span>{isArabic ? 'ضيافة (منصة)' : 'Diyafa Platform'}</span>
                            </span>
                          ) : isRegistered ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                              <Link2 className="h-3 w-3 text-purple-700" />
                              <span>{isArabic ? 'مدبّر ↔ ضيافة (مرتبط)' : 'Mudabbir ↔ Diyafa'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                              <Building2 className="h-3 w-3 text-sky-700" />
                              <span>{isArabic ? 'مشغل مدبّر' : 'Mudabbir Operator'}</span>
                            </span>
                          )}
                          <div className="text-[10px] text-[#70787d] truncate max-w-[140px]" title={isArabic ? guest.sourceAr : guest.source}>
                            {isArabic ? guest.sourceAr : guest.source}
                          </div>
                        </div>
                      </td>

                      {/* 4. Operator */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-[#161c27]">
                          {isArabic ? guest.operatorNameAr : guest.operatorName}
                        </div>
                        <span className="text-[10px] text-[#70787d] font-mono">{guest.operatorId}</span>
                      </td>

                      {/* 5. Property */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-[#161c27]">
                          {isArabic ? guest.propertyNameAr : guest.propertyName}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#70787d]">
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 font-medium">
                            {isArabic ? guest.propertyTypeAr : guest.propertyType}
                          </span>
                          <span>•</span>
                          <span>{isArabic ? guest.cityAr : guest.city}</span>
                        </div>
                      </td>

                      {/* 6. Stays & Spend */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-bold text-xs text-[#161c27] flex items-center gap-1">
                          <span className="text-[#004a60] bg-[#e8eeff] px-1.5 py-0.2 rounded-full font-mono text-[10px]">
                            {guest.totalStaysCount} {isArabic ? 'إقامة' : 'stays'}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-emerald-800 font-semibold mt-0.5">
                          {guest.totalSpendSar.toLocaleString()} SAR
                        </div>
                      </td>

                      {/* 7. Last Stay */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-mono text-xs font-semibold text-[#161c27]">
                          {guest.lastStayDate}
                        </div>
                        <div className="text-[10px] text-[#70787d] truncate max-w-[120px]" title={guest.lastStayUnit}>
                          {guest.lastStayUnit}
                        </div>
                      </td>

                      {/* 8. Diyafa Account Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {isRegistered && guest.diyafaAccount && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                              <span>{isArabic ? 'مسجل في ضيافة' : 'Registered on Diyafa'}</span>
                            </span>
                            <div className="text-[10px] font-mono text-emerald-900 mt-0.5">
                              {guest.diyafaAccount.accountId} • {guest.diyafaAccount.membershipTier}
                            </div>
                          </div>
                        )}

                        {isMatchSuggested && guest.potentialMatch && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 animate-pulse">
                              <Sparkles className="h-3.5 w-3.5 text-blue-700" />
                              <span>{isArabic ? 'تطابق متاح (Match)' : 'Match Found (96%)'}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedGuestForAssociate(guest)}
                              className="text-[10px] text-blue-800 hover:text-blue-950 font-bold block mt-0.5 underline cursor-pointer"
                            >
                              {isArabic ? 'ربط الحساب الآن' : 'Link to Account'}
                            </button>
                          </div>
                        )}

                        {!isRegistered && !isMatchSuggested && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                              <AlertCircle className="h-3.5 w-3.5 text-slate-500" />
                              <span>{isArabic ? 'غير مسجل في ضيافة' : 'Not Registered'}</span>
                            </span>
                            <span className="text-[10px] text-[#70787d] block mt-0.5">
                              {isArabic ? 'مدبّر فقط' : 'Mudabbir Only'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* 9. Created / Registered Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-[11px] font-mono text-[#70787d]">
                        {guest.createdDate}
                      </td>

                      {/* 10. Actions */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Profile */}
                          <button
                            type="button"
                            onClick={() => setSelectedGuestForDetails(guest)}
                            className="p-1.5 rounded-lg border border-[#c3cce6] hover:bg-[#f1f3ff] text-[#004a60] transition-colors cursor-pointer"
                            title={isArabic ? 'عرض التفاصيل' : 'View Profile'}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Link to Diyafa */}
                          {!isRegistered ? (
                            <button
                              type="button"
                              onClick={() => setSelectedGuestForAssociate(guest)}
                              className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                                isMatchSuggested
                                  ? 'border-blue-400 bg-blue-50 text-blue-800 hover:bg-blue-100'
                                  : 'border-[#c3cce6] hover:bg-[#f1f3ff] text-[#70787d] hover:text-[#004a60]'
                              }`}
                              title={isArabic ? 'ربط بحساب ضيافة' : 'Associate with Diyafa'}
                            >
                              <Link2 className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUnlinkAccount(guest.id)}
                              className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                              title={isArabic ? 'فك الربط عن ضيافة' : 'Unlink Diyafa Account'}
                            >
                              <Unlink className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Results summary footer */}
        <div className="p-4 border-t border-[#e3e8f9] bg-[#f9f9ff] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[#70787d]">
          <div>
            {isArabic
              ? `عرض ${sortedAndFilteredGuests.length} من إجمالي ${guests.length} نزيل مسجل في منصة خطط (مدبّر + ضيافة)`
              : `Showing ${sortedAndFilteredGuests.length} of ${guests.length} total guest records (Mudabbir + Diyafa)`}
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              {stats.registered} {isArabic ? 'مرتبط بضيافة' : 'Diyafa Linked'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-sky-500"></span>
              {stats.mudabbirCount} {isArabic ? 'مشغلو مدبّر' : 'Mudabbir Operators'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-slate-400"></span>
              {stats.notRegistered} {isArabic ? 'غير مسجل بضيافة' : 'Unlinked Mudabbir'}
            </span>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <GuestDetailsModal
        isOpen={!!selectedGuestForDetails}
        onClose={() => setSelectedGuestForDetails(null)}
        guest={selectedGuestForDetails}
        onOpenAssociate={(g) => {
          setSelectedGuestForDetails(null);
          setSelectedGuestForAssociate(g);
        }}
        onUnlink={handleUnlinkAccount}
        isArabic={isArabic}
      />

      <AssociateDiyafaModal
        isOpen={!!selectedGuestForAssociate}
        onClose={() => setSelectedGuestForAssociate(null)}
        guest={selectedGuestForAssociate}
        onAssociate={handleAssociateAccount}
        isArabic={isArabic}
      />

      <ImportMudabbirGuestModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onAddGuest={handleAddGuest}
        isArabic={isArabic}
      />
    </div>
  );
};
