import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldPlus,
  Users,
  UserCheck,
  UserPlus,
  Lock,
  Key,
  Check,
  X,
  Search,
  Filter,
  Save,
  RotateCcw,
  Sparkles,
  Building,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  FileText,
  CreditCard,
  MessageSquare,
  Package,
  ShoppingBag,
  Calculator,
  Briefcase,
  BarChart3,
  Activity,
  Settings as SettingsIcon,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  CheckSquare,
  Smartphone,
  ExternalLink,
  Plus,
  Copy,
} from 'lucide-react';

interface UsersAndRolesSettingsProps {
  isArabic: boolean;
}

interface PermissionRule {
  id: string;
  name: string;
  nameAr: string;
  desc: string;
  descAr: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
  export: boolean;
  scope: 'all' | 'branch' | 'own' | 'none';
}

interface RoleDefinition {
  id: string;
  name: string;
  nameAr: string;
  desc: string;
  descAr: string;
  userCount: number;
  badgeColor: string;
  securityLevel: string;
  defaultScope: string;
  isSystem: boolean;
  permissionsByModule: Record<string, PermissionRule[]>;
}

interface UserAccount {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  avatar: string;
  roleId: string;
  roleName: string;
  propertyScope: string;
  propertyScopeAr: string;
  nafathStatus: 'verified' | 'pending' | 'exempt';
  status: 'active' | 'suspended';
  lastLogin: string;
}

export const UsersAndRolesSettings: React.FC<UsersAndRolesSettingsProps> = ({ isArabic }) => {
  const [subSection, setSubSection] = useState<'matrix' | 'users' | 'security'>('matrix');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('general_manager');
  const [activeModelTab, setActiveModelTab] = useState<string>('sales');
  const [searchUserQuery, setSearchUserQuery] = useState<string>('');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState<boolean>(false);

  // Form state for creating a new custom role
  const [newRoleForm, setNewRoleForm] = useState({
    name: '',
    nameAr: '',
    desc: '',
    descAr: '',
    cloneFromRoleId: 'general_manager',
    securityLevel: 'Level 2 (SMS OTP Required)',
    defaultScope: 'Assigned Hotel / Branch Only',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    permissionPreset: 'template' as 'template' | 'all' | 'readonly',
  });

  // Model / Module definitions matching the sitemap
  const MODEL_TABS = [
    { id: 'dashboard', name: 'Dashboard', nameAr: 'لوحة التحكم', icon: Layers },
    { id: 'subscriptions', name: 'Subscriptions', nameAr: 'الاشتراكات', icon: CreditCard },
    { id: 'profiles', name: 'Profiles', nameAr: 'الملفات والفروع', icon: Building2 },
    { id: 'sales', name: 'Sales & Invoices', nameAr: 'المبيعات والفوترة', icon: FileText },
    { id: 'messaging', name: 'Messaging', nameAr: 'المراسلات', icon: MessageSquare },
    { id: 'products', name: 'Products & Tax', nameAr: 'المنتجات والضرائب', icon: Package },
    { id: 'task_manager', name: 'Task Manager', nameAr: 'إدارة المهام', icon: CheckSquare },
    { id: 'procurement', name: 'Procurement', nameAr: 'المشتريات', icon: ShoppingBag },
    { id: 'accounting', name: 'Accounting (USALI)', nameAr: 'المحاسبة الفندقية', icon: Calculator },
    { id: 'hr', name: 'HR & Payroll', nameAr: 'الموارد البشرية', icon: Briefcase },
    { id: 'reporting', name: 'Reporting', nameAr: 'التقارير التحليلية', icon: BarChart3 },
    { id: 'observability', name: 'Observability', nameAr: 'المراقبة وبوابة ZATCA', icon: Activity },
    { id: 'settings', name: 'Settings', nameAr: 'إعدادات المنشأة', icon: SettingsIcon },
  ];

  // Default permissions factory for modules
  const createDefaultModulePermissions = (roleId: string): Record<string, PermissionRule[]> => {
    const isSuper = roleId === 'super_admin';
    const isGM = roleId === 'general_manager';
    const isFinance = roleId === 'financial_controller';
    const isFrontDesk = roleId === 'front_desk';
    const isAuditor = roleId === 'auditor';

    return {
      dashboard: [
        {
          id: 'dash_kpi',
          name: 'Executive Hospitality KPIs & Revenue',
          nameAr: 'مؤشرات الأداء والإيرادات الفندقية',
          desc: 'View real-time RevPAR, occupancy percentages, and MRR aggregates across KSA.',
          descAr: 'الاطلاع على معدل العائد لكل غرفة، نسب الإشغال، ومجموع الإيرادات المتكررة.',
          view: true,
          create: false,
          edit: false,
          delete: false,
          approve: false,
          export: isSuper || isGM || isFinance || isAuditor,
          scope: isSuper || isAuditor ? 'all' : 'branch',
        },
        {
          id: 'dash_zatca_feed',
          name: 'Live ZATCA Clearance Folio Feed',
          nameAr: 'شريط اعتماد فواتير النزلاء المباشر',
          desc: 'Real-time telemetry of cryptographic stamp submissions.',
          descAr: 'متابعة لحظية لاعتماد الفواتير المشفرة لدى هيئة الزكاة والضريبة.',
          view: true,
          create: false,
          edit: false,
          delete: false,
          approve: false,
          export: isSuper || isFinance,
          scope: isSuper ? 'all' : 'branch',
        },
      ],
      subscriptions: [
        {
          id: 'subs_plans',
          name: 'Hospitality SaaS Plans & Pricing',
          nameAr: 'باقات اشتراكات المنشآت الفندقية',
          desc: 'View or modify per-key and per-villa subscription tiers.',
          descAr: 'إدارة وتعديل باقات الفنادق والشقق المخدومة والفلل.',
          view: true,
          create: isSuper,
          edit: isSuper,
          delete: isSuper,
          approve: isSuper || isGM,
          export: true,
          scope: isSuper ? 'all' : 'branch',
        },
        {
          id: 'subs_billing',
          name: 'Automated Billing Cycles & Invoicing',
          nameAr: 'دورات الفوترة الآلية والتحصيل',
          desc: 'Trigger batch recurring invoices and SADAD direct bill presentment.',
          descAr: 'تشغيل دورات الفوترة الدورية وربط سداد للمنشآت.',
          view: isSuper || isGM || isFinance,
          create: isSuper || isFinance,
          edit: isSuper || isFinance,
          delete: false,
          approve: isSuper || isGM || isFinance,
          export: true,
          scope: isSuper ? 'all' : 'branch',
        },
        {
          id: 'subs_coupons',
          name: 'Coupons & Tourism Vision 2030 Subsidies',
          nameAr: 'أكواد الخصم ومبادرات دعم السياحة',
          desc: 'Apply promotional rebates and government tourism incentives.',
          descAr: 'تطبيق الخصومات الترويجية وتخفيضات هيئة السياحة.',
          view: true,
          create: isSuper || isFinance,
          edit: isSuper || isFinance,
          delete: isSuper,
          approve: isSuper || isGM,
          export: true,
          scope: isSuper ? 'all' : 'branch',
        },
      ],
      profiles: [
        {
          id: 'prof_branches',
          name: 'Hotel Branches & Property Registration',
          nameAr: 'فروع الفنادق وسجلات التراخيص',
          desc: 'Register new resort locations, commercial registrations, and Nafath signatories.',
          descAr: 'تسجيل المواقع الفندقية الجديدة، السجلات التجارية، والمفوضين.',
          view: true,
          create: isSuper || isGM,
          edit: isSuper || isGM,
          delete: isSuper,
          approve: isSuper || isGM,
          export: true,
          scope: isSuper ? 'all' : 'branch',
        },
      ],
      sales: [
        {
          id: 'sales_invoices',
          name: 'ZATCA Tax Invoices & Guest Folios',
          nameAr: 'فواتير المبيعات الضريبية وفواتير النزلاء',
          desc: 'Issue official tax invoices with cryptographic ECDSA stamp and QR code clearance.',
          descAr: 'إصدار الفواتير الضريبية وتوليد الختم المشفر ورمز الاستجابة السريعة.',
          view: true,
          create: isSuper || isGM || isFinance || isFrontDesk,
          edit: isSuper || isFinance,
          delete: false,
          approve: isSuper || isFinance || isGM,
          export: true,
          scope: isSuper || isAuditor ? 'all' : 'branch',
        },
        {
          id: 'sales_credit_notes',
          name: 'ZATCA Credit & Debit Notes (Reversals)',
          nameAr: 'الإشعارات الدائنة والمدينة المعتمدة',
          desc: 'Issue refund notes linked to original invoice cryptographic hashes.',
          descAr: 'إصدار إشعارات الخصم والاسترجاع المرتبطة بالهاش التشفيري للفاتورة الأصلية.',
          view: true,
          create: isSuper || isFinance || isGM,
          edit: isSuper || isFinance,
          delete: false,
          approve: isSuper || isFinance,
          export: true,
          scope: isSuper ? 'all' : 'branch',
        },
        {
          id: 'sales_receipts',
          name: 'Receipt Vouchers & SADAD Reconciliations',
          nameAr: 'سندات القبض ومطابقة مدفوعات سداد',
          desc: 'Record cash, POS card, Mada, and bank wire settlements against folios.',
          descAr: 'تسجيل سندات القبض والدفع ببطاقات مدى والتحويل البنكي.',
          view: true,
          create: isSuper || isGM || isFinance || isFrontDesk,
          edit: isSuper || isFinance,
          delete: isSuper,
          approve: isSuper || isFinance,
          export: true,
          scope: isSuper ? 'all' : 'branch',
        },
        {
          id: 'sales_quotations',
          name: 'Corporate & Government Quotations',
          nameAr: 'عروض أسعار الوفود والشركات',
          desc: 'Issue banquet proposals, long-stay discounts, and official B2B offers.',
          descAr: 'إصدار عروض أسعار المناسبات وعقود الإقامة طويلة الأجل للشركات.',
          view: true,
          create: isSuper || isGM || isFinance || isFrontDesk,
          edit: isSuper || isGM || isFinance,
          delete: isSuper || isGM,
          approve: isSuper || isGM,
          export: true,
          scope: isSuper ? 'all' : 'branch',
        },
      ],
      messaging: [
        {
          id: 'msg_whatsapp',
          name: 'WhatsApp Business Guest Concierge',
          nameAr: 'كونسيرج واتساب للأعمال والنزلاء',
          desc: 'Send automated smart door lock PINs, check-in guides, and folio PDFs.',
          descAr: 'إرسال أرقام الأقفال الذكية وفواتير الزكاة عبر الواتساب تلقائياً.',
          view: true,
          create: isSuper || isGM || isFrontDesk,
          edit: isSuper || isGM,
          delete: false,
          approve: false,
          export: isSuper || isGM,
          scope: isSuper ? 'all' : 'branch',
        },
      ],
      products: [
        {
          id: 'prod_catalog',
          name: 'Room Catalog, Amenities & Tax Configuration',
          nameAr: 'كتالوج الغرف والمرافق والتهيئة الضريبية',
          desc: 'Configure 15% VAT, 5% Tourism Fee, and seasonal room rates.',
          descAr: 'ضبط ضريبة القيمة المضافة 15% ورسوم السياحة 5% وأسعار الغرف الموسمية.',
          view: true,
          create: isSuper || isGM || isFinance,
          edit: isSuper || isGM || isFinance,
          delete: isSuper,
          approve: isSuper || isGM,
          export: true,
          scope: isSuper ? 'all' : 'branch',
        },
      ],
      task_manager: [
        {
          id: 'task_operations',
          name: 'Housekeeping & Maintenance Task Tracking',
          nameAr: 'مهام النظافة والصيانة والتشغيل اليومي',
          desc: 'Assign room readiness, inspection tasks, and billable work.',
          descAr: 'إسناد مهام تجهيز الغرف وجاهزية الفلل للنزلاء.',
          view: true,
          create: isSuper || isGM || isFrontDesk || roleId === 'operations_housekeeping',
          edit: isSuper || isGM || roleId === 'operations_housekeeping',
          delete: isSuper || isGM,
          approve: isSuper || isGM || roleId === 'operations_housekeeping',
          export: true,
          scope: isSuper ? 'all' : 'branch',
        },
      ],
      procurement: [
        {
          id: 'proc_orders',
          name: 'Hotel Supplies & Smart Lock Procurement',
          nameAr: 'توريد مستلزمات الفنادق والأقفال الذكية',
          desc: 'Issue purchase orders to linen, amenities, and RFID hardware vendors.',
          descAr: 'إصدار أوامر الشراء لموردي الأثاث والمفروشات وبطاقات RFID.',
          view: isSuper || isGM || isFinance || roleId === 'operations_housekeeping',
          create: isSuper || isGM || isFinance || roleId === 'operations_housekeeping',
          edit: isSuper || isFinance,
          delete: isSuper,
          approve: isSuper || isGM || isFinance,
          export: true,
          scope: isSuper ? 'all' : 'branch',
        },
      ],
      accounting: [
        {
          id: 'acc_usali',
          name: 'USALI Chart of Accounts & General Ledger',
          nameAr: 'دليل الحسابات الفندقي المعياري USALI ودفتر الأستاذ',
          desc: 'Rooms department revenue, F&B cost centers, and automated journal postings.',
          descAr: 'حسابات إيرادات الغرف ومراكز تكلفة الأغذية والمشروبات والقيود اليومية.',
          view: isSuper || isFinance || isAuditor || isGM,
          create: isSuper || isFinance,
          edit: isSuper || isFinance,
          delete: isSuper,
          approve: isSuper || isFinance,
          export: true,
          scope: isSuper || isAuditor ? 'all' : 'branch',
        },
      ],
      hr: [
        {
          id: 'hr_nitaqat',
          name: 'Staff Rosters, Payroll & Saudization (Nitaqat)',
          nameAr: 'مسيرات الرواتب ونسب التوطين (نطاقات)',
          desc: 'Shift assignments, GOSI wage protection files, and employee master.',
          descAr: 'جداول الشفتات، ملفات حماية الأجور، وسجلات كوادر الضيافة.',
          view: isSuper || isGM || isFinance,
          create: isSuper || isGM || isFinance,
          edit: isSuper || isGM || isFinance,
          delete: isSuper,
          approve: isSuper || isGM,
          export: true,
          scope: isSuper ? 'all' : 'branch',
        },
      ],
      reporting: [
        {
          id: 'rep_zatca_returns',
          name: 'ZATCA Tax Return & Tourism Authority Filings',
          nameAr: 'إقرارات هيئة الزكاة والضريبة وتقارير هيئة السياحة',
          desc: 'Monthly statutory tax returns, ADR, and RevPAR certified audit files.',
          descAr: 'الإقرارات الضريبية الشهرية الرسمية وملفات التدقيق المعتمدة.',
          view: isSuper || isGM || isFinance || isAuditor,
          create: isSuper || isFinance,
          edit: isSuper || isFinance,
          delete: false,
          approve: isSuper || isGM || isFinance,
          export: true,
          scope: isSuper || isAuditor ? 'all' : 'branch',
        },
      ],
      observability: [
        {
          id: 'obs_telemetry',
          name: 'ZATCA CSID Security & Gateway Telemetry',
          nameAr: 'أمان شهادات CSID ومراقبة البوابة الضريبية',
          desc: 'Inspect HSM cryptographic signing latency, API rate limits, and audit logs.',
          descAr: 'فحص زمن توقيع المفاتيح المشفرة وسجلات الأمان والتدقيق.',
          view: isSuper || isFinance || isAuditor,
          create: false,
          edit: isSuper,
          delete: false,
          approve: false,
          export: isSuper,
          scope: isSuper ? 'all' : 'branch',
        },
      ],
      settings: [
        {
          id: 'set_compliance',
          name: 'System Policies, Payment Gateways & ZATCA Keys',
          nameAr: 'سياسات النظام وبوابات الدفع ومفاتيح الزكاة',
          desc: 'Manage cryptographic CSID certificates, Mada terminals, and tenant settings.',
          descAr: 'إدارة شهادات الربط الضريبي، أجهزة مدى، والإعدادات العامة للمنظومة.',
          view: isSuper || isGM,
          create: isSuper,
          edit: isSuper,
          delete: isSuper,
          approve: isSuper,
          export: isSuper,
          scope: isSuper ? 'all' : 'branch',
        },
      ],
    };
  };

  // Pre-configured system roles
  const [roles, setRoles] = useState<RoleDefinition[]>([
    {
      id: 'super_admin',
      name: 'Super Admin',
      nameAr: 'مدير النظام الأعلى',
      desc: 'Unrestricted enterprise control across all 142 properties, financial ledgers, and ZATCA CSID cryptographic roots.',
      descAr: 'تحكم كامل وشامل في جميع الفنادق والفلل والشقق، والشهادات التشفيرية، والقيود المحاسبية.',
      userCount: 3,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      securityLevel: 'Level 5 (Hardware Key Required)',
      defaultScope: 'All KSA Properties',
      isSystem: true,
      permissionsByModule: createDefaultModulePermissions('super_admin'),
    },
    {
      id: 'general_manager',
      name: 'General Manager (Hotel & Resorts)',
      nameAr: 'المدير العام للمنشآت الفندقية',
      desc: 'Operational leadership, high-value quotation approvals, property performance oversight, and staff management.',
      descAr: 'الإشراف التشغيلي الكامل، اعتماد عروض الأسعار الكبرى، ومتابعة مؤشرات الإشغال والكوادر.',
      userCount: 8,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      securityLevel: 'Level 4 (Nafath Verified)',
      defaultScope: 'Assigned Cluster / Property',
      isSystem: true,
      permissionsByModule: createDefaultModulePermissions('general_manager'),
    },
    {
      id: 'financial_controller',
      name: 'Financial Controller & ZATCA Officer',
      nameAr: 'المدير المالي ومسؤول الامتثال الضريبي',
      desc: 'USALI ledger accounting, ZATCA Phase 2 folio clearance, credit notes, VAT returns, and supplier payments.',
      descAr: 'إدارة الدفاتر المحاسبية، اعتماد الفواتير والإشعارات الدائنة، وتقديم الإقرارات الضريبية.',
      userCount: 12,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      securityLevel: 'Level 4 (Nafath Verified)',
      defaultScope: 'All Hospitality Portfolios',
      isSystem: true,
      permissionsByModule: createDefaultModulePermissions('financial_controller'),
    },
    {
      id: 'front_desk',
      name: 'Front Desk & Reservations Supervisor',
      nameAr: 'مشرف الاستقبال والحجوزات',
      desc: 'Guest check-in/out, folio billing, smart door lock PIN issuance, and POS card settlement recording.',
      descAr: 'تسجيل دخول ومغادرة النزلاء، فوترة الغرف، إرسال رموز الأقفال، وتسجيل المدفوعات.',
      userCount: 26,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      securityLevel: 'Level 2 (SMS OTP)',
      defaultScope: 'Assigned Hotel Front Desk Only',
      isSystem: true,
      permissionsByModule: createDefaultModulePermissions('front_desk'),
    },
    {
      id: 'operations_housekeeping',
      name: 'Operations & Housekeeping Lead',
      nameAr: 'رئيس قسم التشغيل وخدمة الغرف',
      desc: 'Room readiness verification, villa maintenance tasks, linen inventory, and supplier supply requests.',
      descAr: 'جاهزية الغرف والفلل، مهام الصيانة الوقائية، ومتابعة استهلاك المفروشات والمستلزمات.',
      userCount: 18,
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      securityLevel: 'Level 2 (SMS OTP)',
      defaultScope: 'Assigned Property Only',
      isSystem: true,
      permissionsByModule: createDefaultModulePermissions('operations_housekeeping'),
    },
    {
      id: 'auditor',
      name: 'Statutory Auditor & Compliance Inspector',
      nameAr: 'مدقق الحسابات المعتمد وهيئة الزكاة',
      desc: 'Read-only audit access to ZATCA cryptographic folio logs, USALI balance sheets, and tax archives.',
      descAr: 'اطلاع تدقيقي فقط على سجلات الفواتير المشفرة، القوائم المالية، وأرشيف العمليات.',
      userCount: 4,
      badgeColor: 'bg-gray-100 text-gray-800 border-gray-200',
      securityLevel: 'Level 3 (Strict Read-Only)',
      defaultScope: 'All KSA Entities (Read-Only)',
      isSystem: true,
      permissionsByModule: createDefaultModulePermissions('auditor'),
    },
  ]);

  // Users Directory state
  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: 'USR-001',
      name: 'Sheikh Mansour Al-Harbi',
      nameAr: 'الشيخ منصور الحربي',
      email: 'm.harbi@khetat.sa',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      roleId: 'super_admin',
      roleName: 'Super Admin',
      propertyScope: 'All 142 KSA Properties',
      propertyScopeAr: 'كافة الـ 142 منشأة بالمملكة',
      nafathStatus: 'verified',
      status: 'active',
      lastLogin: 'Active now (Riyadh)',
    },
    {
      id: 'USR-002',
      name: 'Eng. Tariq Mansoor',
      nameAr: 'م. طارق منصور',
      email: 'tariq@khetat.sa',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      roleId: 'general_manager',
      roleName: 'General Manager (Hotel & Resorts)',
      propertyScope: 'Central & Western Clusters (78 Props)',
      propertyScopeAr: 'القطاع الأوسط والغربي (78 منشأة)',
      nafathStatus: 'verified',
      status: 'active',
      lastLogin: '24 mins ago (Jeddah)',
    },
    {
      id: 'USR-003',
      name: 'Layla Al-Otaibi, SOCPA',
      nameAr: 'أ. ليلى العتيبي (محاسب قانوني)',
      email: 'l.otaibi@khetat.sa',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      roleId: 'financial_controller',
      roleName: 'Financial Controller & ZATCA Officer',
      propertyScope: 'All Hospitality Portfolios (ZATCA Portal)',
      propertyScopeAr: 'بوابة ZATCA المركزية وكافة المنشآت',
      nafathStatus: 'verified',
      status: 'active',
      lastLogin: '1 hour ago (Riyadh)',
    },
    {
      id: 'USR-004',
      name: 'Abdulrahman Al-Ghamdi',
      nameAr: 'عبدالرحمن الغامدي',
      email: 'a.ghamdi@cheapadm.sa',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      roleId: 'front_desk',
      roleName: 'Front Desk & Reservations Supervisor',
      propertyScope: 'The Chedi Hegra AlUla (42 suites)',
      propertyScopeAr: 'منتجع الشيدي الحجر - العلا',
      nafathStatus: 'verified',
      status: 'active',
      lastLogin: '3 hours ago (AlUla)',
    },
    {
      id: 'USR-005',
      name: 'Khadija Al-Madani',
      nameAr: 'خديجة المدني',
      email: 'k.madani@taqwahotel.sa',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      roleId: 'front_desk',
      roleName: 'Front Desk & Reservations Supervisor',
      propertyScope: 'Dar Al-Taqwa Madinah (320 keys)',
      propertyScopeAr: 'فندق دار التقوى - المدينة المنورة',
      nafathStatus: 'verified',
      status: 'active',
      lastLogin: 'Today, 08:30 AM',
    },
    {
      id: 'USR-006',
      name: 'Sultan Al-Dosari',
      nameAr: 'سلطان الدوسري',
      email: 's.dosari@khetat.sa',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      roleId: 'operations_housekeeping',
      roleName: 'Operations & Housekeeping Lead',
      propertyScope: 'KAFD Executive Apartments Riyadh',
      propertyScopeAr: 'شقق كافد الفندقية التنفيذية - الرياض',
      nafathStatus: 'verified',
      status: 'active',
      lastLogin: 'Yesterday',
    },
    {
      id: 'USR-007',
      name: 'Dr. Faisal Al-Zahrani (Audit Partner)',
      nameAr: 'د. فيصل الزهراني (شريك تدقيق)',
      email: 'faisal.audit@kpmg-partner.sa',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      roleId: 'auditor',
      roleName: 'Statutory Auditor & Compliance Inspector',
      propertyScope: 'All KSA Entities (Statutory Audit)',
      propertyScopeAr: 'كافة منشآت المملكة (تدقيق قانوني)',
      nafathStatus: 'verified',
      status: 'active',
      lastLogin: '2 days ago',
    },
  ]);

  // Current selected role object
  const currentRole = roles.find((r) => r.id === selectedRoleId) || roles[0];
  const currentPermissions = currentRole.permissionsByModule[activeModelTab] || [];

  // Toggle single permission field
  const handleTogglePermission = (
    ruleId: string,
    field: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export'
  ) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== selectedRoleId) return role;
        const currentModRules = role.permissionsByModule[activeModelTab] || [];
        const updatedModRules = currentModRules.map((rule) => {
          if (rule.id !== ruleId) return rule;
          return { ...rule, [field]: !rule[field] };
        });
        return {
          ...role,
          permissionsByModule: {
            ...role.permissionsByModule,
            [activeModelTab]: updatedModRules,
          },
        };
      })
    );
  };

  // Change scope
  const handleChangeScope = (ruleId: string, newScope: 'all' | 'branch' | 'own' | 'none') => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== selectedRoleId) return role;
        const currentModRules = role.permissionsByModule[activeModelTab] || [];
        const updatedModRules = currentModRules.map((rule) => {
          if (rule.id !== ruleId) return rule;
          return { ...rule, scope: newScope };
        });
        return {
          ...role,
          permissionsByModule: {
            ...role.permissionsByModule,
            [activeModelTab]: updatedModRules,
          },
        };
      })
    );
  };

  // Batch toggle for active module
  const handleBatchGrantModule = (grant: boolean) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== selectedRoleId) return role;
        const currentModRules = role.permissionsByModule[activeModelTab] || [];
        const updatedModRules = currentModRules.map((rule) => ({
          ...rule,
          view: grant,
          create: grant,
          edit: grant,
          delete: grant && role.id === 'super_admin',
          approve: grant,
          export: grant,
        }));
        return {
          ...role,
          permissionsByModule: {
            ...role.permissionsByModule,
            [activeModelTab]: updatedModRules,
          },
        };
      })
    );
  };

  // Save changes handler
  const handleSavePermissions = () => {
    setSaveSuccessMessage(
      isArabic
        ? `تم حفظ مصفوفة الصلاحيات لدور "${currentRole.nameAr}" بنجاح في السحابة السيادية!`
        : `Permission matrix for role "${currentRole.name}" saved successfully to Sovereign Cloud!`
    );
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 4000);
  };

  // Create New Role Handler
  const handleCreateRole = () => {
    const roleName = newRoleForm.name.trim() || (isArabic ? 'دور تشغيلي جديد' : 'New Operational Role');
    const roleNameAr = newRoleForm.nameAr.trim() || (isArabic ? 'دور تشغيلي جديد' : roleName);
    const roleId = `role_custom_${Date.now()}`;

    // Clone base permissions from selected template
    const baseRole = roles.find((r) => r.id === newRoleForm.cloneFromRoleId) || roles[0];
    const newPermissionsByModule: Record<string, PermissionRule[]> = JSON.parse(
      JSON.stringify(baseRole.permissionsByModule)
    );

    if (newRoleForm.permissionPreset === 'all') {
      Object.keys(newPermissionsByModule).forEach((mod) => {
        newPermissionsByModule[mod] = newPermissionsByModule[mod].map((rule) => ({
          ...rule,
          view: true,
          create: true,
          edit: true,
          delete: true,
          approve: true,
          export: true,
        }));
      });
    } else if (newRoleForm.permissionPreset === 'readonly') {
      Object.keys(newPermissionsByModule).forEach((mod) => {
        newPermissionsByModule[mod] = newPermissionsByModule[mod].map((rule) => ({
          ...rule,
          view: true,
          create: false,
          edit: false,
          delete: false,
          approve: false,
          export: true,
        }));
      });
    }

    const createdRole: RoleDefinition = {
      id: roleId,
      name: roleName,
      nameAr: roleNameAr,
      desc: newRoleForm.desc.trim() || `Custom hospitality role created for ${roleName}.`,
      descAr: newRoleForm.descAr.trim() || `دور تشغيلي فندقي مخصص لـ ${roleNameAr}.`,
      userCount: 0,
      badgeColor: newRoleForm.badgeColor,
      securityLevel: newRoleForm.securityLevel,
      defaultScope: newRoleForm.defaultScope,
      isSystem: false,
      permissionsByModule: newPermissionsByModule,
    };

    setRoles((prev) => [...prev, createdRole]);
    setSelectedRoleId(roleId);
    setSubSection('matrix');
    setIsCreateRoleModalOpen(false);

    setNewRoleForm({
      name: '',
      nameAr: '',
      desc: '',
      descAr: '',
      cloneFromRoleId: 'general_manager',
      securityLevel: 'Level 2 (SMS OTP Required)',
      defaultScope: 'Assigned Hotel / Branch Only',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      permissionPreset: 'template',
    });

    setSaveSuccessMessage(
      isArabic
        ? `تم إنشاء الدور الجديد "${roleNameAr}" بنجاح! يمكنك الآن تعديل الصلاحيات التفصيلية حسب الموديولات.`
        : `Custom role "${roleName}" created successfully! You can now configure permissions across models.`
    );
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 5000);
  };

  // Delete Custom Role Handler
  const handleDeleteCustomRole = (roleIdToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const roleToDelete = roles.find((r) => r.id === roleIdToDelete);
    if (!roleToDelete || roleToDelete.isSystem) return;

    if (
      window.confirm(
        isArabic
          ? `هل أنت متأكد من حذف الدور المخصص "${roleToDelete.nameAr}"؟`
          : `Are you sure you want to delete custom role "${roleToDelete.name}"?`
      )
    ) {
      setRoles((prev) => prev.filter((r) => r.id !== roleIdToDelete));
      if (selectedRoleId === roleIdToDelete) {
        setSelectedRoleId(roles[0].id);
      }
      setSaveSuccessMessage(
        isArabic
          ? `تم حذف الدور المخصص "${roleToDelete.nameAr}" بنجاح.`
          : `Custom role "${roleToDelete.name}" has been removed.`
      );
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    }
  };

  // Filtered users list
  const filteredUsers = users.filter((u) => {
    const q = searchUserQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.nameAr.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.roleName.toLowerCase().includes(q) ||
      u.propertyScope.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Section */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#003647] to-[#004a60] text-white flex items-center justify-center shadow-xs">
              <Shield className="h-6 w-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#161c27]">
                  {isArabic ? 'إدارة المستخدمين والأدوار ومصفوفة الصلاحيات' : 'Users, Roles & Access Control (RBAC)'}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-200">
                  <ShieldCheck className="h-3 w-3" />
                  NCA & ZATCA Compliant
                </span>
              </div>
              <p className="text-xs text-[#70787d] mt-0.5">
                {isArabic
                  ? 'تحديد صلاحيات الوصول الدقيقة للكوادر الفندقية والمحاسبين وفرق الاستقبال بحسب موديولات النظام ونطاق الفروع.'
                  : 'Configure role-based access permissions across hospitality models (Subscriptions, Invoicing, USALI, Tasks, etc.).'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateRoleModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-[#004a60] bg-white text-[#004a60] px-3.5 py-2 text-xs font-bold shadow-xs hover:bg-[#f1f3ff] transition-all"
            >
              <ShieldPlus className="h-4 w-4" />
              <span>{isArabic ? 'إنشاء دور جديد' : 'Create Role'}</span>
            </button>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#004a60] text-white px-3.5 py-2 text-xs font-bold shadow-xs hover:bg-[#074e64] transition-all"
            >
              <UserPlus className="h-4 w-4" />
              <span>{isArabic ? 'دعوة مستخدم جديد' : 'Invite User'}</span>
            </button>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#e3e8f9]">
          <button
            onClick={() => setSubSection('matrix')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              subSection === 'matrix'
                ? 'bg-[#004a60] text-white shadow-xs'
                : 'text-[#40484d] hover:bg-[#f1f3ff] hover:text-[#004a60]'
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>{isArabic ? 'مصفوفة الأدوار والصلاحيات (حسب الموديول)' : 'Roles & Permission Matrix'}</span>
          </button>

          <button
            onClick={() => setSubSection('users')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              subSection === 'users'
                ? 'bg-[#004a60] text-white shadow-xs'
                : 'text-[#40484d] hover:bg-[#f1f3ff] hover:text-[#004a60]'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>{isArabic ? 'سجل المستخدمين المعتمدين' : 'Team Users Directory'}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                subSection === 'users' ? 'bg-white/20 text-white' : 'bg-[#e8eeff] text-[#004a60]'
              }`}
            >
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setSubSection('security')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              subSection === 'security'
                ? 'bg-[#004a60] text-white shadow-xs'
                : 'text-[#40484d] hover:bg-[#f1f3ff] hover:text-[#004a60]'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>{isArabic ? 'سياسات أمان نفاذ و2FA' : 'Nafath 2FA & Security Policies'}</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {saveSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{saveSuccessMessage}</span>
          </div>
          <button
            onClick={() => setSaveSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* SUBSECTION 1: ROLES & PERMISSION MATRIX (WITH MODEL TABS) */}
      {subSection === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Roles Selection */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#70787d]">
                {isArabic ? 'أدوار النظام والصلاحيات' : 'Roles & Access'}
              </span>
              <button
                onClick={() => setIsCreateRoleModalOpen(true)}
                className="flex items-center gap-1 text-[11px] font-bold text-[#004a60] hover:text-[#074e64] hover:underline cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isArabic ? 'إنشاء دور' : '+ New Role'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {roles.map((role) => {
                const isSelected = role.id === selectedRoleId;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`group relative w-full text-left rounded-xl p-3.5 border transition-all text-xs flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#004a60] shadow-md ring-2 ring-[#004a60]/10'
                        : 'bg-white border-[#e3e8f9] hover:border-[#bfc8cd] hover:bg-[#f9f9ff]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="font-bold text-[#161c27] flex items-center gap-1.5 flex-1 min-w-0">
                        <Shield className={`h-4 w-4 shrink-0 ${isSelected ? 'text-[#004a60]' : 'text-[#70787d]'}`} />
                        <span className="truncate">{isArabic ? role.nameAr : role.name}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!role.isSystem && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                            {isArabic ? 'مخصص' : 'Custom'}
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${role.badgeColor}`}>
                          {role.userCount} users
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#70787d] line-clamp-2 leading-relaxed">
                      {isArabic ? role.descAr : role.desc}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-[#f1f3ff] flex items-center justify-between text-[10px] text-[#70787d]">
                      <span>{role.securityLevel}</span>
                      <div className="flex items-center gap-2">
                        {!role.isSystem && (
                          <button
                            title="Delete custom role"
                            onClick={(e) => handleDeleteCustomRole(role.id, e)}
                            className="text-[#70787d] hover:text-rose-600 transition-colors p-0.5"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {isSelected && <span className="font-bold text-[#004a60]">Active</span>}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Custom Role Card */}
              <button
                onClick={() => setIsCreateRoleModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#004a60]/30 hover:border-[#004a60] bg-white hover:bg-[#004a60]/5 p-3 text-xs font-bold text-[#004a60] transition-all shadow-2xs cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>{isArabic ? 'إنشاء دور جديد مخصص' : '+ Create Custom Role'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Module Tabs & Granular Permissions Matrix */}
          <div className="lg:col-span-3 space-y-4">
            {/* Selected Role Header Card */}
            <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#161c27]">
                    {isArabic ? currentRole.nameAr : currentRole.name}
                  </h3>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${currentRole.badgeColor}`}>
                    {currentRole.securityLevel}
                  </span>
                </div>
                <p className="text-xs text-[#70787d] mt-1 max-w-2xl">
                  {isArabic ? currentRole.descAr : currentRole.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleSavePermissions}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 text-white px-3.5 py-2 text-xs font-bold shadow-xs hover:bg-emerald-700 transition-all"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{isArabic ? 'حفظ الصلاحيات' : 'Save Role Matrix'}</span>
                </button>
              </div>
            </div>

            {/* MODEL TABS BAR (As Requested: "make the permistion based on the models here like tabs") */}
            <div className="bg-white rounded-2xl border border-[#e3e8f9] p-2 shadow-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {MODEL_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeModelTab === tab.id;
                  const count = currentRole.permissionsByModule[tab.id]?.length || 0;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveModelTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                        isActive
                          ? 'bg-[#004a60] text-white shadow-xs font-bold'
                          : 'text-[#40484d] hover:bg-[#f1f3ff] hover:text-[#004a60]'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span>{isArabic ? tab.nameAr : tab.name}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-[#e8eeff] text-[#004a60]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Model Permissions Card & Table */}
            <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#e3e8f9]">
                <div>
                  <h4 className="text-xs font-bold text-[#161c27] flex items-center gap-2">
                    <span>
                      {isArabic
                        ? `صلاحيات موديول: ${MODEL_TABS.find((m) => m.id === activeModelTab)?.nameAr}`
                        : `Module Capabilities: ${MODEL_TABS.find((m) => m.id === activeModelTab)?.name}`}
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      Real-time Sync
                    </span>
                  </h4>
                  <p className="text-[11px] text-[#70787d] mt-0.5">
                    {isArabic
                      ? 'حدد العمليات المصرح بها لهذا الدور (عرض، إنشاء، تعديل، حذف، اعتماد، وتصدير) ونطاق المنشآت.'
                      : 'Toggle CRUD operations, executive approvals, and branch access scope for this role.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => handleBatchGrantModule(true)}
                    className="rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] px-2.5 py-1.5 text-[11px] font-semibold text-[#004a60] hover:bg-[#e8eeff]"
                  >
                    {isArabic ? 'منح الكل' : 'Grant All'}
                  </button>
                  <button
                    onClick={() => handleBatchGrantModule(false)}
                    className="rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-50"
                  >
                    {isArabic ? 'إلغاء الكل' : 'Revoke All'}
                  </button>
                </div>
              </div>

              {/* Permissions Table */}
              {currentPermissions.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#70787d]">
                  No capability rules registered for this module yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#e3e8f9] text-[#70787d] text-[10px] uppercase font-bold tracking-wider">
                        <th className="py-2.5 px-3 min-w-[200px]">
                          {isArabic ? 'الخاصية / الصلاحية' : 'Capability & Feature'}
                        </th>
                        <th className="py-2.5 px-2 text-center">
                          {isArabic ? 'عرض' : 'View'}
                        </th>
                        <th className="py-2.5 px-2 text-center">
                          {isArabic ? 'إنشاء' : 'Create'}
                        </th>
                        <th className="py-2.5 px-2 text-center">
                          {isArabic ? 'تعديل' : 'Edit'}
                        </th>
                        <th className="py-2.5 px-2 text-center">
                          {isArabic ? 'حذف' : 'Delete'}
                        </th>
                        <th className="py-2.5 px-2 text-center">
                          {isArabic ? 'اعتماد' : 'Approve'}
                        </th>
                        <th className="py-2.5 px-2 text-center">
                          {isArabic ? 'تصدير' : 'Export'}
                        </th>
                        <th className="py-2.5 px-3 min-w-[140px]">
                          {isArabic ? 'نطاق الفروع' : 'Branch Scope'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e3e8f9]">
                      {currentPermissions.map((rule) => (
                        <tr key={rule.id} className="hover:bg-[#f9f9ff] transition-colors">
                          {/* Capability Name & Description */}
                          <td className="py-3 px-3">
                            <div className="font-bold text-[#161c27]">
                              {isArabic ? rule.nameAr : rule.name}
                            </div>
                            <div className="text-[11px] text-[#70787d] mt-0.5 leading-snug">
                              {isArabic ? rule.descAr : rule.desc}
                            </div>
                          </td>

                          {/* View */}
                          <td className="py-3 px-2 text-center">
                            <input
                              type="checkbox"
                              checked={rule.view}
                              onChange={() => handleTogglePermission(rule.id, 'view')}
                              className="h-4 w-4 rounded border-gray-300 text-[#004a60] focus:ring-[#004a60] cursor-pointer"
                            />
                          </td>

                          {/* Create */}
                          <td className="py-3 px-2 text-center">
                            <input
                              type="checkbox"
                              checked={rule.create}
                              onChange={() => handleTogglePermission(rule.id, 'create')}
                              className="h-4 w-4 rounded border-gray-300 text-[#004a60] focus:ring-[#004a60] cursor-pointer"
                            />
                          </td>

                          {/* Edit */}
                          <td className="py-3 px-2 text-center">
                            <input
                              type="checkbox"
                              checked={rule.edit}
                              onChange={() => handleTogglePermission(rule.id, 'edit')}
                              className="h-4 w-4 rounded border-gray-300 text-[#004a60] focus:ring-[#004a60] cursor-pointer"
                            />
                          </td>

                          {/* Delete */}
                          <td className="py-3 px-2 text-center">
                            <input
                              type="checkbox"
                              checked={rule.delete}
                              onChange={() => handleTogglePermission(rule.id, 'delete')}
                              className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                            />
                          </td>

                          {/* Approve */}
                          <td className="py-3 px-2 text-center">
                            <input
                              type="checkbox"
                              checked={rule.approve}
                              onChange={() => handleTogglePermission(rule.id, 'approve')}
                              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                          </td>

                          {/* Export */}
                          <td className="py-3 px-2 text-center">
                            <input
                              type="checkbox"
                              checked={rule.export}
                              onChange={() => handleTogglePermission(rule.id, 'export')}
                              className="h-4 w-4 rounded border-gray-300 text-[#004a60] focus:ring-[#004a60] cursor-pointer"
                            />
                          </td>

                          {/* Scope Select */}
                          <td className="py-3 px-3">
                            <select
                              value={rule.scope}
                              onChange={(e) =>
                                handleChangeScope(
                                  rule.id,
                                  e.target.value as 'all' | 'branch' | 'own' | 'none'
                                )
                              }
                              className="w-full rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] py-1 px-2 text-[11px] font-semibold text-[#161c27] focus:border-[#004a60] focus:bg-white focus:outline-hidden"
                            >
                              <option value="all">
                                {isArabic ? 'كافة المنشآت (المملكة)' : 'All Properties (KSA)'}
                              </option>
                              <option value="branch">
                                {isArabic ? 'الفرع المسند فقط' : 'Assigned Branch Only'}
                              </option>
                              <option value="own">
                                {isArabic ? 'سجلات الموظف فقط' : 'Own Records Only'}
                              </option>
                              <option value="none">{isArabic ? 'بدون وصول' : 'No Access'}</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Bottom Quick Save Footer */}
              <div className="pt-3 border-t border-[#e3e8f9] flex items-center justify-between">
                <span className="text-[11px] text-[#70787d]">
                  Changes are applied in real-time to active user sessions across hotel terminals.
                </span>
                <button
                  onClick={handleSavePermissions}
                  className="flex items-center gap-1.5 rounded-xl bg-[#004a60] text-white px-4 py-2 text-xs font-bold shadow-xs hover:bg-[#074e64]"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>
                    {isArabic
                      ? `اعتماد وتثبيت صلاحيات (${currentRole.nameAr})`
                      : `Commit & Save (${currentRole.name})`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBSECTION 2: TEAM USERS DIRECTORY */}
      {subSection === 'users' && (
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#161c27]">
                {isArabic ? 'سجل المستخدمين المعتمدين والمشغلين' : 'Authorized Hospitality Operators & Users'}
              </h3>
              <p className="text-xs text-[#70787d]">
                {isArabic
                  ? 'قائمة الحسابات المفعلة، توثيق النفاذ الوطني، والأدوار المسندة لكل منشأة فندقية.'
                  : 'Active staff accounts, Nafath 2FA verification, and property access scopes.'}
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d]" />
              <input
                type="text"
                value={searchUserQuery}
                onChange={(e) => setSearchUserQuery(e.target.value)}
                placeholder={isArabic ? 'بحث باسم الموظف أو الدور...' : 'Search user, email, role...'}
                className="w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] py-1.5 pl-9 pr-3 text-xs text-[#161c27] focus:border-[#004a60] focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#e3e8f9] text-[#70787d] text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-2.5 px-3">User & Contact</th>
                  <th className="py-2.5 px-3">Assigned Role</th>
                  <th className="py-2.5 px-3">Property / Branch Scope</th>
                  <th className="py-2.5 px-3">Nafath SSO</th>
                  <th className="py-2.5 px-3">Last Active</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8f9]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#f9f9ff] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover border border-[#e3e8f9]"
                        />
                        <div>
                          <div className="font-bold text-[#161c27]">
                            {isArabic ? user.nameAr : user.name}
                          </div>
                          <div className="text-[11px] text-[#70787d]">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-block bg-[#e8eeff] text-[#004a60] font-bold text-[10px] px-2 py-0.5 rounded-full border border-[#004a60]/20">
                        {user.roleName}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-medium text-[#40484d]">
                      {isArabic ? user.propertyScopeAr : user.propertyScope}
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <Check className="h-3 w-3" />
                        Nafath Verified
                      </span>
                    </td>

                    <td className="py-3 px-3 text-[#70787d] text-[11px]">{user.lastLogin}</td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedRoleId(user.roleId);
                          setSubSection('matrix');
                        }}
                        className="text-xs font-bold text-[#004a60] hover:underline"
                      >
                        {isArabic ? 'تعديل الصلاحيات' : 'Edit Matrix'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBSECTION 3: SECURITY & NAFATH POLICIES */}
      {subSection === 'security' && (
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#161c27]">
            {isArabic
              ? 'ضوابط الأمن السيبراني والربط بالنفاذ الوطني الموحد (Nafath)'
              : 'Cybersecurity Policies & Nafath SSO Authentication'}
          </h3>
          <p className="text-xs text-[#70787d]">
            {isArabic
              ? 'الامتثال للضوابط الأساسية للأمن السيبراني (ECC) الصادرة عن الهيئة الوطنية للأمن السيبراني.'
              : 'Enforce National Cybersecurity Authority (NCA) essential controls and ZATCA cryptographic key protection.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#161c27]">Nafath Biometric Login Enforcement</span>
                <p className="text-[11px] text-[#70787d] mt-1">
                  All Super Admins and Financial Controllers must approve access via the Nafath mobile app before signing ZATCA Phase 2 folios.
                </p>
                <div className="mt-2 text-emerald-700 font-bold text-[10px]">Active & Enforced</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] flex items-start gap-3">
              <Lock className="h-5 w-5 text-[#004a60] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#161c27]">ZATCA Hardware Security Module (HSM) Isolation</span>
                <p className="text-[11px] text-[#70787d] mt-1">
                  Cryptographic private keys are never exposed in user sessions. Only approved roles can trigger remote cryptographic signing.
                </p>
                <div className="mt-2 text-[#004a60] font-bold text-[10px]">SOC-2 Type II Certified</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#161c27]">
                {isArabic ? 'دعوة مستخدم ومشغل جديد' : 'Invite Hospitality Team Member'}
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-[#70787d] hover:text-[#161c27]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mohammed Al-Otaibi"
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">Official Work Email</label>
                <input
                  type="email"
                  placeholder="m.otaibi@khetat.sa"
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">Assign Role</label>
                <select className="w-full rounded-xl border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden">
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.securityLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">Property Access Scope</label>
                <select className="w-full rounded-xl border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden">
                  <option>All 142 KSA Properties (Enterprise)</option>
                  <option>Dar Al-Taqwa Luxury Suites Madinah (320 keys)</option>
                  <option>The Chedi Hegra Desert Sanctuary AlUla (42 suites)</option>
                  <option>KAFD Sky Tower Executive Apartments Riyadh (180 keys)</option>
                  <option>Durrat Al-Arous Marina Luxury Chalets Jeddah (36 keys)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Nafath identity verification link will be sent automatically to the employee's National ID.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="rounded-xl border border-[#e3e8f9] px-3.5 py-2 text-xs font-semibold text-[#70787d] hover:bg-[#f1f3ff]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsAddUserModalOpen(false);
                  setSaveSuccessMessage('Invitation dispatched via Nafath SSO!');
                  setTimeout(() => setSaveSuccessMessage(null), 3000);
                }}
                className="rounded-xl bg-[#004a60] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#074e64]"
              >
                Send Nafath Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {isCreateRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-6 max-w-xl w-full shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9]">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#004a60] text-white flex items-center justify-center">
                  <ShieldPlus className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#161c27]">
                    {isArabic ? 'إنشاء دور وصلاحيات جديدة' : 'Create Custom Hospitality Role'}
                  </h3>
                  <p className="text-[11px] text-[#70787d]">
                    {isArabic
                      ? 'حدد اسم الدور، قالب الصلاحيات، ومستوى الأمان لتخصيص صلاحيات الموديولات.'
                      : 'Define role identity, clearance level, and base template to customize permissions across models.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateRoleModalOpen(false)}
                className="text-[#70787d] hover:text-[#161c27] text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Role Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    Role Title (English) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newRoleForm.name}
                    onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
                    placeholder="e.g. Night Auditor, Banquet Lead"
                    className="w-full rounded-xl border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    المسمى الوظيفي للدور (بالعربية) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newRoleForm.nameAr}
                    onChange={(e) => setNewRoleForm({ ...newRoleForm, nameAr: e.target.value })}
                    placeholder="مثال: مدقق الحسابات الليلي، مسؤول الحفلات"
                    dir="rtl"
                    className="w-full rounded-xl border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    Role Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={newRoleForm.desc}
                    onChange={(e) => setNewRoleForm({ ...newRoleForm, desc: e.target.value })}
                    placeholder="Briefly describe what this role manages..."
                    className="w-full rounded-xl border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden resize-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    وصف مهام الدور (بالعربية)
                  </label>
                  <textarea
                    rows={2}
                    value={newRoleForm.descAr}
                    onChange={(e) => setNewRoleForm({ ...newRoleForm, descAr: e.target.value })}
                    placeholder="وصف مختصر لمسؤوليات هذا الدور في المنشأة..."
                    dir="rtl"
                    className="w-full rounded-xl border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden resize-none"
                  />
                </div>
              </div>

              {/* Template Cloning */}
              <div className="p-3.5 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#161c27]">
                  <Copy className="h-4 w-4 text-[#004a60]" />
                  <span>{isArabic ? 'استنساخ قالب الصلاحيات الأساسي' : 'Clone Base Permissions From Existing Role'}</span>
                </div>
                <p className="text-[11px] text-[#70787d]">
                  {isArabic
                    ? 'اختر دوراً موجوداً لنسخ صلاحياته عبر كافة الموديولات لتعديلها لاحقاً بسهولة.'
                    : 'Select a template role to pre-populate permissions across all 13 hospitality modules.'}
                </p>
                <select
                  value={newRoleForm.cloneFromRoleId}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, cloneFromRoleId: e.target.value })}
                  className="w-full rounded-xl border border-[#e3e8f9] bg-white p-2.5 text-xs text-[#161c27] font-semibold focus:border-[#004a60] focus:outline-hidden"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.securityLevel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Initial Permission Preset */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1.5">
                  {isArabic ? 'نوع التهيئة الأولية للصلاحيات' : 'Initial Permissions Strategy'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'template', label: 'Use Template Rules', labelAr: 'مطابق للقالب المختار', desc: 'Pre-set based on selected role' },
                    { id: 'all', label: 'Grant Full Access', labelAr: 'صلاحيات كاملة للكل', desc: 'All CRUD and approvals enabled' },
                    { id: 'readonly', label: 'Strict Read-Only', labelAr: 'قراءة واطلاع فقط', desc: 'View only, no edit or delete' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setNewRoleForm({ ...newRoleForm, permissionPreset: preset.id as any })}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        newRoleForm.permissionPreset === preset.id
                          ? 'border-[#004a60] bg-[#e8eeff] font-bold text-[#004a60]'
                          : 'border-[#e3e8f9] bg-white text-[#40484d] hover:bg-[#f9f9ff]'
                      }`}
                    >
                      <div className="text-[11px]">{isArabic ? preset.labelAr : preset.label}</div>
                      <div className="text-[10px] text-[#70787d] font-normal mt-0.5">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clearance Level & Scope */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'مستوى الأمان والتحقق' : 'Security Clearance Level'}
                  </label>
                  <select
                    value={newRoleForm.securityLevel}
                    onChange={(e) => setNewRoleForm({ ...newRoleForm, securityLevel: e.target.value })}
                    className="w-full rounded-xl border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
                  >
                    <option value="Level 1 (Basic Staff)">Level 1 (Basic Staff - Password Only)</option>
                    <option value="Level 2 (SMS OTP Required)">Level 2 (SMS OTP Required)</option>
                    <option value="Level 3 (Strict Read-Only Audit)">Level 3 (Strict Read-Only Audit)</option>
                    <option value="Level 4 (Nafath Biometric Verified)">Level 4 (Nafath Biometric Verified)</option>
                    <option value="Level 5 (Hardware Security Key)">Level 5 (Hardware Security Key / HSM)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'نطاق الوصول الافتراضي' : 'Default Property Access Scope'}
                  </label>
                  <select
                    value={newRoleForm.defaultScope}
                    onChange={(e) => setNewRoleForm({ ...newRoleForm, defaultScope: e.target.value })}
                    className="w-full rounded-xl border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
                  >
                    <option value="All KSA Properties (Enterprise)">All 142 KSA Properties (Enterprise)</option>
                    <option value="Assigned Regional Cluster">Assigned Regional Cluster (e.g. Western Hub)</option>
                    <option value="Assigned Hotel / Branch Only">Assigned Hotel / Branch Only</option>
                    <option value="Department Only (Front Desk / Accounts)">Department Only</option>
                  </select>
                </div>
              </div>

              {/* Badge Theme Color */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1.5">
                  {isArabic ? 'لون الشارة والتمييز' : 'Role Badge Color'}
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', name: 'Indigo' },
                    { color: 'bg-blue-100 text-blue-800 border-blue-200', name: 'Blue' },
                    { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', name: 'Emerald' },
                    { color: 'bg-amber-100 text-amber-800 border-amber-200', name: 'Amber' },
                    { color: 'bg-teal-100 text-teal-800 border-teal-200', name: 'Teal' },
                    { color: 'bg-purple-100 text-purple-800 border-purple-200', name: 'Purple' },
                    { color: 'bg-rose-100 text-rose-800 border-rose-200', name: 'Rose' },
                  ].map((theme, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewRoleForm({ ...newRoleForm, badgeColor: theme.color })}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${theme.color} ${
                        newRoleForm.badgeColor === theme.color ? 'ring-2 ring-[#004a60] shadow-xs' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3e8f9]">
              <button
                type="button"
                onClick={() => setIsCreateRoleModalOpen(false)}
                className="rounded-xl border border-[#e3e8f9] px-4 py-2 text-xs font-semibold text-[#70787d] hover:bg-[#f1f3ff] cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleCreateRole}
                className="flex items-center gap-1.5 rounded-xl bg-[#004a60] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#074e64] cursor-pointer"
              >
                <ShieldPlus className="h-4 w-4" />
                <span>{isArabic ? 'إنشاء الدور وتخصيص الصلاحيات' : 'Create Role & Customize Tabs'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
