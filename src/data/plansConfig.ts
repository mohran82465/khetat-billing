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

  // Default / Baseline Pricing Model
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

export interface PlanTier {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  // Relationship / Pointer to the parent plan ("المستوى يشاور على الخطة التابعة له")
  planId: string;
  planName?: string;
  planNameAr?: string;
  
  tierLevel: number; // 1, 2, 3...
  minProperties: number;
  maxProperties: number | null; // null for unlimited / cap threshold
  
  pricingModel: 'tiered_capped' | 'flat_rate' | 'per_key';
  ratePerUnit: number;
  cappedRate?: number;
  currency: string;
  billingFrequency: string;
  billingFrequencyAr: string;

  status: 'active' | 'coming_soon' | 'disabled';
  badge?: string;
  badgeAr?: string;
  isPopular?: boolean;

  description: string;
  descriptionAr: string;
  features: string[];
  featuresAr: string[];
  slaResponseHours?: number;
  supportLevel?: 'standard' | 'priority' | 'dedicated_vip';
  supportLevelAr?: string;

  // Taxes & Financial Settings Integration
  appliedTaxIds?: string[];
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

// Separated Tiers that point to their parent Plan ("المستوى يشاور على الخطة التابعة له")
export const DEFAULT_TIERS: PlanTier[] = [
  // TIERS FOR BUILDING PLANS (باقات المباني والأبراج)
  {
    id: 'tier-bld-starter',
    code: 'TR-BLD-01',
    name: 'Building Starter Tier (1 - 10 Units)',
    nameAr: 'المستوى الأول: النمو الأولي للأبراج (1 - 10 عقارات)',
    planId: 'building-plans',
    planName: 'Building Plans',
    planNameAr: 'باقات المباني والأبراج',
    tierLevel: 1,
    minProperties: 1,
    maxProperties: 10,
    pricingModel: 'tiered_capped',
    ratePerUnit: 160,
    cappedRate: 1600,
    currency: 'SAR',
    billingFrequency: 'per property / month',
    billingFrequencyAr: 'لكل عقار / شهرياً',
    status: 'active',
    badge: 'Starter',
    badgeAr: 'المستوى الأساسي',
    isPopular: false,
    description: 'Designed for boutique hotels and early-stage serviced apartment buildings up to 10 units.',
    descriptionAr: 'مخصص للمنشآت الفندقية والشقق المخدومة الناشئة من 1 إلى 10 وحدات أو عقارات مخدومة.',
    features: [
      'ZATCA Phase 2 Fatoora clearance',
      'Front desk folio & key card integration',
      'Direct WhatsApp booking links',
      '12h SLA Support',
    ],
    featuresAr: [
      'ربط الفوترة الإلكترونية مع الزكاة والضريبة',
      'إدارة مكتب الاستقبال والنزلاء والمفاتيح',
      'روابط حجز مباشرة عبر الواتساب',
      'دعم فني خلال 12 ساعة',
    ],
    slaResponseHours: 12,
    supportLevel: 'standard',
    supportLevelAr: 'دعم قياسي خلال 12 ساعة',
    appliedTaxIds: ['tax-vat-15'],
  },
  {
    id: 'tier-bld-growth',
    code: 'TR-BLD-02',
    name: 'Building Growth & Capped Tier (11 - 20 Units)',
    nameAr: 'المستوى الثاني: الاحترافي المتدرج (11 - 20 عقار)',
    planId: 'building-plans',
    planName: 'Building Plans',
    planNameAr: 'باقات المباني والأبراج',
    tierLevel: 2,
    minProperties: 11,
    maxProperties: 20,
    pricingModel: 'tiered_capped',
    ratePerUnit: 150,
    cappedRate: 3000,
    currency: 'SAR',
    billingFrequency: 'per property / month',
    billingFrequencyAr: 'لكل عقار / شهرياً',
    status: 'active',
    badge: 'Most Popular / Capped',
    badgeAr: 'الأكثر طلباً - سقف سعري',
    isPopular: true,
    description: 'The golden tier for growing hotel operators with 150 SAR/unit and automatic 3,000 SAR maximum ceiling.',
    descriptionAr: 'المستوى الأكثر طلباً للمشغلين: 150 ر.س لكل عقار وسقف سعري أقصى 3,000 ر.س شهرياً.',
    features: [
      'Full ZATCA Phase 2 Real-Time Clearance',
      '5% Saudi Tourism & Municipality Tax Calculation',
      'OTA Channel Manager (Booking.com, Agoda)',
      'Guaranteed 3,000 SAR Cap for over 20 properties',
      '4h Priority Technical SLA',
    ],
    featuresAr: [
      'ربط الزكاة والضريبة والجمارك المرحلة 2',
      'احتساب رسوم السياحة والبلدية 5% تلقائياً',
      'ربط قنوات الحجز الدولية OTA',
      'سقف ثابت بحد أقصى 3,000 ر.س عند تجاوز 20 عقار',
      'أولوية استجابة دعم فني خلال 4 ساعات',
    ],
    slaResponseHours: 4,
    supportLevel: 'priority',
    supportLevelAr: 'أولوية دعم تشغيلي خلال 4 ساعات',
    appliedTaxIds: ['tax-vat-15', 'tax-mun-05'],
  },
  {
    id: 'tier-bld-enterprise',
    code: 'TR-BLD-03',
    name: 'Building Enterprise Towers Tier (21+ Units)',
    nameAr: 'المستوى الثالث: المؤسسات والأبراج الكبرى (21+ عقار)',
    planId: 'building-plans',
    planName: 'Building Plans',
    planNameAr: 'باقات المباني والأبراج',
    tierLevel: 3,
    minProperties: 21,
    maxProperties: null, // Unlimited
    pricingModel: 'tiered_capped',
    ratePerUnit: 150,
    cappedRate: 3000,
    currency: 'SAR',
    billingFrequency: 'fixed capped / month',
    billingFrequencyAr: 'سقف ثابت شهرياً',
    status: 'active',
    badge: 'Unlimited Capped',
    badgeAr: 'سعر سقف غير محدود',
    isPopular: false,
    description: 'Fixed flat rate of 3,000 SAR for enterprise operators managing unlimited properties and large hotel chains.',
    descriptionAr: 'سعر سقف ثابت 3,000 ر.س شهرياً للمؤسسات الكبرى وسلاسل الأبراج الفندقية مهما بلغ عدد العقارات.',
    features: [
      'Unlimited properties under one single subscription',
      'USALI Hotel Accounting ledger integration',
      'Multi-branch central management',
      'Dedicated Account Manager & 1h Critical SLA',
      'Enterprise Custom API & Webhooks',
    ],
    featuresAr: [
      'عدد عقارات وأبراج غير محدود باشتراك واحد',
      'تكامل محاسبي مع معايير USALI الفندقية',
      'إدارة مركزية متعددة الفروع والمشغلين',
      'مدير حساب مخصص واستجابة فورية خلال ساعة واحدة',
      'واجهات برمجة تطبيقات مخصصة API & Webhooks',
    ],
    slaResponseHours: 1,
    supportLevel: 'dedicated_vip',
    supportLevelAr: 'مدير حساب مخصص واستجابة خلال ساعة',
    appliedTaxIds: ['tax-vat-15', 'tax-mun-05', 'tax-tour-25'],
  },

  // TIERS FOR HOME PLANS (باقات المنازل والفلل)
  {
    id: 'tier-hom-basic',
    code: 'TR-HOM-01',
    name: 'Home Starter Tier (1 - 5 Villas)',
    nameAr: 'المستوى الأول: فلل الضيافة المستقلة (1 - 5 فلل)',
    planId: 'home-plans',
    planName: 'Home Plans',
    planNameAr: 'باقات المنازل والفلل',
    tierLevel: 1,
    minProperties: 1,
    maxProperties: 5,
    pricingModel: 'tiered_capped',
    ratePerUnit: 130,
    cappedRate: 650,
    currency: 'SAR',
    billingFrequency: 'per property / month',
    billingFrequencyAr: 'لكل فيلا / شهرياً',
    status: 'coming_soon',
    badge: 'Coming Soon',
    badgeAr: 'قريباً',
    isPopular: false,
    description: 'Ideal for individual owners and holiday home hosts managing up to 5 vacation houses.',
    descriptionAr: 'مستوى مخصص لمالكي ومستضيفي بيوت العطلات والفلل المستقلة حتى 5 فلل.',
    features: [
      'Smart Door Lock PIN via WhatsApp on Check-in',
      'Nafath e-ID Verification',
      'Simplified ZATCA Tax Invoices',
      'Standard Support',
    ],
    featuresAr: [
      'إرسال رمز القفل الذكي عبر الواتساب عند الدخول',
      'التحقق من هوية النزلاء عبر نفاذ',
      'فواتير ضريبية مبسطة معتمدة',
      'دعم فني قياسي',
    ],
    slaResponseHours: 12,
    supportLevel: 'standard',
    supportLevelAr: 'دعم قياسي',
    appliedTaxIds: ['tax-vat-15'],
  },
  {
    id: 'tier-hom-portfolio',
    code: 'TR-HOM-02',
    name: 'Home Portfolio Tier (6 - 15 Villas)',
    nameAr: 'المستوى الثاني: المحفظة السكنية والكمباوندات (6 - 15 فيلا)',
    planId: 'home-plans',
    planName: 'Home Plans',
    planNameAr: 'باقات المنازل والفلل',
    tierLevel: 2,
    minProperties: 6,
    maxProperties: 15,
    pricingModel: 'tiered_capped',
    ratePerUnit: 120,
    cappedRate: 2000,
    currency: 'SAR',
    billingFrequency: 'per property / month',
    billingFrequencyAr: 'لكل فيلا / شهرياً',
    status: 'coming_soon',
    badge: 'Capped at 2,000 SAR',
    badgeAr: 'سقف 2,000 ر.س',
    isPopular: true,
    description: 'Designed for residential portfolio managers and gated compounds with up to 2,000 SAR capped fee.',
    descriptionAr: 'مخصص للمجمعات السكنية الخاصة ومحافظ بيوت العطلات مع سقف أقصى 2,000 ر.س شهرياً.',
    features: [
      'Airbnb & Vrbo Real-time Calendar Sync',
      'Balady Platform license sync',
      'Automated Housekeeping Turnover Photos',
      'Mada/Apple Pay Security Deposit Hold',
      'Priority 4h SLA Support',
    ],
    featuresAr: [
      'مزامنة فورية للتقويم مع منصات Airbnb و Vrbo',
      'تكامل رخص منصة بلدي للضيافة السكنية',
      'توثيق نظافة وصيانة الوحدات بالصور والتاريخ',
      'حجز مبلغ التأمين تلقائياً عبر مدى و Apple Pay',
      'دعم تشغيلي ذو أولوية خلال 4 ساعات',
    ],
    slaResponseHours: 4,
    supportLevel: 'priority',
    supportLevelAr: 'أولوية استجابة 4 ساعات',
  },

  // TIERS FOR CHALET PLANS (باقات الشاليهات والمنتجعات)
  {
    id: 'tier-chl-standard',
    code: 'TR-CHL-01',
    name: 'Chalet Standard Tier (1 - 5 Chalets)',
    nameAr: 'المستوى الأول: الشاليهات والاستراحات (1 - 5 شاليهات)',
    planId: 'chalet-plans',
    planName: 'Chalet Plans',
    planNameAr: 'باقات الشاليهات والمنتجعات',
    tierLevel: 1,
    minProperties: 1,
    maxProperties: 5,
    pricingModel: 'tiered_capped',
    ratePerUnit: 110,
    cappedRate: 550,
    currency: 'SAR',
    billingFrequency: 'per chalet / month',
    billingFrequencyAr: 'لكل شاليه / شهرياً',
    status: 'coming_soon',
    badge: 'Coming Soon',
    badgeAr: 'قريباً',
    isPopular: false,
    description: 'For private chalets, weekend retreats, and countryside lodges with self check-in.',
    descriptionAr: 'للشاليهات الخاصة والاستراحات الريفية والنزل مع خدمات الدخول الذاتي.',
    features: [
      'Dynamic weekend & holiday pricing rules',
      'Self check-in keyless entry',
      'Instant SMS/WhatsApp payment links',
      'Daily ZATCA sales invoices',
    ],
    featuresAr: [
      'تسعير تلقائي لعطلات نهاية الأسبوع والمواسم',
      'دخول ذاتي بدون مفاتيح تقليدية',
      'روابط دفع سريعة عبر الرسائل النصية والواتساب',
      'فواتير مبيعات إلكترونية معتمدة من الزكاة',
    ],
    slaResponseHours: 12,
    supportLevel: 'standard',
    supportLevelAr: 'دعم قياسي',
  },
  {
    id: 'tier-chl-resort',
    code: 'TR-CHL-02',
    name: 'Chalet Resort & Camps Tier (6 - 10 Chalets)',
    nameAr: 'المستوى الثاني: المنتجعات والمخيمات الفاخرة (6 - 10 وحدات)',
    planId: 'chalet-plans',
    planName: 'Chalet Plans',
    planNameAr: 'باقات الشاليهات والمنتجعات',
    tierLevel: 2,
    minProperties: 6,
    maxProperties: 10,
    pricingModel: 'tiered_capped',
    ratePerUnit: 100,
    cappedRate: 1500,
    currency: 'SAR',
    billingFrequency: 'per chalet / month',
    billingFrequencyAr: 'لكل شاليه / شهرياً',
    status: 'coming_soon',
    badge: 'Capped at 1,500 SAR',
    badgeAr: 'سقف 1,500 ر.س',
    isPopular: true,
    description: 'For desert camps, mountain resorts, and chalet clusters with fixed 1,500 SAR maximum cap.',
    descriptionAr: 'للمخيمات الصحراوية الفاخرة ومجموعات الشاليهات مع سقف سعري أقصى 1,500 ر.س شهرياً.',
    features: [
      'Bilingual digital rental contracts & signature',
      'Swimming pool & facility maintenance inspection',
      'Capped price at 1,500 SAR flat',
      'Dedicated onboarding & technical setup',
    ],
    featuresAr: [
      'عقود إيجار رقمية ثنائية اللغة وتوقيع إلكتروني',
      'جداول متابعة صيانة المسابح والمرافق دورياً',
      'سقف سعري أقصى بقيمة 1,500 ر.س فقط',
      'تهيئة فنية وتشغيلية مخصصة للمنشأة',
    ],
    slaResponseHours: 4,
    supportLevel: 'priority',
    supportLevelAr: 'دعم ذو أولوية خلال 4 ساعات',
  },
];

const LOCAL_STORAGE_PLANS_KEY = 'mira_hospitality_plans_v2';
const LOCAL_STORAGE_TIERS_KEY = 'mira_hospitality_tiers_v2';

export function getStoredPlans(): PropertyPlan[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PLANS_KEY);
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
    localStorage.setItem(LOCAL_STORAGE_PLANS_KEY, JSON.stringify(plans));
  } catch (e) {
    console.error('Failed to save plans to localStorage', e);
  }
}

export function getStoredTiers(): PlanTier[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TIERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load tiers from localStorage', e);
  }
  return DEFAULT_TIERS;
}

export function saveStoredTiers(tiers: PlanTier[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_TIERS_KEY, JSON.stringify(tiers));
  } catch (e) {
    console.error('Failed to save tiers to localStorage', e);
  }
}

export function getTiersForPlan(planId: string, tiers: PlanTier[]): PlanTier[] {
  return tiers.filter((t) => t.planId === planId);
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
