export type CrmUserType = 'operator' | 'guest' | 'corporate' | 'property_owner';
export type CrmUserStatus = 'active' | 'potential'; // مستخدم نشط أو مستخدم محتمل
export type CrmLeadStage = 'new_lead' | 'contacted' | 'under_review' | 'proposal_sent' | 'negotiation' | 'active_client';
export type CrmSyncStatus = 'synced' | 'pending_sync_to_user' | 'user_submitted_review' | 'draft';

export interface MudabbirUserSubmittedData {
  submittedAt: string;
  sourceChannel: 'Mudabbir Web Portal' | 'Mudabbir Mobile App' | 'Chalet Manager Sync' | 'Self-Registration Form';
  companyName: string;
  companyNameAr?: string;
  fullName: string;
  fullNameAr?: string;
  phone: string;
  email: string;
  crNumber?: string;
  taxNumber?: string;
  city: string;
  cityAr?: string;
  district?: string;
  propertyCount: number;
  keysCount: number;
  propertyType: 'Hotels' | 'Villas & Chalets' | 'Serviced Apartments' | 'Resorts & Heritage';
  propertyTypeAr: string;
  requestedPlan: string;
  userNotes?: string;
}

export interface AdminModifiedData {
  lastModifiedAt?: string;
  modifiedBy?: string;
  approvedPlan?: string;
  approvedTier?: 'Standard Operator' | 'Silver Partner' | 'Gold Enterprise' | 'VIP Platinum';
  approvedTierAr?: string;
  customDiscountPercent?: number;
  assignedAccountManager?: string;
  assignedManagerPhone?: string;
  creditLimitSar?: number;
  slaLevel?: string;
  verificationStatus?: 'Verified Nafath' | 'Pending Documents' | 'Audit Passed' | 'Requires Clarification';
  verificationStatusAr?: string;
  adminInternalNotes?: string;
  adminCustomTerms?: string;
  syncDeliveredAt?: string;
  deliveryMethod?: 'Mudabbir Portal Sync' | 'WhatsApp Notification' | 'Email Folio Dispatch';
}

export interface CrmUserProfile {
  id: string;
  code: string; // e.g. CRM-2026-001
  userType: CrmUserType;
  userTypeAr: string;
  status: CrmUserStatus; // 'active' | 'potential'
  leadStage?: CrmLeadStage;
  leadStageAr?: string;
  potentialDealValueSar?: number; // قيمة العقد المتوقعة
  interestLevel?: 'High' | 'Medium' | 'Low';
  
  // Current effective fields
  name: string;
  nameAr: string;
  companyName: string;
  companyNameAr: string;
  phone: string;
  email: string;
  city: string;
  cityAr: string;
  district: string;
  
  // Dual Data: User Input from Mudabbir vs Admin Modifications & Delivery
  mudabbirData: MudabbirUserSubmittedData;
  adminData: AdminModifiedData;
  syncStatus: CrmSyncStatus;
  syncStatusAr: string;
  lastSyncTimestamp?: string;
  
  // Metrics
  propertiesCount: number;
  keysCount: number;
  createdAt: string;
  updatedAt: string;
  avatarColor: string;
}

export const INITIAL_CRM_PROFILES: CrmUserProfile[] = [
  {
    id: 'crm-usr-101',
    code: 'CRM-2026-001',
    userType: 'operator',
    userTypeAr: 'مشغل منشأة فندقية',
    status: 'active',
    leadStage: 'active_client',
    leadStageAr: 'عميل نشط ومعتمد',
    potentialDealValueSar: 180000,
    interestLevel: 'High',
    name: 'Sultan Fahad Al-Otaibi',
    nameAr: 'أ. سلطان فهد العتيبي',
    companyName: 'Al-Otaibi Hospitality & Chalets Group',
    companyNameAr: 'مجموعة العتيبي للضيافة والشاليهات الفندقية',
    phone: '+966 50 119 4432',
    email: 'sultan@otaibihospitality.sa',
    city: 'Riyadh',
    cityAr: 'الرياض',
    district: 'Al-Rimal Tourism Zone',
    mudabbirData: {
      submittedAt: '2026-08-10 14:22',
      sourceChannel: 'Mudabbir Web Portal',
      companyName: 'Al-Otaibi Chalets',
      companyNameAr: 'شاليهات العتيبي',
      fullName: 'Sultan Al-Otaibi',
      fullNameAr: 'سلطان العتيبي',
      phone: '+966 50 119 4432',
      email: 'sultan.otaibi@gmail.com',
      crNumber: '1010884912',
      taxNumber: '310188491200003',
      city: 'Riyadh',
      cityAr: 'الرياض',
      district: 'Al-Rimal',
      propertyCount: 8,
      keysCount: 32,
      propertyType: 'Villas & Chalets',
      propertyTypeAr: 'فلل وشاليهات',
      requestedPlan: 'Luxury Villas & Chalet Pro',
      userNotes: 'نحتاج ربط بوابات الأقفال الذكية الذاتية وتصدير فواتير زاتكا المبسطة للضيوف.',
    },
    adminData: {
      lastModifiedAt: '2026-09-20 11:30',
      modifiedBy: 'Sheikh Mansour Al-Harbi (Managing Director)',
      approvedPlan: 'Luxury Villas & Chalet Pro - Enterprise Scale',
      approvedTier: 'Gold Enterprise',
      approvedTierAr: 'شريك ذهبي معتمد',
      customDiscountPercent: 12,
      assignedAccountManager: 'Eng. Tariq Mansoor',
      assignedManagerPhone: '+966 55 993 1122',
      creditLimitSar: 75000,
      slaLevel: '24/7 Priority Hospitality SLA',
      verificationStatus: 'Verified Nafath',
      verificationStatusAr: 'موثق عبر نفاذ والسجل التجاري',
      adminInternalNotes: 'تم فحص ومطابقة السجل التجاري واعتماد تسعيرة مخصصة بخصم 12% للدفع السنوي، وتفعيل بوابات الدخول الذكي.',
      adminCustomTerms: 'دفع سنوي مع إعفاء رسوم الربط لأول 32 قفل ذكي.',
      syncDeliveredAt: '2026-09-20 11:35',
      deliveryMethod: 'Mudabbir Portal Sync',
    },
    syncStatus: 'synced',
    syncStatusAr: 'تمت المزامنة للمستخدم بنجاح',
    lastSyncTimestamp: '2026-09-20 11:35',
    propertiesCount: 8,
    keysCount: 32,
    createdAt: '2026-08-10',
    updatedAt: '2026-09-20',
    avatarColor: 'bg-emerald-600',
  },
  {
    id: 'crm-usr-102',
    code: 'CRM-2026-002',
    userType: 'operator',
    userTypeAr: 'مشغل منشأة فندقية',
    status: 'potential',
    leadStage: 'proposal_sent',
    leadStageAr: 'تم إرسال العرض المالي والتقني',
    potentialDealValueSar: 340000,
    interestLevel: 'High',
    name: 'Eng. Khalid Abdulaziz Al-Ghamdi',
    nameAr: 'م. خالد عبدالعزيز الغامدي',
    companyName: 'Red Sea Pearl Boutique Resorts',
    companyNameAr: 'منتجعات لؤلؤة البحر الأحمر الفندقية',
    phone: '+966 55 882 1190',
    email: 'k.ghamdi@redseapearl.com',
    city: 'Jeddah',
    cityAr: 'جدة',
    district: 'North Obhur Waterfront',
    mudabbirData: {
      submittedAt: '2026-09-25 18:40',
      sourceChannel: 'Mudabbir Web Portal',
      companyName: 'Red Sea Pearl Resorts',
      companyNameAr: 'لؤلؤة البحر الأحمر',
      fullName: 'Khalid Al-Ghamdi',
      fullNameAr: 'خالد الغامدي',
      phone: '+966 55 882 1190',
      email: 'k.ghamdi@redseapearl.com',
      crNumber: '4030771290',
      city: 'Jeddah',
      cityAr: 'جدة',
      propertyCount: 3,
      keysCount: 85,
      propertyType: 'Resorts & Heritage',
      propertyTypeAr: 'منتجعات وفنادق شاطئية',
      requestedPlan: 'Hotel Enterprise OS',
      userNotes: 'مشروع جديد قيد الافتتاح، نرغب بتدريب 25 موظف على النظام واستلام عروض الأسعار الرسمية.',
    },
    adminData: {
      lastModifiedAt: '2026-09-28 09:15',
      modifiedBy: 'Layla Al-Otaibi (CFO & Pricing Lead)',
      approvedPlan: 'Hotel Enterprise OS + Full Channel Manager',
      approvedTier: 'Silver Partner',
      approvedTierAr: 'شريك فضي قيد التعاقد',
      customDiscountPercent: 15,
      assignedAccountManager: 'Reem Al-Zahrani',
      assignedManagerPhone: '+966 56 441 2099',
      creditLimitSar: 120000,
      slaLevel: 'Dedicated Solutions Architect',
      verificationStatus: 'Audit Passed',
      verificationStatusAr: 'تم التدقيق المالي ومطابقة التراخيص',
      adminInternalNotes: 'العميل واعد جداً ولديه توسعة قادمة بعد 6 أشهر. أضفنا خصم 15% مع دعم تدريب الكوادر الميداني مجاناً.',
      adminCustomTerms: 'فترة تجريبية 14 يوماً مدمجة مع نظام إدارة القنوات OTA.',
      syncDeliveredAt: '2026-09-28 09:20',
      deliveryMethod: 'WhatsApp Notification',
    },
    syncStatus: 'pending_sync_to_user',
    syncStatusAr: 'تعديلات بانتظار الإرسال للمستخدم',
    lastSyncTimestamp: '2026-09-26 10:00',
    propertiesCount: 3,
    keysCount: 85,
    createdAt: '2026-09-25',
    updatedAt: '2026-09-28',
    avatarColor: 'bg-amber-600',
  },
  {
    id: 'crm-usr-103',
    code: 'CRM-2026-003',
    userType: 'property_owner',
    userTypeAr: 'مالك ومستثمر عقارات',
    status: 'potential',
    leadStage: 'new_lead',
    leadStageAr: 'مستخدم محتمل جديد (بانتظار المراجعة)',
    potentialDealValueSar: 95000,
    interestLevel: 'Medium',
    name: 'Nouf Bint Saud Al-Sudairi',
    nameAr: 'أ. نوف بنت سعود السديري',
    companyName: 'Al-Sudairi Luxury Residences',
    companyNameAr: 'مساكن السديري الفاخرة المخدومة',
    phone: '+966 54 332 9988',
    email: 'nouf.sudairi@luxuryresidences.sa',
    city: 'Riyadh',
    cityAr: 'الرياض',
    district: 'Al-Hada Diplomatic Quarter',
    mudabbirData: {
      submittedAt: '2026-10-01 08:15',
      sourceChannel: 'Mudabbir Mobile App',
      companyName: 'Al-Sudairi Residences',
      companyNameAr: 'مساكن السديري',
      fullName: 'Nouf Al-Sudairi',
      fullNameAr: 'نوف السديري',
      phone: '+966 54 332 9988',
      email: 'nouf.sudairi@luxuryresidences.sa',
      city: 'Riyadh',
      cityAr: 'الرياض',
      district: 'Al-Hada',
      propertyCount: 2,
      keysCount: 24,
      propertyType: 'Serviced Apartments',
      propertyTypeAr: 'شقق فندقية مخدومة',
      requestedPlan: 'Serviced Apartments Scale Tier',
      userNotes: 'سجلت عبر التطبيق وأرغب في معرفة شروط التعاقد وتكامل منصة سداد وفواتير زاتكا.',
    },
    adminData: {
      lastModifiedAt: undefined,
      modifiedBy: undefined,
      verificationStatus: 'Pending Documents',
      verificationStatusAr: 'بانتظار استكمال الوثائق والسجل التجاري',
      adminInternalNotes: 'طلب تسجيل ذاتي وارد للتو من تطبيق مدبّر. يحتاج تواصل هاتفي لتأكيد عدد الوحدات والتراخيص.',
    },
    syncStatus: 'user_submitted_review',
    syncStatusAr: 'بيانات واردة من مدبّر تتطلب المراجعة',
    propertiesCount: 2,
    keysCount: 24,
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01',
    avatarColor: 'bg-purple-600',
  },
  {
    id: 'crm-usr-104',
    code: 'CRM-2026-004',
    userType: 'corporate',
    userTypeAr: 'شركة سياحة وسفر متعاقدة',
    status: 'active',
    leadStage: 'active_client',
    leadStageAr: 'عميل نشط ومعتمد',
    potentialDealValueSar: 520000,
    interestLevel: 'High',
    name: 'Dr. Faisal Al-Shehri',
    nameAr: 'د. فيصل الشهري',
    companyName: 'Bawabat Al-Haramain Pilgrimage Services',
    companyNameAr: 'شركة بوابات الحرمين لخدمات الحج والعمرة',
    phone: '+966 12 559 3300',
    email: 'corporate@bawabatharamain.sa',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    district: 'Ajyad Towers Zone',
    mudabbirData: {
      submittedAt: '2026-06-14 10:00',
      sourceChannel: 'Mudabbir Web Portal',
      companyName: 'Bawabat Al-Haramain',
      companyNameAr: 'بوابات الحرمين',
      fullName: 'Faisal Al-Shehri',
      fullNameAr: 'فيصل الشهري',
      phone: '+966 12 559 3300',
      email: 'corporate@bawabatharamain.sa',
      crNumber: '4031098231',
      taxNumber: '310403109800003',
      city: 'Makkah',
      cityAr: 'مكة المكرمة',
      propertyCount: 5,
      keysCount: 650,
      propertyType: 'Hotels',
      propertyTypeAr: 'أبراج وفنادق المشاعر',
      requestedPlan: 'Hotel Enterprise OS',
      userNotes: 'حساب مؤسسي لإدارة حجوزات وفود العمرة وربط الفوترة المركزية وسداد مع الفنادق.',
    },
    adminData: {
      lastModifiedAt: '2026-09-15 16:45',
      modifiedBy: 'Sheikh Mansour Al-Harbi (CEO)',
      approvedPlan: 'Hotel Enterprise OS - Seasonal High Capacity',
      approvedTier: 'VIP Platinum',
      approvedTierAr: 'شريك بلاتيني استراتيجي',
      customDiscountPercent: 20,
      assignedAccountManager: 'Dr. Bandar Al-Husseini',
      assignedManagerPhone: '+966 50 662 3311',
      creditLimitSar: 500000,
      slaLevel: 'Guaranteed 99.99% Seasonal SLA',
      verificationStatus: 'Verified Nafath',
      verificationStatusAr: 'معتمد رسمياً بترخيص وزارة الحج والعمرة',
      adminInternalNotes: 'عقد استراتيجي لكامل موسم 1448 هـ. تم رفع حد الائتمان ومزامنة صلاحيات المستخدم وإرسال مفاتيح الربط السحابية.',
      adminCustomTerms: 'تسوية شهرية بعد تفويج الحجاج، دعم فني ميداني 24/7.',
      syncDeliveredAt: '2026-09-15 16:50',
      deliveryMethod: 'Mudabbir Portal Sync',
    },
    syncStatus: 'synced',
    syncStatusAr: 'تمت المزامنة للمستخدم بنجاح',
    lastSyncTimestamp: '2026-09-15 16:50',
    propertiesCount: 5,
    keysCount: 650,
    createdAt: '2026-06-14',
    updatedAt: '2026-09-15',
    avatarColor: 'bg-blue-600',
  },
  {
    id: 'crm-usr-105',
    code: 'CRM-2026-005',
    userType: 'operator',
    userTypeAr: 'مشغل منشأة فندقية',
    status: 'potential',
    leadStage: 'under_review',
    leadStageAr: 'قيد مراجعة وتعديل البيانات من الإدارة',
    potentialDealValueSar: 125000,
    interestLevel: 'Medium',
    name: 'Majed Mansoor Al-Zamil',
    nameAr: 'أ. ماجد منصور الزامل',
    companyName: 'Al-Zamil Oasis Chalets & Farm Stays',
    companyNameAr: 'مجموعة واحات الزامل للشاليهات والنُزل الريفية',
    phone: '+966 50 776 5511',
    email: 'm.zamil@zamil-chalets.sa',
    city: 'AlUla',
    cityAr: 'العلا',
    district: 'Wadi Al-Qura Agricultural Sector',
    mudabbirData: {
      submittedAt: '2026-09-29 12:10',
      sourceChannel: 'Mudabbir Web Portal',
      companyName: 'Al-Zamil Chalets',
      companyNameAr: 'شاليهات الزامل',
      fullName: 'Majed Al-Zamil',
      fullNameAr: 'ماجد الزامل',
      phone: '+966 50 776 5511',
      email: 'm.zamil@zamil-chalets.sa',
      city: 'AlUla',
      cityAr: 'العلا',
      propertyCount: 4,
      keysCount: 16,
      propertyType: 'Villas & Chalets',
      propertyTypeAr: 'شاليهات ومزارع نُزل ريفية',
      requestedPlan: 'Luxury Villas & Chalet Pro',
      userNotes: 'نمتلك مزارع سياحية في العلا ونريد توفير حجز فوري ومزامنة الأسعار مع بوكينج ومسافر.',
    },
    adminData: {
      lastModifiedAt: '2026-10-01 15:00',
      modifiedBy: 'Nouf Al-Sudairi (AlUla Operations Manager)',
      approvedPlan: 'Luxury Villas & Chalet Pro + Balady Sync',
      approvedTier: 'Standard Operator',
      approvedTierAr: 'مشغل معتمد',
      customDiscountPercent: 10,
      assignedAccountManager: 'Nouf Al-Sudairi',
      assignedManagerPhone: '+966 50 771 9922',
      creditLimitSar: 30000,
      slaLevel: 'Standard Support 8x5',
      verificationStatus: 'Audit Passed',
      verificationStatusAr: 'تم التحقق من تراخيص وزارة السياحة للأنشطة الريفية',
      adminInternalNotes: 'تم استكمال الفحص الميداني، وجاري إعداد البيانات المعدلة لإرسالها للعميل ومطالبته بتوقيع العقد الرقمي.',
      adminCustomTerms: 'تفعيل الربط مع منصة بلدي وشهادة الزكاة.',
    },
    syncStatus: 'pending_sync_to_user',
    syncStatusAr: 'تعديلات بانتظار الإرسال للمستخدم',
    lastSyncTimestamp: undefined,
    propertiesCount: 4,
    keysCount: 16,
    createdAt: '2026-09-29',
    updatedAt: '2026-10-01',
    avatarColor: 'bg-teal-600',
  },
  {
    id: 'crm-usr-106',
    code: 'CRM-2026-006',
    userType: 'guest',
    userTypeAr: 'نزيل / عميل فردي VIP',
    status: 'potential',
    leadStage: 'new_lead',
    leadStageAr: 'مستخدم محتمل جديد',
    potentialDealValueSar: 45000,
    interestLevel: 'High',
    name: 'Sarah Khalid Al-Dossary',
    nameAr: 'أ. سارة خالد الدوسري',
    companyName: 'Private Tourism Client',
    companyNameAr: 'عميلة باقات ضيافة سنوية خاصة',
    phone: '+966 55 412 8820',
    email: 's.dossary@gmail.com',
    city: 'Al Khobar',
    cityAr: 'الخبر',
    district: 'Corniche Area',
    mudabbirData: {
      submittedAt: '2026-10-02 04:30',
      sourceChannel: 'Mudabbir Mobile App',
      companyName: 'Sarah Al-Dossary',
      companyNameAr: 'سارة الدوسري',
      fullName: 'Sarah Al-Dossary',
      fullNameAr: 'سارة الدوسري',
      phone: '+966 55 412 8820',
      email: 's.dossary@gmail.com',
      city: 'Al Khobar',
      cityAr: 'الخبر',
      propertyCount: 0,
      keysCount: 0,
      propertyType: 'Hotels',
      propertyTypeAr: 'حجوزات إقامة عائلية فاخرة',
      requestedPlan: 'VIP Concierge Pass',
      userNotes: 'سجلت للاستفادة من باقات الإقامة السنوية والشاليهات البحرية للعائلة.',
    },
    adminData: {
      lastModifiedAt: undefined,
      modifiedBy: undefined,
      verificationStatus: 'Pending Documents',
      verificationStatusAr: 'قيد المتابعة وتحديد الاحتياج',
      adminInternalNotes: 'عميلة VIP ترغب باشتراك سنوي في مجمعات درة العروس وشاليهات الشرقية.',
    },
    syncStatus: 'user_submitted_review',
    syncStatusAr: 'بيانات واردة من مدبّر تتطلب المراجعة',
    propertiesCount: 0,
    keysCount: 0,
    createdAt: '2026-10-02',
    updatedAt: '2026-10-02',
    avatarColor: 'bg-rose-600',
  },
];
