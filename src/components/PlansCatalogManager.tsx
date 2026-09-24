import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import {
  PropertyPlan,
  DEFAULT_PLANS,
  getStoredPlans,
  saveStoredPlans,
  calculatePlanCost,
} from '../data/plansConfig';

interface PlansCatalogManagerProps {
  isArabic: boolean;
  activeSubTab?: string;
  onNavigateToSubTab?: (tab: string) => void;
  onSelectPlanForSubscription?: (plan: PropertyPlan, propertyCount: number) => void;
}

export const PlansCatalogManager: React.FC<PlansCatalogManagerProps> = ({
  isArabic,
  activeSubTab = 'catalog',
  onNavigateToSubTab,
  onSelectPlanForSubscription,
}) => {
  const [plans, setPlans] = useState<PropertyPlan[]>(() => getStoredPlans());
  const [currentTab, setCurrentTab] = useState<string>(activeSubTab);

  // Sync prop changes
  useEffect(() => {
    if (activeSubTab) {
      setCurrentTab(activeSubTab);
    }
  }, [activeSubTab]);

  // Simulator state
  const [simulatedProperties, setSimulatedProperties] = useState<number>(12);
  const [selectedSimPlanId, setSelectedSimPlanId] = useState<string>('building-plans');

  // Modal for editing/configuring plan
  const [editingPlan, setEditingPlan] = useState<PropertyPlan | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Modal for subscribing / choosing plan
  const [subscribePlan, setSubscribePlan] = useState<PropertyPlan | null>(null);
  const [propCountToSubscribe, setPropCountToSubscribe] = useState<number>(5);
  const [subscribeSuccess, setSubscribeSuccess] = useState<boolean>(false);

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    if (onNavigateToSubTab) {
      onNavigateToSubTab(tabId);
    }
  };

  const handleToggleStatus = (planId: string) => {
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
      isArabic ? 'تم تحديث حالة الباقة بنجاح' : 'Plan status updated successfully'
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

  const handleResetDefaults = () => {
    setPlans(DEFAULT_PLANS);
    saveStoredPlans(DEFAULT_PLANS);
    setEditingPlan(null);
    triggerSuccessNotice(
      isArabic ? 'تمت استعادة الإعدادات الافتراضية للخطط' : 'Restored default plan configuration'
    );
  };

  const triggerSuccessNotice = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => {
      setSaveSuccessMsg(null);
    }, 4000);
  };

  const selectedSimPlan = plans.find((p) => p.id === selectedSimPlanId) || plans[0];
  const simResult = calculatePlanCost(selectedSimPlan, simulatedProperties);

  const getPlanIcon = (id: string) => {
    if (id === 'building-plans') return Building2;
    if (id === 'home-plans') return Home;
    return Tent;
  };

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button
            onClick={() => setSaveSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#003848] via-[#004a60] to-[#0a5870] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-medium mb-3 backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>{isArabic ? 'هيكل الخطط والتسعير الذكي' : 'Modular Plan Catalog & Tiered Pricing'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {isArabic ? 'اختر باقتك' : 'Choose Your Plan'}
          </h1>
          <p className="text-white/85 text-sm sm:text-base mt-2 leading-relaxed font-normal">
            {isArabic
              ? 'حدد الباقة التي تناسب حجم واحتياجات عقاراتك. باقات مخصصة للفنادق والشقق والمنازل والشاليهات مع سقف تسعير ثابت.'
              : 'Select the plan that matches your property size and needs. Flexible pricing for hotels, serviced apartments, villas, and chalets.'}
          </p>

          {/* Quick Sub-navigation bar inside Plans */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-white/15">
            {[
              { id: 'catalog', name: 'Catalog (Choose Plan)', nameAr: 'الكتالوج (اختر باقتك)' },
              { id: 'categories', name: 'Categories (3 Plans)', nameAr: 'التصنيفات (3 باقات)' },
              { id: 'pricing', name: 'Pricing & Tier Matrix', nameAr: 'الأسعار وسقف الخصم' },
              { id: 'uom', name: 'Units of Measure', nameAr: 'وحدات القياس' },
              { id: 'tax_config', name: 'Tax Configuration (ZATCA)', nameAr: 'التهيئة الضريبية' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  currentTab === tab.id
                    ? 'bg-white text-[#004a60] shadow-xs'
                    : 'bg-white/10 text-white/90 hover:bg-white/20'
                }`}
              >
                {isArabic ? tab.nameAr : tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: CATALOG / CHOOSE YOUR PLAN */}
      {currentTab === 'catalog' && (
        <div className="space-y-6">
          {/* Main 3 Plans Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((plan, idx) => {
              const Icon = getPlanIcon(plan.id);
              const isActive = plan.status === 'active';
              const isComingSoon = plan.status === 'coming_soon';
              const isDisabled = plan.status === 'disabled';

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
                  {plan.popular && isActive && (
                    <div className="bg-[#004a60] text-white text-center py-1 text-[11px] font-bold tracking-wider uppercase">
                      {isArabic ? '★ الأكثر طلباً ومتاحة الآن' : '★ Most Popular & Available Now'}
                    </div>
                  )}

                  <div className="p-6">
                    {/* Header Row: Category Badge & Status Indicator */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isActive
                              ? 'bg-[#e8eeff] text-[#004a60]'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold font-mono tracking-wider text-[#70787d] uppercase">
                            {isArabic ? `فئة #${idx + 1}` : `Tier #${idx + 1}`}
                          </span>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(plan.id)}
                          title={isArabic ? 'اضغط لتغيير الحالة (متاحة / قريباً / معطلة)' : 'Click to cycle status'}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 transition-all ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isComingSoon
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-gray-200 text-gray-700 border border-gray-300'
                          }`}
                        >
                          {isActive && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
                          {isComingSoon && <Clock className="h-3 w-3 text-amber-600" />}
                          {isDisabled && <AlertCircle className="h-3 w-3 text-gray-500" />}
                          <span>
                            {isArabic
                              ? plan.status === 'active'
                                ? 'متاحة الآن'
                                : plan.status === 'coming_soon'
                                ? 'قريباً'
                                : 'معطلة'
                              : plan.status === 'active'
                              ? 'Available'
                              : plan.status === 'coming_soon'
                              ? 'Coming Soon'
                              : 'Disabled'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Plan Name & Target Properties Subtitle */}
                    <h3 className="text-xl font-bold text-[#161c27]">
                      {isArabic ? plan.nameAr : plan.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#004a60] mt-0.5">
                      {isArabic ? plan.subtitleAr : plan.subtitle}
                    </p>

                    {/* Target property tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {(isArabic ? plan.propertyTypesAr : plan.propertyTypes).map((pt, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium bg-[#f1f3ff] text-[#40484d] px-2 py-0.5 rounded-md"
                        >
                          {pt}
                        </span>
                      ))}
                    </div>

                    {/* Pricing Highlight Box */}
                    <div className="mt-4 p-4 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                      {plan.id === 'building-plans' ? (
                        <div>
                          <div className="text-[11px] font-bold text-[#161c27] mb-1.5 flex items-center justify-between">
                            <span>{isArabic ? 'هيكل التسعير للوحدات:' : 'Tiered Pricing Model:'}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                              {isArabic ? 'سقف ثابت' : 'Fixed Cap'}
                            </span>
                          </div>
                          <div className="space-y-1.5 text-xs text-[#161c27]">
                            <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-[#e3e8f9]/70">
                              <span className="text-[#70787d]">
                                {isArabic ? `من 1 إلى ${plan.tierLimit} عقار:` : `1 to ${plan.tierLimit} Properties:`}
                              </span>
                              <span className="font-extrabold text-[#004a60]">
                                {plan.tier1Rate} {plan.currency}{' '}
                                <span className="text-[10px] text-[#70787d] font-normal">
                                  {isArabic ? '/ عقار' : '/ property'}
                                </span>
                              </span>
                            </div>
                            <div className="flex items-center justify-between bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
                              <span className="text-emerald-900 font-medium">
                                {isArabic ? `أكثر من ${plan.tierLimit}+ عقار:` : `${plan.tierLimit}+ Properties:`}
                              </span>
                              <span className="font-extrabold text-emerald-800">
                                {plan.cappedRate.toLocaleString()} {plan.currency}{' '}
                                <span className="text-[10px] font-normal">
                                  {isArabic ? '(سعر سقف ثابت)' : '(Flat Fixed)'}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-[11px] font-bold text-[#70787d] mb-1">
                            {isArabic ? 'السعر المقترح عند الإطلاق:' : 'Projected Launch Rate:'}
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-extrabold text-[#161c27]">
                              {plan.tier1Rate} {plan.currency}
                            </span>
                            <span className="text-xs text-[#70787d]">
                              {isArabic ? '/ عقار شهرياً' : '/ property / mo'}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#70787d] mt-1">
                            {isArabic
                              ? `سقف بعد ${plan.tierLimit} عقار بقيمة ${plan.cappedRate} ر.س`
                              : `Capped after ${plan.tierLimit} properties at ${plan.cappedRate} SAR`}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Features list */}
                    <div className="mt-4 pt-4 border-t border-[#e3e8f9] space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#161c27]">
                        {isArabic ? 'المزايا والإمكانات المضمنة:' : 'Included Capabilities:'}
                      </div>
                      <ul className="space-y-2 text-xs text-[#40484d]">
                        {(isArabic ? plan.featuresAr : plan.features).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2 text-[11px] leading-relaxed">
                            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-6 pt-0 bg-white space-y-2">
                    {isActive ? (
                      <button
                        onClick={() => {
                          setSubscribePlan(plan);
                          setPropCountToSubscribe(5);
                        }}
                        className="w-full bg-[#004a60] hover:bg-[#074e64] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <span>{isArabic ? 'اختيار هذه الباقة' : 'Choose This Plan'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(plan.id)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-[#40484d] font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                        <span>
                          {isArabic ? 'قريباً (انقر لتفعيلها)' : 'Coming Soon (Click to Enable)'}
                        </span>
                      </button>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setEditingPlan(plan)}
                        className="flex-1 border border-[#e3e8f9] hover:border-[#004a60] hover:bg-[#f1f3ff] text-[#004a60] py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1"
                      >
                        <Settings2 className="h-3.5 w-3.5" />
                        <span>{isArabic ? 'تخصيص الخطة والحدود' : 'Configure Plan & Limit'}</span>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(plan.id)}
                        title={isArabic ? 'تبديل التفعيل / التعطيل' : 'Enable / Disable toggle'}
                        className="p-1.5 border border-[#e3e8f9] hover:bg-gray-100 rounded-lg text-[#70787d]"
                      >
                        {isActive ? (
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

          {/* Interactive Live Pricing & Property Size Simulator */}
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e3e8f9]">
              <div>
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[#004a60]" />
                  <h3 className="text-base font-bold text-[#161c27]">
                    {isArabic
                      ? 'محاكي وحاسبة التكلفة الفورية حسب حجم العقارات'
                      : 'Interactive Property Size & Pricing Simulator'}
                  </h3>
                </div>
                <p className="text-xs text-[#70787d] mt-1">
                  {isArabic
                    ? 'جرب حساب التكلفة بناءً على عدد عقاراتك وشاهد تطبيق السعر الفردي أو السقف الثابت (3,000 ر.س بعد 20 عقار).'
                    : 'Test plan calculation based on your portfolio size and verify the 150 SAR unit rate and 3,000 SAR fixed cap.'}
                </p>
              </div>

              {/* Plan Selector for Simulator */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-[#70787d]">
                  {isArabic ? 'الباقة المختبرة:' : 'Simulated Plan:'}
                </label>
                <select
                  value={selectedSimPlanId}
                  onChange={(e) => setSelectedSimPlanId(e.target.value)}
                  className="bg-[#f9f9ff] border border-[#e3e8f9] text-xs font-bold text-[#161c27] rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-[#004a60]"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {isArabic ? p.nameAr : p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Slider & Calculation Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
              {/* Left Column: Property Count Input & Slider */}
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#161c27]">
                      {isArabic ? 'عدد العقارات / الفنادق:' : 'Number of Properties:'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={simulatedProperties}
                        onChange={(e) => setSimulatedProperties(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center font-bold text-sm bg-[#f1f3ff] border border-[#e3e8f9] rounded-lg py-1 text-[#004a60] focus:outline-hidden focus:border-[#004a60]"
                      />
                      <span className="text-xs text-[#70787d]">{isArabic ? 'عقار' : 'units'}</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    value={simulatedProperties}
                    onChange={(e) => setSimulatedProperties(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#e3e8f9] rounded-lg appearance-none cursor-pointer accent-[#004a60]"
                  />
                  <div className="flex justify-between text-[10px] text-[#70787d] mt-1 font-mono">
                    <span>1</span>
                    <span>10</span>
                    <span className="text-[#004a60] font-bold">20 ({isArabic ? 'حد السقف' : 'Cap Limit'})</span>
                    <span>30</span>
                    <span>40</span>
                    <span>50</span>
                    <span>60+</span>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-xs text-[#70787d] self-center">
                    {isArabic ? 'أمثلة سريعة:' : 'Quick Presets:'}
                  </span>
                  {[
                    { label: '1 Property (150 SAR)', count: 1 },
                    { label: '5 Properties (750 SAR)', count: 5 },
                    { label: '10 Properties (1,500 SAR)', count: 10 },
                    { label: '20 Properties (3,000 SAR)', count: 20 },
                    { label: '25 Properties (3,000 SAR Cap)', count: 25 },
                    { label: '40 Properties (3,000 SAR Cap)', count: 40 },
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => setSimulatedProperties(preset.count)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        simulatedProperties === preset.count
                          ? 'bg-[#004a60] text-white border-[#004a60]'
                          : 'bg-gray-50 hover:bg-gray-100 text-[#40484d] border-gray-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Rule explanation banner */}
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-bold">
                      {isArabic ? 'قاعدة تسعير المباني:' : 'Building Plan Rule:'}
                    </span>{' '}
                    {isArabic
                      ? `كل عقار يتم احتسابه بمبلغ ${selectedSimPlan.tier1Rate} ر.س للعقارات من 1 إلى ${selectedSimPlan.tierLimit} عقار. عند تجاوز ${selectedSimPlan.tierLimit} عقار، يتم تفعيل السعر الثابت الأقصى بقيمة ${selectedSimPlan.cappedRate.toLocaleString()} ر.س فقط مهما زاد عدد العقارات!`
                      : `Each property is ${selectedSimPlan.tier1Rate} SAR for 1 to ${selectedSimPlan.tierLimit}, and after ${selectedSimPlan.tierLimit}+ it is capped at ${selectedSimPlan.cappedRate.toLocaleString()} SAR flat regardless of how many properties you manage!`}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Calculated Breakdown */}
              <div className="lg:col-span-6 bg-[#f9f9ff] border border-[#e3e8f9] rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#70787d] mb-2">
                    <span>{isArabic ? 'تفاصيل الحسبة الشهرية' : 'Monthly Calculation Breakdown'}</span>
                    <span className="font-mono text-[#004a60]">
                      {simulatedProperties}{' '}
                      {isArabic ? 'عقارات مسجلة' : 'Properties Enrolled'}
                    </span>
                  </div>

                  {/* Status of Capped vs Per-unit */}
                  {simResult.isCapped ? (
                    <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 p-2.5 rounded-lg text-xs font-bold flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>
                          {isArabic
                            ? `تم تطبيق السقف الثابت (${selectedSimPlan.tierLimit}+ عقار)`
                            : `Fixed Cap Applied (${selectedSimPlan.tierLimit}+ Properties)`}
                        </span>
                      </div>
                      <span className="bg-white/80 text-emerald-800 px-2 py-0.5 rounded text-[10px]">
                        {isArabic
                          ? `وفرت ${simResult.savings.toLocaleString()} ر.س/شهرياً!`
                          : `Saved ${simResult.savings.toLocaleString()} SAR/mo!`}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-blue-50 text-blue-900 border border-blue-200 p-2.5 rounded-lg text-xs font-medium mb-3 flex items-center justify-between">
                      <span>
                        {isArabic
                          ? `احتساب فردي (${simulatedProperties} × ${selectedSimPlan.tier1Rate} ر.س)`
                          : `Unit Rate Applied (${simulatedProperties} × ${selectedSimPlan.tier1Rate} SAR)`}
                      </span>
                      <span className="text-[11px] font-bold text-blue-800">
                        {isArabic
                          ? `باقي ${selectedSimPlan.tierLimit - simulatedProperties} عقار للسقف`
                          : `${selectedSimPlan.tierLimit - simulatedProperties} units until cap`}
                      </span>
                    </div>
                  )}

                  {/* Figures Table */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#70787d]">
                      <span>{isArabic ? 'القيمة قبل السقف / الخصم:' : 'Subtotal before cap:'}</span>
                      <span className="font-mono line-through text-gray-400">
                        {simResult.isCapped ? `${simResult.totalBeforeDiscount.toLocaleString()} SAR` : '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#161c27] font-semibold">
                      <span>{isArabic ? 'قيمة الاشتراك الأساسي:' : 'Base Monthly Subscription:'}</span>
                      <span className="font-mono text-base font-bold text-[#004a60]">
                        {simResult.finalPrice.toLocaleString()} SAR
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#70787d]">
                      <span>{isArabic ? 'ضريبة القيمة المضافة 15% (ZATCA):' : 'ZATCA 15% VAT:'}</span>
                      <span className="font-mono">+{simResult.vatAmount.toLocaleString()} SAR</span>
                    </div>
                    <div className="pt-2 border-t border-[#e3e8f9] flex items-center justify-between">
                      <span className="font-bold text-sm text-[#161c27]">
                        {isArabic ? 'الإجمالي الشامل للضريبة:' : 'Grand Total (Incl. VAT):'}
                      </span>
                      <span className="font-black text-lg text-emerald-800 font-mono">
                        {simResult.grandTotal.toLocaleString()} SAR
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#e3e8f9] flex items-center justify-between">
                  <div className="text-[11px] text-[#70787d]">
                    {isArabic
                      ? 'مفوترة شهرياً مع خيار الدفع السنوي بخصم 15%'
                      : 'Billed monthly with 15% annual prepayment advantage'}
                  </div>
                  <button
                    onClick={() => {
                      setSubscribePlan(selectedSimPlan);
                      setPropCountToSubscribe(simulatedProperties);
                    }}
                    className="bg-[#004a60] hover:bg-[#074e64] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    {isArabic ? 'اعتماد واشتراك' : 'Enroll Portfolio'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES (1 - Building Plans, 2 - Home Plans, 3 - Chalet Plans) */}
      {currentTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#161c27]">
                  {isArabic ? 'تصنيفات الخطط والباقات الثلاث' : 'Plan Categories (3 Core Categories)'}
                </h3>
                <p className="text-xs text-[#70787d] mt-1">
                  {isArabic
                    ? '1 - باقات المباني والأبراج (متاحة) | 2 - باقات المنازل (قريباً) | 3 - باقات الشاليهات (قريباً)'
                    : '1 - Building Plans (Available) | 2 - Home Plans (Coming Soon) | 3 - Chalet Plans (Coming Soon)'}
                </p>
              </div>
              <button
                onClick={handleResetDefaults}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#70787d] hover:text-[#004a60] px-3 py-1.5 rounded-lg border border-[#e3e8f9] hover:bg-gray-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{isArabic ? 'إعادة ضبط التصنيفات' : 'Reset Defaults'}</span>
              </button>
            </div>

            <div className="space-y-4">
              {plans.map((cat, idx) => {
                const Icon = getPlanIcon(cat.id);
                return (
                  <div
                    key={cat.id}
                    className="p-5 rounded-xl border border-[#e3e8f9] bg-[#fdfdff] hover:border-[#004a60]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#e8eeff] text-[#004a60] flex items-center justify-center font-bold text-lg shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-[#161c27]">
                            {idx + 1} - {isArabic ? cat.nameAr : cat.name}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              cat.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : cat.status === 'coming_soon'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {isArabic
                              ? cat.status === 'active'
                                ? 'متاحة حالياً'
                                : cat.status === 'coming_soon'
                                ? 'قريباً'
                                : 'معطلة'
                              : cat.status === 'active'
                              ? 'Active / Available'
                              : cat.status === 'coming_soon'
                              ? 'Coming Soon'
                              : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[#004a60] mt-0.5">
                          {isArabic ? cat.subtitleAr : cat.subtitle}
                        </p>
                        <p className="text-xs text-[#70787d] mt-1 max-w-xl">
                          {isArabic ? cat.descriptionAr : cat.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <span className="text-[11px] font-semibold text-[#70787d]">
                            {isArabic ? 'أنواع العقارات التابعة:' : 'Target Property Types:'}
                          </span>
                          {(isArabic ? cat.propertyTypesAr : cat.propertyTypes).map((pt, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-white border border-[#e3e8f9] text-[#161c27] px-2 py-0.5 rounded-md font-medium"
                            >
                              {pt}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-[#e3e8f9]">
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#004a60]">
                          {cat.tier1Rate} {cat.currency}{' '}
                          <span className="text-[10px] text-[#70787d]">
                            (1-{cat.tierLimit})
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-emerald-700">
                          {cat.cappedRate.toLocaleString()} {cat.currency}{' '}
                          <span className="text-[10px]">({cat.tierLimit}+ cap)</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingPlan(cat)}
                          className="bg-white border border-[#e3e8f9] hover:border-[#004a60] hover:bg-[#f1f3ff] text-[#004a60] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>{isArabic ? 'تعديل التصنيف' : 'Edit Category'}</span>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(cat.id)}
                          className="p-1.5 border border-[#e3e8f9] hover:bg-gray-100 rounded-lg text-[#70787d]"
                        >
                          {cat.status === 'active' ? (
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
          </div>
        </div>
      )}

      {/* TAB 3: PRICING & TIER MATRIX */}
      {currentTab === 'pricing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#e3e8f9]">
              <div>
                <h3 className="text-base font-bold text-[#161c27]">
                  {isArabic ? 'مصفوفة التسعير والحدود وسقف الخصم' : 'Pricing & Tier Threshold Matrix'}
                </h3>
                <p className="text-xs text-[#70787d] mt-1">
                  {isArabic
                    ? 'هيكل تسعير باقة المباني: 150 ر.س لكل عقار من 1 إلى 20، وسعر ثابت 3,000 ر.س لما زاد عن 20 عقار.'
                    : 'Building Plan Structure: 150 SAR per property for 1 to 20, and capped at 3,000 SAR for 20+ properties.'}
                </p>
              </div>

              <button
                onClick={() => setEditingPlan(plans[0])}
                className="bg-[#004a60] hover:bg-[#074e64] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>{isArabic ? 'تعديل سقف وأسعار المباني' : 'Configure Building Plan Tier'}</span>
              </button>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e3e8f9] text-[#70787d] uppercase text-[10px] tracking-wider bg-[#f9f9ff]">
                    <th className="py-3 px-4">{isArabic ? 'اسم الخطة' : 'Plan Name'}</th>
                    <th className="py-3 px-4">{isArabic ? 'الشريحة الأولى (من 1 إلى N)' : 'Tier 1 (1 to N Units)'}</th>
                    <th className="py-3 px-4">{isArabic ? 'حد الانتقال للسقف' : 'Cap Threshold Limit'}</th>
                    <th className="py-3 px-4">{isArabic ? 'السعر الثابت بعد الحد' : 'Fixed Price After Limit'}</th>
                    <th className="py-3 px-4">{isArabic ? 'دورة الفوترة' : 'Billing Cycle'}</th>
                    <th className="py-3 px-4">{isArabic ? 'الحالة' : 'Status'}</th>
                    <th className="py-3 px-4 text-right">{isArabic ? 'إجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8f9]">
                  {plans.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#161c27]">{isArabic ? p.nameAr : p.name}</div>
                        <div className="text-[11px] text-[#70787d]">{isArabic ? p.subtitleAr : p.subtitle}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#004a60]">
                        {p.tier1Rate} {p.currency}{' '}
                        <span className="text-[10px] text-[#70787d] font-normal">/ unit</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#161c27]">
                        {p.tierLimit} {isArabic ? 'عقار' : 'properties'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-800">
                        {p.cappedRate.toLocaleString()} {p.currency}{' '}
                        <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {isArabic ? 'ثابت سقف' : 'Fixed Cap'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#70787d]">
                        {isArabic ? p.billingFrequencyAr : p.billingFrequency}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'coming_soon'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {isArabic
                            ? p.status === 'active'
                              ? 'متاحة'
                              : p.status === 'coming_soon'
                              ? 'قريباً'
                              : 'معطلة'
                            : p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setEditingPlan(p)}
                          className="text-[#004a60] hover:text-[#074e64] font-semibold text-xs inline-flex items-center gap-1"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>{isArabic ? 'تعديل' : 'Configure'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: UNITS OF MEASURE (UoM) */}
      {currentTab === 'uom' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#161c27] mb-2">
              {isArabic ? 'وحدات القياس والتسعير (UoM)' : 'Units of Measure (UoM)'}
            </h3>
            <p className="text-xs text-[#70787d] mb-6">
              {isArabic
                ? 'تعريف الوحدات المعتمدة لاحتساب الاشتراكات الفندقية والعقارية.'
                : 'Standard units of measurement for hospitality property invoicing and tier computation.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  code: 'UOM-PROP',
                  name: 'Property (Building / Tower)',
                  nameAr: 'العقار (مبنى فندقي / برج مخدوم)',
                  symbol: 'PROP',
                  desc: 'Used in Building Plans for 1-20 properties tiering and 20+ cap.',
                },
                {
                  code: 'UOM-VILLA',
                  name: 'Private Home / Villa Unit',
                  nameAr: 'الوحدة السكنية / الفيلا الخاصة',
                  symbol: 'HOME',
                  desc: 'Used for Home Plans (Villa, Townhouses, Holiday Homes).',
                },
                {
                  code: 'UOM-CHL',
                  name: 'Chalet / Mountain Lodge',
                  nameAr: 'الشاليه / النزل الجبلي',
                  symbol: 'CHL',
                  desc: 'Used for Chalet & Resort Plans.',
                },
                {
                  code: 'UOM-KEY',
                  name: 'Hospitality Room Key',
                  nameAr: 'مفتاح غرفة فندقية',
                  symbol: 'KEY',
                  desc: 'For room-level hardware and smart lock synchronization.',
                },
                {
                  code: 'UOM-MONTH',
                  name: 'Billing Month',
                  nameAr: 'الشهر المحاسبي',
                  symbol: 'MO',
                  desc: 'Standard recurrent billing frequency cycle.',
                },
                {
                  code: 'UOM-BUNDLE',
                  name: 'Enterprise Portfolio Cap',
                  nameAr: 'سقف المحفظة الشامل',
                  symbol: 'CAP',
                  desc: 'Fixed 3,000 SAR maximum ceiling bundle.',
                },
              ].map((uom, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-[#004a60] bg-[#e8eeff] px-2 py-0.5 rounded font-bold">
                      {uom.code}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#70787d]">{uom.symbol}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#161c27]">
                    {isArabic ? uom.nameAr : uom.name}
                  </h4>
                  <p className="text-[11px] text-[#70787d] mt-1">{uom.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TAX CONFIGURATION (ZATCA Phase 2) */}
      {currentTab === 'tax_config' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#161c27] mb-2">
              {isArabic
                ? 'التهيئة الضريبية المعتمدة وهيئة الزكاة والضريبة والجمارك (ZATCA)'
                : 'Tax Configuration & ZATCA Phase 2 Fatoora Engine'}
            </h3>
            <p className="text-xs text-[#70787d] mb-6">
              {isArabic
                ? 'ضبط نسب ضريبة القيمة المضافة 15% ورسوم السياحة والبلدية 5% المتوافقة مع عقود الإيجار والضيافة.'
                : 'Automated 15% Saudi VAT and 5% Tourism & Municipality Tax configurations for hospitality contracts.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-[#e3e8f9] bg-[#fdfdff]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Percent className="h-5 w-5 text-emerald-600" />
                    <span className="font-bold text-sm text-[#161c27]">
                      {isArabic ? 'ضريبة القيمة المضافة القياسية (15%)' : 'Standard Saudi VAT (15%)'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Active / نشطة
                  </span>
                </div>
                <p className="text-xs text-[#70787d] leading-relaxed">
                  {isArabic
                    ? 'تطبق تلقائياً على كافة باقات الاشتراكات (باقات المباني، المنازل، والشاليهات) مع إنشاء الفاتورة الإلكترونية المتوافقة مع منصة فاتورة.'
                    : 'Automatically calculated on all subscription invoices with cryptographic stamp and ZATCA QR code.'}
                </p>
              </div>

              <div className="p-5 rounded-xl border border-[#e3e8f9] bg-[#fdfdff]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#004a60]" />
                    <span className="font-bold text-sm text-[#161c27]">
                      {isArabic ? 'رسوم البلدية والسياحة الفندقية (5%)' : 'Tourism & Municipality Surcharge (5%)'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#004a60] bg-[#e8eeff] px-2 py-0.5 rounded">
                    Hotel Specific
                  </span>
                </div>
                <p className="text-xs text-[#70787d] leading-relaxed">
                  {isArabic
                    ? 'خاصة بنزلاء الفنادق والشقق المخدومة، مفعلة في باقة المباني لضمان الامتثال مع بوابة بلدي وهيئة السياحة.'
                    : 'Governed by the Saudi Ministry of Tourism and Balady platform for hotel and aparthotel guests.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PLAN CONFIGURATION MODAL */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e3e8f9] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#e3e8f9]">
              <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-[#004a60]" />
                <h3 className="text-base font-bold text-[#161c27]">
                  {isArabic
                    ? `تخصيص إعدادات: ${editingPlan.nameAr}`
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
                  {isArabic ? 'حالة التفعيل:' : 'Plan Status:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'active', label: isArabic ? 'متاحة الآن' : 'Available / Active' },
                    { id: 'coming_soon', label: isArabic ? 'قريباً' : 'Coming Soon' },
                    { id: 'disabled', label: isArabic ? 'معطلة' : 'Disabled' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() =>
                        setEditingPlan({
                          ...editingPlan,
                          status: s.id as any,
                          badge: s.id === 'active' ? 'Available' : s.id === 'coming_soon' ? 'Coming Soon' : 'Disabled',
                          badgeAr: s.id === 'active' ? 'متاحة الآن' : s.id === 'coming_soon' ? 'قريباً' : 'معطلة',
                        })
                      }
                      className={`py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                        editingPlan.status === s.id
                          ? 'bg-[#004a60] text-white border-[#004a60]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'اسم الخطة (English)' : 'Plan Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white text-[#161c27]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'اسم الخطة (عربي)' : 'Plan Name (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={editingPlan.nameAr}
                    onChange={(e) => setEditingPlan({ ...editingPlan, nameAr: e.target.value })}
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white text-[#161c27]"
                    required
                  />
                </div>
              </div>

              {/* Subtitle / Property Scope */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'نوع العقارات المستهدفة (English)' : 'Target Scope (English)'}
                  </label>
                  <input
                    type="text"
                    value={editingPlan.subtitle}
                    onChange={(e) => setEditingPlan({ ...editingPlan, subtitle: e.target.value })}
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'نوع العقارات المستهدفة (عربي)' : 'Target Scope (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={editingPlan.subtitleAr}
                    onChange={(e) => setEditingPlan({ ...editingPlan, subtitleAr: e.target.value })}
                    className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white"
                  />
                </div>
              </div>

              {/* CRUCIAL TIER & CAP CONFIGURATION FIELDS */}
              <div className="bg-[#f9f9ff] p-4 rounded-xl border border-[#e3e8f9] space-y-3">
                <div className="font-bold text-xs text-[#004a60] flex items-center gap-1.5">
                  <Sliders className="h-4 w-4" />
                  <span>
                    {isArabic
                      ? 'إعدادات شرائح التسعير وسقف الخصم الثابت'
                      : 'Tiered Rate & Fixed Cap Ceiling Rules'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#161c27] mb-1">
                      {isArabic ? 'سعر العقار للشريحة الأولى:' : 'Tier 1 Rate per Property:'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={editingPlan.tier1Rate}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            tier1Rate: Math.max(1, parseInt(e.target.value) || 0),
                          })
                        }
                        className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white font-mono font-bold pr-12"
                        required
                      />
                      <span className="absolute right-2 top-2 text-[#70787d] font-semibold text-[11px]">
                        SAR
                      </span>
                    </div>
                    <span className="text-[10px] text-[#70787d]">
                      {isArabic ? 'مثال: 150 ر.س' : 'Default: 150 SAR'}
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#161c27] mb-1">
                      {isArabic ? 'حد الانتقال للسقف (عدد):' : 'Cap Limit Threshold:'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={editingPlan.tierLimit}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            tierLimit: Math.max(1, parseInt(e.target.value) || 1),
                          })
                        }
                        className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white font-mono font-bold pr-12"
                        required
                      />
                      <span className="absolute right-2 top-2 text-[#70787d] font-semibold text-[11px]">
                        {isArabic ? 'عقار' : 'units'}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#70787d]">
                      {isArabic ? 'مثال: 20 عقار' : 'Default: 20 units'}
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#161c27] mb-1">
                      {isArabic ? 'السعر الثابت بعد الحد:' : 'Fixed Price After Limit:'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={editingPlan.cappedRate}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            cappedRate: Math.max(1, parseInt(e.target.value) || 0),
                          })
                        }
                        className="w-full rounded-lg border border-[#e3e8f9] p-2 bg-white font-mono font-bold text-emerald-800 pr-12"
                        required
                      />
                      <span className="absolute right-2 top-2 text-[#70787d] font-semibold text-[11px]">
                        SAR
                      </span>
                    </div>
                    <span className="text-[10px] text-[#70787d]">
                      {isArabic ? 'مثال: 3,000 ر.س ثابت' : 'Default: 3,000 SAR fixed'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-[#e3e8f9] text-[11px] text-[#40484d] leading-relaxed">
                  <span className="font-bold text-[#004a60]">
                    {isArabic ? 'الملخص المطبق:' : 'Applied Formula:'}
                  </span>{' '}
                  {isArabic
                    ? `من 1 إلى ${editingPlan.tierLimit} عقار: يتم احتساب ${editingPlan.tier1Rate} ر.س لكل عقار. وما زاد عن ${editingPlan.tierLimit} عقار يصبح بمبلغ ثابت قدره ${editingPlan.cappedRate.toLocaleString()} ر.س.`
                    : `From 1 to ${editingPlan.tierLimit} properties: ${editingPlan.tier1Rate} SAR / property. For ${editingPlan.tierLimit}+ properties: Capped fixed at ${editingPlan.cappedRate.toLocaleString()} SAR flat.`}
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
                  onClick={handleResetDefaults}
                  className="text-xs font-semibold text-gray-500 hover:text-red-700 flex items-center gap-1"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isArabic ? 'استعادة الافتراضي' : 'Reset to Default'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPlan(null)}
                    className="px-4 py-2 rounded-lg border border-[#e3e8f9] text-gray-700 font-semibold hover:bg-gray-50"
                  >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#004a60] text-white font-bold hover:bg-[#074e64] shadow-xs flex items-center gap-1.5"
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

      {/* QUICK SUBSCRIBE / CHECKOUT MODAL */}
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
                  className="bg-[#004a60] text-white px-6 py-2 rounded-xl text-xs font-bold"
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
                    className="px-4 py-2 rounded-lg border border-[#e3e8f9] text-gray-700 font-semibold"
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
                    className="px-5 py-2 rounded-lg bg-[#004a60] text-white font-bold hover:bg-[#074e64] shadow-xs flex items-center gap-1.5"
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
    </div>
  );
};
