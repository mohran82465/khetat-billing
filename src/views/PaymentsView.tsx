import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
  Printer,
  DollarSign,
  Building2,
  FileText,
  RotateCcw,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { SupplierPayment, SupplierBill, Supplier } from '../data/mockData';
import { RecordPaymentModal } from '../components/RecordPaymentModal';
import { PaymentVoucherModal } from '../components/PaymentVoucherModal';

interface PaymentsViewProps {
  payments: SupplierPayment[];
  bills: SupplierBill[];
  suppliers: Supplier[];
  isArabic: boolean;
  onAddPayment: (payment: SupplierPayment) => void;
  onDeletePayment: (paymentId: string) => void;
  isExternalRecordOpen?: boolean;
  onCloseExternalRecord?: () => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  payments,
  bills,
  suppliers,
  isArabic,
  onAddPayment,
  onDeletePayment,
  isExternalRecordOpen,
  onCloseExternalRecord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [inspectingPayment, setInspectingPayment] = useState<SupplierPayment | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Synchronize external modal trigger if opened from header button
  const effectiveRecordModalOpen = isRecordModalOpen || !!isExternalRecordOpen;
  const handleCloseRecordModal = () => {
    setIsRecordModalOpen(false);
    if (onCloseExternalRecord) {
      onCloseExternalRecord();
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.paymentNumber.toLowerCase().includes(q) ||
        p.billNumber.toLowerCase().includes(q) ||
        p.supplierName.toLowerCase().includes(q) ||
        (p.supplierNameAr && p.supplierNameAr.toLowerCase().includes(q)) ||
        (p.reference && p.reference.toLowerCase().includes(q)) ||
        (p.paymentMethod && p.paymentMethod.toLowerCase().includes(q));

      const matchesMethod = selectedMethod === 'all' || p.paymentMethod === selectedMethod;

      return matchesSearch && matchesMethod;
    });
  }, [payments, searchQuery, selectedMethod]);

  // Metrics matching user specification:
  // Total Payable (SAR 0.00), Total Paid (SAR 0.00), Overdue Payments (0), Overdue Amount (SAR 0.00)
  const metrics = useMemo(() => {
    const totalPaid = payments
      .filter((p) => p.status !== 'Voided')
      .reduce((sum, p) => sum + (p.paidAmount || 0), 0);

    const totalPayable = payments.reduce((sum, p) => sum + (p.remainingAmount || 0), 0);

    const todayStr = '2026-09-28';
    const overdueList = payments.filter(
      (p) => p.status === 'Pending' && p.paymentDate < todayStr
    );
    const overdueCount = overdueList.length;
    const overdueAmount = overdueList.reduce((sum, p) => sum + (p.paidAmount || p.billAmount || 0), 0);

    return {
      totalPayable,
      totalPaid,
      overdueCount,
      overdueAmount,
    };
  }, [payments]);

  const handleSavePaymentAction = (payment: SupplierPayment) => {
    onAddPayment(payment);
    showNotification(
      isArabic
        ? `تم تسجيل سند الصرف ${payment.paymentNumber} بمبلغ SAR ${payment.paidAmount.toLocaleString()} بنجاح`
        : `Payment ${payment.paymentNumber} for SAR ${payment.paidAmount.toLocaleString()} recorded successfully`
    );
  };

  const handleDeleteAction = (payment: SupplierPayment) => {
    const confirmMsg = isArabic
      ? `هل أنت متأكد من إلغاء سند الصرف ${payment.paymentNumber}؟`
      : `Are you sure you want to void payment ${payment.paymentNumber}?`;

    if (window.confirm(confirmMsg)) {
      onDeletePayment(payment.id);
      showNotification(
        isArabic
          ? `تم حذف سند الصرف ${payment.paymentNumber}`
          : `Payment ${payment.paymentNumber} deleted`
      );
    }
  };

  return (
    <div className="space-y-5" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold px-1.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header section matching user specification:
          Payments
          Manage and track supplier payments */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#161c27]">
              {isArabic ? 'المدفوعات' : 'Payments'}
            </h1>
            <p className="text-xs text-[#70787d] mt-1">
              {isArabic
                ? 'إدارة وتتبع مدفوعات وسندات صرف الموردين'
                : 'Manage and track supplier payments'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? 'تسجيل سند صرف' : 'Record Payment'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards matching user specification:
          Total Payable (SAR 0.00)
          Total Paid (SAR 0.00)
          Overdue Payments (0)
          Overdue Amount (SAR 0.00) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Payable */}
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#70787d] uppercase tracking-wider">
              {isArabic ? 'إجمالي المستحق' : 'Total Payable'}
            </span>
            <div className="p-2 rounded-xl bg-[#e8eeff] text-[#004a60]">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold font-mono text-[#161c27]">
            SAR {metrics.totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Total Paid */}
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#70787d] uppercase tracking-wider">
              {isArabic ? 'إجمالي المسدد' : 'Total Paid'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold font-mono text-emerald-700">
            SAR {metrics.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Overdue Payments */}
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#70787d] uppercase tracking-wider">
              {isArabic ? 'المدفوعات المتأخرة' : 'Overdue Payments'}
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold font-mono text-[#161c27]">
            {metrics.overdueCount}
          </div>
        </div>

        {/* Overdue Amount */}
        <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#70787d] uppercase tracking-wider">
              {isArabic ? 'المبلغ المتأخر' : 'Overdue Amount'}
            </span>
            <div className="p-2 rounded-xl bg-red-50 text-red-700">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold font-mono text-red-600">
            SAR {metrics.overdueAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Search Box matching user specification: Search payments */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-[#70787d] ${isArabic ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? 'البحث في المدفوعات...' : 'Search payments'}
              className={`w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] py-2 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden transition-all ${
                isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'
              }`}
            />
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs font-semibold text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden"
            >
              <option value="all">{isArabic ? 'كافة طرق الدفع' : 'All Methods'}</option>
              <option value="Bank Wire (SARIE)">{isArabic ? 'تحويل سريع (SARIE)' : 'SARIE Wire'}</option>
              <option value="Corporate Card">{isArabic ? 'بطاقة ائتمان' : 'Corporate Card'}</option>
              <option value="Cheque">{isArabic ? 'شيك مصرفي' : 'Cheque'}</option>
              <option value="Cash">{isArabic ? 'نقداً' : 'Cash'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table matching user specification:
          PAYMENT # | BILL # | Supplier | PAYMENT DATE | BILL AMOUNT | PAID AMOUNT | REMAINING | Actions */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f9f9ff] text-[11px] text-[#70787d] font-semibold border-b border-[#e3e8f9]">
              <tr>
                <th className="px-4 py-3 font-semibold uppercase">{isArabic ? 'رقم السند' : 'PAYMENT #'}</th>
                <th className="px-4 py-3 font-semibold uppercase">{isArabic ? 'رقم الفاتورة' : 'BILL #'}</th>
                <th className="px-4 py-3 font-semibold uppercase">{isArabic ? 'المورد' : 'Supplier'}</th>
                <th className="px-4 py-3 font-semibold uppercase">{isArabic ? 'تاريخ الدفع' : 'PAYMENT DATE'}</th>
                <th className="px-4 py-3 font-semibold uppercase text-right">{isArabic ? 'قيمة الفاتورة' : 'BILL AMOUNT'}</th>
                <th className="px-4 py-3 font-semibold uppercase text-right">{isArabic ? 'المبلغ المدفوع' : 'PAID AMOUNT'}</th>
                <th className="px-4 py-3 font-semibold uppercase text-right">{isArabic ? 'المتبقي' : 'REMAINING'}</th>
                <th className="px-4 py-3 font-semibold uppercase text-center">{isArabic ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e8f9]">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[#70787d]">
                    <div className="flex flex-col items-center justify-center">
                      <CreditCard className="h-8 w-8 text-[#70787d]/40 mb-2" />
                      <p className="text-sm font-semibold text-[#161c27]">
                        {isArabic ? 'لا توجد مدفوعات.' : 'No payments found.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsRecordModalOpen(true)}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[#004a60] bg-[#e8eeff] hover:bg-[#d5e2ff] text-[#004a60] px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{isArabic ? 'تسجيل سند صرف جديد' : 'Record Payment'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#f9f9ff]/70 transition-colors">
                    {/* PAYMENT # */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-mono font-bold text-[#004a60] flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-[#004a60] shrink-0" />
                        <span>{p.paymentNumber}</span>
                      </div>
                      {p.reference && (
                        <div className="text-[10px] text-[#70787d] font-mono mt-0.5">
                          Ref: {p.reference}
                        </div>
                      )}
                    </td>

                    {/* BILL # */}
                    <td className="px-4 py-3 whitespace-nowrap font-mono font-semibold text-[#161c27]">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3 text-[#70787d]" />
                        <span>{p.billNumber}</span>
                      </div>
                    </td>

                    {/* Supplier */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#161c27]">{p.supplierName}</div>
                      {p.supplierNameAr && (
                        <div className="text-[10px] text-[#70787d]">{p.supplierNameAr}</div>
                      )}
                    </td>

                    {/* PAYMENT DATE */}
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-[#70787d]">
                      {p.paymentDate}
                    </td>

                    {/* BILL AMOUNT */}
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-medium text-[#70787d]">
                      SAR {p.billAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* PAID AMOUNT */}
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold text-emerald-700">
                      SAR {p.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* REMAINING */}
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold text-[#004a60]">
                      SAR {p.remainingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setInspectingPayment(p)}
                          title={isArabic ? 'معاينة سند الصرف' : 'View Voucher'}
                          className="p-1.5 rounded-lg border border-[#c3cce6] hover:bg-[#e8eeff] hover:text-[#004a60] text-[#70787d] transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAction(p)}
                          title={isArabic ? 'إلغاء السند' : 'Void Payment'}
                          className="p-1.5 rounded-lg border border-[#c3cce6] hover:bg-red-50 hover:text-red-700 text-[#70787d] transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination matching user specification:
            Showing 0 of 0 results
            Previous / Next */}
        <div className="bg-[#f9f9ff] border-t border-[#e3e8f9] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#70787d]">
          <div>
            {isArabic ? (
              <span>
                عرض {filteredPayments.length === 0 ? '0' : '1'} من {filteredPayments.length} نتائج
              </span>
            ) : (
              <span>
                Showing {filteredPayments.length === 0 ? '0' : '1'} of {filteredPayments.length} results
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={true}
              className="px-3 py-1.5 rounded-lg border border-[#c3cce6] bg-white text-xs font-semibold text-[#70787d] opacity-50 cursor-not-allowed"
            >
              {isArabic ? 'السابق' : 'Previous'}
            </button>
            <button
              type="button"
              disabled={true}
              className="px-3 py-1.5 rounded-lg border border-[#c3cce6] bg-white text-xs font-semibold text-[#70787d] opacity-50 cursor-not-allowed"
            >
              {isArabic ? 'التالي' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={effectiveRecordModalOpen}
        onClose={handleCloseRecordModal}
        onSavePayment={handleSavePaymentAction}
        bills={bills}
        suppliers={suppliers}
        isArabic={isArabic}
      />

      {/* View / Print Payment Voucher Modal */}
      <PaymentVoucherModal
        payment={inspectingPayment}
        isOpen={!!inspectingPayment}
        onClose={() => setInspectingPayment(null)}
        isArabic={isArabic}
      />
    </div>
  );
};
