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
