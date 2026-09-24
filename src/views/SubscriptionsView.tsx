import React, { useState } from 'react';
import { PlansCatalogManager } from '../components/PlansCatalogManager';
import { getStoredPlans } from '../data/plansConfig';
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
  TrendingUp,
  X,
} from 'lucide-react';
import {
  HOSPITALITY_PLANS,
  HOSPITALITY_BILLING_CYCLES,
  ACTIVE_HOSPITALITY_SUBSCRIPTIONS,
  HOSPITALITY_COUPONS,
  HOSPITALITY_LIFECYCLE_HISTORY,
  HOSPITALITY_RENEWAL_REMINDERS,
  ActiveHospitalitySubscription,
  HospitalityPlan,
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
  // Tabs:
  // 1: subscriptions_plans ("Subscriptions")
  // 2: subscriptions_cycles ("Billing Cycles")
  // 3: subscriptions_active ("Active Subscriptions")
  // 4: subscriptions_coupons ("Coupons & Discounts")
  // 5: subscriptions_lifecycle ("Lifecycle History")
  // 6: subscriptions_reminders ("Renewal Reminders")

  const [activeTab, setActiveTab] = useState<string>(
    subTab || 'subscriptions_active'
  );

  // Sync if prop changes
  React.useEffect(() => {
    if (subTab) {
      setActiveTab(subTab);
    }
  }, [subTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onSubTabChange) {
      onSubTabChange(tabId);
    }
  };

  // State for active subscriptions list (allows searching & filtering)
  const [activeSubs, setActiveSubs] = useState<ActiveHospitalitySubscription[]>(
    ACTIVE_HOSPITALITY_SUBSCRIPTIONS
  );
  const [typeFilter, setTypeFilter] = useState<'All' | 'Hotel' | 'Villa' | 'Apartment'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending Renewal'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected subscription for detail modal
  const [selectedSub, setSelectedSub] = useState<ActiveHospitalitySubscription | null>(null);

  // Modal to add new property subscription
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPropName, setNewPropName] = useState('');
  const [newPropNameAr, setNewPropNameAr] = useState('');
  const [newPropType, setNewPropType] = useState<'Hotel' | 'Villa' | 'Apartment'>('Hotel');
  const [newCity, setNewCity] = useState<'Riyadh' | 'Jeddah' | 'AlUla' | 'Makkah' | 'Madinah' | 'Al Khobar' | 'Taif'>('Riyadh');
  const [newKeys, setNewKeys] = useState('60');
  const [newPlan, setNewPlan] = useState('Hotel Enterprise OS');
  const [newCycle, setNewCycle] = useState('Annual Enterprise (Advantage 15%)');
  const [newCrn, setNewCrn] = useState('1010' + Math.floor(100000 + Math.random() * 900000));
  const [newTrn, setNewTrn] = useState('310' + Math.floor(1000000000 + Math.random() * 9000000000) + '00003');
  const [newGmName, setNewGmName] = useState('');
  const [newGmEmail, setNewGmEmail] = useState('');

  // Filtered active subscriptions
  const filteredActiveSubs = activeSubs.filter((sub) => {
    const matchesType = typeFilter === 'All' || sub.propertyType === typeFilter;
    const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;
    const matchesSearch =
      sub.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.propertyNameAr.includes(searchQuery) ||
      sub.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleAddNewSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropName) return;

    const keys = parseInt(newKeys, 10) || 50;
    const monthlyRate = newPropType === 'Hotel' ? 42 * keys : newPropType === 'Villa' ? 650 * (keys / 10) : 28 * keys;

    const newSub: ActiveHospitalitySubscription = {
      id: `SUB-HOSP-${Date.now().toString().slice(-4)}`,
      code: newPropName.slice(0, 4).toUpperCase() + '-' + newCity.slice(0, 3).toUpperCase(),
      propertyName: newPropName,
      propertyNameAr: newPropNameAr || newPropName,
      propertyType: newPropType,
      classification: newPropType === 'Hotel' ? '5-Star Resort' : newPropType === 'Villa' ? 'Luxury Private Compound' : 'Serviced Residences',
      city: newCity,
      crNumber: newCrn,
      zatcaTrn: newTrn,
      planName: newPlan,
      keysCount: keys,
      billingCycle: newCycle,
      mrr: monthlyRate,
      annualContractValue: monthlyRate * 12 * 0.85,
      startDate: 'Today',
      renewalDate: '22 Sep 2027',
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
    // Reset form
    setNewPropName('');
    setNewPropNameAr('');
    setNewGmName('');
  };

  const totalManagedKeys = activeSubs.reduce((acc, curr) => acc + curr.keysCount, 0);
  const totalMrr = activeSubs.reduce((acc, curr) => acc + curr.mrr, 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f9f9ff] overflow-y-auto">
      {/* Hospitality OS Header Banner */}
      <div className="bg-gradient-to-r from-[#003647] via-[#004a60] to-[#0d5c75] text-white p-5 lg:p-6 shrink-0 border-b border-[#003647]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-200 border border-emerald-400/30">
                <ShieldCheck className="h-3 w-3" />
                ZATCA Phase 2 Fatoora Certified
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white/80">
                Saudi Tourism Authority Spec
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight">
              {isArabic
                ? 'منظومة إدارة اشتراكات الضيافة السعودية'
                : 'Saudi Hospitality OS - Subscription Cloud'}
            </h1>
            <p className="text-xs text-white/80 mt-1 max-w-2xl leading-relaxed">
              {isArabic
                ? 'نظام تشغيل وإدارة اشتراكات الفنادق، الفلل والشاليهات الخاصة، والشقق الفندقية المخدومة في المملكة مع الامتثال الكامل لمتطلبات هيئة الزكاة والضريبة والجمارك.'
                : 'Operating system for Saudi hospitality. Manage hotels, luxury villas, and serviced apartments with a ZATCA-compliant platform built for scale.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/15">
              <div>
                <div className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
                  {isArabic ? 'إجمالي الغرف / الوحدات' : 'Managed Keys'}
                </div>
                <div className="text-base font-bold text-white flex items-center gap-1">
                  <Key className="h-4 w-4 text-emerald-300" />
                  {totalManagedKeys.toLocaleString()} Keys
                </div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <div className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
                  {isArabic ? 'الإيراد الشهري المتكرر' : 'Platform MRR'}
                </div>
                <div className="text-base font-bold text-emerald-300">
                  SAR {totalMrr.toLocaleString()}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? 'إضافة منشأة / اشتراك جديد' : 'New Hospitality Client'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sitemap Tabs Bar matching prompt */}
      <div className="bg-white border-b border-[#e3e8f9] px-4 lg:px-6 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {[
            {
              id: 'subscriptions_active',
              label: isArabic ? 'الاشتراكات النشطة' : 'Active Subscriptions',
              badge: activeSubs.length.toString(),
              icon: Building2,
            },
            {
              id: 'subscriptions_plans',
              label: isArabic ? 'باقات الاشتراك' : 'Subscriptions',
              badge: HOSPITALITY_PLANS.length.toString(),
              icon: CreditCard,
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
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
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
            TAB 1: ACTIVE SUBSCRIPTIONS
           ======================================================== */}
        {activeTab === 'subscriptions_active' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#e3e8f9] shadow-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#161c27] flex items-center gap-1.5 pr-2">
                  <Filter className="h-3.5 w-3.5 text-[#70787d]" />
                  {isArabic ? 'النوع:' : 'Property Type:'}
                </span>
                {(['All', 'Hotel', 'Villa', 'Apartment'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      typeFilter === type
                        ? 'bg-[#004a60] text-white font-bold'
                        : 'bg-[#f1f3ff] text-[#40484d] hover:bg-[#e8eeff]'
                    }`}
                  >
                    {type === 'All'
                      ? isArabic
                        ? 'الكل'
                        : 'All (8)'
                      : type === 'Hotel'
                      ? isArabic
                        ? 'فنادق ومنتجعات'
                        : 'Hotels (3)'
                      : type === 'Villa'
                      ? isArabic
                        ? 'فلل وشاليهات'
                        : 'Villas & Chalets (3)'
                      : isArabic
                      ? 'شقق مخدومة'
                      : 'Apartments (2)'}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isArabic ? 'بحث باسم الفندق، المدينة، الرمز...' : 'Search hotel, villa, city, CRN...'}
                  className="w-full rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] py-1.5 pl-8 pr-3 text-xs text-[#161c27] placeholder-[#70787d] focus:border-[#004a60] focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Subscriptions Grid/Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredActiveSubs.map((sub) => {
                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSub(sub)}
                    className="cursor-pointer bg-white rounded-xl border border-[#e3e8f9] p-4 shadow-xs hover:shadow-md hover:border-[#004a60]/50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Row: Type & Status */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
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
                          {sub.propertyType} • {sub.city}
                        </span>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            sub.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      {/* Property Title */}
                      <h3 className="text-sm font-bold text-[#161c27] group-hover:text-[#004a60] transition-colors leading-snug">
                        {isArabic ? sub.propertyNameAr : sub.propertyName}
                      </h3>
                      <div className="text-[11px] text-[#70787d] mt-0.5">
                        {sub.classification} • {sub.keysCount} Keys / Rooms
                      </div>

                      {/* Plan & Cycle */}
                      <div className="mt-3 bg-[#f9f9ff] rounded-lg p-2.5 border border-[#e3e8f9]/70 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#70787d]">{isArabic ? 'الباقة:' : 'Plan:'}</span>
                          <span className="font-semibold text-[#161c27]">{sub.planName}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#70787d]">{isArabic ? 'دورة الدفع:' : 'Cycle:'}</span>
                          <span className="font-medium text-[#40484d] truncate max-w-[140px]">{sub.billingCycle}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#70787d]">{isArabic ? 'بوابة ZATCA:' : 'ZATCA Gateway:'}</span>
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 text-[10px]">
                            <ShieldCheck className="h-3 w-3 text-emerald-600" />
                            {sub.zatcaCsid.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom MRR & Action */}
                    <div className="mt-4 pt-3 border-t border-[#e3e8f9] flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-[#70787d] uppercase tracking-wider font-semibold">
                          Monthly Fee
                        </div>
                        <div className="text-sm font-bold text-[#004a60]">
                          SAR {sub.mrr.toLocaleString()} <span className="text-[10px] font-normal text-[#70787d]">/mo</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-[#004a60] group-hover:translate-x-0.5 transition-transform">
                        <span>{isArabic ? 'التفاصيل' : 'Manage'}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: SUBSCRIPTIONS (PLAN CATALOG)
           ======================================================== */}
        {activeTab === 'subscriptions_plans' && (
          <PlansCatalogManager
            isArabic={isArabic}
            onSelectPlanForSubscription={(plan, count) => {
              setNewPlan(plan.name);
              setNewKeys(count.toString());
              setIsAddModalOpen(true);
            }}
          />
        )}

        {/* ========================================================
            TAB 3: BILLING CYCLES
           ======================================================== */}
        {activeTab === 'subscriptions_cycles' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-[#e3e8f9] shadow-xs">
              <h2 className="text-base font-bold text-[#161c27]">
                {isArabic ? 'إدارة دورات الفوترة والتحصيل' : 'Hospitality Billing Cycles & Schedules'}
              </h2>
              <p className="text-xs text-[#70787d]">
                {isArabic
                  ? 'جدولة الفواتير الضريبية الآلية المتوافقة مع هيئة الزكاة والضريبة والجمارك مع خصومات الدفع المقدم'
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
            TAB 4: COUPONS & DISCOUNTS
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
              <button className="rounded-lg bg-[#004a60] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#074e64]">
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
            TAB 5: LIFECYCLE HISTORY (AUDIT)
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
            TAB 6: RENEWAL REMINDERS
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
              <button className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700">
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
                    <button className="text-xs font-bold text-[#004a60] hover:underline flex items-center gap-1">
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

      {/* Selected Subscription Drawer Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e3e8f9] animate-in zoom-in-95">
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
                    {selectedSub.code} • {selectedSub.city} • CRN: {selectedSub.crNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="h-8 w-8 rounded-lg hover:bg-[#f1f3ff] text-[#70787d] flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 bg-[#f9f9ff] p-3 rounded-xl border border-[#e3e8f9] text-xs">
                <div>
                  <span className="text-[#70787d]">{isArabic ? 'الباقة المطبقة:' : 'Current Plan:'}</span>
                  <div className="font-bold text-[#161c27]">{selectedSub.planName}</div>
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

              {/* Features active */}
              <div>
                <div className="text-xs font-bold text-[#161c27] mb-2">
                  {isArabic ? 'الخدمات المفعلة للمنشأة:' : 'Enabled Integration Modules:'}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Channel Manager (OTA Sync)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Assa Abloy IoT Door Locks</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Nafath Guest Verification</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Tourism Municipality Tax (5%)</span>
                  </div>
                </div>
              </div>

              {/* General Manager Contact */}
              <div className="border-t border-[#e3e8f9] pt-3 text-xs text-[#40484d]">
                <div className="font-bold text-[#161c27] mb-1">General Manager / Operations Lead:</div>
                <div>{selectedSub.generalManager.name} ({selectedSub.generalManager.email})</div>
                <div className="text-[#70787d]">{selectedSub.generalManager.phone}</div>
              </div>
            </div>

            <div className="border-t border-[#e3e8f9] pt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedSub(null)}
                className="rounded-lg border border-[#e3e8f9] px-4 py-2 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff]"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
              <button
                onClick={() => {
                  alert(`Invoice generated for ${selectedSub.propertyName}`);
                  setSelectedSub(null);
                }}
                className="rounded-lg bg-[#004a60] px-4 py-2 text-xs font-semibold text-white hover:bg-[#074e64]"
              >
                {isArabic ? 'إصدار فاتورة ضريبية ZATCA' : 'Issue ZATCA Tax Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Hospitality Property Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e3e8f9] animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#e3e8f9] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#161c27]">
                  {isArabic ? 'إضافة منشأة فندقية / اشتراك جديد' : 'New Saudi Hospitality Property Subscription'}
                </h3>
                <p className="text-xs text-[#70787d]">
                  {isArabic
                    ? 'ربط فندق، مجمع فلل، أو شقق مخدومة مع إصدار الختم الضريبي لـ ZATCA Phase 2'
                    : 'Provision hotel, luxury villa compound, or serviced apartment chain.'}
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="h-8 w-8 rounded-lg hover:bg-[#f1f3ff] text-[#70787d] flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewSubscription} className="py-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'اسم المنشأة (English)' : 'Property Name (English)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newPropName}
                    onChange={(e) => setNewPropName(e.target.value)}
                    placeholder="e.g. Al-Faisaliah Royal Suites"
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 focus:border-[#004a60] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'اسم المنشأة (بالعربية)' : 'Property Name (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={newPropNameAr}
                    onChange={(e) => setNewPropNameAr(e.target.value)}
                    placeholder="مثال: أجنحة الفيصلية الملكية"
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 focus:border-[#004a60] focus:outline-hidden"
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
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 focus:border-[#004a60] focus:outline-hidden bg-white"
                  >
                    <option value="Hotel">Hotel / Resort</option>
                    <option value="Villa">Villa / Chalet Compound</option>
                    <option value="Apartment">Serviced Apartments</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'المدينة' : 'KSA City'}
                  </label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value as any)}
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 focus:border-[#004a60] focus:outline-hidden bg-white"
                  >
                    <option value="Riyadh">Riyadh</option>
                    <option value="Jeddah">Jeddah</option>
                    <option value="AlUla">AlUla</option>
                    <option value="Makkah">Makkah</option>
                    <option value="Madinah">Madinah</option>
                    <option value="Al Khobar">Al Khobar</option>
                    <option value="Taif">Taif</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'عدد الغرف / المفاتيح' : 'Keys / Units'}
                  </label>
                  <input
                    type="number"
                    value={newKeys}
                    onChange={(e) => setNewKeys(e.target.value)}
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 focus:border-[#004a60] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'باقة الاشتراك' : 'Subscription Tier'}
                  </label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 focus:border-[#004a60] focus:outline-hidden bg-white"
                  >
                    <optgroup label={isArabic ? 'باقات العقارات والمباني' : 'Property & Building Plans'}>
                      {getStoredPlans().map((sp) => (
                        <option key={sp.id} value={sp.name}>
                          {isArabic ? sp.nameAr : sp.name} ({isArabic ? sp.subtitleAr : sp.subtitle})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label={isArabic ? 'باقات المؤسسات المخصصة' : 'Hospitality Suites'}>
                      {HOSPITALITY_PLANS.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.pricingModel})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'دورة الفوترة' : 'Billing Cycle'}
                  </label>
                  <select
                    value={newCycle}
                    onChange={(e) => setNewCycle(e.target.value)}
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 focus:border-[#004a60] focus:outline-hidden bg-white"
                  >
                    {HOSPITALITY_BILLING_CYCLES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'اسم المدير العام' : 'General Manager Name'}
                  </label>
                  <input
                    type="text"
                    value={newGmName}
                    onChange={(e) => setNewGmName(e.target.value)}
                    placeholder="e.g. Faisal Al-Shehri"
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 focus:border-[#004a60] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'البريد الإلكتروني' : 'GM Official Email'}
                  </label>
                  <input
                    type="email"
                    value={newGmEmail}
                    onChange={(e) => setNewGmEmail(e.target.value)}
                    placeholder="gm@hotel.sa"
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 focus:border-[#004a60] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="rounded-lg bg-emerald-50 p-2.5 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  {isArabic
                    ? 'سيتم توليد شهادة ZATCA CSID التشفيرية وإجراء المصافحة اللحظية مع هيئة الزكاة تلقائياً.'
                    : 'A production ZATCA CSID will be generated and registered automatically.'}
                </span>
              </div>

              <div className="border-t border-[#e3e8f9] pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-[#e3e8f9] px-4 py-2 font-semibold text-[#40484d] hover:bg-[#f1f3ff]"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#004a60] px-5 py-2 font-bold text-white hover:bg-[#074e64]"
                >
                  {isArabic ? 'تفعيل الاشتراك والمنشأة' : 'Provision Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
