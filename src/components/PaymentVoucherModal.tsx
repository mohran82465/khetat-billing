import React from 'react';
import {
  X,
  Printer,
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  DollarSign,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SupplierPayment } from '../data/mockData';

interface PaymentVoucherModalProps {
  payment: SupplierPayment | null;
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
}

export const PaymentVoucherModal: React.FC<PaymentVoucherModalProps> = ({
  payment,
  isOpen,
  onClose,
  isArabic,
}) => {
  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#e3e8f9] shadow-2xl overflow-hidden my-6">
        {/* Top Action bar */}
        <div className="flex items-center justify-between border-b border-[#e3e8f9] bg-[#f9f9ff] px-6 py-3.5 print:hidden">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[#004a60]" />
            <span className="font-bold text-xs text-[#161c27]">
              {isArabic ? 'معاينة سند الصرف الرسمي' : 'Official Payment Voucher'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#c3cce6] bg-white text-xs font-semibold text-[#161c27] hover:bg-[#e8eeff] transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-[#004a60]" />
              <span>{isArabic ? 'طباعة السند' : 'Print Voucher'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#70787d] hover:bg-gray-100 hover:text-black transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Voucher Document */}
        <div className="p-8 space-y-6 bg-white text-[#161c27]">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-[#e3e8f9] pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#004a60] flex items-center justify-center text-white font-bold text-sm">
                  H
                </div>
                <div>
                  <h1 className="text-base font-bold tracking-tight text-[#004a60]">
                    {isArabic ? 'شركة الضيافة الفندقية وإدارة المنتجعات' : 'Hospitality Operations & Resort Suites Co.'}
                  </h1>
                  <p className="text-[10px] text-[#70787d]">
                    CR: 1010892019 • VAT: 310928172900003 • Riyadh, KSA
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-1">
                {isArabic ? 'سند صرف - معتمد' : 'PAYMENT VOUCHER'}
              </span>
              <div className="font-mono text-xs font-bold text-[#004a60]">
                {payment.paymentNumber}
              </div>
              <div className="text-[10px] text-[#70787d]">
                {isArabic ? `تاريخ الإصدار: ${payment.paymentDate}` : `Date: ${payment.paymentDate}`}
              </div>
            </div>
          </div>

          {/* Beneficiary & Reference Details */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9] text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#70787d] block mb-1">
                {isArabic ? 'يُصرف إلى السادة (المورد):' : 'Paid To (Supplier):'}
              </span>
              <div className="font-bold text-sm text-[#161c27] flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-[#004a60] shrink-0" />
                <span>{payment.supplierName}</span>
              </div>
              {payment.supplierNameAr && (
                <div className="text-[11px] text-[#70787d] mt-0.5">{payment.supplierNameAr}</div>
              )}
              <div className="text-[11px] text-[#70787d] mt-2">
                {isArabic ? 'سداداً للفاتورة رقم: ' : 'In settlement of Bill #: '}
                <span className="font-mono font-bold text-[#004a60]">{payment.billNumber}</span>
              </div>
            </div>

            <div className="border-l border-[#e3e8f9] pl-4 rtl:border-l-0 rtl:border-r rtl:pr-4">
              <span className="text-[10px] uppercase font-bold text-[#70787d] block mb-1">
                {isArabic ? 'تفاصيل السداد والتحويل:' : 'Disbursement Method:'}
              </span>
              <div className="font-semibold text-[#161c27]">
                {payment.paymentMethod}
              </div>
              <div className="text-[11px] font-mono text-[#004a60] mt-1">
                Ref: {payment.reference || 'N/A'}
              </div>
              <div className="text-[10px] text-[#70787d] mt-1">
                Account: {payment.paidFromAccount || 'Main Treasury Account'}
              </div>
            </div>
          </div>

          {/* Amount Box */}
          <div className="p-4 rounded-xl bg-[#e8eeff] border border-[#004a60]/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#004a60] uppercase">
                {isArabic ? 'المبلغ المصروف رقماً' : 'Disbursed Amount'}
              </span>
              <div className="text-2xl font-mono font-bold text-[#004a60]">
                SAR {payment.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="text-[#70787d]">
                {isArabic ? 'قيمة الفاتورة:' : 'Original Bill:'}{' '}
                <span className="font-mono font-semibold text-[#161c27]">
                  SAR {payment.billAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-[#70787d] mt-1">
                {isArabic ? 'المتبقي بعد السداد:' : 'Remaining Balance:'}{' '}
                <span className="font-mono font-bold text-emerald-700">
                  SAR {payment.remainingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* USALI Double-Entry Accounting Preview */}
          <div>
            <h4 className="text-xs font-bold text-[#161c27] mb-2 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>{isArabic ? 'القيد المحاسبي المترتب على السند (USALI GL Journal)' : 'Accounting Journal Entries'}</span>
            </h4>
            <table className="w-full text-xs border border-[#e3e8f9] rounded-lg overflow-hidden">
              <thead className="bg-[#f9f9ff] text-[10px] font-bold text-[#70787d] uppercase border-b border-[#e3e8f9]">
                <tr>
                  <th className="p-2 text-left">{isArabic ? 'رقم الحساب واسمه' : 'Account & Code'}</th>
                  <th className="p-2 text-right">{isArabic ? 'مدين (DR)' : 'Debit (DR)'}</th>
                  <th className="p-2 text-right">{isArabic ? 'دائن (CR)' : 'Credit (CR)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8f9] font-mono">
                <tr>
                  <td className="p-2 font-sans">
                    <div className="font-semibold text-[#161c27]">2101 - Trade Accounts Payable (موردي الفندق)</div>
                    <div className="text-[10px] text-[#70787d] font-sans">Clearing liability for {payment.supplierName}</div>
                  </td>
                  <td className="p-2 text-right font-bold text-[#004a60]">
                    SAR {payment.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-2 text-right text-[#70787d]">—</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans">
                    <div className="font-semibold text-[#161c27]">{payment.paidFromAccount || '1102 - Alinma Corporate Bank'}</div>
                    <div className="text-[10px] text-[#70787d] font-sans">Bank disbursement wire transfer</div>
                  </td>
                  <td className="p-2 text-right text-[#70787d]">—</td>
                  <td className="p-2 text-right font-bold text-emerald-700">
                    SAR {payment.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-4 gap-4 pt-8 border-t border-[#e3e8f9] text-center text-[10px] text-[#70787d]">
            <div>
              <div className="h-10 border-b border-dashed border-[#c3cce6] mb-1"></div>
              <span>{isArabic ? 'إعداد المحاسب' : 'Prepared By'}</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-[#c3cce6] mb-1"></div>
              <span>{isArabic ? 'تدقيق الحسابات' : 'Audited By'}</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-[#c3cce6] mb-1"></div>
              <span>{isArabic ? 'اعتماد المدير المالي' : 'Approved (CFO)'}</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-[#c3cce6] mb-1"></div>
              <span>{isArabic ? 'توقيع المستلم / البنك' : 'Recipient / Bank Seal'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
