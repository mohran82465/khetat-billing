import React, { useState, useEffect } from 'react';
import { X, Building2, ShieldCheck, Info } from 'lucide-react';
import { Supplier } from '../data/mockData';

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
  onAddSupplier: (supplier: Supplier) => void;
  initialData?: Supplier | null;
}

const CATEGORY_OPTIONS = [
  { value: 'Hotel Linen & Textiles', labelEn: 'Hotel Linen & Textiles', labelAr: 'مفروشات وبياضات فندقية' },
  { value: 'Smart Lock & IoT Hardware', labelEn: 'Smart Lock & IoT Hardware', labelAr: 'أقفال ذكية وتقنيات الفنادق' },
  { value: 'Guest Amenities & Toiletries', labelEn: 'Guest Amenities & Toiletries', labelAr: 'مستلزمات وكماليات النزلاء' },
  { value: 'Food & Beverage Supplies', labelEn: 'Food & Beverage Supplies', labelAr: 'توريدات الأغذية والمشروبات' },
  { value: 'Cleaning & Housekeeping', labelEn: 'Cleaning & Housekeeping', labelAr: 'نظافة وتدبير منزلي' },
  { value: 'IT & Telecommunication', labelEn: 'IT & Telecommunication', labelAr: 'تقنية المعلومات والاتصالات' },
  { value: 'Kitchen Equipment & Appliances', labelEn: 'Kitchen Equipment & Appliances', labelAr: 'معدات وأجهزة المطابخ الفندقية' },
  { value: 'Maintenance & Facility Works', labelEn: 'Maintenance & Facility Works', labelAr: 'الصيانة وأعمال المرافق' },
  { value: 'Printing & Corporate Uniforms', labelEn: 'Printing & Corporate Uniforms', labelAr: 'المطبوعات والزي الموحد' },
];

const STATUS_OPTIONS = [
  { value: 'Active', labelEn: 'Active', labelAr: 'نشط' },
  { value: 'Inactive', labelEn: 'Inactive', labelAr: 'غير نشط' },
  { value: 'Pending Approval', labelEn: 'Pending Approval', labelAr: 'قيد المراجعة والاعتماد' },
  { value: 'Blocked', labelEn: 'Blocked', labelAr: 'محظور' },
];

const COUNTRIES = [
  { code: 'SA', nameEn: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية' },
  { code: 'AE', nameEn: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة' },
  { code: 'BH', nameEn: 'Bahrain', nameAr: 'مملكة البحرين' },
  { code: 'KW', nameEn: 'Kuwait', nameAr: 'دولة الكويت' },
  { code: 'QA', nameEn: 'Qatar', nameAr: 'دولة قطر' },
  { code: 'OM', nameEn: 'Oman', nameAr: 'سلطنة عمان' },
  { code: 'EG', nameEn: 'Egypt', nameAr: 'جمهورية مصر العربية' },
  { code: 'JO', nameEn: 'Jordan', nameAr: 'المملكة الأردنية الهاشمية' },
];

const SAUDI_REGIONS = [
  { nameEn: 'Riyadh Region', nameAr: 'منطقة الرياض' },
  { nameEn: 'Makkah Region', nameAr: 'منطقة مكة المكرمة' },
  { nameEn: 'Eastern Province', nameAr: 'المنطقة الشرقية' },
  { nameEn: 'Madinah Region', nameAr: 'منطقة المدينة المنورة' },
  { nameEn: 'Asir Region', nameAr: 'منطقة عسير' },
  { nameEn: 'Tabuk Region', nameAr: 'منطقة تبوك' },
  { nameEn: 'Al-Qassim Region', nameAr: 'منطقة القصيم' },
  { nameEn: 'Hail Region', nameAr: 'منطقة حائل' },
  { nameEn: 'Jazan Region', nameAr: 'منطقة جازان' },
  { nameEn: 'Najran Region', nameAr: 'منطقة نجران' },
  { nameEn: 'Al-Jouf Region', nameAr: 'منطقة الجوف' },
  { nameEn: 'Northern Borders', nameAr: 'منطقة الحدود الشمالية' },
];

const SAUDI_CITIES = [
  { nameEn: 'Riyadh', nameAr: 'الرياض' },
  { nameEn: 'Jeddah', nameAr: 'جدة' },
  { nameEn: 'Makkah', nameAr: 'مكة المكرمة' },
  { nameEn: 'Madinah', nameAr: 'المدينة المنورة' },
  { nameEn: 'Dammam', nameAr: 'الدمام' },
  { nameEn: 'Al Khobar', nameAr: 'الخبر' },
  { nameEn: 'Dhahran', nameAr: 'الظهران' },
  { nameEn: 'AlUla', nameAr: 'العلا' },
  { nameEn: 'Abha', nameAr: 'أبها' },
  { nameEn: 'Taif', nameAr: 'الطائف' },
  { nameEn: 'Tabuk', nameAr: 'تبوك' },
  { nameEn: 'Jubail', nameAr: 'الجبيل' },
  { nameEn: 'Yanbu', nameAr: 'ينبع' },
  { nameEn: 'Al-Ahsa', nameAr: 'الأحساء' },
  { nameEn: 'Najran', nameAr: 'نجران' },
  { nameEn: 'Jazan', nameAr: 'جازان' },
];

const PAYMENT_TERMS_OPTIONS = [
  { value: 'Net 15 Days', labelEn: 'Net 15 Days', labelAr: 'بعد 15 يوماً' },
  { value: 'Net 30 Days', labelEn: 'Net 30 Days', labelAr: 'بعد 30 يوماً' },
  { value: 'Net 60 Days', labelEn: 'Net 60 Days', labelAr: 'بعد 60 يوماً' },
  { value: 'Net 90 Days', labelEn: 'Net 90 Days', labelAr: 'بعد 90 يوماً' },
  { value: 'Cash on Delivery (COD)', labelEn: 'Cash on Delivery (COD)', labelAr: 'الدفع عند الاستلام (COD)' },
  { value: '100% Advance Payment', labelEn: '100% Advance Payment', labelAr: 'دفعة مقدمة كاملة 100%' },
  { value: '50% Advance, 50% on Delivery', labelEn: '50% Advance, 50% on Delivery', labelAr: '50% دفعة مقدمة و 50% عند التسليم' },
];

const DELIVERY_TERMS_OPTIONS = [
  { value: 'DDP - Delivered Duty Paid', labelEn: 'DDP - Delivered Duty Paid (Recommended)', labelAr: 'DDP - تسليم محل المشتري مدفوع الرسوم والجمارك' },
  { value: 'DAP - Delivered at Place', labelEn: 'DAP - Delivered at Place', labelAr: 'DAP - تسليم في المكان المحدد' },
  { value: 'EXW - Ex Works', labelEn: 'EXW - Ex Works (Factory pickup)', labelAr: 'EXW - تسليم أرض المصنع' },
  { value: 'FOB - Free On Board', labelEn: 'FOB - Free On Board (Port)', labelAr: 'FOB - تسليم على ظهر السفينة' },
  { value: 'CIF - Cost, Insurance and Freight', labelEn: 'CIF - Cost, Insurance and Freight', labelAr: 'CIF - التكلفة والتأمين والشحن' },
];

export const AddSupplierModal: React.FC<AddSupplierModalProps> = ({
  isOpen,
  onClose,
  isArabic,
  onAddSupplier,
  initialData,
}) => {
  // Basic Information
  const [supplierName, setSupplierName] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('Active');

  // Contact Information
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('+966 ');
  const [email, setEmail] = useState('');

  // Address
  const [shortAddress, setShortAddress] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [additionalNumber, setAdditionalNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [district, setDistrict] = useState('');
  const [country, setCountry] = useState('Saudi Arabia');
  const [region, setRegion] = useState('Riyadh Region');
  const [city, setCity] = useState('Riyadh');
  const [postalCode, setPostalCode] = useState('');

  // Business Details
  const [taxId, setTaxId] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [deliveryTerm, setDeliveryTerm] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [notes, setNotes] = useState('');

  // Accounting Details
  const [payableOpeningBalance, setPayableOpeningBalance] = useState('0.00');
  const [payableOpeningDate, setPayableOpeningDate] = useState('2026-09-24');
  const [advanceOpeningBalance, setAdvanceOpeningBalance] = useState('0.00');
  const [advanceOpeningDate, setAdvanceOpeningDate] = useState('2026-09-24');

  // Form error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-calculated preview codes
  const [previewPayableCode, setPreviewPayableCode] = useState('2101-0007');
  const [previewAdvanceCode, setPreviewAdvanceCode] = useState('1204-0007');

  useEffect(() => {
    if (initialData) {
      setSupplierName(initialData.name || '');
      setCategory(initialData.category || '');
      setStatus(initialData.status || 'Active');
      setContactPerson(initialData.contactPerson || '');
      setPhone(initialData.phone || '+966 ');
      setEmail(initialData.email || '');
      setShortAddress(initialData.shortAddress || '');
      setBuildingNumber(initialData.buildingNumber || '');
      setAdditionalNumber(initialData.additionalNumber || '');
      setStreetName(initialData.streetName || '');
      setDistrict(initialData.district || '');
      setCountry(initialData.country || 'Saudi Arabia');
      setRegion(initialData.region || 'Riyadh Region');
      setCity(initialData.city || 'Riyadh');
      setPostalCode(initialData.postalCode || '');
      setTaxId(initialData.taxId || '');
      setPaymentTerms(initialData.paymentTerms || '');
      setDeliveryTerm(initialData.deliveryTerm || '');
      setBankAccount(initialData.bankAccount || '');
      setNotes(initialData.notes || '');
      setPayableOpeningBalance(initialData.payableOpeningBalance?.toString() || '0.00');
      setPayableOpeningDate(initialData.payableOpeningDate || '2026-09-24');
      setAdvanceOpeningBalance(initialData.advanceOpeningBalance?.toString() || '0.00');
      setAdvanceOpeningDate(initialData.advanceOpeningDate || '2026-09-24');
      setPreviewPayableCode(initialData.payableCode || '2101-0007');
      setPreviewAdvanceCode(initialData.advanceCode || '1204-0007');
    } else {
      // Reset form
      setSupplierName('');
      setCategory('');
      setStatus('Active');
      setContactPerson('');
      setPhone('+966 ');
      setEmail('');
      setShortAddress('');
      setBuildingNumber('');
      setAdditionalNumber('');
      setStreetName('');
      setDistrict('');
      setCountry('Saudi Arabia');
      setRegion('Riyadh Region');
      setCity('Riyadh');
      setPostalCode('');
      setTaxId('');
      setPaymentTerms('');
      setDeliveryTerm('');
      setBankAccount('');
      setNotes('');
      setPayableOpeningBalance('0.00');
      setPayableOpeningDate(new Date().toISOString().split('T')[0]);
      setAdvanceOpeningBalance('0.00');
      setAdvanceOpeningDate(new Date().toISOString().split('T')[0]);
      const randNum = Math.floor(10 + Math.random() * 90);
      setPreviewPayableCode(`2101-00${randNum}`);
      setPreviewAdvanceCode(`1204-00${randNum}`);
      setErrors({});
    }
  }, [initialData, isOpen]);

  // When country changes, reset region & city if not Saudi
  const handleCountryChange = (val: string) => {
    setCountry(val);
    if (val === 'Saudi Arabia') {
      setRegion('Riyadh Region');
      setCity('Riyadh');
    } else {
      setRegion('');
      setCity('');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!supplierName.trim()) {
      newErrors.supplierName = isArabic ? 'يرجى إدخال اسم المورد' : 'Supplier name is required';
    }
    if (!category) {
      newErrors.category = isArabic ? 'يرجى اختيار تصنيف المورد' : 'Category is required';
    }
    if (!status) {
      newErrors.status = isArabic ? 'يرجى تحديد حالة المورد' : 'Status is required';
    }
    if (!contactPerson.trim()) {
      newErrors.contactPerson = isArabic ? 'يرجى إدخال اسم الشخص المسؤول' : 'Contact person is required';
    }
    if (!phone.trim() || phone.trim() === '+966') {
      newErrors.phone = isArabic ? 'يرجى إدخال رقم الهاتف' : 'Phone is required';
    }
    if (!email.trim()) {
      newErrors.email = isArabic ? 'يرجى إدخال البريد الإلكتروني' : 'Email is required';
    }
    if (!streetName.trim()) {
      newErrors.streetName = isArabic ? 'يرجى إدخال اسم الشارع' : 'Street name is required';
    }
    if (!country) {
      newErrors.country = isArabic ? 'يرجى اختيار الدولة' : 'Country is required';
    }
    if (!city) {
      newErrors.city = isArabic ? 'يرجى اختيار المدينة' : 'City is required';
    }
    if (!taxId.trim()) {
      newErrors.taxId = isArabic ? 'يرجى إدخال الرقم الضريبي' : 'Tax ID is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const supplierId = initialData?.id || `SUP-${Math.floor(100 + Math.random() * 900)}`;

    const newSupplier: Supplier = {
      id: supplierId,
      name: supplierName.trim(),
      nameAr: isArabic ? supplierName.trim() : initialData?.nameAr,
      category,
      categoryAr: CATEGORY_OPTIONS.find((c) => c.value === category)?.labelAr,
      status: status as any,
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      shortAddress: shortAddress.trim() || (buildingNumber && streetName ? `RHSA${Math.floor(1000 + Math.random() * 9000)}` : ''),
      buildingNumber: buildingNumber.trim(),
      additionalNumber: additionalNumber.trim(),
      streetName: streetName.trim(),
      district: district.trim(),
      region: region.trim(),
      city: city.trim(),
      country: country.trim(),
      postalCode: postalCode.trim(),
      taxId: taxId.trim(),
      paymentTerms: paymentTerms || 'Net 30 Days',
      deliveryTerm: deliveryTerm || 'DDP - Delivered Duty Paid',
      bankAccount: bankAccount.trim(),
      notes: notes.trim(),
      payableCode: initialData?.payableCode || previewPayableCode,
      payableOpeningBalance: parseFloat(payableOpeningBalance) || 0,
      payableOpeningDate: payableOpeningDate || '2026-09-24',
      advanceCode: initialData?.advanceCode || previewAdvanceCode,
      advanceOpeningBalance: parseFloat(advanceOpeningBalance) || 0,
      advanceOpeningDate: advanceOpeningDate || '2026-09-24',
      totalOrdersCount: initialData?.totalOrdersCount || 0,
      totalSpendSar: initialData?.totalSpendSar || 0,
      currentBalanceSar: parseFloat(payableOpeningBalance) || 0,
      lastPurchaseDate: initialData?.lastPurchaseDate || 'Pending PO',
    };

    onAddSupplier(newSupplier);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 rounded-2xl bg-white shadow-2xl border border-[#e3e8f9] animate-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#004a60] to-[#003647] text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-xs">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {initialData
                  ? isArabic
                    ? 'تعديل بيانات المورد'
                    : 'Edit Supplier'
                  : isArabic
                  ? 'إضافة مورد جديد'
                  : 'Add New Supplier'}
              </h2>
              <p className="text-xs text-cyan-100">
                {isArabic
                  ? 'تسجيل مورد معتمد وربطه بشجرة الحسابات والفوترة الضريبية ZATCA'
                  : 'Register verified vendor profile & link to accounting ledger & ZATCA'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[82vh] overflow-y-auto space-y-6 text-xs text-[#161c27]">
          {/* SECTION 1: BASIC INFORMATION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-[#e3e8f9] pb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#004a60] text-white text-[11px] font-bold">
                1
              </span>
              <h3 className="text-sm font-bold text-[#161c27]">
                {isArabic ? 'المعلومات الأساسية' : 'Basic Information'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Supplier Name */}
              <div className="md:col-span-1">
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'اسم المورد *' : 'Supplier Name *'}
                </label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder={isArabic ? 'أدخل اسم المورد' : 'Enter supplier name'}
                  className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden transition-all ${
                    errors.supplierName ? 'border-red-500 bg-red-50/30' : 'border-[#e3e8f9] bg-white'
                  }`}
                />
                {errors.supplierName && <p className="text-red-500 text-[10px] mt-1">{errors.supplierName}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'التصنيف *' : 'Category *'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden transition-all ${
                    errors.category ? 'border-red-500 bg-red-50/30' : 'border-[#e3e8f9] bg-white'
                  }`}
                >
                  <option value="">{isArabic ? 'اختر تصنيفاً...' : 'Select an option'}</option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {isArabic ? cat.labelAr : cat.labelEn}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-[10px] mt-1">{errors.category}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الحالة *' : 'Status *'}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden transition-all ${
                    errors.status ? 'border-red-500 bg-red-50/30' : 'border-[#e3e8f9] bg-white'
                  }`}
                >
                  <option value="">{isArabic ? 'اختر الحالة...' : 'Select status'}</option>
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st.value} value={st.value}>
                      {isArabic ? st.labelAr : st.labelEn}
                    </option>
                  ))}
                </select>
                {errors.status && <p className="text-red-500 text-[10px] mt-1">{errors.status}</p>}
              </div>
            </div>
          </div>

          {/* SECTION 2: CONTACT INFORMATION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-[#e3e8f9] pb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#004a60] text-white text-[11px] font-bold">
                2
              </span>
              <h3 className="text-sm font-bold text-[#161c27]">
                {isArabic ? 'معلومات الاتصال' : 'Contact Information'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Contact Person */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الشخص المسؤول *' : 'Contact Person *'}
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder={isArabic ? 'الاسم الكامل' : 'Full name'}
                  className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden transition-all ${
                    errors.contactPerson ? 'border-red-500 bg-red-50/30' : 'border-[#e3e8f9] bg-white'
                  }`}
                />
                {errors.contactPerson && <p className="text-red-500 text-[10px] mt-1">{errors.contactPerson}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الهاتف *' : 'Phone *'}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966 XX XXX XXXX"
                  className={`w-full rounded-lg border px-3 py-2 text-xs font-mono focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden transition-all ${
                    errors.phone ? 'border-red-500 bg-red-50/30' : 'border-[#e3e8f9] bg-white'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'البريد الإلكتروني *' : 'Email *'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="supplier@example.com"
                  className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden transition-all ${
                    errors.email ? 'border-red-500 bg-red-50/30' : 'border-[#e3e8f9] bg-white'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* SECTION 3: ADDRESS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-[#e3e8f9] pb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#004a60] text-white text-[11px] font-bold">
                3
              </span>
              <div>
                <h3 className="text-sm font-bold text-[#161c27]">{isArabic ? 'العنوان' : 'Address'}</h3>
                <span className="text-[10px] text-[#70787d]">
                  {isArabic ? 'العنوان الوطني السعودي والرمز البريدي' : 'National Address format & Postal code'}
                </span>
              </div>
            </div>

            {/* Row 1: Short Address, Building Number, Additional Number */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'العنوان المختصر' : 'Short Address'}
                </label>
                <input
                  type="text"
                  value={shortAddress}
                  onChange={(e) => setShortAddress(e.target.value)}
                  placeholder="e.g. RHSA7980"
                  className="w-full rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-mono focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'رقم المبنى' : 'Building Number'}
                </label>
                <input
                  type="text"
                  value={buildingNumber}
                  onChange={(e) => setBuildingNumber(e.target.value)}
                  placeholder="1234"
                  className="w-full rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-mono focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الرقم الإضافي' : 'Additional Number'}
                </label>
                <input
                  type="text"
                  value={additionalNumber}
                  onChange={(e) => setAdditionalNumber(e.target.value)}
                  placeholder="5678"
                  className="w-full rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-mono focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Row 2: Street Name, District, Country */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'اسم الشارع *' : 'Street Name *'}
                </label>
                <input
                  type="text"
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                  placeholder={isArabic ? 'اسم الشارع' : 'Street name'}
                  className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden transition-all ${
                    errors.streetName ? 'border-red-500 bg-red-50/30' : 'border-[#e3e8f9] bg-white'
                  }`}
                />
                {errors.streetName && <p className="text-red-500 text-[10px] mt-1">{errors.streetName}</p>}
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الحي' : 'District'}
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder={isArabic ? 'الحي' : 'District'}
                  className="w-full rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الدولة *' : 'Country *'}
                </label>
                <select
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden transition-all ${
                    errors.country ? 'border-red-500 bg-red-50/30' : 'border-[#e3e8f9] bg-white'
                  }`}
                >
                  <option value="">{isArabic ? 'اختر الدولة...' : 'Select country...'}</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.nameEn}>
                      {isArabic ? c.nameAr : c.nameEn}
                    </option>
                  ))}
                </select>
                {errors.country && <p className="text-red-500 text-[10px] mt-1">{errors.country}</p>}
              </div>
            </div>

            {/* Row 3: Region, City, Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Region */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'المنطقة' : 'Region'}
                </label>
                {country === 'Saudi Arabia' ? (
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden"
                  >
                    <option value="">{isArabic ? 'اختر المنطقة...' : 'Select Region...'}</option>
                    {SAUDI_REGIONS.map((r) => (
                      <option key={r.nameEn} value={r.nameEn}>
                        {isArabic ? r.nameAr : r.nameEn}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    disabled={!country}
                    placeholder={
                      !country
                        ? isArabic
                          ? 'اختر الدولة أولاً'
                          : 'Select country first'
                        : isArabic
                        ? 'المنطقة'
                        : 'Region'
                    }
                    className={`w-full rounded-lg border px-3 py-2 text-xs ${
                      !country ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white border-[#e3e8f9]'
                    }`}
                  />
                )}
              </div>

              {/* City */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'المدينة *' : 'City *'}
                </label>
                {country === 'Saudi Arabia' ? (
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden transition-all ${
                      errors.city ? 'border-red-500 bg-red-50/30' : 'border-[#e3e8f9] bg-white'
                    }`}
                  >
                    <option value="">{isArabic ? 'اختر المدينة...' : 'Select City...'}</option>
                    {SAUDI_CITIES.map((c) => (
                      <option key={c.nameEn} value={c.nameEn}>
                        {isArabic ? c.nameAr : c.nameEn}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!country}
                    placeholder={
                      !country
                        ? isArabic
                          ? 'اختر الدولة أولاً'
                          : 'Select country first'
                        : isArabic
                        ? 'المدينة'
                        : 'City'
                    }
                    className={`w-full rounded-lg border px-3 py-2 text-xs ${
                      !country
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : errors.city
                        ? 'border-red-500 bg-red-50/30'
                        : 'bg-white border-[#e3e8f9]'
                    }`}
                  />
                )}
                {errors.city && <p className="text-red-500 text-[10px] mt-1">{errors.city}</p>}
              </div>

              {/* Postal Code */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الرمز البريدي' : 'Postal Code'}
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder={isArabic ? 'الرمز البريدي' : 'Postal code'}
                  className="w-full rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-mono focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: BUSINESS DETAILS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-[#e3e8f9] pb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#004a60] text-white text-[11px] font-bold">
                4
              </span>
              <h3 className="text-sm font-bold text-[#161c27]">
                {isArabic ? 'بيانات الأعمال والفوترة' : 'Business Details'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tax ID */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الرقم الضريبي *' : 'Tax ID *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder={isArabic ? 'الرقم الضريبي (15 رقماً)' : 'Tax ID number'}
                    className={`w-full rounded-lg border px-3 py-2 text-xs font-mono focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden transition-all ${
                      errors.taxId ? 'border-red-500 bg-red-50/30' : 'border-[#e3e8f9] bg-white'
                    }`}
                  />
                  <div className="absolute right-2.5 top-2 text-emerald-600 pointer-events-none">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                </div>
                {errors.taxId && <p className="text-red-500 text-[10px] mt-1">{errors.taxId}</p>}
              </div>

              {/* Payment Terms */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'شروط السداد' : 'Payment Terms'}
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden"
                >
                  <option value="">{isArabic ? 'اختر خياراً...' : 'Select an option'}</option>
                  {PAYMENT_TERMS_OPTIONS.map((pt) => (
                    <option key={pt.value} value={pt.value}>
                      {isArabic ? pt.labelAr : pt.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Term */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'شروط التسليم' : 'Delivery Term'}
                </label>
                <select
                  value={deliveryTerm}
                  onChange={(e) => setDeliveryTerm(e.target.value)}
                  className="w-full rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden"
                >
                  <option value="">{isArabic ? 'اختر خياراً...' : 'Select an option'}</option>
                  {DELIVERY_TERMS_OPTIONS.map((dt) => (
                    <option key={dt.value} value={dt.value}>
                      {isArabic ? dt.labelAr : dt.labelEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bank Account (Optional) */}
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">
                {isArabic ? 'الحساب البنكي (اختياري)' : 'Bank Account (Optional)'}
              </label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="IBAN (e.g. SA0380000000608010167519)"
                className="w-full rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-mono focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden"
              />
            </div>

            {/* Notes (Optional) */}
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">
                {isArabic ? 'ملاحظات (اختياري)' : 'Notes (Optional)'}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  isArabic
                    ? 'ملاحظات إضافية حول المورد، شروط التوريد، أوقات التسليم...'
                    : 'Additional notes about the supplier'
                }
                className="w-full rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden"
              />
            </div>
          </div>

          {/* SECTION 5: ACCOUNTING DETAILS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-[#e3e8f9] pb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#004a60] text-white text-[11px] font-bold">
                5
              </span>
              <div>
                <h3 className="text-sm font-bold text-[#161c27]">
                  {isArabic ? 'البيانات المحاسبية وشجرة الحسابات' : 'Accounting Details'}
                </h3>
                <span className="text-[10px] text-[#70787d]">
                  {isArabic
                    ? 'ربط المورد بدفتر الأستاذ العام وحساب الدائنين والدفعات المقدمة'
                    : 'Link supplier to General Ledger accounts payable and supplier advance records'}
                </span>
              </div>
            </div>

            {/* Payable Subledger Box */}
            <div className="rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#004a60] flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#004a60]"></span>
                  {isArabic ? 'حساب المورد الدائن (Payable Subledger)' : 'Suppliers Payable Ledger'}
                </span>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-semibold">
                  GL: 2101
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'كود حساب المورد الدائن' : 'Suppliers Payable Code'}
                  </label>
                  <div className="flex items-center justify-between rounded-lg border border-[#e3e8f9] bg-gray-100 px-3 py-2 text-xs font-mono text-[#70787d]">
                    <span>{previewPayableCode}</span>
                    <span className="text-[10px] text-gray-500 font-sans">
                      {isArabic ? 'توليد تلقائي عند الحفظ' : 'Auto-generated on save'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'الرصيد الافتتاحي (SAR)' : 'Opening Balance'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={payableOpeningBalance}
                    onChange={(e) => setPayableOpeningBalance(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-mono focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'تاريخ الرصيد الافتتاحي' : 'Opening Balance Date'}
                  </label>
                  <input
                    type="date"
                    value={payableOpeningDate}
                    onChange={(e) => setPayableOpeningDate(e.target.value)}
                    className="w-full rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-mono focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Supplier Advances Box */}
            <div className="rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-700 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-600"></span>
                  {isArabic ? 'حساب الدفعات المقدمة للمورد (Supplier Advances)' : 'Supplier Advances Subledger'}
                </span>
                <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-semibold">
                  GL: 1204
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'كود الدفعات المقدمة' : 'Supplier Advances Code'}
                  </label>
                  <div className="flex items-center justify-between rounded-lg border border-[#e3e8f9] bg-gray-100 px-3 py-2 text-xs font-mono text-[#70787d]">
                    <span>{previewAdvanceCode}</span>
                    <span className="text-[10px] text-gray-500 font-sans">
                      {isArabic ? 'توليد تلقائي عند الحفظ' : 'Auto-generated on save'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'الرصيد الافتتاحي (SAR)' : 'Opening Balance'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={advanceOpeningBalance}
                    onChange={(e) => setAdvanceOpeningBalance(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-mono focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'تاريخ الرصيد الافتتاحي' : 'Opening Balance Date'}
                  </label>
                  <input
                    type="date"
                    value={advanceOpeningDate}
                    onChange={(e) => setAdvanceOpeningDate(e.target.value)}
                    className="w-full rounded-lg border border-[#e3e8f9] bg-white px-3 py-2 text-xs font-mono focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e3e8f9]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#e3e8f9] bg-white px-5 py-2.5 font-semibold text-[#40484d] hover:bg-[#f1f3ff] transition-colors cursor-pointer"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#004a60] hover:bg-[#074e64] text-white px-6 py-2.5 font-semibold shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              <span>
                {initialData
                  ? isArabic
                    ? 'حفظ التعديلات'
                    : 'Save Changes'
                  : isArabic
                  ? 'إضافة مورد'
                  : 'Add Supplier'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
