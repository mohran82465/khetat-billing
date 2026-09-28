import React, { useState } from 'react';
import {
  X,
  Plus,
  Check,
  Building2,
  Home,
  Tent,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  DollarSign,
  Percent,
  Trash2,
  Tag,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { PropertyPlan } from '../data/plansConfig';

interface CreatePlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
  onPlanCreated: (newPlan: PropertyPlan) => void;
}

const PRESET_PROPERTY_TYPES = [
  { en: 'Hotels', ar: 'فنادق' },
  { en: 'Serviced Apartments', ar: 'شقق مخدومة' },
  { en: 'Boutique Hotels', ar: 'فنادق بوتيك' },
  { en: 'Villas', ar: 'فلل خاصة' },
  { en: 'Townhouses', ar: 'تاون هاوس' },
  { en: 'Holiday Homes', ar: 'بيوت عطلات' },
  { en: 'Chalets', ar: 'شاليهات' },
  { en: 'Resorts', ar: 'منتجعات' },
  { en: 'Private Compounds', ar: 'مجمعات سكنية' },
  { en: 'Heritage Lodges', ar: 'نزل تراثية' },
];

export const CreatePlanFormModal: React.FC<CreatePlanFormModalProps> = ({
  isOpen,
  onClose,
  isArabic,
  onPlanCreated,
}) => {
  // Form State
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [code, setCode] = useState(() => `PLAN-HSP-${Math.floor(10 + Math.random() * 90)}`);
  const [subtitle, setSubtitle] = useState('');
  const [subtitleAr, setSubtitleAr] = useState('');
  const [tierCategory, setTierCategory] = useState<'building' | 'home' | 'chalet' | 'custom'>('building');
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([
    'Hotels',
    'Serviced Apartments',
  ]);
  const [customPropertyTypeInput, setCustomPropertyTypeInput] = useState('');

  const [status, setStatus] = useState<'active' | 'coming_soon' | 'disabled'>('active');
  const [isPopular, setIsPopular] = useState(false);

  // Pricing Structure
  const [pricingModel, setPricingModel] = useState<'tiered_capped' | 'flat_rate' | 'per_key'>('tiered_capped');
  const [tier1Rate, setTier1Rate] = useState<number>(150);
  const [tierLimit, setTierLimit] = useState<number>(20);
  const [cappedRate, setCappedRate] = useState<number>(3000);
  const [flatRateAmount, setFlatRateAmount] = useState<number>(2500);
  const [perKeyRate, setPerKeyRate] = useState<number>(15);
  const [billingFrequency, setBillingFrequency] = useState('per property / month');
  const [billingFrequencyAr, setBillingFrequencyAr] = useState('لكل عقار / شهرياً');

  // Features & Compliance
  const [zatcaPhase2Included, setZatcaPhase2Included] = useState(true);
  const [tourismTaxIncluded, setTourismTaxIncluded] = useState(true);
  const [featuresList, setFeaturesList] = useState<{ en: string; ar: string }[]>([
    {
      en: 'Full ZATCA Phase 2 Fatoora Real-Time Invoicing Clearance',
      ar: 'ربط كامل مع هيئة الزكاة والضريبة والجمارك (المرحلة الثانية - الفوترة الإلكترونية)',
    },
    {
      en: 'Unified Front Desk, Folio & Multi-Property Inventory',
      ar: 'إدارة متكاملة لمكاتب الاستقبال وحسابات النزلاء ومخزون الوحدات',
    },
    {
      en: 'Automated 5% Saudi Tourism & Municipality Tax Calculations',
      ar: 'حساب تلقائي لرسوم البلدية والسياحة السعودية 5%',
    },
    {
      en: 'Priority 24/7 SLA & Technical Support',
      ar: 'دعم فني واستجابة تشغيلية ذات أولوية على مدار الساعة',
    },
  ]);
  const [newFeatureEn, setNewFeatureEn] = useState('');
  const [newFeatureAr, setNewFeatureAr] = useState('');

  // Description
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');

  // Live simulation test properties count
  const [testPropCount, setTestPropCount] = useState<number>(12);

  if (!isOpen) return null;

  const togglePropertyType = (typeEn: string) => {
    if (selectedPropertyTypes.includes(typeEn)) {
      setSelectedPropertyTypes(selectedPropertyTypes.filter((t) => t !== typeEn));
    } else {
      setSelectedPropertyTypes([...selectedPropertyTypes, typeEn]);
    }
  };

  const handleAddCustomPropertyType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPropertyTypeInput.trim()) return;
    if (!selectedPropertyTypes.includes(customPropertyTypeInput.trim())) {
      setSelectedPropertyTypes([...selectedPropertyTypes, customPropertyTypeInput.trim()]);
    }
    setCustomPropertyTypeInput('');
  };

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureEn.trim()) return;
    setFeaturesList([
      ...featuresList,
      {
        en: newFeatureEn.trim(),
        ar: newFeatureAr.trim() || newFeatureEn.trim(),
      },
    ]);
    setNewFeatureEn('');
    setNewFeatureAr('');
  };

  const handleRemoveFeature = (index: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== index));
  };

  // Calculate simulated test price
  const calculateTestCost = (units: number) => {
    if (pricingModel === 'tiered_capped') {
      if (units <= tierLimit) {
        return units * tier1Rate;
      }
      return cappedRate;
    }
    if (pricingModel === 'flat_rate') {
      return flatRateAmount;
    }
    return units * 25 * perKeyRate; // assumed 25 keys per property
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const planId = `plan-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;

    const effectiveTier1 = pricingModel === 'tiered_capped' ? tier1Rate : pricingModel === 'flat_rate' ? flatRateAmount : perKeyRate;
    const effectiveCapped = pricingModel === 'tiered_capped' ? cappedRate : flatRateAmount;

    // Resolve property types Arabic
    const propertyTypesAr = selectedPropertyTypes.map((t) => {
      const match = PRESET_PROPERTY_TYPES.find((p) => p.en === t);
      return match ? match.ar : t;
    });

    const newPlan: PropertyPlan = {
      id: planId,
      code: code.trim() || `PLAN-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      nameAr: nameAr.trim() || name.trim(),
      subtitle: subtitle.trim() || selectedPropertyTypes.slice(0, 3).join(', '),
      subtitleAr: subtitleAr.trim() || propertyTypesAr.slice(0, 3).join('، '),
      propertyTypes: selectedPropertyTypes,
      propertyTypesAr,
      status,
      badge: status === 'active' ? (isArabic ? 'متاحة الآن' : 'Available Now') : status === 'coming_soon' ? (isArabic ? 'قريباً' : 'Coming Soon') : (isArabic ? 'معطلة' : 'Disabled'),
      badgeAr: status === 'active' ? 'متاحة الآن' : status === 'coming_soon' ? 'قريباً' : 'معطلة',
      popular: isPopular,
      pricingModel,
      tier1Rate: effectiveTier1,
      tierLimit: pricingModel === 'tiered_capped' ? tierLimit : 9999,
      cappedRate: effectiveCapped,
      currency: 'SAR',
      billingFrequency: billingFrequency,
      billingFrequencyAr: billingFrequencyAr,
      description: description.trim() || `Tailored plan designed for ${selectedPropertyTypes.join(', ')} with tiered capped pricing.`,
      descriptionAr: descriptionAr.trim() || `باقة مخصصة لإدارة ${propertyTypesAr.join('، ')} مع تسعير متدرج وسقف ثابت.`,
      features: featuresList.map((f) => f.en),
      featuresAr: featuresList.map((f) => f.ar),
      zatcaPhase2Included,
      minProperties: 1,
    };

    onPlanCreated(newPlan);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-[#e3e8f9] my-auto animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e3e8f9] mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#004a60] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#161c27]">
                {isArabic ? 'إنشاء وتصميم خطة جديدة' : 'Create New Plan & Tier'}
              </h2>
              <p className="text-xs text-[#70787d]">
                {isArabic
                  ? 'نموذج إعداد الباقة الفندقية، هيكل التسعير وسقف الخصم، والربط الضريبي ZATCA'
                  : 'Configure plan specifications, tiered capped pricing matrix, property scope, and ZATCA compliance.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#70787d] hover:text-[#161c27] p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Basic Plan Information */}
          <div className="bg-[#f9f9ff] p-4.5 rounded-xl border border-[#e3e8f9] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#161c27] flex items-center gap-1.5 uppercase tracking-wide">
                <Layers className="h-4 w-4 text-[#004a60]" />
                <span>{isArabic ? '1. معلومات وهوية الخطة' : '1. Plan Identity & Scope'}</span>
              </h3>
              <span className="text-[10px] text-[#70787d] font-mono bg-white px-2 py-0.5 rounded border border-[#e3e8f9]">
                {code}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="font-semibold text-[#161c27] block mb-1">
                  {isArabic ? 'اسم الخطة (بالإنجليزية) *' : 'Plan Name (English) *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Resort & Luxury Lodges Plan"
                  className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-[#161c27] block mb-1">
                  {isArabic ? 'اسم الخطة (بالعربية) *' : 'Plan Name (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: باقات المنتجعات والنزل الفاخرة"
                  className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="font-semibold text-[#161c27] block mb-1">
                  {isArabic ? 'رمز الخطة (Plan Code)' : 'Plan Code'}
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="PLAN-HSP-04"
                  className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-mono bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-[#161c27] block mb-1">
                  {isArabic ? 'التصنيف الأساسي (Tier)' : 'Base Tier Category'}
                </label>
                <select
                  value={tierCategory}
                  onChange={(e) => setTierCategory(e.target.value as any)}
                  className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden bg-white cursor-pointer font-medium"
                >
                  <option value="building">{isArabic ? 'مستوى المباني (Building Tier)' : 'Building Tier'}</option>
                  <option value="home">{isArabic ? 'مستوى المنازل (Home Tier)' : 'Home Tier'}</option>
                  <option value="chalet">{isArabic ? 'مستوى الشاليهات (Chalet Tier)' : 'Chalet Tier'}</option>
                  <option value="custom">{isArabic ? 'مستوى مخصص (Custom Tier)' : 'Custom Tier'}</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#161c27] block mb-1">
                  {isArabic ? 'حالة التفعيل الأولية' : 'Initial Status'}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden bg-white cursor-pointer font-medium"
                >
                  <option value="active">{isArabic ? 'متاحة للاشتراك الفوري (Active)' : 'Active (Available Now)'}</option>
                  <option value="coming_soon">{isArabic ? 'قريباً (Coming Soon)' : 'Coming Soon'}</option>
                  <option value="disabled">{isArabic ? 'معطلة (Disabled)' : 'Disabled'}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="font-semibold text-[#161c27] block mb-1">
                  {isArabic ? 'العنوان الفرعي (Subtitle EN)' : 'Subtitle (English)'}
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Resorts, Boutique Hotels, Desert Camps"
                  className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-[#161c27] block mb-1">
                  {isArabic ? 'العنوان الفرعي (Subtitle AR)' : 'Subtitle (Arabic)'}
                </label>
                <input
                  type="text"
                  value={subtitleAr}
                  onChange={(e) => setSubtitleAr(e.target.value)}
                  placeholder="مثال: المنتجعات، فنادق البوتيك، والمخيمات"
                  className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden bg-white"
                />
              </div>
            </div>

            {/* Target Property Types Multi-Selector */}
            <div>
              <label className="font-semibold text-[#161c27] block mb-1.5">
                {isArabic ? 'أنواع العقارات التابعة لهذه الخطة *' : 'Target Property Types *'}
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {PRESET_PROPERTY_TYPES.map((pt) => {
                  const isChecked = selectedPropertyTypes.includes(pt.en);
                  return (
                    <button
                      key={pt.en}
                      type="button"
                      onClick={() => togglePropertyType(pt.en)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                        isChecked
                          ? 'bg-[#004a60] text-white shadow-2xs'
                          : 'bg-white text-[#40484d] border border-[#c3cce6] hover:bg-[#e8eeff]'
                      }`}
                    >
                      {isChecked && <Check className="h-3 w-3" />}
                      <span>{isArabic ? pt.ar : pt.en}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Type */}
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  value={customPropertyTypeInput}
                  onChange={(e) => setCustomPropertyTypeInput(e.target.value)}
                  placeholder={isArabic ? 'إضافة نوع عقار آخر...' : 'Add another property type...'}
                  className="flex-1 rounded-lg border border-[#c3cce6] p-1.5 text-xs bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddCustomPropertyType}
                  className="px-3 py-1.5 bg-[#e8eeff] hover:bg-[#d5e0ff] text-[#004a60] font-bold rounded-lg text-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 inline mr-1" />
                  <span>{isArabic ? 'إضافة' : 'Add'}</span>
                </button>
              </div>
            </div>

            {/* Featured toggle */}
            <div className="pt-2 border-t border-[#e3e8f9] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#161c27] block">{isArabic ? 'خطة مميزة موصى بها (Popular Plan)' : 'Feature as Recommended / Popular'}</span>
                <span className="text-[11px] text-[#70787d]">{isArabic ? 'إظهار شارة "الأكثر طلباً" وشريط مميز أعلى بطاقة الخطة' : 'Highlight with a glowing badge on the catalog grid'}</span>
              </div>
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="h-4 w-4 rounded text-[#004a60] focus:ring-[#004a60] cursor-pointer"
              />
            </div>
          </div>

          {/* Section 2: Pricing & Tier Capping Matrix */}
          <div className="bg-[#fdfdff] p-4.5 rounded-xl border border-[#e3e8f9] space-y-4">
            <h3 className="text-xs font-bold text-[#161c27] flex items-center gap-1.5 uppercase tracking-wide">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <span>{isArabic ? '2. هيكل التسعير وسقف الخصم (Tiered Capping)' : '2. Pricing & Tier Ceiling Matrix'}</span>
            </h3>

            {/* Pricing Model Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPricingModel('tiered_capped')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  pricingModel === 'tiered_capped'
                    ? 'bg-[#e8eeff] border-[#004a60] text-[#004a60] font-bold shadow-2xs'
                    : 'bg-white border-[#c3cce6] text-[#70787d] hover:bg-[#f9f9ff]'
                }`}
              >
                <div className="text-xs font-bold">{isArabic ? 'تسعير متدرج بسقف ثابت' : 'Tiered with Cap Ceiling'}</div>
                <div className="text-[10px] text-[#70787d] mt-1">
                  {isArabic ? 'سعر لكل عقار حتى حد معين ثم سقف ثابت' : 'e.g. 150 SAR up to 20, then fixed 3k SAR'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPricingModel('flat_rate')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  pricingModel === 'flat_rate'
                    ? 'bg-[#e8eeff] border-[#004a60] text-[#004a60] font-bold shadow-2xs'
                    : 'bg-white border-[#c3cce6] text-[#70787d] hover:bg-[#f9f9ff]'
                }`}
              >
                <div className="text-xs font-bold">{isArabic ? 'سعر شهري ثابت غير محدود' : 'Flat Monthly Fee'}</div>
                <div className="text-[10px] text-[#70787d] mt-1">
                  {isArabic ? 'قيمة اشتراك ثابتة للمحفظة كاملة' : 'Fixed portfolio flat rate per month'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPricingModel('per_key')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  pricingModel === 'per_key'
                    ? 'bg-[#e8eeff] border-[#004a60] text-[#004a60] font-bold shadow-2xs'
                    : 'bg-white border-[#c3cce6] text-[#70787d] hover:bg-[#f9f9ff]'
                }`}
              >
                <div className="text-xs font-bold">{isArabic ? 'تسعير لكل مفتاح / غرفة' : 'Per Room Key'}</div>
                <div className="text-[10px] text-[#70787d] mt-1">
                  {isArabic ? 'احتساب حسب إجمالي الغرف الفندقية' : 'Direct pricing per hospitality key'}
                </div>
              </button>
            </div>

            {/* Dynamic Inputs Based on Model */}
            {pricingModel === 'tiered_capped' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-white p-3.5 rounded-xl border border-[#e3e8f9]">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'سعر العقار للشريحة الأولى (SAR) *' : 'Tier 1 Rate per Property (SAR) *'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={10}
                      value={tier1Rate}
                      onChange={(e) => setTier1Rate(Number(e.target.value))}
                      className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-bold"
                    />
                    <span className="absolute right-3 top-2 text-[#70787d] font-bold text-[10px]">SAR</span>
                  </div>
                  <span className="text-[10px] text-[#70787d] mt-0.5 block">
                    {isArabic ? 'من 1 حتى حد الانتقال' : 'From 1 to limit threshold'}
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'حد الانتقال للسقف (عدد العقارات) *' : 'Capping Threshold Limit *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={tierLimit}
                    onChange={(e) => setTierLimit(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-bold"
                  />
                  <span className="text-[10px] text-[#70787d] mt-0.5 block">
                    {isArabic ? 'مثال: 20 عقار' : 'e.g. 20 properties'}
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'السعر الثابت بعد السقف (SAR) *' : 'Fixed Capped Rate (SAR) *'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={100}
                      value={cappedRate}
                      onChange={(e) => setCappedRate(Number(e.target.value))}
                      className="w-full rounded-lg border border-emerald-400 bg-emerald-50/50 p-2 text-xs focus:border-emerald-600 outline-hidden font-extrabold text-emerald-900"
                    />
                    <span className="absolute right-3 top-2 text-emerald-800 font-bold text-[10px]">SAR</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
                    {isArabic ? 'سعر ثابت لا يزيد مهما زادت العقارات' : 'Flat ceiling for unlimited beyond threshold'}
                  </span>
                </div>
              </div>
            )}

            {pricingModel === 'flat_rate' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-white p-3.5 rounded-xl border border-[#e3e8f9]">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'المبلغ الشهري الثابت (SAR) *' : 'Flat Monthly Fee (SAR) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={flatRateAmount}
                    onChange={(e) => setFlatRateAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'دورة الفوترة' : 'Billing Frequency'}
                  </label>
                  <input
                    type="text"
                    value={billingFrequency}
                    onChange={(e) => setBillingFrequency(e.target.value)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
              </div>
            )}

            {pricingModel === 'per_key' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-white p-3.5 rounded-xl border border-[#e3e8f9]">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'السعر لكل غرفة / مفتاح (SAR) *' : 'Rate per Room Key (SAR) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={perKeyRate}
                    onChange={(e) => setPerKeyRate(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'دورة الفوترة' : 'Billing Frequency'}
                  </label>
                  <input
                    type="text"
                    value="per key / month"
                    disabled
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs bg-gray-50 text-[#70787d]"
                  />
                </div>
              </div>
            )}

            {/* Live simulation mini-calculator inside form */}
            <div className="bg-[#e8eeff]/40 p-3 rounded-xl border border-[#c3cce6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-[#004a60] block text-xs">
                  {isArabic ? 'محاكاة تسعير فورية للخطة الجديدة:' : 'Live Price Preview for Subscriber:'}
                </span>
                <span className="text-[11px] text-[#40484d]">
                  {isArabic ? `عند اختيار ${testPropCount} عقار:` : `For ${testPropCount} properties:`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={35}
                  value={testPropCount}
                  onChange={(e) => setTestPropCount(Number(e.target.value))}
                  className="w-28 accent-[#004a60] cursor-pointer"
                />
                <span className="font-mono text-sm font-extrabold text-[#004a60] bg-white px-2.5 py-1 rounded-lg border border-[#004a60]/20">
                  {calculateTestCost(testPropCount).toLocaleString()} SAR
                  <span className="text-[10px] font-normal text-[#70787d]"> / mo</span>
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Regulatory & Features */}
          <div className="bg-[#f9f9ff] p-4.5 rounded-xl border border-[#e3e8f9] space-y-4">
            <h3 className="text-xs font-bold text-[#161c27] flex items-center gap-1.5 uppercase tracking-wide">
              <ShieldCheck className="h-4 w-4 text-[#004a60]" />
              <span>{isArabic ? '3. الامتثال التنظيمي وقائمة المزايا' : '3. Compliance & Feature Bullets'}</span>
            </h3>

            {/* Checkboxes for ZATCA & Tourism */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-300 bg-emerald-50/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={zatcaPhase2Included}
                  onChange={(e) => setZatcaPhase2Included(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-[#161c27] block">
                    {isArabic ? 'الربط الضريبي ZATCA المرحلة 2 معتمد' : 'ZATCA Phase 2 Fatoora Included'}
                  </span>
                  <span className="text-[10px] text-[#70787d]">
                    {isArabic ? 'تضمين التشفير الرقمي والختم المشفر ورمز الاستجابة السريع' : 'Real-time e-invoicing clearance and cryptographic stamp'}
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-blue-300 bg-blue-50/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tourismTaxIncluded}
                  onChange={(e) => setTourismTaxIncluded(e.target.checked)}
                  className="mt-0.5 rounded text-[#004a60] focus:ring-[#004a60] cursor-pointer"
                />
                <div>
                  <span className="font-bold text-[#161c27] block">
                    {isArabic ? 'رسوم السياحة والبلدية 5% مفعلة' : 'Tourism & Municipality 5% Tax Engine'}
                  </span>
                  <span className="text-[10px] text-[#70787d]">
                    {isArabic ? 'حساب تلقائي لرسوم بوابة بلدي وهيئة السياحة' : 'Automated calculation compliant with Balady platform'}
                  </span>
                </div>
              </label>
            </div>

            {/* Dynamic Features List */}
            <div>
              <label className="font-semibold text-[#161c27] block mb-1">
                {isArabic ? 'بنود ومزايا الخطة (Features List)' : 'Plan Features Bullets'}
              </label>
              <div className="space-y-1.5 mb-3">
                {featuresList.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#e3e8f9] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="text-[#161c27] font-medium">{isArabic ? f.ar : f.en}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add feature input row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newFeatureEn}
                  onChange={(e) => setNewFeatureEn(e.target.value)}
                  placeholder="Feature in English (e.g. 24/7 OTA Sync)..."
                  className="rounded-lg border border-[#c3cce6] p-2 text-xs bg-white"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newFeatureAr}
                    onChange={(e) => setNewFeatureAr(e.target.value)}
                    placeholder="الميزة بالعربية (مثال: مزامنة قنوات الحجز 24/7)..."
                    className="flex-1 rounded-lg border border-[#c3cce6] p-2 text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-2 bg-[#004a60] text-white font-bold rounded-lg text-xs cursor-pointer hover:bg-[#074e64]"
                  >
                    <Plus className="h-3.5 w-3.5 inline mr-1" />
                    <span>{isArabic ? 'إضافة' : 'Add'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="font-semibold text-[#161c27] block mb-1">
                  {isArabic ? 'الوصف التفصيلي (English)' : 'Detailed Description (English)'}
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Designed for properties requiring tiered volume pricing..."
                  className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>
              <div>
                <label className="font-semibold text-[#161c27] block mb-1">
                  {isArabic ? 'الوصف التفصيلي (العربية)' : 'Detailed Description (Arabic)'}
                </label>
                <textarea
                  rows={2}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="مصممة للمنشآت الفندقية والعقارية التي تبحث عن سقف تسعير مرن..."
                  className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#e3e8f9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#c3cce6] text-[#70787d] hover:bg-gray-100 font-semibold cursor-pointer text-xs"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all hover:shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span>{isArabic ? 'إنشاء ونشر الخطة' : 'Create & Publish Plan'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
