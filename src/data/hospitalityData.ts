export interface HospitalityPlan {
  id: string;
  name: string;
  nameAr: string;
  category: 'Hotels' | 'Villas' | 'Apartments' | 'Enterprise Suite';
  badge?: string;
  pricingModel: 'Per Room / Key' | 'Per Property Flat' | 'Hybrid Tiered';
  basePrice: number;
  currency: string;
  billingFrequency: string;
  keyLimit: string;
  description: string;
  descriptionAr: string;
  features: string[];
  zatcaPhase2Included: boolean;
  otaChannelsIncluded: number;
  popular?: boolean;
}

export interface HospitalityBillingCycle {
  id: string;
  name: string;
  nameAr: string;
  frequency: 'Monthly' | 'Quarterly' | 'Annual' | 'Seasonal (Hajj & Umrah)' | 'Custom Advance';
  discountPercent: number;
  activeProperties: number;
  totalCycleMRR: number;
  description: string;
  autoZatcaInvoice: boolean;
  nextBatchDate: string;
  paymentMethods: string[];
}

export interface ActiveHospitalitySubscription {
  id: string;
  code: string;
  propertyName: string;
  propertyNameAr: string;
  propertyType: 'Hotel' | 'Villa' | 'Apartment';
  classification: '5-Star Resort' | 'Boutique Hotel' | 'Luxury Private Compound' | 'Serviced Residences' | 'Heritage Retreat' | 'Aparthotel';
  city: 'Riyadh' | 'Jeddah' | 'AlUla' | 'Makkah' | 'Madinah' | 'Al Khobar' | 'Taif' | 'Red Sea';
  crNumber: string;
  zatcaTrn: string;
  planName: string;
  keysCount: number;
  billingCycle: string;
  mrr: number;
  annualContractValue: number;
  startDate: string;
  renewalDate: string;
  status: 'Active' | 'Pending Renewal' | 'Trial' | 'Seasonal Pause';
  paymentMode: 'Mada Direct Debit' | 'SARIE Wire' | 'SADAD' | 'Corporate Card';
  zatcaCsid: {
    status: 'Valid & Cleared' | 'Expiring Soon' | 'Handshake In-Progress';
    csidId: string;
    lastSynced: string;
  };
  features: {
    channelManager: boolean;
    iotSmartDoorLocks: boolean;
    nafathGuestVerification: boolean;
    saudiTourismTaxReport: boolean;
    whatsappConcierge: boolean;
  };
  generalManager: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface HospitalityCoupon {
  id: string;
  code: string;
  title: string;
  titleAr: string;
  discountType: 'Percentage' | 'Fixed SAR' | 'Free Add-on';
  discountValue: string;
  eligibility: 'All Properties' | 'Hotels' | 'Villas & Chalets' | 'Serviced Apartments';
  redeemedCount: number;
  maxRedemptions: number;
  validUntil: string;
  status: 'Active' | 'Expired' | 'Scheduled';
  campaignNote: string;
}

export interface HospitalityLifecycleEvent {
  id: string;
  timestamp: string;
  propertyName: string;
  propertyType: 'Hotel' | 'Villa' | 'Apartment';
  eventType: 'New Contract' | 'Key Expansion' | 'Plan Upgrade' | 'Cycle Switch' | 'Renewal Settled' | 'ZATCA Compliance Handshake';
  details: string;
  amountChange: string;
  user: string;
  badgeColor: string;
}

export interface HospitalityRenewalReminder {
  id: string;
  propertyName: string;
  propertyNameAr: string;
  propertyType: 'Hotel' | 'Villa' | 'Apartment';
  keys: number;
  contractValue: number;
  renewalDueDate: string;
  daysRemaining: number;
  stage: '30 Days Before' | '14 Days Before' | '7 Days Before' | 'Due Today' | 'Overdue Grace';
  notificationChannel: 'WhatsApp & Email' | 'SMS & WhatsApp' | 'Executive Call';
  lastDispatched: string;
  clientResponseStatus: 'Acknowledged' | 'Auto-Pay Scheduled' | 'Reviewing Quotation' | 'Pending Contact';
  gmContact: {
    name: string;
    phone: string;
    email: string;
  };
}

// 1. Subscription Plans (Catalog)
export const HOSPITALITY_PLANS: HospitalityPlan[] = [
  {
    id: 'plan-hotel-enterprise',
    name: 'Hotel Enterprise OS',
    nameAr: 'نظام الفنادق المؤسسي المتكامل',
    category: 'Hotels',
    badge: 'Flagship PMS',
    pricingModel: 'Per Room / Key',
    basePrice: 42,
    currency: 'SAR',
    billingFrequency: 'per key / month (Billed Annually)',
    keyLimit: '50 - 1,200 Keys',
    description: 'Complete Property Management System (PMS) tailored for 4-star, 5-star, and luxury heritage resorts across Saudi Arabia.',
    descriptionAr: 'نظام إدارة المنشآت الفندقية الشامل المتوافق كلياً مع متطلبات هيئة الزكاة والضريبة والجمارك وهيئة السياحة.',
    features: [
      'Full ZATCA Phase 2 Fatoora Real-Time Clearance per guest folio',
      'Unified OTA Channel Manager (Booking.com, Almosafer, Agoda, Expedia)',
      'Automated 5% Saudi Tourism & Municipality Tax calculations',
      'Nafath e-ID Identity Check for contactless guest reception',
      'Bilingual Arabic / English Guest Folios & Banquet Invoicing',
      'Assa Abloy / VingCard Smart Room Key Card Integration',
      'Unlimited Front Desk & Housekeeping Staff Logins',
      '24/7 Priority SLA & Dedicated Hospitality Solutions Architect',
    ],
    zatcaPhase2Included: true,
    otaChannelsIncluded: 35,
    popular: true,
  },
  {
    id: 'plan-villas-chalets',
    name: 'Luxury Villas & Chalet Pro',
    nameAr: 'باقة الفلل والشاليهات الفاخرة',
    category: 'Villas',
    badge: 'Smart IoT',
    pricingModel: 'Per Property Flat',
    basePrice: 650,
    currency: 'SAR',
    billingFrequency: 'per villa compound / month',
    keyLimit: '1 - 30 Private Villas',
    description: 'Engineered for luxury private villas, desert resorts in AlUla, and marina chalets in Jeddah and Riyadh.',
    descriptionAr: 'مصمم خصيصاً للفلل الخاصة والمنتجعات الصحراوية مع توليد الأرقام السرية الذكية للأبواب والفوترة اللحظية.',
    features: [
      'ZATCA Compliant Simplified & Standard Tax Invoices with QR Code',
      'Automated Smart Door Lock PIN dispatch via WhatsApp on check-in',
      'Security Deposit Pre-Authorization via Mada & Apple Pay',
      'Housekeeping Inspection Checklists with photo timestamp',
      'Instant Tourist Permit Synchronization with Balady portal',
      'Dynamic seasonal rate management (National Day, Founding Day, Seasons)',
      'Direct Booking Engine widget with 0% booking commission',
    ],
    zatcaPhase2Included: true,
    otaChannelsIncluded: 12,
  },
  {
    id: 'plan-serviced-apartments',
    name: 'Serviced Apartments Scale Tier',
    nameAr: 'باقة الشقق المخدومة والأبراج السكنية',
    category: 'Apartments',
    badge: 'High Volume',
    pricingModel: 'Hybrid Tiered',
    basePrice: 28,
    currency: 'SAR',
    billingFrequency: 'per apartment unit / month',
    keyLimit: '20 - 500 Apartments',
    description: 'Built for aparthotels and executive serviced residences handling short-term tourism stays and monthly corporate leases.',
    descriptionAr: 'منظومة إدارة الشقق المفروشة والمخدومة لإدارة عقود الإيجار الشهرية واليومية مع ربط سداد المباشر.',
    features: [
      'ZATCA Certified B2B & B2C Tax Invoicing Engine',
      'Dual Lease Modes: Short-stay daily folios + Long-term monthly contracts',
      'Direct SADAD Bill generation for monthly resident rentals',
      'Utility Meter Tracking (Water, Electricity sub-billing per apartment)',
      'Automated Housekeeping rotation schedules & linen management',
      'Corporate Account Statements (SOA) with credit term monitoring',
      'Saudi National Address integration for enterprise tenants',
    ],
    zatcaPhase2Included: true,
    otaChannelsIncluded: 20,
  },
  {
    id: 'plan-boutique-heritage',
    name: 'Boutique & Heritage Retreats',
    nameAr: 'باقة الفنادق التراثية والبوتيك',
    category: 'Hotels',
    badge: 'Bespoke Experience',
    pricingModel: 'Per Property Flat',
    basePrice: 2400,
    currency: 'SAR',
    billingFrequency: 'per boutique resort / month',
    keyLimit: 'Up to 45 Boutique Suites',
    description: 'Specialized workflow for boutique heritage hotels in Historic Diriyah, Al-Balad Jeddah, and desert eco-lodges.',
    descriptionAr: 'مخصصة للفنادق التراثية ذات الطابع الخاص مع إدارة تجارب الضيوف الحصرية والرحلات السياحية.',
    features: [
      'ZATCA Phase 2 Cryptographic CSID with Cloud HSM',
      'Curated Experiences & Dining Folio Add-ons',
      'VIP Guest Profile CRM with dietary & cultural preferences',
      'Arabic Calligraphy Custom Invoice & Voucher Templates',
      'Multi-currency support with real-time SAMA exchange rates',
      'Concierge WhatsApp bot for room service and private desert tours',
    ],
    zatcaPhase2Included: true,
    otaChannelsIncluded: 15,
  },
];

// 2. Billing Cycles
export const HOSPITALITY_BILLING_CYCLES: HospitalityBillingCycle[] = [
  {
    id: 'cycle-annual-corp',
    name: 'Annual Enterprise (Advantage 15%)',
    nameAr: 'الاشتراك السنوي المؤسسي (خصم 15%)',
    frequency: 'Annual',
    discountPercent: 15,
    activeProperties: 68,
    totalCycleMRR: 894000,
    description: '12 months billed in advance with 15% discount. Includes free ZATCA CSID setup and hardware key integration.',
    autoZatcaInvoice: true,
    nextBatchDate: '01 Nov 2026',
    paymentMethods: ['SARIE Corporate Wire', 'Letter of Credit', 'Corporate Cheque'],
  },
  {
    id: 'cycle-quarterly',
    name: 'Quarterly Commercial Plan',
    nameAr: 'الاشتراك الربع سنوي',
    frequency: 'Quarterly',
    discountPercent: 5,
    activeProperties: 42,
    totalCycleMRR: 382000,
    description: 'Billed every 90 days. Ideal for growing apartment chains and boutique hotel groups.',
    autoZatcaInvoice: true,
    nextBatchDate: '01 Oct 2026',
    paymentMethods: ['Mada Direct Debit', 'SARIE Wire', 'Corporate Visa'],
  },
  {
    id: 'cycle-monthly-key',
    name: 'Monthly Key Utility Billing',
    nameAr: 'الاشتراك الشهري حسب الغرف النشطة',
    frequency: 'Monthly',
    discountPercent: 0,
    activeProperties: 24,
    totalCycleMRR: 198000,
    description: 'Calculated monthly based on occupied / managed room keys. Flexible without long-term commitment.',
    autoZatcaInvoice: true,
    nextBatchDate: '30 Sep 2026',
    paymentMethods: ['Mada Auto-Pay', 'SADAD Portal', 'Apple Pay'],
  },
  {
    id: 'cycle-seasonal-hajj',
    name: 'Holy Cities Seasonal Peak (Hajj & Umrah)',
    nameAr: 'باقة مواسم الحج والعمرة (مكة والمدينة)',
    frequency: 'Seasonal (Hajj & Umrah)',
    discountPercent: 10,
    activeProperties: 14,
    totalCycleMRR: 246000,
    description: 'Pre-paid 6-month burst capacity license tailored for hotels in Makkah and Madinah during high pilgrimage peaks.',
    autoZatcaInvoice: true,
    nextBatchDate: '15 Dec 2026',
    paymentMethods: ['Bank Wire (SNB / Al Rajhi)', 'SADAD Number'],
  },
];

// 3. Active Hospitality Subscriptions (Mock Data across KSA Hotels, Villas, Apartments)
export const ACTIVE_HOSPITALITY_SUBSCRIPTIONS: ActiveHospitalitySubscription[] = [
  {
    id: 'SUB-HOSP-101',
    code: 'DAR-ALTAQWA-MED',
    propertyName: 'Dar Al-Taqwa Luxury Suites & Hotel',
    propertyNameAr: 'فندق وأجنحة دار التقوى الفاخرة',
    propertyType: 'Hotel',
    classification: '5-Star Resort',
    city: 'Madinah',
    crNumber: '4030198821',
    zatcaTrn: '310492817200003',
    planName: 'Hotel Enterprise OS',
    keysCount: 320,
    billingCycle: 'Annual Enterprise (Advantage 15%)',
    mrr: 13440,
    annualContractValue: 137088,
    startDate: '15 Jan 2024',
    renewalDate: '15 Jan 2027',
    status: 'Active',
    paymentMode: 'SARIE Wire',
    zatcaCsid: {
      status: 'Valid & Cleared',
      csidId: 'ZTC-MED-0994-PRD',
      lastSynced: '10 minutes ago',
    },
    features: {
      channelManager: true,
      iotSmartDoorLocks: true,
      nafathGuestVerification: true,
      saudiTourismTaxReport: true,
      whatsappConcierge: true,
    },
    generalManager: {
      name: 'Sheikh Mansour Al-Harbi',
      email: 'gm@daraltaqwa-hotel.sa',
      phone: '+966 50 442 8899',
    },
  },
  {
    id: 'SUB-HOSP-102',
    code: 'CHEDI-HEGRA-ALULA',
    propertyName: 'The Chedi Hegra Desert Sanctuary',
    propertyNameAr: 'منتجع الشيدي الحجر الصحراوي - العلا',
    propertyType: 'Hotel',
    classification: 'Heritage Retreat',
    city: 'AlUla',
    crNumber: '3550182910',
    zatcaTrn: '310982736100003',
    planName: 'Boutique & Heritage Retreats',
    keysCount: 42,
    billingCycle: 'Annual Enterprise (Advantage 15%)',
    mrr: 2400,
    annualContractValue: 24480,
    startDate: '01 Nov 2023',
    renewalDate: '01 Nov 2026',
    status: 'Pending Renewal',
    paymentMode: 'SARIE Wire',
    zatcaCsid: {
      status: 'Valid & Cleared',
      csidId: 'ZTC-ULA-8812-PRD',
      lastSynced: '35 minutes ago',
    },
    features: {
      channelManager: true,
      iotSmartDoorLocks: true,
      nafathGuestVerification: true,
      saudiTourismTaxReport: true,
      whatsappConcierge: true,
    },
    generalManager: {
      name: 'Farid De Villiers / Saud Al-Ghamdi',
      email: 'gm@chedihegra-alula.sa',
      phone: '+966 54 881 2244',
    },
  },
  {
    id: 'SUB-HOSP-103',
    code: 'NAFAL-VILLAS-RYD',
    propertyName: 'Al-Nafal Luxury Private Villas & Compound',
    propertyNameAr: 'مجمع فلل النفل الفندقية الفاخرة',
    propertyType: 'Villa',
    classification: 'Luxury Private Compound',
    city: 'Riyadh',
    crNumber: '1010884920',
    zatcaTrn: '310188924000003',
    planName: 'Luxury Villas & Chalet Pro',
    keysCount: 24,
    billingCycle: 'Quarterly Commercial Plan',
    mrr: 7800,
    annualContractValue: 88920,
    startDate: '10 Mar 2024',
    renewalDate: '10 Dec 2026',
    status: 'Active',
    paymentMode: 'Mada Direct Debit',
    zatcaCsid: {
      status: 'Valid & Cleared',
      csidId: 'ZTC-RYD-3421-PRD',
      lastSynced: '2 minutes ago',
    },
    features: {
      channelManager: true,
      iotSmartDoorLocks: true,
      nafathGuestVerification: true,
      saudiTourismTaxReport: true,
      whatsappConcierge: true,
    },
    generalManager: {
      name: 'Fahad Al-Hathlool',
      email: 'f.hathlool@nafalvillas.com',
      phone: '+966 55 993 1122',
    },
  },
  {
    id: 'SUB-HOSP-104',
    code: 'KAFD-SKY-APTS',
    propertyName: 'KAFD Sky Tower Executive Serviced Apartments',
    propertyNameAr: 'شقق كافد سكاي تاور الفندقية المخدومة',
    propertyType: 'Apartment',
    classification: 'Serviced Residences',
    city: 'Riyadh',
    crNumber: '1010772641',
    zatcaTrn: '310772641000003',
    planName: 'Serviced Apartments Scale Tier',
    keysCount: 180,
    billingCycle: 'Annual Enterprise (Advantage 15%)',
    mrr: 5040,
    annualContractValue: 51408,
    startDate: '20 Feb 2024',
    renewalDate: '20 Feb 2027',
    status: 'Active',
    paymentMode: 'SADAD',
    zatcaCsid: {
      status: 'Valid & Cleared',
      csidId: 'ZTC-RYD-9901-PRD',
      lastSynced: '1 hour ago',
    },
    features: {
      channelManager: true,
      iotSmartDoorLocks: true,
      nafathGuestVerification: true,
      saudiTourismTaxReport: true,
      whatsappConcierge: false,
    },
    generalManager: {
      name: 'Eng. Rayan Al-Mutawa',
      email: 'operations@kafdapartments.sa',
      phone: '+966 50 119 4488',
    },
  },
  {
    id: 'SUB-HOSP-105',
    code: 'DURRAT-AROUS-JED',
    propertyName: 'Durrat Al-Arous Marina Luxury Chalets',
    propertyNameAr: 'شاليهات وفلل درة العروس البحرية',
    propertyType: 'Villa',
    classification: 'Luxury Private Compound',
    city: 'Jeddah',
    crNumber: '4030661928',
    zatcaTrn: '310661928000003',
    planName: 'Luxury Villas & Chalet Pro',
    keysCount: 36,
    billingCycle: 'Monthly Key Utility Billing',
    mrr: 9750,
    annualContractValue: 117000,
    startDate: '01 Jun 2024',
    renewalDate: '30 Sep 2026',
    status: 'Pending Renewal',
    paymentMode: 'Mada Direct Debit',
    zatcaCsid: {
      status: 'Expiring Soon',
      csidId: 'ZTC-JED-5521-PRD',
      lastSynced: '3 hours ago',
    },
    features: {
      channelManager: true,
      iotSmartDoorLocks: true,
      nafathGuestVerification: true,
      saudiTourismTaxReport: true,
      whatsappConcierge: true,
    },
    generalManager: {
      name: 'Capt. Ziyad Al-Ghamdi',
      email: 'ziyad@durratmarina.sa',
      phone: '+966 56 774 2200',
    },
  },
  {
    id: 'SUB-HOSP-106',
    code: 'CORNICHE-PEARL-KHB',
    propertyName: 'Corniche Pearl Waterfront Aparthotel',
    propertyNameAr: 'فندق وشقق لؤلؤة الكورنيش المفروشة',
    propertyType: 'Apartment',
    classification: 'Aparthotel',
    city: 'Al Khobar',
    crNumber: '2050119842',
    zatcaTrn: '310205011900003',
    planName: 'Serviced Apartments Scale Tier',
    keysCount: 95,
    billingCycle: 'Quarterly Commercial Plan',
    mrr: 2660,
    annualContractValue: 30324,
    startDate: '12 Apr 2024',
    renewalDate: '12 Jan 2027',
    status: 'Active',
    paymentMode: 'Corporate Card',
    zatcaCsid: {
      status: 'Valid & Cleared',
      csidId: 'ZTC-EP-4412-PRD',
      lastSynced: '15 minutes ago',
    },
    features: {
      channelManager: true,
      iotSmartDoorLocks: false,
      nafathGuestVerification: true,
      saudiTourismTaxReport: true,
      whatsappConcierge: false,
    },
    generalManager: {
      name: 'Nawaf Al-Subaie',
      email: 'gm@cornichepearl.sa',
      phone: '+966 53 221 8800',
    },
  },
  {
    id: 'SUB-HOSP-107',
    code: 'REDSEA-CORAL-RESORT',
    propertyName: 'Red Sea Dunes & Coral Boutique Resort',
    propertyNameAr: 'منتجع كثبان البحر الأحمر البوتيكي',
    propertyType: 'Hotel',
    classification: '5-Star Resort',
    city: 'Red Sea',
    crNumber: '4030998124',
    zatcaTrn: '310403099800003',
    planName: 'Hotel Enterprise OS',
    keysCount: 140,
    billingCycle: 'Annual Enterprise (Advantage 15%)',
    mrr: 5880,
    annualContractValue: 59976,
    startDate: '01 Aug 2024',
    renewalDate: '01 Aug 2027',
    status: 'Active',
    paymentMode: 'SARIE Wire',
    zatcaCsid: {
      status: 'Valid & Cleared',
      csidId: 'ZTC-RSG-7711-PRD',
      lastSynced: '5 minutes ago',
    },
    features: {
      channelManager: true,
      iotSmartDoorLocks: true,
      nafathGuestVerification: true,
      saudiTourismTaxReport: true,
      whatsappConcierge: true,
    },
    generalManager: {
      name: 'Tariq Al-Amoudi',
      email: 'hospitality@redsea-coral.sa',
      phone: '+966 50 771 9933',
    },
  },
  {
    id: 'SUB-HOSP-108',
    code: 'TAIF-ROSE-CHALETS',
    propertyName: 'Taif Mountain Rose Heritage Chalets',
    propertyNameAr: 'شاليهات ورد الطائف الجبلية التراثية',
    propertyType: 'Villa',
    classification: 'Heritage Retreat',
    city: 'Taif',
    crNumber: '4032118491',
    zatcaTrn: '310403211800003',
    planName: 'Luxury Villas & Chalet Pro',
    keysCount: 16,
    billingCycle: 'Monthly Key Utility Billing',
    mrr: 3900,
    annualContractValue: 46800,
    startDate: '01 May 2024',
    renewalDate: '30 Oct 2026',
    status: 'Active',
    paymentMode: 'Mada Direct Debit',
    zatcaCsid: {
      status: 'Valid & Cleared',
      csidId: 'ZTC-TAF-1102-PRD',
      lastSynced: '40 minutes ago',
    },
    features: {
      channelManager: true,
      iotSmartDoorLocks: true,
      nafathGuestVerification: true,
      saudiTourismTaxReport: true,
      whatsappConcierge: true,
    },
    generalManager: {
      name: 'Adel Al-Thagafi',
      email: 'info@taifrose-retreat.sa',
      phone: '+966 55 448 3399',
    },
  },
];

// 4. Coupons & Discounts
export const HOSPITALITY_COUPONS: HospitalityCoupon[] = [
  {
    id: 'COUPON-2026-01',
    code: 'VISION2030-TOURISM',
    title: 'Saudi Tourism Growth Incentive',
    titleAr: 'مبادرة دعم السياحة الوطنية رؤية 2030',
    discountType: 'Percentage',
    discountValue: '20% OFF',
    eligibility: 'All Properties',
    redeemedCount: 48,
    maxRedemptions: 100,
    validUntil: '31 Dec 2026',
    status: 'Active',
    campaignNote: 'Partnered with Saudi Tourism Authority for new licensed hospitality operators.',
  },
  {
    id: 'COUPON-2026-02',
    code: 'ALULA-WINTER-PARTNER',
    title: 'AlUla Seasons Luxury Operator Rebate',
    titleAr: 'خصم مشغلي منتجعات شتاء طنطورة والعلا',
    discountType: 'Fixed SAR',
    discountValue: 'SAR 3,500 Credit',
    eligibility: 'Villas & Chalets',
    redeemedCount: 16,
    maxRedemptions: 25,
    validUntil: '28 Feb 2027',
    status: 'Active',
    campaignNote: 'Applicable to smart IoT door lock setup and channel manager package.',
  },
  {
    id: 'COUPON-2026-03',
    code: 'FOUNDING-DAY-FREE-SETUP',
    title: 'Saudi Founding Day Free ZATCA CSID Setup',
    titleAr: 'عرض يوم التأسيس: تهيئة الربط الضريبي مجاناً',
    discountType: 'Free Add-on',
    discountValue: '100% CSID Waiver (Value SAR 2,500)',
    eligibility: 'Hotels',
    redeemedCount: 34,
    maxRedemptions: 50,
    validUntil: '01 Mar 2027',
    status: 'Active',
    campaignNote: 'Free Cloud HSM cryptographic registration and Ministry clearance for 12 months.',
  },
  {
    id: 'COUPON-2026-04',
    code: 'SUMMER-JEDDAH-APTS',
    title: 'Jeddah Waterfront Aparthotel Launch',
    titleAr: 'عرض موسم صيف جدة للشقق المخدومة',
    discountType: 'Percentage',
    discountValue: '15% OFF',
    eligibility: 'Serviced Apartments',
    redeemedCount: 22,
    maxRedemptions: 30,
    validUntil: '30 Sep 2026',
    status: 'Active',
    campaignNote: 'Discount on monthly room key utility rates for 60+ unit serviced apartment buildings.',
  },
];

// 5. Lifecycle History
export const HOSPITALITY_LIFECYCLE_HISTORY: HospitalityLifecycleEvent[] = [
  {
    id: 'LIFE-2026-904',
    timestamp: 'Today, 13:45 AST',
    propertyName: 'Dar Al-Taqwa Luxury Suites & Hotel',
    propertyType: 'Hotel',
    eventType: 'Key Expansion',
    details: 'Expanded managed keys from 280 to 320 rooms following North Wing expansion in Madinah.',
    amountChange: '+SAR 1,680 / mo MRR',
    user: 'Eng. Tariq Mansoor',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'LIFE-2026-903',
    timestamp: 'Yesterday, 17:20 AST',
    propertyName: 'KAFD Sky Tower Executive Serviced Apartments',
    propertyType: 'Apartment',
    eventType: 'ZATCA Compliance Handshake',
    details: 'Production CSID renewed and validated with ZATCA Phase 2 Fatoora clearance gateway.',
    amountChange: 'Zero Fee (Under Care Plan)',
    user: 'System Bot (Automated CSID)',
    badgeColor: 'bg-[#e8eeff] text-[#004a60]',
  },
  {
    id: 'LIFE-2026-902',
    timestamp: '20 Sep 2026',
    propertyName: 'Red Sea Dunes & Coral Boutique Resort',
    propertyType: 'Hotel',
    eventType: 'New Contract',
    details: 'Signed 3-Year Enterprise Agreement for 140 luxury coral villas and overwater suites.',
    amountChange: '+SAR 5,880 / mo MRR (SAR 59,976/yr)',
    user: 'Sarah Al-Ghamdi (Enterprise Sales)',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'LIFE-2026-901',
    timestamp: '18 Sep 2026',
    propertyName: 'Durrat Al-Arous Marina Luxury Chalets',
    propertyType: 'Villa',
    eventType: 'Cycle Switch',
    details: 'Switched from Annual Advance to Monthly Key Utility billing ahead of winter season.',
    amountChange: 'Adjusted to SAR 9,750 / mo',
    user: 'Fahad Al-Shehri (Finance Lead)',
    badgeColor: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'LIFE-2026-900',
    timestamp: '14 Sep 2026',
    propertyName: 'The Chedi Hegra Desert Sanctuary',
    propertyType: 'Hotel',
    eventType: 'Plan Upgrade',
    details: 'Upgraded to Boutique & Heritage Retreat tier with Assa Abloy IoT lock synchronization.',
    amountChange: '+SAR 850 / mo MRR',
    user: 'Eng. Tariq Mansoor',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
];

// 6. Renewal Reminders
export const HOSPITALITY_RENEWAL_REMINDERS: HospitalityRenewalReminder[] = [
  {
    id: 'REM-2026-401',
    propertyName: 'The Chedi Hegra Desert Sanctuary',
    propertyNameAr: 'منتجع الشيدي الحجر الصحراوي - العلا',
    propertyType: 'Hotel',
    keys: 42,
    contractValue: 24480,
    renewalDueDate: '01 Nov 2026',
    daysRemaining: 40,
    stage: '30 Days Before',
    notificationChannel: 'WhatsApp & Email',
    lastDispatched: '21 Sep 2026, 09:00 AST',
    clientResponseStatus: 'Reviewing Quotation',
    gmContact: {
      name: 'Farid De Villiers',
      phone: '+966 54 881 2244',
      email: 'gm@chedihegra-alula.sa',
    },
  },
  {
    id: 'REM-2026-402',
    propertyName: 'Durrat Al-Arous Marina Luxury Chalets',
    propertyNameAr: 'شاليهات وفلل درة العروس البحرية',
    propertyType: 'Villa',
    keys: 36,
    contractValue: 117000,
    renewalDueDate: '30 Sep 2026',
    daysRemaining: 8,
    stage: '7 Days Before',
    notificationChannel: 'SMS & WhatsApp',
    lastDispatched: 'Today, 08:30 AST',
    clientResponseStatus: 'Auto-Pay Scheduled',
    gmContact: {
      name: 'Capt. Ziyad Al-Ghamdi',
      phone: '+966 56 774 2200',
      email: 'ziyad@durratmarina.sa',
    },
  },
  {
    id: 'REM-2026-403',
    propertyName: 'Taif Mountain Rose Heritage Chalets',
    propertyNameAr: 'شاليهات ورد الطائف الجبلية التراثية',
    propertyType: 'Villa',
    keys: 16,
    contractValue: 46800,
    renewalDueDate: '30 Oct 2026',
    daysRemaining: 38,
    stage: '30 Days Before',
    notificationChannel: 'WhatsApp & Email',
    lastDispatched: '20 Sep 2026, 11:15 AST',
    clientResponseStatus: 'Acknowledged',
    gmContact: {
      name: 'Adel Al-Thagafi',
      phone: '+966 55 448 3399',
      email: 'info@taifrose-retreat.sa',
    },
  },
  {
    id: 'REM-2026-404',
    propertyName: 'Al-Nafal Luxury Private Villas & Compound',
    propertyNameAr: 'مجمع فلل النفل الفندقية الفاخرة',
    propertyType: 'Villa',
    keys: 24,
    contractValue: 88920,
    renewalDueDate: '10 Dec 2026',
    daysRemaining: 79,
    stage: '30 Days Before',
    notificationChannel: 'WhatsApp & Email',
    lastDispatched: 'Scheduled for 10 Nov',
    clientResponseStatus: 'Pending Contact',
    gmContact: {
      name: 'Fahad Al-Hathlool',
      phone: '+966 55 993 1122',
      email: 'f.hathlool@nafalvillas.com',
    },
  },
];
