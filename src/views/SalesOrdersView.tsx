import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Download,
  Server,
  FileCheck,
  ChevronRight,
  X,
  Send,
  MoreVertical,
} from 'lucide-react';
import { SalesOrder } from '../data/mockData';

interface SalesOrdersViewProps {
  orders: SalesOrder[];
  isArabic: boolean;
  onOpenCreateModal: () => void;
  onNavigateToInvoice: (orderId: string) => void;
}

export const SalesOrdersView: React.FC<SalesOrdersViewProps> = ({
  orders,
  isArabic,
  onOpenCreateModal,
  onNavigateToInvoice,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(orders[0] || null);
  const [filterStatus, setFilterStatus] = useState<'All' | 'In Progress' | 'Fulfilled' | 'Pending Approval'>('All');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'All' || o.fulfillmentStatus === filterStatus;
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.customerAr.includes(search) ||
      o.poNumber.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map((o) => o.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Banner / KPIs */}
      <div className="p-4 lg:p-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#161c27]">
              {isArabic ? 'أوامر البيع والتنفيذ' : 'Sales Orders & Service Fulfillment'}
            </h1>
            <p className="text-xs text-[#70787d] mt-1">
              {isArabic
                ? 'إدارة أوامر الشراء المعتمدة، سلاسل التوريد السحابية، وربط الفوترة الإلكترونية المرحلة الثانية'
                : 'Manage approved customer POs, multi-tenant cloud provisioning, and ZATCA Phase 2 billing milestones.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 rounded-lg bg-[#004a60] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#074e64] transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? '+ أمر بيع جديد' : '+ New Sales Order'}</span>
            </button>
          </div>
        </div>

        {/* Bento Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'إجمالي خط الأوامر' : 'Active Pipeline Value'}</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-[#161c27]">
              SAR 1,628,075
            </div>
            <div className="mt-1 flex items-center text-[11px] text-emerald-700">
              <span className="font-semibold">+14.2%</span>
              <span className="text-[#70787d] ml-1">vs last month</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'قيد التنفيذ' : 'In Progress Orders'}</span>
              <Clock className="h-4 w-4 text-[#004a60]" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-[#161c27]">
              3 Orders
            </div>
            <div className="mt-1 text-[11px] text-[#70787d]">
              78% Avg SLA Fulfillment Index
            </div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'أوامر غير مفوترة' : 'Uninvoiced Orders'}</span>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-amber-600">
              SAR 852,800
            </div>
            <div className="mt-1 text-[11px] text-[#70787d]">
              2 Orders ready for ZATCA issue
            </div>
          </div>

          <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#70787d] text-xs font-medium">
              <span>{isArabic ? 'التزام SLA' : 'SLA Compliance Rate'}</span>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-[#161c27]">
              98.8%
            </div>
            <div className="mt-1 text-[11px] text-emerald-700">
              Zero SLA breach this quarter
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-[#e3e8f9] py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {(['All', 'In Progress', 'Fulfilled', 'Pending Approval'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors shrink-0 ${
                  filterStatus === st
                    ? 'bg-[#004a60] text-white'
                    : 'bg-white text-[#40484d] border border-[#e3e8f9] hover:bg-[#f1f3ff]'
                }`}
              >
                {st === 'All' && (isArabic ? 'الكل' : 'All Orders')}
                {st === 'In Progress' && (isArabic ? 'قيد التنفيذ' : 'In Progress')}
                {st === 'Fulfilled' && (isArabic ? 'مكتمل' : 'Fulfilled')}
                {st === 'Pending Approval' && (isArabic ? 'بانتظار الاعتماد' : 'Pending Approval')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isArabic ? 'بحث في أوامر البيع...' : 'Filter SO, PO, Client...'}
                className="w-full rounded-lg border border-[#e3e8f9] bg-white py-1.5 pl-8 pr-3 text-xs text-[#161c27] placeholder-[#70787d] focus:border-[#004a60] focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Table + Side Sheet */}
      <div className="flex-1 flex overflow-hidden">
        {/* Orders Table */}
        <div className="flex-1 overflow-auto p-4 lg:p-6 pt-2">
          <div className="overflow-hidden rounded-xl border border-[#e3e8f9] bg-white shadow-xs">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="border-b border-[#e3e8f9] bg-[#f9f9ff] text-[11px] font-semibold uppercase text-[#70787d]">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-[#bfc8cd] text-[#004a60] focus:ring-[#004a60]"
                    />
                  </th>
                  <th className="p-3">{isArabic ? 'أمر البيع ورقم PO' : 'Order & PO Number'}</th>
                  <th className="p-3">{isArabic ? 'العميل والقطاع' : 'Customer Entity'}</th>
                  <th className="p-3 text-right">{isArabic ? 'القيمة (ريال)' : 'Total (SAR)'}</th>
                  <th className="p-3">{isArabic ? 'نسبة الإنجاز' : 'Fulfillment'}</th>
                  <th className="p-3">{isArabic ? 'حالة الفوترة' : 'Billing Status'}</th>
                  <th className="p-3">{isArabic ? 'تاريخ الاستحقاق' : 'SLA Target'}</th>
                  <th className="p-3 text-center">{isArabic ? 'معاينة' : 'Details'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8f9]">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-xs text-[#70787d]">
                      {isArabic ? 'لا توجد أوامر بيع مطابقة' : 'No sales orders found.'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    return (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`cursor-pointer transition-colors hover:bg-[#f1f3ff]/60 ${
                          isSelected ? 'bg-[#e8eeff]/70 font-medium' : ''
                        }`}
                      >
                        <td
                          className="p-3 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectOne(order.id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(order.id)}
                            onChange={() => toggleSelectOne(order.id)}
                            className="rounded border-[#bfc8cd] text-[#004a60] focus:ring-[#004a60]"
                          />
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-[#004a60]">{order.id}</div>
                          <div className="text-[10px] text-[#70787d]">PO: {order.poNumber}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-[#161c27]">
                            {isArabic ? order.customerAr : order.customer}
                          </div>
                          <div className="text-[10px] text-[#70787d]">
                            {order.industry} • {order.tier}
                          </div>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-[#161c27]">
                          SAR {order.totalWithVat.toLocaleString()}
                          <div className="text-[10px] font-normal text-[#70787d]">
                            Net: SAR {order.totalAmountNet.toLocaleString()}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 rounded-full bg-[#e3e8f9] overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  order.fulfillmentPercent === 100
                                    ? 'bg-emerald-500'
                                    : order.fulfillmentPercent > 40
                                    ? 'bg-[#004a60]'
                                    : 'bg-amber-500'
                                }`}
                                style={{ width: `${order.fulfillmentPercent}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono font-semibold">
                              {order.fulfillmentPercent}%
                            </span>
                          </div>
                          <div className="text-[10px] text-[#70787d] mt-0.5">
                            {order.fulfillmentStatus}
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                              order.invoicingStatus === 'Fully Invoiced'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.invoicingStatus === 'Partially Invoiced'
                                ? 'bg-[#aae2fd] text-[#004a60]'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.invoicingStatus}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-[#40484d]">
                          {order.provisionSlaDate}
                        </td>
                        <td className="p-3 text-center">
                          <ChevronRight className="h-4 w-4 text-[#70787d] mx-auto" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side-Sheet: Detailed Order Inspector */}
        {selectedOrder && (
          <aside className="w-96 border-l border-[#e3e8f9] bg-white flex flex-col h-full shadow-lg shrink-0 overflow-y-auto hidden xl:flex">
            {/* Sheet Header */}
            <div className="p-4 border-b border-[#e3e8f9] flex items-center justify-between bg-[#f9f9ff]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-[#004a60]">
                    {selectedOrder.id}
                  </span>
                  <span
                    className={`rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      selectedOrder.fulfillmentStatus === 'Fulfilled'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#e8eeff] text-[#004a60]'
                    }`}
                  >
                    {selectedOrder.fulfillmentStatus} ({selectedOrder.fulfillmentPercent}%)
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#161c27] mt-1">
                  {isArabic ? selectedOrder.customerAr : selectedOrder.customer}
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#70787d] hover:text-[#161c27] p-1 rounded-md hover:bg-[#e3e8f9]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sheet Body */}
            <div className="p-4 space-y-5 text-xs">
              {/* Commercial Specs */}
              <div className="rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#70787d]">PO Number:</span>
                  <span className="font-mono font-bold text-[#161c27]">
                    {selectedOrder.poNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70787d]">Quotation Ref:</span>
                  <span className="font-mono text-[#004a60] font-semibold">
                    {selectedOrder.quotationRef}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70787d]">SLA Tier:</span>
                  <span className="font-semibold text-emerald-700">
                    {selectedOrder.slaLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70787d]">Payment Terms:</span>
                  <span className="text-[#161c27]">{selectedOrder.paymentTerms}</span>
                </div>
                <div className="border-t border-[#e3e8f9] pt-2 flex justify-between font-mono font-bold">
                  <span>Grand Total (15% VAT):</span>
                  <span className="text-sm text-[#004a60]">
                    SAR {selectedOrder.totalWithVat.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Cloud Tenant Provisioning */}
              <div>
                <div className="flex items-center gap-1.5 font-bold text-[#161c27] mb-2">
                  <Server className="h-3.5 w-3.5 text-[#004a60]" />
                  <span>Cloud Tenant Allocation</span>
                </div>
                <div className="rounded-lg border border-[#e3e8f9] p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#70787d]">Assigned Domain:</span>
                    <span className="font-mono text-[#004a60]">
                      {selectedOrder.cloudTenant.domain}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#70787d]">Infrastructure:</span>
                    <span className="text-[#161c27]">{selectedOrder.cloudTenant.cluster}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#70787d]">Seat Allocation:</span>
                      <span className="font-mono font-semibold">
                        {selectedOrder.cloudTenant.allocatedSeats} / {selectedOrder.cloudTenant.totalSeats} seats
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#e3e8f9] overflow-hidden">
                      <div
                        className="h-full bg-[#004a60] rounded-full"
                        style={{
                          width: `${
                            (selectedOrder.cloudTenant.allocatedSeats /
                              selectedOrder.cloudTenant.totalSeats) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fulfillment Milestones */}
              <div>
                <div className="flex items-center gap-1.5 font-bold text-[#161c27] mb-2">
                  <FileCheck className="h-3.5 w-3.5 text-[#004a60]" />
                  <span>Execution Milestones</span>
                </div>
                <div className="space-y-3">
                  {selectedOrder.milestones.map((m) => (
                    <div key={m.stepNumber} className="flex gap-2.5 items-start">
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                          m.status === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : m.status === 'current'
                            ? 'bg-[#004a60] text-white ring-2 ring-[#aae2fd]'
                            : 'bg-[#e3e8f9] text-[#70787d]'
                        }`}
                      >
                        {m.stepNumber}
                      </div>
                      <div>
                        <div className="font-semibold text-[#161c27]">{m.title}</div>
                        <div className="text-[10px] text-[#70787d]">{m.subtitle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase Order Document Attachment */}
              <div>
                <div className="font-bold text-[#161c27] mb-2">Attached Documents</div>
                <div className="flex items-center justify-between rounded-lg border border-[#e3e8f9] p-2.5 hover:bg-[#f9f9ff]">
                  <div className="flex items-center gap-2">
                    <div className="rounded bg-rose-50 p-1 text-rose-600 font-mono text-[10px] font-bold">
                      PDF
                    </div>
                    <div>
                      <div className="font-medium text-[#161c27]">{selectedOrder.poDocument}</div>
                      <div className="text-[10px] text-[#70787d]">2.4 MB • Cryptographically Signed</div>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Downloading signed PO: ${selectedOrder.poDocument}`)}
                    className="text-[#004a60] hover:text-[#074e64] p-1"
                    title="Download document"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => onNavigateToInvoice(selectedOrder.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#004a60] py-2.5 font-semibold text-white hover:bg-[#074e64] transition-all cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Issue Tax Invoice (ZATCA e-Invoice)</span>
                </button>
                <button
                  onClick={() => alert(`Modifying order ${selectedOrder.id}`)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#e3e8f9] bg-white py-2 font-semibold text-[#40484d] hover:bg-[#f1f3ff] transition-all cursor-pointer"
                >
                  <span>Edit Order Scope & SLA</span>
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
