export interface TaskCatalogItem {
  id: string;
  taskName: string;
  taskNameAr?: string;
  type: string;
  typeAr?: string;
  source: string;
  sourceAr?: string;
  role: string;
  roleAr?: string;
  priorityLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  estimatedTime: string;
  timesUsed: number;
  description: string;
  isAutomated: boolean;
  automatedTrigger?: string;
  isRecurring: boolean;
  recurringFrequency?: string;
  recurringStartDateTime?: string;
  recurringEndCondition?: 'never' | 'end_on' | 'after';
  recurringEndValue?: string;
  categoryGroup: 'Recurring' | 'Automated' | 'Inspection' | 'General';
}

export const TASK_TYPES_OPTIONS = [
  { id: 'calling_customer', name: 'Calling a customer', nameAr: 'الاتصال بالعميل والترحيب' },
  { id: 'cloud_bill', name: 'Paying the bill to the cloud', nameAr: 'سداد فاتورة السحابة والمزود' },
  { id: 'inspection', name: 'Property & Facility Inspection', nameAr: 'فحص المنشأة والوحدات الفندقية' },
  { id: 'zatca_audit', name: 'ZATCA Phase 2 Folio Clearance Audit', nameAr: 'تدقيق اعتماد فواتير الزكاة' },
  { id: 'room_key_setup', name: 'Smart Key & Lock PIN Setup', nameAr: 'برمجة المفتاح والرمز السري للغرفة' },
  { id: 'linen_housekeeping', name: 'Housekeeping & Unit Turnover', nameAr: 'تنظيف وتجهيز الوحدات للنزلاء' },
  { id: 'payment_reconciliation', name: 'Monthly Ledger Settlement', nameAr: 'تسوية حسابات النزلاء الشهرية' },
  { id: 'offboarding', name: 'Security & Access Revocation', nameAr: 'إلغاء الصلاحيات وفك الارتباط' },
];

export const AUTOMATED_TRIGGERS_OPTIONS = [
  { id: 'sub_first_time', label: 'after customer subscription first time', labelAr: 'بعد اشتراك العميل لأول مرة' },
  { id: 'sub_cancelled', label: 'after the customer cancels the subscription', labelAr: 'بعد إلغاء العميل للاشتراك' },
  { id: 'sub_renewed', label: 'after the customer renews the subscription', labelAr: 'بعد تجديد العميل للاشتراك' },
  { id: 'zatca_failed', label: 'on ZATCA clearance error or warning', labelAr: 'عند تعثر أو تحذير اعتماد الفاتورة لدى الزكاة' },
  { id: 'overdue_invoice', label: 'on overdue invoice (> 15 days)', labelAr: 'عند تأخر سداد الفاتورة لأكثر من 15 يوماً' },
];

export const ROLE_OPTIONS = [
  { id: 'front_desk', name: 'Front Desk', nameAr: 'الاستقبال وخدمة العملاء' },
  { id: 'accountant', name: 'Accountant / Finance', nameAr: 'المحاسبة والمالية' },
  { id: 'maintenance_engineer', name: 'Maintenance Engineer', nameAr: 'مهندس الصيانة والتشغيل' },
  { id: 'operations_lead', name: 'Operations Lead', nameAr: 'مشرف العمليات الفندقية' },
  { id: 'general_manager', name: 'General Manager', nameAr: 'المدير العام' },
  { id: 'cloud_admin', name: 'IT / Cloud Admin', nameAr: 'مسؤول السحابة وتقنية المعلومات' },
  { id: 'housekeeping', name: 'Housekeeping Supervisor', nameAr: 'مشرف خدمات الغرف والنظافة' },
];

export const INITIAL_TASK_CATALOG: TaskCatalogItem[] = [
  {
    id: 'CAT-101',
    taskName: 'Welcome Call & Onboarding Setup',
    taskNameAr: 'اتصال ترحيبي وتهيئة العميل الفندقي الجديد',
    type: 'Calling a customer',
    typeAr: 'الاتصال بالعميل والترحيب',
    source: 'Automated (after subscription first time)',
    sourceAr: 'آلي (بعد اشتراك العميل لأول مرة)',
    role: 'Front Desk',
    roleAr: 'الاستقبال وخدمة العملاء',
    priorityLevel: 'High',
    estimatedTime: '20 mins',
    timesUsed: 42,
    description: 'Call the hotel GM upon onboarding to verify PMS connection, provide ZATCA Phase 2 guidance, and verify access.',
    isAutomated: true,
    automatedTrigger: 'after customer subscription first time',
    isRecurring: false,
    categoryGroup: 'Automated',
  },
  {
    id: 'CAT-102',
    taskName: 'Monthly Cloud Infrastructure & ZATCA Host Bill',
    taskNameAr: 'سداد فاتورة البنية التحتية السحابية والزكاة',
    type: 'Paying the bill to the cloud',
    typeAr: 'سداد فاتورة السحابة والمزود',
    source: 'Recurring (Monthly)',
    sourceAr: 'دوري (شهرياً)',
    role: 'Accountant / Finance',
    roleAr: 'المحاسبة والمالية',
    priorityLevel: 'Critical',
    estimatedTime: '45 mins',
    timesUsed: 14,
    description: 'Verify server consumption, process cloud hosting payment receipt, and archive ZATCA cryptographic gateway invoice.',
    isAutomated: false,
    isRecurring: true,
    recurringFrequency: 'Monthly',
    recurringStartDateTime: '2026-10-01T09:00',
    recurringEndCondition: 'never',
    categoryGroup: 'Recurring',
  },
  {
    id: 'CAT-103',
    taskName: 'Bi-weekly Smart Lock PIN & Hardware Inspection',
    taskNameAr: 'فحص دوري للأقفال الذكية ورموز الدخول السحابية',
    type: 'Property & Facility Inspection',
    typeAr: 'فحص المنشأة والوحدات الفندقية',
    source: 'Recurring (Bi-weekly)',
    sourceAr: 'دوري (كل أسبوعين)',
    role: 'Maintenance Engineer',
    roleAr: 'مهندس الصيانة والتشغيل',
    priorityLevel: 'Medium',
    estimatedTime: '1 hour',
    timesUsed: 26,
    description: 'Perform physical and telemetry inspection of smart locks, gateway battery voltage, and room RFID card readers.',
    isAutomated: false,
    isRecurring: true,
    recurringFrequency: 'Bi-weekly',
    recurringStartDateTime: '2026-09-30T10:00',
    recurringEndCondition: 'never',
    categoryGroup: 'Inspection',
  },
  {
    id: 'CAT-104',
    taskName: 'Subscription Renewal Confirmation & Review',
    taskNameAr: 'متابعة تجديد الاشتراك الفندقي السنوي',
    type: 'Calling a customer',
    typeAr: 'الاتصال بالعميل والترحيب',
    source: 'Automated (after subscription renewal)',
    sourceAr: 'آلي (بعد تجديد العميل للاشتراك)',
    role: 'Operations Lead',
    roleAr: 'مشرف العمليات الفندقية',
    priorityLevel: 'Medium',
    estimatedTime: '15 mins',
    timesUsed: 19,
    description: 'Reach out to property manager upon subscription renewal, review property room capacity, and provide updated SLA contract.',
    isAutomated: true,
    automatedTrigger: 'after the customer renews the subscription',
    isRecurring: false,
    categoryGroup: 'Automated',
  },
  {
    id: 'CAT-105',
    taskName: 'Offboarding & Revocation Protocol on Cancellation',
    taskNameAr: 'إجراءات إنهاء الاشتراك وحجب الصلاحيات',
    type: 'Security & Access Revocation',
    typeAr: 'إلغاء الصلاحيات وفك الارتباط',
    source: 'Automated (after subscription cancellation)',
    sourceAr: 'آلي (بعد إلغاء العميل للاشتراك)',
    role: 'IT / Cloud Admin',
    roleAr: 'مسؤول السحابة وتقنية المعلومات',
    priorityLevel: 'High',
    estimatedTime: '30 mins',
    timesUsed: 8,
    description: 'Revoke cloud API tokens, archive tenant transaction records for ZATCA 6-year retention compliance, and close active folio sessions.',
    isAutomated: true,
    automatedTrigger: 'after the customer cancels the subscription',
    isRecurring: false,
    categoryGroup: 'Automated',
  },
  {
    id: 'CAT-106',
    taskName: 'Quarterly Tourism & Civil Defense Safety Inspection',
    taskNameAr: 'فحص السلامة والتراخيص السياحية والدفاع المدني',
    type: 'Property & Facility Inspection',
    typeAr: 'فحص المنشأة والوحدات الفندقية',
    source: 'Recurring (Quarterly)',
    sourceAr: 'دوري (ربع سنوي)',
    role: 'General Manager',
    roleAr: 'المدير العام',
    priorityLevel: 'Critical',
    estimatedTime: '2 hours',
    timesUsed: 11,
    description: 'Conduct exhaustive hotel safety inspection, fire alarm test, civil defense certification check, and emergency exits readiness.',
    isAutomated: false,
    isRecurring: true,
    recurringFrequency: 'Quarterly',
    recurringStartDateTime: '2026-10-15T08:00',
    recurringEndCondition: 'never',
    categoryGroup: 'Inspection',
  },
];

const STORAGE_KEY = 'khetat_task_catalog_items_v1';

export const getStoredTaskCatalog = (): TaskCatalogItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_TASK_CATALOG;
};

export const saveStoredTaskCatalog = (items: TaskCatalogItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // fallback
  }
};
