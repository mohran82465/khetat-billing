export interface SalesOrder {
  id: string;
  poNumber: string;
  customer: string;
  customerAr: string;
  industry: string;
  tier: string;
  quotationRef: string;
  orderDate: string;
  provisionSlaDate: string;
  totalAmountNet: number;
  vatAmount: number;
  totalWithVat: number;
  fulfillmentPercent: number;
  fulfillmentStatus: 'Fulfilled' | 'In Progress' | 'Pending Approval';
  invoicingStatus: 'Fully Invoiced' | 'Partially Invoiced' | 'Uninvoiced';
  slaLevel: string;
  paymentTerms: string;
  cloudTenant: {
    domain: string;
    cluster: string;
    allocatedSeats: number;
    totalSeats: number;
    status: 'Active' | 'Provisioning';
  };
  milestones: {
    title: string;
    subtitle: string;
    status: 'completed' | 'current' | 'pending';
    stepNumber: number;
  }[];
  poDocument: string;
}

export interface Invoice {
  id: string;
  codeType: string;
  type: 'Tax Invoice' | 'Simplified';
  typeAr: string;
  buyerName: string;
  buyerNameAr: string;
  buyerTrn: string;
  buyerAddress: string;
  issueDate: string;
  dueDate: string;
  taxableAmount: number;
  vatAmount: number;
  totalAmount: number;
  zatcaStatus: 'Cleared' | 'Reported' | 'Pending' | 'Warning';
  zatcaHash: string;
  zatcaUuid: string;
  settlementStatus: 'Paid' | 'Unpaid' | 'Overdue' | 'Partially Paid';
  settlementMethod?: string;
  overdueDays?: number;
  partialBalance?: number;
  lineItems: {
    description: string;
    descriptionAr: string;
    subtitle: string;
    qty: number;
    unitPrice: number;
    subtotal: number;
  }[];
}

export interface Quotation {
  id: string;
  version: string;
  category: string;
  customer: string;
  customerInitials: string;
  crNumber: string;
  trnNumber: string;
  dateIssued: string;
  validUntil: string;
  expiresInHours?: number;
  isExpiringSoon?: boolean;
  totalNet: number;
  discount: number;
  vatAmount: number;
  grandTotal: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Expired';
  statusLabel: string;
  convertedSo?: string;
  creator: string;
  contactName: string;
  contactEmail: string;
  items: {
    title: string;
    scope: string;
    price: number;
  }[];
  zatcaReady: boolean;
  eSignStatus: string;
}

export interface Customer {
  id: string;
  name: string;
  nameAr: string;
  initials: string;
  city: string;
  country: string;
  crNumber: string;
  trn: string;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
  };
  tier: 'Enterprise' | 'Corporate' | 'Commercial';
  outstandingBalance: number;
  creditLimit: number;
  nationalAddress: {
    building: string;
    street: string;
    district: string;
    city: string;
    postalCode: string;
    shortAddress: string;
  };
  activeSubscriptions: {
    title: string;
    pricePerMonth: number;
    billingCycle: string;
    status: 'Active' | 'Pending';
  }[];
}

export interface AccountLedger {
  id: string;
  name: string;
  initials: string;
  crn: string;
  trn: string;
  riskTier: 'high' | 'moderate' | 'low';
  invoicedYtd: number;
  collectedYtd: number;
  current0to30: number;
  aging31to60: number;
  aging61to90: number;
  overdue90plus: number;
  totalOutstanding: number;
  creditLimit: number;
  creditUtilPercent: number;
}

export interface ReceiptVoucher {
  id: string;
  date: string;
  time: string;
  customer: string;
  customerAr: string;
  vatNumber: string;
  method: string;
  methodCategory: 'mada' | 'card' | 'sarie' | 'cheque' | 'sadad';
  referenceNumber: string;
  amount: number;
  wordsEn: string;
  wordsAr: string;
  allocatedInvoice: string;
  allocatedAmount: number;
  status: 'Reconciled' | 'Pending Match' | 'Cleared';
}

export interface TaskItem {
  id: string;
  title: string;
  client: string;
  category: 'ZATCA Phase 2' | 'Client Onboarding' | 'Billing Sprint' | 'Audit';
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'Critical' | 'High' | 'Medium';
  assignee: {
    name: string;
    avatarInitials: string;
  };
  dueDate: string;
  slaTag: string;
}

export const INITIAL_SALES_ORDERS: SalesOrder[] = [
  {
    id: 'SO-2024-1042',
    poNumber: 'ARAMCO-OCT-44-REV2',
    customer: 'Al-Fanar Petrochemicals Ltd',
    customerAr: 'شركة الفنار للبتروكيماويات',
    industry: 'Oil & Gas',
    tier: 'Tier-1 Enterprise',
    quotationRef: 'QT-2024-0812',
    orderDate: '18 Oct 2024',
    provisionSlaDate: '28 Oct 2024',
    totalAmountNet: 468500,
    vatAmount: 70275,
    totalWithVat: 538775,
    fulfillmentPercent: 80,
    fulfillmentStatus: 'In Progress',
    invoicingStatus: 'Partially Invoiced',
    slaLevel: 'Mission-Critical 99.95%',
    paymentTerms: 'Net 30 Days (Letter of Credit)',
    cloudTenant: {
      domain: 'ksa-east.khetatcloud.com',
      cluster: 'Dedicated Tenant Cluster (AWS Bahrain)',
      allocatedSeats: 350,
      totalSeats: 400,
      status: 'Active',
    },
    milestones: [
      {
        title: 'Billing Master & COA Mapping',
        subtitle: 'Completed on 19 Oct 2024 by Eng. Tariq',
        status: 'completed',
        stepNumber: 1,
      },
      {
        title: 'ZATCA Cryptographic Stamp Config',
        subtitle: 'In Progress - Phase II E-invoicing keys handshake',
        status: 'current',
        stepNumber: 2,
      },
      {
        title: 'Final Sign-Off & Production Billing',
        subtitle: 'Target Date: 28 Oct 2024',
        status: 'pending',
        stepNumber: 3,
      },
    ],
    poDocument: 'Customer_PO_ARAMCO_44.pdf',
  },
  {
    id: 'SO-2024-1041',
    poNumber: 'STC-EXP-901',
    customer: 'Riyadh Cloud Technologies',
    customerAr: 'تقنيات سحاب الرياض',
    industry: 'Telecom & IT',
    tier: 'Corporate',
    quotationRef: 'QT-2024-0799',
    orderDate: '17 Oct 2024',
    provisionSlaDate: '22 Oct 2024',
    totalAmountNet: 192400,
    vatAmount: 28860,
    totalWithVat: 221260,
    fulfillmentPercent: 100,
    fulfillmentStatus: 'Fulfilled',
    invoicingStatus: 'Fully Invoiced',
    slaLevel: 'High Availability 99.9%',
    paymentTerms: 'Net 15 Days',
    cloudTenant: {
      domain: 'stc-hub.khetatcloud.com',
      cluster: 'Riyadh Zone 1 Cluster',
      allocatedSeats: 180,
      totalSeats: 200,
      status: 'Active',
    },
    milestones: [
      {
        title: 'Network Gateway Setup',
        subtitle: 'Completed 18 Oct 2024',
        status: 'completed',
        stepNumber: 1,
      },
      {
        title: 'Tenant Live Validation',
        subtitle: 'Completed 20 Oct 2024',
        status: 'completed',
        stepNumber: 2,
      },
      {
        title: 'Billing Reconciled',
        subtitle: 'Fully Settled',
        status: 'completed',
        stepNumber: 3,
      },
    ],
    poDocument: 'STC_EXP_901_Agreement.pdf',
  },
  {
    id: 'SO-2024-1040',
    poNumber: 'DOW-HQ-012',
    customer: 'Al-Othman Logistics Hub',
    customerAr: 'مركز العثمان للخدمات اللوجستية',
    industry: 'Supply Chain',
    tier: 'Enterprise',
    quotationRef: 'QT-2024-0765',
    orderDate: '16 Oct 2024',
    provisionSlaDate: '30 Oct 2024',
    totalAmountNet: 312000,
    vatAmount: 46800,
    totalWithVat: 358800,
    fulfillmentPercent: 15,
    fulfillmentStatus: 'Pending Approval',
    invoicingStatus: 'Uninvoiced',
    slaLevel: 'Standard Enterprise 99.5%',
    paymentTerms: 'Net 45 Days',
    cloudTenant: {
      domain: 'logistics.khetatcloud.com',
      cluster: 'Dammam Port Datacenter',
      allocatedSeats: 120,
      totalSeats: 300,
      status: 'Provisioning',
    },
    milestones: [
      {
        title: 'Contract Legal Validation',
        subtitle: 'Under review by Finance Department',
        status: 'current',
        stepNumber: 1,
      },
      {
        title: 'ZATCA Gateway Linkage',
        subtitle: 'Pending clearance token',
        status: 'pending',
        stepNumber: 2,
      },
      {
        title: 'Go-Live Execution',
        subtitle: 'Target: 30 Oct 2024',
        status: 'pending',
        stepNumber: 3,
      },
    ],
    poDocument: 'AlOthman_PO_HQ012.pdf',
  },
  {
    id: 'SO-2024-1039',
    poNumber: 'MEED-SA-88',
    customer: 'Saudi Medicare Solutions',
    customerAr: 'الحلول الطبية السعودية',
    industry: 'Healthcare',
    tier: 'Government Support',
    quotationRef: 'QT-2024-0750',
    orderDate: '15 Oct 2024',
    provisionSlaDate: '20 Oct 2024',
    totalAmountNet: 540800,
    vatAmount: 81120,
    totalWithVat: 621920,
    fulfillmentPercent: 40,
    fulfillmentStatus: 'In Progress',
    invoicingStatus: 'Uninvoiced',
    slaLevel: 'Government Tier 99.99%',
    paymentTerms: 'Net 60 Days (Gov PO)',
    cloudTenant: {
      domain: 'medicare.khetatcloud.com',
      cluster: 'Kingdom Gov Cloud (NCA Compliant)',
      allocatedSeats: 450,
      totalSeats: 600,
      status: 'Active',
    },
    milestones: [
      {
        title: 'NCA Compliance Audit',
        subtitle: 'Passed 16 Oct 2024',
        status: 'completed',
        stepNumber: 1,
      },
      {
        title: 'Hospital Node Encryption',
        subtitle: 'Installing HSM cryptographic cards',
        status: 'current',
        stepNumber: 2,
      },
      {
        title: 'Official Invoicing',
        subtitle: 'Target: 22 Oct 2024',
        status: 'pending',
        stepNumber: 3,
      },
    ],
    poDocument: 'Gov_Medicare_PO_88.pdf',
  },
  {
    id: 'SO-2024-1038',
    poNumber: 'DAR-CON-55',
    customer: 'Dar Al-Riyadh Engineering',
    customerAr: 'دار الرياض للاستشارات الهندسية',
    industry: 'Architecture',
    tier: 'Commercial',
    quotationRef: 'QT-2024-0731',
    orderDate: '14 Oct 2024',
    provisionSlaDate: '19 Oct 2024',
    totalAmountNet: 114300,
    vatAmount: 17145,
    totalWithVat: 131445,
    fulfillmentPercent: 100,
    fulfillmentStatus: 'Fulfilled',
    invoicingStatus: 'Fully Invoiced',
    slaLevel: 'Standard 99.5%',
    paymentTerms: 'Immediate (Mada / Transfer)',
    cloudTenant: {
      domain: 'dar-eng.khetatcloud.com',
      cluster: 'Central KSA Cluster',
      allocatedSeats: 90,
      totalSeats: 100,
      status: 'Active',
    },
    milestones: [
      {
        title: 'BIM Cloud Storage Sync',
        subtitle: 'Completed 15 Oct 2024',
        status: 'completed',
        stepNumber: 1,
      },
      {
        title: 'ZATCA Fatoora Stamp Issued',
        subtitle: 'Verified with ZATCA Portal',
        status: 'completed',
        stepNumber: 2,
      },
      {
        title: 'Final Receipt Reconciled',
        subtitle: 'Reconciled 19 Oct 2024',
        status: 'completed',
        stepNumber: 3,
      },
    ],
    poDocument: 'DarAlRiyadh_PO_55.pdf',
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2024-3382',
    codeType: '0100000',
    type: 'Tax Invoice',
    typeAr: 'فاتورة ضريبية',
    buyerName: 'Saudi Aramco Base Oils Co.',
    buyerNameAr: 'شركة أرامكو السعودية لزيوت الأساس (لوبريف)',
    buyerTrn: '310144928100003',
    buyerAddress: 'Dhahran HQ, Eastern Province, KSA',
    issueDate: '18 May 2024',
    dueDate: '17 Jun 2024',
    taxableAmount: 185000,
    vatAmount: 27750,
    totalAmount: 212750,
    zatcaStatus: 'Cleared',
    zatcaHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    zatcaUuid: '83fe28a-12d9-40',
    settlementStatus: 'Unpaid',
    lineItems: [
      {
        description: 'Enterprise Cloud Node Subscriptions',
        descriptionAr: 'اشتراكات عقد السحابة المؤسسية المخصصة',
        subtitle: '12 Months Dedicated Cluster',
        qty: 1,
        unitPrice: 120000,
        subtotal: 120000,
      },
      {
        description: 'ZATCA Clearance Integration & Telemetry',
        descriptionAr: 'خدمات ربط وتكامل هيئة الزكاة والضريبة والجمارك',
        subtitle: 'Professional Services & API Provisioning',
        qty: 1,
        unitPrice: 65000,
        subtotal: 65000,
      },
    ],
  },
  {
    id: 'INV-2024-3381',
    codeType: '0100000',
    type: 'Tax Invoice',
    typeAr: 'فاتورة ضريبية',
    buyerName: 'Al-Rajhi Telecom Solutions',
    buyerNameAr: 'حلول الراجحي للاتصالات والتقنية',
    buyerTrn: '300481928000003',
    buyerAddress: 'King Fahd Rd, Riyadh, KSA',
    issueDate: '12 Apr 2024',
    dueDate: '12 May 2024',
    taxableAmount: 57000,
    vatAmount: 8550,
    totalAmount: 65550,
    zatcaStatus: 'Cleared',
    zatcaHash: '44b1c8da791823901b00eeaa1029539102847151d0e56f8dc629277360380ae',
    zatcaUuid: '99bf410-44e2-18',
    settlementStatus: 'Overdue',
    overdueDays: 6,
    lineItems: [
      {
        description: 'Dedicated Fiber Telecom Bridge',
        descriptionAr: 'ربط ألياف بصرية مباشر',
        subtitle: 'Enterprise Leased Line',
        qty: 1,
        unitPrice: 57000,
        subtotal: 57000,
      },
    ],
  },
  {
    id: 'SIMP-2024-8841',
    codeType: '0200000',
    type: 'Simplified',
    typeAr: 'فاتورة مبسطة',
    buyerName: 'Retail Walk-in Client (B2C)',
    buyerNameAr: 'عميل نقطة بيع مباشر',
    buyerTrn: 'POS Terminal #04',
    buyerAddress: 'Olaya Retail Center, Riyadh',
    issueDate: '18 May 2024',
    dueDate: 'Immediate',
    taxableAmount: 1200,
    vatAmount: 180,
    totalAmount: 1380,
    zatcaStatus: 'Reported',
    zatcaHash: '9811fd2209172810aa8837190012093847561029384756102938475610aa',
    zatcaUuid: 'simp-7712a-04',
    settlementStatus: 'Paid',
    settlementMethod: 'Mada',
    lineItems: [
      {
        description: 'Point-of-Sale Hardware Terminal',
        descriptionAr: 'جهاز دفع إلكتروني مدى',
        subtitle: 'Direct Merchant Settlement',
        qty: 1,
        unitPrice: 1200,
        subtotal: 1200,
      },
    ],
  },
  {
    id: 'INV-2024-3380',
    codeType: '0100000',
    type: 'Tax Invoice',
    typeAr: 'فاتورة ضريبية',
    buyerName: 'Modern Architecture Contracting',
    buyerNameAr: 'شركة المقاولات المعمارية الحديثة',
    buyerTrn: '310892019200003',
    buyerAddress: 'Al Malaz, Riyadh, KSA',
    issueDate: '15 May 2024',
    dueDate: '15 Jun 2024',
    taxableAmount: 420000,
    vatAmount: 63000,
    totalAmount: 483000,
    zatcaStatus: 'Cleared',
    zatcaHash: 'b89ca2331047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d15423310',
    zatcaUuid: 'arch-3380-01',
    settlementStatus: 'Paid',
    settlementMethod: 'Bank Transfer',
    lineItems: [
      {
        description: 'Architectural Cloud Processing Cluster',
        descriptionAr: 'خوادم معالجة النماذج الهندسية',
        subtitle: 'Annual Dedicated Node',
        qty: 1,
        unitPrice: 420000,
        subtotal: 420000,
      },
    ],
  },
  {
    id: 'INV-2024-3379',
    codeType: '0100000',
    type: 'Tax Invoice',
    typeAr: 'فاتورة ضريبية',
    buyerName: 'Red Sea Logistics Global',
    buyerNameAr: 'شركة لوجستيات البحر الأحمر العالمية',
    buyerTrn: '311029194800003',
    buyerAddress: 'Jeddah Seaport Logistics Zone, KSA',
    issueDate: '14 May 2024',
    dueDate: '14 Jun 2024',
    taxableAmount: 92400,
    vatAmount: 13860,
    totalAmount: 106260,
    zatcaStatus: 'Cleared',
    zatcaHash: 'f11072ec8947151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542ec89',
    zatcaUuid: 'redsea-3379-05',
    settlementStatus: 'Partially Paid',
    partialBalance: 50000,
    lineItems: [
      {
        description: 'Freight Clearing Automated Pipeline',
        descriptionAr: 'برمجيات التخليص الجمركي الذكي',
        subtitle: 'Phase 1 Delivery',
        qty: 1,
        unitPrice: 92400,
        subtotal: 92400,
      },
    ],
  },
];

export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'QT-2024-0891',
    version: 'v2',
    category: 'Master Agreement',
    customer: 'Al-Rajhi Capital Group',
    customerInitials: 'AR',
    crNumber: '1010034920',
    trnNumber: '300023489100003',
    dateIssued: '12 Oct 2024',
    validUntil: '26 Oct 2024',
    expiresInHours: 28,
    isExpiringSoon: true,
    totalNet: 162000,
    discount: 0,
    vatAmount: 24300,
    grandTotal: 186300,
    status: 'Sent',
    statusLabel: 'Sent / Review',
    creator: 'Tariq Mansoor',
    contactName: 'Khalid Al-Ghamdi',
    contactEmail: 'khalid@alrajhi-cap.sa',
    items: [
      {
        title: 'Khetat Cloud ERP (Annual)',
        scope: 'Qty: 250 Enterprise Named Licenses',
        price: 120000,
      },
      {
        title: 'ZATCA Phase 2 Custom API Bridge',
        scope: 'Qty: 80 Implementation Engineering Hrs',
        price: 32000,
      },
      {
        title: 'Dedicated Support Package',
        scope: '24/7 Priority SLA Response',
        price: 10000,
      },
    ],
    zatcaReady: true,
    eSignStatus: 'Awaiting e-Sign via Nafath / SMS OTP',
  },
  {
    id: 'QT-2024-0890',
    version: 'v1',
    category: 'Direct Sales',
    customer: 'Neom Smart Infrastructure',
    customerInitials: 'NS',
    crNumber: '4030198271',
    trnNumber: '310928340192831',
    dateIssued: '10 Oct 2024',
    validUntil: '09 Nov 2024',
    totalNet: 359000,
    discount: 0,
    vatAmount: 53850,
    grandTotal: 412850,
    status: 'Accepted',
    statusLabel: 'Accepted',
    convertedSo: 'SO-2024-0412',
    creator: 'Eng. Reem Al-Salem',
    contactName: 'Sultan Al-Shahrani',
    contactEmail: 'sultan@neom.tech',
    items: [
      {
        title: 'Enterprise Billing Gateway Cluster',
        scope: 'Multi-region failover cluster',
        price: 280000,
      },
      {
        title: 'High-Volume Cryptographic HSM Integration',
        scope: 'ZATCA Phase 2 high throughput bridge',
        price: 79000,
      },
    ],
    zatcaReady: true,
    eSignStatus: 'Signed via Nafath Verified ID',
  },
  {
    id: 'QT-2024-0889',
    version: 'v1',
    category: 'Annual SLA',
    customer: 'Saudia Aerospace Engineering',
    customerInitials: 'SA',
    crNumber: '4030018274',
    trnNumber: '300192847291029',
    dateIssued: '08 Oct 2024',
    validUntil: '22 Oct 2024',
    totalNet: 76695,
    discount: 0,
    vatAmount: 11505,
    grandTotal: 88200,
    status: 'Draft',
    statusLabel: 'Draft',
    creator: 'Fahad Al-Zahrani',
    contactName: 'Eng. Majed Qarni',
    contactEmail: 'm.qarni@saudiaero.com',
    items: [
      {
        title: 'Aerospace Fleet Billing Module',
        scope: 'Custom tail-number accounting setup',
        price: 76695,
      },
    ],
    zatcaReady: true,
    eSignStatus: 'Pending internal approval',
  },
  {
    id: 'QT-2024-0885',
    version: 'v3',
    category: 'Custom Tier',
    customer: 'Tamimi Markets Operations',
    customerInitials: 'TA',
    crNumber: '2050019283',
    trnNumber: '300928172600003',
    dateIssued: '25 Sep 2024',
    validUntil: '09 Oct 2024',
    totalNet: 56000,
    discount: 0,
    vatAmount: 8400,
    grandTotal: 64400,
    status: 'Expired',
    statusLabel: 'Expired',
    creator: 'Tariq Mansoor',
    contactName: 'Nasser Al-Tamimi',
    contactEmail: 'nasser@tamimimarkets.com',
    items: [
      {
        title: 'POS Real-time Simplified Invoice Sync',
        scope: '50 Stores integration',
        price: 56000,
      },
    ],
    zatcaReady: true,
    eSignStatus: 'Quotation validity period lapsed',
  },
  {
    id: 'QT-2024-0881',
    version: 'v1',
    category: 'Portal Integration',
    customer: 'Dar Al-Arkan Real Estate',
    customerInitials: 'DA',
    crNumber: '1010160195',
    trnNumber: '300084729100003',
    dateIssued: '22 Sep 2024',
    validUntil: '22 Oct 2024',
    totalNet: 460000,
    discount: 0,
    vatAmount: 69000,
    grandTotal: 529000,
    status: 'Accepted',
    statusLabel: 'Accepted',
    convertedSo: 'SO-2024-0398',
    creator: 'Lina Al-Husseini',
    contactName: 'Turki Al-Hakami',
    contactEmail: 'turki@alarkan.sa',
    items: [
      {
        title: 'Real Estate Tenant Billing Portal',
        scope: 'White-label tenant portal & SADAD bridge',
        price: 460000,
      },
    ],
    zatcaReady: true,
    eSignStatus: 'Signed via Corporate Authorization',
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Al-Madar Strategic Systems Ltd.',
    nameAr: 'شركة المدار للأنظمة الإستراتيجية',
    initials: 'AM',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    crNumber: '1010892049',
    trn: '300184729100003',
    primaryContact: {
      name: 'Tariq Al-Mansoor',
      email: 'tariq@almadar.sa',
      phone: '+966 50 123 4567',
    },
    tier: 'Enterprise',
    outstandingBalance: 42650,
    creditLimit: 150000,
    nationalAddress: {
      building: 'Building 4209, King Fahd Road',
      street: 'King Fahd Road',
      district: 'Al-Olaya District',
      city: 'Riyadh',
      postalCode: '12214',
      shortAddress: 'RYD-8821-4402',
    },
    activeSubscriptions: [
      {
        title: 'Enterprise Plus Platform',
        pricePerMonth: 12000,
        billingCycle: 'Renews in 18 days',
        status: 'Active',
      },
      {
        title: 'ZATCA Realtime Bridge',
        pricePerMonth: 1800,
        billingCycle: 'Auto-billed monthly',
        status: 'Active',
      },
    ],
  },
  {
    id: 'CUST-002',
    name: 'Tawreed Global Logistics Holding',
    nameAr: 'توريد القابضة للخدمات اللوجستية',
    initials: 'TG',
    city: 'Jeddah',
    country: 'Saudi Arabia',
    crNumber: '4030192841',
    trn: '310928374600003',
    primaryContact: {
      name: 'Sarah Al-Otaibi',
      email: 's.otaibi@tawreed.com',
      phone: '+966 55 987 6543',
    },
    tier: 'Enterprise',
    outstandingBalance: 38200,
    creditLimit: 120000,
    nationalAddress: {
      building: 'Terminal Bldg 14, Jeddah Seaport',
      street: 'Port Access Road',
      district: 'Al Mina District',
      city: 'Jeddah',
      postalCode: '21411',
      shortAddress: 'JED-5512-9901',
    },
    activeSubscriptions: [
      {
        title: 'Customs Clearance Automation',
        pricePerMonth: 9500,
        billingCycle: 'Annual billed',
        status: 'Active',
      },
    ],
  },
  {
    id: 'CUST-003',
    name: 'Nafith FinTech Solutions',
    nameAr: 'شركة نافذ لحلول التقنية المالية',
    initials: 'NF',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    crNumber: '1010594832',
    trn: '302847192000003',
    primaryContact: {
      name: 'Omar Bin Khalid',
      email: 'o.khalid@nafith.io',
      phone: '+966 54 222 3344',
    },
    tier: 'Enterprise',
    outstandingBalance: 80200,
    creditLimit: 200000,
    nationalAddress: {
      building: 'Tower 3.12, KAFD Zone 4',
      street: 'Financial Boulevard',
      district: 'Al-Aqeeq',
      city: 'Riyadh',
      postalCode: '13519',
      shortAddress: 'KAFD-4019-2100',
    },
    activeSubscriptions: [
      {
        title: 'High-Volume Financial Processing',
        pricePerMonth: 22000,
        billingCycle: 'Monthly',
        status: 'Active',
      },
    ],
  },
  {
    id: 'CUST-004',
    name: 'Horizon Medical & Pharma Supplies',
    nameAr: 'أفق لتوريدات الأدوية والمستلزمات الطبية',
    initials: 'HM',
    city: 'Al Khobar',
    country: 'Saudi Arabia',
    crNumber: '2050182940',
    trn: '311094827100003',
    primaryContact: {
      name: 'Dr. Mona Al-Zahrani',
      email: 'm.zahrani@horizonmed.sa',
      phone: '+966 56 444 8899',
    },
    tier: 'Corporate',
    outstandingBalance: 0,
    creditLimit: 100000,
    nationalAddress: {
      building: 'Medical Plaza 8',
      street: 'Prince Turki Highway',
      district: 'Corniche',
      city: 'Al Khobar',
      postalCode: '31952',
      shortAddress: 'KHB-1082-8411',
    },
    activeSubscriptions: [
      {
        title: 'Healthcare ZATCA Gateway',
        pricePerMonth: 6000,
        billingCycle: 'Monthly',
        status: 'Active',
      },
    ],
  },
  {
    id: 'CUST-005',
    name: 'Riyadh Cloud Infrastructure Co.',
    nameAr: 'شركة سحاب الرياض للبنية التحتية',
    initials: 'RC',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    crNumber: '1010778899',
    trn: '300928371100003',
    primaryContact: {
      name: 'Faisal Al-Ghamdi',
      email: 'faisal@riyadhcloud.sa',
      phone: '+966 53 777 1122',
    },
    tier: 'Enterprise',
    outstandingBalance: 0,
    creditLimit: 250000,
    nationalAddress: {
      building: 'Building Alpha 2',
      street: 'Digital City Avenue',
      district: 'Al Nakheel',
      city: 'Riyadh',
      postalCode: '12382',
      shortAddress: 'RYD-7700-1122',
    },
    activeSubscriptions: [
      {
        title: 'Multi-Tenant Host License',
        pricePerMonth: 18500,
        billingCycle: 'Annual',
        status: 'Active',
      },
    ],
  },
];

export const INITIAL_ACCOUNT_LEDGER: AccountLedger[] = [
  {
    id: 'LED-001',
    name: 'Aramco Horizons Tech',
    initials: 'AH',
    crn: '1010893421',
    trn: '310294829100003',
    riskTier: 'high',
    invoicedYtd: 1240000,
    collectedYtd: 995000,
    current0to30: 75000,
    aging31to60: 50000,
    aging61to90: 40000,
    overdue90plus: 80000,
    totalOutstanding: 245000,
    creditLimit: 250000,
    creditUtilPercent: 92,
  },
  {
    id: 'LED-002',
    name: 'Riyadh Metro Logistics Corp',
    initials: 'RM',
    crn: '1010349811',
    trn: '310118274900003',
    riskTier: 'moderate',
    invoicedYtd: 880000,
    collectedYtd: 740000,
    current0to30: 60000,
    aging31to60: 45000,
    aging61to90: 35000,
    overdue90plus: 0,
    totalOutstanding: 140000,
    creditLimit: 200000,
    creditUtilPercent: 65,
  },
  {
    id: 'LED-003',
    name: 'Al-Faisaliah Global Trading',
    initials: 'AF',
    crn: '1010672319',
    trn: '300827192800003',
    riskTier: 'low',
    invoicedYtd: 2150000,
    collectedYtd: 1970000,
    current0to30: 180000,
    aging31to60: 0,
    aging61to90: 0,
    overdue90plus: 0,
    totalOutstanding: 180000,
    creditLimit: 400000,
    creditUtilPercent: 45,
  },
  {
    id: 'LED-004',
    name: 'Neom Bay Infrastructure JV',
    initials: 'NB',
    crn: '1010992384',
    trn: '310491827100003',
    riskTier: 'low',
    invoicedYtd: 3420000,
    collectedYtd: 3110000,
    current0to30: 310000,
    aging31to60: 0,
    aging61to90: 0,
    overdue90plus: 0,
    totalOutstanding: 310000,
    creditLimit: 600000,
    creditUtilPercent: 52,
  },
  {
    id: 'LED-005',
    name: 'Al-Khobar Petro Supply Co',
    initials: 'AK',
    crn: '1010118472',
    trn: '310928172900003',
    riskTier: 'high',
    invoicedYtd: 410000,
    collectedYtd: 315000,
    current0to30: 15000,
    aging31to60: 20000,
    aging61to90: 20000,
    overdue90plus: 40000,
    totalOutstanding: 95000,
    creditLimit: 100000,
    creditUtilPercent: 95,
  },
];

export const INITIAL_RECEIPTS: ReceiptVoucher[] = [
  {
    id: 'RCT-2024-0519',
    date: '28 Aug 2024',
    time: '14:32',
    customer: 'Alinma Industrial Supplies Co.',
    customerAr: 'شركة الإنماء للتوريدات الصناعية',
    vatNumber: '310294857200003',
    method: 'Mada (Al Rajhi POS)',
    methodCategory: 'mada',
    referenceNumber: 'TXN-902817462-SARIE',
    amount: 125500,
    wordsEn: 'One Hundred Twenty-Five Thousand Five Hundred Saudi Riyals Only',
    wordsAr: 'فقط مائة وخمسة وعشرون ألفاً وخمسمائة ريال سعودي لا غير',
    allocatedInvoice: 'INV-2024-3382',
    allocatedAmount: 125500,
    status: 'Reconciled',
  },
  {
    id: 'RCT-2024-0518',
    date: '28 Aug 2024',
    time: '11:15',
    customer: 'Riyadh Metro Logistics Consortium',
    customerAr: 'تحالف مترو الرياض للخدمات اللوجستية',
    vatNumber: '300982341900003',
    method: 'SARIE Bank Wire (SNB)',
    methodCategory: 'sarie',
    referenceNumber: 'SARIE-20240828-8921',
    amount: 480000,
    wordsEn: 'Four Hundred Eighty Thousand Saudi Riyals Only',
    wordsAr: 'فقط أربعمائة وثمانون ألف ريال سعودي لا غير',
    allocatedInvoice: 'INV-2024-3380',
    allocatedAmount: 480000,
    status: 'Reconciled',
  },
  {
    id: 'RCT-2024-0517',
    date: '27 Aug 2024',
    time: '17:40',
    customer: 'Al-Olayan Healthcare Trading',
    customerAr: 'شركة العليان للتجارة الطبية والرعاية',
    vatNumber: '310554189000003',
    method: 'SADAD Bill #902188',
    methodCategory: 'sadad',
    referenceNumber: 'SDD-90218844',
    amount: 45000,
    wordsEn: 'Forty-Five Thousand Saudi Riyals Only',
    wordsAr: 'فقط خمسة وأربعون ألف ريال سعودي لا غير',
    allocatedInvoice: 'Pending Invoice Matching',
    allocatedAmount: 0,
    status: 'Pending Match',
  },
  {
    id: 'RCT-2024-0516',
    date: '26 Aug 2024',
    time: '09:12',
    customer: 'Red Sea Gateway Terminals',
    customerAr: 'محطة بوابة البحر الأحمر',
    vatNumber: '311984223400003',
    method: 'Visa / Mastercard (Direct)',
    methodCategory: 'card',
    referenceNumber: 'CC-AUTH-882719',
    amount: 68240,
    wordsEn: 'Sixty-Eight Thousand Two Hundred Forty Saudi Riyals Only',
    wordsAr: 'فقط ثمانية وستون ألفاً ومئتان وأربعون ريال سعودي لا غير',
    allocatedInvoice: 'INV-2024-3375',
    allocatedAmount: 68240,
    status: 'Cleared',
  },
  {
    id: 'RCT-2024-0515',
    date: '25 Aug 2024',
    time: '15:20',
    customer: 'Dar Al-Arkan Property Development',
    customerAr: 'دار الأركان للتطوير العقاري',
    vatNumber: '301827461900003',
    method: 'Cheque (Banque Saudi Fransi)',
    methodCategory: 'cheque',
    referenceNumber: 'BSF-CHQ-0092817',
    amount: 210000,
    wordsEn: 'Two Hundred Ten Thousand Saudi Riyals Only',
    wordsAr: 'فقط مئتان وعشرة آلاف ريال سعودي لا غير',
    allocatedInvoice: 'INV-2024-3369',
    allocatedAmount: 210000,
    status: 'Reconciled',
  },
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'TSK-101',
    title: 'ZATCA Phase 2 Cryptographic Handshake for Aramco Base Oils',
    client: 'Saudi Aramco Base Oils Co.',
    category: 'ZATCA Phase 2',
    status: 'in_progress',
    priority: 'Critical',
    assignee: {
      name: 'Eng. Tariq Mansoor',
      avatarInitials: 'TM',
    },
    dueDate: '24 Sep 2026',
    slaTag: '4h SLA remaining',
  },
  {
    id: 'TSK-102',
    title: 'AWS Bahrain Dedicated Cluster Provisioning (SO-2024-1042)',
    client: 'Al-Fanar Petrochemicals Ltd',
    category: 'Client Onboarding',
    status: 'completed',
    priority: 'High',
    assignee: {
      name: 'Sultan Al-Otaibi',
      avatarInitials: 'SO',
    },
    dueDate: '22 Sep 2026',
    slaTag: 'Completed on-time',
  },
  {
    id: 'TSK-103',
    title: 'Verify SADAD Gateway Webhook Reconciliation for RCT-2024-0517',
    client: 'Al-Olayan Healthcare',
    category: 'Billing Sprint',
    status: 'todo',
    priority: 'Critical',
    assignee: {
      name: 'Lina Al-Husseini',
      avatarInitials: 'LH',
    },
    dueDate: '25 Sep 2026',
    slaTag: 'SADAD Unallocated Alert',
  },
  {
    id: 'TSK-104',
    title: 'Quarterly Statement of Account generation & Dunning escalation',
    client: 'Aramco Horizons Tech',
    category: 'Audit',
    status: 'review',
    priority: 'High',
    assignee: {
      name: 'Fahad Al-Zahrani',
      avatarInitials: 'FZ',
    },
    dueDate: '26 Sep 2026',
    slaTag: '92% Limit Flagged',
  },
  {
    id: 'TSK-105',
    title: 'Issue Tax Invoice (ZATCA e-Invoice) for Al-Fanar 468.5K SAR',
    client: 'Al-Fanar Petrochemicals Ltd',
    category: 'Billing Sprint',
    status: 'in_progress',
    priority: 'High',
    assignee: {
      name: 'Eng. Tariq Mansoor',
      avatarInitials: 'TM',
    },
    dueDate: '28 Sep 2026',
    slaTag: 'Ready for Invoicing',
  },
  {
    id: 'TSK-106',
    title: 'Nafath e-Signature Verification follow up for QT-2024-0891',
    client: 'Al-Rajhi Capital Group',
    category: 'Client Onboarding',
    status: 'todo',
    priority: 'Medium',
    assignee: {
      name: 'Reem Al-Salem',
      avatarInitials: 'RS',
    },
    dueDate: '26 Sep 2026',
    slaTag: 'Expires in 28 hrs',
  },
];

export interface Supplier {
  id: string;
  name: string;
  nameAr?: string;
  category: string;
  categoryAr?: string;
  status: 'Active' | 'Inactive' | 'Pending Approval' | 'Blocked';

  // Contact Information
  contactPerson: string;
  phone: string;
  email: string;

  // Address
  shortAddress: string;
  buildingNumber: string;
  additionalNumber: string;
  streetName: string;
  district: string;
  region: string;
  city: string;
  country: string;
  postalCode: string;

  // Business Details
  taxId: string;
  paymentTerms: string;
  deliveryTerm: string;
  bankAccount?: string;
  notes?: string;

  // Accounting Details
  payableCode: string;
  payableOpeningBalance: number;
  payableOpeningDate: string;
  advanceCode: string;
  advanceOpeningBalance: number;
  advanceOpeningDate: string;

  // Analytics
  totalOrdersCount?: number;
  totalSpendSar?: number;
  currentBalanceSar?: number;
  lastPurchaseDate?: string;
}

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'Assa Abloy Hospitality ME (VingCard)',
    nameAr: 'آسا أبلوي لحلول الضيافة (فينغ كارد)',
    category: 'Smart Lock & IoT Hardware',
    categoryAr: 'أقفال ذكية وتقنيات الفنادق',
    status: 'Active',
    contactPerson: 'Kareem Mansoor',
    phone: '+966 50 123 4567',
    email: 'kareem.mansoor@assaabloy.com',
    shortAddress: 'RHSA7980',
    buildingNumber: '7980',
    additionalNumber: '3412',
    streetName: 'King Fahd Road',
    district: 'Al-Olaya',
    region: 'Riyadh Region',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    postalCode: '12214',
    taxId: '310234567800003',
    paymentTerms: 'Net 30 Days',
    deliveryTerm: 'DDP - Delivered Duty Paid',
    bankAccount: 'SA0380000000608010167519',
    notes: 'Primary IoT door lock RFID and Bluetooth Low Energy (BLE) supplier for hospitality chains.',
    payableCode: '2101-0001',
    payableOpeningBalance: 48200.0,
    payableOpeningDate: '2026-01-01',
    advanceCode: '1204-0001',
    advanceOpeningBalance: 0.0,
    advanceOpeningDate: '2026-01-01',
    totalOrdersCount: 14,
    totalSpendSar: 345000,
    currentBalanceSar: 48200,
    lastPurchaseDate: '20 Sep 2026',
  },
  {
    id: 'SUP-002',
    name: 'Al-Fozan Luxury Hotel Textiles & Linen',
    nameAr: 'الفوزان للمفروشات والمنسوجات الفندقية الفاخرة',
    category: 'Hotel Linen & Textiles',
    categoryAr: 'مفروشات وبياضات فندقية',
    status: 'Active',
    contactPerson: 'Sami Al-Fozan',
    phone: '+966 54 887 6543',
    email: 'orders@alfozan-textiles.sa',
    shortAddress: 'JEDH4421',
    buildingNumber: '4421',
    additionalNumber: '1109',
    streetName: 'Prince Sultan Street',
    district: 'Al-Rawdah',
    region: 'Makkah Region',
    city: 'Jeddah',
    country: 'Saudi Arabia',
    postalCode: '23431',
    taxId: '300123456700003',
    paymentTerms: 'Net 60 Days',
    deliveryTerm: 'DAP - Delivered at Place',
    bankAccount: 'SA4420000001234567890123',
    notes: 'Premium 400-thread Egyptian cotton linen supplier for AlUla & Riyadh resorts.',
    payableCode: '2101-0002',
    payableOpeningBalance: 112500.0,
    payableOpeningDate: '2026-01-15',
    advanceCode: '1204-0002',
    advanceOpeningBalance: 25000.0,
    advanceOpeningDate: '2026-01-15',
    totalOrdersCount: 9,
    totalSpendSar: 420000,
    currentBalanceSar: 87500,
    lastPurchaseDate: '18 Sep 2026',
  },
  {
    id: 'SUP-003',
    name: 'Dallah Guest Amenities & Personal Care',
    nameAr: 'دله لمستلزمات وكماليات النزلاء',
    category: 'Guest Amenities & Toiletries',
    categoryAr: 'مستلزمات وكماليات النزلاء',
    status: 'Active',
    contactPerson: 'Noura Al-Ghamdi',
    phone: '+966 56 332 1199',
    email: 'amenities@dallahhospitality.sa',
    shortAddress: 'DMAM8810',
    buildingNumber: '8810',
    additionalNumber: '4022',
    streetName: 'King Abdulaziz Road',
    district: 'Al-Shati',
    region: 'Eastern Province',
    city: 'Dammam',
    country: 'Saudi Arabia',
    postalCode: '32414',
    taxId: '311223344500003',
    paymentTerms: 'Net 15 Days',
    deliveryTerm: 'DDP - Delivered Duty Paid',
    bankAccount: 'SA1280000456123789004567',
    notes: 'Organic vegan toiletries, bespoke hospitality packaging, and eco-friendly bamboo dental kits.',
    payableCode: '2101-0003',
    payableOpeningBalance: 19800.0,
    payableOpeningDate: '2026-02-01',
    advanceCode: '1204-0003',
    advanceOpeningBalance: 0.0,
    advanceOpeningDate: '2026-02-01',
    totalOrdersCount: 22,
    totalSpendSar: 185000,
    currentBalanceSar: 19800,
    lastPurchaseDate: '22 Sep 2026',
  },
  {
    id: 'SUP-004',
    name: 'Nesma Food & Beverage Hospitality Services',
    nameAr: 'نسما لتوريدات الأغذية والمشروبات الفندقية',
    category: 'Food & Beverage Supplies',
    categoryAr: 'توريدات الأغذية والمشروبات',
    status: 'Active',
    contactPerson: 'Tariq Al-Amoudi',
    phone: '+966 55 994 4882',
    email: 'catering@nesma-holdings.sa',
    shortAddress: 'MKKA1029',
    buildingNumber: '1029',
    additionalNumber: '8833',
    streetName: 'Ibrahim Al-Khalil Road',
    district: 'Al-Kakiyyah',
    region: 'Makkah Region',
    city: 'Makkah',
    country: 'Saudi Arabia',
    postalCode: '24231',
    taxId: '300987654300003',
    paymentTerms: 'Net 30 Days',
    deliveryTerm: 'DDP - Delivered Duty Paid',
    bankAccount: 'SA6510000009876543210987',
    notes: 'Daily breakfast buffet supplies, artisanal coffee beans, and banquet catering ingredients.',
    payableCode: '2101-0004',
    payableOpeningBalance: 64500.0,
    payableOpeningDate: '2026-02-15',
    advanceCode: '1204-0004',
    advanceOpeningBalance: 15000.0,
    advanceOpeningDate: '2026-02-15',
    totalOrdersCount: 31,
    totalSpendSar: 560000,
    currentBalanceSar: 49500,
    lastPurchaseDate: '24 Sep 2026',
  },
  {
    id: 'SUP-005',
    name: 'STC Solutions & Enterprise Cloud IT',
    nameAr: 'إس تي سي حلول وتقنية الاتصالات والشبكات',
    category: 'IT & Telecommunication',
    categoryAr: 'تقنية المعلومات والاتصالات',
    status: 'Active',
    contactPerson: 'Faisal Al-Harbi',
    phone: '+966 50 771 2233',
    email: 'b2b-hospitality@solutions.stc.com.sa',
    shortAddress: 'RYAD5501',
    buildingNumber: '5501',
    additionalNumber: '2049',
    streetName: 'Olaya Street',
    district: 'Al-Murabba',
    region: 'Riyadh Region',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    postalCode: '12613',
    taxId: '300000000000003',
    paymentTerms: 'Net 30 Days',
    deliveryTerm: 'EXW - Ex Works',
    bankAccount: 'SA8080000001000000000001',
    notes: 'Hospitality Wi-Fi 6 access points, fiber optic backbone, and ZATCA Phase 2 hardware integration.',
    payableCode: '2101-0005',
    payableOpeningBalance: 82000.0,
    payableOpeningDate: '2026-01-01',
    advanceCode: '1204-0005',
    advanceOpeningBalance: 0.0,
    advanceOpeningDate: '2026-01-01',
    totalOrdersCount: 6,
    totalSpendSar: 290000,
    currentBalanceSar: 82000,
    lastPurchaseDate: '15 Sep 2026',
  },
  {
    id: 'SUP-006',
    name: 'Al-Saad Housekeeping & Sanitzation Chemicals',
    nameAr: 'السعد لمواد النظافة والتعقيم الفندقي',
    category: 'Cleaning & Housekeeping',
    categoryAr: 'نظافة وتدبير منزلي',
    status: 'Pending Approval',
    contactPerson: 'Ziyad Al-Bishri',
    phone: '+966 53 445 6677',
    email: 'sales@alsaad-cleaning.com',
    shortAddress: 'KHOB3310',
    buildingNumber: '3310',
    additionalNumber: '5521',
    streetName: 'Dhahran Road',
    district: 'Al-Bandariyah',
    region: 'Eastern Province',
    city: 'Al Khobar',
    country: 'Saudi Arabia',
    postalCode: '34423',
    taxId: '301234567800003',
    paymentTerms: 'Cash on Delivery (COD)',
    deliveryTerm: 'DAP - Delivered at Place',
    bankAccount: 'SA5550000008889991112223',
    notes: 'Industrial laundry detergents and Saudi SFDA approved room disinfectants.',
    payableCode: '2101-0006',
    payableOpeningBalance: 0.0,
    payableOpeningDate: '2026-03-01',
    advanceCode: '1204-0006',
    advanceOpeningBalance: 0.0,
    advanceOpeningDate: '2026-03-01',
    totalOrdersCount: 0,
    totalSpendSar: 0,
    currentBalanceSar: 0,
    lastPurchaseDate: 'N/A',
  },
];

export interface PropertyWarehouse {
  id: string;
  name: string;
  nameAr: string;
  code: string;
  manager: string;
}

export interface HotelProperty {
  id: string;
  name: string;
  nameAr: string;
  code: string;
  city: string;
  region: string;
  shippingAddress: {
    shortAddress: string;
    buildingNo: string;
    secondaryNo: string;
    streetName: string;
    district: string;
    city: string;
    postalCode: string;
  };
  contactDetails: {
    contactName: string;
    phone: string;
    email: string;
  };
  warehouses: PropertyWarehouse[];
}

export const HOTEL_PROPERTIES: HotelProperty[] = [
  {
    id: 'PROP-01',
    name: 'The Chedi Hegra AlUla Resort',
    nameAr: 'منتجع الشيدي الحجر - العلا',
    code: 'ALU-CHEDI',
    city: 'AlUla',
    region: 'Madinah Region',
    shippingAddress: {
      shortAddress: 'ALUL4351',
      buildingNo: '4351',
      secondaryNo: '2019',
      streetName: 'Wadi Al-Qura Heritage Highway',
      district: 'Al-Hegra Oasis Area',
      city: 'AlUla',
      postalCode: '43512',
    },
    contactDetails: {
      contactName: 'Eng. Tariq Al-Mansoor (Procurement Director)',
      phone: '+966 54 991 4420',
      email: 'procurement.alula@nuzul-hospitality.sa',
    },
    warehouses: [
      { id: 'WH-ALU-01', name: 'Central Hospitality Depot - AlUla', nameAr: 'المستودع الفندقي المركزي - العلا', code: 'ALU-MAIN', manager: 'Sultan Al-Harbi' },
      { id: 'WH-ALU-02', name: 'Resort Housekeeping & Linen Store', nameAr: 'مستودع المفروشات والبياضات', code: 'ALU-LINEN', manager: 'Amina Al-Balawi' },
      { id: 'WH-ALU-03', name: 'F&B Dry & Cold Storage', nameAr: 'مستودع الأغذية والمشروبات والتبريد', code: 'ALU-FNB', manager: 'Chef Zaid Al-Otaibi' },
      { id: 'WH-ALU-04', name: 'Maintenance & Engineering Store', nameAr: 'مستودع الصيانة والتشغيل الهندسي', code: 'ALU-ENG', manager: 'Eng. Omar Radwan' },
    ],
  },
  {
    id: 'PROP-02',
    name: 'Riyadh Grand Palace Hotel & Suites',
    nameAr: 'فندق قصر الرياض الكبير والأجنحة الفندقية',
    code: 'RUH-PALACE',
    city: 'Riyadh',
    region: 'Riyadh Region',
    shippingAddress: {
      shortAddress: 'RHSA1221',
      buildingNo: '2410',
      secondaryNo: '7890',
      streetName: 'King Fahd Road',
      district: 'Al-Olaya District',
      city: 'Riyadh',
      postalCode: '12214',
    },
    contactDetails: {
      contactName: 'Fahad Al-Otaibi (Supply Chain Head)',
      phone: '+966 50 119 2831',
      email: 'procurement.riyadh@nuzul-hospitality.sa',
    },
    warehouses: [
      { id: 'WH-RUH-01', name: 'Central Store - Riyadh Tower B2', nameAr: 'المستودع الرئيسي - برج الرياض B2', code: 'RUH-B2', manager: 'Majed Al-Subaie' },
      { id: 'WH-RUH-02', name: 'Front Office & Amenities Warehouse', nameAr: 'مستودع الاستقبال ومستلزمات الغرف', code: 'RUH-AMEN', manager: 'Noura Al-Shehri' },
      { id: 'WH-RUH-03', name: 'Kitchen & Banqueting Cold Storage', nameAr: 'مستودع مطابخ الولائم والتبريد', code: 'RUH-KIT', manager: 'Chef Bassam Al-Ghamdi' },
      { id: 'WH-RUH-04', name: 'IT & FF&E Reserve Store', nameAr: 'مستودع تقنية المعلومات والأثاث الاحتياطي', code: 'RUH-IT', manager: 'Rayan Al-Mutairi' },
    ],
  },
  {
    id: 'PROP-03',
    name: 'Jeddah Waterfront Operations & Suites',
    nameAr: 'فندق وأجنحة واجهة كورنيش جدة الفندقي',
    code: 'JED-WATER',
    city: 'Jeddah',
    region: 'Makkah Region',
    shippingAddress: {
      shortAddress: 'JEDD2351',
      buildingNo: '8120',
      secondaryNo: '4410',
      streetName: 'Corniche Road',
      district: 'Al-Shati District',
      city: 'Jeddah',
      postalCode: '23511',
    },
    contactDetails: {
      contactName: 'Dr. Sarah Al-Ghamdi (Regional Manager)',
      phone: '+966 55 832 9910',
      email: 'procurement.jeddah@nuzul-hospitality.sa',
    },
    warehouses: [
      { id: 'WH-JED-01', name: 'Main Port Receiving Warehouse', nameAr: 'مستودع الاستقبال الرئيسي بالميناء', code: 'JED-PORT', manager: 'Hassan Ba-Musa' },
      { id: 'WH-JED-02', name: 'Linen & Uniform Depot', nameAr: 'مستودع البياضات والزي الموحد', code: 'JED-LIN', manager: 'Salma Al-Harbi' },
      { id: 'WH-JED-03', name: 'Beverage & Perishables Hub', nameAr: 'مستودع المشروبات والمواد التموينية الطازجة', code: 'JED-FNB', manager: 'Yousef Al-Khatib' },
    ],
  },
  {
    id: 'PROP-04',
    name: 'Al Khobar Bay Luxury Marina Resort',
    nameAr: 'منتجع مارينا خليج الخبر الفاخر',
    code: 'KHB-BAY',
    city: 'Al Khobar',
    region: 'Eastern Province',
    shippingAddress: {
      shortAddress: 'KHOB3442',
      buildingNo: '3310',
      secondaryNo: '5521',
      streetName: 'Dhahran Road',
      district: 'Al-Bandariyah',
      city: 'Al Khobar',
      postalCode: '34423',
    },
    contactDetails: {
      contactName: 'Ziyad Al-Bishri (Logistics Lead)',
      phone: '+966 53 445 6677',
      email: 'procurement.khobar@nuzul-hospitality.sa',
    },
    warehouses: [
      { id: 'WH-KHB-01', name: 'Marina Receiving & Marine Equipment', nameAr: 'مستودع المارينا والمعدات البحرية', code: 'KHB-MAR', manager: 'Ahmed Al-Dossary' },
      { id: 'WH-KHB-02', name: 'Housekeeping Storehouse 01', nameAr: 'مستودع التدبير المنزلي 01', code: 'KHB-HK', manager: 'Fatima Al-Marri' },
    ],
  },
];

export interface PurchaseOrderItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  uom: string;
  unitCost: number;
  qty: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  issueDate: string;
  supplierId: string;
  supplierName: string;
  supplierNameAr?: string;
  propertyId: string;
  propertyName: string;
  warehouseId: string;
  warehouseName: string;
  requestedDeliveryDate: string;
  items: PurchaseOrderItem[];
  discount: number;
  subtotal: number;
  vatAmount: number;
  grandTotal: number;
  specialInstructions?: string;
  shippingAddress: {
    shortAddress: string;
    buildingNo: string;
    secondaryNo: string;
    streetName: string;
    district: string;
    city: string;
    postalCode: string;
  };
  contactDetails: {
    contactName: string;
    phone: string;
    email: string;
  };
  attachmentName?: string;
  attachmentSize?: string;
  status: 'Draft' | 'Approved' | 'In Transit' | 'Received' | 'Payment Pending' | 'Cancelled';
  statusAr: string;
  createdAt: string;
}

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'PO-2026-0001',
    poNumber: 'PO-2026-0001',
    issueDate: '2026-09-24',
    supplierId: 'SUP-001',
    supplierName: 'Assa Abloy Hospitality ME',
    supplierNameAr: 'آسا أبلوي لحلول الضيافة الشرق الأوسط',
    propertyId: 'PROP-01',
    propertyName: 'The Chedi Hegra AlUla Resort',
    warehouseId: 'WH-ALU-01',
    warehouseName: 'Central Hospitality Depot - AlUla',
    requestedDeliveryDate: '2026-10-10',
    items: [
      {
        id: 'POI-101',
        name: 'VingCard Essence RFID BLE Smart Door Lock',
        sku: 'IOT-VNG-ESS01',
        category: 'Smart Lock & IoT Hardware',
        uom: 'PCS',
        unitCost: 1450.0,
        qty: 24,
        total: 34800.0,
      },
      {
        id: 'POI-102',
        name: 'RFID Encrypted Guest Keycards (NXP Mifare 1K)',
        sku: 'IOT-CRD-1000',
        category: 'Smart Lock & IoT Hardware',
        uom: 'BOX',
        unitCost: 380.0,
        qty: 15,
        total: 5700.0,
      },
      {
        id: 'POI-103',
        name: 'Hospitality IoT Online Gateway Router V3',
        sku: 'IOT-GTW-ONL',
        category: 'IT & Telecommunication',
        uom: 'PCS',
        unitCost: 1900.0,
        qty: 4,
        total: 7600.0,
      },
    ],
    discount: 500.0,
    subtotal: 48100.0,
    vatAmount: 7140.0,
    grandTotal: 54740.0,
    specialInstructions: 'Urgent delivery required for Villa Cluster B opening. Deliver via air freight express to AlUla International Airport receiving hub.',
    shippingAddress: {
      shortAddress: 'ALUL4351',
      buildingNo: '4351',
      secondaryNo: '2019',
      streetName: 'Wadi Al-Qura Heritage Highway',
      district: 'Al-Hegra Oasis Area',
      city: 'AlUla',
      postalCode: '43512',
    },
    contactDetails: {
      contactName: 'Eng. Tariq Al-Mansoor',
      phone: '+966 54 991 4420',
      email: 'procurement.alula@nuzul-hospitality.sa',
    },
    attachmentName: 'Spec_Sheet_VingCard_Phase2.pdf',
    attachmentSize: '2.4 MB',
    status: 'Approved',
    statusAr: 'معتمد وجارِ التوريد',
    createdAt: '2026-09-24',
  },
  {
    id: 'PO-2026-0002',
    poNumber: 'PO-2026-0002',
    issueDate: '2026-09-22',
    supplierId: 'SUP-002',
    supplierName: 'Al-Fozan Luxury Hotel Textiles & Linen',
    supplierNameAr: 'مجموعة الفوزان للمفروشات والمنسوجات الفندقية',
    propertyId: 'PROP-01',
    propertyName: 'The Chedi Hegra AlUla Resort',
    warehouseId: 'WH-ALU-02',
    warehouseName: 'Resort Housekeeping & Linen Store',
    requestedDeliveryDate: '2026-10-05',
    items: [
      {
        id: 'POI-201',
        name: '5-Star Egyptian Cotton Bedsheet (King 400TC)',
        sku: 'TEX-BED-K01',
        category: 'Hotel Linen & Textiles',
        uom: 'SET',
        unitCost: 260.0,
        qty: 200,
        total: 52000.0,
      },
      {
        id: 'POI-202',
        name: 'Plush Velour Bathrobe with Gold Monogram 500 GSM',
        sku: 'TEX-ROB-500',
        category: 'Hotel Linen & Textiles',
        uom: 'PCS',
        unitCost: 145.0,
        qty: 180,
        total: 26100.0,
      },
      {
        id: 'POI-203',
        name: 'Zero-Twist Extra Large Pool Towel (Blue/White)',
        sku: 'TEX-TWL-POOL',
        category: 'Hotel Linen & Textiles',
        uom: 'PCS',
        unitCost: 75.0,
        qty: 250,
        total: 18750.0,
      },
    ],
    discount: 1850.0,
    subtotal: 96850.0,
    vatAmount: 14250.0,
    grandTotal: 109250.0,
    specialInstructions: 'Ensure custom resort logo embroidery matches Brand Standard Pantone 7531C.',
    shippingAddress: {
      shortAddress: 'ALUL4351',
      buildingNo: '4351',
      secondaryNo: '2019',
      streetName: 'Wadi Al-Qura Heritage Highway',
      district: 'Al-Hegra Oasis Area',
      city: 'AlUla',
      postalCode: '43512',
    },
    contactDetails: {
      contactName: 'Eng. Tariq Al-Mansoor',
      phone: '+966 54 991 4420',
      email: 'procurement.alula@nuzul-hospitality.sa',
    },
    attachmentName: 'Textile_Embroidery_Vector_Approved.pdf',
    attachmentSize: '4.8 MB',
    status: 'In Transit',
    statusAr: 'قيد الشحن والتوصيل',
    createdAt: '2026-09-22',
  },
  {
    id: 'PO-2026-0003',
    poNumber: 'PO-2026-0003',
    issueDate: '2026-09-18',
    supplierId: 'SUP-003',
    supplierName: 'Saudi Ceramic Company',
    supplierNameAr: 'شركة الخزف السعودية للأدوات الصحية وبلاط السيراميك',
    propertyId: 'PROP-02',
    propertyName: 'Riyadh Grand Palace Hotel & Suites',
    warehouseId: 'WH-RUH-01',
    warehouseName: 'Central Store - Riyadh Tower B2',
    requestedDeliveryDate: '2026-09-28',
    items: [
      {
        id: 'POI-301',
        name: 'Luxury Marble-Effect Glazed Porcelain Tiles 120x60',
        sku: 'CER-TL-12060',
        category: 'Maintenance & Facility Works',
        uom: 'BOX',
        unitCost: 110.0,
        qty: 320,
        total: 35200.0,
      },
      {
        id: 'POI-302',
        name: 'Wall-Hung Water-Saving Rimless Ceramic Toilet',
        sku: 'SAN-WTR-WALL',
        category: 'Maintenance & Facility Works',
        uom: 'SET',
        unitCost: 890.0,
        qty: 18,
        total: 16020.0,
      },
    ],
    discount: 1220.0,
    subtotal: 51220.0,
    vatAmount: 7500.0,
    grandTotal: 57500.0,
    specialInstructions: 'Receiving dock open from 7:00 AM to 3:00 PM. Unloading with heavy forklift required.',
    shippingAddress: {
      shortAddress: 'RHSA1221',
      buildingNo: '2410',
      secondaryNo: '7890',
      streetName: 'King Fahd Road',
      district: 'Al-Olaya District',
      city: 'Riyadh',
      postalCode: '12214',
    },
    contactDetails: {
      contactName: 'Fahad Al-Otaibi',
      phone: '+966 50 119 2831',
      email: 'procurement.riyadh@nuzul-hospitality.sa',
    },
    attachmentName: 'Ceramic_Pallet_Dispatch_Note.pdf',
    attachmentSize: '1.2 MB',
    status: 'Received',
    statusAr: 'تم الاستلام والمطابقة',
    createdAt: '2026-09-18',
  },
  {
    id: 'PO-2026-0004',
    poNumber: 'PO-2026-0004',
    issueDate: '2026-09-15',
    supplierId: 'SUP-004',
    supplierName: 'Nesma Hospitality & Food Services',
    supplierNameAr: 'نسما لخدمات التغذية والإعاشة الفندقية المتميزة',
    propertyId: 'PROP-03',
    propertyName: 'Jeddah Waterfront Operations & Suites',
    warehouseId: 'WH-JED-03',
    warehouseName: 'Beverage & Perishables Hub',
    requestedDeliveryDate: '2026-09-20',
    items: [
      {
        id: 'POI-401',
        name: 'Artisanal Single-Origin Arabica Coffee Beans 1KG',
        sku: 'FNB-COF-ETH01',
        category: 'Food & Beverage Supplies',
        uom: 'KG',
        unitCost: 95.0,
        qty: 120,
        total: 11400.0,
      },
      {
        id: 'POI-402',
        name: 'Organic Certified Mediterranean Olive Oil (Extra Virgin 5L)',
        sku: 'FNB-OIL-EVO05',
        category: 'Food & Beverage Supplies',
        uom: 'PCS',
        unitCost: 165.0,
        qty: 40,
        total: 6600.0,
      },
    ],
    discount: 0.0,
    subtotal: 18000.0,
    vatAmount: 2700.0,
    grandTotal: 20700.0,
    specialInstructions: 'Temperature controlled refrigerated truck required. Certificate of analysis must accompany dispatch.',
    shippingAddress: {
      shortAddress: 'JEDD2351',
      buildingNo: '8120',
      secondaryNo: '4410',
      streetName: 'Corniche Road',
      district: 'Al-Shati District',
      city: 'Jeddah',
      postalCode: '23511',
    },
    contactDetails: {
      contactName: 'Dr. Sarah Al-Ghamdi',
      phone: '+966 55 832 9910',
      email: 'procurement.jeddah@nuzul-hospitality.sa',
    },
    status: 'Payment Pending',
    statusAr: 'بانتظار سداد الفاتورة',
    createdAt: '2026-09-15',
  },
];

export interface ExpenseAccountOption {
  code: string;
  name: string;
  nameAr: string;
  type: 'Expense' | 'Asset';
}

export const EXPENSE_ACCOUNTS: ExpenseAccountOption[] = [
  { code: '5104', name: '5104 - Software Subscriptions & Cloud SaaS', nameAr: '5104 - اشتراكات البرمجيات والخدمات السحابية SaaS', type: 'Expense' },
  { code: '5101', name: '5101 - Hospitality Operating Supplies Expense', nameAr: '5101 - مصروف مستلزمات التشغيل الفندقي', type: 'Expense' },
  { code: '5102', name: '5102 - Linen & Housekeeping Supplies', nameAr: '5102 - مصروف بياضات ومستلزمات التدبير المنزلي', type: 'Expense' },
  { code: '5103', name: '5103 - Food & Beverage Cost of Sales', nameAr: '5103 - تكلفة مبيعات الأغذية والمشروبات', type: 'Expense' },
  { code: '5105', name: '5105 - Hotel Maintenance & Facility Repairs', nameAr: '5105 - مصروف صيانة المنشآت والمرافق الفندقية', type: 'Expense' },
  { code: '5106', name: '5106 - Professional, Legal & Consulting Fees', nameAr: '5106 - أتعاب الاستشارات المهنية والأنظمة', type: 'Expense' },
  { code: '5107', name: '5107 - IT & IoT Smart Hardware Infrastructure', nameAr: '5107 - البنية التحتية للأجهزة والأنظمة الذكية', type: 'Expense' },
  { code: '5108', name: '5108 - Guest Amenities & Complimentary Toiletries', nameAr: '5108 - مستلزمات وكماليات النزلاء', type: 'Expense' },
  { code: '1501', name: '1501 - FF&E Hotel Furniture & Equipment (Capital Asset)', nameAr: '1501 - الأثاث والمعدات والتجهيزات الفندقية (أصل رأسمالي)', type: 'Asset' },
  { code: '1401', name: '1401 - Central Warehouse Operating Stores (Inventory Asset)', nameAr: '1401 - مستودع المخزون التشغيلي المركزي (أصل مخزون)', type: 'Asset' },
];

export interface SupplierBillItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  uom: string;
  unitCost: number;
  qty: number;
  total: number;
}

export interface SupplierBill {
  id: string;
  billNumber: string;
  billType: 'standard' | 'direct_no_po';
  issueDate: string;
  dueDate?: string;
  supplierId: string;
  supplierName: string;
  supplierNameAr?: string;
  propertyId?: string;
  propertyName?: string;
  warehouseId?: string;
  warehouseName?: string;
  postToAccount?: string;
  isForeignVendor?: boolean;
  items: SupplierBillItem[];
  discount: number;
  subtotal: number;
  vatAmount: number;
  grandTotal: number;
  payableToSupplier: number;
  notes?: string;
  attachmentName?: string;
  attachmentSize?: string;
  status: 'Pending Approval' | 'Approved' | 'Paid' | 'Partially Paid' | 'Disputed';
  statusAr: string;
  createdAt: string;
}

export const INITIAL_SUPPLIER_BILLS: SupplierBill[] = [
  {
    id: 'BILL-2026-0001',
    billNumber: 'BILL-2026-0001',
    billType: 'standard',
    issueDate: '2026-09-24',
    dueDate: '2026-10-24',
    supplierId: 'SUP-001',
    supplierName: 'Assa Abloy Hospitality ME',
    supplierNameAr: 'آسا أبلوي لحلول الضيافة الشرق الأوسط',
    propertyId: 'PROP-01',
    propertyName: 'The Chedi Hegra AlUla Resort',
    warehouseId: 'WH-ALU-01',
    warehouseName: 'Central Hospitality Depot - AlUla',
    items: [
      {
        id: 'SBI-101',
        name: 'VingCard Essence RFID BLE Smart Door Lock',
        sku: 'IOT-VNG-ESS01',
        category: 'Smart Lock & IoT Hardware',
        uom: 'PCS',
        unitCost: 1450.0,
        qty: 24,
        total: 34800.0,
      },
      {
        id: 'SBI-102',
        name: 'RFID Encrypted Guest Keycards (NXP Mifare 1K)',
        sku: 'IOT-CRD-1000',
        category: 'Smart Lock & IoT Hardware',
        uom: 'BOX',
        unitCost: 380.0,
        qty: 15,
        total: 5700.0,
      },
    ],
    discount: 500.0,
    subtotal: 40500.0,
    vatAmount: 6000.0,
    grandTotal: 46000.0,
    payableToSupplier: 46000.0,
    notes: 'Official tax invoice matched against Goods Receipt Note #GRN-ALU-088.',
    attachmentName: 'Vendor_Invoice_AssaAbloy_INV9921.pdf',
    attachmentSize: '1.8 MB',
    status: 'Approved',
    statusAr: 'معتمد وجارِ السداد',
    createdAt: '2026-09-24',
  },
  {
    id: 'BILL-2026-0002',
    billNumber: 'BILL-2026-0002',
    billType: 'direct_no_po',
    issueDate: '2026-09-24',
    dueDate: '2026-10-09',
    supplierId: 'SUP-005',
    supplierName: 'STC Solutions & Enterprise Cloud IT',
    supplierNameAr: 'إس تي سي حلول وتقنية الاتصالات والشبكات',
    postToAccount: '5104 - Software Subscriptions & Cloud SaaS',
    isForeignVendor: false,
    items: [
      {
        id: 'SBI-201',
        name: 'Enterprise Cloud Hospitality Dedicated Bandwidth (1 Gbps)',
        sku: 'SFT-STC-1GB',
        category: 'IT & Telecommunication',
        uom: 'PCS',
        unitCost: 18500.0,
        qty: 1,
        total: 18500.0,
      },
      {
        id: 'SBI-202',
        name: 'Multi-Resort SD-WAN Mesh Redundancy SLA License',
        sku: 'SFT-SDWAN-LIC',
        category: 'IT & Telecommunication',
        uom: 'PCS',
        unitCost: 6500.0,
        qty: 1,
        total: 6500.0,
      },
    ],
    discount: 1000.0,
    subtotal: 25000.0,
    vatAmount: 3600.0,
    grandTotal: 27600.0,
    payableToSupplier: 27600.0,
    notes: 'Direct recurring telecom cloud lease. No physical goods receipt required.',
    attachmentName: 'STC_Solutions_DirectBill_Sep2026.pdf',
    attachmentSize: '2.1 MB',
    status: 'Approved',
    statusAr: 'معتمد وجارِ السداد',
    createdAt: '2026-09-24',
  },
  {
    id: 'BILL-2026-0003',
    billNumber: 'BILL-2026-0003',
    billType: 'direct_no_po',
    issueDate: '2026-09-20',
    dueDate: '2026-10-05',
    supplierId: 'SUP-002',
    supplierName: 'Oracle Hospitality International (Dublin)',
    supplierNameAr: 'أوراكل العالمية للأنظمة الفندقية (أيرلندا)',
    postToAccount: '5104 - Software Subscriptions & Cloud SaaS',
    isForeignVendor: true,
    items: [
      {
        id: 'SBI-301',
        name: 'OPERA Cloud PMS Property Management Core Licenses (Q3)',
        sku: 'SFT-ORC-PMS',
        category: 'IT & Telecommunication',
        uom: 'PCS',
        unitCost: 32000.0,
        qty: 1,
        total: 32000.0,
      },
    ],
    discount: 0.0,
    subtotal: 32000.0,
    vatAmount: 4800.0,
    grandTotal: 32000.0,
    payableToSupplier: 30400.0,
    notes: 'Foreign non-resident vendor: VAT is self-assessed under Reverse Charge Mechanism (RCM - SAR 4,800.00). 5% Withholding Tax (WHT - SAR 1,600.00) deducted for ZATCA filing.',
    attachmentName: 'Oracle_Ireland_Invoice_IE882910.pdf',
    attachmentSize: '3.4 MB',
    status: 'Pending Approval',
    statusAr: 'قيد المراجعة الضريبية',
    createdAt: '2026-09-20',
  },
  {
    id: 'BILL-2026-0004',
    billNumber: 'BILL-2026-0004',
    billType: 'standard',
    issueDate: '2026-09-18',
    dueDate: '2026-10-18',
    supplierId: 'SUP-004',
    supplierName: 'Nesma Hospitality & Food Services',
    supplierNameAr: 'نسما لخدمات التغذية والإعاشة الفندقية المتميزة',
    propertyId: 'PROP-03',
    propertyName: 'Jeddah Waterfront Operations & Suites',
    warehouseId: 'WH-JED-03',
    warehouseName: 'Beverage & Perishables Hub',
    items: [
      {
        id: 'SBI-401',
        name: 'Specialty Coffee Beans Ethiopian Yirgacheffe (1KG)',
        sku: 'FNB-COF-ETH01',
        category: 'Food & Beverage Supplies',
        uom: 'KG',
        unitCost: 95.0,
        qty: 120,
        total: 11400.0,
      },
      {
        id: 'SBI-402',
        name: 'Extra Virgin Olive Oil (5L)',
        sku: 'FNB-OIL-EVO05',
        category: 'Food & Beverage Supplies',
        uom: 'PCS',
        unitCost: 165.0,
        qty: 40,
        total: 6600.0,
      },
    ],
    discount: 0.0,
    subtotal: 18000.0,
    vatAmount: 2700.0,
    grandTotal: 20700.0,
    payableToSupplier: 20700.0,
    notes: 'Delivered and inspected at Jeddah waterfront receiving commissary.',
    status: 'Paid',
    statusAr: 'مسدد بالكامل',
    createdAt: '2026-09-18',
  },
];



