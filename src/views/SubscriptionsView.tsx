import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Building2,
  Calendar,
  Tag,
  History,
  Bell,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  Key,
  Home,
  Hotel,
  Layers,
  Percent,
  Send,
  Phone,
  Mail,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  X,
  LayoutGrid,
  List,
  MoreVertical,
  CalendarDays,
  Check,
  AlertCircle,
  Pause,
  Play,
  Trash2,
  Sliders,
  DollarSign,
  ArrowRight,
  Download,
  Share2,
  FileSpreadsheet,
  Briefcase,
  Globe,
  MapPin,
  CheckSquare,
  Square,
} from 'lucide-react';
import {
  HOSPITALITY_BILLING_CYCLES,
  ACTIVE_HOSPITALITY_SUBSCRIPTIONS,
  HOSPITALITY_ORGANIZATIONS,
  HOSPITALITY_COUPONS,
  HOSPITALITY_LIFECYCLE_HISTORY,
  HOSPITALITY_RENEWAL_REMINDERS,
  ActiveHospitalitySubscription,
  HospitalityOrganization,
} from '../data/hospitalityData';

interface SubscriptionsViewProps {
  isArabic: boolean;
  subTab?: string;
  onSubTabChange?: (tab: string) => void;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({
  isArabic,
  subTab = 'subscriptions_active',
  onSubTabChange,
}) => {
  // Navigation Tabs:
  // 1: subscriptions_active ("Subscriptions") -> First and primary
  // 2: subscriptions_cycles ("Billing Cycles")
  // 3: subscriptions_coupons ("Coupons & Discounts")
  // 4: subscriptions_lifecycle ("Lifecycle History")
  // 5: subscriptions_reminders ("Renewal Reminders")

  const [activeTab, setActiveTab] = useState<string>(
    subTab || 'subscriptions_active'
  );

  // Sync if prop changes
  React.useEffect(() => {
    if (subTab) {
      if (subTab === 'subscriptions_plans') {
        setActiveTab('subscriptions_active');
      } else {
        setActiveTab(subTab);
      }
    }
  }, [subTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onSubTabChange) {
      onSubTabChange(tabId);
    }
  };

  // State for organizations & active subscriptions list
  const [organizations, setOrganizations] = useState<HospitalityOrganization[]>(
    HOSPITALITY_ORGANIZATIONS
  );
  const [activeSubs, setActiveSubs] = useState<ActiveHospitalitySubscription[]>(
    ACTIVE_HOSPITALITY_SUBSCRIPTIONS
  );

  // Multi-organization and property filters
  const [selectedOrgFilter, setSelectedOrgFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Hotel' | 'Villa' | 'Apartment'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending Renewal' | 'Seasonal Pause'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Primary View Mode: LIST TABLE VIEW as requested by user
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');

  // Multi-select for batch operations
  const [selectedSubIds, setSelectedSubIds] = useState<string[]>([]);

  // Selected subscription for detail modal
  const [selectedSub, setSelectedSub] = useState<ActiveHospitalitySubscription | null>(null);

  // Selected organization for organization profile drawer
  const [viewingOrg, setViewingOrg] = useState<HospitalityOrganization | null>(null);

  // Selected subscription for Renewal modal
  const [renewingSub, setRenewingSub] = useState<ActiveHospitalitySubscription | null>(null);
  const [renewalTerm, setRenewalTerm] = useState<'1year' | '6months' | '1month' | '2years'>('1year');
  const [renewalAutoRenew, setRenewalAutoRenew] = useState(true);
  const [renewalPaymentMode, setRenewalPaymentMode] = useState<'Mada Direct Debit' | 'SARIE Wire' | 'SADAD'>('Mada Direct Debit');

  // Selected subscription for Options modal / Dropdown
  const [optionsSub, setOptionsSub] = useState<ActiveHospitalitySubscription | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Options edit state inside Options Modal
  const [optSelectedPlan, setOptSelectedPlan] = useState('');
  const [optBillingCycle, setOptBillingCycle] = useState('');
  const [optAutoRenew, setOptAutoRenew] = useState(true);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Modal to add new property subscription
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSelectedOrgId, setNewSelectedOrgId] = useState<string>(HOSPITALITY_ORGANIZATIONS[0].id);
  const [newPropName, setNewPropName] = useState('');
  const [newPropNameAr, setNewPropNameAr] = useState('');
  const [newPropType, setNewPropType] = useState<'Hotel' | 'Villa' | 'Apartment'>('Hotel');
  const [newCity, setNewCity] = useState<'Riyadh' | 'Jeddah' | 'AlUla' | 'Makkah' | 'Madinah' | 'Al Khobar' | 'Taif'>('Riyadh');
  const [newKeys, setNewKeys] = useState('60');
  const [newPlan, setNewPlan] = useState('Hotel Enterprise OS');
  const [newCycle, setNewCycle] = useState('Annual Enterprise (Advantage 15%)');
  const [newGmName, setNewGmName] = useState('');
  const [newGmEmail, setNewGmEmail] = useState('');

  // Filter subscriptions based on Organization, Type, Status, and Search Query
  const filteredActiveSubs = useMemo(() => {
    return activeSubs.filter((sub) => {
      const matchesOrg = selectedOrgFilter === 'All' || sub.organizationId === selectedOrgFilter;
      const matchesType = typeFilter === 'All' || sub.propertyType === typeFilter;
      const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        sub.propertyName.toLowerCase().includes(q) ||
        sub.propertyNameAr.toLowerCase().includes(q) ||
        sub.organizationName.toLowerCase().includes(q) ||
        sub.organizationNameAr.toLowerCase().includes(q) ||
        sub.city.toLowerCase().includes(q) ||
        sub.crNumber.includes(q) ||
        sub.code.toLowerCase().includes(q) ||
        sub.planName.toLowerCase().includes(q);

      return matchesOrg && matchesType && matchesStatus && matchesSearch;
    });
  }, [activeSubs, selectedOrgFilter, typeFilter, statusFilter, searchQuery]);

  // Aggregate metrics
  const totalOrganizationsCount = organizations.length;
  const totalManagedKeys = activeSubs.reduce((acc, curr) => acc + curr.keysCount, 0);
  const totalMrr = activeSubs.reduce((acc, curr) => acc + curr.mrr, 0);
  const totalArr = totalMrr * 12;

  // Batch actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedSubIds(filteredActiveSubs.map((s) => s.id));
    } else {
      setSelectedSubIds([]);
    }
  };

  const handleToggleSelectSub = (subId: string) => {
    setSelectedSubIds((prev) =>
      prev.includes(subId) ? prev.filter((id) => id !== subId) : [...prev, subId]
    );
  };

  const handleBatchRenew = () => {
    if (selectedSubIds.length === 0) return;
    const updated = activeSubs.map((s) => {
      if (selectedSubIds.includes(s.id)) {
        return {
          ...s,
          renewalDate: '27 Sep 2027',
          status: 'Active' as const,
        };
      }
      return s;
    });
    setActiveSubs(updated);
    showToast(
      isArabic
        ? `تم تجديد ${selectedSubIds.length} اشتراكات بنجاح لجميع المنظمات المحددة!`
        : `Successfully renewed ${selectedSubIds.length} subscriptions across selected organizations!`
    );
    setSelectedSubIds([]);
  };

  // Handle Add New Subscription for Organization
  const handleAddNewSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropName) return;

    const targetOrg = organizations.find((o) => o.id === newSelectedOrgId) || organizations[0];
    const keys = parseInt(newKeys, 10) || 40;
    const monthlyRate = newPlan.includes('Hotel')
      ? keys * 45
      : newPlan.includes('Villa')
      ? keys * 85
      : keys * 35;

    const newSub: ActiveHospitalitySubscription = {
      id: `HOSP-SUB-${Math.floor(100 + Math.random() * 900)}`,
      code: `SA-${newCity.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      organizationId: targetOrg.id,
      organizationName: targetOrg.name,
      organizationNameAr: targetOrg.nameAr,
      organizationTier: targetOrg.tier,
      organizationBadgeColor: targetOrg.badgeColor,
      propertyName: newPropName,
      propertyNameAr: newPropNameAr || newPropName,
      propertyType: newPropType,
      classification:
        newPropType === 'Hotel'
          ? '5-Star Resort'
          : newPropType === 'Villa'
          ? 'Luxury Private Compound'
          : 'Serviced Residences',
      city: newCity,
      crNumber: targetOrg.crNumber,
      zatcaTrn: targetOrg.taxNumber,
      planName: newPlan,
      keysCount: keys,
      billingCycle: newCycle,
      mrr: monthlyRate,
      annualContractValue: monthlyRate * 12 * 0.85,
      startDate: 'Today',
      renewalDate: '27 Sep 2027',
      status: 'Active',
      paymentMode: 'SARIE Wire',
      zatcaCsid: {
        status: 'Valid & Cleared',
        csidId: `ZTC-${newCity.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-PRD`,
        lastSynced: 'Just now',
      },
      features: {
        channelManager: true,
        iotSmartDoorLocks: true,
        nafathGuestVerification: true,
        saudiTourismTaxReport: true,
        whatsappConcierge: true,
      },
      generalManager: {
        name: newGmName || 'Property GM',
        email: newGmEmail || 'gm@hospitality.sa',
        phone: '+966 50 123 4567',
      },
    };

    setActiveSubs([newSub, ...activeSubs]);
    setIsAddModalOpen(false);
    setNewPropName('');
    setNewPropNameAr('');
    setNewGmName('');
    showToast(
      isArabic
        ? `تم إضافة اشتراك ${newSub.propertyNameAr} تحت مظلة ${targetOrg.nameAr} بنجاح!`
        : `Activated subscription for ${newSub.propertyName} under ${targetOrg.name}!`
    );
  };

  // Handle Confirm Renewal
  const handleConfirmRenewal = () => {
    if (!renewingSub) return;

    let newDate = '27 Sep 2027';
    if (renewalTerm === '1year') newDate = '27 Sep 2027';
    else if (renewalTerm === '2years') newDate = '27 Sep 2028';
    else if (renewalTerm === '6months') newDate = '27 Mar 2027';
    else if (renewalTerm === '1month') newDate = '27 Oct 2026';

    const updated = activeSubs.map((s) => {
      if (s.id === renewingSub.id) {
        return {
          ...s,
          renewalDate: newDate,
          status: 'Active' as const,
          paymentMode: renewalPaymentMode,
        };
      }
      return s;
    });

    setActiveSubs(updated);
    const subName = isArabic ? renewingSub.propertyNameAr : renewingSub.propertyName;
    setRenewingSub(null);
    showToast(
      isArabic
        ? `تم تجديد اشتراك ${subName} (${renewingSub.organizationNameAr}) بنجاح حتى ${newDate}`
        : `Successfully renewed subscription for ${subName} (${renewingSub.organizationName}) until ${newDate}`
    );
  };

  // Open Options Modal
  const handleOpenOptions = (sub: ActiveHospitalitySubscription) => {
    setOptionsSub(sub);
    setOptSelectedPlan(sub.planName);
    setOptBillingCycle(sub.billingCycle);
    setOptAutoRenew(true);
    setActiveDropdownId(null);
  };

  // Save Options Modal Changes
  const handleSaveOptions = () => {
    if (!optionsSub) return;

    const updated = activeSubs.map((s) => {
      if (s.id === optionsSub.id) {
        return {
          ...s,
          planName: optSelectedPlan,
          billingCycle: optBillingCycle,
        };
      }
      return s;
    });

    setActiveSubs(updated);
    const subName = isArabic ? optionsSub.propertyNameAr : optionsSub.propertyName;
    setOptionsSub(null);
    showToast(
      isArabic
        ? `تم تحديث خطة واشتراك ${subName} بنجاح`
        : `Successfully updated subscription settings for ${subName}`
    );
  };

  // Toggle Pause Subscription
  const handleTogglePause = (sub: ActiveHospitalitySubscription) => {
    const newStatus = sub.status === 'Seasonal Pause' ? 'Active' : 'Seasonal Pause';
    const updated = activeSubs.map((s) => (s.id === sub.id ? { ...s, status: newStatus as any } : s));
    setActiveSubs(updated);
    setActiveDropdownId(null);
    showToast(
      isArabic
        ? `تم ${newStatus === 'Seasonal Pause' ? 'إيقاف الاشتراك مؤقتاً' : 'استئناف الاشتراك'} لـ ${sub.propertyNameAr}`
        : `${newStatus === 'Seasonal Pause' ? 'Paused' : 'Resumed'} subscription for ${sub.propertyName}`
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f9f9ff] overflow-y-auto" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl bg-[#004a60] text-white px-4 py-3 shadow-xl border border-white/20 text-xs font-semibold animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-75 cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Multi-Organization Platform Header Banner */}
      <div className="bg-gradient-to-r from-[#00303e] via-[#004a60] to-[#0b546b] text-white p-5 lg:p-6 shrink-0 border-b border-[#002835]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-200 border border-emerald-400/30">
                <ShieldCheck className="h-3 w-3" />
                ZATCA Phase 2 Fatoora Cryptographic Certified
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white/90 border border-white/10">
                {isArabic ? 'بنية منصة متعددة المؤسسات' : 'Multi-Organization Tenant Platform'}
              </span>
              <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                SAMA / Mada Direct Debit
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight">
              {isArabic
                ? 'منظومة إدارة الاشتراكات للمؤسسات الفندقية المتعددة'
                : 'Multi-Organization Hospitality Subscription Platform'}
            </h1>
            <p className="text-xs text-white/85 mt-1 max-w-2xl leading-relaxed">
              {isArabic
                ? 'منصة سحابية متكاملة لإدارة اشتراكات السلاسل والمجموعات القابضة، الفنادق، الفلل والشقق الفندقية بجدول تفصيلي يربط كل اشتراك بمؤسسته مع التجديد الفوري وامتثال ZATCA.'
                : 'Centralized multi-tenant subscription engine for hotel chains, enterprise holdings, private resorts, and serviced residences with automated billing cycles and ZATCA compliance.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Metrics Badge */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-3.5 py-2 border border-white/15">
              <div>
                <div className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
                  {isArabic ? 'المؤسسات' : 'Client Orgs'}
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-cyan-300" />
                  {totalOrganizationsCount} {isArabic ? 'مؤسسات' : 'Enterprises'}
                </div>
              </div>
              <div className="h-7 w-px bg-white/20" />
              <div>
                <div className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
                  {isArabic ? 'إجمالي الغرف' : 'Total Keys'}
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  <Key className="h-3.5 w-3.5 text-emerald-300" />
                  {totalManagedKeys.toLocaleString()}
                </div>
              </div>
              <div className="h-7 w-px bg-white/20" />
              <div>
                <div className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
                  {isArabic ? 'الإيراد الشهري' : 'Platform MRR'}
                </div>
                <div className="text-sm font-bold text-emerald-300">
                  SAR {totalMrr.toLocaleString()}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? 'إضافة اشتراك لمنظمة' : 'New Subscription'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white border-b border-[#e3e8f9] px-4 lg:px-6 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {[
            {
              id: 'subscriptions_active',
              label: isArabic ? 'الاشتراكات والمنظمات' : 'Subscriptions (Multi-Org)',
              badge: activeSubs.length.toString(),
              icon: Building2,
            },
            {
              id: 'subscriptions_cycles',
              label: isArabic ? 'دورات الفوترة' : 'Billing Cycles',
              badge: HOSPITALITY_BILLING_CYCLES.length.toString(),
              icon: Calendar,
            },
            {
              id: 'subscriptions_coupons',
              label: isArabic ? 'الكوبونات والخصومات' : 'Coupons & Discounts',
              badge: HOSPITALITY_COUPONS.length.toString(),
              icon: Tag,
            },
            {
              id: 'subscriptions_lifecycle',
              label: isArabic ? 'سجل دورة الحياة' : 'Lifecycle History',
              badge: 'Audit',
              icon: History,
            },
            {
              id: 'subscriptions_reminders',
              label: isArabic ? 'تذكيرات التجديد' : 'Renewal Reminders',
              badge: HOSPITALITY_RENEWAL_REMINDERS.length.toString(),
              icon: Bell,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#004a60] text-white shadow-xs'
                    : 'text-[#40484d] hover:bg-[#f1f3ff] hover:text-[#004a60]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#e8eeff] text-[#004a60]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full flex-1">
        {/* ========================================================
            TAB 1: SUBSCRIPTIONS FOR MULTIPLE ORGANIZATIONS (LIST TABLE VIEW)
           ======================================================== */}
        {activeTab === 'subscriptions_active' && (
          <div className="space-y-4">
            {/* Multi-Organization Summary Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-3.5 border border-[#e3e8f9] shadow-2xs">
                <div className="text-[11px] text-[#70787d] font-medium flex items-center justify-between">
                  <span>{isArabic ? 'المؤسسات المشتركة' : 'Subscribed Organizations'}</span>
                  <Building2 className="h-4 w-4 text-[#004a60]" />
                </div>
                <div className="text-xl font-bold text-[#161c27] mt-1">
                  {totalOrganizationsCount} <span className="text-xs font-normal text-[#70787d]">{isArabic ? 'مؤسسة' : 'Holdings'}</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                  {isArabic ? '100% نشطة ومعتمدة ZATCA' : '100% Active & ZATCA Approved'}
                </div>
              </div>

              <div className="bg-white rounded-xl p-3.5 border border-[#e3e8f9] shadow-2xs">
                <div className="text-[11px] text-[#70787d] font-medium flex items-center justify-between">
                  <span>{isArabic ? 'الاشتراكات النشطة' : 'Active Subscriptions'}</span>
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-[#161c27] mt-1">
                  {activeSubs.length} <span className="text-xs font-normal text-[#70787d]">{isArabic ? 'منشأة فندقية' : 'Properties'}</span>
                </div>
                <div className="text-[10px] text-[#004a60] font-semibold mt-0.5">
                  {activeSubs.filter((s) => s.status === 'Active').length} {isArabic ? 'سارية حالياً' : 'Active folios'}
                </div>
              </div>

              <div className="bg-white rounded-xl p-3.5 border border-[#e3e8f9] shadow-2xs">
                <div className="text-[11px] text-[#70787d] font-medium flex items-center justify-between">
                  <span>{isArabic ? 'إجمالي الغرف والمفاتيح' : 'Managed Room Keys'}</span>
                  <Key className="h-4 w-4 text-amber-600" />
                </div>
                <div className="text-xl font-bold text-[#161c27] mt-1">
                  {totalManagedKeys.toLocaleString()} <span className="text-xs font-normal text-[#70787d]">{isArabic ? 'مفتاح' : 'Keys'}</span>
                </div>
                <div className="text-[10px] text-[#70787d] mt-0.5">
                  {isArabic ? 'في 7 مدن سعودية' : 'Across 7 Saudi Cities'}
                </div>
              </div>

              <div className="bg-white rounded-xl p-3.5 border border-[#e3e8f9] shadow-2xs">
                <div className="text-[11px] text-[#70787d] font-medium flex items-center justify-between">
                  <span>{isArabic ? 'الإيراد الشهري والسنوي' : 'Total Revenue (MRR / ARR)'}</span>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-emerald-700 mt-1">
                  SAR {totalMrr.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#70787d] mt-0.5">
                  ARR: SAR {totalArr.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Filter & Control Bar */}
            <div className="bg-white p-3.5 rounded-xl border border-[#e3e8f9] shadow-xs space-y-3">
              {/* Top Row: Organization Selector Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                <span className="font-bold text-[#161c27] flex items-center gap-1.5 shrink-0 text-xs">
                  <Briefcase className="h-3.5 w-3.5 text-[#004a60]" />
                  {isArabic ? 'المؤسسة:' : 'Organization:'}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedOrgFilter('All')}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-all shrink-0 cursor-pointer ${
                    selectedOrgFilter === 'All'
                      ? 'bg-[#004a60] text-white shadow-xs'
                      : 'bg-[#f1f3ff] text-[#40484d] hover:bg-[#e8eeff]'
                  }`}
                >
                  {isArabic ? 'جميع المؤسسات' : 'All Organizations'} ({activeSubs.length})
                </button>

                {organizations.map((org) => {
                  const isSelected = selectedOrgFilter === org.id;
                  const orgSubCount = activeSubs.filter((s) => s.organizationId === org.id).length;
                  return (
                    <button
                      key={org.id}
                      type="button"
                      onClick={() => setSelectedOrgFilter(org.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-[#004a60] text-white font-bold shadow-xs'
                          : 'bg-[#f9f9ff] text-[#40484d] hover:bg-[#e8eeff] border border-[#e3e8f9]'
                      }`}
                    >
                      <span className="font-bold text-[10px] uppercase">{org.code}</span>
                      <span>{isArabic ? org.nameAr : org.name}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#e8eeff] text-[#004a60]'
                        }`}
                      >
                        {orgSubCount}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Row: Property Type, Status, Search & List/Card Toggle */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#f1f3ff]">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Property Type Filter */}
                  <div className="flex items-center gap-1 bg-[#f9f9ff] p-0.5 rounded-lg border border-[#e3e8f9]">
                    {(['All', 'Hotel', 'Villa', 'Apartment'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                          typeFilter === t
                            ? 'bg-white text-[#004a60] font-bold shadow-2xs'
                            : 'text-[#70787d] hover:text-[#161c27]'
                        }`}
                      >
                        {t === 'All'
                          ? isArabic ? 'الكل' : 'All Types'
                          : t === 'Hotel'
                          ? isArabic ? 'فنادق' : 'Hotels'
                          : t === 'Villa'
                          ? isArabic ? 'فلل' : 'Villas'
                          : isArabic ? 'شقق مخدومة' : 'Apartments'}
                      </button>
                    ))}
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-1 bg-[#f9f9ff] p-0.5 rounded-lg border border-[#e3e8f9]">
                    {(['All', 'Active', 'Pending Renewal', 'Seasonal Pause'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                          statusFilter === st
                            ? 'bg-[#004a60] text-white font-bold shadow-2xs'
                            : 'text-[#70787d] hover:text-[#161c27]'
                        }`}
                      >
                        {st === 'All'
                          ? isArabic ? 'كل الحالات' : 'All Status'
                          : st === 'Active'
                          ? isArabic ? 'نشط' : 'Active'
                          : st === 'Pending Renewal'
                          ? isArabic ? 'قيد التجديد' : 'Pending Renewal'
                          : isArabic ? 'إيقاف مؤقت' : 'Paused'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Search Box */}
                  <div className="relative flex-1 sm:w-64">
                    <Search className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d] ${isArabic ? 'right-3' : 'left-3'}`} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isArabic ? 'بحث بالمؤسسة، الفندق، السجل...' : 'Search organization, property, CR...'}
                      className={`w-full rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] py-1.5 text-xs text-[#161c27] placeholder-[#70787d] focus:border-[#004a60] focus:bg-white focus:outline-hidden ${
                        isArabic ? 'pr-8 pl-3' : 'pl-8 pr-3'
                      }`}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${isArabic ? 'left-2.5' : 'right-2.5'}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* View Mode Toggle: Built as List Table View as requested */}
                  <div className="flex items-center rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] p-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      title={isArabic ? 'عرض الجدول والقائمة' : 'List Table View'}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        viewMode === 'list'
                          ? 'bg-white text-[#004a60] shadow-xs'
                          : 'text-[#70787d] hover:text-[#161c27]'
                      }`}
                    >
                      <List className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{isArabic ? 'جدول القائمة' : 'List Table'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('cards')}
                      title={isArabic ? 'عرض البطاقات' : 'Cards View'}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        viewMode === 'cards'
                          ? 'bg-white text-[#004a60] shadow-xs'
                          : 'text-[#70787d] hover:text-[#161c27]'
                      }`}
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{isArabic ? 'بطاقات' : 'Cards'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Batch Action Toolbar when rows are selected */}
            {selectedSubIds.length > 0 && (
              <div className="bg-[#004a60] text-white p-3 rounded-xl shadow-lg border border-white/20 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-[11px]">
                    {selectedSubIds.length}
                  </span>
                  <span className="font-semibold">
                    {isArabic
                      ? `تم تحديد ${selectedSubIds.length} اشتراك عبر المؤسسات`
                      : `${selectedSubIds.length} multi-org subscriptions selected`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleBatchRenew}
                    className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>{isArabic ? 'تجديد فوري للمحددة' : 'Batch Renew Selected'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      showToast(
                        isArabic
                          ? 'تم تجهيز تقرير مطابقة ZATCA للاشتراكات المحددة'
                          : 'ZATCA compliance report prepared for export'
                      );
                    }}
                    className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isArabic ? 'تصدير التقرير' : 'Export CSV'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedSubIds([])}
                    className="text-white/70 hover:text-white px-2 py-1 cursor-pointer"
                  >
                    {isArabic ? 'إلغاء التحديد' : 'Deselect'}
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                PRIMARY HERO VIEW: LIST TABLE VIEW
               ======================================================== */}
            {viewMode === 'list' ? (
              <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left min-w-[980px]">
                    <thead className="bg-[#f9f9ff] text-[11px] text-[#70787d] font-semibold border-b border-[#e3e8f9]">
                      <tr>
                        {/* Checkbox for Select All */}
                        <th className="px-3.5 py-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={
                              filteredActiveSubs.length > 0 &&
                              selectedSubIds.length === filteredActiveSubs.length
                            }
                            onChange={handleSelectAll}
                            className="h-3.5 w-3.5 text-[#004a60] rounded-sm focus:ring-[#004a60] cursor-pointer"
                          />
                        </th>
                        <th className="px-3.5 py-3 font-bold text-[#161c27]">
                          {isArabic ? 'المؤسسة والمالك' : 'Organization & Holding'}
                        </th>
                        <th className="px-3.5 py-3 font-bold text-[#161c27]">
                          {isArabic ? 'المنشأة الفندقية' : 'Hospitality Property'}
                        </th>
                        <th className="px-3 py-3">{isArabic ? 'المدينة' : 'City'}</th>
                        <th className="px-3.5 py-3">{isArabic ? 'الباقة والمفاتيح' : 'Plan & Keys'}</th>
                        <th className="px-3 py-3">{isArabic ? 'دورة الفوترة' : 'Billing Cycle'}</th>
                        <th className="px-3.5 py-3 text-right">{isArabic ? 'الرسوم الشهرية' : 'Monthly Fee'}</th>
                        <th className="px-3.5 py-3">{isArabic ? 'تاريخ التجديد' : 'Renewal Due'}</th>
                        <th className="px-3 py-3 text-center">{isArabic ? 'امتثال ZATCA' : 'ZATCA Node'}</th>
                        <th className="px-3 py-3 text-center">{isArabic ? 'الحالة' : 'Status'}</th>
                        <th className="px-3.5 py-3 text-center">{isArabic ? 'الإجراءات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e3e8f9]">
                      {filteredActiveSubs.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="py-12 text-center text-[#70787d]">
                            <Building2 className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                            <div className="font-bold text-[#161c27]">
                              {isArabic ? 'لا توجد اشتراكات مطابقة للبحث' : 'No subscriptions matching criteria'}
                            </div>
                            <div className="text-xs text-[#70787d] mt-1">
                              {isArabic
                                ? 'جرب تغيير المؤسسة المحددة أو إعادة ضبط الفلاتر'
                                : 'Try adjusting your organization filter or search keywords.'}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredActiveSubs.map((sub) => {
                          const isSelected = selectedSubIds.includes(sub.id);
                          const org = organizations.find((o) => o.id === sub.organizationId);

                          return (
                            <tr
                              key={sub.id}
                              className={`hover:bg-[#f9f9ff]/90 transition-colors ${
                                isSelected ? 'bg-[#f1f6fa]' : ''
                              }`}
                            >
                              {/* Selection Checkbox */}
                              <td className="px-3.5 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleSelectSub(sub.id)}
                                  className="h-3.5 w-3.5 text-[#004a60] rounded-sm focus:ring-[#004a60] cursor-pointer"
                                />
                              </td>

                              {/* 1. Organization & Holding */}
                              <td className="px-3.5 py-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => org && setViewingOrg(org)}
                                    className="font-bold text-[#161c27] hover:text-[#004a60] transition-colors text-left cursor-pointer flex items-center gap-1.5"
                                  >
                                    <Building2 className="h-3.5 w-3.5 text-[#004a60] shrink-0" />
                                    <span>{isArabic ? sub.organizationNameAr : sub.organizationName}</span>
                                  </button>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                                  <span
                                    className={`inline-block rounded-md px-1.5 py-0.2 font-semibold border ${
                                      sub.organizationBadgeColor || 'bg-gray-100 text-gray-700 border-gray-200'
                                    }`}
                                  >
                                    {sub.organizationTier || 'Enterprise'}
                                  </span>
                                  <span className="text-[#70787d] font-mono">
                                    CR: {sub.crNumber}
                                  </span>
                                </div>
                              </td>

                              {/* 2. Property Name & Code */}
                              <td className="px-3.5 py-3">
                                <div className="font-bold text-[#161c27]">
                                  {isArabic ? sub.propertyNameAr : sub.propertyName}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-[#70787d] mt-0.5">
                                  <span
                                    className={`inline-flex items-center gap-1 font-bold ${
                                      sub.propertyType === 'Hotel'
                                        ? 'text-blue-700'
                                        : sub.propertyType === 'Villa'
                                        ? 'text-amber-800'
                                        : 'text-emerald-800'
                                    }`}
                                  >
                                    {sub.propertyType === 'Hotel' && <Hotel className="h-3 w-3" />}
                                    {sub.propertyType === 'Villa' && <Home className="h-3 w-3" />}
                                    {sub.propertyType === 'Apartment' && <Building2 className="h-3 w-3" />}
                                    <span>{sub.propertyType}</span>
                                  </span>
                                  <span>•</span>
                                  <span>{sub.classification}</span>
                                  <span>•</span>
                                  <span className="font-mono text-[#004a60]">{sub.code}</span>
                                </div>
                              </td>

                              {/* 3. City / Region */}
                              <td className="px-3 py-3 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f1f3ff] text-[#004a60] text-[10px] font-bold">
                                  <MapPin className="h-3 w-3 text-[#004a60]" />
                                  <span>{sub.city}</span>
                                </span>
                              </td>

                              {/* 4. Plan & Keys */}
                              <td className="px-3.5 py-3">
                                <div className="font-semibold text-[#161c27]">{sub.planName}</div>
                                <div className="text-[10px] text-[#004a60] font-bold flex items-center gap-1 mt-0.5">
                                  <Key className="h-3 w-3 text-emerald-600" />
                                  <span>{sub.keysCount} {isArabic ? 'وحدة / مفتاح' : 'Keys / Units'}</span>
                                </div>
                              </td>

                              {/* 5. Billing Cycle */}
                              <td className="px-3 py-3 text-[#70787d]">
                                <span className="truncate max-w-[130px] block text-[11px] font-medium text-[#40484d]">
                                  {sub.billingCycle}
                                </span>
                              </td>

                              {/* 6. Monthly Fee (MRR) */}
                              <td className="px-3.5 py-3 text-right whitespace-nowrap">
                                <div className="font-mono font-bold text-[#161c27] text-xs">
                                  SAR {sub.mrr.toLocaleString()}
                                </div>
                                <div className="text-[9px] text-[#70787d]">
                                  ACV: SAR {sub.annualContractValue.toLocaleString()}
                                </div>
                              </td>

                              {/* 7. Renewal Due Date */}
                              <td className="px-3.5 py-3 whitespace-nowrap">
                                <span className="font-semibold text-[#161c27] flex items-center gap-1 text-[11px]">
                                  <CalendarDays className="h-3 w-3 text-[#004a60]" />
                                  {sub.renewalDate}
                                </span>
                                <span className="text-[9px] text-emerald-700 font-semibold block mt-0.5">
                                  {isArabic ? 'تجديد آلي مفعل' : 'Auto-Renew Active'}
                                </span>
                              </td>

                              {/* 8. ZATCA Compliance */}
                              <td className="px-3 py-3 text-center whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    sub.zatcaCsid.status === 'Valid & Cleared'
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                                  }`}
                                  title={`CSID: ${sub.zatcaCsid.csidId}`}
                                >
                                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                                  <span>{sub.zatcaCsid.status}</span>
                                </span>
                              </td>

                              {/* 9. Status */}
                              <td className="px-3 py-3 text-center whitespace-nowrap">
                                <span
                                  className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                    sub.status === 'Active'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : sub.status === 'Pending Renewal'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-purple-100 text-purple-800'
                                  }`}
                                >
                                  {sub.status}
                                </span>
                              </td>

                              {/* 10. Actions */}
                              <td className="px-3.5 py-3 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">
                                  {/* Renew Button */}
                                  <button
                                    type="button"
                                    onClick={() => setRenewingSub(sub)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-all cursor-pointer"
                                    title={isArabic ? 'تجديد الاشتراك' : 'Renew Subscription'}
                                  >
                                    <RefreshCw className="h-3 w-3" />
                                    <span>{isArabic ? 'تجديد' : 'Renew'}</span>
                                  </button>

                                  {/* Options Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenOptions(sub)}
                                    className="p-1 rounded-lg text-[#70787d] hover:text-[#161c27] hover:bg-gray-100 transition-colors cursor-pointer"
                                    title={isArabic ? 'خيارات وترقية' : 'Options & Upgrades'}
                                  >
                                    <Sliders className="h-3.5 w-3.5" />
                                  </button>

                                  {/* View Details Drawer */}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedSub(sub)}
                                    className="p-1 rounded-lg text-[#004a60] hover:bg-[#e8eeff] transition-colors cursor-pointer"
                                    title={isArabic ? 'تفاصيل العقد' : 'View Details & Folio'}
                                  >
                                    <ChevronRight className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer with Summary */}
                <div className="bg-[#f9f9ff] px-4 py-3 border-t border-[#e3e8f9] flex flex-col sm:flex-row items-center justify-between text-xs text-[#70787d] gap-2">
                  <div>
                    {isArabic ? 'إجمالي الاشتراكات المعروضة:' : 'Showing'}{' '}
                    <strong className="text-[#161c27]">{filteredActiveSubs.length}</strong>{' '}
                    {isArabic ? 'من أصل' : 'of'}{' '}
                    <strong className="text-[#161c27]">{activeSubs.length}</strong>{' '}
                    {isArabic ? 'اشتراك عبر المنظمات' : 'subscriptions across organizations'}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span>
                      {isArabic ? 'إجمالي المفاتيح المعروضة:' : 'Keys:'}{' '}
                      <strong className="text-[#004a60]">
                        {filteredActiveSubs.reduce((acc, c) => acc + c.keysCount, 0).toLocaleString()}
                      </strong>
                    </span>
                    <span>
                      {isArabic ? 'إجمالي MRR المعروض:' : 'MRR:'}{' '}
                      <strong className="text-emerald-700">
                        SAR {filteredActiveSubs.reduce((acc, c) => acc + c.mrr, 0).toLocaleString()}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* ALTERNATE VIEW: CARDS VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredActiveSubs.map((sub) => {
                  const isDropdownOpen = activeDropdownId === sub.id;
                  const org = organizations.find((o) => o.id === sub.organizationId);

                  return (
                    <div
                      key={sub.id}
                      className="bg-white rounded-2xl border border-[#e3e8f9] p-4.5 shadow-2xs hover:shadow-md hover:border-[#004a60]/40 transition-all flex flex-col justify-between relative group"
                    >
                      <div>
                        {/* Organization Badge Row */}
                        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#f1f3ff]">
                          <button
                            type="button"
                            onClick={() => org && setViewingOrg(org)}
                            className="flex items-center gap-1.5 text-xs font-bold text-[#004a60] hover:underline cursor-pointer"
                          >
                            <Building2 className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate max-w-[180px]">
                              {isArabic ? sub.organizationNameAr : sub.organizationName}
                            </span>
                          </button>
                          <span
                            className={`rounded-full px-2 py-0.2 text-[9px] font-bold ${
                              sub.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : sub.status === 'Pending Renewal'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>

                        {/* Property Type Badge & City */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              sub.propertyType === 'Hotel'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : sub.propertyType === 'Villa'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {sub.propertyType === 'Hotel' && <Hotel className="h-3 w-3" />}
                            {sub.propertyType === 'Villa' && <Home className="h-3 w-3" />}
                            {sub.propertyType === 'Apartment' && <Building2 className="h-3 w-3" />}
                            <span>{sub.propertyType} • {sub.city}</span>
                          </span>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdownId(isDropdownOpen ? null : sub.id);
                              }}
                              className="p-1 rounded-lg text-[#70787d] hover:text-[#161c27] hover:bg-[#f1f3ff] transition-colors cursor-pointer"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            {isDropdownOpen && (
                              <div
                                className={`absolute ${
                                  isArabic ? 'left-0' : 'right-0'
                                } top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-[#e3e8f9] py-1.5 z-30 text-xs animate-in fade-in zoom-in-95`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    setRenewingSub(sub);
                                  }}
                                  className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-[#f9f9ff] text-emerald-700 font-semibold cursor-pointer"
                                >
                                  <RefreshCw className="h-3.5 w-3.5" />
                                  <span>{isArabic ? 'تجديد الاشتراك الآن' : 'Renew Subscription'}</span>
                                </button>
                                <button
                                  onClick={() => handleOpenOptions(sub)}
                                  className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-[#f9f9ff] text-[#161c27] cursor-pointer"
                                >
                                  <Sliders className="h-3.5 w-3.5 text-[#004a60]" />
                                  <span>{isArabic ? 'ترقية / تعديل الباقة' : 'Upgrade / Change Plan'}</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    setSelectedSub(sub);
                                  }}
                                  className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-[#f9f9ff] text-[#161c27] cursor-pointer"
                                >
                                  <CreditCard className="h-3.5 w-3.5 text-[#70787d]" />
                                  <span>{isArabic ? 'تفاصيل العقد والمؤسسة' : 'View Contract & Org'}</span>
                                </button>
                                <div className="border-t border-[#f1f3ff] my-1" />
                                <button
                                  onClick={() => handleTogglePause(sub)}
                                  className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-[#f9f9ff] text-amber-700 cursor-pointer"
                                >
                                  {sub.status === 'Seasonal Pause' ? (
                                    <>
                                      <Play className="h-3.5 w-3.5" />
                                      <span>{isArabic ? 'استئناف الاشتراك' : 'Resume Subscription'}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Pause className="h-3.5 w-3.5" />
                                      <span>{isArabic ? 'إيقاف موسمي مؤقت' : 'Seasonal Pause'}</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Property Title & Subtitle */}
                        <h3 className="text-sm font-bold text-[#161c27] group-hover:text-[#004a60] transition-colors leading-snug">
                          {isArabic ? sub.propertyNameAr : sub.propertyName}
                        </h3>
                        <div className="text-[11px] text-[#70787d] mt-0.5">
                          {sub.classification} • {sub.keysCount} Keys / Rooms
                        </div>

                        {/* Plan & Cycle Info Box */}
                        <div className="mt-3 bg-[#f9f9ff] rounded-xl p-3 border border-[#e3e8f9]/70 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#70787d]">{isArabic ? 'الباقة:' : 'Plan:'}</span>
                            <span className="font-bold text-[#161c27]">{sub.planName}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#70787d]">{isArabic ? 'الفوترة:' : 'Cycle:'}</span>
                            <span className="font-medium text-[#40484d] truncate max-w-[150px]">{sub.billingCycle}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#70787d]">{isArabic ? 'تاريخ التجديد:' : 'Renewal Date:'}</span>
                            <span className="inline-flex items-center gap-1 font-semibold text-[#004a60]">
                              <CalendarDays className="h-3 w-3" />
                              {sub.renewalDate}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#e3e8f9]/50">
                            <span className="text-[#70787d]">{isArabic ? 'ختم ZATCA:' : 'ZATCA Cryptographic:'}</span>
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 text-[10px]">
                              <ShieldCheck className="h-3 w-3 text-emerald-600" />
                              {sub.zatcaCsid.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Pricing & Card Actions */}
                      <div className="mt-4 pt-3 border-t border-[#e3e8f9] flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[10px] text-[#70787d] uppercase tracking-wider font-semibold">
                            Monthly Fee
                          </div>
                          <div className="text-sm font-bold text-[#004a60]">
                            SAR {sub.mrr.toLocaleString()} <span className="text-[10px] font-normal text-[#70787d]">/mo</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenOptions(sub)}
                            className="px-2.5 py-1.5 rounded-lg border border-[#c3cce6] bg-white hover:bg-[#f1f3ff] text-[#161c27] text-xs font-semibold transition-all cursor-pointer"
                          >
                            <Sliders className="h-3.5 w-3.5 text-[#70787d]" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setRenewingSub(sub)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>{isArabic ? 'تجديد' : 'Renew'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: BILLING CYCLES
           ======================================================== */}
        {activeTab === 'subscriptions_cycles' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-[#e3e8f9] shadow-xs">
              <h2 className="text-base font-bold text-[#161c27]">
                {isArabic ? 'إدارة دورات الفوترة والتحصيل' : 'Hospitality Billing Cycles & Schedules'}
              </h2>
              <p className="text-xs text-[#70787d]">
                {isArabic
                  ? 'جدولة الفواتير الضريبية الآلية المتوافقة مع هيئة الزكاة والضريبة والجمارك مع خصومات الدفع المقدم عبر المؤسسات'
                  : 'Automated recurring billing engines supporting annual, quarterly, per-room monthly, and Holy Cities pilgrimage seasonality.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HOSPITALITY_BILLING_CYCLES.map((cycle) => (
                <div
                  key={cycle.id}
                  className="bg-white rounded-xl border border-[#e3e8f9] p-5 shadow-xs hover:border-[#004a60]/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[#161c27]">
                      {isArabic ? cycle.nameAr : cycle.name}
                    </span>
                    {cycle.discountPercent > 0 && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Save {cycle.discountPercent}%
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#70787d] mb-4">{cycle.description}</p>

                  <div className="grid grid-cols-3 gap-2 bg-[#f9f9ff] p-3 rounded-lg border border-[#e3e8f9] text-center mb-4">
                    <div>
                      <div className="text-[10px] text-[#70787d] uppercase">{isArabic ? 'المنشآت' : 'Properties'}</div>
                      <div className="text-sm font-bold text-[#161c27]">{cycle.activeProperties}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#70787d] uppercase">{isArabic ? 'الدورة القادمة' : 'Next Run'}</div>
                      <div className="text-xs font-semibold text-[#004a60]">{cycle.nextBatchDate}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#70787d] uppercase">{isArabic ? 'إجمالي MRR' : 'Cycle MRR'}</div>
                      <div className="text-xs font-bold text-emerald-700">SAR {cycle.totalCycleMRR.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#70787d]">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-medium text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{isArabic ? 'فوترة ZATCA تلقائية' : 'Auto ZATCA XML & QR Generation'}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#40484d]">
                      {cycle.paymentMethods.join(' • ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: COUPONS & DISCOUNTS
           ======================================================== */}
        {activeTab === 'subscriptions_coupons' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-[#e3e8f9] shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#161c27]">
                  {isArabic ? 'كوبونات الخصم ومبادرات السياحة' : 'Hospitality Coupons & Promotional Campaigns'}
                </h2>
                <p className="text-xs text-[#70787d]">
                  {isArabic
                    ? 'خصومات تشجيع مشغلي الفنادق والفلل الخاصة ورسوم هيئة السياحة المعتمدة'
                    : 'Manage discount incentives, seasonal rebates, and government tourism initiative subsidies.'}
                </p>
              </div>
              <button className="rounded-lg bg-[#004a60] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#074e64] cursor-pointer">
                + {isArabic ? 'إضافة كوبون جديد' : 'New Promo Code'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HOSPITALITY_COUPONS.map((cpn) => (
                <div
                  key={cpn.id}
                  className="bg-white rounded-xl border border-[#e3e8f9] p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-[#e8eeff] text-[#004a60] px-2.5 py-1 rounded-md border border-[#c4d6ff]">
                          {cpn.code}
                        </span>
                        <span className="text-[10px] font-semibold text-[#70787d]">
                          {cpn.eligibility}
                        </span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {cpn.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#161c27]">
                      {isArabic ? cpn.titleAr : cpn.title}
                    </h3>
                    <p className="text-xs text-[#70787d] mt-1">{cpn.campaignNote}</p>

                    <div className="mt-3 flex items-center gap-3 text-xs">
                      <div className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                        {cpn.discountValue}
                      </div>
                      <div className="text-[#70787d]">
                        {isArabic ? 'ينتهي في:' : 'Valid until:'}{' '}
                        <span className="font-semibold text-[#161c27]">{cpn.validUntil}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#e3e8f9] flex items-center justify-between text-xs">
                    <span className="text-[#70787d]">
                      {isArabic ? 'تم الاستخدام:' : 'Redeemed:'}{' '}
                      <span className="font-bold text-[#161c27]">{cpn.redeemedCount}</span> / {cpn.maxRedemptions}
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#004a60] h-2 rounded-full"
                        style={{ width: `${(cpn.redeemedCount / cpn.maxRedemptions) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: LIFECYCLE HISTORY (AUDIT)
           ======================================================== */}
        {activeTab === 'subscriptions_lifecycle' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-[#e3e8f9] shadow-xs">
              <h2 className="text-base font-bold text-[#161c27]">
                {isArabic ? 'سجل أحداث وتوسعات المنشآت الفندقية' : 'Hospitality Subscription Lifecycle Audit'}
              </h2>
              <p className="text-xs text-[#70787d]">
                {isArabic
                  ? 'سجل غير قابل للتعديل لجميع عمليات ترقية الباقات، إضافة الغرف والمفاتيح، وربط أختام ZATCA'
                  : 'Immutable audit trail of room expansions, tier upgrades, seasonal adjustments, and ZATCA compliance handshakes.'}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#e3e8f9] shadow-xs divide-y divide-[#e3e8f9]">
              {HOSPITALITY_LIFECYCLE_HISTORY.map((item) => (
                <div key={item.id} className="p-4 hover:bg-[#f9f9ff] transition-colors flex items-start gap-4">
                  <div className="h-9 w-9 rounded-xl bg-[#e8eeff] text-[#004a60] flex items-center justify-center shrink-0 mt-0.5">
                    <History className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#161c27]">{item.propertyName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                          {item.eventType}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#70787d]">{item.timestamp}</span>
                    </div>

                    <p className="text-xs text-[#40484d] mt-1">{item.details}</p>

                    <div className="mt-2 flex items-center gap-3 text-[11px] text-[#70787d]">
                      <span>
                        {isArabic ? 'الأثر المالي:' : 'MRR Impact:'}{' '}
                        <strong className="text-emerald-700 font-semibold">{item.amountChange}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        {isArabic ? 'المشغل:' : 'Operator:'} <strong className="text-[#161c27]">{item.user}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: RENEWAL REMINDERS
           ======================================================== */}
        {activeTab === 'subscriptions_reminders' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-[#e3e8f9] shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#161c27]">
                  {isArabic ? 'جدول تذكيرات تجديد العقود الفندقية' : 'Hospitality Contract Renewal Reminders'}
                </h2>
                <p className="text-xs text-[#70787d]">
                  {isArabic
                    ? 'إرسال تذكيرات آلية لمديري الفنادق عبر الواتساب والبريد مع عروض أسعار التجديد السنوية'
                    : 'Automated dunning & renewal pipeline alerting General Managers & Financial Controllers in KSA.'}
                </p>
              </div>
              <button
                onClick={() =>
                  showToast(
                    isArabic
                      ? 'تم إرسال تنبيهات وتذكيرات التجديد عبر الواتساب لجميع مسؤولي المنظمات!'
                      : 'Batch renewal alerts dispatched via WhatsApp & Email!'
                  )
                }
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isArabic ? 'إرسال تذكيرات الدفعة الآن' : 'Dispatch Batch Alerts'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HOSPITALITY_RENEWAL_REMINDERS.map((rem) => (
                <div
                  key={rem.id}
                  className="bg-white rounded-xl border border-[#e3e8f9] p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-[#161c27]">
                        {isArabic ? rem.propertyNameAr : rem.propertyName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rem.daysRemaining <= 10
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rem.daysRemaining} days left
                      </span>
                    </div>

                    <div className="text-xs text-[#70787d] mb-3">
                      {rem.keys} Keys • Annual Contract: <strong>SAR {rem.contractValue.toLocaleString()}</strong>
                    </div>

                    <div className="bg-[#f9f9ff] p-3 rounded-lg border border-[#e3e8f9] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#70787d]">{isArabic ? 'مرحلة التذكير:' : 'Reminder Stage:'}</span>
                        <span className="font-semibold text-[#004a60]">{rem.stage}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#70787d]">{isArabic ? 'قناة الإشعار:' : 'Channel:'}</span>
                        <span className="font-medium text-[#161c27]">{rem.notificationChannel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#70787d]">{isArabic ? 'تجاوب العميل:' : 'Status:'}</span>
                        <span className="font-bold text-emerald-700">{rem.clientResponseStatus}</span>
                      </div>
                    </div>

                    {/* GM Contact */}
                    <div className="mt-3 flex items-center justify-between text-xs text-[#70787d]">
                      <span>
                        GM: <strong>{rem.gmContact.name}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${rem.gmContact.phone}`}
                          className="p-1 rounded-md hover:bg-[#e8eeff] text-[#004a60]"
                          title="Call GM"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                        <a
                          href={`mailto:${rem.gmContact.email}`}
                          className="p-1 rounded-md hover:bg-[#e8eeff] text-[#004a60]"
                          title="Email GM"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#e3e8f9] flex items-center justify-between">
                    <span className="text-[10px] text-[#70787d]">Last sent: {rem.lastDispatched}</span>
                    <button
                      onClick={() =>
                        showToast(
                          isArabic
                            ? `تم إرسال تذكير التجديد إلى ${rem.gmContact.name}`
                            : `Dispatched renewal alert to ${rem.gmContact.name}`
                        )
                      }
                      className="text-xs font-bold text-[#004a60] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isArabic ? 'إرسال تذكير فوري' : 'Dispatch Reminder'}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          MODAL 1: ORGANIZATION PROFILE & CONTRACTS DRAWER
         ======================================================== */}
      {viewingOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#e3e8f9] animate-in zoom-in-95 my-auto text-xs">
            <div className="flex items-center justify-between border-b border-[#e3e8f9] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-[#004a60] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {viewingOrg.code}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#161c27]">
                      {isArabic ? viewingOrg.nameAr : viewingOrg.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${viewingOrg.badgeColor}`}>
                      {isArabic ? viewingOrg.tierAr : viewingOrg.tier}
                    </span>
                  </div>
                  <p className="text-xs text-[#70787d] mt-0.5">
                    {viewingOrg.legalType} • {viewingOrg.city}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingOrg(null)}
                className="h-8 w-8 rounded-lg hover:bg-[#f1f3ff] text-[#70787d] flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Organization Legal Credentials */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#f9f9ff] p-3 rounded-xl border border-[#e3e8f9]">
                <div>
                  <span className="text-[#70787d] text-[10px] block">{isArabic ? 'السجل التجاري:' : 'CR Number:'}</span>
                  <span className="font-mono font-bold text-[#161c27]">{viewingOrg.crNumber}</span>
                </div>
                <div>
                  <span className="text-[#70787d] text-[10px] block">{isArabic ? 'الرقم الضريبي ZATCA:' : 'VAT Number:'}</span>
                  <span className="font-mono font-bold text-[#161c27] truncate block">{viewingOrg.taxNumber}</span>
                </div>
                <div>
                  <span className="text-[#70787d] text-[10px] block">{isArabic ? 'البريد المالي:' : 'Billing Email:'}</span>
                  <span className="font-medium text-[#004a60] truncate block">{viewingOrg.billingEmail}</span>
                </div>
                <div>
                  <span className="text-[#70787d] text-[10px] block">{isArabic ? 'هاتف الإدارة:' : 'Phone:'}</span>
                  <span className="font-medium text-[#161c27]">{viewingOrg.phone}</span>
                </div>
              </div>

              {/* Subscriptions Under This Organization */}
              <div>
                <h4 className="font-bold text-[#161c27] mb-2 text-xs flex items-center justify-between">
                  <span>{isArabic ? 'المنشآت والاشتراكات التابعة للمؤسسة:' : 'Active Property Subscriptions Under Organization:'}</span>
                  <span className="text-[#70787d] font-normal text-[11px]">
                    {activeSubs.filter((s) => s.organizationId === viewingOrg.id).length} {isArabic ? 'منشآت' : 'properties'}
                  </span>
                </h4>

                <div className="space-y-2">
                  {activeSubs
                    .filter((s) => s.organizationId === viewingOrg.id)
                    .map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 rounded-xl border border-[#e3e8f9] bg-white flex items-center justify-between gap-3 hover:border-[#004a60]/40 transition-all"
                      >
                        <div>
                          <div className="font-bold text-[#161c27] text-xs">
                            {isArabic ? sub.propertyNameAr : sub.propertyName}
                          </div>
                          <div className="text-[10px] text-[#70787d] mt-0.5">
                            {sub.city} • {sub.keysCount} Keys • {sub.planName}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono font-bold text-emerald-700 text-xs">
                            SAR {sub.mrr.toLocaleString()} /mo
                          </div>
                          <div className="text-[10px] text-[#70787d]">
                            Renews: {sub.renewalDate}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[#e3e8f9] pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedOrgFilter(viewingOrg.id);
                  setViewingOrg(null);
                }}
                className="rounded-lg bg-[#004a60] text-white px-4 py-2 font-bold text-xs hover:bg-[#074e64] cursor-pointer"
              >
                {isArabic ? `تصفية الجدول لـ ${viewingOrg.nameAr}` : `Filter Table to ${viewingOrg.name}`}
              </button>

              <button
                type="button"
                onClick={() => setViewingOrg(null)}
                className="rounded-lg border border-[#e3e8f9] px-4 py-2 font-semibold text-[#40484d] hover:bg-[#f1f3ff] cursor-pointer"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: RENEW SUBSCRIPTION MODAL
         ======================================================== */}
      {renewingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e3e8f9] animate-in zoom-in-95 my-auto text-xs">
            <div className="flex items-center justify-between border-b border-[#e3e8f9] pb-3.5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#161c27]">
                    {isArabic ? 'تجديد الاشتراك الفندقي للمؤسسة' : 'Renew Organization Subscription'}
                  </h3>
                  <p className="text-xs text-[#70787d]">
                    {isArabic ? renewingSub.propertyNameAr : renewingSub.propertyName} ({isArabic ? renewingSub.organizationNameAr : renewingSub.organizationName})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRenewingSub(null)}
                className="h-8 w-8 rounded-lg hover:bg-[#f1f3ff] text-[#70787d] flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Current Status Box */}
              <div className="bg-[#f9f9ff] rounded-xl p-3.5 border border-[#e3e8f9] flex items-center justify-between">
                <div>
                  <span className="text-[#70787d] block text-[11px]">{isArabic ? 'الباقة الحالية:' : 'Current Plan:'}</span>
                  <span className="font-bold text-[#161c27] text-xs">{renewingSub.planName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#70787d] block text-[11px]">{isArabic ? 'الانتهاء الحالي:' : 'Current Expiry:'}</span>
                  <span className="font-semibold text-amber-700 text-xs">{renewingSub.renewalDate}</span>
                </div>
              </div>

              {/* Renewal Duration Selection */}
              <div>
                <label className="block font-bold text-[#161c27] mb-2">
                  {isArabic ? 'اختر مدة التجديد المطلوبة:' : 'Select Renewal Term:'}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: '1year', title: isArabic ? 'سنة واحدة (موصى بها)' : '1 Year (Advantage)', discount: '15% Off', months: 12 },
                    { id: '2years', title: isArabic ? 'سنتان (خصم المؤسسات)' : '2 Years (Enterprise)', discount: '25% Off', months: 24 },
                    { id: '6months', title: isArabic ? '6 أشهر (نصف سنوي)' : '6 Months (Semi-Annual)', discount: '5% Off', months: 6 },
                    { id: '1month', title: isArabic ? 'شهر واحد (شهري مرن)' : '1 Month (Flexible)', discount: 'Standard', months: 1 },
                  ].map((term) => (
                    <button
                      key={term.id}
                      type="button"
                      onClick={() => setRenewalTerm(term.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        renewalTerm === term.id
                          ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                          : 'border-[#e3e8f9] hover:bg-[#f9f9ff]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#161c27] text-xs">{term.title}</span>
                        {renewalTerm === term.id && <Check className="h-4 w-4 text-emerald-600" />}
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-sm">
                        {term.discount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div>
                <label className="block font-bold text-[#161c27] mb-1.5">
                  {isArabic ? 'طريقة الدفع والتسوية للمؤسسة:' : 'Payment Settlement Method:'}
                </label>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { id: 'Mada Direct Debit', label: 'Mada / Apple Pay' },
                    { id: 'SARIE Wire', label: 'SARIE Bank Wire' },
                    { id: 'SADAD', label: 'SADAD B2B (Code 204)' },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setRenewalPaymentMode(pm.id as any)}
                      className={`p-2 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                        renewalPaymentMode === pm.id
                          ? 'border-[#004a60] bg-[#e8eeff] text-[#004a60] font-bold'
                          : 'border-[#e3e8f9] text-[#70787d] hover:bg-[#f9f9ff]'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-[#f9f9ff] p-3.5 rounded-xl border border-[#e3e8f9] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#70787d]">
                  <span>{isArabic ? 'الرسوم الشهرية للوحدات:' : 'Monthly Rate:'}</span>
                  <span className="font-mono">SAR {renewingSub.mrr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#70787d]">
                  <span>{isArabic ? 'خصم باقة التجديد:' : 'Term Discount:'}</span>
                  <span className="font-mono text-emerald-700">
                    {renewalTerm === '1year' ? '- 15%' : renewalTerm === '2years' ? '- 25%' : renewalTerm === '6months' ? '- 5%' : '0%'}
                  </span>
                </div>
                <div className="flex justify-between text-[#70787d]">
                  <span>{isArabic ? 'ضريبة القيمة المضافة (15% ZATCA):' : 'ZATCA VAT (15%):'}</span>
                  <span className="font-mono">
                    SAR {(renewingSub.mrr * (renewalTerm === '1year' ? 12 * 0.85 : renewalTerm === '2years' ? 24 * 0.75 : renewalTerm === '6months' ? 6 * 0.95 : 1) * 0.15).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#c3cce6] font-bold text-sm text-[#004a60]">
                  <span>{isArabic ? 'المبلغ الإجمالي للتجديد:' : 'Total Renewal Amount:'}</span>
                  <span className="font-mono text-base text-emerald-700">
                    SAR {(renewingSub.mrr * (renewalTerm === '1year' ? 12 * 0.85 : renewalTerm === '2years' ? 24 * 0.75 : renewalTerm === '6months' ? 6 * 0.95 : 1) * 1.15).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="border-t border-[#e3e8f9] pt-4 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRenewingSub(null)}
                className="px-4 py-2 rounded-xl border border-[#e3e8f9] text-[#70787d] hover:bg-gray-100 font-semibold cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmRenewal}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>{isArabic ? 'تأكيد التجديد الفوري' : 'Confirm Renewal'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: SUBSCRIPTION OPTIONS / UPGRADE MODAL
         ======================================================== */}
      {optionsSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e3e8f9] animate-in zoom-in-95 my-auto text-xs">
            <div className="flex items-center justify-between border-b border-[#e3e8f9] pb-3.5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#004a60] text-white flex items-center justify-center font-bold">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#161c27]">
                    {isArabic ? 'خيارات وترقية الاشتراك' : 'Subscription Options & Upgrades'}
                  </h3>
                  <p className="text-xs text-[#70787d]">
                    {isArabic ? optionsSub.propertyNameAr : optionsSub.propertyName} ({optionsSub.organizationName})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOptionsSub(null)}
                className="h-8 w-8 rounded-lg hover:bg-[#f1f3ff] text-[#70787d] flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <label className="block font-bold text-[#161c27] mb-1.5">
                  {isArabic ? 'ترقية / تغيير الباقة الفندقية:' : 'Upgrade / Change Hospitality Plan:'}
                </label>
                <select
                  value={optSelectedPlan}
                  onChange={(e) => setOptSelectedPlan(e.target.value)}
                  className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs font-semibold text-[#161c27] focus:border-[#004a60] outline-hidden"
                >
                  <option value="Hotel Enterprise OS">Hotel Enterprise OS (SAR 45/room/mo)</option>
                  <option value="Luxury Villas & Chalet Pro">Luxury Villas & Chalet Pro (SAR 85/unit/mo)</option>
                  <option value="Serviced Apartments Scale Tier">Serviced Apartments Scale Tier (SAR 35/unit/mo)</option>
                  <option value="Boutique & Heritage Retreats">Boutique & Heritage Retreats (Flat SAR 2,400/mo)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#161c27] mb-1.5">
                  {isArabic ? 'تعديل دورة الفوترة:' : 'Billing Frequency Cycle:'}
                </label>
                <select
                  value={optBillingCycle}
                  onChange={(e) => setOptBillingCycle(e.target.value)}
                  className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs font-semibold text-[#161c27] focus:border-[#004a60] outline-hidden"
                >
                  <option value="Annual Enterprise (Advantage 15%)">Annual Enterprise (Advantage 15% discount)</option>
                  <option value="Quarterly Commercial Plan">Quarterly Commercial Plan (5% discount)</option>
                  <option value="Monthly Key Utility Billing">Monthly Key Utility Billing</option>
                  <option value="Holy Cities Seasonal Peak (Hajj & Umrah)">Holy Cities Seasonal Peak (Hajj & Umrah)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff]">
                <div>
                  <span className="font-bold text-[#161c27] block text-xs">
                    {isArabic ? 'حالة التجديد التلقائي' : 'Auto-Renewal Status'}
                  </span>
                  <span className="text-[10px] text-[#70787d]">
                    {isArabic ? 'تجديد العقد وتحديث شهادة ZATCA تلقائياً للمؤسسة' : 'Auto-renew and refresh ZATCA compliance tokens'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={optAutoRenew}
                  onChange={(e) => setOptAutoRenew(e.target.checked)}
                  className="h-4 w-4 text-[#004a60] rounded-sm focus:ring-[#004a60] cursor-pointer"
                />
              </div>
            </div>

            <div className="border-t border-[#e3e8f9] pt-4 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setOptionsSub(null)}
                className="px-4 py-2 rounded-xl border border-[#e3e8f9] text-[#70787d] hover:bg-gray-100 font-semibold cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveOptions}
                className="px-5 py-2.5 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>{isArabic ? 'حفظ الخيارات' : 'Save Options'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: SUBSCRIPTION DETAILS MODAL
         ======================================================== */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e3e8f9] animate-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between border-b border-[#e3e8f9] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#004a60] text-white flex items-center justify-center font-bold">
                  {selectedSub.propertyType === 'Hotel' ? <Hotel className="h-5 w-5" /> : selectedSub.propertyType === 'Villa' ? <Home className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#161c27]">
                    {isArabic ? selectedSub.propertyNameAr : selectedSub.propertyName}
                  </h3>
                  <p className="text-xs text-[#70787d]">
                    {isArabic ? selectedSub.organizationNameAr : selectedSub.organizationName} • {selectedSub.code} • {selectedSub.city}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="h-8 w-8 rounded-lg hover:bg-[#f1f3ff] text-[#70787d] flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#f9f9ff] p-3 rounded-xl border border-[#e3e8f9] text-xs">
                <div>
                  <span className="text-[#70787d]">{isArabic ? 'المؤسسة المالكة:' : 'Parent Organization:'}</span>
                  <div className="font-bold text-[#161c27]">{selectedSub.organizationName}</div>
                </div>
                <div>
                  <span className="text-[#70787d]">{isArabic ? 'عدد المفاتيح والغرف:' : 'Total Keys/Units:'}</span>
                  <div className="font-bold text-[#004a60]">{selectedSub.keysCount} Keys</div>
                </div>
                <div>
                  <span className="text-[#70787d]">{isArabic ? 'الرسوم الشهرية:' : 'Monthly MRR:'}</span>
                  <div className="font-bold text-emerald-700">SAR {selectedSub.mrr.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-[#70787d]">{isArabic ? 'دورة التجديد:' : 'Renewal Date:'}</span>
                  <div className="font-bold text-[#161c27]">{selectedSub.renewalDate}</div>
                </div>
              </div>

              {/* ZATCA Phase 2 Cryptographic Info */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>ZATCA Phase 2 Fatoora Cryptographic Node</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {selectedSub.zatcaCsid.status}
                  </span>
                </div>
                <div className="text-[11px] text-[#40484d] space-y-1">
                  <div>CSID Identifier: <code className="font-mono text-emerald-800">{selectedSub.zatcaCsid.csidId}</code></div>
                  <div>ZATCA TRN: <span className="font-medium text-[#161c27]">{selectedSub.zatcaTrn}</span></div>
                  <div>Last Synchronized: <span className="text-[#70787d]">{selectedSub.zatcaCsid.lastSynced}</span></div>
                </div>
              </div>

              {/* General Manager Contact */}
              <div className="border-t border-[#e3e8f9] pt-3 text-xs text-[#40484d]">
                <div className="font-bold text-[#161c27] mb-1">General Manager / Operations Lead:</div>
                <div>{selectedSub.generalManager.name} ({selectedSub.generalManager.email})</div>
                <div className="text-[#70787d]">{selectedSub.generalManager.phone}</div>
              </div>
            </div>

            <div className="border-t border-[#e3e8f9] pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const s = selectedSub;
                  setSelectedSub(null);
                  setRenewingSub(s);
                }}
                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>{isArabic ? 'تجديد الاشتراك' : 'Renew Subscription'}</span>
              </button>

              <button
                onClick={() => setSelectedSub(null)}
                className="rounded-lg border border-[#e3e8f9] px-4 py-2 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff] cursor-pointer"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 5: ADD NEW HOSPITALITY SUBSCRIPTION FOR AN ORGANIZATION
         ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e3e8f9] animate-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between border-b border-[#e3e8f9] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#161c27]">
                  {isArabic ? 'إضافة اشتراك جديد لمؤسسة' : 'New Subscription for Organization'}
                </h3>
                <p className="text-xs text-[#70787d]">
                  {isArabic
                    ? 'ربط منشأة فندقية تحت حساب مؤسسة مع إصدار الختم الضريبي لـ ZATCA'
                    : 'Assign a new hospitality property under an enterprise organization account.'}
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="h-8 w-8 rounded-lg hover:bg-[#f1f3ff] text-[#70787d] flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewSubscription} className="py-4 space-y-3.5 text-xs">
              {/* Organization Selection Field */}
              <div>
                <label className="block font-bold text-[#161c27] mb-1">
                  {isArabic ? 'المؤسسة التابعة لها المنشأة:' : 'Assign to Organization:'}
                </label>
                <select
                  value={newSelectedOrgId}
                  onChange={(e) => setNewSelectedOrgId(e.target.value)}
                  className="w-full rounded-lg border border-[#004a60] bg-white px-3 py-2 text-xs font-bold text-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden"
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.code} — {isArabic ? org.nameAr : org.name} ({org.tier})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'اسم المنشأة (English)' : 'Property Name (EN)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newPropName}
                    onChange={(e) => setNewPropName(e.target.value)}
                    placeholder="e.g. AlUla Desert Heritage Resort"
                    className="w-full rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] px-3 py-2 text-xs focus:border-[#004a60] focus:bg-white outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'اسم المنشأة (بالعربية)' : 'Property Name (AR)'}
                  </label>
                  <input
                    type="text"
                    value={newPropNameAr}
                    onChange={(e) => setNewPropNameAr(e.target.value)}
                    placeholder="منتجع تراث العلا الصحراوي"
                    className="w-full rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] px-3 py-2 text-xs focus:border-[#004a60] focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'نوع العقار' : 'Property Type'}
                  </label>
                  <select
                    value={newPropType}
                    onChange={(e) => setNewPropType(e.target.value as any)}
                    className="w-full rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] px-3 py-2 text-xs focus:border-[#004a60] focus:bg-white outline-hidden"
                  >
                    <option value="Hotel">Hotel / Resort</option>
                    <option value="Villa">Luxury Villa Compound</option>
                    <option value="Apartment">Serviced Apartment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'المدينة' : 'Saudi City'}
                  </label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value as any)}
                    className="w-full rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] px-3 py-2 text-xs focus:border-[#004a60] focus:bg-white outline-hidden"
                  >
                    <option value="Riyadh">Riyadh (الرياض)</option>
                    <option value="Jeddah">Jeddah (جدة)</option>
                    <option value="AlUla">AlUla (العلا)</option>
                    <option value="Makkah">Makkah (مكة المكرمة)</option>
                    <option value="Madinah">Madinah (المدينة المنورة)</option>
                    <option value="Al Khobar">Al Khobar (الخبر)</option>
                    <option value="Taif">Taif (الطائف)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'عدد الغرف / المفاتيح' : 'Keys / Units'}
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1000"
                    value={newKeys}
                    onChange={(e) => setNewKeys(e.target.value)}
                    className="w-full rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] px-3 py-2 text-xs focus:border-[#004a60] focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'باقة الضيافة' : 'Selected Plan'}
                  </label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    className="w-full rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] px-3 py-2 text-xs focus:border-[#004a60] focus:bg-white outline-hidden"
                  >
                    <option value="Hotel Enterprise OS">Hotel Enterprise OS</option>
                    <option value="Luxury Villas & Chalet Pro">Luxury Villas & Chalet Pro</option>
                    <option value="Serviced Apartments Scale Tier">Serviced Apartments Scale Tier</option>
                    <option value="Boutique & Heritage Retreats">Boutique & Heritage Retreats</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'دورة الفوترة والتحصيل' : 'Billing Cycle'}
                  </label>
                  <select
                    value={newCycle}
                    onChange={(e) => setNewCycle(e.target.value)}
                    className="w-full rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] px-3 py-2 text-xs focus:border-[#004a60] focus:bg-white outline-hidden"
                  >
                    <option value="Annual Enterprise (Advantage 15%)">Annual (15% Off)</option>
                    <option value="Quarterly Commercial Plan">Quarterly (5% Off)</option>
                    <option value="Monthly Key Utility Billing">Monthly Key Utility</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'اسم مدير المنشأة' : 'General Manager Name'}
                  </label>
                  <input
                    type="text"
                    value={newGmName}
                    onChange={(e) => setNewGmName(e.target.value)}
                    placeholder="e.g. Tariq Al-Mansoor"
                    className="w-full rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] px-3 py-2 text-xs focus:border-[#004a60] focus:bg-white outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'البريد الإلكتروني' : 'GM Email (Login Credential)'}
                  </label>
                  <input
                    type="email"
                    value={newGmEmail}
                    onChange={(e) => setNewGmEmail(e.target.value)}
                    placeholder="gm@resort.sa"
                    className="w-full rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] px-3 py-2 text-xs focus:border-[#004a60] focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              <div className="border-t border-[#e3e8f9] pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-[#e3e8f9] px-4 py-2 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff] cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#004a60] px-4 py-2 text-xs font-semibold text-white hover:bg-[#074e64] shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isArabic ? 'تفعيل الاشتراك وإصدار ZATCA' : 'Provision & Issue CSID'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
