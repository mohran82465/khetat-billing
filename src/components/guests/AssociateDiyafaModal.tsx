import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  Phone,
  Mail,
  CreditCard,
  Building2,
  ArrowRight,
  Sparkles,
  Link2,
} from 'lucide-react';
import { MudabbirGuest, DiyafaAccount } from '../../data/guestsData';

interface AssociateDiyafaModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: MudabbirGuest | null;
  onAssociate: (guestId: string, diyafaAccount: DiyafaAccount) => void;
  isArabic: boolean;
}

export const AssociateDiyafaModal: React.FC<AssociateDiyafaModalProps> = ({
  isOpen,
  onClose,
  guest,
  onAssociate,
  isArabic,
}) => {
  const [searchQuery, setSearchQuery] = useState(guest?.phone || '');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    guest?.potentialMatch?.diyafaAccountId || 'DYF-88219'
  );

  // Sample Diyafa Central Registry accounts for search
  const candidateAccounts = [
    {
      id: guest?.potentialMatch?.diyafaAccountId || 'DYF-90412',
      name: guest?.potentialMatch?.matchedName || guest?.name || 'Ahmed M. Al-Ghamdi',
      nameAr: guest?.nameAr || 'أحمد الغامدي',
      phone: guest?.potentialMatch?.matchedPhone || guest?.phone || '+966 50 123 4567',
      email: guest?.potentialMatch?.matchedEmail || guest?.email || 'ahmed.mohamed@example.com',
      nationalId: guest?.nationalIdOrPassport || '1082918273',
      tier: 'Gold' as const,
      tierAr: 'ذهبي',
      loyaltyPoints: 18400,
      registeredDate: '2025-11-20',
      matchScore: guest?.potentialMatch?.confidenceScore || 96,
      matchReason: isArabic
        ? 'تطابق تام في رقم الجوال المسجل ورقم الهوية الوطنية'
        : 'Exact match on verified mobile number & National ID',
    },
    {
      id: 'DYF-55102',
      name: `${guest?.name?.split(' ')[0] || 'Guest'} Family Corporate Account`,
      nameAr: `حساب عائلي موحد - ${guest?.nameAr?.split(' ')[0] || 'النزيل'}`,
      phone: guest?.phone || '+966 50 000 0000',
      email: `family.${guest?.email?.split('@')[0] || 'guest'}@diyafa.sa`,
      nationalId: '1099887766',
      tier: 'Silver' as const,
      tierAr: 'فضي',
      loyaltyPoints: 4200,
      registeredDate: '2026-02-14',
      matchScore: 78,
      matchReason: isArabic
        ? 'تطابق جزئي في الاسم ورقم الاتصال الإضافي'
        : 'Partial match on secondary contact and surname',
    },
  ];

  if (!isOpen || !guest) return null;

  const handleConfirm = () => {
    const selected = candidateAccounts.find((a) => a.id === selectedAccountId) || candidateAccounts[0];
    const newAccount: DiyafaAccount = {
      accountId: selected.id,
      membershipTier: selected.tier,
      membershipTierAr: selected.tierAr,
      linkedAt: new Date().toISOString().split('T')[0],
      registeredEmail: selected.email,
      registeredPhone: selected.phone,
      loyaltyPoints: selected.loyaltyPoints,
      autoLinked: false,
    };
    onAssociate(guest.id, newAccount);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-[#e3e8f9] shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e3e8f9] bg-[#f9f9ff] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004a60] text-white">
              <Link2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#161c27]">
                {isArabic ? 'ربط الحساب بمنصة ضيافة (Diyafa)' : 'Associate with Diyafa Account'}
              </h2>
              <p className="text-xs text-[#70787d]">
                {isArabic
                  ? 'توحيد سجل النزيل الوارد من مدبّر مع حساب ضيافة لمنع ازدواجية الملفات'
                  : 'Link Mudabbir guest record with Diyafa account to avoid duplicate profiles.'}
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Source Mudabbir Guest Profile Summary */}
          <div className="p-4 rounded-xl border border-[#c3cce6] bg-[#f9f9ff]">
            <span className="text-[10px] font-bold text-[#70787d] uppercase tracking-wider block mb-1">
              {isArabic ? 'الملف الحالي الوارد من مدبّر' : 'Current Mudabbir Profile'}
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#161c27]">
                  {isArabic ? guest.nameAr : guest.name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#70787d] mt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="h-3 w-3 text-[#70787d]" />
                    {guest.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-[#70787d]" />
                    {guest.email}
                  </span>
                </div>
              </div>
              <div className="text-right sm:text-left rtl:sm:text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#e8eeff] text-[#004a60]">
                  <Building2 className="h-3 w-3" />
                  {isArabic ? guest.operatorNameAr : guest.operatorName}
                </span>
                <p className="text-[10px] text-[#70787d] mt-0.5">
                  {isArabic ? guest.propertyNameAr : guest.propertyName}
                </p>
              </div>
            </div>
          </div>

          {/* Search Registry */}
          <div>
            <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
              {isArabic
                ? 'البحث في قاعدة بيانات حسابات ضيافة المعتمدة'
                : 'Search Diyafa Registry (Phone, National ID, or Email)'}
            </label>
            <div className="relative">
              <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 h-4 w-4 text-[#70787d]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isArabic ? 'أدخل رقم الجوال أو الهوية...' : 'Enter phone, email or national ID...'}
                className="w-full rounded-xl border border-[#c3cce6] bg-white py-2 pl-9 pr-3 rtl:pr-9 rtl:pl-3 text-xs text-[#161c27] focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden transition-all font-mono"
              />
            </div>
          </div>

          {/* Candidate Accounts List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#161c27]">
                {isArabic ? 'الحسابات المقترحة للتطابق' : 'Matching Diyafa Accounts Found'}
              </span>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                {candidateAccounts.length} {isArabic ? 'حسابات متاحة' : 'candidates'}
              </span>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {candidateAccounts.map((account) => {
                const isSelected = selectedAccountId === account.id;
                return (
                  <div
                    key={account.id}
                    onClick={() => setSelectedAccountId(account.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#004a60] bg-[#e8eeff]/40 shadow-xs ring-1 ring-[#004a60]'
                        : 'border-[#e3e8f9] bg-white hover:bg-[#f9f9ff]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <input
                          type="radio"
                          name="selectedDiyafa"
                          checked={isSelected}
                          onChange={() => setSelectedAccountId(account.id)}
                          className="mt-1 h-4 w-4 text-[#004a60] focus:ring-[#004a60]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[#161c27]">
                              {isArabic ? account.nameAr : account.name}
                            </h4>
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#004a60] text-white">
                              {account.id}
                            </span>
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              {account.tier}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-[#70787d] mt-1 font-mono">
                            <span>{account.phone}</span>
                            <span>•</span>
                            <span>{account.email}</span>
                            <span>•</span>
                            <span>ID: {account.nationalId}</span>
                          </div>
                          <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                            <Sparkles className="h-3 w-3 text-emerald-600" />
                            {account.matchReason}
                          </p>
                        </div>
                      </div>

                      <div className="text-right rtl:text-left shrink-0">
                        <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          {account.matchScore}% Match
                        </span>
                        <span className="text-[10px] text-[#70787d] block mt-1">
                          {account.loyaltyPoints.toLocaleString()} pts
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Architectural / Non-duplication notice */}
          <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">
                {isArabic ? 'ضمان عدم تكرار سجلات العملاء' : 'Duplicate Profile Prevention Guarantee'}
              </p>
              <p className="text-[11px] text-blue-800 mt-0.5">
                {isArabic
                  ? 'عند تأكيد الربط، سيتم دمج سجل إقامات النزيل في مدبّر بحسابه المركزي في ضيافة، دون إنشاء حساب جديد مكرر.'
                  : 'Associating this Mudabbir profile with Diyafa links historical stays directly into their existing Diyafa identity without duplicating customer records.'}
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e3e8f9]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#c3cce6] bg-white px-4 py-2 text-xs font-semibold text-[#161c27] hover:bg-[#f9f9ff] transition-colors cursor-pointer"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-xl bg-[#004a60] px-5 py-2 text-xs font-bold text-white hover:bg-[#074e64] shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isArabic ? 'تأكيد الربط وعدم التكرار' : 'Associate & Prevent Duplicate'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
