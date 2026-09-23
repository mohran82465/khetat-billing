import React, { useState } from 'react';
import { UsersAndRolesSettings } from '../components/UsersAndRolesSettings';
import { ResponsiveChatSystem } from '../components/ResponsiveChatSystem';
import {
  MultichannelDispatchModal,
  RecipientProfile,
  CommunicationChannel,
} from '../components/MultichannelDispatchModal';
import {
  Users,
  Building,
  Shield,
  MessageSquare,
  MessageCircle,
  Mail,
  Smartphone,
  Package,
  Layers,
  ShoppingBag,
  Calculator,
  Briefcase,
  BarChart3,
  Activity,
  Settings as SettingsIcon,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  Download,
  Hotel,
  ShieldCheck,
  Send,
  FileText,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

interface SitemapModuleViewProps {
  module:
    | 'profiles'
    | 'messaging'
    | 'messages'
    | 'chat'
    | 'products'
    | 'procurement'
    | 'accounting'
    | 'hr'
    | 'reporting'
    | 'observability'
    | 'settings';
  subTab?: string;
  isArabic: boolean;
  onNavigateToInvoice?: (id: string) => void;
}

export const SitemapModuleView: React.FC<SitemapModuleViewProps> = ({
  module,
  subTab,
  isArabic,
}) => {
  // Define tabs for each module strictly matching user's sitemap
  const moduleConfigs: Record<
    string,
    {
      title: string;
      titleAr: string;
      desc: string;
      descAr: string;
      icon: any;
      tabs: { id: string; name: string; nameAr: string; count?: string }[];
    }
  > = {
    profiles: {
      title: 'Profiles & Entities',
      titleAr: 'الملفات التعريفية والمنشآت',
      desc: 'Hospitality company records, branches across Saudi Arabia, and contact directories.',
      descAr: 'سجلات المنشآت الفندقية، فروع المشغلين في المملكة، ودليل جهات الاتصال المعتمدة.',
      icon: Users,
      tabs: [
        { id: 'contacts', name: 'Contacts', nameAr: 'جهات الاتصال', count: '18' },
        { id: 'branches', name: 'Branchs', nameAr: 'الفروع', count: '6' },
        { id: 'organization', name: 'Organization', nameAr: 'المؤسسة والترخيص' },
      ],
    },
    messaging: {
      title: 'Messages & WhatsApp Concierge',
      titleAr: 'الرسائل ومراسلات الواتساب الرسمية',
      desc: 'Official WhatsApp Business API, guest concierge messages, real-time dispatch outbox, automated ZATCA folios, and smart room key PINs.',
      descAr: 'بوابة واتساب الأعمال الرسمية، محادثات ورسائل النزلاء، إشعارات فواتير الزكاة المعتمدة، وتوليد أكواد الأقفال الذكية.',
      icon: MessageCircle,
      tabs: [
        { id: 'inbox', name: 'All Messages', nameAr: 'كافة الرسائل' },
        { id: 'guests', name: 'Guest WhatsApp', nameAr: 'واتساب النزلاء' },
        { id: 'direct', name: 'Direct Messages', nameAr: 'الرسائل المباشرة' },
        { id: 'templates', name: 'ZATCA SMS & Templates', nameAr: 'قوالب رسائل الفواتير والواتساب' },
        { id: 'outbox', name: 'Dispatched Outbox', nameAr: 'سجل الرسائل المرسلة' },
      ],
    },
    messages: {
      title: 'Messages & WhatsApp Concierge',
      titleAr: 'الرسائل ومراسلات الواتساب الرسمية',
      desc: 'Official WhatsApp Business API, guest concierge messages, real-time dispatch outbox, automated ZATCA folios, and smart room key PINs.',
      descAr: 'بوابة واتساب الأعمال الرسمية، محادثات ورسائل النزلاء، إشعارات فواتير الزكاة المعتمدة، وتوليد أكواد الأقفال الذكية.',
      icon: MessageCircle,
      tabs: [
        { id: 'inbox', name: 'All Messages', nameAr: 'كافة الرسائل' },
        { id: 'guests', name: 'Guest WhatsApp', nameAr: 'واتساب النزلاء' },
        { id: 'direct', name: 'Direct Messages', nameAr: 'الرسائل المباشرة' },
        { id: 'templates', name: 'ZATCA SMS & Templates', nameAr: 'قوالب رسائل الفواتير والواتساب' },
        { id: 'outbox', name: 'Dispatched Outbox', nameAr: 'سجل الرسائل المرسلة' },
      ],
    },
    chat: {
      title: 'Chat & Operations',
      titleAr: 'الدردشة ومجموعات العمل الفندقية',
      desc: 'Real-time team chat, operational group channels across properties, and instant chat for another staff or guest.',
      descAr: 'محادثات نصية مباشرة بين فرق العمل، مجموعات التشغيل الفندقي، وميزة محادثة شخص آخر.',
      icon: MessageSquare,
      tabs: [
        { id: 'inbox', name: 'All Chats', nameAr: 'كافة المحادثات' },
        { id: 'direct', name: 'Chat for Another', nameAr: 'محادثة شخص آخر' },
        { id: 'groups', name: 'Group Chats', nameAr: 'مجموعات العمل' },
        { id: 'guests', name: 'Guest Concierge', nameAr: 'كونسيرج النزلاء' },
      ],
    },
    products: {
      title: 'Plans & Service Catalog',
      titleAr: 'الخطط والباقات والخدمات الفندقية',
      desc: 'Room inventory, hospitality add-on packages, banquet hall rental, and Saudi tourism tax configurations.',
      descAr: 'خدمات الغرف والمرافق، باقات الضيافة، قاعات المناسبات، وضبط ضريبة السياحة 5% وضريبة القيمة المضافة 15%.',
      icon: Package,
      tabs: [
        { id: 'catalog', name: 'Catalog', nameAr: 'الكتالوج', count: '24' },
        { id: 'categories', name: 'Categories', nameAr: 'التصنيفات' },
        { id: 'uom', name: 'Units of Measure', nameAr: 'وحدات القياس' },
        { id: 'pricing', name: 'Pricing', nameAr: 'هياكل الأسعار' },
        { id: 'tax_config', name: 'Tax Configuration', nameAr: 'التهيئة الضريبية (ZATCA)' },
      ],
    },
    procurement: {
      title: 'Procurement & Hotel Supplies',
      titleAr: 'المشتريات وتوريد الفنادق',
      desc: 'Hotel linen suppliers, guest amenities, IoT smart lock hardware, and purchase orders.',
      descAr: 'موردي المستلزمات الفندقية، المفروشات، أجهزة الأقفال الذكية، وأوامر الشراء المعتمدة.',
      icon: ShoppingBag,
      tabs: [
        { id: 'suppliers', name: 'Suppliers', nameAr: 'الموردون', count: '12' },
        { id: 'purchase_orders', name: 'Purchase Orders', nameAr: 'أوامر الشراء', count: '8' },
        { id: 'supplier_bills', name: 'Supplier Bills', nameAr: 'فواتير الموردين' },
        { id: 'supplier_payments', name: 'Supplier Payments', nameAr: 'سندات صرف الموردين' },
      ],
    },
    accounting: {
      title: 'Accounting & USALI Ledger',
      titleAr: 'المحاسبة العامة ونظام USALI الفندقي',
      desc: 'Uniform System of Accounts for the Lodging Industry (USALI), journal entries, AR/AP, and cost centers.',
      descAr: 'دليل الحسابات الفندقي المعياري، قيود اليومية، مراكز التكلفة (الغرف، المطاعم، الفعاليات)، والأصول الثابتة.',
      icon: Calculator,
      tabs: [
        { id: 'coa', name: 'Chart of Accounts', nameAr: 'شجرة الحسابات' },
        { id: 'journal', name: 'Journal Entries', nameAr: 'قيود اليومية' },
        { id: 'ar', name: 'Accounts Receivable', nameAr: 'حسابات المدينين' },
        { id: 'ap', name: 'Accounts Payable', nameAr: 'حسابات الدائنين' },
        { id: 'cost_centers', name: 'Cost Centers', nameAr: 'مراكز التكلفة' },
        { id: 'assets', name: 'Fixed Assets', nameAr: 'الأصول الثابتة' },
        { id: 'periods', name: 'Accounting Periods', nameAr: 'الفترات المالية' },
        { id: 'financial_reports', name: 'Financial Reports', nameAr: 'القوائم المالية' },
      ],
    },
    hr: {
      title: 'HR & Hospitality Staff',
      titleAr: 'الموارد البشرية وكوادر الضيافة',
      desc: 'Hotel front office, housekeeping teams, Saudi Saudization quotas (Nitaqat), and GOSI payroll.',
      descAr: 'فرق الاستقبال وخدمة الغرف، متابعة نسب التوطين (نطاقات)، وإعداد مسيرات الرواتب عبر نظام مدد.',
      icon: Briefcase,
      tabs: [
        { id: 'org_structure', name: 'Org Structure', nameAr: 'الهيكل التنظيمي' },
        { id: 'employees', name: 'Employee Records', nameAr: 'سجلات الموظفين', count: '64' },
        { id: 'attendance', name: 'Attendance', nameAr: 'سجلات الحضور والشفتات' },
        { id: 'payroll', name: 'Payroll', nameAr: 'مسيرات الرواتب (GOSI)' },
      ],
    },
    reporting: {
      title: 'Reporting & Analytics Hub',
      titleAr: 'التقارير التحليلية والبيانات المجمعة',
      desc: 'Cross-module RevPAR dashboards, ZATCA tax return reports, and PDF/Excel financial exports.',
      descAr: 'لوحات قياس الإشغال ومعدل العائد لكل غرفة (RevPAR)، إقرارات ضريبة القيمة المضافة، وتصدير التقارير.',
      icon: BarChart3,
      tabs: [
        { id: 'cross_module', name: 'Cross-Module Dashboards', nameAr: 'لوحات القياس المجمعة' },
        { id: 'financial_rep', name: 'Financial Reports', nameAr: 'التقارير المالية' },
        { id: 'operational_rep', name: 'Operational Reports', nameAr: 'التقارير التشغيلية' },
        { id: 'exports', name: 'Exports (PDF/Excel)', nameAr: 'تصدير التقارير الرسمية' },
      ],
    },
    observability: {
      title: 'Observability & ZATCA Gateway Health',
      titleAr: 'المراقبة وسجلات بوابة ZATCA',
      desc: 'Real-time telemetry, ZATCA Phase 2 cryptographic latency, and cloud database audit trail.',
      descAr: 'مراقبة زمن استجابة التوقيع المشفر، سجلات الوصول لنظام الفوترة، ومؤشرات الأداء اللحظية.',
      icon: Activity,
      tabs: [
        { id: 'system_health', name: 'System Health', nameAr: 'سلامة النظام', count: '99.98%' },
        { id: 'logs', name: 'Logs', nameAr: 'سجلات الأحداث' },
        { id: 'metrics', name: 'Performance Metrics', nameAr: 'مؤشرات الأداء' },
        { id: 'audit_trail', name: 'Audit Trail', nameAr: 'سجل التدقيق' },
        { id: 'analytics', name: 'Usage Analytics', nameAr: 'تحليلات الاستخدام' },
      ],
    },
    settings: {
      title: 'Settings & Compliance Config',
      titleAr: 'إعدادات النظام والامتثال',
      desc: 'Company tax credentials, ZATCA CSID onboarding, payment gateways (Mada/Apple Pay), and numbering sequences.',
      descAr: 'بيانات السجل التجاري، أرقام التسلسل للفواتير الضريبية، وبوابات الدفع (مدى، آبل باي، وسداد).',
      icon: SettingsIcon,
      tabs: [
        { id: 'company', name: 'Company Settings', nameAr: 'إعدادات المنشأة' },
        { id: 'users', name: 'Users & Roles', nameAr: 'المستخدمون والصلاحيات' },
        { id: 'tax_financial', name: 'Tax & Financial Settings', nameAr: 'إعدادات الضرائب (ZATCA)' },
        { id: 'numbering', name: 'Numbering Sequences', nameAr: 'تسلسل الترقيم' },
        { id: 'templates', name: 'Templates & Branding', nameAr: 'القوالب والهوية' },
        { id: 'notifications', name: 'Notifications Config', nameAr: 'إعدادات التنبيهات' },
        { id: 'gateways', name: 'Payment Gateway Config', nameAr: 'بوابات الدفع (مدى/سداد)' },
      ],
    },
  };

  const currentConfig = moduleConfigs[module] || moduleConfigs['profiles'];
  const [activeTab, setActiveTab] = useState<string>(
    subTab || currentConfig.tabs[0]?.id || ''
  );

  // Dispatch Modal state for profiles and messaging
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchChannel, setDispatchChannel] = useState<CommunicationChannel>('whatsapp');
  const [preselectedContactIds, setPreselectedContactIds] = useState<string[]>([]);
  const [dispatchNotification, setDispatchNotification] = useState<string | null>(null);

  // Signatory & Customer Contact Profiles
  const [contactProfiles] = useState<RecipientProfile[]>([
    {
      id: 'cp-1',
      name: 'Sheikh Mansour Al-Harbi',
      nameAr: 'الشيخ منصور الحربي',
      company: 'Khetat Hospitality Hub HQ',
      companyAr: 'المقر الرئيسي لمجموعة خطط للضيافة',
      role: 'Executive Director',
      email: 'm.harbi@khetat.sa',
      phone: '+966 50 442 8899',
      outstandingBalance: 142500,
      smartPin: '4910#',
      city: 'Riyadh',
    },
    {
      id: 'cp-2',
      name: 'Eng. Tariq Mansoor',
      nameAr: 'م. طارق منصور',
      company: 'Western Operations Hub',
      companyAr: 'عمليات القطاع الغربي - جدة',
      role: 'Hospitality Solutions Lead',
      email: 'tariq@khetat.sa',
      phone: '+966 55 993 1122',
      outstandingBalance: 28400,
      smartPin: '3012#',
      city: 'Jeddah',
    },
    {
      id: 'cp-3',
      name: 'Layla Al-Otaibi, SOCPA',
      nameAr: 'أ. ليلى العتيبي (محاسب قانوني)',
      company: 'Saudi Hospitality Central Cluster',
      companyAr: 'المجمع الفندقي المركزي بالرياض',
      role: 'Financial Controller',
      email: 'layla@khetat.sa',
      phone: '+966 54 812 9011',
      outstandingBalance: 85200,
      smartPin: '8841#',
      city: 'Riyadh',
    },
    {
      id: 'cp-4',
      name: 'H.E. Sheikh Fahad Al-Saud',
      nameAr: 'معالي الشيخ فهد آل سعود',
      company: 'The Chedi Hegra AlUla (Villa 08)',
      companyAr: 'منتجع الشيدي الحجر بالعلا (فيلا 08)',
      role: 'Royal Delegation Guest',
      email: 'fahad.saud@alriyadh.sa',
      phone: '+966 50 119 4433',
      outstandingBalance: 45000,
      smartPin: '4910#',
      city: 'AlUla',
    },
    {
      id: 'cp-5',
      name: 'Dr. Bandar Al-Husseini',
      nameAr: 'د. بندر الحسيني',
      company: 'Dar Al-Taqwa Suites Madinah',
      companyAr: 'أجنحة دار التقوى الفندقية بالمدينة',
      role: 'Managing Partner',
      email: 'bandar@alhusseini.com.sa',
      phone: '+966 50 662 3311',
      outstandingBalance: 64800,
      smartPin: '5521#',
      city: 'Madinah',
    },
  ]);

  const [selectedContactIds, setSelectedContactIds] = useState<string[]>(['cp-1', 'cp-2']);

  const handleToggleContact = (id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllContacts = () => {
    if (selectedContactIds.length === contactProfiles.length) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(contactProfiles.map((c) => c.id));
    }
  };

  const handleOpenDispatch = (channel: CommunicationChannel, recipientIds?: string[]) => {
    setDispatchChannel(channel);
    setPreselectedContactIds(
      recipientIds && recipientIds.length > 0
        ? recipientIds
        : selectedContactIds.length > 0
        ? selectedContactIds
        : contactProfiles.map((c) => c.id)
    );
    setIsDispatchModalOpen(true);
  };

  React.useEffect(() => {
    if (subTab) {
      setActiveTab(subTab);
    } else {
      setActiveTab(currentConfig.tabs[0]?.id || '');
    }
  }, [subTab, module]);

  const Icon = currentConfig.icon;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f9f9ff] overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-[#e3e8f9] p-5 lg:p-6 shadow-xs shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-[#004a60] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#161c27]">
                  {isArabic ? currentConfig.titleAr : currentConfig.title}
                </h1>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                  ZATCA Phase 2 Ready
                </span>
              </div>
              <p className="text-xs text-[#70787d] mt-0.5">
                {isArabic ? currentConfig.descAr : currentConfig.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff]">
              <Download className="h-3.5 w-3.5" />
              <span>{isArabic ? 'تصدير' : 'Export'}</span>
            </button>
            <button className="flex items-center gap-1.5 rounded-lg bg-[#004a60] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#074e64]">
              <Plus className="h-3.5 w-3.5" />
              <span>{isArabic ? 'إضافة سجل' : 'New Record'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="bg-white border-b border-[#e3e8f9] px-4 lg:px-6 sticky top-0 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {currentConfig.tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#004a60] text-white shadow-xs'
                    : 'text-[#40484d] hover:bg-[#f1f3ff] hover:text-[#004a60]'
                }`}
              >
                <span>{isArabic ? tab.nameAr : tab.name}</span>
                {tab.count && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#e8eeff] text-[#004a60]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Module Content */}
      <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full flex-1">
        {/* PROFILES MODULE */}
        {module === 'profiles' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-[#e3e8f9] p-4 shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#70787d]">
                  Riyadh Headquarters
                </div>
                <div className="text-sm font-bold text-[#161c27] mt-1">Khetat Hospitality Hub HQ</div>
                <p className="text-xs text-[#70787d] mt-1">King Fahd Road, Al-Olaya, Riyadh 12214</p>
                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#e3e8f9]">
                  <span className="text-emerald-700 font-semibold">Active Primary Entity</span>
                  <span className="text-[#70787d]">CR: 1010992812</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#e3e8f9] p-4 shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#70787d]">
                  Western Branch
                </div>
                <div className="text-sm font-bold text-[#161c27] mt-1">Jeddah Waterfront Operations</div>
                <p className="text-xs text-[#70787d] mt-1">Corniche District, Jeddah 23511</p>
                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#e3e8f9]">
                  <span className="text-emerald-700 font-semibold">Hospitality Support Hub</span>
                  <span className="text-[#70787d]">CR: 4030118291</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#e3e8f9] p-4 shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#70787d]">
                  AlUla Heritage Hub
                </div>
                <div className="text-sm font-bold text-[#161c27] mt-1">AlUla Desert & Resort Node</div>
                <p className="text-xs text-[#70787d] mt-1">Wadi Al-Qura, AlUla 43512</p>
                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#e3e8f9]">
                  <span className="text-emerald-700 font-semibold">Desert Luxury Liaison</span>
                  <span className="text-[#70787d]">CR: 3550182910</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e3e8f9] p-5 shadow-xs">
              {/* Header and Multichannel Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#161c27]">
                      {isArabic
                        ? 'جهات الاتصال والمفوضين المعتمدين عبر نفاذ'
                        : 'Authorized Signatories & Nafath Verified Contacts'}
                    </h3>
                    <span className="text-[10px] font-semibold bg-[#e8eeff] text-[#004a60] px-2 py-0.5 rounded-full">
                      {contactProfiles.length} {isArabic ? 'جهات اتصال' : 'Contacts'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#70787d] mt-0.5">
                    {isArabic
                      ? 'إرسال بريد إلكتروني، رسائل نصية قصيرة SMS، أو واتساب فردي أو جماعي (Batch) مع قوالب وتخصيص.'
                      : 'Send regular email, SMS, or WhatsApp to individual or batch contacts with custom templates.'}
                  </p>
                </div>

                {/* Multichannel Dispatch Action Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenDispatch('whatsapp')}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
                    {selectedContactIds.length > 0 && (
                      <span className="bg-emerald-800/60 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                        {selectedContactIds.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDispatch('email')}
                    className="flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>{isArabic ? 'بريد' : 'Email'}</span>
                    {selectedContactIds.length > 0 && (
                      <span className="bg-sky-800/60 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                        {selectedContactIds.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDispatch('sms')}
                    className="flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>{isArabic ? 'رسالة SMS' : 'SMS'}</span>
                    {selectedContactIds.length > 0 && (
                      <span className="bg-amber-800/60 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                        {selectedContactIds.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDispatch('whatsapp')}
                    className="flex items-center gap-1.5 rounded-lg bg-[#004a60] hover:bg-[#074e64] text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isArabic ? 'إرسال جماعي' : 'Batch Send'}</span>
                  </button>
                </div>
              </div>

              {/* Notification Banner */}
              {dispatchNotification && (
                <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{dispatchNotification}</span>
                  </div>
                  <button
                    onClick={() => setDispatchNotification(null)}
                    className="text-emerald-700 hover:text-emerald-900 text-[11px] font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Selection Summary Pill Bar */}
              <div className="mb-2 py-1.5 px-3 rounded-lg bg-[#f9f9ff] border border-[#e3e8f9] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      selectedContactIds.length === contactProfiles.length &&
                      contactProfiles.length > 0
                    }
                    onChange={handleSelectAllContacts}
                    className="rounded text-[#004a60] focus:ring-[#004a60] cursor-pointer"
                  />
                  <span className="font-semibold text-[#161c27]">
                    {selectedContactIds.length === contactProfiles.length
                      ? isArabic
                        ? 'تم تحديد كافة جهات الاتصال'
                        : 'All contacts selected'
                      : isArabic
                      ? `تم تحديد ${selectedContactIds.length} من أصل ${contactProfiles.length}`
                      : `${selectedContactIds.length} of ${contactProfiles.length} selected`}
                  </span>
                </div>
                <div className="text-[11px] text-[#70787d]">
                  {selectedContactIds.length > 0
                    ? isArabic
                      ? 'جاهز للإرسال الفردي أو الجماعي'
                      : 'Ready for individual or batch messaging'
                    : isArabic
                    ? 'حدد جهة اتصال أو أكثر للإرسال'
                    : 'Select one or more to dispatch'}
                </div>
              </div>

              {/* Contacts Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#e3e8f9] text-[#70787d] text-[10px] uppercase font-bold bg-[#f9f9ff]">
                      <th className="py-2.5 px-3 w-8">
                        <span className="sr-only">Select</span>
                      </th>
                      <th className="py-2.5 px-3">{isArabic ? 'الاسم والمنشأة' : 'Name & Entity'}</th>
                      <th className="py-2.5 px-3">{isArabic ? 'الصفة / المنصب' : 'Role & Branch'}</th>
                      <th className="py-2.5 px-3">{isArabic ? 'البريد والهاتف' : 'Email & Phone'}</th>
                      <th className="py-2.5 px-3">{isArabic ? 'كود القفل والرصيد' : 'Key PIN & Balance'}</th>
                      <th className="py-2.5 px-3 text-center">{isArabic ? 'إرسال فوري' : 'Quick Dispatch'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e3e8f9]">
                    {contactProfiles.map((cp) => {
                      const isSelected = selectedContactIds.includes(cp.id);
                      return (
                        <tr
                          key={cp.id}
                          className={`transition-colors hover:bg-[#f1f3ff]/50 ${
                            isSelected ? 'bg-[#e8eeff]/40' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleContact(cp.id)}
                              className="rounded text-[#004a60] focus:ring-[#004a60] cursor-pointer"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-[#161c27]">
                              {isArabic ? cp.nameAr || cp.name : cp.name}
                            </div>
                            <div className="text-[10px] text-[#70787d]">
                              {isArabic ? cp.companyAr || cp.company : cp.company}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-[#40484d]">
                            <div className="font-medium">{cp.role}</div>
                            <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3" />
                              <span>Nafath Verified</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-[#40484d]">
                            <div>{cp.email}</div>
                            <div className="text-[10px] text-[#70787d] font-mono">{cp.phone}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-[#004a60] bg-[#e8eeff] px-1.5 py-0.2 rounded text-[10px]">
                                PIN: {cp.smartPin || '4910#'}
                              </span>
                              <span className="text-[10px] text-[#70787d]">
                                SAR {(cp.outstandingBalance || 0).toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                title="Send WhatsApp"
                                onClick={() => handleOpenDispatch('whatsapp', [cp.id])}
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Send Regular Email"
                                onClick={() => handleOpenDispatch('email', [cp.id])}
                                className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white transition-colors cursor-pointer"
                              >
                                <Mail className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Send SMS"
                                onClick={() => handleOpenDispatch('sms', [cp.id])}
                                className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white transition-colors cursor-pointer"
                              >
                                <Smartphone className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CHAT MODULE (REAL-TIME OPERATIONS CHAT) */}
        {module === 'chat' && (
          <div className="space-y-4">
            <ResponsiveChatSystem
              isArabic={isArabic}
              initialTab={
                activeTab === 'groups'
                  ? 'group'
                  : activeTab === 'direct'
                  ? 'direct'
                  : activeTab === 'guests'
                  ? 'guest'
                  : 'all'
              }
              autoOpenNewDirect={activeTab === 'direct'}
            />
          </div>
        )}

        {/* MESSAGES & WHATSAPP CONCIERGE MODULE */}
        {(module === 'messaging' || (module as string) === 'messages') && (
          <div className="space-y-4">
            {activeTab === 'templates' || activeTab === 'outbox' ? (
              <>
                {/* Top Stat Banners */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-[#e3e8f9] p-4 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#70787d] font-medium">
                    {isArabic ? 'حالة ربط الواتساب الرسمي' : 'Official WhatsApp API'}
                  </div>
                  <div className="text-base font-bold text-[#161c27] flex items-center gap-1.5 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{isArabic ? 'متصل ونشط' : 'Active & Connected'}</span>
                  </div>
                </div>
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  WA
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#e3e8f9] p-4 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#70787d] font-medium">
                    {isArabic ? 'نسبة تسليم فواتير ZATCA' : 'ZATCA Folio Delivery Rate'}
                  </div>
                  <div className="text-base font-bold text-emerald-700 mt-0.5">99.2%</div>
                </div>
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#e3e8f9] p-4 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#70787d] font-medium">
                    {isArabic ? 'أكواد الأقفال الذكية المرسلة' : 'Smart Door PINs Dispatched'}
                  </div>
                  <div className="text-base font-bold text-[#161c27] mt-0.5">1,482 PINs</div>
                </div>
                <div className="h-9 w-9 rounded-xl bg-[#e8eeff] text-[#004a60] flex items-center justify-center">
                  <MessageSquare className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* API Preview & Template Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-[#e3e8f9] p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-[#161c27]">
                      WhatsApp Business Official API
                    </span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Webhook Active
                  </span>
                </div>
                <p className="text-xs text-[#70787d] mb-4">
                  {isArabic
                    ? 'إرسال تلقائي لفواتير المرحلة الثانية من هيئة الزكاة والضريبة والجمارك مع رمز الاستجابة السريعة (QR) وأكواد دخول الفلل والغرف الذكية للنزلاء فور تسجيل الوصول والمغادرة.'
                    : 'Direct automated dispatch of ZATCA Phase 2 QR-code invoices and smart room key PINs to guests via WhatsApp upon check-in and check-out.'}
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#f9f9ff] border border-[#e3e8f9] flex items-center justify-between">
                    <span className="font-semibold text-[#161c27]">Smart Door PIN Auto-Dispatch</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Enabled</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f9f9ff] border border-[#e3e8f9] flex items-center justify-between">
                    <span className="font-semibold text-[#161c27]">ZATCA Cryptographic PDF Attachment</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Instant Push</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#e3e8f9] p-5 shadow-xs">
                <h3 className="text-xs font-bold text-[#161c27] mb-2">
                  {isArabic ? 'معاينة رسائل الواتساب المباشرة' : 'Live WhatsApp Message Preview'}
                </h3>
                <div className="rounded-xl bg-[#e5ddd5] p-3 text-xs text-[#111]">
                  <div className="bg-white rounded-lg p-3 shadow-xs max-w-sm ml-auto space-y-1">
                    <div className="font-bold text-[#004a60]">The Chedi Hegra AlUla</div>
                    <p className="text-[11px] text-gray-800">
                      مرحباً بكم في منتجع الشيدي الحجر. تم تأكيد إقامتكم في فيلا رقم 08.
                      رقم القفل الذكي: <span className="font-mono font-bold text-red-600">4910#</span>
                    </p>
                    <div className="text-[10px] text-emerald-700 font-medium pt-1 border-t border-gray-100 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      <span>فاتورة ZATCA الضريبية المعتمدة مرفقة مع رمز QR.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dispatched Messages Outbox Table */}
            <div className="bg-white rounded-xl border border-[#e3e8f9] shadow-xs overflow-hidden">
              <div className="p-4 border-b border-[#e3e8f9] flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#161c27]">
                    {isArabic ? 'سجل الرسائل المرسلة للنزلاء والعملاء' : 'Guest Dispatched Outbox'}
                  </h3>
                  <p className="text-[11px] text-[#70787d]">
                    {isArabic ? 'تتبع الإرسال التلقائي عبر بوابة الواتساب والرسائل القصيرة' : 'Real-time transmission logs across WhatsApp & SMS gateways'}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#004a60] bg-[#e8eeff] px-2.5 py-1 rounded-lg">
                  {isArabic ? 'تحديث لحظي' : 'Live Gateway'}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f9f9ff] text-[11px] text-[#70787d] font-semibold border-b border-[#e3e8f9]">
                    <tr>
                      <th className="px-4 py-2.5">{isArabic ? 'النزيل / المستلم' : 'Recipient Guest'}</th>
                      <th className="px-4 py-2.5">{isArabic ? 'رقم الجوال' : 'Mobile'}</th>
                      <th className="px-4 py-2.5">{isArabic ? 'القناة' : 'Channel'}</th>
                      <th className="px-4 py-2.5">{isArabic ? 'نوع الرسالة' : 'Template Type'}</th>
                      <th className="px-4 py-2.5">{isArabic ? 'الحالة' : 'Status'}</th>
                      <th className="px-4 py-2.5">{isArabic ? 'الوقت' : 'Time'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e3e8f9]">
                    {[
                      {
                        name: 'Sheikh Fahad Al-Otaibi',
                        nameAr: 'الشيخ فهد العتيبي',
                        phone: '+966 50 119 2831',
                        channel: 'WhatsApp Business',
                        template: 'Smart Lock PIN #4910 + ZATCA Folio',
                        templateAr: 'كود القفل #4910 + فاتورة ZATCA',
                        status: 'Read',
                        statusAr: 'تمت القراءة',
                        time: '2 mins ago',
                      },
                      {
                        name: 'Dr. Sarah Al-Ghamdi',
                        nameAr: 'د. سارة الغامدي',
                        phone: '+966 55 832 9910',
                        channel: 'WhatsApp Business',
                        template: 'Booking Confirmation & Check-in QR',
                        templateAr: 'تأكيد الحجز ورمز QR للوصول',
                        status: 'Delivered',
                        statusAr: 'تم التسليم',
                        time: '18 mins ago',
                      },
                      {
                        name: 'Eng. Tariq Mansoor',
                        nameAr: 'م. طارق منصور',
                        phone: '+966 54 991 4420',
                        channel: 'SMS Gateway',
                        template: 'Monthly Statement & ZATCA Receipt',
                        templateAr: 'كشف الحساب وسند قبض ZATCA',
                        status: 'Sent',
                        statusAr: 'تم الإرسال',
                        time: '1 hour ago',
                      },
                      {
                        name: 'Sultan Al-Qahtani',
                        nameAr: 'سلطان القحطاني',
                        phone: '+966 56 312 8871',
                        channel: 'WhatsApp Business',
                        template: 'Checkout Folio #INV-2026-081',
                        templateAr: 'فاتورة المغادرة #INV-2026-081',
                        status: 'Read',
                        statusAr: 'تمت القراءة',
                        time: '3 hours ago',
                      },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#f1f3ff]/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-[#161c27]">
                          {isArabic ? row.nameAr : row.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-gray-600">{row.phone}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              row.channel.includes('WhatsApp')
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {row.channel}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {isArabic ? row.templateAr : row.template}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-semibold ${
                              row.status === 'Read'
                                ? 'text-blue-600'
                                : row.status === 'Delivered'
                                ? 'text-emerald-600'
                                : 'text-gray-600'
                            }`}
                          >
                            ✓✓ {isArabic ? row.statusAr : row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-[#70787d]">{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            </>
            ) : (
              <ResponsiveChatSystem
                isArabic={isArabic}
                initialTab={
                  activeTab === 'guests'
                    ? 'guest'
                    : activeTab === 'direct'
                    ? 'direct'
                    : 'all'
                }
                autoOpenNewDirect={activeTab === 'direct'}
              />
            )}
          </div>
        )}

        {/* PRODUCTS MODULE */}
        {module === 'products' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Hotel Enterprise OS License', code: 'HOSP-PMS-01', rate: 'SAR 42 / key / mo', tax: '15% VAT + 5% Tourism' },
                { name: 'Luxury Villa Smart Lock IoT Add-on', code: 'HOSP-IOT-02', rate: 'SAR 120 / villa / mo', tax: '15% VAT' },
                { name: 'Unified OTA Channel Manager', code: 'HOSP-OTA-03', rate: 'SAR 450 / property / mo', tax: '15% VAT' },
                { name: 'Banquet & Events Folio Module', code: 'HOSP-BNQ-04', rate: 'SAR 850 / month', tax: '15% VAT + 5% Municipality' },
                { name: 'Direct Booking Engine Widget (0%)', code: 'HOSP-BKG-05', rate: 'SAR 300 / month', tax: '15% VAT' },
                { name: 'ZATCA Cloud HSM Cryptographic Node', code: 'HOSP-HSM-06', rate: 'SAR 500 / month', tax: '15% VAT' },
              ].map((prod, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-[#e3e8f9] p-4 shadow-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#70787d] mb-1">
                    <span>{prod.code}</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">{prod.tax}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#161c27]">{prod.name}</h4>
                  <div className="mt-3 text-sm font-bold text-[#004a60]">{prod.rate}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROCUREMENT MODULE */}
        {module === 'procurement' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-[#e3e8f9] p-5 shadow-xs">
              <h3 className="text-xs font-bold text-[#161c27] mb-3">Approved Hospitality Vendors & Purchase Orders</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#f9f9ff] border border-[#e3e8f9]">
                  <div>
                    <div className="font-bold text-[#161c27]">Assa Abloy Hospitality ME (VingCard RFID & BLE)</div>
                    <div className="text-[11px] text-[#70787d]">PO-HOSP-2026-091 • 500 RFID keycards & IoT gateways</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#161c27]">SAR 48,200</div>
                    <span className="text-emerald-700 font-semibold text-[10px]">Delivered & Matched</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#f9f9ff] border border-[#e3e8f9]">
                  <div>
                    <div className="font-bold text-[#161c27]">Al-Fozan Luxury Hotel Textiles & Linen</div>
                    <div className="text-[11px] text-[#70787d]">PO-HOSP-2026-092 • 5-Star Egyptian cotton sheets for AlUla resort</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#161c27]">SAR 112,500</div>
                    <span className="text-amber-700 font-semibold text-[10px]">Payment Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACCOUNTING MODULE */}
        {module === 'accounting' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-[#e3e8f9] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-[#161c27]">
                  Uniform System of Accounts for the Lodging Industry (USALI)
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  SOC-2 & SAMA Audited
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center mb-4">
                <div className="bg-[#f9f9ff] p-3 rounded-lg border border-[#e3e8f9]">
                  <div className="text-[10px] text-[#70787d] uppercase font-bold">Rooms Revenue (4000)</div>
                  <div className="text-sm font-bold text-emerald-700 mt-1">SAR 12.8M</div>
                </div>
                <div className="bg-[#f9f9ff] p-3 rounded-lg border border-[#e3e8f9]">
                  <div className="text-[10px] text-[#70787d] uppercase font-bold">F&B Outlets (4100)</div>
                  <div className="text-sm font-bold text-[#161c27] mt-1">SAR 3.4M</div>
                </div>
                <div className="bg-[#f9f9ff] p-3 rounded-lg border border-[#e3e8f9]">
                  <div className="text-[10px] text-[#70787d] uppercase font-bold">ZATCA VAT Output (2100)</div>
                  <div className="text-sm font-bold text-[#004a60] mt-1">SAR 2.43M</div>
                </div>
                <div className="bg-[#f9f9ff] p-3 rounded-lg border border-[#e3e8f9]">
                  <div className="text-[10px] text-[#70787d] uppercase font-bold">Tourism 5% Fee (2150)</div>
                  <div className="text-sm font-bold text-purple-700 mt-1">SAR 810K</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HR MODULE */}
        {module === 'hr' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-[#e3e8f9] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-[#161c27]">
                  Hospitality Workforce & Saudization (Nitaqat Platinum)
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Saudization: 42.8% (Platinum Tier)
                </span>
              </div>
              <p className="text-xs text-[#70787d] mb-4">
                Tracking 64 staff members across front office reception, concierge, housekeeping, and night audit operations.
              </p>
            </div>
          </div>
        )}

        {/* REPORTING MODULE */}
        {module === 'reporting' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-[#e3e8f9] p-5 shadow-xs">
              <h3 className="text-xs font-bold text-[#161c27] mb-2">Hospitality Executive Reports</h3>
              <p className="text-xs text-[#70787d] mb-4">
                Export one-click ZATCA Phase 2 Fatoora tax summaries, guest folio logs, RevPAR analyses, and Ministry of Tourism statutory filings.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button className="flex items-center justify-between p-3 rounded-xl border border-[#e3e8f9] hover:bg-[#f9f9ff] text-left">
                  <div>
                    <div className="text-xs font-bold text-[#161c27]">ZATCA Phase 2 Tax Audit File (XML & Hash)</div>
                    <div className="text-[11px] text-[#70787d]">All 42,190 cleared folios with cryptographic signatures</div>
                  </div>
                  <Download className="h-4 w-4 text-[#004a60]" />
                </button>
                <button className="flex items-center justify-between p-3 rounded-xl border border-[#e3e8f9] hover:bg-[#f9f9ff] text-left">
                  <div>
                    <div className="text-xs font-bold text-[#161c27]">Saudi Tourism Authority Monthly Return</div>
                    <div className="text-[11px] text-[#70787d]">Occupancy, average room rate (ADR), and 5% municipality calculation</div>
                  </div>
                  <Download className="h-4 w-4 text-[#004a60]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OBSERVABILITY MODULE */}
        {module === 'observability' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-[#e3e8f9] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[#161c27]">ZATCA Cryptographic Stamp Gateway Telemetry</h3>
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <span className="font-mono text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                  Latency: 142ms • Uptime: 99.99%
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#f9f9ff] border border-[#e3e8f9]">
                  <span className="text-[#70787d]">CSID Cryptographic Handshake</span>
                  <div className="text-base font-bold text-emerald-700 mt-1">Pass (All Nodes)</div>
                </div>
                <div className="p-3 rounded-lg bg-[#f9f9ff] border border-[#e3e8f9]">
                  <span className="text-[#70787d]">OTA Real-Time Sync Lag</span>
                  <div className="text-base font-bold text-[#004a60] mt-1">&lt; 1.2 seconds</div>
                </div>
                <div className="p-3 rounded-lg bg-[#f9f9ff] border border-[#e3e8f9]">
                  <span className="text-[#70787d]">Security Audit Status</span>
                  <div className="text-base font-bold text-purple-700 mt-1">SOC-2 Type II Certified</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS MODULE */}
        {module === 'settings' && (
          <div className="space-y-4">
            {activeTab === 'users' && <UsersAndRolesSettings isArabic={isArabic} />}

            {activeTab === 'company' && (
              <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9]">
                  <div>
                    <h3 className="text-sm font-bold text-[#161c27]">
                      {isArabic ? 'بيانات المنشأة الفندقية والترخيص' : 'Hospitality Entity & Tourism Licensing'}
                    </h3>
                    <p className="text-xs text-[#70787d]">
                      {isArabic
                        ? 'السجل التجاري، ترخيص وزارة السياحة، والعنوان الوطني المعتمد.'
                        : 'Commercial registration, Ministry of Tourism license, and verified National Address.'}
                    </p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Verified CR
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff]">
                    <span className="text-[#70787d] text-[10px] uppercase font-bold">CR Number (السجل التجاري)</span>
                    <div className="font-bold text-[#161c27] text-sm mt-0.5">1010992812</div>
                    <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Riyadh Chamber of Commerce</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff]">
                    <span className="text-[#70787d] text-[10px] uppercase font-bold">Ministry of Tourism License</span>
                    <div className="font-bold text-[#161c27] text-sm mt-0.5">MOT-KSA-2024-8841</div>
                    <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">5-Star Luxury & Serviced Accommodation</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff]">
                    <span className="text-[#70787d] text-[10px] uppercase font-bold">VAT Identification (الرقم الضريبي)</span>
                    <div className="font-mono font-bold text-[#004a60] text-sm mt-0.5">310294819200003</div>
                    <span className="text-[11px] text-[#70787d] mt-1 block">ZATCA Phase 2 Fatoora Registered</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff]">
                    <span className="text-[#70787d] text-[10px] uppercase font-bold">National Address (العنوان الوطني)</span>
                    <div className="font-bold text-[#161c27] text-xs mt-0.5">7421 King Fahd Road, Al-Olaya, Riyadh 12214-3810</div>
                    <span className="text-[11px] text-[#70787d] mt-1 block">Short Code: RNKA7421</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tax_financial' && (
              <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9]">
                  <div>
                    <h3 className="text-sm font-bold text-[#161c27]">
                      {isArabic ? 'إعدادات الضرائب والربط مع ZATCA' : 'Tax & ZATCA Phase 2 Cryptographic Config'}
                    </h3>
                    <p className="text-xs text-[#70787d]">
                      {isArabic
                        ? 'مفاتيح CSID المشفرة، ضريبة القيمة المضافة 15%، ورسوم السياحة والبلدية 5%.'
                        : 'Production CSID compliance, cryptographic timestamps, and tourism fee tax engines.'}
                    </p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    CSID Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff]">
                    <span className="text-[#70787d]">Standard VAT</span>
                    <div className="text-base font-bold text-[#161c27] mt-1">15.0%</div>
                    <span className="text-[10px] text-emerald-700 font-semibold">Standard KSA Rate</span>
                  </div>
                  <div className="p-3 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff]">
                    <span className="text-[#70787d]">Municipal & Tourism Tax</span>
                    <div className="text-base font-bold text-[#004a60] mt-1">5.0%</div>
                    <span className="text-[10px] text-[#70787d]">Applied to Accommodation Folios</span>
                  </div>
                  <div className="p-3 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff]">
                    <span className="text-[#70787d]">SADAD Biller Code</span>
                    <div className="text-base font-bold text-purple-700 mt-1">204</div>
                    <span className="text-[10px] text-emerald-700 font-semibold">Direct Debit Connected</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'numbering' && (
              <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#161c27]">
                  {isArabic ? 'تسلسل ترقيم الفواتير والسندات' : 'Document Numbering Sequences'}
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                    <span className="font-bold text-[#161c27]">ZATCA Tax Invoices</span>
                    <span className="font-mono text-[#004a60] font-bold">INV-2026-{'[00000]'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                    <span className="font-bold text-[#161c27]">Guest Room Folios</span>
                    <span className="font-mono text-[#004a60] font-bold">FOLIO-2026-{'[00000]'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                    <span className="font-bold text-[#161c27]">Receipt Vouchers</span>
                    <span className="font-mono text-[#004a60] font-bold">RCP-2026-{'[00000]'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-[#161c27]">
                  {isArabic ? 'هوية الفواتير وقوالب الطباعة' : 'Branding & Bilingual Folio Templates'}
                </h3>
                <p className="text-xs text-[#70787d]">
                  Bilingual English/Arabic layouts with cryptographic QR code compliant with ZATCA Phase 2 resolution.
                </p>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-[#161c27]">
                  {isArabic ? 'إعدادات التنبيهات والرسائل' : 'WhatsApp & SMS Dispatch Triggers'}
                </h3>
                <p className="text-xs text-[#70787d]">
                  Automatic WhatsApp check-in PIN dispatch, booking confirmations, and ZATCA tax receipt delivery.
                </p>
              </div>
            )}

            {activeTab === 'gateways' && (
              <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#161c27]">
                  {isArabic ? 'بوابات الدفع الإلكتروني بالمملكة' : 'Saudi Payment Gateway Integrations'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff]">
                    <span className="font-bold text-[#161c27]">Mada & Apple Pay (HyperPay / Tap)</span>
                    <p className="text-[11px] text-[#70787d] mt-1">Instant settlement with local Saudi debit cards and Apple Pay tokens.</p>
                    <span className="text-emerald-700 font-bold text-[10px] mt-2 block">Live Production Mode</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff]">
                    <span className="font-bold text-[#161c27]">SADAD Bill Presentment & Payment (EBPP)</span>
                    <p className="text-[11px] text-[#70787d] mt-1">B2B enterprise corporate accounts receive invoice SADAD bill numbers.</p>
                    <span className="text-emerald-700 font-bold text-[10px] mt-2 block">Connected (Code 204)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Multichannel Dispatch Modal for Email, SMS, WhatsApp */}
      <MultichannelDispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        isArabic={isArabic}
        initialChannel={dispatchChannel}
        allRecipients={contactProfiles}
        initialSelectedRecipientIds={preselectedContactIds}
        onDispatchSuccess={({ channel, count, templateName }) => {
          setDispatchNotification(
            isArabic
              ? `تم بنجاح إرسال "${templateName}" إلى ${count} جهة اتصال عبر ${channel.toUpperCase()}`
              : `Dispatched "${templateName}" to ${count} recipient(s) via ${channel.toUpperCase()} successfully.`
          );
        }}
      />
    </div>
  );
};
