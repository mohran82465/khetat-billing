import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Building2,
  Hotel,
  Phone,
  Mail,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { MudabbirGuest } from '../../data/guestsData';

interface ImportMudabbirGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGuest: (newGuest: MudabbirGuest) => void;
  isArabic: boolean;
}

export const ImportMudabbirGuestModal: React.FC<ImportMudabbirGuestModalProps> = ({
  isOpen,
  onClose,
  onAddGuest,
  isArabic,
}) => {
  const [operator, setOperator] = useState('Al Noor Hotel Group');
  const [property, setProperty] = useState('Al Noor Riyadh Hotel');
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [roomUnit, setRoomUnit] = useState('Deluxe King 301');
  const [totalSpend, setTotalSpend] = useState('1850');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const operatorsList = [
    {
      id: 'ORG-ALNOOR-01',
      name: 'Al Noor Hotel Group',
      nameAr: 'مجموعة فنادق النور',
      properties: [
        { id: 'PROP-NOOR-RYD', name: 'Al Noor Riyadh Hotel', nameAr: 'فندق النور - الرياض', type: 'Hotel' as const, city: 'Riyadh' },
        { id: 'PROP-NOOR-JED', name: 'Al Noor Red Sea Marina Suites', nameAr: 'أجنحة النور البحرية - جدة', type: 'Hotel' as const, city: 'Jeddah' },
      ],
    },
    {
      id: 'ORG-DUR-01',
      name: 'Dur Hospitality Co.',
      nameAr: 'شركة دور للضيافة',
      properties: [
        { id: 'PROP-MAKAR-MAK', name: 'Makarem Ajyad Makkah Hotel', nameAr: 'فندق مكارم أجياد - مكة المكرمة', type: 'Hotel' as const, city: 'Makkah' },
      ],
    },
    {
      id: 'ORG-KHOZAMA-03',
      name: 'Al Khozama Investment & Management',
      nameAr: 'شركة الخزامى للاستثمار والإدارة',
      properties: [
        { id: 'PROP-KHOZ-VILLAS', name: 'Al Khozama Private Chalets & Villas', nameAr: 'شاليهات وفلل الخزامى الخاصة - الدرعية', type: 'Chalet' as const, city: 'Riyadh' },
      ],
    },
    {
      id: 'ORG-DIRIYAH-02',
      name: 'Royal Commission & Diriyah Holding',
      nameAr: 'هيئة تطوير بوابة الدرعية ومشاريع العلا',
      properties: [
        { id: 'PROP-CHEDI-ALULA', name: 'Chedi Hegra Heritage Resort', nameAr: 'منتجع تشيدي الحجر التراثي - العلا', type: 'Resort' as const, city: 'AlUla' },
      ],
    },
    {
      id: 'ORG-BOUDL-05',
      name: 'Boudl Hotels & Resorts Group',
      nameAr: 'مجموعة بودل للفنادق والمنتجعات',
      properties: [
        { id: 'PROP-BOUDL-APT', name: 'Boudl Al Malqa Serviced Aparthotel', nameAr: 'أبارت أوتيل بودل الملقا للشقق المفروشة', type: 'Hotel Apartment' as const, city: 'Riyadh' },
      ],
    },
  ];

  const currentOp = operatorsList.find((o) => o.name === operator) || operatorsList[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = isArabic ? 'الاسم مطلوب' : 'Name is required';
    if (!phone.trim()) newErrors.phone = isArabic ? 'رقم الجوال مطلوب' : 'Phone is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const currentProp = currentOp.properties.find((p) => p.name === property) || currentOp.properties[0];

    const newGuest: MudabbirGuest = {
      id: `MDB-GST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      nameAr: nameAr.trim() || name.trim(),
      phone: phone.startsWith('+') ? phone.trim() : `+966 ${phone.trim()}`,
      email: email.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`,
      nationalIdOrPassport: nationalId.trim() || '10XXXXXXXX',
      idType: 'National ID',
      nationality: 'Saudi Arabia',
      nationalityAr: 'المملكة العربية السعودية',
      source: 'Mudabbir PMS',
      sourceAr: 'نظام مدبّر الفندقي (PMS)',
      operatorId: currentOp.id,
      operatorName: currentOp.name,
      operatorNameAr: currentOp.nameAr,
      propertyId: currentProp.id,
      propertyName: currentProp.name,
      propertyNameAr: currentProp.nameAr,
      propertyType: currentProp.type,
      propertyTypeAr: currentProp.type === 'Hotel' ? 'فندق' : currentProp.type === 'Chalet' ? 'شاليه' : 'شقة مخدومة',
      city: currentProp.city,
      cityAr: currentProp.city === 'Riyadh' ? 'الرياض' : currentProp.city === 'Makkah' ? 'مكة المكرمة' : 'جدة',
      lastStayDate: new Date().toISOString().split('T')[0],
      lastStayUnit: roomUnit.trim() || 'Deluxe King 301',
      totalStaysCount: 1,
      totalSpendSar: parseFloat(totalSpend) || 1200,
      diyafaStatus: 'not_registered',
      createdDate: new Date().toISOString().split('T')[0],
      importedAt: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      notes: 'New reservation feed received from Mudabbir operator PMS.',
      vipStatus: false,
    };

    onAddGuest(newGuest);
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
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#161c27]">
                {isArabic ? 'استيراد نزيل من مشغّل مدبّر' : 'Import / Sync Mudabbir Guest'}
              </h2>
              <p className="text-xs text-[#70787d]">
                {isArabic
                  ? 'تسجيل نزيل وارد من نظام مدبّر وحفظه كسجل منفصل عن حسابات ضيافة'
                  : 'Register incoming guest from Mudabbir operator as an unassociated profile.'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Architectural Notice */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">
                {isArabic ? 'قاعدة عزل الحسابات في خطط' : 'Khetat Isolation Rule'}
              </p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {isArabic
                  ? 'سيبدأ هذا النزيل بحالة "غير مسجل في ضيافة". لن يعتبر عضواً في ضيافة حتى يتم التحقق أو الربط الصريح.'
                  : 'This guest will start with "Not Registered" on Diyafa. They will remain separate until linked.'}
              </p>
            </div>
          </div>

          {/* Operator & Property selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
                {isArabic ? 'المشغّل (Operator) *' : 'Mudabbir Operator *'}
              </label>
              <select
                value={operator}
                onChange={(e) => {
                  setOperator(e.target.value);
                  const op = operatorsList.find((o) => o.name === e.target.value);
                  if (op && op.properties[0]) setProperty(op.properties[0].name);
                }}
                className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3.5 py-2.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden transition-all"
              >
                {operatorsList.map((op) => (
                  <option key={op.id} value={op.name}>
                    {isArabic ? op.nameAr : op.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
                {isArabic ? 'العقار / الوحدة (Property) *' : 'Property *'}
              </label>
              <select
                value={property}
                onChange={(e) => setProperty(e.target.value)}
                className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3.5 py-2.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden transition-all"
              >
                {currentOp.properties.map((prop) => (
                  <option key={prop.id} value={prop.name}>
                    {isArabic ? prop.nameAr : prop.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Guest Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
                {isArabic ? 'اسم النزيل (بالإنجليزية) *' : 'Guest Name (English) *'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                placeholder="e.g. Ahmed Mohamed"
                className={`w-full rounded-xl border ${
                  errors.name ? 'border-red-400 bg-red-50' : 'border-[#c3cce6] bg-[#f9f9ff]'
                } px-3.5 py-2.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden transition-all`}
              />
              {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
                {isArabic ? 'اسم النزيل (بالعربية)' : 'Guest Name (Arabic)'}
              </label>
              <input
                type="text"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="مثال: أحمد محمد"
                className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3.5 py-2.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
                {isArabic ? 'رقم الجوال *' : 'Phone Number *'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                }}
                placeholder="05XXXXXXXX"
                className={`w-full rounded-xl border ${
                  errors.phone ? 'border-red-400 bg-red-50' : 'border-[#c3cce6] bg-[#f9f9ff]'
                } px-3.5 py-2.5 text-xs text-[#161c27] font-mono focus:bg-white focus:border-[#004a60] outline-hidden transition-all`}
              />
              {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
                {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@example.com"
                className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3.5 py-2.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden transition-all"
              />
            </div>
          </div>

          {/* National ID & Room Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
                {isArabic ? 'رقم الهوية / الإقامة' : 'National ID / Iqama'}
              </label>
              <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="10XXXXXXXX"
                className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3.5 py-2.5 text-xs text-[#161c27] font-mono focus:bg-white focus:border-[#004a60] outline-hidden transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
                {isArabic ? 'رقم / نوع الوحدة' : 'Room / Unit'}
              </label>
              <input
                type="text"
                value={roomUnit}
                onChange={(e) => setRoomUnit(e.target.value)}
                placeholder="Suite 401"
                className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3.5 py-2.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
                {isArabic ? 'قيمة الإقامة (SAR)' : 'Stay Spend (SAR)'}
              </label>
              <input
                type="number"
                value={totalSpend}
                onChange={(e) => setTotalSpend(e.target.value)}
                placeholder="1500"
                className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3.5 py-2.5 text-xs text-[#161c27] font-mono focus:bg-white focus:border-[#004a60] outline-hidden transition-all"
              />
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
              type="submit"
              className="rounded-xl bg-[#004a60] px-5 py-2 text-xs font-bold text-white hover:bg-[#074e64] shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isArabic ? 'استيراد النزيل' : 'Import Guest'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
