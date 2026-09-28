import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Hash,
  ShieldCheck,
} from 'lucide-react';
import { SupplierPayment, SupplierBill, Supplier } from '../data/mockData';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePayment: (payment: SupplierPayment) => void;
  bills: SupplierBill[];
  suppliers: Supplier[];
  isArabic: boolean;
  preselectedBill?: SupplierBill | null;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  onSavePayment,
  bills,
  suppliers,
  isArabic,
  preselectedBill,
}) => {
  const [selectedBillId, setSelectedBillId] = useState<string>('');
  const [paymentNumber, setPaymentNumber] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>('2026-09-28');
  const [billNumber, setBillNumber] = useState<string>('');
  const [supplierId, setSupplierId] = useState<string>('');
  const [supplierName, setSupplierName] = useState<string>('');
  const [billAmount, setBillAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('Bank Wire (SARIE)');
  const [paidFromAccount, setPaidFromAccount] = useState<string>('Alinma Bank Corporate (GL: 1102)');
  const [reference, setReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setPaymentNumber(`PAY-2026-${randomSuffix}`);
      setPaymentDate('2026-09-28');
      setErrors({});

      if (preselectedBill) {
        setSelectedBillId(preselectedBill.id);
        setBillNumber(preselectedBill.billNumber);
        setSupplierId(preselectedBill.supplierId || '');
        setSupplierName(preselectedBill.supplierName);
        const amount = preselectedBill.payableToSupplier ?? preselectedBill.grandTotal ?? 0;
        setBillAmount(amount);
        setPaidAmount(amount);
        setReference(`SR-${Math.floor(10000000 + Math.random() * 90000000)}`);
      } else {
        setSelectedBillId('');
        setBillNumber('');
        setSupplierId('');
        setSupplierName('');
        setBillAmount(0);
        setPaidAmount(0);
        setReference(`SR-${Math.floor(10000000 + Math.random() * 90000000)}`);
      }
    }
  }, [isOpen, preselectedBill]);

  if (!isOpen) return null;

  const handleBillSelect = (billId: string) => {
    setSelectedBillId(billId);
    if (!billId) {
      setBillNumber('');
      setSupplierId('');
      setSupplierName('');
      setBillAmount(0);
      setPaidAmount(0);
      return;
    }
    const foundBill = bills.find((b) => b.id === billId);
    if (foundBill) {
      setBillNumber(foundBill.billNumber);
      setSupplierId(foundBill.supplierId || '');
      setSupplierName(foundBill.supplierName);
      const amount = foundBill.payableToSupplier ?? foundBill.grandTotal ?? 0;
      setBillAmount(amount);
      setPaidAmount(amount);
    }
  };

  const handlePayFull = () => {
    setPaidAmount(billAmount);
  };

  const remainingAmount = Math.max(0, billAmount - (Number(paidAmount) || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!paymentNumber.trim()) {
      newErrors.paymentNumber = isArabic ? 'رقم السند مطلوب' : 'Payment # is required';
    }
    if (!billNumber.trim()) {
      newErrors.billNumber = isArabic ? 'رقم الفاتورة مطلوب' : 'Bill # is required';
    }
    if (!supplierName.trim()) {
      newErrors.supplierName = isArabic ? 'اسم المورد مطلوب' : 'Supplier is required';
    }
    if (!paidAmount || Number(paidAmount) <= 0) {
      newErrors.paidAmount = isArabic ? 'المبلغ المدفوع يجب أن يكون أكبر من صفر' : 'Paid amount must be > 0';
    }
    if (Number(paidAmount) > billAmount && billAmount > 0) {
      newErrors.paidAmount = isArabic ? 'المبلغ المدفوع يتجاوز قيمة الفاتورة' : 'Paid amount exceeds bill amount';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const paymentRecord: SupplierPayment = {
      id: `PAY-${Date.now()}`,
      paymentNumber: paymentNumber.trim(),
      billNumber: billNumber.trim(),
      billId: selectedBillId || undefined,
      supplierId: supplierId || 'SUP-GEN',
      supplierName: supplierName.trim(),
      paymentDate: paymentDate || '2026-09-28',
      billAmount: Number(billAmount) || 0,
      paidAmount: Number(paidAmount) || 0,
      remainingAmount: remainingAmount,
      paymentMethod,
      reference: reference.trim(),
      paidFromAccount,
      notes: notes.trim(),
      status: 'Completed',
      statusAr: 'مكتمل ومسدد',
      createdAt: new Date().toISOString(),
    };

    onSavePayment(paymentRecord);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#e3e8f9] shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e3e8f9] bg-[#f9f9ff] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004a60] text-white">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#161c27]">
                {isArabic ? 'تسجيل سند صرف للمورد (Record Payment)' : 'Record Supplier Payment'}
              </h2>
              <p className="text-xs text-[#70787d]">
                {isArabic
                  ? 'إصدار سند صرف رسمي وخصم من حساب الدائنين والتحويل عبر النظام المصرفي'
                  : 'Issue disbursement voucher, update AP ledger, and clear payable balance'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#70787d] hover:bg-[#e8eeff] hover:text-[#161c27] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Row 1: Payment # and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
                {isArabic ? 'رقم السند (Payment #) *' : 'Payment # *'}
              </label>
              <div className="relative">
                <Hash className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-[#70787d] ${isArabic ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={paymentNumber}
                  onChange={(e) => setPaymentNumber(e.target.value)}
                  placeholder="PAY-2026-0001"
                  className={`w-full rounded-xl border ${
                    errors.paymentNumber ? 'border-red-400 bg-red-50' : 'border-[#c3cce6] bg-[#f9f9ff]'
                  } py-2 text-xs font-mono font-bold text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden ${
                    isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                />
              </div>
              {errors.paymentNumber && (
                <p className="text-[11px] text-red-600 mt-1">{errors.paymentNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
                {isArabic ? 'تاريخ الدفع (Payment Date) *' : 'Payment Date *'}
              </label>
              <div className="relative">
                <Calendar className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-[#70787d] ${isArabic ? 'right-3' : 'left-3'}`} />
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className={`w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] py-2 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden ${
                    isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Row 2: Select Bill or Enter Custom */}
          <div className="p-4 rounded-xl bg-[#f0f4ff]/60 border border-[#d2defc] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#004a60] flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                <span>{isArabic ? 'ربط بفاتورة مورد معتمدة' : 'Link with Approved Bill'}</span>
              </span>
              <span className="text-[11px] text-[#70787d]">
                {bills.length} {isArabic ? 'فواتير متوفرة' : 'bills available'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'اختر الفاتورة' : 'Select Bill'}
                </label>
                <select
                  value={selectedBillId}
                  onChange={(e) => handleBillSelect(e.target.value)}
                  className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden font-mono"
                >
                  <option value="">{isArabic ? '-- اختر فاتورة أو أدخل يدوياً --' : '-- Select bill or manual --'}</option>
                  {bills.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.billNumber} • {b.supplierName.slice(0, 25)} (SAR {(b.payableToSupplier ?? b.grandTotal ?? 0).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'رقم الفاتورة (BILL #) *' : 'BILL # *'}
                </label>
                <input
                  type="text"
                  value={billNumber}
                  onChange={(e) => setBillNumber(e.target.value)}
                  placeholder="BILL-2026-0001"
                  className={`w-full rounded-xl border ${
                    errors.billNumber ? 'border-red-400 bg-red-50' : 'border-[#c3cce6] bg-white'
                  } px-3 py-2 text-xs font-mono font-bold text-[#161c27] focus:border-[#004a60] outline-hidden`}
                />
                {errors.billNumber && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.billNumber}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#161c27] mb-1">
                {isArabic ? 'اسم المورد (Supplier) *' : 'Supplier *'}
              </label>
              <div className="relative">
                <Building2 className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-[#70787d] ${isArabic ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder={isArabic ? 'مثال: شركة الفوزان لمواد البناء' : 'e.g. Al-Fozan Building Materials'}
                  className={`w-full rounded-xl border ${
                    errors.supplierName ? 'border-red-400 bg-red-50' : 'border-[#c3cce6] bg-white'
                  } py-2 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden ${
                    isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                />
              </div>
              {errors.supplierName && (
                <p className="text-[11px] text-red-600 mt-1">{errors.supplierName}</p>
              )}
            </div>
          </div>

          {/* Row 3: Financials (Bill Amount, Paid Amount, Remaining) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#f9f9ff] p-3 rounded-xl border border-[#e3e8f9]">
              <label className="block text-[11px] font-semibold text-[#70787d] mb-1">
                {isArabic ? 'قيمة الفاتورة (BILL AMOUNT)' : 'BILL AMOUNT'}
              </label>
              <div className="relative">
                <span className="text-xs font-mono font-bold text-[#70787d] absolute top-1/2 -translate-y-1/2 left-2.5">
                  SAR
                </span>
                <input
                  type="number"
                  step="any"
                  value={billAmount || ''}
                  onChange={(e) => setBillAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-[#c3cce6] bg-white py-1.5 pl-12 pr-2.5 text-xs font-mono font-bold text-[#161c27] focus:border-[#004a60] outline-hidden"
                />
              </div>
            </div>

            <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-emerald-800">
                  {isArabic ? 'المبلغ المدفوع (PAID AMOUNT) *' : 'PAID AMOUNT *'}
                </label>
                <button
                  type="button"
                  onClick={handlePayFull}
                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 underline"
                >
                  {isArabic ? 'كامل المبلغ' : 'Pay Full'}
                </button>
              </div>
              <div className="relative">
                <span className="text-xs font-mono font-bold text-emerald-700 absolute top-1/2 -translate-y-1/2 left-2.5">
                  SAR
                </span>
                <input
                  type="number"
                  step="any"
                  value={paidAmount || ''}
                  onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={`w-full rounded-lg border ${
                    errors.paidAmount ? 'border-red-400 bg-red-50' : 'border-emerald-300 bg-white'
                  } py-1.5 pl-12 pr-2.5 text-xs font-mono font-bold text-emerald-800 focus:border-emerald-600 outline-hidden`}
                />
              </div>
              {errors.paidAmount && (
                <p className="text-[10px] text-red-600 mt-1">{errors.paidAmount}</p>
              )}
            </div>

            <div className="bg-[#f9f9ff] p-3 rounded-xl border border-[#e3e8f9]">
              <label className="block text-[11px] font-semibold text-[#70787d] mb-1">
                {isArabic ? 'المتبقي (REMAINING)' : 'REMAINING'}
              </label>
              <div className="py-1.5 px-3 rounded-lg bg-white border border-[#c3cce6] font-mono font-bold text-xs text-[#004a60]">
                SAR {remainingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Row 4: Method, Account, Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
                {isArabic ? 'طريقة الدفع' : 'Payment Method'}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden"
              >
                <option value="Bank Wire (SARIE)">{isArabic ? 'تحويل بنكي فوري (سريع - SARIE)' : 'Bank Wire (SARIE)'}</option>
                <option value="Corporate Card">{isArabic ? 'بطاقة ائتمان الشركات' : 'Corporate Card'}</option>
                <option value="Cheque">{isArabic ? 'شيك مصرفي معتمد' : 'Certified Cheque'}</option>
                <option value="Cash">{isArabic ? 'صندوق العهدة / نقداً' : 'Cash / Petty Cash'}</option>
                <option value="SADAD B2B">{isArabic ? 'سداد للأعمال SADAD' : 'SADAD B2B'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
                {isArabic ? 'الخصم من حساب' : 'Paid From Account'}
              </label>
              <select
                value={paidFromAccount}
                onChange={(e) => setPaidFromAccount(e.target.value)}
                className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden font-mono"
              >
                <option value="Alinma Bank Corporate (GL: 1102)">Alinma Corporate (GL: 1102)</option>
                <option value="Saudi National Bank - SNB (GL: 1101)">SNB Treasury (GL: 1101)</option>
                <option value="Petty Cash Safe (GL: 1105)">Petty Cash Safe (GL: 1105)</option>
                <option value="Corporate Visa (GL: 2105)">Corporate Visa (GL: 2105)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
                {isArabic ? 'الرقم المرجعي / الحوالة' : 'Reference / Wire Ref'}
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="SR-99482104"
                className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs font-mono text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden"
              />
            </div>
          </div>

          {/* Row 5: Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
              {isArabic ? 'ملاحظات وتفاصيل السند' : 'Notes / Voucher Description'}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                isArabic
                  ? 'سند صرف مستحقات توريدات فندقية معتمدة ومطابقة لتقرير الفحص والاستلام...'
                  : 'Payment for approved supplier bill upon matching GRN and PO specs...'
              }
              className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] p-3 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e3e8f9]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#c3cce6] bg-white px-4 py-2 text-xs font-semibold text-[#161c27] hover:bg-[#f9f9ff] transition-colors"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#004a60] px-5 py-2 text-xs font-bold text-white hover:bg-[#074e64] shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isArabic ? 'حفظ وإصدار السند' : 'Record Payment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
