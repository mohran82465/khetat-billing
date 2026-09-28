import React, { useState, useMemo } from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Clock,
  ShieldCheck,
  Edit3,
  CheckCircle2,
  Copy,
  Check,
  Building,
  Users,
  Key,
  ExternalLink,
  Save,
  X,
  Share2,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  DollarSign,
  Calendar,
  RefreshCw,
  LayoutGrid,
  List,
  ChevronRight,
  Layers,
  FileText,
  CheckSquare,
  Sparkles,
  Tag,
  ChevronDown,
  Hotel,
  Home,
  AlertCircle,
  Eye,
  ArrowRight,
  Download,
  CreditCard,
  Sliders,
  CheckCircle,
  Smartphone,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';
import {
  HOSPITALITY_ORGANIZATIONS,
  ACTIVE_HOSPITALITY_SUBSCRIPTIONS,
  HOSPITALITY_PLANS,
  HOSPITALITY_BILLING_CYCLES,
  HospitalityOrganization,
  ActiveHospitalitySubscription,
} from '../../data/hospitalityData';
import {
  OrganizationHQ,
  INITIAL_ORGANIZATION_HQ,
  OrganizationBranch,
  OrgContact,
} from '../../data/organizationData';

interface OrganizationProfileTabProps {
  isArabic: boolean;
  branches: OrganizationBranch[];
  contacts: OrgContact[];
  onNavigateToTab?: (tabId: string) => void;
}

export const OrganizationProfileTab: React.FC<OrganizationProfileTabProps> = ({
  isArabic,
  branches,
  contacts,
  onNavigateToTab,
}) => {
  // Organizations state (all organizations that have subscriptions on our website)
  const [organizations, setOrganizations] = useState<HospitalityOrganization[]>(
    HOSPITALITY_ORGANIZATIONS
  );
  const [activeSubs, setActiveSubs] = useState<ActiveHospitalitySubscription[]>(
    ACTIVE_HOSPITALITY_SUBSCRIPTIONS
  );

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState('All');
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | 'Active' | 'Pending Renewal'>('All');
  
  // View mode: Default to LIST TABLE VIEW as explicitly requested by user
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');

  // Inspection Drawer/Modal for an Organization & its Subscriptions
  const [inspectingOrg, setInspectingOrg] = useState<HospitalityOrganization | null>(null);
  const [inspectingTab, setInspectingTab] = useState<'subscriptions' | 'properties' | 'contacts' | 'compliance'>('subscriptions');

  // Add Organization Modal
  const [isAddOrgModalOpen, setIsAddOrgModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgNameAr, setNewOrgNameAr] = useState('');
  const [newOrgTier, setNewOrgTier] = useState<HospitalityOrganization['tier']>('Enterprise Holding');
  const [newOrgLegalType, setNewOrgLegalType] = useState('Saudi Closed Joint Stock Company');
  const [newOrgCr, setNewOrgCr] = useState('');
  const [newOrgVat, setNewOrgVat] = useState('');
  const [newOrgCity, setNewOrgCity] = useState('Riyadh');
  const [newOrgPhone, setNewOrgPhone] = useState('+966 11 ');
  const [newOrgEmail, setNewOrgEmail] = useState('');
  // First subscription for the new org
  const [newSubPropertyName, setNewSubPropertyName] = useState('');
  const [newSubPropertyNameAr, setNewSubPropertyNameAr] = useState('');
  const [newSubPropertyType, setNewSubPropertyType] = useState<'Hotel' | 'Villa' | 'Apartment'>('Hotel');
  const [newSubPlanName, setNewSubPlanName] = useState('Hotel Enterprise OS');
  const [newSubKeys, setNewSubKeys] = useState(120);
  const [newSubBillingCycle, setNewSubBillingCycle] = useState('Annual Enterprise (Advantage 15%)');
  const [newSubPaymentMode, setNewSubPaymentMode] = useState<ActiveHospitalitySubscription['paymentMode']>('SARIE Wire');

  // Host Organization HQ Profile (Khetat) modal / drawer
  const [orgHQ, setOrgHQ] = useState<OrganizationHQ>(INITIAL_ORGANIZATION_HQ);
  const [isHostHQModalOpen, setIsHostHQModalOpen] = useState(false);

  // Copy and Toast notifications
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
    showToast(isArabic ? `تم نسخ ${label}` : `Copied ${label} to clipboard`);
  };

  // Map each organization to its subscriptions
  const orgSubsMap = useMemo(() => {
    const map = new Map<string, ActiveHospitalitySubscription[]>();
    activeSubs.forEach((sub) => {
      const list = map.get(sub.organizationId) || [];
      list.push(sub);
      map.set(sub.organizationId, list);
    });
    return map;
  }, [activeSubs]);

  // Aggregate KPI stats across all subscribed organizations
  const stats = useMemo(() => {
    const totalOrgs = organizations.length;
    const totalSubs = activeSubs.length;
    const totalKeys = activeSubs.reduce((acc, s) => acc + s.keysCount, 0);
    const totalMRR = activeSubs.reduce((acc, s) => acc + s.mrr, 0);
    const totalARR = activeSubs.reduce((acc, s) => acc + s.annualContractValue, 0);
    const clearedCsidCount = activeSubs.filter((s) => s.zatcaCsid.status === 'Valid & Cleared').length;
    return { totalOrgs, totalSubs, totalKeys, totalMRR, totalARR, clearedCsidCount };
  }, [organizations, activeSubs]);

  // Filtered organizations
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const orgSubs = orgSubsMap.get(org.id) || [];
      
      // Tier filter
      if (selectedTierFilter !== 'All' && org.tier !== selectedTierFilter) {
        return false;
      }

      // City filter
      if (selectedCityFilter !== 'All' && org.city.toLowerCase() !== selectedCityFilter.toLowerCase()) {
        return false;
      }

      // Status filter
      if (selectedStatusFilter !== 'All') {
        const hasStatus = orgSubs.some((s) => s.status === selectedStatusFilter);
        if (!hasStatus) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesOrg =
          org.name.toLowerCase().includes(query) ||
          org.nameAr.includes(query) ||
          org.crNumber.includes(query) ||
          org.taxNumber.includes(query) ||
          org.city.toLowerCase().includes(query) ||
          org.code.toLowerCase().includes(query);

        const matchesSubProperty = orgSubs.some(
          (s) =>
            s.propertyName.toLowerCase().includes(query) ||
            s.propertyNameAr.includes(query) ||
            s.planName.toLowerCase().includes(query)
        );

        if (!matchesOrg && !matchesSubProperty) {
          return false;
        }
      }

      return true;
    });
  }, [organizations, orgSubsMap, selectedTierFilter, selectedCityFilter, selectedStatusFilter, searchQuery]);

  // Handle Registering a new subscribed organization
  const handleCreateOrganizationWithSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName || !newOrgCr) {
      showToast(isArabic ? 'يرجى إدخال اسم المؤسسة ورقم السجل التجاري' : 'Please provide organization name and CR number');
      return;
    }

    const orgId = `ORG-${newOrgName.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const newOrg: HospitalityOrganization = {
      id: orgId,
      code: newOrgName.substring(0, 3).toUpperCase(),
      name: newOrgName,
      nameAr: newOrgNameAr || newOrgName,
      legalType: newOrgLegalType,
      crNumber: newOrgCr,
      taxNumber: newOrgVat || `310${Math.floor(100000000 + Math.random() * 900000000)}00003`,
      city: newOrgCity,
      tier: newOrgTier,
      tierAr:
        newOrgTier === 'Enterprise Holding'
          ? 'مجموعة قابضة كبرى'
          : newOrgTier === 'Hotel Chain'
          ? 'سلسلة فنادق'
          : newOrgTier === 'Asset Management'
          ? 'إدارة أصول عقارية'
          : 'مشغل بوتيك',
      totalManagedKeys: newSubKeys,
      billingEmail: newOrgEmail || `accounts@${newOrgName.toLowerCase().replace(/[^a-z0-9]/g, '')}.sa`,
      phone: newOrgPhone || '+966 11 000 0000',
      logoBadge: newOrgName.substring(0, 3).toUpperCase(),
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-300',
    };

    // Calculate subscription MRR based on plan
    const perKeyPrice = newSubPlanName.includes('Enterprise') ? 42 : newSubPlanName.includes('Apartment') ? 28 : 25;
    const computedMRR = newSubPropertyType === 'Villa' ? 6500 : newSubKeys * perKeyPrice;
    const computedARR = computedMRR * 12 * 0.85;

    const subId = `SUB-HOSP-${Math.floor(200 + Math.random() * 800)}`;
    const newSub: ActiveHospitalitySubscription = {
      id: subId,
      code: `${newOrg.code}-${(newSubPropertyName || 'PROP').substring(0, 4).toUpperCase()}`,
      organizationId: orgId,
      organizationName: newOrg.name,
      organizationNameAr: newOrg.nameAr,
      organizationTier: newOrg.tier,
      organizationBadgeColor: newOrg.badgeColor,
      propertyName: newSubPropertyName || `${newOrg.name} Premier Hotel`,
      propertyNameAr: newSubPropertyNameAr || `فندق ${newOrg.nameAr}`,
      propertyType: newSubPropertyType,
      classification: '5-Star Resort',
      city: (newOrgCity as any) || 'Riyadh',
      crNumber: newOrg.crNumber,
      zatcaTrn: newOrg.taxNumber,
      planName: newSubPlanName,
      keysCount: newSubKeys,
      billingCycle: newSubBillingCycle,
      mrr: computedMRR,
      annualContractValue: Math.round(computedARR),
      startDate: '27 Sep 2026',
      renewalDate: '27 Sep 2027',
      status: 'Active',
      paymentMode: newSubPaymentMode,
      zatcaCsid: {
        status: 'Valid & Cleared',
        csidId: `ZTC-${newOrg.code}-2026-PRD`,
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
        name: 'Managing Director / GM',
        email: newOrgEmail || 'gm@hospitality.sa',
        phone: newOrgPhone || '+966 50 000 0000',
      },
    };

    setOrganizations((prev) => [newOrg, ...prev]);
    setActiveSubs((prev) => [newSub, ...prev]);
    setIsAddOrgModalOpen(false);

    // Reset fields
    setNewOrgName('');
    setNewOrgNameAr('');
    setNewOrgCr('');
    setNewOrgVat('');
    setNewOrgEmail('');
    setNewSubPropertyName('');
    setNewSubPropertyNameAr('');

    showToast(
      isArabic
        ? `تم تسجيل المؤسسة المشتركة "${newOrg.nameAr}" واشتراكها الفندقي بنجاح!`
        : `Successfully registered organization "${newOrg.name}" and created subscription!`
    );
  };

  // Quick renewal action
  const handleQuickRenewSub = (subId: string) => {
    setActiveSubs((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: 'Active', renewalDate: '30 Sep 2027' } : s))
    );
    showToast(
      isArabic
        ? 'تم تجديد الاشتراك السنوي واعتماد فاتورة ZATCA بنجاح'
        : 'Subscription successfully renewed & ZATCA invoice cleared'
    );
  };

  return (
    <div className="space-y-5" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#004a60] text-white px-4 py-2.5 shadow-xl border border-white/20 text-xs font-semibold animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Subscribed Organizations on our Website */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 lg:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-[#004a60] to-[#085a73] text-white flex items-center justify-center shrink-0 shadow-md">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {isArabic ? 'منصة الاشتراكات متعددة المؤسسات' : 'Multi-Tenant Subscriptions Platform'}
                </span>
                <span className="text-[10px] font-semibold bg-[#e8eeff] text-[#004a60] px-2.5 py-0.5 rounded-full">
                  {isArabic ? 'تراخيص معتمدة ZATCA Phase 2' : 'ZATCA Phase 2 Cleared'}
                </span>
                <span className="text-[10px] font-medium bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {isArabic ? `${stats.totalOrgs} مؤسسات وشركات مشتركة` : `${stats.totalOrgs} Subscribed Organizations`}
                </span>
              </div>
              <h1 className="text-xl font-bold text-[#161c27] mt-1.5">
                {isArabic ? 'المؤسسات والشركات المشتركة في المنصة' : 'Subscribed Client Organizations'}
              </h1>
              <p className="text-xs text-[#70787d] mt-1 max-w-2xl leading-relaxed">
                {isArabic
                  ? 'عرض وإدارة كافة المجموعات والشركات الفندقية التي لديها اشتراكات نشطة وتراخيص إدارة منشآت على موقعنا، مع تتبع السجلات التجارية، الفروع، وقيم الاشتراكات الشهرية والسنوية.'
                  : 'Directory of enterprise client organizations and hotel groups that have active subscriptions, property management licenses, and ZATCA Phase 2 clearance on our website.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
            <button
              type="button"
              onClick={() => setIsHostHQModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-[#e3e8f9] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff] transition-all cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-[#004a60]" />
              <span>{isArabic ? 'بيانات مقر المنصة الرئيسي' : 'Platform HQ Profile'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddOrgModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white px-4 py-2.5 text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? 'تسجيل مؤسسة واشتراك جديد' : 'Register Subscribed Org'}</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-5 border-t border-[#e3e8f9]">
          <div className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
            <div className="text-[11px] text-[#70787d] font-semibold flex items-center justify-between">
              <span>{isArabic ? 'المؤسسات المشتركة' : 'Subscribed Orgs'}</span>
              <Building2 className="h-4 w-4 text-[#004a60]" />
            </div>
            <div className="text-xl font-bold text-[#161c27] mt-1">
              {stats.totalOrgs}
            </div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
              {isArabic ? 'شركات فندقية ومجموعات كبرى' : 'Enterprise Groups & Chains'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
            <div className="text-[11px] text-[#70787d] font-semibold flex items-center justify-between">
              <span>{isArabic ? 'الاشتراكات النشطة' : 'Active Subscriptions'}</span>
              <CreditCard className="h-4 w-4 text-[#004a60]" />
            </div>
            <div className="text-xl font-bold text-[#161c27] mt-1">
              {stats.totalSubs}
            </div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
              {isArabic ? 'فنادق ومنتجعات وشقق' : 'Hotels, Resorts & Apartments'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
            <div className="text-[11px] text-[#70787d] font-semibold flex items-center justify-between">
              <span>{isArabic ? 'إجمالي الغرف والوحدات' : 'Subscribed Keys'}</span>
              <Key className="h-4 w-4 text-[#004a60]" />
            </div>
            <div className="text-xl font-bold text-[#161c27] mt-1">
              {stats.totalKeys.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#70787d] font-medium mt-0.5">
              {isArabic ? 'غرفة ووحدة فندقية مرخصة' : 'Managed room keys in KSA'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
            <div className="text-[11px] text-[#70787d] font-semibold flex items-center justify-between">
              <span>{isArabic ? 'الإيراد الشهري (MRR)' : 'Monthly Recurring (MRR)'}</span>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-emerald-700 mt-1">
              SAR {stats.totalMRR.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#70787d] font-medium mt-0.5">
              ARR: SAR {stats.totalARR.toLocaleString()}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
            <div className="text-[11px] text-[#70787d] font-semibold flex items-center justify-between">
              <span>{isArabic ? 'امتثال ZATCA Phase 2' : 'ZATCA Compliance'}</span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-emerald-700 mt-1">
              100%
            </div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
              {isArabic ? 'عقد ربط وتوقيع مشفر سليم' : 'All CSID Nodes Cleared'}
            </div>
          </div>
        </div>
      </div>

      {/* Controls: Search, Filters, and View Mode Toggle */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-[#70787d] ${isArabic ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isArabic
                  ? 'البحث باسم المؤسسة، السجل التجاري (CR)، الرقم الضريبي، المدينة، أو اسم الفندق...'
                  : 'Search by organization name, CR number, VAT TRN, city, or property...'
              }
              className={`w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] py-2 text-xs text-[#161c27] placeholder-[#70787d] focus:border-[#004a60] focus:bg-white focus:outline-hidden transition-all ${
                isArabic ? 'pr-9 pl-4' : 'pl-9 pr-4'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={`absolute top-1/2 -translate-y-1/2 text-xs text-[#70787d] hover:text-[#161c27] ${
                  isArabic ? 'left-3' : 'right-3'
                }`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filters & View Mode */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* City Dropdown */}
            <select
              value={selectedCityFilter}
              onChange={(e) => setSelectedCityFilter(e.target.value)}
              className="rounded-xl border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-medium text-[#40484d] focus:border-[#004a60] focus:outline-hidden"
            >
              <option value="All">{isArabic ? 'كافة المدن' : 'All Cities'}</option>
              <option value="Riyadh">{isArabic ? 'الرياض' : 'Riyadh'}</option>
              <option value="Jeddah">{isArabic ? 'جدة' : 'Jeddah'}</option>
              <option value="AlUla">{isArabic ? 'العلا' : 'AlUla'}</option>
              <option value="Makkah">{isArabic ? 'مكة المكرمة' : 'Makkah'}</option>
              <option value="Madinah">{isArabic ? 'المدينة المنورة' : 'Madinah'}</option>
              <option value="Al Khobar">{isArabic ? 'الخبر' : 'Al Khobar'}</option>
              <option value="Red Sea">{isArabic ? 'مشروع البحر الأحمر' : 'Red Sea'}</option>
              <option value="Taif">{isArabic ? 'الطائف' : 'Taif'}</option>
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className="rounded-xl border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-medium text-[#40484d] focus:border-[#004a60] focus:outline-hidden"
            >
              <option value="All">{isArabic ? 'كافة حالات الاشتراك' : 'All Statuses'}</option>
              <option value="Active">{isArabic ? 'اشتراك نشط' : 'Active Subscription'}</option>
              <option value="Pending Renewal">{isArabic ? 'بانتظار التجديد' : 'Pending Renewal'}</option>
            </select>

            {/* View Mode Toggle: List Table View (Default) vs Cards */}
            <div className="flex items-center bg-[#f1f3ff] p-1 rounded-xl border border-[#e3e8f9]">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                title="List Table View"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-[#004a60] shadow-2xs'
                    : 'text-[#70787d] hover:text-[#161c27]'
                }`}
              >
                <List className="h-3.5 w-3.5" />
                <span>{isArabic ? 'جدول القائمة' : 'List Table'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                title="Cards Grid View"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white text-[#004a60] shadow-2xs'
                    : 'text-[#70787d] hover:text-[#161c27]'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>{isArabic ? 'بطاقات' : 'Cards'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tier Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 no-scrollbar">
          <span className="text-[11px] font-semibold text-[#70787d] shrink-0 mr-1">
            {isArabic ? 'تصنيف المؤسسة:' : 'Organization Tier:'}
          </span>
          {[
            { id: 'All', label: 'All Organizations', labelAr: 'كافة المؤسسات' },
            { id: 'Enterprise Holding', label: 'Enterprise Holdings', labelAr: 'مجموعات قابضة كبرى' },
            { id: 'Hotel Chain', label: 'Hotel Chains', labelAr: 'سلاسل فندقية' },
            { id: 'Asset Management', label: 'Asset Management', labelAr: 'إدارة أصول عقارية' },
            { id: 'Boutique Operator', label: 'Boutique Operators', labelAr: 'مشغلو منتجعات بوتيك' },
          ].map((tier) => {
            const isSelected = selectedTierFilter === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedTierFilter(tier.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#004a60] text-white shadow-2xs'
                    : 'bg-[#f1f3ff] text-[#40484d] hover:bg-[#e3e8f9]'
                }`}
              >
                {isArabic ? tier.labelAr : tier.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* RESULTS COUNT */}
      <div className="flex items-center justify-between px-1 text-xs text-[#70787d]">
        <div>
          {isArabic ? (
            <>
              عرض <strong className="text-[#161c27]">{filteredOrganizations.length}</strong> من أصل{' '}
              <strong>{organizations.length}</strong> مؤسسة مشتركة على الموقع
            </>
          ) : (
            <>
              Showing <strong className="text-[#161c27]">{filteredOrganizations.length}</strong> of{' '}
              <strong>{organizations.length}</strong> subscribed organizations on website
            </>
          )}
        </div>
        <div className="text-[11px] flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>{isArabic ? 'كافة العقود مشفرة ومطابقة لأنظمة ZATCA' : 'All subscriptions ZATCA certified'}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. PRIMARY VIEW: LIST TABLE VIEW (As requested by user)                   */}
      {/* ========================================================================= */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#161c27]">
              <thead className="bg-[#f9f9ff] text-[11px] font-bold text-[#70787d] uppercase tracking-wider border-b border-[#e3e8f9]">
                <tr>
                  <th className="py-3 px-4">{isArabic ? 'المؤسسة المشتركة' : 'Subscribed Organization'}</th>
                  <th className="py-3 px-4">{isArabic ? 'السجل والرقم الضريبي' : 'CR & ZATCA TRN'}</th>
                  <th className="py-3 px-4">{isArabic ? 'الاشتراكات الفندقية على الموقع' : 'Subscriptions on Website'}</th>
                  <th className="py-3 px-4 text-center">{isArabic ? 'الغرف والوحدات' : 'Managed Keys'}</th>
                  <th className="py-3 px-4">{isArabic ? 'الرسوم الشهرية والسنوية' : 'MRR / Contract Value'}</th>
                  <th className="py-3 px-4">{isArabic ? 'دورة الفوترة والدفع' : 'Billing Cycle & Pay'}</th>
                  <th className="py-3 px-4">{isArabic ? 'تاريخ التجديد القادم' : 'Next Renewal'}</th>
                  <th className="py-3 px-4 text-center">{isArabic ? 'حالة ZATCA' : 'ZATCA Status'}</th>
                  <th className="py-3 px-4 text-right">{isArabic ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8f9]">
                {filteredOrganizations.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[#70787d]">
                      <Building2 className="h-10 w-10 text-[#70787d]/40 mx-auto mb-2" />
                      <p className="text-sm font-semibold">{isArabic ? 'لا توجد مؤسسات مطابقة لخيارات البحث' : 'No matching subscribed organizations found'}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedTierFilter('All');
                          setSelectedCityFilter('All');
                          setSelectedStatusFilter('All');
                        }}
                        className="mt-2 text-xs font-bold text-[#004a60] hover:underline"
                      >
                        {isArabic ? 'إعادة ضبط عوامل التصفية' : 'Reset all filters'}
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredOrganizations.map((org) => {
                    const orgSubs = orgSubsMap.get(org.id) || [];
                    const orgKeys = orgSubs.reduce((acc, s) => acc + s.keysCount, 0);
                    const orgMRR = orgSubs.reduce((acc, s) => acc + s.mrr, 0);
                    const orgARR = orgSubs.reduce((acc, s) => acc + s.annualContractValue, 0);
                    const hasPendingRenewal = orgSubs.some((s) => s.status === 'Pending Renewal');
                    const primarySub = orgSubs[0];

                    return (
                      <tr
                        key={org.id}
                        className="hover:bg-[#f9f9ff] transition-colors group cursor-pointer"
                        onClick={() => setInspectingOrg(org)}
                      >
                        {/* 1. Organization info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-xl ${org.badgeColor} flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs border`}>
                              {org.logoBadge}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-[#161c27] text-xs hover:text-[#004a60]">
                                  {isArabic ? org.nameAr : org.name}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#e8eeff] text-[#004a60] font-semibold">
                                  {org.city}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#70787d] truncate">
                                {isArabic ? org.name : org.nameAr}
                              </div>
                              <div className="text-[10px] text-[#70787d] font-mono mt-0.5">
                                {org.tier}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. CR and Tax ID */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="space-y-0.5 font-mono text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#70787d] text-[10px]">CR:</span>
                              <span className="font-bold text-[#161c27]">{org.crNumber}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(org.crNumber, `CR ${org.name}`);
                                }}
                                className="text-[#70787d] hover:text-[#004a60]"
                                title="Copy CR Number"
                              >
                                {copiedField === `CR ${org.name}` ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-[#70787d]">
                              <span>VAT:</span>
                              <span className="font-mono text-[10px]">{org.taxNumber.substring(0, 10)}...</span>
                              <span title="ZATCA Verified">
                                <CheckCircle className="h-3 w-3 text-emerald-600" />
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 3. Subscriptions on website */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1 max-w-xs">
                            {orgSubs.slice(0, 2).map((sub) => (
                              <div
                                key={sub.id}
                                className="flex items-center gap-1.5 bg-[#f1f3ff] px-2 py-0.5 rounded-md text-[10px] border border-[#e3e8f9]"
                              >
                                {sub.propertyType === 'Hotel' ? (
                                  <Hotel className="h-3 w-3 text-[#004a60] shrink-0" />
                                ) : sub.propertyType === 'Villa' ? (
                                  <Home className="h-3 w-3 text-amber-600 shrink-0" />
                                ) : (
                                  <Layers className="h-3 w-3 text-indigo-600 shrink-0" />
                                )}
                                <span className="font-semibold text-[#161c27] truncate">
                                  {isArabic ? sub.propertyNameAr : sub.propertyName}
                                </span>
                                <span className="text-[#70787d] shrink-0 font-medium">
                                  ({sub.planName.split(' ')[0]})
                                </span>
                              </div>
                            ))}
                            {orgSubs.length > 2 && (
                              <div className="text-[10px] text-[#004a60] font-bold">
                                +{orgSubs.length - 2} {isArabic ? 'اشتراكات إضافية' : 'more subscriptions'}
                              </div>
                            )}
                            {orgSubs.length === 0 && (
                              <span className="text-[11px] text-[#70787d] italic">
                                {isArabic ? 'لا توجد اشتراكات نشطة' : 'No active subscriptions'}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 4. Total Keys */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 bg-[#f9f9ff] px-2.5 py-1 rounded-lg border border-[#e3e8f9] font-bold text-xs text-[#004a60]">
                            <Key className="h-3.5 w-3.5" />
                            <span>{orgKeys}</span>
                          </div>
                          <div className="text-[10px] text-[#70787d] mt-0.5">
                            {isArabic ? 'غرفة/وحدة' : 'keys/units'}
                          </div>
                        </td>

                        {/* 5. MRR & ARR */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-xs text-emerald-700">
                            SAR {orgMRR.toLocaleString()}
                            <span className="text-[10px] font-normal text-[#70787d]">/mo</span>
                          </div>
                          <div className="text-[10px] text-[#70787d] font-mono">
                            ACV: SAR {orgARR.toLocaleString()}
                          </div>
                        </td>

                        {/* 6. Billing cycle */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="text-[11px] font-semibold text-[#161c27]">
                            {primarySub?.billingCycle?.includes('Annual')
                              ? isArabic
                                ? 'اشتراك سنوي (خصم 15%)'
                                : 'Annual Enterprise'
                              : primarySub?.billingCycle?.includes('Quarterly')
                              ? isArabic
                                ? 'اشتراك ربع سنوي'
                                : 'Quarterly'
                              : isArabic
                              ? 'اشتراك شهري'
                              : 'Monthly Cycle'}
                          </div>
                          <div className="text-[10px] text-[#70787d] flex items-center gap-1 mt-0.5">
                            <CreditCard className="h-3 w-3" />
                            <span>{primarySub?.paymentMode || 'SARIE Wire'}</span>
                          </div>
                        </td>

                        {/* 7. Next renewal date */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-mono text-xs font-semibold text-[#161c27]">
                            {primarySub?.renewalDate || '—'}
                          </div>
                          {hasPendingRenewal ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mt-0.5">
                              <Clock className="h-3 w-3" />
                              <span>{isArabic ? 'مستحق التجديد' : 'Due Soon'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-0.5">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>{isArabic ? 'سارٍ ونشط' : 'Active'}</span>
                            </span>
                          )}
                        </td>

                        {/* 8. ZATCA clearance */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                            <span>{isArabic ? 'مطابق ومعتمد' : 'Valid CSID'}</span>
                          </span>
                        </td>

                        {/* 9. Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => {
                                setInspectingOrg(org);
                                setInspectingTab('subscriptions');
                              }}
                              className="flex items-center gap-1 rounded-lg bg-[#004a60] hover:bg-[#085a73] text-white px-2.5 py-1.5 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                              title="View Subscriptions"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>{isArabic ? 'الاشتراكات' : 'Subs'}</span>
                            </button>
                            {hasPendingRenewal && primarySub && (
                              <button
                                type="button"
                                onClick={() => handleQuickRenewSub(primarySub.id)}
                                className="flex items-center gap-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white px-2 py-1.5 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                                title="Renew Subscription"
                              >
                                <RefreshCw className="h-3 w-3" />
                                <span>{isArabic ? 'تجديد' : 'Renew'}</span>
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ALTERNATIVE VIEW: CARDS GRID VIEW                                      */}
      {/* ========================================================================= */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrganizations.map((org) => {
            const orgSubs = orgSubsMap.get(org.id) || [];
            const orgKeys = orgSubs.reduce((acc, s) => acc + s.keysCount, 0);
            const orgMRR = orgSubs.reduce((acc, s) => acc + s.mrr, 0);
            const orgARR = orgSubs.reduce((acc, s) => acc + s.annualContractValue, 0);
            const hasPendingRenewal = orgSubs.some((s) => s.status === 'Pending Renewal');

            return (
              <div
                key={org.id}
                className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-11 w-11 rounded-xl ${org.badgeColor} flex items-center justify-center font-bold text-sm shrink-0 border shadow-2xs`}>
                        {org.logoBadge}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#161c27] text-sm leading-tight">
                          {isArabic ? org.nameAr : org.name}
                        </h3>
                        <p className="text-[11px] text-[#70787d] mt-0.5">
                          {isArabic ? org.name : org.nameAr}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold bg-[#e8eeff] text-[#004a60] px-2 py-0.5 rounded-full shrink-0">
                      {org.city}
                    </span>
                  </div>

                  {/* Legal & CR Strip */}
                  <div className="mt-3.5 pt-3 border-t border-[#e3e8f9] grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-[#f9f9ff] p-2 rounded-lg border border-[#e3e8f9]">
                      <span className="text-[10px] text-[#70787d] block">CR Number</span>
                      <span className="font-bold text-[#161c27]">{org.crNumber}</span>
                    </div>
                    <div className="bg-[#f9f9ff] p-2 rounded-lg border border-[#e3e8f9]">
                      <span className="text-[10px] text-[#70787d] block">Keys Capacity</span>
                      <span className="font-bold text-[#004a60]">{orgKeys} Keys</span>
                    </div>
                  </div>

                  {/* Active Subscriptions list inside card */}
                  <div className="mt-3 space-y-1.5">
                    <div className="text-[11px] font-bold text-[#70787d] flex items-center justify-between">
                      <span>{isArabic ? 'الاشتراكات الفندقية على الموقع:' : 'Subscriptions on Website:'}</span>
                      <span className="text-[10px] bg-[#004a60]/10 text-[#004a60] px-1.5 py-0.2 rounded-md font-bold">
                        {orgSubs.length} {orgSubs.length === 1 ? 'Subscription' : 'Subs'}
                      </span>
                    </div>
                    {orgSubs.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-2 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9] flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-bold text-[#161c27] truncate text-[11px]">
                            {isArabic ? sub.propertyNameAr : sub.propertyName}
                          </div>
                          <div className="text-[10px] text-[#70787d]">
                            {sub.planName} • {sub.keysCount} Keys
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold text-emerald-700 text-xs font-mono">
                            SAR {sub.mrr.toLocaleString()}
                          </div>
                          <div className="text-[9px] text-[#70787d]">per month</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Financial summary bar */}
                  <div className="mt-4 p-2.5 rounded-xl bg-[#f1f3ff] border border-[#e3e8f9] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#70787d] font-medium">{isArabic ? 'إجمالي الاشتراك الشهري' : 'Total Monthly MRR'}</div>
                      <div className="text-sm font-bold text-emerald-700">SAR {orgMRR.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-[#70787d] font-medium">{isArabic ? 'قيمة العقد السنوي' : 'Annual Run Rate'}</div>
                      <div className="text-xs font-bold text-[#161c27]">SAR {orgARR.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-[#e3e8f9] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>ZATCA CSID Cleared</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setInspectingOrg(org);
                      setInspectingTab('subscriptions');
                    }}
                    className="flex items-center gap-1 rounded-xl bg-[#004a60] hover:bg-[#085a73] text-white px-3 py-1.5 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  >
                    <span>{isArabic ? 'عرض الاشتراكات' : 'View Subscriptions'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ORGANIZATION & SUBSCRIPTIONS DEEP INSPECTION DRAWER/MODAL              */}
      {/* ========================================================================= */}
      {inspectingOrg && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="bg-[#f9f9ff] border-b border-[#e3e8f9] p-5 sm:p-6 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className={`h-14 w-14 rounded-2xl ${inspectingOrg.badgeColor} flex items-center justify-center font-bold text-base shadow-xs border`}>
                    {inspectingOrg.logoBadge}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-[#161c27]">
                        {isArabic ? inspectingOrg.nameAr : inspectingOrg.name}
                      </h2>
                      <span className="text-[10px] font-bold bg-[#e8eeff] text-[#004a60] px-2 py-0.5 rounded-full">
                        {inspectingOrg.city}
                      </span>
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                        {inspectingOrg.tier}
                      </span>
                    </div>
                    <p className="text-xs text-[#70787d] mt-0.5">
                      {isArabic ? inspectingOrg.name : inspectingOrg.nameAr} • {inspectingOrg.legalType}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectingOrg(null)}
                  className="rounded-xl p-2 text-[#70787d] hover:bg-[#e3e8f9] hover:text-[#161c27] transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sub-Tabs within Organization inspection */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#e3e8f9] overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setInspectingTab('subscriptions')}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    inspectingTab === 'subscriptions'
                      ? 'bg-[#004a60] text-white shadow-2xs'
                      : 'text-[#40484d] hover:bg-[#e8eeff]'
                  }`}
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>{isArabic ? 'الاشتراكات الفندقية على الموقع' : 'Active Subscriptions on Website'}</span>
                  <span className="rounded-full bg-white/20 text-white px-1.5 py-0.2 text-[10px]">
                    {(orgSubsMap.get(inspectingOrg.id) || []).length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectingTab('properties')}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    inspectingTab === 'properties'
                      ? 'bg-[#004a60] text-white shadow-2xs'
                      : 'text-[#40484d] hover:bg-[#e8eeff]'
                  }`}
                >
                  <Building className="h-3.5 w-3.5" />
                  <span>{isArabic ? 'الفنادق والفروع المشتركة' : 'Properties & Locations'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectingTab('compliance')}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    inspectingTab === 'compliance'
                      ? 'bg-[#004a60] text-white shadow-2xs'
                      : 'text-[#40484d] hover:bg-[#e8eeff]'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{isArabic ? 'بيانات السجل والامتثال (ZATCA)' : 'ZATCA Compliance & Tax'}</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* TAB 1: ACTIVE SUBSCRIPTIONS */}
              {inspectingTab === 'subscriptions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#161c27]">
                        {isArabic
                          ? `الاشتراكات المرخصة لـ ${inspectingOrg.nameAr}`
                          : `Licensed Subscriptions for ${inspectingOrg.name}`}
                      </h4>
                      <p className="text-xs text-[#70787d]">
                        {isArabic
                          ? 'تفاصيل باقات الفنادق، الشقق، والشاليهات المشتركة، مع أرقام الغرف ومواعيد التجديد.'
                          : 'Details of all hotel, apartment, and villa subscriptions with key allocations and billing cycle.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNewSubPropertyName(`${inspectingOrg.name} New Property`);
                        setNewSubPropertyNameAr(`منشأة جديدة لـ ${inspectingOrg.nameAr}`);
                        setIsAddOrgModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-[#004a60] hover:bg-[#085a73] text-white px-3 py-1.5 text-xs font-bold shadow-2xs cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{isArabic ? 'إضافة اشتراك فندقي' : 'Add Property Subscription'}</span>
                    </button>
                  </div>

                  {/* List of subscriptions */}
                  <div className="space-y-3">
                    {(orgSubsMap.get(inspectingOrg.id) || []).map((sub) => (
                      <div
                        key={sub.id}
                        className="bg-white rounded-xl border border-[#e3e8f9] p-4 shadow-2xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-xl bg-[#f1f3ff] text-[#004a60] flex items-center justify-center shrink-0">
                              {sub.propertyType === 'Hotel' ? (
                                <Hotel className="h-5 w-5" />
                              ) : sub.propertyType === 'Villa' ? (
                                <Home className="h-5 w-5 text-amber-600" />
                              ) : (
                                <Layers className="h-5 w-5 text-indigo-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="font-bold text-sm text-[#161c27]">
                                  {isArabic ? sub.propertyNameAr : sub.propertyName}
                                </h5>
                                <span className="text-[10px] font-semibold bg-[#e8eeff] text-[#004a60] px-2 py-0.5 rounded-md">
                                  {sub.classification}
                                </span>
                                <span className="text-[10px] font-mono text-[#70787d]">
                                  {sub.code}
                                </span>
                              </div>
                              <p className="text-xs text-[#70787d] mt-0.5">
                                {sub.planName} • {sub.keysCount} {isArabic ? 'غرفة/وحدة' : 'room keys'} • {sub.city}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 sm:self-center">
                            <div className="text-right">
                              <div className="text-sm font-bold text-emerald-700">
                                SAR {sub.mrr.toLocaleString()}
                                <span className="text-[10px] text-[#70787d] font-normal"> /mo</span>
                              </div>
                              <div className="text-[10px] text-[#70787d]">
                                ACV: SAR {sub.annualContractValue.toLocaleString()}
                              </div>
                            </div>
                            {sub.status === 'Pending Renewal' ? (
                              <button
                                type="button"
                                onClick={() => handleQuickRenewSub(sub.id)}
                                className="flex items-center gap-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 text-xs font-bold shadow-2xs cursor-pointer"
                              >
                                <RefreshCw className="h-3 w-3" />
                                <span>{isArabic ? 'تجديد فوري' : 'Renew'}</span>
                              </button>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                {isArabic ? 'نشط وسارٍ' : 'Active'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Subscription details strip */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#e3e8f9] text-xs">
                          <div className="bg-[#f9f9ff] p-2 rounded-lg">
                            <span className="text-[10px] text-[#70787d] block">{isArabic ? 'دورة الفوترة' : 'Billing Cycle'}</span>
                            <span className="font-semibold text-[#161c27]">{sub.billingCycle}</span>
                          </div>
                          <div className="bg-[#f9f9ff] p-2 rounded-lg">
                            <span className="text-[10px] text-[#70787d] block">{isArabic ? 'بوابة الدفع' : 'Payment Mode'}</span>
                            <span className="font-semibold text-[#161c27]">{sub.paymentMode}</span>
                          </div>
                          <div className="bg-[#f9f9ff] p-2 rounded-lg">
                            <span className="text-[10px] text-[#70787d] block">{isArabic ? 'تاريخ التجديد' : 'Renewal Due'}</span>
                            <span className="font-semibold text-[#161c27] font-mono">{sub.renewalDate}</span>
                          </div>
                          <div className="bg-[#f9f9ff] p-2 rounded-lg">
                            <span className="text-[10px] text-[#70787d] block">{isArabic ? 'رمز ربط ZATCA' : 'ZATCA CSID'}</span>
                            <span className="font-semibold text-emerald-700 flex items-center gap-1 font-mono text-[11px]">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              <span>{sub.zatcaCsid.csidId}</span>
                            </span>
                          </div>
                        </div>

                        {/* General manager & contact */}
                        <div className="flex items-center justify-between text-[11px] text-[#70787d] pt-1">
                          <div>
                            {isArabic ? 'المدير العام للمنشأة:' : 'Property GM:'}{' '}
                            <strong className="text-[#161c27]">{sub.generalManager.name}</strong> ({sub.generalManager.phone})
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              <span>{isArabic ? 'قنوات الحجز والـ OTA مفعلة' : 'OTAs Synced'}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: PROPERTIES & BRANCHES */}
              {inspectingTab === 'properties' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#161c27]">
                    {isArabic ? 'المنشآت والفنادق التابعة للمؤسسة' : 'Properties & Locations'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(orgSubsMap.get(inspectingOrg.id) || []).map((sub) => (
                      <div key={sub.id} className="p-4 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#161c27]">
                            {isArabic ? sub.propertyNameAr : sub.propertyName}
                          </span>
                          <span className="text-[10px] bg-[#004a60] text-white px-2 py-0.5 rounded-full font-bold">
                            {sub.keysCount} Keys
                          </span>
                        </div>
                        <p className="text-xs text-[#70787d] flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#004a60]" />
                          <span>{sub.city}, Kingdom of Saudi Arabia</span>
                        </p>
                        <div className="text-[11px] text-[#70787d] pt-1 border-t border-[#e3e8f9]">
                          <div>GM: {sub.generalManager.name}</div>
                          <div>Email: {sub.generalManager.email}</div>
                          <div>Phone: {sub.generalManager.phone}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: COMPLIANCE & LEGAL */}
              {inspectingTab === 'compliance' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#161c27]">
                    {isArabic ? 'البيانات التجارية والضريبية المعتمدة' : 'Official Commercial & Tax Profile'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                      <span className="text-[10px] text-[#70787d] uppercase font-bold block">{isArabic ? 'السجل التجاري (CR)' : 'Commercial Registration'}</span>
                      <span className="text-sm font-bold text-[#161c27] font-mono mt-1 block">{inspectingOrg.crNumber}</span>
                      <span className="text-[10px] text-emerald-600 font-medium mt-1 inline-block">✓ Active & Validated with Ministry of Commerce</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                      <span className="text-[10px] text-[#70787d] uppercase font-bold block">{isArabic ? 'الرقم الضريبي الموحد (ZATCA TRN)' : 'Tax ID Number'}</span>
                      <span className="text-sm font-bold text-[#161c27] font-mono mt-1 block">{inspectingOrg.taxNumber}</span>
                      <span className="text-[10px] text-emerald-600 font-medium mt-1 inline-block">✓ 15-Digit Standard ZATCA TRN Verified</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                      <span className="text-[10px] text-[#70787d] uppercase font-bold block">{isArabic ? 'البريد المعتمد للفوترة' : 'Billing Email'}</span>
                      <span className="text-xs font-bold text-[#161c27] mt-1 block">{inspectingOrg.billingEmail}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                      <span className="text-[10px] text-[#70787d] uppercase font-bold block">{isArabic ? 'هاتف التواصل الرسمي' : 'Official Phone'}</span>
                      <span className="text-xs font-bold text-[#161c27] mt-1 block font-mono">{inspectingOrg.phone}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-[#f9f9ff] border-t border-[#e3e8f9] p-4 flex items-center justify-between shrink-0">
              <div className="text-xs text-[#70787d]">
                {isArabic ? 'معرف المؤسسة في المنصة:' : 'Platform Tenant ID:'}{' '}
                <strong className="text-[#161c27] font-mono">{inspectingOrg.id}</strong>
              </div>
              <button
                type="button"
                onClick={() => setInspectingOrg(null)}
                className="rounded-xl bg-[#004a60] text-white px-5 py-2 text-xs font-bold hover:bg-[#085a73] transition-all cursor-pointer"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: REGISTER NEW SUBSCRIBED ORGANIZATION ON THE WEBSITE            */}
      {/* ========================================================================= */}
      {isAddOrgModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
            <div className="bg-[#f9f9ff] border-b border-[#e3e8f9] p-5 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#161c27]">
                  {isArabic ? 'تسجيل مؤسسة واشتراك فندقي جديد' : 'Register New Subscribed Organization'}
                </h3>
                <p className="text-xs text-[#70787d] mt-0.5">
                  {isArabic
                    ? 'إضافة شركة أو مجموعة ضيافة جديدة مع تفعيل أول اشتراك فندقي لها على منصة الموقع.'
                    : 'Add a new enterprise client organization and provision its first hospitality subscription on our website.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOrgModalOpen(false)}
                className="rounded-xl p-1.5 text-[#70787d] hover:bg-[#e3e8f9] hover:text-[#161c27]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrganizationWithSub} className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* Organization Profile Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#004a60] uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  <span>{isArabic ? 'بيانات المؤسسة والشركة' : '1. Organization Details'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#161c27] block mb-1">
                      {isArabic ? 'اسم المؤسسة (بالإنجليزية)' : 'Organization Name (EN) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      placeholder="e.g. Al Faisaliah Hospitality Co."
                      className="w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] px-3 py-2 text-xs text-[#161c27] focus:border-[#004a60] focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#161c27] block mb-1">
                      {isArabic ? 'اسم المؤسسة (بالعربية)' : 'Organization Name (AR)'}
                    </label>
                    <input
                      type="text"
                      value={newOrgNameAr}
                      onChange={(e) => setNewOrgNameAr(e.target.value)}
                      placeholder="مثال: شركة الفيصلية للضيافة"
                      className="w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] px-3 py-2 text-xs text-[#161c27] focus:border-[#004a60] focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#161c27] block mb-1">
                      {isArabic ? 'رقم السجل التجاري (CR)' : 'Commercial Registration (CR) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newOrgCr}
                      onChange={(e) => setNewOrgCr(e.target.value)}
                      placeholder="1010XXXXXX (10 digits)"
                      className="w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] px-3 py-2 text-xs font-mono text-[#161c27] focus:border-[#004a60] focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#161c27] block mb-1">
                      {isArabic ? 'الرقم الضريبي (ZATCA TRN)' : 'Tax ID (ZATCA TRN)'}
                    </label>
                    <input
                      type="text"
                      value={newOrgVat}
                      onChange={(e) => setNewOrgVat(e.target.value)}
                      placeholder="310XXXXXXXX0003 (15 digits)"
                      className="w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] px-3 py-2 text-xs font-mono text-[#161c27] focus:border-[#004a60] focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#161c27] block mb-1">
                      {isArabic ? 'تصنيف المؤسسة' : 'Tier Category'}
                    </label>
                    <select
                      value={newOrgTier}
                      onChange={(e) => setNewOrgTier(e.target.value as any)}
                      className="w-full rounded-xl border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-semibold text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
                    >
                      <option value="Enterprise Holding">Enterprise Holding (مجموعة قابضة كبرى)</option>
                      <option value="Hotel Chain">Hotel Chain (سلسلة فنادق)</option>
                      <option value="Asset Management">Asset Management (إدارة أصول عقارية)</option>
                      <option value="Boutique Operator">Boutique Operator (مشغل منتجعات بوتيك)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#161c27] block mb-1">
                      {isArabic ? 'المدينة والمقر الرئيسي' : 'HQ City'}
                    </label>
                    <select
                      value={newOrgCity}
                      onChange={(e) => setNewOrgCity(e.target.value)}
                      className="w-full rounded-xl border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-semibold text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
                    >
                      <option value="Riyadh">Riyadh (الرياض)</option>
                      <option value="Jeddah">Jeddah (جدة)</option>
                      <option value="AlUla">AlUla (العلا)</option>
                      <option value="Makkah">Makkah (مكة المكرمة)</option>
                      <option value="Madinah">Madinah (المدينة المنورة)</option>
                      <option value="Al Khobar">Al Khobar (الخبر)</option>
                      <option value="Red Sea">Red Sea (البحر الأحمر)</option>
                      <option value="Taif">Taif (الطائف)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#161c27] block mb-1">
                      {isArabic ? 'البريد الإلكتروني للفوترة' : 'Billing Email'}
                    </label>
                    <input
                      type="email"
                      value={newOrgEmail}
                      onChange={(e) => setNewOrgEmail(e.target.value)}
                      placeholder="accounts@organization.sa"
                      className="w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] px-3 py-2 text-xs text-[#161c27] focus:border-[#004a60] focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#161c27] block mb-1">
                      {isArabic ? 'رقم الهاتف المعتمد' : 'Phone Number'}
                    </label>
                    <input
                      type="text"
                      value={newOrgPhone}
                      onChange={(e) => setNewOrgPhone(e.target.value)}
                      placeholder="+966 11 000 0000"
                      className="w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] px-3 py-2 text-xs font-mono text-[#161c27] focus:border-[#004a60] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Initial Property Subscription Details */}
              <div className="space-y-3 pt-4 border-t border-[#e3e8f9]">
                <h4 className="text-xs font-bold text-[#004a60] uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4" />
                  <span>{isArabic ? 'بيانات الاشتراك الفندقي الأول للمؤسسة' : '2. Initial Hotel Subscription on Website'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#161c27] block mb-1">
                      {isArabic ? 'اسم الفندق أو المنتجع (EN)' : 'Subscribed Property Name (EN) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newSubPropertyName}
                      onChange={(e) => setNewSubPropertyName(e.target.value)}
                      placeholder="e.g. Al Faisaliah Luxury Suites"
                      className="w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] px-3 py-2 text-xs text-[#161c27] focus:border-[#004a60] focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#161c27] block mb-1">
                      {isArabic ? 'نوع المنشأة' : 'Property Type'}
                    </label>
                    <select
                      value={newSubPropertyType}
                      onChange={(e) => setNewSubPropertyType(e.target.value as any)}
                      className="w-full rounded-xl border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-semibold text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
                    >
                      <option value="Hotel">Hotel (فندق / منتجع)</option>
                      <option value="Villa">Villa (فلل خاصة / شاليهات)</option>
                      <option value="Apartment">Apartment (شقق مخدومة)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#161c27] block mb-1">
                      {isArabic ? 'الخطة والباقة المشتركة' : 'Subscription Plan'}
                    </label>
                    <select
                      value={newSubPlanName}
                      onChange={(e) => setNewSubPlanName(e.target.value)}
                      className="w-full rounded-xl border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-semibold text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
                    >
                      {HOSPITALITY_PLANS.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.currency} {p.basePrice} / {p.pricingModel})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#161c27] block mb-1">
                      {isArabic ? 'عدد الغرف والوحدات المرخصة' : 'Managed Room Keys *'}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newSubKeys}
                      onChange={(e) => setNewSubKeys(parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] px-3 py-2 text-xs font-mono text-[#161c27] focus:border-[#004a60] focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#161c27] block mb-1">
                      {isArabic ? 'دورة الفوترة والاشتراك' : 'Billing Frequency'}
                    </label>
                    <select
                      value={newSubBillingCycle}
                      onChange={(e) => setNewSubBillingCycle(e.target.value)}
                      className="w-full rounded-xl border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-semibold text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
                    >
                      {HOSPITALITY_BILLING_CYCLES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.discountPercent}% Off)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#161c27] block mb-1">
                      {isArabic ? 'طريقة السداد' : 'Payment Method'}
                    </label>
                    <select
                      value={newSubPaymentMode}
                      onChange={(e) => setNewSubPaymentMode(e.target.value as any)}
                      className="w-full rounded-xl border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-semibold text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
                    >
                      <option value="SARIE Wire">SARIE Wire (حوالة مصرفية سريعة)</option>
                      <option value="Mada Direct Debit">Mada Direct Debit (خصم مباشر مدى)</option>
                      <option value="SADAD">SADAD (سداد)</option>
                      <option value="Corporate Card">Corporate Card (بطاقة ائتمان شركات)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#e3e8f9] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOrgModalOpen(false)}
                  className="rounded-xl border border-[#e3e8f9] bg-white px-4 py-2 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff] transition-all cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#004a60] hover:bg-[#085a73] text-white px-5 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  {isArabic ? 'تسجيل المؤسسة والاشتراك' : 'Create & Activate Subscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: PLATFORM HOST ORGANIZATION HQ PROFILE (KHETAT HQ)               */}
      {/* ========================================================================= */}
      {isHostHQModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
            <div className="bg-[#f9f9ff] border-b border-[#e3e8f9] p-5 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#004a60] text-white flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#161c27]">
                    {isArabic ? orgHQ.companyNameAr : orgHQ.companyName}
                  </h3>
                  <p className="text-xs text-[#70787d]">
                    {isArabic ? 'المقر الرئيسي للمنصة وتفاصيل الاتصال والاعتمادات' : 'Platform Provider HQ Profile & Compliance'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsHostHQModalOpen(false)}
                className="rounded-xl p-1.5 text-[#70787d] hover:bg-[#e3e8f9] hover:text-[#161c27]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                  <span className="text-[10px] text-[#70787d] font-semibold uppercase">{isArabic ? 'السجل التجاري' : 'Commercial Reg.'}</span>
                  <div className="font-bold text-sm text-[#161c27] font-mono mt-0.5">{orgHQ.commercialRegistration}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                  <span className="text-[10px] text-[#70787d] font-semibold uppercase">{isArabic ? 'الرقم الضريبي (ZATCA)' : 'Tax Number'}</span>
                  <div className="font-bold text-sm text-[#161c27] font-mono mt-0.5">{orgHQ.taxRegistrationNumber}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9] space-y-1">
                <span className="text-[10px] text-[#70787d] font-semibold uppercase">{isArabic ? 'العنوان الوطني والمقر الرئيسي' : 'HQ National Address'}</span>
                <p className="font-medium text-[#161c27]">
                  {orgHQ.headquartersLocation.buildingName}, {orgHQ.headquartersLocation.street}, {orgHQ.headquartersLocation.district}, {orgHQ.headquartersLocation.city}, {orgHQ.headquartersLocation.country}
                </p>
                <div className="text-[11px] text-[#70787d] font-mono">Short Address: {orgHQ.headquartersLocation.shortAddress}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                  <span className="text-[10px] text-[#70787d] font-semibold uppercase">{isArabic ? 'الهاتف الرئيسي' : 'Primary Phone'}</span>
                  <div className="font-bold text-[#161c27] font-mono mt-0.5">{orgHQ.primaryPhone}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                  <span className="text-[10px] text-[#70787d] font-semibold uppercase">{isArabic ? 'البريد الإلكتروني' : 'Official Email'}</span>
                  <div className="font-bold text-[#161c27] mt-0.5">{orgHQ.primaryEmail}</div>
                </div>
              </div>
            </div>

            <div className="bg-[#f9f9ff] border-t border-[#e3e8f9] p-4 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsHostHQModalOpen(false)}
                className="rounded-xl bg-[#004a60] text-white px-5 py-2 text-xs font-bold hover:bg-[#085a73] transition-all cursor-pointer"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
