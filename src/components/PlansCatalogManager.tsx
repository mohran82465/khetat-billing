import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Home,
  Tent,
  CheckCircle2,
  Clock,
  Settings2,
  Sliders,
  DollarSign,
  Tag,
  ShieldCheck,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Calculator,
  ArrowRight,
  Info,
  Edit3,
  RotateCcw,
  Check,
  X,
  FileText,
  AlertCircle,
  Percent,
  Plus,
  Trash2,
  Layers,
  Search,
  ExternalLink,
  Target,
  ArrowUpDown,
  Filter,
  CheckSquare,
  Package,
} from 'lucide-react';
import {
  PropertyPlan,
  PlanTier,
  DEFAULT_PLANS,
  DEFAULT_TIERS,
  getStoredPlans,
  saveStoredPlans,
  getStoredTiers,
  saveStoredTiers,
  calculatePlanCost,
  getTiersForPlan,
} from '../data/plansConfig';
import { CreatePlanFormModal } from './CreatePlanFormModal';

interface PlansCatalogManagerProps {
  isArabic: boolean;
  activeSubTab?: string;
  onNavigateToSubTab?: (tab: string) => void;
  onSelectPlanForSubscription?: (plan: PropertyPlan, propertyCount: number) => void;
  isCreatePlanOpen?: boolean;
  onCloseCreatePlan?: () => void;
}

export const PlansCatalogManager: React.FC<PlansCatalogManagerProps> = ({
  isArabic,
  activeSubTab = 'catalog',
  onNavigateToSubTab,
  onSelectPlanForSubscription,
  isCreatePlanOpen = false,
  onCloseCreatePlan,
}) => {
  const [plans, setPlans] = useState<PropertyPlan[]>(() => getStoredPlans());
  const [tiers, setTiers] = useState<PlanTier[]>(() => getStoredTiers());
  const [currentTab, setCurrentTab] = useState<string>(activeSubTab);
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);

  // Sync prop changes
  useEffect(() => {
    if (activeSubTab) {
      setCurrentTab(activeSubTab);
    }
  }, [activeSubTab]);

  // Simulator state for Plans
  const [simulatedProperties, setSimulatedProperties] = useState<number>(12);
  const [selectedSimPlanId, setSelectedSimPlanId] = useState<string>('building-plans');

  // Modal for editing/configuring plan
  const [editingPlan, setEditingPlan] = useState<PropertyPlan | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Modal for subscribing / choosing plan
  const [subscribePlan, setSubscribePlan] = useState<PropertyPlan | null>(null);
  const [propCountToSubscribe, setPropCountToSubscribe] = useState<number>(5);
  const [subscribeSuccess, setSubscribeSuccess] = useState<boolean>(false);

  // TIERS TAB STATE
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>('all');
  const [tierSearchQuery, setTierSearchQuery] = useState<string>('');
  const [editingTier, setEditingTier] = useState<PlanTier | null>(null);
  const [isCreateTierModalOpen, setIsCreateTierModalOpen] = useState(false);
  const [newTierPreselectedPlanId, setNewTierPreselectedPlanId] = useState<string>('building-plans');

  // Quick repoint dropdown state
  const [repointDropdownTierId, setRepointDropdownTierId] = useState<string | null>(null);

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    if (onNavigateToSubTab) {
      onNavigateToSubTab(tabId);
    }
  };

  const triggerSuccessNotice = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => {
      setSaveSuccessMsg(null);
    }, 4000);
  };

  // Helper icon for plan id
  const getPlanIcon = (planId: string) => {
    if (planId.includes('bld') || planId.includes('building')) return Building2;
    if (planId.includes('hom') || planId.includes('home')) return Home;
    if (planId.includes('chl') || planId.includes('chalet')) return Tent;
    return Building2;
  };

  // --- PLAN HANDLERS ---
  const handleTogglePlanStatus = (planId: string) => {
    const updated = plans.map((p) => {
      if (p.id === planId) {
        let newStatus: PropertyPlan['status'] = 'active';
        let newBadge = isArabic ? 'متاحة الآن' : 'Available Now';

        if (p.status === 'active') {
          newStatus = 'disabled';
          newBadge = isArabic ? 'معطلة' : 'Disabled';
        } else if (p.status === 'disabled') {
          newStatus = 'coming_soon';
          newBadge = isArabic ? 'قريباً' : 'Coming Soon';
        } else {
          newStatus = 'active';
          newBadge = isArabic ? 'متاحة الآن' : 'Available Now';
        }

        return {
          ...p,
          status: newStatus,
          badge: newBadge,
          badgeAr: newStatus === 'active' ? 'متاحة الآن' : newStatus === 'coming_soon' ? 'قريباً' : 'معطلة',
        };
      }
      return p;
    });

    setPlans(updated);
    saveStoredPlans(updated);
    triggerSuccessNotice(
      isArabic ? 'تم تحديث حالة الخطة بنجاح' : 'Plan status updated successfully'
    );
  };

  const handleSavePlanConfig = (updatedPlan: PropertyPlan) => {
    const updated = plans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p));
    setPlans(updated);
    saveStoredPlans(updated);
    setEditingPlan(null);
    triggerSuccessNotice(
      isArabic
        ? `تم حفظ وتحديث إعدادات ${updatedPlan.nameAr} بنجاح`
        : `Successfully saved ${updatedPlan.name} configuration`
    );
  };

  const handlePlanCreated = (newPlan: PropertyPlan) => {
    const updated = [newPlan, ...plans];
    setPlans(updated);
    saveStoredPlans(updated);
    setIsCreatePlanModalOpen(false);
    if (onCloseCreatePlan) onCloseCreatePlan();
    triggerSuccessNotice(
      isArabic
        ? `تم إنشاء الخطة "${newPlan.nameAr}" بنجاح!`
        : `Plan "${newPlan.name}" created successfully!`
    );
  };

  const handleResetPlansDefaults = () => {
    setPlans(DEFAULT_PLANS);
    saveStoredPlans(DEFAULT_PLANS);
    setEditingPlan(null);
    triggerSuccessNotice(
      isArabic ? 'تمت استعادة الإعدادات الافتراضية للخطط' : 'Restored default plan configuration'
    );
  };

  // --- TIER HANDLERS ---
  const handleToggleTierStatus = (tierId: string) => {
    const updated = tiers.map((t) => {
      if (t.id === tierId) {
        let newStatus: PlanTier['status'] = 'active';
        if (t.status === 'active') {
          newStatus = 'disabled';
        } else if (t.status === 'disabled') {
          newStatus = 'coming_soon';
        } else {
          newStatus = 'active';
        }
        return { ...t, status: newStatus };
      }
      return t;
    });

    setTiers(updated);
    saveStoredTiers(updated);
    triggerSuccessNotice(
      isArabic ? 'تم تحديث حالة المستوى بنجاح' : 'Tier status updated successfully'
    );
  };

  // Re-pointing: Change the plan a tier points to
  const handleRepointTier = (tierId: string, newPlanId: string) => {
    const targetPlan = plans.find((p) => p.id === newPlanId);
    if (!targetPlan) return;

    const updated = tiers.map((t) => {
      if (t.id === tierId) {
        return {
          ...t,
          planId: targetPlan.id,
          planName: targetPlan.name,
          planNameAr: targetPlan.nameAr,
        };
      }
      return t;
    });

    setTiers(updated);
    saveStoredTiers(updated);
    setRepointDropdownTierId(null);
    triggerSuccessNotice(
      isArabic
        ? `تمت إعادة توجيه المستوى ليشاور على الخطة: ${targetPlan.nameAr} بنجاح`
        : `Tier repointed to plan: ${targetPlan.name} successfully`
    );
  };

  const handleSaveTier = (updatedTier: PlanTier) => {
    const targetPlan = plans.find((p) => p.id === updatedTier.planId);
    const enriched: PlanTier = {
      ...updatedTier,
      planName: targetPlan?.name || updatedTier.planName,
      planNameAr: targetPlan?.nameAr || updatedTier.planNameAr,
    };

    const updated = tiers.map((t) => (t.id === enriched.id ? enriched : t));
    setTiers(updated);
    saveStoredTiers(updated);
    setEditingTier(null);
    triggerSuccessNotice(
      isArabic
        ? `تم تحديث المستوى "${enriched.nameAr}" وربطه بالخطة (${targetPlan?.nameAr || enriched.planId})`
        : `Updated tier "${enriched.name}" pointing to plan (${targetPlan?.name || enriched.planId})`
    );
  };

  const handleCreateTier = (newTier: PlanTier) => {
    const targetPlan = plans.find((p) => p.id === newTier.planId);
    const enriched: PlanTier = {
      ...newTier,
      planName: targetPlan?.name || newTier.planName,
      planNameAr: targetPlan?.nameAr || newTier.planNameAr,
    };

    const updated = [...tiers, enriched];
    setTiers(updated);
    saveStoredTiers(updated);
    setIsCreateTierModalOpen(false);
    triggerSuccessNotice(
      isArabic
        ? `تم إنشاء المستوى "${enriched.nameAr}" وتعيين إشارته للخطة (${targetPlan?.nameAr || enriched.planId})`
        : `Created tier "${enriched.name}" pointing to plan (${targetPlan?.name || enriched.planId})`
    );
  };

  const handleDeleteTier = (tierId: string) => {
    const target = tiers.find((t) => t.id === tierId);
    if (!target) return;
    if (
      window.confirm(
        isArabic
          ? `هل أنت متأكد من حذف المستوى "${target.nameAr}"؟`
          : `Are you sure you want to delete tier "${target.name}"?`
      )
    ) {
      const updated = tiers.filter((t) => t.id !== tierId);
      setTiers(updated);
      saveStoredTiers(updated);
      triggerSuccessNotice(
        isArabic ? `تم حذف المستوى بنجاح` : `Tier deleted successfully`
      );
    }
  };

  const handleResetTiersDefaults = () => {
    setTiers(DEFAULT_TIERS);
    saveStoredTiers(DEFAULT_TIERS);
    setEditingTier(null);
    triggerSuccessNotice(
      isArabic
        ? 'تمت استعادة المستويات الافتراضية وربطها بالخطط الأصلية'
        : 'Restored default tiers and plan references'
    );
  };

  // Jump from Plan to Tiers filtered by that Plan
  const handleJumpToPlanTiers = (planId: string) => {
    setSelectedPlanFilter(planId);
    handleTabChange('categories');
  };

  // Filtered tiers for the Tiers tab
  const filteredTiers = useMemo(() => {
    return tiers.filter((tier) => {
      // Plan filter
      if (selectedPlanFilter !== 'all' && tier.planId !== selectedPlanFilter) {
        return false;
      }
      // Search filter
      if (tierSearchQuery.trim()) {
        const q = tierSearchQuery.toLowerCase();
        const matchesName =
          tier.name.toLowerCase().includes(q) || tier.nameAr.toLowerCase().includes(q);
        const matchesCode = tier.code.toLowerCase().includes(q);
        const matchesPlan =
          (tier.planName && tier.planName.toLowerCase().includes(q)) ||
          (tier.planNameAr && tier.planNameAr.toLowerCase().includes(q)) ||
          tier.planId.toLowerCase().includes(q);
        const matchesDesc =
          (tier.description && tier.description.toLowerCase().includes(q)) ||
          (tier.descriptionAr && tier.descriptionAr.toLowerCase().includes(q));
        return matchesName || matchesCode || matchesPlan || matchesDesc;
      }
      return true;
    });
  }, [tiers, selectedPlanFilter, tierSearchQuery]);

  // Selected plan in simulator
  const selectedSimPlan =
    plans.find((p) => p.id === selectedSimPlanId) || plans[0] || DEFAULT_PLANS[0];
  const simCost = calculatePlanCost(selectedSimPlan, simulatedProperties);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#004a60] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-white/20 animate-fade-in text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#003848] via-[#004a60] to-[#0b637d] p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/15 text-white backdrop-blur-xs border border-white/20">
              <Package className="h-3.5 w-3.5" />
              <span>{isArabic ? 'هيكلة منظومة الخطط والمستويات' : 'Plans & Tiers Architecture'}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              <Check className="h-3 w-3" />
              <span>{isArabic ? 'مفصولة ومنظمة بالكامل' : 'Decoupled & Referenced'}</span>
            </span>
          </div>

          <h2 className="text-xl lg:text-2xl font-black tracking-tight text-white mb-2">
            {isArabic
              ? 'الخطط والمستويات (Plans & Tiers)'
              : 'Plans & Tiers Management'}
          </h2>
          <p className="text-xs lg:text-sm text-white/85 leading-relaxed max-w-2xl">
            {isArabic
              ? 'فصل تام بين الخطط والمستويات: الخطط تحدد نوع الخدمة وحزمة التغطية الفندقية، بينما يشاور كل مستوى على خطته التابعة مع مرونة كاملة في تعيين الحدود والأسعار.'
              : 'Complete decoupling between Plans and Tiers: Plans define asset coverage and core suites, while each Tier explicitly points to its associated Plan with flexible pricing and property limits.'}
          </p>

          {/* Sub-navigation bar inside Plans */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-white/15">
            <div className="flex flex-wrap items-center gap-2">
              {[
                {
                  id: 'catalog',
                  name: 'Plans',
                  nameAr: 'الخطط',
                  count: plans.length.toString(),
                  icon: Package,
                },
                {
                  id: 'categories',
                  name: 'Tiers',
                  nameAr: 'المستويات',
                  count: tiers.length.toString(),
                  icon: Layers,
                },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isSelected =
                  currentTab === tab.id ||
                  (tab.id === 'catalog' &&
                    (currentTab === 'plans' ||
                      (currentTab !== 'categories' && currentTab !== 'tiers')));
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-[#004a60] shadow-md font-bold'
                        : 'bg-white/10 text-white/90 hover:bg-white/20'
                    }`}
                  >
                    <TabIcon className="h-3.5 w-3.5" />
                    <span>{isArabic ? tab.nameAr : tab.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? 'bg-[#004a60]/10 text-[#004a60]'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setNewTierPreselectedPlanId(plans[0]?.id || 'building-plans');
                  setIsCreateTierModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white px-3.5 py-2 text-xs font-bold border border-white/25 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 text-amber-300" />
                <span>{isArabic ? '+ إنشاء مستوى جديد (Tier)' : '+ Create New Tier'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCreatePlanModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isArabic ? '+ إنشاء خطة جديدة (Plan)' : '+ Create New Plan'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PLANS (الخطط) */}
      {/* ========================================================================= */}
      {(currentTab === 'catalog' ||
        currentTab === 'plans' ||
        (currentTab !== 'categories' && currentTab !== 'tiers')) && (
        <div className="space-y-6">
          {/* Section Description */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#e3e8f9] shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#e8eeff] text-[#004a60] flex items-center justify-center font-bold">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#161c27]">
                  {isArabic ? 'كتالوج الخطط الأساسية' : 'Core Plans Catalog'}
                </h3>
                <p className="text-xs text-[#70787d]">
                  {isArabic
                    ? 'تعرض كل خطة تفاصيل أصولها ومستوياتها التابعة المرتبطة بها'
                    : 'Each plan represents a core hospitality tier suite with linked child tiers'}
                </p>
              </div>
            </div>

            <button
              onClick={handleResetPlansDefaults}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#70787d] hover:text-[#004a60] px-3 py-1.5 rounded-lg border border-[#e3e8f9] hover:bg-gray-50 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{isArabic ? 'استعادة الخطط الافتراضية' : 'Reset Plans'}</span>
            </button>
          </div>

          {/* Main Plans Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = getPlanIcon(plan.id);
              const isActive = plan.status === 'active';
              const isComingSoon = plan.status === 'coming_soon';
              const isDisabled = plan.status === 'disabled';
              const linkedTiers = getTiersForPlan(plan.id, tiers);

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl border flex flex-col justify-between transition-all duration-200 shadow-xs relative overflow-hidden ${
                    isActive
                      ? 'border-[#004a60] ring-2 ring-[#004a60]/20'
                      : isDisabled
                      ? 'border-gray-200 opacity-60 bg-gray-50/70'
                      : 'border-[#e3e8f9] hover:border-[#004a60]/40'
                  }`}
                >
                  {/* Top Popular or Available Banner */}
                  <div className="flex items-center justify-between px-5 pt-4 pb-2">
                    <span className="text-[11px] font-mono font-bold text-[#70787d] bg-gray-100 px-2 py-0.5 rounded-md">
                      {plan.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : isComingSoon
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {isArabic ? plan.badgeAr || plan.badge : plan.badge}
                    </span>
                  </div>

                  {/* Plan Card Body */}
                  <div className="p-5 flex-1 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#e8eeff] text-[#004a60] flex items-center justify-center shrink-0 shadow-xs">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-[#161c27]">
                          {isArabic ? plan.nameAr : plan.name}
                        </h4>
                        <p className="text-xs font-semibold text-[#004a60] mt-0.5">
                          {isArabic ? plan.subtitleAr : plan.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[#525e65] leading-relaxed line-clamp-3">
                      {isArabic ? plan.descriptionAr : plan.description}
                    </p>

                    {/* Target Property Types */}
                    <div className="space-y-1.5 pt-2 border-t border-[#f0f3fa]">
                      <span className="text-[11px] font-bold text-[#70787d] block">
                        {isArabic ? 'أنواع العقارات المدعومة:' : 'Supported Property Types:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(isArabic ? plan.propertyTypesAr : plan.propertyTypes).map((pt, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-[#f5f7fc] text-[#2c3840] border border-[#e3e8f9] px-2 py-0.5 rounded-md font-medium"
                          >
                            {pt}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Baseline Pricing Snapshot */}
                    <div className="p-3 rounded-xl bg-[#f8fbff] border border-[#d8e6f5] space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[#70787d]">
                        <span>{isArabic ? 'معدل التسعير الأساسي:' : 'Baseline Rate:'}</span>
                        <span className="font-bold text-[#004a60] font-mono">
                          {plan.tier1Rate} {plan.currency}{' '}
                          <span className="text-[10px] font-normal">
                            ({isArabic ? plan.billingFrequencyAr : plan.billingFrequency})
                          </span>
                        </span>
                      </div>
                      {plan.pricingModel === 'tiered_capped' && (
                        <div className="flex items-center justify-between text-[#70787d]">
                          <span>{isArabic ? 'سقف السعر الأقصى:' : 'Capped Price:'}</span>
                          <span className="font-bold text-emerald-700 font-mono">
                            {plan.cappedRate.toLocaleString()} {plan.currency}{' '}
                            <span className="text-[10px] font-normal">
                              ({plan.tierLimit}+ {isArabic ? 'عقار' : 'units'})
                            </span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ========================================================================= */}
                    {/* LINKED TIERS HIGHLIGHT SECTION ("المستويات التابعة لهذه الخطة") */}
                    {/* ========================================================================= */}
                    <div className="pt-3 border-t border-[#e3e8f9] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#161c27]">
                          <Layers className="h-3.5 w-3.5 text-[#004a60]" />
                          <span>
                            {isArabic
                              ? `المستويات التابعة (${linkedTiers.length}):`
                              : `Linked Tiers (${linkedTiers.length}):`}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setNewTierPreselectedPlanId(plan.id);
                            setIsCreateTierModalOpen(true);
                          }}
                          className="text-[11px] font-bold text-[#004a60] hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                          <span>{isArabic ? 'ربط مستوى' : 'Add Tier'}</span>
                        </button>
                      </div>

                      {linkedTiers.length === 0 ? (
                        <div className="p-3 bg-gray-50 rounded-lg text-center text-xs text-gray-500">
                          {isArabic
                            ? 'لا توجد مستويات تشاور على هذه الخطة حالياً'
                            : 'No tiers currently point to this plan'}
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {linkedTiers.map((t) => (
                            <div
                              key={t.id}
                              className="p-2 rounded-lg bg-white border border-[#e3e8f9] hover:border-[#004a60]/40 transition-all flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-[#004a60]/10 text-[#004a60] text-[10px] font-black flex items-center justify-center shrink-0">
                                  {t.tierLevel}
                                </span>
                                <div>
                                  <div className="font-bold text-[#161c27] text-[11px] line-clamp-1">
                                    {isArabic ? t.nameAr : t.name}
                                  </div>
                                  <div className="text-[10px] text-[#70787d]">
                                    {isArabic
                                      ? `من ${t.minProperties} إلى ${t.maxProperties || 'غير محدود'} عقار`
                                      : `${t.minProperties} - ${t.maxProperties || 'Unlimited'} units`}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="font-bold text-[#004a60] font-mono text-[11px]">
                                  {t.ratePerUnit} {t.currency}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Jump button to view tiers in Tiers tab */}
                      <button
                        onClick={() => handleJumpToPlanTiers(plan.id)}
                        className="w-full text-center text-xs font-bold text-[#004a60] bg-[#eef3fb] hover:bg-[#e2ebf8] py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>
                          {isArabic
                            ? `إدارة مستويات (${isArabic ? plan.nameAr : plan.name})`
                            : `Manage ${plan.name} Tiers`}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Plan Card Footer Actions */}
                  <div className="p-4 bg-gray-50/80 border-t border-[#e3e8f9] flex items-center justify-between gap-2">
                    <button
                      onClick={() => setEditingPlan(plan)}
                      className="bg-white border border-[#e3e8f9] hover:border-[#004a60] hover:bg-[#f1f3ff] text-[#004a60] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Settings2 className="h-3.5 w-3.5" />
                      <span>{isArabic ? 'تخصيص الخطة' : 'Configure'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSubscribePlan(plan);
                          setPropCountToSubscribe(5);
                        }}
                        className="bg-[#004a60] hover:bg-[#074e64] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        {isArabic ? 'تسجيل واشتراك' : 'Subscribe'}
                      </button>
                      <button
                        onClick={() => handleTogglePlanStatus(plan.id)}
                        className="p-1.5 border border-[#e3e8f9] hover:bg-gray-100 rounded-lg text-[#70787d] cursor-pointer"
                        title={isArabic ? 'تبديل الحالة' : 'Toggle status'}
                      >
                        {plan.status === 'active' ? (
                          <ToggleRight className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Simulation & Cost Calculator */}
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#e3e8f9]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#004a60]/10 text-[#004a60] flex items-center justify-center font-bold shrink-0">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#161c27]">
                    {isArabic ? 'محاكي تكلفة الاشتراك الفوري' : 'Live Portfolio Pricing Calculator'}
                  </h3>
                  <p className="text-xs text-[#70787d]">
                    {isArabic
                      ? 'احسب قيمة الاشتراك الشهري وسقف التسعير بحسب عدد العقارات والوحدات'
                      : 'Calculate estimated monthly subscription according to property volume and capped limits'}
                  </p>
                </div>
              </div>

              {/* Plan Picker for Simulator */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#70787d]">
                  {isArabic ? 'الخطة المختارة:' : 'Selected Plan:'}
                </span>
                <select
                  value={selectedSimPlanId}
                  onChange={(e) => setSelectedSimPlanId(e.target.value)}
                  className="rounded-lg border border-[#e3e8f9] bg-white px-3 py-1.5 text-xs font-bold text-[#004a60] focus:ring-2 focus:ring-[#004a60]/20"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {isArabic ? p.nameAr : p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Slider & Result */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#161c27]">
                    {isArabic ? 'عدد العقارات المراد إدارتها:' : 'Number of Properties to Manage:'}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={simulatedProperties}
                      onChange={(e) =>
                        setSimulatedProperties(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-20 p-1.5 text-center font-mono font-bold text-sm rounded-lg border border-[#e3e8f9]"
                    />
                    <span className="text-xs text-[#70787d]">
                      {isArabic ? 'عقار / وحدة' : 'properties'}
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min="1"
                  max="50"
                  value={simulatedProperties}
                  onChange={(e) => setSimulatedProperties(parseInt(e.target.value))}
                  className="w-full accent-[#004a60] cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-[#70787d]">
                  <span>1 {isArabic ? 'عقار' : 'unit'}</span>
                  <span>
                    {selectedSimPlan.tierLimit} {isArabic ? 'عقار (سقف التسعير)' : 'units (Cap)'}
                  </span>
                  <span>50+ {isArabic ? 'عقار' : 'units'}</span>
                </div>
              </div>

              {/* Calculator Output Card */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-[#f8fbff] to-[#eef4ff] border border-[#d8e6f5] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#70787d]">
                    {isArabic ? 'سعر الوحدة الافتراضي:' : 'Base Rate per Unit:'}
                  </span>
                  <span className="font-bold text-[#161c27] font-mono">
                    {simCost.ratePerUnit} SAR
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#70787d]">
                    {isArabic ? 'المجموع قبل السقف:' : 'Total Before Capped Discount:'}
                  </span>
                  <span className="font-mono text-[#70787d]">
                    {simCost.totalBeforeDiscount.toLocaleString()} SAR
                  </span>
                </div>

                {simCost.isCapped && (
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-emerald-100 text-emerald-900 font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
                      <span>{isArabic ? 'تم تطبيق سقف السعر الثابت!' : 'Capped Price Active!'}</span>
                    </span>
                    <span className="font-mono">
                      -{simCost.savings.toLocaleString()} SAR {isArabic ? 'توفير' : 'saved'}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#d8e6f5] flex items-center justify-between">
                  <span className="text-xs font-black text-[#161c27]">
                    {isArabic ? 'الإجمالي الشهري (مع 15% ضريبة):' : 'Grand Monthly (incl. VAT):'}
                  </span>
                  <span className="text-lg font-black text-[#004a60] font-mono">
                    {simCost.grandTotal.toLocaleString()} SAR
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TIERS (المستويات) - SEPARATE & POINTING TO ASSOCIATED PLAN */}
      {/* ========================================================================= */}
      {(currentTab === 'categories' || currentTab === 'tiers') && (
        <div className="space-y-6">
          {/* Top Info Banner explaining the Decoupling and Pointer */}
          <div className="bg-gradient-to-r from-emerald-50 via-[#f0f9ff] to-white p-5 rounded-2xl border border-emerald-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#161c27] flex items-center gap-2">
                  <span>
                    {isArabic
                      ? 'إدارة المستويات (Tiers) والربط مع الخطط'
                      : 'Decoupled Tiers & Plan Associations'}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    {isArabic ? 'المستوي يشاور على خطته' : 'Plan Pointer Active'}
                  </span>
                </h3>
                <p className="text-xs text-[#525e65] mt-1 leading-relaxed max-w-2xl">
                  {isArabic
                    ? 'تم فصل المستويات بالكامل بحيث يكون كل مستوى مستقلاً ويشاور بوضوح على الخطة التابعة له، مع إمكانية تعديل الخطة التابعة بضغطة زر وتعيين الأسعار والحدود.'
                    : 'Tiers are fully separated from Plans. Each tier points explicitly to its associated plan with flexible re-assignment, custom rate caps, and property unit thresholds.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleResetTiersDefaults}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#70787d] hover:text-[#004a60] px-3 py-2 rounded-xl border border-[#e3e8f9] hover:bg-gray-50 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{isArabic ? 'استعادة المستويات' : 'Reset Tiers'}</span>
              </button>

              <button
                onClick={() => {
                  setNewTierPreselectedPlanId(plans[0]?.id || 'building-plans');
                  setIsCreateTierModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>{isArabic ? 'إنشاء مستوى جديد' : 'New Tier'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#e3e8f9] shadow-xs">
              <div className="text-[11px] font-bold text-[#70787d]">
                {isArabic ? 'إجمالي المستويات المُعرفة:' : 'Total Tiers:'}
              </div>
              <div className="text-xl font-black text-[#161c27] mt-1 font-mono">
                {tiers.length}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e3e8f9] shadow-xs">
              <div className="text-[11px] font-bold text-[#70787d]">
                {isArabic ? 'المستويات النشطة:' : 'Active Tiers:'}
              </div>
              <div className="text-xl font-black text-emerald-700 mt-1 font-mono">
                {tiers.filter((t) => t.status === 'active').length}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e3e8f9] shadow-xs">
              <div className="text-[11px] font-bold text-[#70787d]">
                {isArabic ? 'الخطط المرتبطة بها:' : 'Associated Plans:'}
              </div>
              <div className="text-xl font-black text-[#004a60] mt-1 font-mono">
                {new Set(tiers.map((t) => t.planId)).size}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e3e8f9] shadow-xs">
              <div className="text-[11px] font-bold text-[#70787d]">
                {isArabic ? 'أعلى سقف تسعير:' : 'Max Capped Limit:'}
              </div>
              <div className="text-xl font-black text-[#161c27] mt-1 font-mono">
                3,000 <span className="text-xs font-normal">SAR</span>
              </div>
            </div>
          </div>

          {/* Filter Bar: Filter Tiers by Associated Plan & Search */}
          <div className="bg-white p-4 rounded-xl border border-[#e3e8f9] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Plan Selector Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#70787d] flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  <span>{isArabic ? 'فلترة حسب الخطة التابعة:' : 'Filter by Associated Plan:'}</span>
                </span>

                <button
                  onClick={() => setSelectedPlanFilter('all')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedPlanFilter === 'all'
                      ? 'bg-[#004a60] text-white shadow-xs'
                      : 'bg-gray-100 text-[#40484d] hover:bg-gray-200'
                  }`}
                >
                  {isArabic ? 'جميع الخطط' : 'All Plans'} ({tiers.length})
                </button>

                {plans.map((p) => {
                  const Icon = getPlanIcon(p.id);
                  const pTiersCount = tiers.filter((t) => t.planId === p.id).length;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlanFilter(p.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedPlanFilter === p.id
                          ? 'bg-[#004a60] text-white shadow-xs'
                          : 'bg-gray-100 text-[#40484d] hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      <span>{isArabic ? p.nameAr : p.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          selectedPlanFilter === p.id ? 'bg-white/20' : 'bg-gray-200'
                        }`}
                      >
                        {pTiersCount}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={isArabic ? 'بحث في المستويات...' : 'Search tiers...'}
                  value={tierSearchQuery}
                  onChange={(e) => setTierSearchQuery(e.target.value)}
                  className="w-full text-xs rounded-lg border border-[#e3e8f9] pl-3 pr-9 py-2 bg-[#fcfdff]"
                />
              </div>
            </div>
          </div>

          {/* Tiers List with Clear Pointer to Associated Plan */}
          <div className="space-y-4">
            {filteredTiers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#e3e8f9] p-12 text-center space-y-3">
                <Layers className="h-10 w-10 text-gray-300 mx-auto" />
                <h4 className="text-base font-bold text-[#161c27]">
                  {isArabic ? 'لا توجد مستويات مطابقة' : 'No matching tiers found'}
                </h4>
                <p className="text-xs text-[#70787d]">
                  {isArabic
                    ? 'جرب تغيير معيار البحث أو فلتر الخطة التابعة'
                    : 'Try changing your search query or plan filter'}
                </p>
              </div>
            ) : (
              filteredTiers.map((tier) => {
                const parentPlan = plans.find((p) => p.id === tier.planId);
                const ParentIcon = parentPlan ? getPlanIcon(parentPlan.id) : Package;

                return (
                  <div
                    key={tier.id}
                    className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs hover:border-[#004a60]/40 transition-all space-y-4"
                  >
                    {/* PROMINENT PLAN POINTER BOX ("المستوي يشاور على الخطة التابعه له") */}
                    <div className="p-3 rounded-xl bg-gradient-to-r from-[#eef7ff] via-[#f4f9ff] to-[#fcfdff] border border-[#bcd7f5] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#004a60] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                          <ParentIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase text-[#004a60] bg-white px-2 py-0.5 rounded-md border border-[#bcd7f5]">
                              {isArabic ? '🎯 يشاور على الخطة التابعة:' : '🎯 Points to Parent Plan:'}
                            </span>
                            <span className="text-xs font-black text-[#161c27]">
                              {parentPlan
                                ? isArabic
                                  ? parentPlan.nameAr
                                  : parentPlan.name
                                : tier.planNameAr || tier.planId}
                            </span>
                            <span className="text-[10px] font-mono text-[#70787d] bg-gray-100 px-1.5 py-0.2 rounded">
                              {parentPlan?.code || tier.planId}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Repoint / Change Associated Plan Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setRepointDropdownTierId(
                              repointDropdownTierId === tier.id ? null : tier.id
                            )
                          }
                          className="text-[11px] font-bold text-[#004a60] bg-white hover:bg-gray-50 border border-[#bcd7f5] px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <ArrowUpDown className="h-3 w-3" />
                          <span>{isArabic ? 'تغيير الخطة التابعة ▾' : 'Change Plan ▾'}</span>
                        </button>

                        {/* Dropdown Menu */}
                        {repointDropdownTierId === tier.id && (
                          <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-[#e3e8f9] p-2 z-30 space-y-1">
                            <div className="text-[10px] font-bold text-[#70787d] px-2 py-1">
                              {isArabic ? 'اختر الخطة التي سيشاور عليها هذا المستوى:' : 'Select Plan to point this tier to:'}
                            </div>
                            {plans.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => handleRepointTier(tier.id, p.id)}
                                className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                                  tier.planId === p.id
                                    ? 'bg-[#004a60] text-white font-bold'
                                    : 'hover:bg-gray-100 text-[#161c27]'
                                }`}
                              >
                                <span>{isArabic ? p.nameAr : p.name}</span>
                                {tier.planId === p.id && <Check className="h-3.5 w-3.5" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tier Body Details */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Tier identity & properties range */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-[#004a60] text-white font-black text-xs flex items-center justify-center">
                            {tier.tierLevel}
                          </span>
                          <h4 className="text-base font-black text-[#161c27]">
                            {isArabic ? tier.nameAr : tier.name}
                          </h4>
                          <span className="text-[10px] font-mono text-[#70787d] bg-gray-100 px-2 py-0.5 rounded-md">
                            {tier.code}
                          </span>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              tier.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : tier.status === 'coming_soon'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {tier.status === 'active'
                              ? isArabic
                                ? 'مستوى مفعل'
                                : 'Active'
                              : tier.status === 'coming_soon'
                              ? isArabic
                                ? 'قريباً'
                                : 'Coming Soon'
                              : isArabic
                              ? 'معطل'
                              : 'Disabled'}
                          </span>

                          {tier.badge && (
                            <span className="text-[10px] font-bold bg-[#eef3fb] text-[#004a60] px-2 py-0.5 rounded-full">
                              {isArabic ? tier.badgeAr || tier.badge : tier.badge}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#525e65] max-w-2xl leading-relaxed">
                          {isArabic ? tier.descriptionAr : tier.description}
                        </p>

                        {/* Range and SLA Badges */}
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                          <div className="flex items-center gap-1.5 text-[#004a60] font-bold bg-[#f1f6fd] px-2.5 py-1 rounded-md">
                            <Sliders className="h-3.5 w-3.5" />
                            <span>
                              {isArabic ? 'نطاق العقارات:' : 'Units Range:'}{' '}
                              {isArabic
                                ? `من ${tier.minProperties} إلى ${
                                    tier.maxProperties ? `${tier.maxProperties} عقار` : 'غير محدود (أبراج كبرى)'
                                  }`
                                : `${tier.minProperties} to ${tier.maxProperties || 'Unlimited'} units`}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {isArabic
                                ? tier.supportLevelAr || `استجابة خلال ${tier.slaResponseHours || 4} ساعات`
                                : `${tier.slaResponseHours || 4}h SLA Support`}
                            </span>
                          </div>
                        </div>

                        {/* Features chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(isArabic ? tier.featuresAr : tier.features).map((feat, fi) => (
                            <span
                              key={fi}
                              className="text-[10px] bg-white border border-[#e3e8f9] text-[#2c3840] px-2 py-0.5 rounded-md flex items-center gap-1"
                            >
                              <Check className="h-2.5 w-2.5 text-emerald-600" />
                              <span>{feat}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Pricing & Actions */}
                      <div className="flex flex-col items-start lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#e3e8f9]">
                        <div className="text-left lg:text-right">
                          <div className="text-sm font-black text-[#004a60] font-mono">
                            {tier.ratePerUnit} {tier.currency}{' '}
                            <span className="text-[10px] text-[#70787d] font-normal">
                              ({isArabic ? tier.billingFrequencyAr : tier.billingFrequency})
                            </span>
                          </div>
                          {tier.cappedRate && (
                            <div className="text-xs font-bold text-emerald-700 font-mono mt-0.5">
                              {tier.cappedRate.toLocaleString()} {tier.currency}{' '}
                              <span className="text-[10px] text-[#70787d] font-normal">
                                ({isArabic ? 'سقف السعر الأقصى' : 'Max Cap'})
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingTier(tier)}
                            className="bg-white border border-[#e3e8f9] hover:border-[#004a60] hover:bg-[#f1f3ff] text-[#004a60] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span>{isArabic ? 'تعديل المستوى' : 'Edit Tier'}</span>
                          </button>

                          <button
                            onClick={() => handleToggleTierStatus(tier.id)}
                            className="p-1.5 border border-[#e3e8f9] hover:bg-gray-100 rounded-lg text-[#70787d] cursor-pointer"
                            title={isArabic ? 'تبديل الحالة' : 'Toggle status'}
                          >
                            {tier.status === 'active' ? (
                              <ToggleRight className="h-5 w-5 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="h-5 w-5 text-gray-400" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDeleteTier(tier.id)}
                            className="p-1.5 border border-[#e3e8f9] hover:bg-red-50 hover:border-red-200 rounded-lg text-gray-400 hover:text-red-600 cursor-pointer"
                            title={isArabic ? 'حذف المستوى' : 'Delete tier'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: PLAN CONFIGURATION / EDIT PLAN MODAL */}
      {/* ========================================================================= */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e3e8f9] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#e3e8f9]">
              <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-[#004a60]" />
                <h3 className="text-base font-bold text-[#161c27]">
                  {isArabic
                    ? `تخصيص إعدادات الخطة: ${editingPlan.nameAr}`
                    : `Configure Plan: ${editingPlan.name}`}
                </h3>
              </div>
              <button
                onClick={() => setEditingPlan(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSavePlanConfig(editingPlan);
              }}
              className="mt-4 space-y-4 text-xs"
            >
              {/* Status Selector */}
              <div>
                <label className="block font-bold text-[#161c27] mb-1">
                  {isArabic ? 'حالة تفعيل الخطة:' : 'Plan Status:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['active', 'coming_soon', 'disabled'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditingPlan({ ...editingPlan, status: st })}
                      className={`p-2 rounded-lg border font-bold text-center cursor-pointer transition-all ${
                        editingPlan.status === st
                          ? 'border-[#004a60] bg-[#004a60] text-white shadow-xs'
                          : 'border-[#e3e8f9] bg-white text-[#40484d] hover:bg-gray-50'
                      }`}
                    >
                      {st === 'active'
                        ? isArabic
                          ? 'متاحة الآن'
                          : 'Active'
                        : st === 'coming_soon'
                        ? isArabic
                          ? 'قريباً'
                          : 'Coming Soon'
                        : isArabic
                        ? 'معطلة'
                        : 'Disabled'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name AR & EN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'اسم الخطة (عربي)' : 'Plan Name (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={editingPlan.nameAr}
                    onChange={(e) => setEditingPlan({ ...editingPlan, nameAr: e.target.value })}
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'اسم الخطة (إنجليزي)' : 'Plan Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white"
                    required
                  />
                </div>
              </div>

              {/* Baseline Unit Rate & Cap */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'سعر الوحدة (ر.س)' : 'Rate Per Unit (SAR)'}
                  </label>
                  <input
                    type="number"
                    value={editingPlan.tier1Rate}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        tier1Rate: Math.max(1, parseInt(e.target.value) || 0),
                      })
                    }
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'حد سقف التسعير (عقار)' : 'Capped Threshold'}
                  </label>
                  <input
                    type="number"
                    value={editingPlan.tierLimit}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        tierLimit: Math.max(1, parseInt(e.target.value) || 0),
                      })
                    }
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'قيمة السقف الثابت (ر.س)' : 'Capped Rate (SAR)'}
                  </label>
                  <input
                    type="number"
                    value={editingPlan.cappedRate}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        cappedRate: Math.max(1, parseInt(e.target.value) || 0),
                      })
                    }
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white font-mono font-bold text-emerald-800"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الوصف (عربي)' : 'Description (Arabic)'}
                </label>
                <textarea
                  rows={2}
                  value={editingPlan.descriptionAr}
                  onChange={(e) => setEditingPlan({ ...editingPlan, descriptionAr: e.target.value })}
                  className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#e3e8f9] flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetPlansDefaults}
                  className="text-xs font-semibold text-gray-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isArabic ? 'استعادة الافتراضي' : 'Reset to Default'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPlan(null)}
                    className="px-4 py-2 rounded-lg border border-[#e3e8f9] text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer"
                  >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#004a60] text-white font-bold hover:bg-[#074e64] shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>{isArabic ? 'حفظ التغييرات' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CREATE / EDIT TIER MODAL (WITH PLAN POINTER SELECTION) */}
      {/* ========================================================================= */}
      {(isCreateTierModalOpen || editingTier) && (
        <TierConfigModal
          isArabic={isArabic}
          plans={plans}
          initialTier={
            editingTier || {
              id: `tier-custom-${Date.now()}`,
              code: `TR-CUST-${Math.floor(10 + Math.random() * 90)}`,
              name: 'New Custom Tier',
              nameAr: 'مستوى مخصص جديد',
              planId: newTierPreselectedPlanId || plans[0]?.id || 'building-plans',
              tierLevel: 1,
              minProperties: 1,
              maxProperties: 20,
              pricingModel: 'tiered_capped',
              ratePerUnit: 150,
              cappedRate: 3000,
              currency: 'SAR',
              billingFrequency: 'per property / month',
              billingFrequencyAr: 'لكل عقار / شهرياً',
              status: 'active',
              badge: 'Custom Tier',
              badgeAr: 'مستوى مخصص',
              description: 'Flexible tiered pricing structure connected to parent plan.',
              descriptionAr: 'هيكلة تسعير متدرجة ومرنة تشاور على الخطة التابعة المحددة.',
              features: [
                'ZATCA Phase 2 Fatoora clearance',
                'Multi-property inventory & folio management',
              ],
              featuresAr: [
                'ربط الزكاة والضريبة والجمارك المرحلة الثانية',
                'إدارة مكاتب الاستقبال ومخزون الوحدات العقارية',
              ],
              slaResponseHours: 4,
              supportLevel: 'priority',
              supportLevelAr: 'أولوية دعم تشغيلي',
            }
          }
          isEditMode={!!editingTier}
          onClose={() => {
            setIsCreateTierModalOpen(false);
            setEditingTier(null);
          }}
          onSave={(tierToSave) => {
            if (editingTier) {
              handleSaveTier(tierToSave);
            } else {
              handleCreateTier(tierToSave);
            }
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* QUICK SUBSCRIBE / CHECKOUT MODAL */}
      {/* ========================================================================= */}
      {subscribePlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e3e8f9]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9]">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#004a60]" />
                <h3 className="text-base font-bold text-[#161c27]">
                  {isArabic
                    ? `تأكيد الاشتراك: ${subscribePlan.nameAr}`
                    : `Subscribe to: ${subscribePlan.name}`}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSubscribePlan(null);
                  setSubscribeSuccess(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {subscribeSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h4 className="text-lg font-bold text-[#161c27]">
                  {isArabic ? 'تم تفعيل الاشتراك بنجاح!' : 'Subscription Successfully Activated!'}
                </h4>
                <p className="text-xs text-[#70787d] max-w-sm mx-auto">
                  {isArabic
                    ? `تم تسجيل ${propCountToSubscribe} عقارات ضمن باقة ${subscribePlan.nameAr} مع الفوترة الإلكترونية المعتمدة.`
                    : `Your ${propCountToSubscribe} properties have been enrolled under ${subscribePlan.name} with instant ZATCA clearance.`}
                </p>
                <button
                  onClick={() => {
                    setSubscribePlan(null);
                    setSubscribeSuccess(false);
                  }}
                  className="bg-[#004a60] text-white px-6 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isArabic ? 'إغلاق ومتابعة' : 'Done & Close'}
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#161c27] mb-1">
                    {isArabic ? 'عدد العقارات المراد تسجيلها في الباقة:' : 'Number of Properties to Enroll:'}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={propCountToSubscribe}
                      onChange={(e) =>
                        setPropCountToSubscribe(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-24 p-2 rounded-lg border border-[#e3e8f9] text-center font-bold text-sm bg-white"
                    />
                    <input
                      type="range"
                      min="1"
                      max="40"
                      value={propCountToSubscribe}
                      onChange={(e) => setPropCountToSubscribe(parseInt(e.target.value))}
                      className="flex-1 accent-[#004a60]"
                    />
                  </div>
                </div>

                {/* Calculation Preview */}
                {(() => {
                  const cost = calculatePlanCost(subscribePlan, propCountToSubscribe);
                  return (
                    <div className="p-4 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9] space-y-2">
                      <div className="flex items-center justify-between text-[#70787d]">
                        <span>{isArabic ? 'نوع التسعير المطبق:' : 'Pricing Applied:'}</span>
                        <span className="font-bold text-[#004a60]">
                          {cost.isCapped
                            ? isArabic
                              ? `سقف ثابت (${subscribePlan.tierLimit}+ عقار)`
                              : `Fixed Cap (${subscribePlan.tierLimit}+ units)`
                            : isArabic
                            ? `${cost.ratePerUnit} ر.س / عقار`
                            : `${cost.ratePerUnit} SAR / unit`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[#161c27] font-bold">
                        <span>{isArabic ? 'المبلغ الأساسي:' : 'Base Monthly Cost:'}</span>
                        <span className="font-mono text-sm">{cost.finalPrice.toLocaleString()} SAR</span>
                      </div>
                      <div className="flex items-center justify-between text-[#70787d]">
                        <span>{isArabic ? 'ضريبة القيمة المضافة 15%:' : 'ZATCA VAT (15%):'}</span>
                        <span className="font-mono">{cost.vatAmount.toLocaleString()} SAR</span>
                      </div>
                      <div className="pt-2 border-t border-[#e3e8f9] flex items-center justify-between text-[#161c27] font-black text-sm">
                        <span>{isArabic ? 'الإجمالي الشهري الشامل:' : 'Total Monthly (Incl. VAT):'}</span>
                        <span className="text-emerald-800 font-mono text-base">
                          {cost.grandTotal.toLocaleString()} SAR
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div className="pt-3 border-t border-[#e3e8f9] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSubscribePlan(null)}
                    className="px-4 py-2 rounded-lg border border-[#e3e8f9] text-gray-700 font-semibold cursor-pointer"
                  >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectPlanForSubscription) {
                        onSelectPlanForSubscription(subscribePlan, propCountToSubscribe);
                      }
                      setSubscribeSuccess(true);
                    }}
                    className="px-5 py-2 rounded-lg bg-[#004a60] text-white font-bold hover:bg-[#074e64] shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isArabic ? 'تأكيد الاشتراك وتوليد الفاتورة' : 'Confirm & Generate Invoice'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE PLAN FORM MODAL */}
      <CreatePlanFormModal
        isOpen={isCreatePlanModalOpen || isCreatePlanOpen}
        onClose={() => {
          setIsCreatePlanModalOpen(false);
          onCloseCreatePlan?.();
        }}
        isArabic={isArabic}
        onPlanCreated={handlePlanCreated}
      />
    </div>
  );
};

// =========================================================================
// SUB-COMPONENT: TIER CONFIGURATION MODAL (CREATE / EDIT)
// =========================================================================
interface TierConfigModalProps {
  isArabic: boolean;
  plans: PropertyPlan[];
  initialTier: PlanTier;
  isEditMode: boolean;
  onClose: () => void;
  onSave: (tier: PlanTier) => void;
}

const TierConfigModal: React.FC<TierConfigModalProps> = ({
  isArabic,
  plans,
  initialTier,
  isEditMode,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<PlanTier>(initialTier);
  const [isUnlimitedMax, setIsUnlimitedMax] = useState<boolean>(
    initialTier.maxProperties === null
  );
  const [newFeatureText, setNewFeatureText] = useState('');

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureText.trim()) return;
    setFormData({
      ...formData,
      features: [...formData.features, newFeatureText.trim()],
      featuresAr: [...formData.featuresAr, newFeatureText.trim()],
    });
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== idx),
      featuresAr: formData.featuresAr.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      maxProperties: isUnlimitedMax ? null : formData.maxProperties,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e3e8f9] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#e3e8f9]">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#004a60]" />
            <h3 className="text-base font-bold text-[#161c27]">
              {isEditMode
                ? isArabic
                  ? `تعديل المستوى: ${formData.nameAr}`
                  : `Edit Tier: ${formData.name}`
                : isArabic
                ? 'إنشاء مستوى جديد وتحديد الخطة التابعة له'
                : 'Create New Tier & Link to Plan'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* CRITICAL: PLAN POINTER SELECTION ("المستوي يشاور على الخطة التابعه له") */}
          <div className="p-3 rounded-xl bg-[#eef7ff] border-2 border-[#004a60]/30 space-y-2">
            <label className="block font-black text-[#004a60] text-xs">
              {isArabic
                ? '🎯 الخطة التي يشاور عليها هذا المستوى (Associated Parent Plan):'
                : '🎯 Plan Pointed to by this Tier:'}
            </label>
            <select
              value={formData.planId}
              onChange={(e) => {
                const sel = plans.find((p) => p.id === e.target.value);
                setFormData({
                  ...formData,
                  planId: e.target.value,
                  planName: sel?.name,
                  planNameAr: sel?.nameAr,
                });
              }}
              className="w-full rounded-lg border border-[#bcd7f5] bg-white p-2.5 font-bold text-[#161c27] text-xs cursor-pointer focus:ring-2 focus:ring-[#004a60]/20"
              required
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {isArabic ? p.nameAr : p.name} ({p.code})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#425a70]">
              {isArabic
                ? 'يشير هذا الإعداد إلى الخطة الأم التي يتبع لها هذا المستوى ويعتمد عليها في منظومة التسعير.'
                : 'Points this tier directly to the parent plan hierarchy.'}
            </p>
          </div>

          {/* Tier Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">
                {isArabic ? 'اسم المستوى (عربي):' : 'Tier Name (Arabic):'}
              </label>
              <input
                type="text"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">
                {isArabic ? 'اسم المستوى (إنجليزي):' : 'Tier Name (English):'}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white"
                required
              />
            </div>
          </div>

          {/* Code & Level */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">
                {isArabic ? 'كود المستوى:' : 'Tier Code:'}
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[#161c27] mb-1">
                {isArabic ? 'ترتيب المستوى (Grade):' : 'Tier Level (1,2,3):'}
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.tierLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tierLevel: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[#161c27] mb-1">
                {isArabic ? 'الشارة الترويجية:' : 'Badge Label:'}
              </label>
              <input
                type="text"
                value={formData.badgeAr || formData.badge || ''}
                onChange={(e) =>
                  setFormData({ ...formData, badgeAr: e.target.value, badge: e.target.value })
                }
                placeholder={isArabic ? 'الأكثر طلباً' : 'Popular'}
                className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white"
              />
            </div>
          </div>

          {/* Unit Threshold Range */}
          <div className="p-3 bg-gray-50 rounded-xl border border-[#e3e8f9] space-y-2">
            <span className="font-bold text-[#161c27] block">
              {isArabic ? 'نطاق عدد العقارات / الوحدات:' : 'Property / Key Threshold Range:'}
            </span>

            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-[11px] text-[#70787d] mb-1">
                  {isArabic ? 'الحد الأدنى (عقار):' : 'Min Properties:'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.minProperties}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minProperties: Math.max(1, parseInt(e.target.value) || 1),
                    })
                  }
                  className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#70787d] mb-1">
                  {isArabic ? 'الحد الأقصى (عقار):' : 'Max Properties:'}
                </label>
                <input
                  type="number"
                  disabled={isUnlimitedMax}
                  value={isUnlimitedMax ? '' : formData.maxProperties || 20}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxProperties: Math.max(1, parseInt(e.target.value) || 1),
                    })
                  }
                  placeholder={isUnlimitedMax ? (isArabic ? 'غير محدود' : 'Unlimited') : '20'}
                  className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white font-mono disabled:bg-gray-100"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 pt-1 text-xs text-[#40484d] cursor-pointer">
              <input
                type="checkbox"
                checked={isUnlimitedMax}
                onChange={(e) => setIsUnlimitedMax(e.target.checked)}
                className="rounded text-[#004a60] focus:ring-[#004a60]"
              />
              <span>
                {isArabic
                  ? 'سقف غير محدود (مهما زادت العقارات - Unlimited Capped)'
                  : 'Unlimited units (Enterprise/Capped)'}
              </span>
            </label>
          </div>

          {/* Pricing Rates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">
                {isArabic ? 'سعر الوحدة (ر.س شهرياً):' : 'Rate Per Unit (SAR):'}
              </label>
              <input
                type="number"
                value={formData.ratePerUnit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ratePerUnit: Math.max(1, parseInt(e.target.value) || 0),
                  })
                }
                className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white font-mono font-bold text-[#004a60]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[#161c27] mb-1">
                {isArabic ? 'سقف السعر الأقصى (ر.س Capped):' : 'Capped Price (SAR):'}
              </label>
              <input
                type="number"
                value={formData.cappedRate || 3000}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cappedRate: Math.max(1, parseInt(e.target.value) || 0),
                  })
                }
                className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white font-mono font-bold text-emerald-800"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block font-semibold text-[#161c27] mb-1">
              {isArabic ? 'حالة المستوى:' : 'Tier Status:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['active', 'coming_soon', 'disabled'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: st })}
                  className={`p-2 rounded-lg border font-bold text-center cursor-pointer transition-all ${
                    formData.status === st
                      ? 'border-[#004a60] bg-[#004a60] text-white'
                      : 'border-[#e3e8f9] bg-white text-[#40484d] hover:bg-gray-50'
                  }`}
                >
                  {st === 'active'
                    ? isArabic
                      ? 'مفعل'
                      : 'Active'
                    : st === 'coming_soon'
                    ? isArabic
                      ? 'قريباً'
                      : 'Coming Soon'
                    : isArabic
                    ? 'معطل'
                    : 'Disabled'}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-[#161c27] mb-1">
              {isArabic ? 'وصف المستوى (عربي):' : 'Tier Description (Arabic):'}
            </label>
            <textarea
              rows={2}
              value={formData.descriptionAr}
              onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
              className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white"
            />
          </div>

          {/* Features Management */}
          <div className="space-y-2">
            <label className="block font-semibold text-[#161c27]">
              {isArabic ? 'مزايا وخدمات هذا المستوى:' : 'Tier Features & Perks:'}
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder={isArabic ? 'أضف ميزة جديدة للمستوى...' : 'Add a tier feature...'}
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                className="flex-1 rounded-lg border border-[#e3e8f9] p-2 bg-white"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="bg-[#004a60] text-white px-3 py-2 rounded-lg font-bold hover:bg-[#074e64] cursor-pointer"
              >
                {isArabic ? 'إضافة' : 'Add'}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.featuresAr.map((feat, fi) => (
                <span
                  key={fi}
                  className="bg-gray-100 text-gray-800 border border-gray-200 px-2 py-0.5 rounded-md flex items-center gap-1.5 text-[11px]"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(fi)}
                    className="text-gray-400 hover:text-red-600 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#e3e8f9] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#e3e8f9] text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#004a60] text-white font-bold hover:bg-[#074e64] shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>
                {isEditMode
                  ? isArabic
                    ? 'حفظ تعديلات المستوى'
                    : 'Save Tier Changes'
                  : isArabic
                  ? 'إنشاء المستوى وربطه بالخطة'
                  : 'Create Tier'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
