export interface PropertyPlan {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  subtitle: string;
  subtitleAr: string;
  propertyTypes: string[];
  propertyTypesAr: string[];
  status: 'active' | 'coming_soon' | 'disabled';
  badge?: string;
  badgeAr?: string;
  popular?: boolean;

  // Tiered Capped Pricing
  pricingModel: 'tiered_capped' | 'flat_rate' | 'per_key';
  tier1Rate: number; // e.g. 150 SAR per property
  tierLimit: number; // e.g. 20 properties
  cappedRate: number; // e.g. 3000 SAR after tierLimit
  currency: string;
  billingFrequency: string;
  billingFrequencyAr: string;

  description: string;
  descriptionAr: string;
  features: string[];
  featuresAr: string[];
  zatcaPhase2Included: boolean;
  minProperties: number;
}

export const DEFAULT_PLANS: PropertyPlan[] = [
  {
    id: 'building-plans',
    code: 'PLAN-BLD-01',
    name: 'Building Plans',
    nameAr: 'باقات المباني والأبراج',
    subtitle: 'Hotels, Serviced Apartments',
    subtitleAr: 'الفنادق، والشقق المخدومة',
    propertyTypes: ['Hotels', 'Serviced Apartments', 'Boutique Hotels', 'Commercial Residential Towers'],
    propertyTypesAr: ['فنادق', 'شقق مخدومة', 'فنادق بوتيك', 'أبراج سكنية وتجارية'],
    status: 'active',
    badge: 'Available Now',
    badgeAr: 'متاحة الآن',
    popular: true,
    pricingModel: 'tiered_capped',
    tier1Rate: 150,
    tierLimit: 20,
    cappedRate: 3000,
    currency: 'SAR',
    billingFrequency: 'per property / month',
    billingFrequencyAr: 'لكل عقار / شهرياً',
    description:
      'Engineered for mid-to-large hospitality assets. Tiered pricing: 150 SAR per property for 1 to 20 properties. Above 20 properties, enjoy a fixed capped price of 3,000 SAR flat.',
    descriptionAr:
      'مخصصة للمنشآت الفندقية والأبراج السكنية المخدومة: 150 ر.س لكل عقار من 1 إلى 20 عقار، وفوق 20 عقار سعر ثابت بقيمة 3,000 ر.س شهرياً.',
    features: [
      '1 to 20 Properties: 150 SAR / property',
      '20+ Properties: Fixed Capped 3,000 SAR Flat',
      'Full ZATCA Phase 2 Fatoora Real-Time Invoicing Clearance',
      'Unified Front Desk, Folio & Multi-Property Inventory',
      'Automated 5% Saudi Tourism & Municipality Tax Calculations',
      'OTA Channel Integration & Direct Booking Engine',
      'Bilingual Arabic / English Tax Invoices with QR Code',
      'Priority 24/7 SLA & Technical Support',
    ],
    featuresAr: [
      'من 1 إلى 20 عقار: 150 ر.س لكل عقار',
      'أكثر من 20 عقار: سعر سقف ثابت بقيمة 3,000 ر.س فقط',
      'ربط كامل مع هيئة الزكاة والضريبة والجمارك (المرحلة الثانية - الفوترة الإلكترونية)',
      'إدارة متكاملة لمكاتب الاستقبال وحسابات النزلاء ومخزون الوحدات',
      'حساب تلقائي لرسوم البلدية والسياحة السعودية 5%',
      'ربط قنوات الحجز العالمية ومحرك حجز مباشر',
      'فواتير ضريبية ثنائية اللغة برمز الاستجابة السريع QR',
      'دعم فني واستجابة تشغيلية ذات أولوية على مدار الساعة',
    ],
    zatcaPhase2Included: true,
    minProperties: 1,
  },
  {
    id: 'home-plans',
    code: 'PLAN-HOM-02',
    name: 'Home Plans',
    nameAr: 'باقات المنازل والفلل',
    subtitle: 'Villa, Townhouses, Holiday Homes',
    subtitleAr: 'الفلل، التاون هاوس، وبيوت العطلات',
    propertyTypes: ['Villas', 'Townhouses', 'Holiday Homes', 'Private Compounds'],
    propertyTypesAr: ['فلل خاصة', 'تاون هاوس', 'بيوت عطلات', 'مجمعات سكنية خاصة'],
    status: 'coming_soon',
    badge: 'Coming Soon',
    badgeAr: 'قريباً',
    popular: false,
    pricingModel: 'tiered_capped',
    tier1Rate: 120,
    tierLimit: 15,
    cappedRate: 2000,
    currency: 'SAR',
    billingFrequency: 'per property / month',
    billingFrequencyAr: 'لكل عقار / شهرياً',
    description:
      'Tailored for private vacation villas, townhouses, and holiday rental portfolios with smart IoT lock pin generation and Balady license sync.',
    descriptionAr:
      'مصممة لفلل العطلات الخاصة، التاون هاوس، وبيوت الضيافة مع إدارة الأقفال الذكية والربط مع رخص منصة بلدي.',
    features: [
      'Smart Door Lock PIN Automation via WhatsApp on Check-in',
      'Direct Guest Nafath e-ID Verification',
      'ZATCA Simplified Tax Invoices with Instant QR Code',
      'Security Deposit Pre-Authorization via Mada & Apple Pay',
      'Housekeeping Turnover Inspection with Timestamp Photos',
      'Calendar Sync across Airbnb, Vrbo & Direct Web',
    ],
    featuresAr: [
      'إرسال الرقم السري للأقفال الذكية تلقائياً عبر الواتساب عند تسجيل الدخول',
      'التحقق من هوية النزلاء الوطنية عبر النفاذ الوطني الموحد',
      'فواتير ضريبية مبسطة معتمدة من هيئة الزكاة والضريبة والجمارك',
      'حجز مبلغ التأمين تلقائياً عبر مدى و Apple Pay',
      'قوائم فحص النظافة والصيانة مع التوثيق بالصور وتاريخ الإنجاز',
      'مزامنة التقويم والحجوزات عبر المنصات والموقع المباشر',
    ],
    zatcaPhase2Included: true,
    minProperties: 1,
  },
  {
    id: 'chalet-plans',
    code: 'PLAN-CHL-03',
    name: 'Chalet Plans',
    nameAr: 'باقات الشاليهات والمنتجعات',
    subtitle: 'Chalets, Mountain Lodges',
    subtitleAr: 'الشاليهات، النزل الجبلية والريفية',
    propertyTypes: ['Chalets', 'Mountain Lodges', 'Desert Camps', 'Heritage Farmhouses'],
    propertyTypesAr: ['شاليهات خاصة', 'نزل جبلية', 'مخيمات صحراوية فاخرة', 'مزارع واستراحات ريفية'],
    status: 'coming_soon',
    badge: 'Coming Soon',
    badgeAr: 'قريباً',
    popular: false,
    pricingModel: 'tiered_capped',
    tier1Rate: 100,
    tierLimit: 10,
    cappedRate: 1500,
    currency: 'SAR',
    billingFrequency: 'per property / month',
    billingFrequencyAr: 'لكل عقار / شهرياً',
    description:
      'Custom built for countryside chalets, mountain lodges in Taif & Asir, and desert retreats with automated seasonal pricing.',
    descriptionAr:
      'معدة خصيصاً للشاليهات والنزل الريفية والجبلية مع إدارة الأسعار الموسمية وعطلات نهاية الأسبوع.',
    features: [
      'Dynamic Weekend & Peak Season Rate Rule Automation',
      'Self Check-in Keyless Entry Integration',
      'Automated Swimming Pool & Facility Maintenance Checklists',
      'Bilingual Guest Digital Contract & Terms Acceptance',
      'Instant SMS & WhatsApp Payment Confirmation Links',
      'ZATCA Compliant Invoices & Daily Sales Audits',
    ],
    featuresAr: [
      'إدارة تلقائية للأسعار الموسمية وعطلات نهاية الأسبوع والأعياد',
      'دخول ذاتي آمن بدون مفاتيح تقليدية',
      'جداول متابعة صيانة المسابح والمرافق الخارجية دورياً',
      'عقد استئجار إلكتروني رقمي موثق مع الشروط والأحكام',
      'روابط دفع سريعة وفورية عبر الرسائل النصية والواتساب',
      'فواتير معتمدة من الزكاة والضريبة مع تقارير الإيرادات اليومية',
    ],
    zatcaPhase2Included: true,
    minProperties: 1,
  },
];

const LOCAL_STORAGE_KEY = 'mira_hospitality_plans_v1';

export function getStoredPlans(): PropertyPlan[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load plans from localStorage', e);
  }
  return DEFAULT_PLANS;
}

export function saveStoredPlans(plans: PropertyPlan[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plans));
  } catch (e) {
    console.error('Failed to save plans to localStorage', e);
  }
}

export function calculatePlanCost(
  plan: PropertyPlan,
  propertyCount: number
): {
  propertyCount: number;
  ratePerUnit: number;
  totalBeforeDiscount: number;
  isCapped: boolean;
  finalPrice: number;
  savings: number;
  vatAmount: number;
  grandTotal: number;
} {
  const count = Math.max(1, propertyCount);
  const rawSubtotal = count * plan.tier1Rate;
  let finalPrice = 0;
  let isCapped = false;
  let savings = 0;

  if (plan.pricingModel === 'tiered_capped') {
    if (count <= plan.tierLimit) {
      finalPrice = count * plan.tier1Rate;
      isCapped = false;
      savings = 0;
    } else {
      // 20+ properties is fixed cap rate (e.g. 3000 SAR)
      finalPrice = plan.cappedRate;
      isCapped = true;
      savings = Math.max(0, rawSubtotal - plan.cappedRate);
    }
  } else {
    finalPrice = rawSubtotal;
  }

  const vatAmount = Math.round(finalPrice * 0.15 * 100) / 100;
  const grandTotal = Math.round((finalPrice + vatAmount) * 100) / 100;

  return {
    propertyCount: count,
    ratePerUnit: plan.tier1Rate,
    totalBeforeDiscount: rawSubtotal,
    isCapped,
    finalPrice,
    savings,
    vatAmount,
    grandTotal,
  };
}
