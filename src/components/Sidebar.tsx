import React, { useState } from 'react';
import {
  LayoutDashboard,
  CreditCard,
  UserCheck,
  Layers,
  MessageSquare,
  Package,
  CheckSquare,
  ShoppingBag,
  Calculator,
  Briefcase,
  BarChart3,
  Activity,
  Settings,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  X,
  FileText,
  FileCheck2,
  Receipt,
  Users,
  Calendar,
  Tag,
  History,
  Bell,
  Building,
  Contact,
  Boxes,
  Percent,
  ListTodo,
  FolderKanban,
  UserPlus,
  Timer,
  Truck,
  FileSpreadsheet,
  Banknote,
  BookOpen,
  PieChart,
  DollarSign,
  Building2,
  Lock,
  Radio,
  Sliders,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  activeSubTab?: string;
  onSelectView: (view: string, subTab?: string) => void;
  isArabic: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavSubItem {
  id: string;
  name: string;
  nameAr: string;
  badge?: string;
}

interface NavSection {
  id: string;
  name: string;
  nameAr: string;
  icon: any;
  badge?: string;
  children?: NavSubItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  activeSubTab,
  onSelectView,
  isArabic,
  isOpenMobile,
  onCloseMobile,
}) => {
  // Navigation structure strictly matching the user's sitemap
  const navSections: NavSection[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      nameAr: 'لوحة التحكم',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      id: 'subscriptions',
      name: 'Subscriptions',
      nameAr: 'الاشتراكات',
      icon: CreditCard,
      badge: 'Hotels',
      children: [
        { id: 'subscriptions_plans', name: 'Subscriptions', nameAr: 'باقات الاشتراك' },
        { id: 'subscriptions_cycles', name: 'Billing Cycles', nameAr: 'دورات الفوترة' },
        { id: 'subscriptions_active', name: 'Active Subscriptions', nameAr: 'الاشتراكات النشطة', badge: '8' },
        { id: 'subscriptions_coupons', name: 'Coupons & Discounts', nameAr: 'الكوبونات والخصومات' },
        { id: 'subscriptions_lifecycle', name: 'Lifecycle History', nameAr: 'سجل دورة الحياة' },
        { id: 'subscriptions_reminders', name: 'Renewal Reminders', nameAr: 'تذكيرات التجديد', badge: '4' },
      ],
    },
    {
      id: 'profiles',
      name: 'Profiles',
      nameAr: 'الملفات التعريفية',
      icon: UserCheck,
      children: [
        { id: 'contacts', name: 'Contacts', nameAr: 'جهات الاتصال' },
        { id: 'branches', name: 'Branchs', nameAr: 'الفروع' },
        { id: 'organization', name: 'Organization', nameAr: 'المؤسسة والترخيص' },
      ],
    },
    {
      id: 'sales',
      name: 'Sales',
      nameAr: 'المبيعات',
      icon: Layers,
      children: [
        { id: 'customers', name: 'Customers', nameAr: 'العملاء', badge: '5' },
        { id: 'quotations', name: 'Quotations', nameAr: 'عروض الأسعار', badge: '5' },
        { id: 'sales_orders', name: 'Sales Orders', nameAr: 'أوامر البيع', badge: '5' },
        { id: 'invoices', name: 'Invoices', nameAr: 'فواتير المبيعات', badge: 'ZATCA' },
        { id: 'receipts', name: 'Receipts', nameAr: 'سندات القبض', badge: '5' },
        { id: 'balances', name: 'Balances & Reports', nameAr: 'الأرصدة والتقارير' },
      ],
    },
    {
      id: 'messaging',
      name: 'Messaging',
      nameAr: 'المراسلات',
      icon: MessageSquare,
      badge: 'WhatsApp',
    },
    {
      id: 'products',
      name: 'Products',
      nameAr: 'المنتجات والخدمات',
      icon: Package,
      children: [
        { id: 'catalog', name: 'Catalog', nameAr: 'الكتالوج' },
        { id: 'categories', name: 'Categories', nameAr: 'التصنيفات' },
        { id: 'uom', name: 'Units of Measure', nameAr: 'وحدات القياس' },
        { id: 'pricing', name: 'Pricing', nameAr: 'الأسعار' },
        { id: 'tax_config', name: 'Tax Configuration', nameAr: 'التهيئة الضريبية' },
      ],
    },
    {
      id: 'task_manager',
      name: 'Task manger',
      nameAr: 'إدارة المهام',
      icon: CheckSquare,
      badge: '6',
      children: [
        { id: 'task_list', name: 'task List', nameAr: 'قائمة المهام' },
        { id: 'task_catalog', name: 'Task Catalog', nameAr: 'كتالوج المهام' },
        { id: 'task_assignment', name: 'Task Assignment', nameAr: 'إسناد المهام' },
        { id: 'members', name: 'Members', nameAr: 'أعضاء الفريق' },
        { id: 'billable_work', name: 'Billable Work Tracking', nameAr: 'تتبع العمل المفوتر' },
      ],
    },
    {
      id: 'procurement',
      name: 'Procurement',
      nameAr: 'المشتريات',
      icon: ShoppingBag,
      children: [
        { id: 'suppliers', name: 'Suppliers', nameAr: 'الموردون' },
        { id: 'purchase_orders', name: 'Purchase Orders', nameAr: 'أوامر الشراء' },
        { id: 'supplier_bills', name: 'Supplier Bills', nameAr: 'فواتير الموردين' },
        { id: 'supplier_payments', name: 'Supplier Payments', nameAr: 'سندات صرف الموردين' },
      ],
    },
    {
      id: 'accounting',
      name: 'Accounting',
      nameAr: 'المحاسبة',
      icon: Calculator,
      children: [
        { id: 'coa', name: 'Chart of Accounts', nameAr: 'شجرة الحسابات' },
        { id: 'journal', name: 'Journal Entries', nameAr: 'قيود اليومية' },
        { id: 'ar', name: 'Accounts Receivable', nameAr: 'حسابات المدينين' },
        { id: 'ap', name: 'Accounts Payable', nameAr: 'حسابات الدائنين' },
        { id: 'cost_centers', name: 'Cost Centers', nameAr: 'مراكز التكلفة' },
        { id: 'assets', name: 'Fixed Assets', nameAr: 'الأصول الثابتة' },
        { id: 'periods', name: 'Accounting Periods', nameAr: 'الفترات المالية' },
        { id: 'financial_reports', name: 'Financial Reports', nameAr: 'التقارير المالية' },
      ],
    },
    {
      id: 'hr',
      name: 'HR',
      nameAr: 'الموارد البشرية',
      icon: Briefcase,
      children: [
        { id: 'org_structure', name: 'Org Structure', nameAr: 'الهيكل التنظيمي' },
        { id: 'employees', name: 'Employee Records', nameAr: 'سجلات الموظفين' },
        { id: 'attendance', name: 'Attendance', nameAr: 'الحضور والانصراف' },
        { id: 'payroll', name: 'Payroll', nameAr: 'مسيرات الرواتب' },
      ],
    },
    {
      id: 'reporting',
      name: 'Reporting',
      nameAr: 'التقارير',
      icon: BarChart3,
      children: [
        { id: 'cross_module', name: 'Cross-Module Dashboards', nameAr: 'لوحات القياس المجمعة' },
        { id: 'financial_rep', name: 'Financial Reports', nameAr: 'التقارير المالية' },
        { id: 'operational_rep', name: 'Operational Reports', nameAr: 'التقارير التشغيلية' },
        { id: 'exports', name: 'Exports (PDF/Excel)', nameAr: 'تصدير التقارير' },
      ],
    },
    {
      id: 'observability',
      name: 'Observability',
      nameAr: 'المراقبة',
      icon: Activity,
      children: [
        { id: 'system_health', name: 'System Health', nameAr: 'سلامة النظام' },
        { id: 'logs', name: 'Logs', nameAr: 'سجلات الأحداث' },
        { id: 'metrics', name: 'Performance Metrics', nameAr: 'مؤشرات الأداء' },
        { id: 'audit_trail', name: 'Audit Trail', nameAr: 'سجل التدقيق' },
        { id: 'analytics', name: 'Usage Analytics', nameAr: 'تحليلات الاستخدام' },
      ],
    },
    {
      id: 'settings',
      name: 'Settings',
      nameAr: 'الإعدادات',
      icon: Settings,
      children: [
        { id: 'company', name: 'Company Settings', nameAr: 'إعدادات المنشأة' },
        { id: 'users', name: 'Users & Roles', nameAr: 'المستخدمون والصلاحيات' },
        { id: 'tax_financial', name: 'Tax & Financial Settings', nameAr: 'إعدادات الضرائب' },
        { id: 'numbering', name: 'Numbering Sequences', nameAr: 'تسلسل الترقيم' },
        { id: 'templates', name: 'Templates & Branding', nameAr: 'القوالب والهوية' },
        { id: 'notifications', name: 'Notifications Config', nameAr: 'إعدادات التنبيهات' },
        { id: 'gateways', name: 'Payment Gateway Config', nameAr: 'بوابات الدفع' },
      ],
    },
  ];

  // Map sub-views to their parent section
  const getParentSectionId = (view: string): string => {
    if (['sales_orders', 'invoices', 'quotations', 'customers', 'receipts', 'balances'].includes(view)) {
      return 'sales';
    }
    if (['projects', 'tasks', 'task_manager'].includes(view)) {
      return 'task_manager';
    }
    return view;
  };

  // State to track expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    subscriptions: true,
    sales: true,
    task_manager: false,
    profiles: false,
    products: false,
    procurement: false,
    accounting: false,
    hr: false,
    reporting: false,
    observability: false,
    settings: false,
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleSelectParent = (section: NavSection) => {
    if (!section.children || section.children.length === 0) {
      onSelectView(section.id);
      onCloseMobile();
    } else {
      // Toggle accordion
      toggleSection(section.id);
      // Select the first child or default view if clicked
      const firstChild = section.children[0];
      if (section.id === 'subscriptions') {
        onSelectView('subscriptions', 'subscriptions_active');
      } else if (section.id === 'sales') {
        onSelectView('sales_orders');
      } else if (section.id === 'task_manager') {
        onSelectView('projects', 'task_list');
      } else {
        onSelectView(section.id, firstChild.id);
      }
    }
  };

  const handleSelectChild = (sectionId: string, childId: string) => {
    if (sectionId === 'sales') {
      // Direct sales views
      onSelectView(childId);
    } else if (sectionId === 'task_manager') {
      onSelectView('projects', childId);
    } else {
      onSelectView(sectionId, childId);
    }
    onCloseMobile();
  };

  const currentParentId = getParentSectionId(activeView);

  const logoUrl =
    'https://lh3.googleusercontent.com/aida/AEtjO1XayKSu3Zv0cbkLTIE3dTIRhYbdXX5_-2FhPxTSvYr0eCJRK2J7J931dywKtFpYjWt_GBd95W_bps3zr2y8mUycZVrS5c0UlTx66BD_7BAGHPkfG22vPzp93aTuMS7aQYekUkZ1thcLyYgNruKToyodbdavsSxvAPMUGb10J_1f87_qT-_vDUJ9XuVJFbeTwM6Mfe172GJ5B7_H9yyVYlrkg55shSOXxIk6qUBu9Ynf0oowDgc_UkaFtXMuZeHygeuMDQGv1L4XGw';

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white border-r border-[#e3e8f9] w-64">
      {/* Brand Header */}
      <div className="flex flex-col shrink-0">
        <div className="flex h-16 items-center justify-between px-4 border-b border-[#e3e8f9]">
          <div className="flex items-center gap-2.5">
            <img
              src={logoUrl}
              alt="Khetat Logo"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <div className="font-bold text-[#004a60] text-sm tracking-tight leading-tight flex items-center gap-1.5">
                KHETAT
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 py-0.2">
                  KSA
                </span>
              </div>
              <div className="text-[10px] font-semibold text-[#70787d] uppercase tracking-wider truncate max-w-[140px]">
                Hospitality OS
              </div>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onCloseMobile}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#70787d] hover:bg-[#f1f3ff] lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation Tree - Sitemap Exact Hierarchy */}
      <div className="px-3 py-3 space-y-1 overflow-y-auto flex-1 text-xs">
        {navSections.map((section) => {
          const Icon = section.icon;
          const hasChildren = section.children && section.children.length > 0;
          const isExpanded = !!expandedSections[section.id];
          const isParentActive = currentParentId === section.id;

          return (
            <div key={section.id} className="space-y-0.5">
              {/* Parent item */}
              <button
                onClick={() => handleSelectParent(section)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 font-semibold transition-all ${
                  isParentActive && !hasChildren
                    ? 'bg-[#004a60] text-white shadow-xs'
                    : isParentActive && hasChildren
                    ? 'text-[#004a60] bg-[#f1f3ff] font-bold'
                    : 'text-[#40484d] hover:bg-[#f1f3ff] hover:text-[#004a60]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isParentActive && !hasChildren
                        ? 'text-white'
                        : isParentActive
                        ? 'text-[#004a60]'
                        : 'text-[#70787d]'
                    }`}
                  />
                  <span className="truncate text-left">{isArabic ? section.nameAr : section.name}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {section.badge && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                        section.badge === 'Hotels' || section.badge === 'Live'
                          ? 'bg-emerald-100 text-emerald-800'
                          : section.badge === 'WhatsApp'
                          ? 'bg-emerald-500 text-white'
                          : isParentActive && !hasChildren
                          ? 'bg-white/20 text-white'
                          : 'bg-[#e8eeff] text-[#004a60]'
                      }`}
                    >
                      {section.badge}
                    </span>
                  )}
                  {hasChildren && (
                    <span className="text-[#70787d] p-0.5">
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </button>

              {/* Sub items rendered hierarchically */}
              {hasChildren && isExpanded && (
                <div className="space-y-0.5 pl-5 border-l border-[#e3e8f9] ml-4 my-1">
                  {section.children!.map((child) => {
                    let isChildActive = false;

                    if (section.id === 'sales') {
                      isChildActive = activeView === child.id;
                    } else if (section.id === 'subscriptions') {
                      isChildActive =
                        activeView === 'subscriptions' &&
                        (activeSubTab === child.id ||
                          (!activeSubTab && child.id === 'subscriptions_active'));
                    } else if (section.id === 'task_manager') {
                      isChildActive =
                        activeView === 'projects' &&
                        (activeSubTab === child.id || (!activeSubTab && child.id === 'task_list'));
                    } else {
                      isChildActive =
                        activeView === section.id &&
                        (activeSubTab === child.id ||
                          (!activeSubTab && child.id === section.children![0].id));
                    }

                    return (
                      <button
                        key={child.id}
                        onClick={() => handleSelectChild(section.id, child.id)}
                        className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[11px] font-medium transition-all ${
                          isChildActive
                            ? 'bg-[#e8eeff] font-bold text-[#004a60]'
                            : 'text-[#50585e] hover:bg-[#f1f3ff] hover:text-[#161c27]'
                        }`}
                      >
                        <span className="truncate text-left">{isArabic ? child.nameAr : child.name}</span>
                        {child.badge && (
                          <span
                            className={`rounded-full px-1.5 py-0.2 text-[8px] font-bold ${
                              child.badge === 'ZATCA'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-[#e8eeff] text-[#004a60]'
                            }`}
                          >
                            {child.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="border-t border-[#e3e8f9] p-3 bg-[#f9f9ff] shrink-0">
        <div className="flex items-center gap-2 rounded-lg border border-[#e3e8f9] bg-white p-2.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#161c27]">ZATCA Phase 2</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="truncate text-[9px] text-[#70787d]">Saudi Hospitality Gateway</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0">{sidebarContent}</aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 flex w-64 max-w-xs flex-1 flex-col animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
