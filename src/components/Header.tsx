import React, { useState } from 'react';
import {
  Search,
  Bell,
  Globe,
  ChevronDown,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Menu,
  ShieldCheck,
  User,
  Settings,
  LogOut,
  X,
} from 'lucide-react';

interface HeaderProps {
  activeView: string;
  isArabic: boolean;
  onToggleLanguage: () => void;
  onOpenMobileMenu: () => void;
  currentTenant: string;
  onChangeTenant: (tenant: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  isArabic,
  onToggleLanguage,
  onOpenMobileMenu,
  currentTenant,
  onChangeTenant,
  searchQuery,
  onSearchChange,
  onOpenProfile,
}) => {
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: isArabic ? 'تم اعتماد فاتورة ZATCA Phase 2' : 'ZATCA Clearance Approved',
      desc: isArabic ? 'INV-2024-3382 تم ختمها بنجاح بتوقيع إلكتروني معتمد' : 'INV-2024-3382 cleared with cryptographic stamp',
      time: '10m ago',
      type: 'success',
    },
    {
      id: 2,
      title: isArabic ? 'تنبيه تجاوز حد الائتمان (92%)' : 'Credit Limit Alert (92%)',
      desc: isArabic ? 'شركة أرامكو هورايزونز اقتربت من السقف الائتماني' : 'Aramco Horizons Tech approaching credit limit',
      time: '1h ago',
      type: 'warning',
    },
    {
      id: 3,
      title: isArabic ? 'دفعة سداد غير مطابقة' : 'Unallocated SADAD Payment',
      desc: isArabic ? 'سند قبض RCT-2024-0517 بحاجة لتخصيص فاتورة' : 'RCT-2024-0517 (SAR 45,000) awaits invoice matching',
      time: '2h ago',
      type: 'info',
    },
  ];

  const tenants = [
    'Nuzul Saudi Hospitality OS Hub',
    'Dar Al-Taqwa Madinah & Suites',
    'Al-Hokair Tourism & Resorts Group',
    'Khetat Enterprise Cloud Hub',
  ];

  const getBreadcrumbTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return isArabic ? 'لوحة التحكم / المنظومة الفندقية' : 'Dashboard / Hospitality Overview';
      case 'subscriptions':
        return isArabic ? 'الاشتراكات / باقات الضيافة والفوترة' : 'Subscriptions / Hospitality OS Plans & Billing';
      case 'profiles':
      case 'organization':
        return isArabic ? 'المؤسسة والمنشآت / الفروع والجهات المعتمدة' : 'Organization / Hospitality Branches & Signatories';
      case 'sales_orders':
        return isArabic ? 'المبيعات / أوامر البيع' : 'Sales / Sales Orders';
      case 'invoices':
        return isArabic ? 'المبيعات / فواتير المبيعات الضريبية' : 'Sales / Tax Invoices & ZATCA Portal';
      case 'quotations':
        return isArabic ? 'المبيعات / عروض الأسعار' : 'Sales / Quotations Pipeline';
      case 'customers':
        return isArabic ? 'المؤسسة والمنشآت / إدارة العملاء والحسابات' : 'Organization / Customers & Accounts';
      case 'balances':
        return isArabic ? 'المبيعات / تقارير الأرصدة والتقادم' : 'Sales / Balances & Aging Reports';
      case 'receipts':
        return isArabic ? 'المبيعات / سندات القبض والدفع' : 'Sales / Receipts & Official Vouchers';
      case 'chat':
        return isArabic ? 'الدردشة / المحادثات والعمليات ومحادثة شخص آخر' : 'Chat / Operations & Direct Messages';
      case 'messaging':
      case 'messages':
        return isArabic ? 'الرسائل / مراسلات الواتساب والتنبيهات والفواتير' : 'Messages / WhatsApp Concierge & Notifications';
      case 'products':
      case 'plans':
        return isArabic ? 'الخطط والباقات / كتالوج الفنادق والضرائب' : 'Plans / Hospitality Catalog & Tax Rates';
      case 'projects':
      case 'task_manager':
        return isArabic ? 'إدارة المهام / كتالوج وقوالب المهام الفندقية' : 'Task Manager / Task Catalog & Sprint Board';
      case 'procurement':
        return isArabic ? 'المشتريات / توريد المستلزمات والأقفال' : 'Procurement / Hotel Supplies & Hardware';
      case 'accounting':
        return isArabic ? 'المحاسبة / شجرة الحسابات ونظام USALI' : 'Accounting / USALI Lodging Standard & General Ledger';
      case 'hr':
        return isArabic ? 'الموارد البشرية / فرق الفنادق ونطاقات' : 'HR / Hospitality Staff & Saudization';
      case 'reporting':
        return isArabic ? 'التقارير / مؤشرات RevPAR وإقرارات الزكاة' : 'Reporting / RevPAR & ZATCA Returns';
      case 'observability':
        return isArabic ? 'المراقبة / صحة بوابة ZATCA وسجلات السحاب' : 'Observability / ZATCA Gateway Health & Telemetry';
      case 'settings':
        return isArabic ? 'الإعدادات / تهيئة المنشأة وبوابات الدفع' : 'Settings / Company & Payment Gateways';
      default:
        return isArabic ? 'لوحة التحكم المؤسسية' : 'Hospitality OS Hub';
    }
  };

  const getSubTitleText = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Operating system for Saudi hospitality. Hotels, villas, and apartments.';
      case 'subscriptions':
        return 'Subscription management & ZATCA recurring billing for Saudi hospitality';
      case 'invoices':
        return 'ZATCA Phase 2 Fatoora Cryptographic Invoicing';
      case 'sales_orders':
        return 'B2B Sales Orders & Property Fulfillment';
      case 'quotations':
        return 'Commercial Hospitality Quotations & e-Sign';
      case 'customers':
        return 'Hospitality Operator Master & National Address';
      case 'balances':
        return 'Folio Ledger & Debt Aging Analysis';
      case 'receipts':
        return 'Official Payment Receipts & SADAD Vouchers';
      case 'projects':
      case 'task_manager':
        return 'Enterprise Tasks & Property Go-Live Milestones';
      default:
        return 'ZATCA-compliant Saudi Hospitality Cloud Platform';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#e3e8f9] bg-white px-4 lg:px-6 shadow-xs">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e3e8f9] text-[#40484d] hover:bg-[#f1f3ff] lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-[#70787d]">
            <span className="font-semibold text-[#004a60]">Khetat Cloud</span>
            <span>/</span>
            <span className="truncate max-w-[200px] sm:max-w-none">{getBreadcrumbTitle()}</span>
          </div>
          <span className="text-sm font-bold text-[#161c27] hidden sm:inline">
            {getSubTitleText()}
          </span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="relative hidden md:flex items-center w-72 lg:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#70787d] pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={isArabic ? 'بحث في الفواتير، الأوامر، العملاء...' : 'Search invoices, orders, clients, CRN...'}
          className="w-full rounded-full border border-[#bfc8cd]/60 bg-[#f9f9ff] py-1.5 pl-9 pr-4 text-xs font-medium text-[#161c27] placeholder-[#70787d] transition-all focus:border-[#004a60] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#004a60]/20"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#70787d] hover:text-[#161c27]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Tenant Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowTenantMenu(!showTenantMenu)}
            className="flex items-center gap-2 rounded-lg border border-[#e3e8f9] bg-[#f1f3ff] px-2.5 py-1.5 text-xs font-semibold text-[#004a60] transition-colors hover:bg-[#e8eeff]"
          >
            <Building2 className="h-3.5 w-3.5 text-[#004a60]" />
            <span className="hidden sm:inline truncate max-w-[130px]">{currentTenant}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#70787d]" />
          </button>

          {showTenantMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[#e3e8f9] bg-white p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#70787d]">
                {isArabic ? 'المؤسسة النشطة' : 'Switch Organization Tenant'}
              </div>
              {tenants.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    onChangeTenant(t);
                    setShowTenantMenu(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    currentTenant === t
                      ? 'bg-[#e8eeff] font-bold text-[#004a60]'
                      : 'text-[#40484d] hover:bg-[#f1f3ff]'
                  }`}
                >
                  <span className="truncate">{t}</span>
                  {currentTenant === t && <CheckCircle2 className="h-3.5 w-3.5 text-[#004a60]" />}
                </button>
              ))}
              <div className="mt-1 border-t border-[#e3e8f9] pt-1 px-3 py-1.5 text-[10px] text-[#70787d] flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                <span>ZATCA TRN: 310144928100003</span>
              </div>
            </div>
          )}
        </div>

        {/* Language Toggle */}
        <button
          onClick={onToggleLanguage}
          title={isArabic ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
          className="flex items-center gap-1.5 rounded-lg border border-[#e3e8f9] px-2.5 py-1.5 text-xs font-semibold text-[#40484d] hover:bg-[#f1f3ff] transition-colors"
        >
          <Globe className="h-3.5 w-3.5 text-[#004a60]" />
          <span>{isArabic ? 'English' : 'عربي'}</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#e3e8f9] text-[#40484d] hover:bg-[#f1f3ff] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ba1a1a] text-[9px] font-bold text-white">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[#e3e8f9] bg-white shadow-xl z-50 p-2">
              <div className="flex items-center justify-between border-b border-[#e3e8f9] px-3 py-2">
                <span className="text-xs font-bold text-[#161c27]">
                  {isArabic ? 'إشعارات النظام' : 'System Notifications'}
                </span>
                <span className="rounded-full bg-[#e8eeff] px-2 py-0.5 text-[10px] font-bold text-[#004a60]">
                  3 {isArabic ? 'جديد' : 'New'}
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#f1f3ff]">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-[#f9f9ff] transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1.5">
                        {n.type === 'success' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                        {n.type === 'warning' && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                        {n.type === 'info' && <ShieldCheck className="h-3.5 w-3.5 text-[#004a60]" />}
                        <span className="text-xs font-semibold text-[#161c27]">{n.title}</span>
                      </div>
                      <span className="text-[10px] text-[#70787d]">{n.time}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#40484d]">{n.desc}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#e3e8f9] p-2 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-[#004a60] hover:underline"
                >
                  {isArabic ? 'تعليم الكل كمقروء' : 'Mark all as read'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-full border border-[#e3e8f9] p-0.5 pr-2 transition-all hover:ring-2 hover:ring-[#004a60]/20"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#004a60] text-xs font-bold text-white shadow-xs">
              TM
            </div>
            <div className="hidden text-left xl:block">
              <div className="text-xs font-bold text-[#161c27] leading-none">Eng. Tariq Mansoor</div>
              <div className="text-[10px] text-[#70787d] leading-tight">Billing Lead & Architect</div>
            </div>
            <ChevronDown className="h-3 w-3 text-[#70787d] hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#e3e8f9] bg-white p-1.5 shadow-xl z-50">
              <div className="border-b border-[#e3e8f9] px-3 py-2.5">
                <div className="text-xs font-bold text-[#161c27]">Tariq Al-Mansoor</div>
                <div className="text-[11px] text-[#70787d]">tariq@khetat.sa</div>
                <span className="mt-1.5 inline-block rounded-sm bg-emerald-50 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase text-emerald-700">
                  {isArabic ? 'مدير نظام معتمد' : 'Authorized Signatory'}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenProfile();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#40484d] hover:bg-[#f1f3ff]"
              >
                <User className="h-3.5 w-3.5 text-[#70787d]" />
                <span>{isArabic ? 'الملف الشخصي والشهادات' : 'User Profile & ZATCA Certs'}</span>
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenProfile();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#40484d] hover:bg-[#f1f3ff]"
              >
                <Settings className="h-3.5 w-3.5 text-[#70787d]" />
                <span>{isArabic ? 'إعدادات المنشأة' : 'Tenant Security & CSID'}</span>
              </button>
              <div className="my-1 border-t border-[#e3e8f9]" />
              <button
                onClick={() => setShowUserMenu(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#ba1a1a] hover:bg-[#ffdad6]/40"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{isArabic ? 'تسجيل الخروج' : 'Sign Out'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
