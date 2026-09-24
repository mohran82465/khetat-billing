import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Building2,
  Warehouse,
  Truck,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Edit2,
  Trash2,
  Printer,
  Download,
  Share2,
  DollarSign,
  Package,
  Layers,
  ChevronRight,
  ShieldCheck,
  X,
  FileCheck,
} from 'lucide-react';
import {
  PurchaseOrder,
  Supplier,
  HOTEL_PROPERTIES,
} from '../data/mockData';
import { CreatePurchaseOrderModal } from '../components/CreatePurchaseOrderModal';

interface PurchaseOrdersViewProps {
  purchaseOrders: PurchaseOrder[];
  suppliers: Supplier[];
  isArabic: boolean;
  onAddPurchaseOrder: (po: PurchaseOrder) => void;
  onUpdatePurchaseOrder: (po: PurchaseOrder) => void;
  onDeletePurchaseOrder: (id: string) => void;
}

export const PurchaseOrdersView: React.FC<PurchaseOrdersViewProps> = ({
  purchaseOrders,
  suppliers,
  isArabic,
  onAddPurchaseOrder,
  onUpdatePurchaseOrder,
  onDeletePurchaseOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const [inspectingPO, setInspectingPO] = useState<PurchaseOrder | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter((po) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        po.poNumber.toLowerCase().includes(q) ||
        po.supplierName.toLowerCase().includes(q) ||
        (po.supplierNameAr && po.supplierNameAr.toLowerCase().includes(q)) ||
        po.propertyName.toLowerCase().includes(q) ||
        po.warehouseName.toLowerCase().includes(q) ||
        po.items.some((it) => it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q));

      const matchesStatus = selectedStatus === 'all' || po.status === selectedStatus;
      const matchesProperty = selectedProperty === 'all' || po.propertyId === selectedProperty;
      const matchesSupplier = selectedSupplier === 'all' || po.supplierId === selectedSupplier;

      return matchesSearch && matchesStatus && matchesProperty && matchesSupplier;
    });
  }, [purchaseOrders, searchQuery, selectedStatus, selectedProperty, selectedSupplier]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalOrders = purchaseOrders.length;
    const totalSpend = purchaseOrders.reduce((sum, p) => sum + p.grandTotal, 0);
    const inTransit = purchaseOrders.filter((p) => p.status === 'In Transit').length;
    const received = purchaseOrders.filter((p) => p.status === 'Received').length;
    const pendingPayment = purchaseOrders.filter((p) => p.status === 'Payment Pending').length;

    return { totalOrders, totalSpend, inTransit, received, pendingPayment };
  }, [purchaseOrders]);

  const handleStatusChange = (po: PurchaseOrder, newStatus: PurchaseOrder['status']) => {
    const statusArMap: Record<PurchaseOrder['status'], string> = {
      Draft: 'مسودة',
      Approved: 'معتمد وجارِ التوريد',
      'In Transit': 'قيد الشحن والتوصيل',
      Received: 'تم الاستلام والمطابقة',
      'Payment Pending': 'بانتظار سداد الفاتورة',
      Cancelled: 'ملغي',
    };

    const updated: PurchaseOrder = {
      ...po,
      status: newStatus,
      statusAr: statusArMap[newStatus],
    };

    onUpdatePurchaseOrder(updated);
    if (inspectingPO?.id === po.id) {
      setInspectingPO(updated);
    }
    showNotification(
      isArabic
        ? `تم تحديث حالة أمر الشراء ${po.poNumber} إلى "${statusArMap[newStatus]}"`
        : `Updated PO ${po.poNumber} status to "${newStatus}"`
    );
  };

  const getStatusBadge = (status: PurchaseOrder['status'], statusAr: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
            <CheckCircle2 className="h-3 w-3" />
            <span>{isArabic ? statusAr : status}</span>
          </span>
        );
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
            <Truck className="h-3 w-3" />
            <span>{isArabic ? statusAr : status}</span>
          </span>
        );
      case 'Received':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
            <ShieldCheck className="h-3 w-3" />
            <span>{isArabic ? statusAr : status}</span>
          </span>
        );
      case 'Payment Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
            <Clock className="h-3 w-3" />
            <span>{isArabic ? statusAr : status}</span>
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">
            <span>{isArabic ? statusAr : status}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
            <span>{isArabic ? statusAr : status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#70787d] uppercase tracking-wider">
              {isArabic ? 'إجمالي أوامر الشراء' : 'Total Purchase Orders'}
            </span>
            <div className="p-2 rounded-xl bg-[#e8eeff] text-[#004a60]">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#161c27]">
            {metrics.totalOrders}
          </div>
          <div className="mt-1 text-[11px] text-[#70787d] flex items-center gap-1">
            <span className="text-emerald-700 font-semibold">{metrics.received} {isArabic ? 'مستلمة ومطابقة' : 'Received'}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#70787d] uppercase tracking-wider">
              {isArabic ? 'قيمة المشتريات الملتزم بها' : 'Committed Spend (SAR)'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold font-mono text-[#161c27]">
            SAR {metrics.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-[#70787d]">
            {isArabic ? 'شاملة ضريبة 15% ZATCA' : 'Includes 15% ZATCA VAT'}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#70787d] uppercase tracking-wider">
              {isArabic ? 'شحنات قيد النقل' : 'In Transit'}
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-700">
            {metrics.inTransit}
          </div>
          <div className="mt-1 text-[11px] text-[#70787d]">
            {isArabic ? 'متوقع وصولها هذا الأسبوع' : 'En route to resort warehouses'}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#70787d] uppercase tracking-wider">
              {isArabic ? 'بانتظار سداد الفواتير' : 'Payment Pending'}
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-purple-700">
            {metrics.pendingPayment}
          </div>
          <div className="mt-1 text-[11px] text-[#70787d]">
            {isArabic ? 'مستحقة بعد الفحص والاستلام' : 'Pending 3-way matching'}
          </div>
        </div>
      </div>

      {/* Control Bar & Filter Strip */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-[#70787d] ${isArabic ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isArabic
                  ? 'بحث برقم أمر الشراء، المورد، المنشأة، المستودع، أو الصنف...'
                  : 'Search by PO #, supplier, property, warehouse, or item...'
              }
              className={`w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] py-2 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden transition-all ${
                isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'
              }`}
            />
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs font-semibold text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden"
            >
              <option value="all">{isArabic ? 'كافة الحالات' : 'All Statuses'}</option>
              <option value="Approved">{isArabic ? 'معتمد' : 'Approved'}</option>
              <option value="In Transit">{isArabic ? 'قيد الشحن' : 'In Transit'}</option>
              <option value="Received">{isArabic ? 'تم الاستلام' : 'Received'}</option>
              <option value="Payment Pending">{isArabic ? 'قيد السداد' : 'Payment Pending'}</option>
              <option value="Draft">{isArabic ? 'مسودة' : 'Draft'}</option>
            </select>

            {/* Property Filter */}
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs font-semibold text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden"
            >
              <option value="all">{isArabic ? 'كافة المنشآت الفندقية' : 'All Properties'}</option>
              {HOTEL_PROPERTIES.map((prop) => (
                <option key={prop.id} value={prop.id}>
                  {isArabic ? prop.nameAr : prop.name}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex rounded-xl border border-[#c3cce6] bg-[#f9f9ff] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'table' ? 'bg-white text-[#004a60] shadow-2xs' : 'text-[#70787d] hover:text-[#161c27]'
                }`}
              >
                {isArabic ? 'جدول' : 'Table'}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'cards' ? 'bg-white text-[#004a60] shadow-2xs' : 'text-[#70787d] hover:text-[#161c27]'
                }`}
              >
                {isArabic ? 'بطاقات' : 'Cards'}
              </button>
            </div>

            {/* Prominent Create PO Button */}
            <button
              type="button"
              onClick={() => {
                setEditingPO(null);
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? 'إنشاء أمر شراء (Create PO)' : 'Create Purchase Order (PO)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-12 text-center shadow-2xs">
          <FileText className="h-10 w-10 text-[#70787d] mx-auto mb-3 opacity-40" />
          <h3 className="text-sm font-bold text-[#161c27]">
            {isArabic ? 'لا توجد أوامر شراء مطابقة' : 'No Purchase Orders Found'}
          </h3>
          <p className="text-xs text-[#70787d] mt-1 max-w-md mx-auto">
            {isArabic
              ? 'جرّب تعديل معايير البحث أو أنشئ أمر شراء فندقي جديد الآن.'
              : 'Try adjusting your search criteria or create a new purchase order.'}
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                setEditingPO(null);
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#004a60] text-white px-4 py-2 text-xs font-semibold hover:bg-[#074e64] shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isArabic ? 'إنشاء أمر شراء جديد' : 'New Purchase Order'}</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#f9f9ff] text-[11px] text-[#70787d] font-semibold border-b border-[#e3e8f9]">
                <tr>
                  <th className="px-4 py-3">{isArabic ? 'رقم أمر الشراء' : 'PO Number'}</th>
                  <th className="px-4 py-3">{isArabic ? 'تاريخ الإصدار' : 'Issue Date'}</th>
                  <th className="px-4 py-3">{isArabic ? 'المورد المعتمد' : 'Supplier'}</th>
                  <th className="px-4 py-3">{isArabic ? 'المنشأة والمستودع' : 'Property & Warehouse'}</th>
                  <th className="px-4 py-3">{isArabic ? 'تاريخ التسليم' : 'Delivery Date'}</th>
                  <th className="px-4 py-3">{isArabic ? 'البنود' : 'Items'}</th>
                  <th className="px-4 py-3 text-right">{isArabic ? 'المبلغ الإجمالي' : 'Grand Total'}</th>
                  <th className="px-4 py-3 text-center">{isArabic ? 'الحالة' : 'Status'}</th>
                  <th className="px-4 py-3 text-center">{isArabic ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8f9]">
                {filteredOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-[#f9f9ff]/70 transition-colors">
                    {/* PO Number */}
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-[#004a60] flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-[#004a60] shrink-0" />
                        <span>{po.poNumber}</span>
                      </div>
                      <div className="text-[10px] text-[#70787d] mt-0.5">
                        {po.shippingAddress.city || 'KSA'}
                      </div>
                    </td>

                    {/* Issue Date */}
                    <td className="px-4 py-3 text-[#161c27] font-medium whitespace-nowrap">
                      {po.issueDate}
                    </td>

                    {/* Supplier */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#161c27]">
                        {isArabic && po.supplierNameAr ? po.supplierNameAr : po.supplierName}
                      </div>
                      <div className="text-[10px] text-[#70787d]">
                        {po.contactDetails.contactName}
                      </div>
                    </td>

                    {/* Property & Warehouse */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#161c27] flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-[#70787d]" />
                        <span>{po.propertyName}</span>
                      </div>
                      <div className="text-[10px] text-[#70787d] flex items-center gap-1 mt-0.5">
                        <Warehouse className="h-3 w-3 text-[#70787d]" />
                        <span>{po.warehouseName}</span>
                      </div>
                    </td>

                    {/* Delivery Date */}
                    <td className="px-4 py-3 text-[#161c27] whitespace-nowrap">
                      <span className="font-medium">{po.requestedDeliveryDate}</span>
                    </td>

                    {/* Items */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f1f3ff] text-[#004a60] font-semibold text-[11px]">
                        <Package className="h-3 w-3" />
                        <span>{po.items.length} {isArabic ? 'أصناف' : 'items'}</span>
                      </span>
                    </td>

                    {/* Grand Total */}
                    <td className="px-4 py-3 text-right">
                      <div className="font-mono font-bold text-[#161c27] text-sm whitespace-nowrap">
                        SAR {po.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-[#70787d]">
                        +{po.vatAmount.toLocaleString()} VAT
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {getStatusBadge(po.status, po.statusAr)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setInspectingPO(po)}
                          className="p-1.5 rounded-lg text-[#004a60] hover:bg-[#e8eeff] transition-colors"
                          title={isArabic ? 'معاينة تفاصيل أمر الشراء والطباعة' : 'View PO & Print'}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPO(po);
                            setIsCreateModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#70787d] hover:text-[#161c27] hover:bg-gray-100 transition-colors"
                          title={isArabic ? 'تعديل أمر الشراء' : 'Edit PO'}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(isArabic ? `هل أنت متأكد من حذف أمر الشراء ${po.poNumber}؟` : `Delete PO ${po.poNumber}?`)) {
                              onDeletePurchaseOrder(po.id);
                              showNotification(isArabic ? `تم حذف أمر الشراء ${po.poNumber}` : `Deleted PO ${po.poNumber}`);
                            }
                          }}
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title={isArabic ? 'حذف' : 'Delete'}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((po) => (
            <div
              key={po.id}
              className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#e3e8f9]">
                  <div className="font-mono font-bold text-sm text-[#004a60] flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    <span>{po.poNumber}</span>
                  </div>
                  {getStatusBadge(po.status, po.statusAr)}
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#70787d] uppercase tracking-wider block">
                      {isArabic ? 'المورد المعتمد' : 'Supplier'}
                    </span>
                    <span className="font-bold text-[#161c27]">
                      {isArabic && po.supplierNameAr ? po.supplierNameAr : po.supplierName}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9] space-y-1">
                    <div className="flex items-center gap-1.5 text-[#161c27] font-medium text-[11px]">
                      <Building2 className="h-3 w-3 text-[#70787d]" />
                      <span>{po.propertyName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#70787d] text-[10px]">
                      <Warehouse className="h-3 w-3" />
                      <span>{po.warehouseName}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-[#70787d]">{isArabic ? 'تاريخ التسليم:' : 'Delivery:'}</span>
                    <span className="font-semibold text-[#161c27]">{po.requestedDeliveryDate}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#70787d]">{isArabic ? 'عدد البنود:' : 'Line items:'}</span>
                    <span className="font-semibold text-[#004a60]">{po.items.length} {isArabic ? 'أصناف' : 'items'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#e3e8f9] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#70787d] block">{isArabic ? 'الإجمالي الكلي' : 'Grand Total'}</span>
                  <span className="font-mono font-bold text-sm text-[#161c27]">
                    SAR {po.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setInspectingPO(po)}
                    className="p-1.5 rounded-lg text-[#004a60] bg-[#e8eeff] hover:bg-[#d0deff] transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPO(po);
                      setIsCreateModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-[#70787d] hover:bg-gray-100 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PO Details Drawer / Printable Invoice Modal */}
      {inspectingPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
          <div
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#e3e8f9] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e8f9] bg-[#f9f9ff] shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#004a60] text-white">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#161c27]">{inspectingPO.poNumber}</span>
                    {getStatusBadge(inspectingPO.status, inspectingPO.statusAr)}
                  </div>
                  <div className="text-xs text-[#70787d]">
                    {isArabic ? 'أمر شراء معتمد للمنشآت الفندقية' : 'Certified Hotel Purchase Order & Delivery Note'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#c3cce6] bg-white px-3 py-1.5 text-xs font-semibold text-[#161c27] hover:bg-gray-50"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>{isArabic ? 'طباعة' : 'Print'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectingPO(null)}
                  className="p-1.5 rounded-xl text-[#70787d] hover:text-[#161c27] hover:bg-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Inspection Content */}
            <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
              {/* Status Update Quick Bar */}
              <div className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#161c27] block">
                    {isArabic ? 'تحديث حالة مسار أمر الشراء' : 'Workflow Stage Action'}
                  </span>
                  <span className="text-[11px] text-[#70787d]">
                    {isArabic
                      ? 'انقل أمر الشراء إلى المرحلة التالية في دورة التوريد'
                      : 'Advance order across procurement, shipping & 3-way matching'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['Approved', 'In Transit', 'Received', 'Payment Pending'] as PurchaseOrder['status'][]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(inspectingPO, st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        inspectingPO.status === st
                          ? 'bg-[#004a60] text-white shadow-xs'
                          : 'bg-white border border-[#c3cce6] text-[#161c27] hover:bg-gray-50'
                      }`}
                    >
                      {st === 'Approved'
                        ? isArabic ? 'معتمد' : 'Approved'
                        : st === 'In Transit'
                        ? isArabic ? 'قيد الشحن' : 'In Transit'
                        : st === 'Received'
                        ? isArabic ? 'تم الاستلام' : 'Received'
                        : isArabic ? 'قيد السداد' : 'Payment Pending'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Printable PO Header Block */}
              <div className="p-5 rounded-xl border border-[#e3e8f9] bg-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#e3e8f9]">
                  <div>
                    <h2 className="text-lg font-bold text-[#004a60]">
                      {isArabic ? 'شركة نزل للضيافة وإدارة الفنادق' : 'Nuzul Saudi Hospitality Hub'}
                    </h2>
                    <p className="text-gray-600 text-xs mt-0.5">
                      Unified Commercial Register: 1010992812 • ZATCA Tax ID: 300182910200003
                    </p>
                    <p className="text-gray-500 text-[11px]">King Fahd Road, Al-Olaya, Riyadh, Kingdom of Saudi Arabia</p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#70787d] block">
                      {isArabic ? 'أمر شراء رسمي' : 'Official Purchase Order'}
                    </span>
                    <span className="font-mono font-bold text-lg text-[#161c27] block">{inspectingPO.poNumber}</span>
                    <span className="text-[11px] text-gray-500 block">{isArabic ? 'تاريخ الإصدار: ' : 'Issue Date: '} {inspectingPO.issueDate}</span>
                  </div>
                </div>

                {/* 2-Column Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Supplier Info */}
                  <div className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                    <span className="text-[10px] font-bold uppercase text-[#004a60] tracking-wider block mb-1">
                      {isArabic ? 'المورد المعتمد (Vendor)' : 'Vendor / Supplier'}
                    </span>
                    <div className="font-bold text-sm text-[#161c27]">
                      {isArabic && inspectingPO.supplierNameAr ? inspectingPO.supplierNameAr : inspectingPO.supplierName}
                    </div>
                    <div className="text-[11px] text-gray-600 mt-1 space-y-0.5">
                      <p>{isArabic ? 'مسؤول الاتصال:' : 'Contact:'} {inspectingPO.contactDetails.contactName}</p>
                      <p>{isArabic ? 'الهاتف:' : 'Phone:'} {inspectingPO.contactDetails.phone}</p>
                      <p>{isArabic ? 'البريد:' : 'Email:'} {inspectingPO.contactDetails.email}</p>
                    </div>
                  </div>

                  {/* Destination & Warehouse */}
                  <div className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                    <span className="text-[10px] font-bold uppercase text-[#004a60] tracking-wider block mb-1">
                      {isArabic ? 'جهة التوريد والاستلام (Ship To)' : 'Ship To & Receiving Dock'}
                    </span>
                    <div className="font-bold text-sm text-[#161c27]">{inspectingPO.propertyName}</div>
                    <div className="text-[11px] text-[#004a60] font-semibold mt-0.5">
                      {inspectingPO.warehouseName}
                    </div>
                    <div className="text-[11px] text-gray-600 mt-1 space-y-0.5">
                      <p>{inspectingPO.shippingAddress.streetName}, {inspectingPO.shippingAddress.district}, {inspectingPO.shippingAddress.city}</p>
                      <p>{isArabic ? 'العنوان الوطني المختصر:' : 'Short Address:'} <span className="font-mono font-semibold">{inspectingPO.shippingAddress.shortAddress}</span></p>
                      <p>{isArabic ? 'تاريخ الاستلام المستهدف:' : 'Target Delivery:'} <span className="font-semibold text-emerald-800">{inspectingPO.requestedDeliveryDate}</span></p>
                    </div>
                  </div>
                </div>

                {/* Items Breakdown Table */}
                <div>
                  <h4 className="text-xs font-bold text-[#161c27] mb-2 uppercase tracking-wider">
                    {isArabic ? 'بيان الأصناف والكميات (Order Items)' : 'Order Line Items'}
                  </h4>
                  <div className="border border-[#e3e8f9] rounded-xl overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#f9f9ff] text-[11px] text-[#70787d] font-semibold border-b border-[#e3e8f9]">
                        <tr>
                          <th className="p-2.5">#</th>
                          <th className="p-2.5">{isArabic ? 'اسم الصنف' : 'Item Description'}</th>
                          <th className="p-2.5">{isArabic ? 'رمز SKU' : 'SKU'}</th>
                          <th className="p-2.5">{isArabic ? 'التصنيف' : 'Category'}</th>
                          <th className="p-2.5">{isArabic ? 'الوحدة' : 'UOM'}</th>
                          <th className="p-2.5 text-right">{isArabic ? 'سعر الوحدة' : 'Unit Cost'}</th>
                          <th className="p-2.5 text-right">{isArabic ? 'الكمية' : 'Qty'}</th>
                          <th className="p-2.5 text-right">{isArabic ? 'المجموع' : 'Total'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e3e8f9]">
                        {inspectingPO.items.map((it, idx) => (
                          <tr key={it.id || idx}>
                            <td className="p-2.5 text-gray-500 font-mono">{idx + 1}</td>
                            <td className="p-2.5 font-semibold text-[#161c27]">{it.name}</td>
                            <td className="p-2.5 font-mono text-gray-600">{it.sku}</td>
                            <td className="p-2.5 text-gray-600">{it.category}</td>
                            <td className="p-2.5 text-gray-600">{it.uom}</td>
                            <td className="p-2.5 text-right font-mono">SAR {it.unitCost.toFixed(2)}</td>
                            <td className="p-2.5 text-right font-mono font-semibold">{it.qty}</td>
                            <td className="p-2.5 text-right font-mono font-bold text-[#161c27]">
                              SAR {it.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-3 border-t border-[#e3e8f9]">
                  <div className="flex-1 space-y-2">
                    {inspectingPO.specialInstructions && (
                      <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80">
                        <span className="text-[11px] font-bold text-amber-900 block mb-0.5">
                          {isArabic ? 'ملاحظات وتعليمات خاصة للتوريد:' : 'Special Instructions:'}
                        </span>
                        <p className="text-[11px] text-amber-900/90">{inspectingPO.specialInstructions}</p>
                      </div>
                    )}
                    {inspectingPO.attachmentName && (
                      <div className="flex items-center gap-2 text-[11px] text-[#004a60]">
                        <FileCheck className="h-4 w-4" />
                        <span className="font-semibold">{isArabic ? 'المستند المرفق:' : 'Attached Document:'}</span>
                        <span>{inspectingPO.attachmentName}</span>
                      </div>
                    )}
                  </div>

                  <div className="w-full sm:w-72 space-y-1.5 text-xs bg-[#f9f9ff] p-3.5 rounded-xl border border-[#e3e8f9]">
                    <div className="flex justify-between text-gray-600">
                      <span>{isArabic ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                      <span className="font-mono font-semibold">
                        SAR {inspectingPO.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    {inspectingPO.discount > 0 && (
                      <div className="flex justify-between text-red-600 font-medium">
                        <span>{isArabic ? 'الخصم المطبق:' : 'Discount:'}</span>
                        <span className="font-mono">- SAR {inspectingPO.discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>{isArabic ? 'ضريبة القيمة المضافة (15%):' : 'VAT (15%):'}</span>
                      <span className="font-mono font-semibold">
                        SAR {inspectingPO.vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#c3cce6] font-bold text-sm text-[#004a60]">
                      <span>{isArabic ? 'الإجمالي النهائي:' : 'Grand Total:'}</span>
                      <span className="font-mono text-base">
                        SAR {inspectingPO.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Signatures & Stamp block */}
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-dashed border-[#c3cce6] text-center text-gray-500 text-[11px]">
                  <div>
                    <p className="font-semibold text-gray-700">{isArabic ? 'توقيع واعتماد مدير المشتريات' : 'Procurement Director Sign-off'}</p>
                    <div className="h-12 border-b border-gray-300 mt-2"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">{isArabic ? 'استلام واعتماد أمين المستودع' : 'Warehouse Receiving Dock Stamp'}</p>
                    <div className="h-12 border-b border-gray-300 mt-2"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-[#e3e8f9] bg-[#f9f9ff] flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => {
                  setEditingPO(inspectingPO);
                  setInspectingPO(null);
                  setIsCreateModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#c3cce6] bg-white text-xs font-semibold text-[#161c27] hover:bg-gray-50"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>{isArabic ? 'تعديل أمر الشراء' : 'Edit PO'}</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectingPO(null)}
                className="px-5 py-2 rounded-xl bg-[#004a60] text-white text-xs font-semibold hover:bg-[#074e64]"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Purchase Order Modal */}
      <CreatePurchaseOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPO(null);
        }}
        isArabic={isArabic}
        suppliers={suppliers}
        initialData={editingPO}
        onAddPurchaseOrder={(newPo) => {
          if (editingPO) {
            onUpdatePurchaseOrder(newPo);
            showNotification(isArabic ? `تم حفظ تعديلات أمر الشراء ${newPo.poNumber}` : `Updated PO ${newPo.poNumber}`);
          } else {
            onAddPurchaseOrder(newPo);
            showNotification(isArabic ? `تم إنشاء أمر الشراء بنجاح ${newPo.poNumber}` : `Created PO ${newPo.poNumber} successfully`);
          }
        }}
      />
    </div>
  );
};
