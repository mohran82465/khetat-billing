import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Building2,
  Warehouse,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Edit2,
  Trash2,
  Printer,
  DollarSign,
  Package,
  Layers,
  Globe,
  BookOpen,
  FileCheck,
  X,
  CreditCard,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  SupplierBill,
  Supplier,
  HOTEL_PROPERTIES,
} from '../data/mockData';
import { RaiseBillNoPOModal } from '../components/RaiseBillNoPOModal';
import { CreateStandardBillModal } from '../components/CreateStandardBillModal';

interface SupplierBillsViewProps {
  bills: SupplierBill[];
  suppliers: Supplier[];
  isArabic: boolean;
  onAddBill: (bill: SupplierBill) => void;
  onUpdateBill: (bill: SupplierBill) => void;
  onDeleteBill: (id: string) => void;
}

export const SupplierBillsView: React.FC<SupplierBillsViewProps> = ({
  bills,
  suppliers,
  isArabic,
  onAddBill,
  onUpdateBill,
  onDeleteBill,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modals
  const [isStandardModalOpen, setIsStandardModalOpen] = useState(false);
  const [isNoPOModalOpen, setIsNoPOModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<SupplierBill | null>(null);
  const [inspectingBill, setInspectingBill] = useState<SupplierBill | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Filtered bills
  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        b.billNumber.toLowerCase().includes(q) ||
        b.supplierName.toLowerCase().includes(q) ||
        (b.supplierNameAr && b.supplierNameAr.toLowerCase().includes(q)) ||
        (b.propertyName && b.propertyName.toLowerCase().includes(q)) ||
        (b.warehouseName && b.warehouseName.toLowerCase().includes(q)) ||
        (b.postToAccount && b.postToAccount.toLowerCase().includes(q)) ||
        b.items.some((it) => it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q));

      const matchesType = selectedType === 'all' || b.billType === selectedType;
      const matchesStatus = selectedStatus === 'all' || b.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [bills, searchQuery, selectedType, selectedStatus]);

  // Metrics
  const metrics = useMemo(() => {
    const totalCount = bills.length;
    const totalPayable = bills.reduce((sum, b) => sum + b.payableToSupplier, 0);
    const noPOCount = bills.filter((b) => b.billType === 'direct_no_po').length;
    const rcmTaxSum = bills
      .filter((b) => b.isForeignVendor)
      .reduce((sum, b) => sum + b.vatAmount, 0);
    const pendingPaid = bills.filter((b) => b.status !== 'Paid').length;

    return { totalCount, totalPayable, noPOCount, rcmTaxSum, pendingPaid };
  }, [bills]);

  const handleStatusChange = (bill: SupplierBill, newStatus: SupplierBill['status']) => {
    const statusArMap: Record<SupplierBill['status'], string> = {
      Approved: 'معتمد وجارِ الصرف',
      'Pending Approval': 'قيد المراجعة والاعتماد',
      Paid: 'مسدد بالكامل',
      'Partially Paid': 'مسدد جزئياً',
      Disputed: 'موقوف لوجود خلاف',
    };

    const updated: SupplierBill = {
      ...bill,
      status: newStatus,
      statusAr: statusArMap[newStatus],
    };

    onUpdateBill(updated);
    if (inspectingBill?.id === bill.id) {
      setInspectingBill(updated);
    }
    showNotification(
      isArabic
        ? `تم تحديث حالة الفاتورة ${bill.billNumber} إلى "${statusArMap[newStatus]}"`
        : `Updated Bill ${bill.billNumber} status to "${newStatus}"`
    );
  };

  const getStatusBadge = (status: SupplierBill['status'], statusAr: string) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="h-3 w-3" />
            <span>{isArabic ? statusAr : status}</span>
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
            <ShieldCheck className="h-3 w-3" />
            <span>{isArabic ? statusAr : status}</span>
          </span>
        );
      case 'Pending Approval':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
            <Clock className="h-3 w-3" />
            <span>{isArabic ? statusAr : status}</span>
          </span>
        );
      case 'Partially Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
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
      {/* Toast */}
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
              {isArabic ? 'إجمالي فواتير الموردين' : 'Total Supplier Bills'}
            </span>
            <div className="p-2 rounded-xl bg-[#e8eeff] text-[#004a60]">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#161c27]">
            {metrics.totalCount}
          </div>
          <div className="mt-1 text-[11px] text-[#70787d] flex items-center gap-1">
            <span className="text-[#004a60] font-semibold">{metrics.noPOCount} {isArabic ? 'بدون أمر شراء (خدمات)' : 'Direct No-PO'}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#70787d] uppercase tracking-wider">
              {isArabic ? 'المستحق للموردين' : 'Payable to Suppliers'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold font-mono text-[#161c27]">
            SAR {metrics.totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-[#70787d]">
            {isArabic ? `${metrics.pendingPaid} فواتير بانتظار التحويل` : `${metrics.pendingPaid} awaiting settlement`}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#70787d] uppercase tracking-wider">
              {isArabic ? 'الاحتساب العكسي (RCM ZATCA)' : 'Reverse Charge VAT'}
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Globe className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold font-mono text-purple-700">
            SAR {metrics.rcmTaxSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-[#70787d]">
            {isArabic ? 'ضريبة ذاتية لموردين غير مقيمين' : 'Self-assessed non-resident VAT'}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#70787d] uppercase tracking-wider">
              {isArabic ? 'جاهزية الربط الضريبي' : 'ZATCA Audit Readiness'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-700">
            100%
          </div>
          <div className="mt-1 text-[11px] text-[#70787d]">
            {isArabic ? 'مطابقة قيود اليومية ومراكز التكلفة' : 'Mapped to USALI accounts'}
          </div>
        </div>
      </div>

      {/* Action Bar & Filter Strip */}
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
                  ? 'بحث برقم الفاتورة، المورد، الحساب المحاسبي، المنشأة أو الصنف...'
                  : 'Search by bill #, supplier, account, property, or item...'
              }
              className={`w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] py-2 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden transition-all ${
                isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'
              }`}
            />
          </div>

          {/* Filters & Direct Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Bill Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs font-semibold text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden"
            >
              <option value="all">{isArabic ? 'كافة أنواع الفواتير' : 'All Bill Types'}</option>
              <option value="standard">{isArabic ? 'فواتير التوريدات والمستودعات' : 'Standard (Property & WH)'}</option>
              <option value="direct_no_po">{isArabic ? 'فواتير بدون أمر شراء (برمجيات وخدمات)' : 'Direct (No PO - Services)'}</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs font-semibold text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden"
            >
              <option value="all">{isArabic ? 'كافة الحالات' : 'All Statuses'}</option>
              <option value="Approved">{isArabic ? 'معتمد' : 'Approved'}</option>
              <option value="Paid">{isArabic ? 'مسدد' : 'Paid'}</option>
              <option value="Pending Approval">{isArabic ? 'قيد المراجعة' : 'Pending Approval'}</option>
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

            {/* Primary Action 1: Raise Bill (No PO) matching prompt */}
            <button
              type="button"
              onClick={() => {
                setEditingBill(null);
                setIsNoPOModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#004a60] bg-[#e8eeff] hover:bg-[#d5e2ff] text-[#004a60] px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Zap className="h-3.5 w-3.5 text-[#004a60]" />
              <span>{isArabic ? 'فاتورة بدون أمر شراء (No PO)' : 'Raise Bill (No PO)'}</span>
            </button>

            {/* Primary Action 2: Create Bill (Standard) matching prompt */}
            <button
              type="button"
              onClick={() => {
                setEditingBill(null);
                setIsStandardModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white px-4 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? 'إنشاء فاتورة (Create Bill)' : 'Create Bill'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {filteredBills.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-12 text-center shadow-2xs">
          <FileText className="h-10 w-10 text-[#70787d] mx-auto mb-3 opacity-40" />
          <h3 className="text-sm font-bold text-[#161c27]">
            {isArabic ? 'لا توجد فواتير موردين مطابقة' : 'No Supplier Bills Found'}
          </h3>
          <p className="text-xs text-[#70787d] mt-1 max-w-md mx-auto">
            {isArabic
              ? 'جرّب تعديل الفلاتر أو أنشئ فاتورة جديدة الآن سواءً لتوريدات البضائع أو الخدمات والبرمجيات.'
              : 'Try adjusting your filters or create a new bill.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsNoPOModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#004a60] bg-[#e8eeff] text-[#004a60] px-3.5 py-2 text-xs font-bold"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{isArabic ? 'فاتورة بدون أمر شراء' : 'Raise Bill (No PO)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsStandardModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#004a60] text-white px-4 py-2 text-xs font-bold shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isArabic ? 'إنشاء فاتورة جديدة' : 'Create Bill'}</span>
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
                  <th className="px-4 py-3">{isArabic ? 'رقم الفاتورة' : 'Bill Number'}</th>
                  <th className="px-4 py-3">{isArabic ? 'نوع الفاتورة' : 'Type'}</th>
                  <th className="px-4 py-3">{isArabic ? 'المورد المعتمد' : 'Supplier'}</th>
                  <th className="px-4 py-3">{isArabic ? 'المنشأة أو الحساب المحاسبي' : 'Property / GL Account'}</th>
                  <th className="px-4 py-3">{isArabic ? 'تاريخ الإصدار' : 'Issue Date'}</th>
                  <th className="px-4 py-3">{isArabic ? 'البنود' : 'Items'}</th>
                  <th className="px-4 py-3 text-right">{isArabic ? 'المستحق للمورد' : 'Payable (SAR)'}</th>
                  <th className="px-4 py-3 text-center">{isArabic ? 'الحالة' : 'Status'}</th>
                  <th className="px-4 py-3 text-center">{isArabic ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8f9]">
                {filteredBills.map((b) => (
                  <tr key={b.id} className="hover:bg-[#f9f9ff]/70 transition-colors">
                    {/* Bill Number */}
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-[#004a60] flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-[#004a60] shrink-0" />
                        <span>{b.billNumber}</span>
                      </div>
                      {b.isForeignVendor && (
                        <span className="inline-block text-[9px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded-sm mt-0.5">
                          {isArabic ? 'مورد أجنبي (RCM)' : 'Foreign Vendor (RCM)'}
                        </span>
                      )}
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3">
                      {b.billType === 'direct_no_po' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Zap className="h-2.5 w-2.5" />
                          <span>{isArabic ? 'خدمات / برمجيات (No PO)' : 'Direct (No PO)'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          <Package className="h-2.5 w-2.5" />
                          <span>{isArabic ? 'توريد مستودع فندقي' : 'Warehouse Standard'}</span>
                        </span>
                      )}
                    </td>

                    {/* Supplier */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#161c27]">
                        {isArabic && b.supplierNameAr ? b.supplierNameAr : b.supplierName}
                      </div>
                    </td>

                    {/* Property / GL Account */}
                    <td className="px-4 py-3">
                      {b.postToAccount ? (
                        <div className="text-[11px] font-mono text-[#004a60] font-semibold flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-[#70787d]" />
                          <span>{b.postToAccount}</span>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-[#161c27] flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-[#70787d]" />
                            <span>{b.propertyName}</span>
                          </div>
                          <div className="text-[10px] text-[#70787d] flex items-center gap-1 mt-0.5">
                            <Warehouse className="h-3 w-3 text-[#70787d]" />
                            <span>{b.warehouseName}</span>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Issue Date */}
                    <td className="px-4 py-3 text-[#161c27] whitespace-nowrap">
                      {b.issueDate}
                    </td>

                    {/* Items */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f1f3ff] text-[#004a60] font-semibold text-[11px]">
                        <span>{b.items.length} {isArabic ? 'بنود' : 'items'}</span>
                      </span>
                    </td>

                    {/* Payable to Supplier */}
                    <td className="px-4 py-3 text-right">
                      <div className="font-mono font-bold text-[#161c27] text-sm whitespace-nowrap">
                        SAR {b.payableToSupplier.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-[#70787d]">
                        +{b.vatAmount.toLocaleString()} VAT {b.isForeignVendor ? '(RCM)' : ''}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {getStatusBadge(b.status, b.statusAr)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setInspectingBill(b)}
                          className="p-1.5 rounded-lg text-[#004a60] hover:bg-[#e8eeff] transition-colors"
                          title={isArabic ? 'معاينة الفاتورة والطباعة' : 'View Bill Voucher & Print'}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBill(b);
                            if (b.billType === 'direct_no_po') {
                              setIsNoPOModalOpen(true);
                            } else {
                              setIsStandardModalOpen(true);
                            }
                          }}
                          className="p-1.5 rounded-lg text-[#70787d] hover:text-[#161c27] hover:bg-gray-100 transition-colors"
                          title={isArabic ? 'تعديل الفاتورة' : 'Edit Bill'}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(isArabic ? `حذف الفاتورة ${b.billNumber}؟` : `Delete Bill ${b.billNumber}?`)) {
                              onDeleteBill(b.id);
                              showNotification(isArabic ? `تم حذف الفاتورة ${b.billNumber}` : `Deleted Bill ${b.billNumber}`);
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
          {filteredBills.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#e3e8f9]">
                  <div className="font-mono font-bold text-sm text-[#004a60] flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    <span>{b.billNumber}</span>
                  </div>
                  {getStatusBadge(b.status, b.statusAr)}
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#70787d] uppercase tracking-wider block">
                      {isArabic ? 'المورد المعتمد' : 'Supplier'}
                    </span>
                    <span className="font-bold text-[#161c27]">
                      {isArabic && b.supplierNameAr ? b.supplierNameAr : b.supplierName}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9] space-y-1">
                    {b.postToAccount ? (
                      <div className="flex items-center gap-1.5 text-[#004a60] font-mono font-bold text-[11px]">
                        <BookOpen className="h-3.5 w-3.5 text-[#70787d]" />
                        <span>{b.postToAccount}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 text-[#161c27] font-medium text-[11px]">
                          <Building2 className="h-3 w-3 text-[#70787d]" />
                          <span>{b.propertyName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#70787d] text-[10px]">
                          <Warehouse className="h-3 w-3" />
                          <span>{b.warehouseName}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {b.isForeignVendor && (
                    <div className="p-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 text-[10px] flex items-center gap-1.5">
                      <Globe className="h-3 w-3 shrink-0 text-purple-700" />
                      <span>{isArabic ? 'احتساب عكسي RCM + استقطاع ضريبي WHT' : 'Reverse Charge VAT & Withholding Tax'}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-[#70787d]">{isArabic ? 'تاريخ الإصدار:' : 'Issue Date:'}</span>
                    <span className="font-semibold text-[#161c27]">{b.issueDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#e3e8f9] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#70787d] block">{isArabic ? 'المستحق للمورد' : 'Payable to Supplier'}</span>
                  <span className="font-mono font-bold text-sm text-[#161c27]">
                    SAR {b.payableToSupplier.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setInspectingBill(b)}
                    className="p-1.5 rounded-lg text-[#004a60] bg-[#e8eeff] hover:bg-[#d0deff] transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBill(b);
                      if (b.billType === 'direct_no_po') {
                        setIsNoPOModalOpen(true);
                      } else {
                        setIsStandardModalOpen(true);
                      }
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

      {/* Bill Voucher Inspection Drawer / Printable Modal */}
      {inspectingBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
          <div
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#e3e8f9] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e8f9] bg-[#f9f9ff] shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#004a60] text-white">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#161c27]">{inspectingBill.billNumber}</span>
                    {getStatusBadge(inspectingBill.status, inspectingBill.statusAr)}
                  </div>
                  <div className="text-xs text-[#70787d]">
                    {inspectingBill.billType === 'direct_no_po'
                      ? isArabic
                        ? 'فاتورة خدمات / برمجيات بدون أمر شراء'
                        : 'Direct Service / SaaS Bill (No PO)'
                      : isArabic
                      ? 'فاتورة توريدات مستودع فندقي'
                      : 'Hospitality Warehouse Goods Bill'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#c3cce6] bg-white px-3 py-1.5 text-xs font-semibold text-[#161c27] hover:bg-gray-50 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>{isArabic ? 'طباعة' : 'Print'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectingBill(null)}
                  className="p-1.5 rounded-xl text-[#70787d] hover:text-[#161c27] hover:bg-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 space-y-5 flex-1 text-xs">
              {/* Payment Action Quick Bar */}
              <div className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#161c27] block">
                    {isArabic ? 'إجراءات السداد والصرف' : 'Disbursement Action'}
                  </span>
                  <span className="text-[11px] text-[#70787d]">
                    {isArabic ? 'تحديث حالة صرف الفاتورة لحساب المورد البنكي' : 'Update settlement & payment voucher'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['Approved', 'Paid', 'Pending Approval'] as SupplierBill['status'][]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(inspectingBill, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        inspectingBill.status === st
                          ? 'bg-[#004a60] text-white shadow-xs'
                          : 'bg-white border border-[#c3cce6] text-[#161c27] hover:bg-gray-50'
                      }`}
                    >
                      {st === 'Approved'
                        ? isArabic ? 'معتمد للصرف' : 'Approved'
                        : st === 'Paid'
                        ? isArabic ? 'مسدد بالكامل' : 'Mark as Paid'
                        : isArabic ? 'قيد المراجعة' : 'Pending Approval'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Printable Voucher View */}
              <div className="p-5 rounded-xl border border-[#e3e8f9] bg-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#e3e8f9]">
                  <div>
                    <h2 className="text-lg font-bold text-[#004a60]">
                      {isArabic ? 'شركة نزل للضيافة وإدارة الفنادق' : 'Nuzul Saudi Hospitality Hub'}
                    </h2>
                    <p className="text-gray-600 text-xs">
                      Unified CR: 1010992812 • ZATCA Tax ID: 300182910200003
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-xs uppercase font-bold text-[#70787d] block">
                      {isArabic ? 'سند استحقاق فاتورة مورد' : 'Supplier Bill Voucher'}
                    </span>
                    <span className="font-mono font-bold text-lg text-[#161c27] block">{inspectingBill.billNumber}</span>
                    <span className="text-[11px] text-gray-500 block">{isArabic ? 'تاريخ الفاتورة: ' : 'Issue Date: '} {inspectingBill.issueDate}</span>
                  </div>
                </div>

                {/* 2-Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                    <span className="text-[10px] font-bold uppercase text-[#004a60] block mb-1">
                      {isArabic ? 'المورد (Vendor)' : 'Vendor / Supplier'}
                    </span>
                    <div className="font-bold text-sm text-[#161c27]">
                      {isArabic && inspectingBill.supplierNameAr ? inspectingBill.supplierNameAr : inspectingBill.supplierName}
                    </div>
                    {inspectingBill.isForeignVendor && (
                      <span className="inline-block text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-md mt-1">
                        {isArabic ? 'مورد أجنبي (غير مقيم)' : 'Foreign Non-Resident Vendor'}
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                    <span className="text-[10px] font-bold uppercase text-[#004a60] block mb-1">
                      {inspectingBill.postToAccount
                        ? isArabic ? 'الحساب المحاسبي المرحل إليه' : 'GL Post Account'
                        : isArabic ? 'المنشأة والمستودع' : 'Property & Warehouse'}
                    </span>
                    {inspectingBill.postToAccount ? (
                      <div className="font-mono font-bold text-[#004a60] text-sm">
                        {inspectingBill.postToAccount}
                      </div>
                    ) : (
                      <>
                        <div className="font-bold text-sm text-[#161c27]">{inspectingBill.propertyName}</div>
                        <div className="text-[11px] text-[#004a60] font-semibold mt-0.5">{inspectingBill.warehouseName}</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="border border-[#e3e8f9] rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#f9f9ff] text-[11px] text-[#70787d] font-semibold border-b border-[#e3e8f9]">
                      <tr>
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">{isArabic ? 'اسم البند / الخدمة' : 'Item / Service Description'}</th>
                        <th className="p-2.5">{isArabic ? 'SKU' : 'SKU'}</th>
                        <th className="p-2.5">{isArabic ? 'التصنيف' : 'Category'}</th>
                        <th className="p-2.5 text-right">{isArabic ? 'سعر الوحدة' : 'Unit Cost'}</th>
                        <th className="p-2.5 text-right">{isArabic ? 'الكمية' : 'Qty'}</th>
                        <th className="p-2.5 text-right">{isArabic ? 'الإجمالي' : 'Total'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e3e8f9]">
                      {inspectingBill.items.map((it, idx) => (
                        <tr key={it.id || idx}>
                          <td className="p-2.5 text-gray-500 font-mono">{idx + 1}</td>
                          <td className="p-2.5 font-semibold text-[#161c27]">{it.name}</td>
                          <td className="p-2.5 font-mono text-gray-600">{it.sku || '—'}</td>
                          <td className="p-2.5 text-gray-600">{it.category}</td>
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

                {/* Financial Summary */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-3 border-t border-[#e3e8f9]">
                  <div className="flex-1 space-y-2">
                    {inspectingBill.notes && (
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-[11px] font-bold text-gray-800 block mb-0.5">
                          {isArabic ? 'ملاحظات:' : 'Notes:'}
                        </span>
                        <p className="text-[11px] text-gray-700">{inspectingBill.notes}</p>
                      </div>
                    )}
                    {inspectingBill.attachmentName && (
                      <div className="flex items-center gap-2 text-[11px] text-[#004a60]">
                        <FileCheck className="h-4 w-4" />
                        <span className="font-semibold">{isArabic ? 'المرفق:' : 'Attachment:'}</span>
                        <span>{inspectingBill.attachmentName}</span>
                      </div>
                    )}
                  </div>

                  <div className="w-full sm:w-72 space-y-1.5 text-xs bg-[#f9f9ff] p-3.5 rounded-xl border border-[#e3e8f9]">
                    <div className="flex justify-between text-gray-600">
                      <span>{isArabic ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                      <span className="font-mono font-semibold">
                        SAR {inspectingBill.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    {inspectingBill.discount > 0 && (
                      <div className="flex justify-between text-red-600 font-medium">
                        <span>{isArabic ? 'الخصم:' : 'Discount:'}</span>
                        <span className="font-mono">- SAR {inspectingBill.discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>{isArabic ? 'ضريبة القيمة المضافة (15%):' : 'VAT (15%):'}</span>
                      <span className="font-mono font-semibold">
                        SAR {inspectingBill.vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {inspectingBill.isForeignVendor && (
                          <span className="text-[10px] text-purple-700 font-bold block">{isArabic ? '(احتساب عكسي RCM)' : '(RCM)'}</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#c3cce6] font-bold text-sm text-[#004a60]">
                      <span>{isArabic ? 'المستحق للمورد:' : 'Payable to Supplier:'}</span>
                      <span className="font-mono text-base">
                        SAR {inspectingBill.payableToSupplier.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#e3e8f9] bg-[#f9f9ff] flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => {
                  setEditingBill(inspectingBill);
                  setInspectingBill(null);
                  if (inspectingBill.billType === 'direct_no_po') {
                    setIsNoPOModalOpen(true);
                  } else {
                    setIsStandardModalOpen(true);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#c3cce6] bg-white text-xs font-semibold text-[#161c27] hover:bg-gray-50 cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>{isArabic ? 'تعديل الفاتورة' : 'Edit Bill'}</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectingBill(null)}
                className="px-5 py-2 rounded-xl bg-[#004a60] text-white text-xs font-semibold hover:bg-[#074e64] cursor-pointer"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Raise Bill (No PO) Modal */}
      <RaiseBillNoPOModal
        isOpen={isNoPOModalOpen}
        onClose={() => {
          setIsNoPOModalOpen(false);
          setEditingBill(null);
        }}
        isArabic={isArabic}
        suppliers={suppliers}
        initialData={editingBill?.billType === 'direct_no_po' ? editingBill : null}
        onSaveBill={(bill) => {
          if (editingBill) {
            onUpdateBill(bill);
            showNotification(isArabic ? `تم حفظ تعديلات الفاتورة ${bill.billNumber}` : `Updated Bill ${bill.billNumber}`);
          } else {
            onAddBill(bill);
            showNotification(isArabic ? `تم إنشاء الفاتورة بنجاح ${bill.billNumber}` : `Created Bill ${bill.billNumber} successfully`);
          }
        }}
      />

      {/* Create Standard Bill Modal */}
      <CreateStandardBillModal
        isOpen={isStandardModalOpen}
        onClose={() => {
          setIsStandardModalOpen(false);
          setEditingBill(null);
        }}
        isArabic={isArabic}
        suppliers={suppliers}
        initialData={editingBill?.billType === 'standard' ? editingBill : null}
        onAddBill={(bill) => {
          if (editingBill) {
            onUpdateBill(bill);
            showNotification(isArabic ? `تم حفظ تعديلات الفاتورة ${bill.billNumber}` : `Updated Bill ${bill.billNumber}`);
          } else {
            onAddBill(bill);
            showNotification(isArabic ? `تم إنشاء الفاتورة بنجاح ${bill.billNumber}` : `Created Bill ${bill.billNumber} successfully`);
          }
        }}
      />
    </div>
  );
};
