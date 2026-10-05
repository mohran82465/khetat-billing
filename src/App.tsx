import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { SubscriptionsView } from './views/SubscriptionsView';
import { SitemapModuleView } from './views/SitemapModuleView';
import { SalesOrdersView } from './views/SalesOrdersView';
import { InvoicesView } from './views/InvoicesView';
import { QuotationsView } from './views/QuotationsView';
import { BalancesReportsView } from './views/BalancesReportsView';
import { ReceiptsView } from './views/ReceiptsView';
import { ProjectsTasksView } from './views/ProjectsTasksView';
import { ResponsiveChatSystem } from './components/ResponsiveChatSystem';
import { CustomerMessagingView } from './views/CustomerMessagingView';
import { UserProfileModal } from './components/UserProfileModal';
import {
  CreateSalesOrderModal,
  CreateInvoiceModal,
  CreateQuotationModal,
  CreateReceiptModal,
  CreateCustomerModal,
} from './components/TransactionModals';
import {
  INITIAL_SALES_ORDERS,
  INITIAL_INVOICES,
  getStoredInvoices,
  saveStoredInvoices,
  INITIAL_QUOTATIONS,
  getStoredQuotations,
  saveStoredQuotations,
  INITIAL_CUSTOMERS,
  INITIAL_ACCOUNT_LEDGER,
  INITIAL_RECEIPTS,
  INITIAL_TASKS,
  INITIAL_SUPPLIERS,
  SalesOrder,
  Invoice,
  Quotation,
  Customer,
  ReceiptVoucher,
  AccountLedger,
  TaskItem,
  Supplier,
  PurchaseOrder,
  INITIAL_PURCHASE_ORDERS,
  SupplierBill,
  INITIAL_SUPPLIER_BILLS,
  SupplierPayment,
  INITIAL_SUPPLIER_PAYMENTS,
} from './data/mockData';
import {
  LayoutDashboard,
  CreditCard,
  Layers,
  FileText,
  FileCheck2,
  Receipt,
  Users,
  BarChart3,
  CheckSquare,
  Menu,
} from 'lucide-react';

export function App() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<string>('subscriptions_active');
  const [isArabic, setIsArabic] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('khetat_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [currentTenant, setCurrentTenant] = useState<string>('Nuzul Saudi Hospitality OS Hub');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data states
  const [orders, setOrders] = useState<SalesOrder[]>(INITIAL_SALES_ORDERS);
  const [invoices, setInvoices] = useState<Invoice[]>(() => getStoredInvoices());
  const [quotations, setQuotations] = useState<Quotation[]>(() => getStoredQuotations());
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [ledgers, setLedgers] = useState<AccountLedger[]>(INITIAL_ACCOUNT_LEDGER);
  const [receipts, setReceipts] = useState<ReceiptVoucher[]>(INITIAL_RECEIPTS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [bills, setBills] = useState<SupplierBill[]>(INITIAL_SUPPLIER_BILLS);
  const [payments, setPayments] = useState<SupplierPayment[]>(INITIAL_SUPPLIER_PAYMENTS);

  // Modals
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isCreateQuotationOpen, setIsCreateQuotationOpen] = useState(false);
  const [isCreateReceiptOpen, setIsCreateReceiptOpen] = useState(false);
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [receiptPreselectedInvoice, setReceiptPreselectedInvoice] = useState<Invoice | null>(null);

  // Apply direction to HTML element on language change
  useEffect(() => {
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
  }, [isArabic]);

  // Sidebar collapse toggle handler with persistence
  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('khetat_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleToggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Actions
  const handleToggleLanguage = () => {
    setIsArabic((prev) => !prev);
  };

  const handleSelectView = (view: string, subTab?: string) => {
    if (view === 'customers') {
      setActiveView('organization');
      setActiveSubTab(subTab || 'contacts');
      return;
    }
    if (view === 'crm') {
      setActiveView('organization');
      setActiveSubTab('organization');
      return;
    }
    if (view === 'operators' || view === 'mudabbir') {
      setActiveView('organization');
      setActiveSubTab(subTab || 'organization');
      return;
    }
    if (view === 'properties' || view === 'branches') {
      setActiveView('organization');
      setActiveSubTab('branches');
      return;
    }
    if (view === 'guests' || view === 'diyafa') {
      setActiveView('organization');
      setActiveSubTab(subTab || 'guests');
      return;
    }
    if (view === 'corporate' || view === 'guest_hub' || view === 'diyafa_guests' || view === 'diyafa_corporates') {
      setActiveView('organization');
      setActiveSubTab(subTab || (view === 'corporate' || view === 'diyafa_corporates' ? 'corporate' : 'guests'));
      return;
    }
    if (view === 'plans' || view === 'catalog') {
      setActiveView('products');
      setActiveSubTab('catalog');
      return;
    }
    if (view === 'tiers' || view === 'categories') {
      setActiveView('products');
      setActiveSubTab('categories');
      return;
    }
    if (view === 'tax_financial') {
      setActiveView('settings');
      setActiveSubTab('tax_financial');
      return;
    }
    setActiveView(view);
    if (subTab) {
      setActiveSubTab(subTab);
    }
  };

  const handleNavigateToInvoice = (orderOrInvId: string) => {
    setActiveView('invoices');
  };

  const handleRecordPaymentForInvoice = (invoice: Invoice) => {
    setReceiptPreselectedInvoice(invoice);
    setIsCreateReceiptOpen(true);
  };

  const handleConvertToSalesOrder = (quote: Quotation) => {
    const newSOId = `SO-2024-${Math.floor(1050 + Math.random() * 50)}`;
    const newOrder: SalesOrder = {
      id: newSOId,
      poNumber: `PO-${quote.customerInitials}-AUTO`,
      customer: quote.customer,
      customerAr: quote.customer,
      industry: 'Hospitality Management',
      tier: 'Tier-1 Enterprise',
      quotationRef: quote.id,
      orderDate: '24 Oct 2024',
      provisionSlaDate: '07 Nov 2024',
      totalAmountNet: quote.totalNet,
      vatAmount: quote.vatAmount,
      totalWithVat: quote.grandTotal,
      fulfillmentPercent: 15,
      fulfillmentStatus: 'In Progress',
      invoicingStatus: 'Uninvoiced',
      slaLevel: 'High Availability 99.95%',
      paymentTerms: 'Net 30 Days',
      cloudTenant: {
        domain: `${quote.customer.toLowerCase().replace(/[^a-z0-9]/g, '')}.khetatcloud.com`,
        cluster: 'Saudi Sovereign Cloud',
        allocatedSeats: 250,
        totalSeats: 250,
        status: 'Provisioning',
      },
      milestones: [
        {
          title: 'Quotation Converted & Approved',
          subtitle: `Automated conversion from ${quote.id}`,
          status: 'completed',
          stepNumber: 1,
        },
        {
          title: 'ZATCA Compliance Handshake',
          subtitle: 'In progress',
          status: 'current',
          stepNumber: 2,
        },
        {
          title: 'Service Go-Live',
          subtitle: 'Scheduled',
          status: 'pending',
          stepNumber: 3,
        },
      ],
      poDocument: 'Signed_eAgreement.pdf',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setQuotations((prev) => {
      const updated = prev.map((q) =>
        q.id === quote.id ? { ...q, status: 'Accepted' as const, convertedSo: newSOId } : q
      );
      saveStoredQuotations(updated);
      return updated;
    });
    setActiveView('sales_orders');
  };

  const handleConvertToInvoice = (quote: Quotation) => {
    const newInvId = `INV-2024-${Math.floor(1080 + Math.random() * 850)}`;
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const dueDateStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const lineItems = quote.items && quote.items.length > 0
      ? quote.items.map((it) => ({
          description: it.title,
          descriptionAr: quote.planNameAr ? `${quote.planNameAr} — ${quote.tierNameAr || ''}` : it.title,
          subtitle: it.scope,
          qty: it.propertiesCount || quote.propertiesCount || 1,
          unitPrice: Math.round((it.price / (it.propertiesCount || quote.propertiesCount || 1)) * 100) / 100,
          subtotal: it.price,
        }))
      : [
          {
            description: `${quote.planName || 'Commercial Plan'} — ${quote.tierName || 'Standard Tier'}`,
            descriptionAr: `${quote.planNameAr || 'الباقة التجارية'} — ${quote.tierNameAr || 'المستوى'}`,
            subtitle: `${quote.propertiesCount || 1} units subscription (${quote.id})`,
            qty: quote.propertiesCount || 1,
            unitPrice: Math.round((quote.totalNet / (quote.propertiesCount || 1)) * 100) / 100,
            subtotal: quote.totalNet,
          },
        ];

    const newInvoice: Invoice = {
      id: newInvId,
      codeType: '0100000',
      type: 'Tax Invoice',
      typeAr: 'فاتورة ضريبية',
      buyerName: quote.customer,
      buyerNameAr: quote.customer,
      buyerTrn: quote.trnNumber || '310491827100003',
      buyerAddress: 'Riyadh, Kingdom of Saudi Arabia',
      issueDate: todayStr,
      dueDate: dueDateStr,
      taxableAmount: quote.totalNet,
      vatAmount: quote.vatAmount,
      totalAmount: quote.grandTotal,
      zatcaStatus: 'Cleared',
      zatcaHash: `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      zatcaUuid: `urn:uuid:${Math.random().toString(36).substring(2, 10)}-${Date.now()}`,
      settlementStatus: 'Unpaid',
      settlementMethod: 'SADAD / B2B Wire',
      lineItems,
    };

    setInvoices((prev) => {
      const updated = [newInvoice, ...prev];
      saveStoredInvoices(updated);
      return updated;
    });

    setQuotations((prev) => {
      const updated = prev.map((q) =>
        q.id === quote.id ? { ...q, status: 'Accepted' as const, convertedSo: newInvId } : q
      );
      saveStoredQuotations(updated);
      return updated;
    });

    setActiveView('invoices');
  };

  const handleCreateOrderForCustomer = (customer: Customer) => {
    setIsCreateOrderOpen(true);
  };

  const handleSendDunningNotice = (account: AccountLedger) => {
    alert(
      isArabic
        ? `تم إرسال إشعار تذكير بالسداد للمنشأة: ${account.name} (المبلغ المستحق: SAR ${account.totalOutstanding.toLocaleString()})`
        : `Dunning reminder dispatched to ${account.name} (Outstanding: SAR ${account.totalOutstanding.toLocaleString()})`
    );
  };

  const handleAddTask = (newTask: TaskItem) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTaskStatus = (
    taskId: string,
    newStatus: 'todo' | 'in_progress' | 'review' | 'completed'
  ) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleAddSupplier = (newSupplier: Supplier) => {
    setSuppliers((prev) => [newSupplier, ...prev]);
  };

  const handleUpdateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === updatedSupplier.id ? updatedSupplier : s))
    );
  };

  const handleDeleteSupplier = (supplierId: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== supplierId));
  };

  const handleAddPurchaseOrder = (newPO: PurchaseOrder) => {
    setPurchaseOrders((prev) => [newPO, ...prev]);
  };

  const handleUpdatePurchaseOrder = (updatedPO: PurchaseOrder) => {
    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === updatedPO.id ? updatedPO : p))
    );
  };

  const handleDeletePurchaseOrder = (poId: string) => {
    setPurchaseOrders((prev) => prev.filter((p) => p.id !== poId));
  };

  const handleAddBill = (newBill: SupplierBill) => {
    setBills((prev) => [newBill, ...prev]);
  };

  const handleUpdateBill = (updatedBill: SupplierBill) => {
    setBills((prev) =>
      prev.map((b) => (b.id === updatedBill.id ? updatedBill : b))
    );
  };

  const handleDeleteBill = (billId: string) => {
    setBills((prev) => prev.filter((b) => b.id !== billId));
  };

  const handleAddPayment = (newPayment: SupplierPayment) => {
    setPayments((prev) => [newPayment, ...prev]);
  };

  const handleDeletePayment = (paymentId: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== paymentId));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f9f9ff] text-[#161c27] font-sans antialiased">
      {/* Sidebar Navigation matching sitemap */}
      <Sidebar
        activeView={activeView}
        activeSubTab={activeSubTab}
        onSelectView={handleSelectView}
        isArabic={isArabic}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0 transition-all duration-300">
        {/* Top Header */}
        <Header
          activeView={activeView}
          isArabic={isArabic}
          onToggleLanguage={handleToggleLanguage}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
          currentTenant={currentTenant}
          onChangeTenant={setCurrentTenant}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* View Routing */}
        <main className="flex-1 flex overflow-hidden">
          {/* Dashboard */}
          {activeView === 'dashboard' && (
            <DashboardView isArabic={isArabic} onNavigate={handleSelectView} />
          )}

          {/* Subscriptions */}
          {activeView === 'subscriptions' && (
            <SubscriptionsView
              isArabic={isArabic}
              subTab={activeSubTab}
              onSubTabChange={setActiveSubTab}
            />
          )}

          {/* Sales Modules */}
          {activeView === 'sales_orders' && (
            <SalesOrdersView
              orders={orders}
              isArabic={isArabic}
              onOpenCreateModal={() => setIsCreateOrderOpen(true)}
              onNavigateToInvoice={handleNavigateToInvoice}
            />
          )}

          {activeView === 'invoices' && (
            <InvoicesView
              invoices={invoices}
              isArabic={isArabic}
              onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)}
              onRecordPayment={handleRecordPaymentForInvoice}
            />
          )}

          {activeView === 'quotations' && (
            <QuotationsView
              quotations={quotations}
              isArabic={isArabic}
              onOpenCreateQuotation={() => setIsCreateQuotationOpen(true)}
              onConvertToSalesOrder={handleConvertToSalesOrder}
              onConvertToInvoice={handleConvertToInvoice}
            />
          )}

          {activeView === 'balances' && (
            <BalancesReportsView
              ledgers={ledgers}
              isArabic={isArabic}
              onSendDunning={handleSendDunningNotice}
            />
          )}

          {activeView === 'receipts' && (
            <ReceiptsView
              receipts={receipts}
              isArabic={isArabic}
              onOpenCreateReceipt={() => {
                setReceiptPreselectedInvoice(null);
                setIsCreateReceiptOpen(true);
              }}
              onNavigateToInvoice={handleNavigateToInvoice}
            />
          )}

          {/* Task Manager / Projects */}
          {(activeView === 'projects' || activeView === 'task_manager') && (
            <ProjectsTasksView
              tasks={tasks}
              activeSubTab={activeSubTab}
              onChangeSubTab={(tab) => setActiveSubTab(tab)}
              isArabic={isArabic}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          )}

          {/* Real-time Hospitality Team & Direct Chat */}
          {activeView === 'chat' && (
            <div className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col min-w-0">
              <ResponsiveChatSystem isArabic={isArabic} />
            </div>
          )}

          {/* Multichannel Customer Messaging (Email, SMS, WhatsApp) */}
          {['messaging', 'messages'].includes(activeView) && (
            <CustomerMessagingView
              isArabic={isArabic}
              onNavigateToInvoice={handleNavigateToInvoice}
            />
          )}

          {/* Remaining sitemap modules */}
          {[
            'profiles',
            'organization',
            'guest_hub',
            'products',
            'procurement',
            'accounting',
            'hr',
            'reporting',
            'observability',
            'settings',
          ].includes(activeView) && (
            <SitemapModuleView
              module={(activeView === 'profiles' ? 'organization' : activeView) as any}
              subTab={activeSubTab}
              isArabic={isArabic}
              onNavigateToModule={(mod, tab) => handleSelectView(mod, tab)}
              onNavigateToInvoice={handleNavigateToInvoice}
              suppliers={suppliers}
              onAddSupplier={handleAddSupplier}
              onUpdateSupplier={handleUpdateSupplier}
              onDeleteSupplier={handleDeleteSupplier}
              purchaseOrders={purchaseOrders}
              onAddPurchaseOrder={handleAddPurchaseOrder}
              onUpdatePurchaseOrder={handleUpdatePurchaseOrder}
              onDeletePurchaseOrder={handleDeletePurchaseOrder}
              bills={bills}
              onAddBill={handleAddBill}
              onUpdateBill={handleUpdateBill}
              onDeleteBill={handleDeleteBill}
              payments={payments}
              onAddPayment={handleAddPayment}
              onDeletePayment={handleDeletePayment}
            />
          )}
        </main>

        {/* Mobile Quick Bottom Navigation Bar */}
        <nav className="flex lg:hidden items-center justify-around border-t border-[#e3e8f9] bg-white py-2 px-1 z-20 shrink-0">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex flex-col items-center gap-1 text-[10px] ${
              activeView === 'dashboard' ? 'font-bold text-[#004a60]' : 'text-[#70787d]'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => {
              setActiveView('subscriptions');
              setActiveSubTab('subscriptions_active');
            }}
            className={`flex flex-col items-center gap-1 text-[10px] ${
              activeView === 'subscriptions' ? 'font-bold text-[#004a60]' : 'text-[#70787d]'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>Subs</span>
          </button>
          <button
            onClick={() => setActiveView('quotations')}
            className={`flex flex-col items-center gap-1 text-[10px] ${
              activeView === 'quotations' ? 'font-bold text-[#004a60]' : 'text-[#70787d]'
            }`}
          >
            <FileCheck2 className="h-4 w-4" />
            <span>Quotes</span>
          </button>
          <button
            onClick={() => setActiveView('invoices')}
            className={`flex flex-col items-center gap-1 text-[10px] ${
              activeView === 'invoices' ? 'font-bold text-[#004a60]' : 'text-[#70787d]'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Invoices</span>
          </button>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex flex-col items-center gap-1 text-[10px] text-[#70787d]"
          >
            <Menu className="h-4 w-4" />
            <span>Menu</span>
          </button>
        </nav>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        isArabic={isArabic}
      />

      {/* Creation Transaction Modals */}
      <CreateSalesOrderModal
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
        isArabic={isArabic}
        onAdd={(so) => setOrders((prev) => [so, ...prev])}
        customers={customers}
      />

      <CreateInvoiceModal
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
        isArabic={isArabic}
        onAdd={(inv) => setInvoices((prev) => [inv, ...prev])}
        customers={customers}
      />

      <CreateQuotationModal
        isOpen={isCreateQuotationOpen}
        onClose={() => setIsCreateQuotationOpen(false)}
        isArabic={isArabic}
        onAdd={(q) => {
          setQuotations((prev) => {
            const updated = [q, ...prev];
            saveStoredQuotations(updated);
            return updated;
          });
        }}
        customers={customers}
      />

      <CreateReceiptModal
        isOpen={isCreateReceiptOpen}
        onClose={() => setIsCreateReceiptOpen(false)}
        isArabic={isArabic}
        onAdd={(r) => {
          setReceipts((prev) => [r, ...prev]);
          if (r.allocatedInvoice.startsWith('INV')) {
            setInvoices((prev) =>
              prev.map((inv) =>
                inv.id === r.allocatedInvoice ? { ...inv, settlementStatus: 'Paid' } : inv
              )
            );
          }
        }}
        invoices={invoices}
        preselectedInvoice={receiptPreselectedInvoice}
      />

      <CreateCustomerModal
        isOpen={isCreateCustomerOpen}
        onClose={() => setIsCreateCustomerOpen(false)}
        isArabic={isArabic}
        onAdd={(c) => setCustomers((prev) => [c, ...prev])}
      />
    </div>
  );
}

export default App;
