import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { SubscriptionsView } from './views/SubscriptionsView';
import { SitemapModuleView } from './views/SitemapModuleView';
import { SalesOrdersView } from './views/SalesOrdersView';
import { InvoicesView } from './views/InvoicesView';
import { QuotationsView } from './views/QuotationsView';
import { CustomersView } from './views/CustomersView';
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
  INITIAL_QUOTATIONS,
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
  const [currentTenant, setCurrentTenant] = useState<string>('Nuzul Saudi Hospitality OS Hub');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data states
  const [orders, setOrders] = useState<SalesOrder[]>(INITIAL_SALES_ORDERS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [ledgers, setLedgers] = useState<AccountLedger[]>(INITIAL_ACCOUNT_LEDGER);
  const [receipts, setReceipts] = useState<ReceiptVoucher[]>(INITIAL_RECEIPTS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);

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

  // Actions
  const handleToggleLanguage = () => {
    setIsArabic((prev) => !prev);
  };

  const handleSelectView = (view: string, subTab?: string) => {
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
    setQuotations((prev) =>
      prev.map((q) => (q.id === quote.id ? { ...q, status: 'Accepted', convertedSo: newSOId } : q))
    );
    setActiveView('sales_orders');
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
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <Header
          activeView={activeView}
          isArabic={isArabic}
          onToggleLanguage={handleToggleLanguage}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
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
            />
          )}

          {activeView === 'customers' && (
            <CustomersView
              customers={customers}
              isArabic={isArabic}
              onOpenCreateCustomer={() => setIsCreateCustomerOpen(true)}
              onCreateOrderForCustomer={handleCreateOrderForCustomer}
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
            'products',
            'procurement',
            'accounting',
            'hr',
            'reporting',
            'observability',
            'settings',
          ].includes(activeView) && (
            <SitemapModuleView
              module={(activeView === 'organization' ? 'profiles' : activeView) as any}
              subTab={activeView === 'organization' ? 'organization' : activeSubTab}
              isArabic={isArabic}
              onNavigateToInvoice={handleNavigateToInvoice}
              customers={customers}
              onOpenCreateCustomer={() => setIsCreateCustomerOpen(true)}
              onCreateOrderForCustomer={handleCreateOrderForCustomer}
              onNavigateToCustomerMaster={() => setActiveView('customers')}
              suppliers={suppliers}
              onAddSupplier={handleAddSupplier}
              onUpdateSupplier={handleUpdateSupplier}
              onDeleteSupplier={handleDeleteSupplier}
              purchaseOrders={purchaseOrders}
              onAddPurchaseOrder={handleAddPurchaseOrder}
              onUpdatePurchaseOrder={handleUpdatePurchaseOrder}
              onDeletePurchaseOrder={handleDeletePurchaseOrder}
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
            onClick={() => setActiveView('sales_orders')}
            className={`flex flex-col items-center gap-1 text-[10px] ${
              activeView === 'sales_orders' ? 'font-bold text-[#004a60]' : 'text-[#70787d]'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Orders</span>
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
        onAdd={(q) => setQuotations((prev) => [q, ...prev])}
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
