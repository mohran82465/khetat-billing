import React from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Hotel,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Link2,
  Unlink,
  CreditCard,
  Clock,
  Sparkles,
  ExternalLink,
  Award,
  DollarSign,
  FileText,
  Home,
  Tag,
} from 'lucide-react';
import { MudabbirGuest } from '../../data/guestsData';

interface GuestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: MudabbirGuest | null;
  onOpenAssociate: (guest: MudabbirGuest) => void;
  onUnlink: (guestId: string) => void;
  isArabic: boolean;
}

export const GuestDetailsModal: React.FC<GuestDetailsModalProps> = ({
  isOpen,
  onClose,
  guest,
  onOpenAssociate,
  onUnlink,
  isArabic,
}) => {
  if (!isOpen || !guest) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#e3e8f9] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e3e8f9] bg-[#f9f9ff] px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#004a60] text-white font-bold text-sm shadow-xs">
              {guest.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#161c27]">
                  {isArabic ? guest.nameAr : guest.name}
                </h2>
                {guest.vipStatus && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    VIP
                  </span>
                )}
              </div>
              <p className="text-xs text-[#70787d] flex items-center gap-2">
                <span>ID: {guest.id}</span>
                <span>•</span>
                <span className="font-semibold text-[#004a60]">{guest.source}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#70787d] hover:bg-[#e8eeff] hover:text-[#161c27] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* DIYAFA STATUS HERO BANNER */}
          {guest.diyafaStatus === 'registered' && guest.diyafaAccount && (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-900">
                        {isArabic ? 'مرتبط بحساب معتمد في منصة ضيافة' : 'Linked to Verified Diyafa Account'}
                      </span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-emerald-700 text-white">
                        {guest.diyafaAccount.accountId}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 mt-1">
                      {isArabic
                        ? `تم توحيد إقامات هذا النزيل القادم من ${guest.operatorName} مع حسابه المركزي في ضيافة، مما يمنع تكرار السجلات.`
                        : `Stays from ${guest.operatorName} are synchronized with their central Diyafa profile, preventing record duplication.`}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-emerald-900 mt-2">
                      <span>Tier: {guest.diyafaAccount.membershipTier}</span>
                      <span>•</span>
                      <span>Points: {guest.diyafaAccount.loyaltyPoints.toLocaleString()}</span>
                      <span>•</span>
                      <span>Linked: {guest.diyafaAccount.linkedAt}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onUnlink(guest.id)}
                  className="px-3 py-1.5 rounded-xl border border-red-200 bg-white text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-center"
                >
                  <Unlink className="h-3.5 w-3.5" />
                  <span>{isArabic ? 'إلغاء الربط' : 'Unlink Account'}</span>
                </button>
              </div>
            </div>
          )}

          {guest.diyafaStatus === 'match_suggested' && guest.potentialMatch && (
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-700 shrink-0">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-900">
                        {isArabic
                          ? 'تم العثور على حساب مطابق في ضيافة'
                          : 'Potential Diyafa Account Match Detected'}
                      </span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-blue-700 text-white">
                        {guest.potentialMatch.confidenceScore}% Confidence
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-800 mt-1">
                      {isArabic
                        ? `يوجد حساب ضيافة يحمل رقم ${guest.potentialMatch.diyafaAccountId} بنفس رقم الجوال والهوية. اربط الحساب الآن لتجنب ازدواجية الملفات.`
                        : `Existing Diyafa account ${guest.potentialMatch.diyafaAccountId} matches verified mobile and ID. Associate now to prevent duplicate profiles.`}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {guest.potentialMatch.matchCriteria.map((c, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white border border-blue-200 text-blue-800"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenAssociate(guest)}
                  className="px-3.5 py-2 rounded-xl bg-[#004a60] text-white text-xs font-bold hover:bg-[#074e64] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  <span>{isArabic ? 'تأكيد الربط' : 'Associate Account'}</span>
                </button>
              </div>
            </div>
          )}

          {guest.diyafaStatus === 'not_registered' && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">
                      {isArabic ? 'نزيل من مشغّل مدبّر فقط — غير مسجل في ضيافة' : 'Mudabbir Operator Guest — Not Registered on Diyafa'}
                    </span>
                    <p className="text-[11px] text-amber-800 mt-1">
                      {isArabic
                        ? 'هذا النزيل مسجل في نظام مدبّر الخاص بالمشغل فقط، ولا يعتبر تلقائياً نزيلاً مسجلاً في ضيافة. عند تسجيله لاحقاً أو توفر حسابه، يمكن ربطه هنا دون تكرار ملف العميل.'
                        : 'This guest exists in the operator’s Mudabbir PMS and is not automatically considered a Diyafa user. If this guest later registers or already holds an account, associate it here to maintain a unified profile.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenAssociate(guest)}
                  className="px-3 py-1.5 rounded-xl border border-amber-400 bg-white text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs self-start sm:self-center"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  <span>{isArabic ? 'ربط بحساب ضيافة' : 'Link to Diyafa'}</span>
                </button>
              </div>
            </div>
          )}

          {/* SECTION 1: Personal & Contact Information */}
          <div className="bg-[#f9f9ff] rounded-2xl border border-[#e3e8f9] p-4">
            <h3 className="text-xs font-bold text-[#161c27] uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-[#004a60]" />
              <span>{isArabic ? 'المعلومات الشخصية والتعريفية' : 'Personal & Identification Details'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#e3e8f9]">
                <span className="text-[11px] text-[#70787d] block">{isArabic ? 'الاسم بالإنجليزية' : 'Full Name (English)'}</span>
                <span className="font-semibold text-[#161c27]">{guest.name}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e3e8f9]">
                <span className="text-[11px] text-[#70787d] block">{isArabic ? 'الاسم بالعربية' : 'Full Name (Arabic)'}</span>
                <span className="font-semibold text-[#161c27]">{guest.nameAr}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e3e8f9]">
                <span className="text-[11px] text-[#70787d] block">{isArabic ? 'رقم الجوال' : 'Phone Number'}</span>
                <span className="font-semibold text-[#161c27] font-mono">{guest.phone}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e3e8f9]">
                <span className="text-[11px] text-[#70787d] block">{isArabic ? 'البريد الإلكتروني' : 'Email Address'}</span>
                <span className="font-semibold text-[#161c27]">{guest.email}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e3e8f9]">
                <span className="text-[11px] text-[#70787d] block">
                  {isArabic ? `${guest.idType} (رقم الهوية / الجواز)` : `${guest.idType}`}
                </span>
                <span className="font-semibold text-[#161c27] font-mono">{guest.nationalIdOrPassport}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e3e8f9]">
                <span className="text-[11px] text-[#70787d] block">{isArabic ? 'الجنسية' : 'Nationality'}</span>
                <span className="font-semibold text-[#161c27]">
                  {isArabic ? guest.nationalityAr : guest.nationality}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Mudabbir Operator & Property Origin */}
          <div className="bg-[#f9f9ff] rounded-2xl border border-[#e3e8f9] p-4">
            <h3 className="text-xs font-bold text-[#161c27] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#004a60]" />
              <span>{isArabic ? 'مصدر السجل (المشغّل والعقار في مدبّر)' : 'Mudabbir Origin (Operator & Property)'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#e3e8f9]">
                <span className="text-[11px] text-[#70787d] block">{isArabic ? 'المشغّل (Operator)' : 'Associated Operator'}</span>
                <span className="font-bold text-[#161c27] block text-sm">
                  {isArabic ? guest.operatorNameAr : guest.operatorName}
                </span>
                <span className="text-[10px] text-[#70787d] font-mono">ID: {guest.operatorId}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e3e8f9]">
                <span className="text-[11px] text-[#70787d] block">{isArabic ? 'العقار / الوحدة (Property)' : 'Associated Property'}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#161c27] block text-sm">
                    {isArabic ? guest.propertyNameAr : guest.propertyName}
                  </span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-[#e8eeff] text-[#004a60]">
                    {guest.propertyType}
                  </span>
                </div>
                <span className="text-[10px] text-[#70787d] font-mono">
                  {isArabic ? guest.cityAr : guest.city}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e3e8f9]">
                <span className="text-[11px] text-[#70787d] block">{isArabic ? 'قناة المزامنة والمصدر' : 'Source & Integration Channel'}</span>
                <span className="font-semibold text-[#004a60] flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {isArabic ? guest.sourceAr : guest.source}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e3e8f9]">
                <span className="text-[11px] text-[#70787d] block">{isArabic ? 'تاريخ الاستيراد لخطط' : 'Imported into Khetat'}</span>
                <span className="font-semibold text-[#161c27] font-mono">{guest.importedAt}</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: Mudabbir Stays & Consumption History */}
          <div className="bg-[#f9f9ff] rounded-2xl border border-[#e3e8f9] p-4">
            <h3 className="text-xs font-bold text-[#161c27] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#004a60]" />
              <span>{isArabic ? 'سجل الإقامات والتعاملات في مدبّر' : 'Stay & Consumption History in Mudabbir'}</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#e3e8f9] text-center">
                <span className="text-[10px] text-[#70787d] block mb-1">{isArabic ? 'آخر إقامة' : 'Last Stay'}</span>
                <span className="font-bold text-[#161c27] font-mono text-xs">{guest.lastStayDate}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e3e8f9] text-center">
                <span className="text-[10px] text-[#70787d] block mb-1">{isArabic ? 'الوحدة / الغرفة' : 'Last Unit'}</span>
                <span className="font-bold text-[#161c27] text-xs truncate block" title={guest.lastStayUnit}>
                  {guest.lastStayUnit}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e3e8f9] text-center">
                <span className="text-[10px] text-[#70787d] block mb-1">{isArabic ? 'إجمالي الحجوزات' : 'Total Stays'}</span>
                <span className="font-bold text-[#004a60] text-sm font-mono">{guest.totalStaysCount}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e3e8f9] text-center">
                <span className="text-[10px] text-[#70787d] block mb-1">{isArabic ? 'إجمالي الإنفاق' : 'Total Spend'}</span>
                <span className="font-bold text-emerald-700 text-sm font-mono">
                  {guest.totalSpendSar.toLocaleString()} SAR
                </span>
              </div>
            </div>
            {guest.notes && (
              <div className="mt-3 p-3 bg-white rounded-xl border border-[#e3e8f9] text-xs text-[#70787d]">
                <span className="font-bold text-[#161c27] block mb-0.5">{isArabic ? 'ملاحظات المشغّل:' : 'Operator Notes:'}</span>
                <p>{guest.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#e3e8f9] bg-[#f9f9ff] px-6 py-4 shrink-0">
          <div className="text-[11px] text-[#70787d]">
            {isArabic ? 'سجل مركزي في منصة خطط' : 'Central record managed by Khetat Platform'}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#c3cce6] bg-white px-5 py-2 text-xs font-semibold text-[#161c27] hover:bg-[#f9f9ff] transition-colors cursor-pointer"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
