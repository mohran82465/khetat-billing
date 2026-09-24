import React, { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CreditCard,
  FileText,
  DollarSign,
  ChevronRight,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  ExternalLink,
  Download,
  Share2,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import { Supplier } from '../data/mockData';
import { AddSupplierModal } from '../components/AddSupplierModal';

interface SuppliersViewProps {
  suppliers: Supplier[];
  isArabic: boolean;
  onAddSupplier: (supplier: Supplier) => void;
  onUpdateSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (id: string) => void;
  onOpenCreateSupplierModal?: () => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  isArabic,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'accounting'>('table');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [inspectingSupplier, setInspectingSupplier] = useState<Supplier | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.nameAr && s.nameAr.toLowerCase().includes(searchQuery.toLowerCase())) ||
        s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.taxId.includes(searchQuery) ||
        (s.shortAddress && s.shortAddress.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.city && s.city.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || s.category === selectedCategory;

      const matchesStatus =
        selectedStatus === 'all' || s.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [suppliers, searchQuery, selectedCategory, selectedStatus]);

  // Statistics
  const totalCount = suppliers.length;
  const activeCount = suppliers.filter((s) => s.status === 'Active').length;
  const totalPayables = suppliers.reduce(
    (sum, s) => sum + (s.currentBalanceSar ?? s.payableOpeningBalance ?? 0),
    0
  );
  const totalAdvances = suppliers.reduce(
    (sum, s) => sum + (s.advanceOpeningBalance ?? 0),
    0
  );

  const categories = useMemo(() => {
    const set = new Set(suppliers.map((s) => s.category));
    return Array.from(set);
  }, [suppliers]);

  const handleEditClick = (s: Supplier) => {
    setEditingSupplier(s);
    setIsAddModalOpen(true);
  };

  const handleSaveSupplier = (s: Supplier) => {
    if (editingSupplier) {
      onUpdateSupplier(s);
      showNotification(
        isArabic
          ? `تم تحديث بيانات المورد "${s.name}" بنجاح`
          : `Supplier "${s.name}" successfully updated`
      );
    } else {
      onAddSupplier(s);
      showNotification(
        isArabic
          ? `تم إضافة المورد الجديد "${s.name}" بنجاح`
          : `New supplier "${s.name}" successfully registered`
      );
    }
    setEditingSupplier(null);
  };

  const handleDelete = (s: Supplier) => {
    if (
      window.confirm(
        isArabic
          ? `هل أنت متأكد من حذف المورد "${s.name}"؟`
          : `Are you sure you want to delete supplier "${s.name}"?`
      )
    ) {
      onDeleteSupplier(s.id);
      showNotification(
        isArabic
          ? `تم حذف المورد "${s.name}"`
          : `Supplier "${s.name}" was removed`
      );
      if (inspectingSupplier?.id === s.id) {
        setInspectingSupplier(null);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            {isArabic ? 'نشط' : 'Active'}
          </span>
        );
      case 'Pending Approval':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[11px] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
            {isArabic ? 'قيد المراجعة' : 'Pending Approval'}
          </span>
        );
      case 'Inactive':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 px-2.5 py-0.5 text-[11px] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-500"></span>
            {isArabic ? 'غير نشط' : 'Inactive'}
          </span>
        );
      case 'Blocked':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-800 px-2.5 py-0.5 text-[11px] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
            {isArabic ? 'محظور' : 'Blocked'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 px-2.5 py-0.5 text-[11px] font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f9f9ff] p-4 lg:p-6 space-y-5">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-3 shadow-lg animate-in slide-in-from-top-4 text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4" />
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#e3e8f9] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004a60] text-white">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#161c27]">
                {isArabic ? 'دليل الموردين والمشتريات' : 'Suppliers & Vendors Directory'}
              </h1>
              <p className="text-xs text-[#70787d]">
                {isArabic
                  ? 'إدارة حسابات الموردين، بيانات الفوترة ZATCA، شروط السداد، وشجرة الحسابات العامة'
                  : 'Manage certified hospitality suppliers, ZATCA tax profiles, payment terms, and GL ledgers'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setEditingSupplier(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white px-4 py-2.5 text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{isArabic ? 'إضافة مورد جديد' : 'Add New Supplier'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-[#e3e8f9] shadow-xs">
          <div className="text-[11px] font-semibold text-[#70787d] uppercase tracking-wider">
            {isArabic ? 'إجمالي الموردين' : 'Total Suppliers'}
          </div>
          <div className="text-2xl font-bold text-[#161c27] mt-1">{totalCount}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
            {activeCount} {isArabic ? 'مورد معتمد ونشط' : 'active vendors'}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e3e8f9] shadow-xs">
          <div className="text-[11px] font-semibold text-[#70787d] uppercase tracking-wider">
            {isArabic ? 'الموردين النشطين' : 'Active Vendors'}
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{activeCount}</div>
          <div className="text-[11px] text-[#70787d] mt-0.5">
            {isArabic ? 'مستندات وضريبة مكتملة' : '100% ZATCA verified'}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e3e8f9] shadow-xs">
          <div className="text-[11px] font-semibold text-[#70787d] uppercase tracking-wider">
            {isArabic ? 'رصيد حسابات الدائنين' : 'Outstanding Payables'}
          </div>
          <div className="text-2xl font-bold text-[#004a60] font-mono mt-1">
            SAR {totalPayables.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#70787d] font-mono mt-0.5">GL: 2101 (Trade Payables)</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e3e8f9] shadow-xs">
          <div className="text-[11px] font-semibold text-[#70787d] uppercase tracking-wider">
            {isArabic ? 'الدفعات المقدمة للموردين' : 'Supplier Advances'}
          </div>
          <div className="text-2xl font-bold text-amber-700 font-mono mt-1">
            SAR {totalAdvances.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#70787d] font-mono mt-0.5">GL: 1204 (Advances Paid)</div>
        </div>
      </div>

      {/* Control Bar: Search, Category, Status, View mode */}
      <div className="bg-white p-4 rounded-xl border border-[#e3e8f9] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#70787d]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isArabic
                ? 'البحث باسم المورد، الرقم الضريبي، جهة الاتصال، العنوان...'
                : 'Search by supplier, Tax ID, contact, city, short address...'
            }
            className="w-full rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] pl-9 pr-3 py-2 text-xs text-[#161c27] focus:border-[#004a60] focus:bg-white focus:outline-hidden"
          />
        </div>

        {/* Filters and View Switcher */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
          >
            <option value="all">{isArabic ? 'كافة التصنيفات' : 'All Categories'}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
          >
            <option value="all">{isArabic ? 'كافة الحالات' : 'All Statuses'}</option>
            <option value="Active">{isArabic ? 'نشط' : 'Active'}</option>
            <option value="Pending Approval">{isArabic ? 'قيد المراجعة' : 'Pending Approval'}</option>
            <option value="Inactive">{isArabic ? 'غير نشط' : 'Inactive'}</option>
            <option value="Blocked">{isArabic ? 'محظور' : 'Blocked'}</option>
          </select>

          {/* View Mode Tabs */}
          <div className="flex items-center rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#004a60] shadow-xs'
                  : 'text-[#70787d] hover:text-[#161c27]'
              }`}
            >
              {isArabic ? 'جدول' : 'Table'}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-[#004a60] shadow-xs'
                  : 'text-[#70787d] hover:text-[#161c27]'
              }`}
            >
              {isArabic ? 'بطاقات' : 'Cards'}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('accounting')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'accounting'
                  ? 'bg-white text-[#004a60] shadow-xs'
                  : 'text-[#70787d] hover:text-[#161c27]'
              }`}
            >
              {isArabic ? 'الدفاتر المحاسبية' : 'Accounting Ledger'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content View */}
      {filteredSuppliers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-12 text-center">
          <Building2 className="h-12 w-12 text-[#70787d] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-[#161c27]">
            {isArabic ? 'لم يتم العثور على موردين' : 'No Suppliers Found'}
          </h3>
          <p className="text-xs text-[#70787d] max-w-md mx-auto mt-1 mb-4">
            {isArabic
              ? 'جرّب تغيير عبارة البحث أو الفلاتر، أو قم بإضافة مورد جديد الآن'
              : 'Try adjusting your search criteria or register a new supplier now.'}
          </p>
          <button
            onClick={() => {
              setEditingSupplier(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#004a60] text-white px-4 py-2 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>{isArabic ? 'إضافة مورد' : 'Add Supplier'}</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e3e8f9] bg-[#f9f9ff] text-[11px] font-bold text-[#70787d] uppercase tracking-wider">
                  <th className="py-3 px-4">{isArabic ? 'المورد والتصنيف' : 'Supplier & Category'}</th>
                  <th className="py-3 px-4">{isArabic ? 'جهة الاتصال' : 'Contact Person'}</th>
                  <th className="py-3 px-4">{isArabic ? 'الموقع والعنوان' : 'Location & Address'}</th>
                  <th className="py-3 px-4">{isArabic ? 'الرقم الضريبي ZATCA' : 'Tax ID (ZATCA)'}</th>
                  <th className="py-3 px-4">{isArabic ? 'شروط السداد والتسليم' : 'Terms'}</th>
                  <th className="py-3 px-4 text-right">{isArabic ? 'رصيد الدائنين' : 'Payable Balance'}</th>
                  <th className="py-3 px-4 text-center">{isArabic ? 'الحالة' : 'Status'}</th>
                  <th className="py-3 px-4 text-center">{isArabic ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8f9]">
                {filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="hover:bg-[#f1f3ff]/40 transition-colors group cursor-pointer"
                    onClick={() => setInspectingSupplier(supplier)}
                  >
                    {/* Supplier & Category */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8eeff] text-[#004a60] font-bold text-xs">
                          {supplier.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-[#161c27] flex items-center gap-1.5">
                            <span>{isArabic && supplier.nameAr ? supplier.nameAr : supplier.name}</span>
                            {supplier.shortAddress && (
                              <span className="font-mono text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {supplier.shortAddress}
                              </span>
                            )}
                          </div>
                          <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#004a60] bg-[#e8eeff] px-2 py-0.2 rounded-full">
                            {isArabic && supplier.categoryAr ? supplier.categoryAr : supplier.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#161c27]">{supplier.contactPerson}</div>
                      <div className="text-[11px] text-[#70787d] font-mono flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span>{supplier.phone}</span>
                      </div>
                      <div className="text-[11px] text-[#70787d] flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span>{supplier.email}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-[#161c27] font-semibold">
                        <MapPin className="h-3.5 w-3.5 text-[#004a60]" />
                        <span>
                          {supplier.city}, {supplier.country}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#70787d] mt-0.5">
                        {supplier.district ? `${supplier.district} • ` : ''}
                        {supplier.streetName}
                      </div>
                    </td>

                    {/* Tax ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-mono font-semibold text-[#161c27]">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{supplier.taxId}</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                        {isArabic ? 'خاضع لضريبة 15%' : 'ZATCA Registered (15%)'}
                      </div>
                    </td>

                    {/* Terms */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#161c27]">{supplier.paymentTerms}</div>
                      <div className="text-[10px] text-[#70787d] mt-0.5">{supplier.deliveryTerm}</div>
                    </td>

                    {/* Payable Balance */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-bold text-[#161c27]">
                        SAR {(supplier.currentBalanceSar ?? supplier.payableOpeningBalance ?? 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] font-mono text-[#70787d] mt-0.5">
                        Code: {supplier.payableCode}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">{getStatusBadge(supplier.status)}</td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setInspectingSupplier(supplier)}
                          className="rounded-lg p-1.5 text-[#70787d] hover:bg-[#e8eeff] hover:text-[#004a60] transition-colors"
                          title={isArabic ? 'عرض التفاصيل' : 'View Details'}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditClick(supplier)}
                          className="rounded-lg p-1.5 text-[#70787d] hover:bg-[#e8eeff] hover:text-[#004a60] transition-colors"
                          title={isArabic ? 'تعديل البيانات' : 'Edit Supplier'}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(supplier)}
                          className="rounded-lg p-1.5 text-[#70787d] hover:bg-red-50 hover:text-red-600 transition-colors"
                          title={isArabic ? 'حذف المورد' : 'Delete Supplier'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              onClick={() => setInspectingSupplier(supplier)}
              className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8eeff] text-[#004a60] font-bold text-sm">
                      {supplier.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#161c27] line-clamp-1">
                        {isArabic && supplier.nameAr ? supplier.nameAr : supplier.name}
                      </h3>
                      <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#004a60] bg-[#e8eeff] px-2 py-0.2 rounded-full">
                        {isArabic && supplier.categoryAr ? supplier.categoryAr : supplier.category}
                      </span>
                    </div>
                  </div>
                  <div>{getStatusBadge(supplier.status)}</div>
                </div>

                <div className="space-y-2 text-xs border-t border-[#e3e8f9] pt-3 text-[#161c27]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#70787d]">{isArabic ? 'جهة الاتصال:' : 'Contact:'}</span>
                    <span className="font-semibold">{supplier.contactPerson}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#70787d]">{isArabic ? 'الهاتف:' : 'Phone:'}</span>
                    <span className="font-mono">{supplier.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#70787d]">{isArabic ? 'الموقع:' : 'City:'}</span>
                    <span>
                      {supplier.city}, {supplier.country}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#70787d]">{isArabic ? 'الرقم الضريبي:' : 'Tax ID:'}</span>
                    <span className="font-mono text-emerald-700 font-semibold">{supplier.taxId}</span>
                  </div>
                </div>

                {/* Accounting balance pill */}
                <div className="mt-4 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9] p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-[#70787d] font-semibold uppercase">
                      {isArabic ? 'رصيد الدائنين' : 'Payable (2101)'}
                    </div>
                    <div className="font-mono font-bold text-sm text-[#004a60] mt-0.5">
                      SAR {(supplier.currentBalanceSar ?? supplier.payableOpeningBalance ?? 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#70787d] font-semibold uppercase">
                      {isArabic ? 'شروط السداد' : 'Terms'}
                    </div>
                    <div className="font-medium text-xs text-[#161c27] mt-0.5">
                      {supplier.paymentTerms}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div
                className="mt-4 pt-3 border-t border-[#e3e8f9] flex items-center justify-between text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setInspectingSupplier(supplier)}
                  className="font-semibold text-[#004a60] hover:text-[#074e64] flex items-center gap-1"
                >
                  <span>{isArabic ? 'عرض التفاصيل' : 'View Profile'}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleEditClick(supplier)}
                    className="p-1.5 rounded-lg text-[#70787d] hover:bg-[#e8eeff] hover:text-[#004a60]"
                    title={isArabic ? 'تعديل' : 'Edit'}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(supplier)}
                    className="p-1.5 rounded-lg text-[#70787d] hover:bg-red-50 hover:text-red-600"
                    title={isArabic ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ACCOUNTING LEDGER VIEW */
        <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#e3e8f9] bg-[#f9f9ff] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#161c27]">
                {isArabic ? 'سجل حسابات الموردين والدفعات المقدمة' : 'General Ledger Sub-Account Alignment'}
              </h3>
              <p className="text-[11px] text-[#70787d]">
                {isArabic
                  ? 'الربط المالي بحسابات الأستاذ العام: 2101 (ذمم دائنة) و 1204 (دفعات مقدمة للموردين)'
                  : 'Chart of Accounts mapping: GL 2101 (Trade Payables) & GL 1204 (Advance to Suppliers)'}
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-[#e8eeff] text-[#004a60] px-3 py-1 rounded-lg">
              USALI & SOC-2 Audited
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e3e8f9] bg-[#f9f9ff] text-[10px] font-bold text-[#70787d] uppercase tracking-wider">
                  <th className="py-2.5 px-4">{isArabic ? 'المورد' : 'Supplier'}</th>
                  <th className="py-2.5 px-4">{isArabic ? 'كود حساب الدائنين' : 'Payable Code (GL: 2101)'}</th>
                  <th className="py-2.5 px-4 text-right">{isArabic ? 'الرصيد الافتتاحي (دائن)' : 'Payable Opening (SAR)'}</th>
                  <th className="py-2.5 px-4">{isArabic ? 'تاريخ الافتتاح' : 'Opening Date'}</th>
                  <th className="py-2.5 px-4">{isArabic ? 'كود الدفعات المقدمة' : 'Advance Code (GL: 1204)'}</th>
                  <th className="py-2.5 px-4 text-right">{isArabic ? 'رصيد الدفعات المقدمة' : 'Advance Opening (SAR)'}</th>
                  <th className="py-2.5 px-4">{isArabic ? 'الحساب البنكي (IBAN)' : 'Bank Account (IBAN)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8f9]">
                {filteredSuppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-[#f1f3ff]/40">
                    <td className="py-3 px-4 font-bold text-[#161c27]">{s.name}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#004a60]">{s.payableCode}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#161c27]">
                      SAR {s.payableOpeningBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#70787d]">{s.payableOpeningDate}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-amber-700">{s.advanceCode}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-800">
                      SAR {s.advanceOpeningBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#70787d]">
                      {s.bankAccount || (isArabic ? 'غير مسجل' : 'Not provided')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INSPECT SUPPLIER MODAL / DETAIL DRAWER */}
      {inspectingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl my-6 rounded-2xl bg-white shadow-2xl border border-[#e3e8f9] animate-in zoom-in-95 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#004a60] to-[#003647] text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-xs font-bold text-base">
                  {inspectingSupplier.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{inspectingSupplier.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-cyan-100">
                    <span>{inspectingSupplier.category}</span>
                    <span>•</span>
                    <span>{inspectingSupplier.id}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setInspectingSupplier(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5 text-xs text-[#161c27]">
              {/* Status and quick summary */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                <div>
                  <div className="text-[10px] text-[#70787d] uppercase font-bold">
                    {isArabic ? 'حالة المورد' : 'Supplier Status'}
                  </div>
                  <div className="mt-1">{getStatusBadge(inspectingSupplier.status)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#70787d] uppercase font-bold">
                    {isArabic ? 'الرقم الضريبي ZATCA' : 'Tax ID'}
                  </div>
                  <div className="font-mono font-bold text-[#161c27] mt-1 flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>{inspectingSupplier.taxId}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#70787d] uppercase font-bold">
                    {isArabic ? 'الرصيد الدائن الحالي' : 'Current Payable'}
                  </div>
                  <div className="font-mono font-bold text-[#004a60] text-sm mt-1">
                    SAR {(inspectingSupplier.currentBalanceSar ?? inspectingSupplier.payableOpeningBalance).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-bold text-[#161c27] border-b border-[#e3e8f9] pb-1.5 mb-2.5 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#004a60]" />
                  <span>{isArabic ? 'معلومات الاتصال' : 'Contact Information'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#f9f9ff] p-2.5 rounded-lg border border-[#e3e8f9]">
                    <div className="text-[#70787d] text-[10px]">{isArabic ? 'الشخص المسؤول' : 'Contact Person'}</div>
                    <div className="font-semibold text-xs mt-0.5">{inspectingSupplier.contactPerson}</div>
                  </div>
                  <div className="bg-[#f9f9ff] p-2.5 rounded-lg border border-[#e3e8f9]">
                    <div className="text-[#70787d] text-[10px]">{isArabic ? 'رقم الهاتف' : 'Phone'}</div>
                    <div className="font-mono font-semibold text-xs mt-0.5">{inspectingSupplier.phone}</div>
                  </div>
                  <div className="bg-[#f9f9ff] p-2.5 rounded-lg border border-[#e3e8f9]">
                    <div className="text-[#70787d] text-[10px]">{isArabic ? 'البريد الإلكتروني' : 'Email'}</div>
                    <div className="font-semibold text-xs mt-0.5 truncate">{inspectingSupplier.email}</div>
                  </div>
                </div>
              </div>

              {/* National Address */}
              <div>
                <h4 className="font-bold text-[#161c27] border-b border-[#e3e8f9] pb-1.5 mb-2.5 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#004a60]" />
                  <span>{isArabic ? 'العنوان الوطني السعودي' : 'National Address & Physical Location'}</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-[#f9f9ff] p-2.5 rounded-lg border border-[#e3e8f9]">
                    <div className="text-[#70787d] text-[10px]">{isArabic ? 'العنوان المختصر' : 'Short Address'}</div>
                    <div className="font-mono font-bold text-xs mt-0.5">{inspectingSupplier.shortAddress || '—'}</div>
                  </div>
                  <div className="bg-[#f9f9ff] p-2.5 rounded-lg border border-[#e3e8f9]">
                    <div className="text-[#70787d] text-[10px]">{isArabic ? 'رقم المبنى' : 'Building No.'}</div>
                    <div className="font-mono font-semibold text-xs mt-0.5">{inspectingSupplier.buildingNumber || '—'}</div>
                  </div>
                  <div className="bg-[#f9f9ff] p-2.5 rounded-lg border border-[#e3e8f9]">
                    <div className="text-[#70787d] text-[10px]">{isArabic ? 'الرقم الإضافي' : 'Additional No.'}</div>
                    <div className="font-mono font-semibold text-xs mt-0.5">{inspectingSupplier.additionalNumber || '—'}</div>
                  </div>
                  <div className="bg-[#f9f9ff] p-2.5 rounded-lg border border-[#e3e8f9]">
                    <div className="text-[#70787d] text-[10px]">{isArabic ? 'الرمز البريدي' : 'Postal Code'}</div>
                    <div className="font-mono font-semibold text-xs mt-0.5">{inspectingSupplier.postalCode || '—'}</div>
                  </div>
                </div>

                <div className="mt-2.5 p-3 rounded-lg bg-[#f9f9ff] border border-[#e3e8f9]">
                  <div className="text-[#70787d] text-[10px] mb-0.5">{isArabic ? 'تفاصيل الشارع والحي' : 'Street & City'}</div>
                  <div className="font-semibold text-xs">
                    {inspectingSupplier.streetName}, {inspectingSupplier.district ? `${inspectingSupplier.district}, ` : ''}
                    {inspectingSupplier.city}, {inspectingSupplier.region ? `${inspectingSupplier.region}, ` : ''}
                    {inspectingSupplier.country}
                  </div>
                </div>
              </div>

              {/* Business & Payment Terms */}
              <div>
                <h4 className="font-bold text-[#161c27] border-b border-[#e3e8f9] pb-1.5 mb-2.5 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#004a60]" />
                  <span>{isArabic ? 'شروط السداد والتوريد والحساب البنكي' : 'Commercial & Banking Details'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#f9f9ff] p-3 rounded-lg border border-[#e3e8f9]">
                    <div className="text-[#70787d] text-[10px]">{isArabic ? 'شروط السداد' : 'Payment Terms'}</div>
                    <div className="font-semibold text-xs mt-0.5">{inspectingSupplier.paymentTerms}</div>
                  </div>
                  <div className="bg-[#f9f9ff] p-3 rounded-lg border border-[#e3e8f9]">
                    <div className="text-[#70787d] text-[10px]">{isArabic ? 'شروط التسليم' : 'Delivery Term'}</div>
                    <div className="font-semibold text-xs mt-0.5">{inspectingSupplier.deliveryTerm}</div>
                  </div>
                </div>

                {inspectingSupplier.bankAccount && (
                  <div className="mt-2.5 p-3 rounded-lg bg-[#f9f9ff] border border-[#e3e8f9]">
                    <div className="text-[#70787d] text-[10px] mb-0.5">{isArabic ? 'رقم الآيبان البنكي (IBAN)' : 'IBAN Account'}</div>
                    <div className="font-mono font-bold text-xs text-[#004a60]">{inspectingSupplier.bankAccount}</div>
                  </div>
                )}

                {inspectingSupplier.notes && (
                  <div className="mt-2.5 p-3 rounded-lg bg-[#f9f9ff] border border-[#e3e8f9]">
                    <div className="text-[#70787d] text-[10px] mb-0.5">{isArabic ? 'ملاحظات' : 'Notes'}</div>
                    <div className="text-xs text-[#161c27]">{inspectingSupplier.notes}</div>
                  </div>
                )}
              </div>

              {/* Accounting Ledgers */}
              <div>
                <h4 className="font-bold text-[#161c27] border-b border-[#e3e8f9] pb-1.5 mb-2.5 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[#004a60]" />
                  <span>{isArabic ? 'الدفاتر المحاسبية والأرصدة الافتتاحية' : 'Accounting Ledgers & Opening Balances'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#004a60]">
                      <span>{isArabic ? 'حساب الدائنين' : 'Payable Subledger'}</span>
                      <span className="font-mono">GL: 2101</span>
                    </div>
                    <div className="text-xs font-mono font-semibold mt-1">Code: {inspectingSupplier.payableCode}</div>
                    <div className="text-xs text-[#70787d] mt-1">
                      {isArabic ? 'الرصيد الافتتاحي:' : 'Opening:'} SAR {inspectingSupplier.payableOpeningBalance.toLocaleString()} ({inspectingSupplier.payableOpeningDate})
                    </div>
                  </div>

                  <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-800">
                      <span>{isArabic ? 'حساب الدفعات المقدمة' : 'Advance Subledger'}</span>
                      <span className="font-mono">GL: 1204</span>
                    </div>
                    <div className="text-xs font-mono font-semibold mt-1">Code: {inspectingSupplier.advanceCode}</div>
                    <div className="text-xs text-[#70787d] mt-1">
                      {isArabic ? 'الرصيد الافتتاحي:' : 'Opening:'} SAR {inspectingSupplier.advanceOpeningBalance.toLocaleString()} ({inspectingSupplier.advanceOpeningDate})
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-[#e3e8f9] bg-gray-50">
              <button
                type="button"
                onClick={() => setInspectingSupplier(null)}
                className="rounded-lg border border-[#e3e8f9] bg-white px-4 py-2 font-semibold text-[#40484d] hover:bg-[#f1f3ff]"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const s = inspectingSupplier;
                  setInspectingSupplier(null);
                  handleEditClick(s);
                }}
                className="rounded-lg bg-[#004a60] hover:bg-[#074e64] text-white px-5 py-2 font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>{isArabic ? 'تعديل البيانات' : 'Edit Supplier'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      <AddSupplierModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSupplier(null);
        }}
        isArabic={isArabic}
        onAddSupplier={handleSaveSupplier}
        initialData={editingSupplier}
      />
    </div>
  );
};
