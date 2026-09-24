import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Building2,
  Warehouse,
  Plus,
  Trash2,
  Upload,
  AlertCircle,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  Supplier,
  SupplierBill,
  SupplierBillItem,
  HOTEL_PROPERTIES,
} from '../data/mockData';

interface CreateStandardBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
  suppliers: Supplier[];
  onAddBill: (bill: SupplierBill) => void;
  initialData?: SupplierBill | null;
}

const CATEGORIES = [
  { value: 'Hotel Linen & Textiles', labelEn: 'Hotel Linen & Textiles', labelAr: 'مفروشات وبياضات فندقية' },
  { value: 'Smart Lock & IoT Hardware', labelEn: 'Smart Lock & IoT Hardware', labelAr: 'أقفال ذكية وتقنيات الفنادق' },
  { value: 'Guest Amenities & Toiletries', labelEn: 'Guest Amenities & Toiletries', labelAr: 'مستلزمات وكماليات النزلاء' },
  { value: 'Food & Beverage Supplies', labelEn: 'Food & Beverage Supplies', labelAr: 'توريدات الأغذية والمشروبات' },
  { value: 'Cleaning & Housekeeping', labelEn: 'Cleaning & Housekeeping', labelAr: 'نظافة وتدبير منزلي' },
  { value: 'IT & Telecommunication', labelEn: 'IT & Telecommunication', labelAr: 'تقنية المعلومات والاتصالات' },
  { value: 'Kitchen Equipment & Appliances', labelEn: 'Kitchen Equipment & Appliances', labelAr: 'معدات وأجهزة المطابخ الفندقية' },
  { value: 'Maintenance & Facility Works', labelEn: 'Maintenance & Facility Works', labelAr: 'الصيانة وأعمال المرافق' },
];

const UOM_OPTIONS = ['PCS', 'BOX', 'SET', 'KG', 'LTR', 'PACK', 'ROLL', 'MTR'];

const CATALOG_PRESETS = [
  {
    name: '5-Star Egyptian Cotton Bedsheet (King 400TC)',
    nameAr: 'ملاءات سرير قطن مصري فاخر 400 غرزة (كينج)',
    sku: 'TEX-BED-K01',
    category: 'Hotel Linen & Textiles',
    uom: 'SET',
    unitCost: 260.0,
    qty: 50,
  },
  {
    name: 'VingCard Essence RFID BLE Smart Door Lock',
    nameAr: 'أقفال أبواب ذكية VingCard Essence بتقنية RFID و BLE',
    sku: 'IOT-VNG-ESS01',
    category: 'Smart Lock & IoT Hardware',
    uom: 'PCS',
    unitCost: 1450.0,
    qty: 24,
  },
  {
    name: 'RFID Encrypted Guest Keycards (NXP Mifare 1K)',
    nameAr: 'بطاقات مفاتيح ذكية مشفرة للنزلاء (NXP Mifare 1K)',
    sku: 'IOT-CRD-1000',
    category: 'Smart Lock & IoT Hardware',
    uom: 'BOX',
    unitCost: 380.0,
    qty: 15,
  },
  {
    name: 'Artisanal Single-Origin Arabica Coffee Beans (1KG)',
    nameAr: 'حبوب قهوة أرابيكا مختصة مفردة المصدر (1 كجم)',
    sku: 'FNB-COF-ETH01',
    category: 'Food & Beverage Supplies',
    uom: 'KG',
    unitCost: 95.0,
    qty: 40,
  },
  {
    name: 'Organic Sandalwood & Amber Amenities Set (50ml)',
    nameAr: 'طقم مستحضرات عناية عضوية برائحة خشب الصندل والعنبر',
    sku: 'AMN-SND-050',
    category: 'Guest Amenities & Toiletries',
    uom: 'SET',
    unitCost: 18.5,
    qty: 300,
  },
];

export const CreateStandardBillModal: React.FC<CreateStandardBillModalProps> = ({
  isOpen,
  onClose,
  isArabic,
  suppliers,
  onAddBill,
  initialData,
}) => {
  // Bill Information
  const [billNo, setBillNo] = useState('Auto-generated');
  const [issueDate, setIssueDate] = useState('2026-09-24');
  const [supplierId, setSupplierId] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');

  // Bill Items
  const [items, setItems] = useState<SupplierBillItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);

  // Special Instructions / Notes
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Attachment
  const [attachmentName, setAttachmentName] = useState<string | undefined>(undefined);
  const [attachmentSize, setAttachmentSize] = useState<string | undefined>(undefined);

  // Validation & Preset helper
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCatalogPresetMenu, setShowCatalogPresetMenu] = useState(false);

  useEffect(() => {
    if (initialData) {
      setBillNo(initialData.billNumber);
      setIssueDate(initialData.issueDate);
      setSupplierId(initialData.supplierId);
      setPropertyId(initialData.propertyId || '');
      setWarehouseId(initialData.warehouseId || '');
      setItems(initialData.items || []);
      setDiscount(initialData.discount || 0);
      setSpecialInstructions(initialData.notes || '');
      setAttachmentName(initialData.attachmentName);
      setAttachmentSize(initialData.attachmentSize);
      setErrors({});
    } else if (isOpen) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setBillNo(`BILL-2026-${randomSuffix}`);
      setIssueDate(new Date().toISOString().split('T')[0] || '2026-09-24');
      setSupplierId('');
      setPropertyId('');
      setWarehouseId('');
      setItems([]);
      setDiscount(0);
      setSpecialInstructions('');
      setAttachmentName(undefined);
      setAttachmentSize(undefined);
      setErrors({});
    }
  }, [initialData, isOpen]);

  // Selected property & available warehouses
  const selectedProperty = HOTEL_PROPERTIES.find((p) => p.id === propertyId);
  const availableWarehouses = selectedProperty ? selectedProperty.warehouses : [];

  const handlePropertyChange = (newPropId: string) => {
    setPropertyId(newPropId);
    setWarehouseId('');
    if (errors.propertyId) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.propertyId;
        return copy;
      });
    }

    const prop = HOTEL_PROPERTIES.find((p) => p.id === newPropId);
    if (prop && prop.warehouses.length > 0) {
      setWarehouseId(prop.warehouses[0].id);
    }
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const taxableAmount = Math.max(0, subtotal - (Number(discount) || 0));
  const vatAmount = Number((taxableAmount * 0.15).toFixed(2));
  const grandTotal = Number((taxableAmount + vatAmount).toFixed(2));

  // Item operations
  const handleAddItem = () => {
    const newItem: SupplierBillItem = {
      id: `SBI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: '',
      sku: '',
      category: 'Hotel Linen & Textiles',
      uom: 'PCS',
      unitCost: 0,
      qty: 1,
      total: 0,
    };
    setItems((prev) => [...prev, newItem]);
    if (errors.items) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.items;
        return copy;
      });
    }
  };

  const handleAddPresetItem = (preset: typeof CATALOG_PRESETS[0]) => {
    const newItem: SupplierBillItem = {
      id: `SBI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: isArabic ? preset.nameAr : preset.name,
      sku: preset.sku,
      category: preset.category,
      uom: preset.uom,
      unitCost: preset.unitCost,
      qty: preset.qty,
      total: Number((preset.unitCost * preset.qty).toFixed(2)),
    };
    setItems((prev) => [...prev, newItem]);
    setShowCatalogPresetMenu(false);
    if (errors.items) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.items;
        return copy;
      });
    }
  };

  const handleUpdateItem = (index: number, field: keyof SupplierBillItem, value: any) => {
    setItems((prev) => {
      const next = [...prev];
      const item = { ...next[index], [field]: value };
      if (field === 'qty' || field === 'unitCost') {
        const qty = field === 'qty' ? Number(value) || 0 : item.qty;
        const unitCost = field === 'unitCost' ? Number(value) || 0 : item.unitCost;
        item.total = Number((qty * unitCost).toFixed(2));
      }
      next[index] = item;
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Mock File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setAttachmentSize(`${sizeMB} MB`);
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!supplierId) {
      errs.supplierId = isArabic ? 'يرجى اختيار المورد' : 'Supplier is required';
    }
    if (!propertyId) {
      errs.propertyId = isArabic ? 'يرجى اختيار المنشأة' : 'Property is required';
    }
    if (!warehouseId) {
      errs.warehouseId = isArabic ? 'يرجى اختيار المستودع' : 'Warehouse is required';
    }
    if (items.length === 0) {
      errs.items = isArabic ? 'يرجى إضافة بند واحد على الأقل للفاتورة' : 'Add at least one item to the bill';
    } else {
      const hasEmpty = items.some((i) => !i.name.trim() || i.qty <= 0);
      if (hasEmpty) {
        errs.items = isArabic ? 'يرجى التأكد من اسم البند والكمية لجميع البنود' : 'Ensure all items have a name and quantity > 0';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const supplierObj = suppliers.find((s) => s.id === supplierId);
    const propObj = HOTEL_PROPERTIES.find((p) => p.id === propertyId);
    const whObj = propObj?.warehouses.find((w) => w.id === warehouseId);
    const generatedNumber = billNo === 'Auto-generated' || !billNo.trim()
      ? `BILL-2026-${Math.floor(1000 + Math.random() * 9000)}`
      : billNo;

    const newBill: SupplierBill = {
      id: initialData ? initialData.id : generatedNumber,
      billNumber: generatedNumber,
      billType: 'standard',
      issueDate,
      supplierId,
      supplierName: supplierObj ? supplierObj.name : 'Selected Supplier',
      supplierNameAr: supplierObj?.nameAr,
      propertyId,
      propertyName: propObj ? propObj.name : 'Selected Property',
      warehouseId,
      warehouseName: whObj ? whObj.name : 'Central Warehouse',
      items,
      discount: Number(discount) || 0,
      subtotal,
      vatAmount,
      grandTotal,
      payableToSupplier: grandTotal,
      notes: specialInstructions.trim() || undefined,
      attachmentName,
      attachmentSize,
      status: 'Approved',
      statusAr: 'معتمد وجارِ الصرف',
      createdAt: initialData ? initialData.createdAt : new Date().toISOString().split('T')[0],
    };

    onAddBill(newBill);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#e3e8f9] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e8f9] bg-gradient-to-r from-[#f9f9ff] to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#004a60] text-white shadow-xs">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#004a60]">
                {isArabic ? 'فاتورة مورد فندقية معتمدة' : 'Create Bill'}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#161c27]">
                {initialData
                  ? isArabic ? 'تعديل فاتورة المورد' : 'Edit Bill'
                  : isArabic ? 'فاتورة جديدة (New Bill)' : 'New Bill'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#70787d] hover:text-[#161c27] hover:bg-[#f1f3ff] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1 text-xs">
          {/* Bill Information */}
          <div className="bg-[#f9f9ff] rounded-xl border border-[#e3e8f9] p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#e3e8f9]">
              <Package className="h-4 w-4 text-[#004a60]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#004a60]">
                {isArabic ? 'معلومات الفاتورة (Bill Information)' : 'Bill Information'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Bill No. */}
              <div>
                <label className="block text-xs font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'رقم الفاتورة' : 'Bill No.'}
                </label>
                <input
                  type="text"
                  value={billNo}
                  onChange={(e) => setBillNo(e.target.value)}
                  placeholder="Auto-generated"
                  className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs font-mono font-bold text-[#161c27] shadow-2xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden"
                />
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-xs font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'تاريخ الإصدار' : 'Issue Date'}
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs text-[#161c27] shadow-2xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden"
                />
              </div>

              {/* Supplier * */}
              <div>
                <label className="block text-xs font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'المورد *' : 'Supplier *'}
                </label>
                <select
                  value={supplierId}
                  onChange={(e) => {
                    setSupplierId(e.target.value);
                    if (errors.supplierId) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.supplierId;
                        return copy;
                      });
                    }
                  }}
                  className={`w-full rounded-xl border bg-white px-3 py-2 text-xs text-[#161c27] shadow-2xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden ${
                    errors.supplierId ? 'border-red-400 bg-red-50/30' : 'border-[#c3cce6]'
                  }`}
                >
                  <option value="">{isArabic ? 'اختر المورد' : 'Select Supplier'}</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.nameAr ? `(${s.nameAr})` : ''}
                    </option>
                  ))}
                </select>
                {errors.supplierId && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.supplierId}</span>
                  </p>
                )}
              </div>

              {/* Property * */}
              <div>
                <label className="block text-xs font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'المنشأة الفندقية *' : 'Property *'}
                </label>
                <select
                  value={propertyId}
                  onChange={(e) => handlePropertyChange(e.target.value)}
                  className={`w-full rounded-xl border bg-white px-3 py-2 text-xs text-[#161c27] shadow-2xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden ${
                    errors.propertyId ? 'border-red-400 bg-red-50/30' : 'border-[#c3cce6]'
                  }`}
                >
                  <option value="">{isArabic ? 'اختر المنشأة' : 'Select Property'}</option>
                  {HOTEL_PROPERTIES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {isArabic ? p.nameAr : p.name} ({p.city})
                    </option>
                  ))}
                </select>
                {errors.propertyId && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.propertyId}</span>
                  </p>
                )}
              </div>

              {/* Warehouse * (Dynamic based on Property) */}
              <div>
                <label className="block text-xs font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'المستودع *' : 'Warehouse *'}
                </label>
                <select
                  value={warehouseId}
                  disabled={!propertyId}
                  onChange={(e) => {
                    setWarehouseId(e.target.value);
                    if (errors.warehouseId) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.warehouseId;
                        return copy;
                      });
                    }
                  }}
                  className={`w-full rounded-xl border bg-white px-3 py-2 text-xs text-[#161c27] shadow-2xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden ${
                    !propertyId
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      : errors.warehouseId
                      ? 'border-red-400 bg-red-50/30'
                      : 'border-[#c3cce6]'
                  }`}
                >
                  {!propertyId ? (
                    <option value="">
                      {isArabic ? 'اختر المنشأة أولاً لتحميل المستودعات' : 'Select a property first'}
                    </option>
                  ) : (
                    <>
                      <option value="">{isArabic ? 'اختر المستودع' : 'Select Warehouse'}</option>
                      {availableWarehouses.map((w) => (
                        <option key={w.id} value={w.id}>
                          {isArabic ? w.nameAr : w.name} ({w.code})
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {!propertyId ? (
                  <p className="text-[10px] text-[#70787d] mt-1">
                    {isArabic
                      ? 'اختر منشأة فندقية لتحميل مستودعاتها'
                      : 'Select a property to load its warehouses'}
                  </p>
                ) : errors.warehouseId ? (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.warehouseId}</span>
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* Bill Items Area */}
          <div className="bg-white rounded-xl border border-[#e3e8f9] p-4 sm:p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-2 border-b border-[#e3e8f9]">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#004a60]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#004a60]">
                  {isArabic ? `بنود الفاتورة (${items.length})` : `Bill Items (${items.length})`}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Catalog Preset Picker */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCatalogPresetMenu(!showCatalogPresetMenu)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#c3cce6] bg-[#f9f9ff] text-[#004a60] px-3 py-1.5 text-xs font-semibold hover:bg-[#e8eeff] cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>{isArabic ? 'إضافة من الكتالوج' : 'From Catalog'}</span>
                  </button>

                  {showCatalogPresetMenu && (
                    <div
                      className={`absolute top-full mt-1 w-72 bg-white rounded-xl shadow-xl border border-[#e3e8f9] z-20 py-1.5 text-xs ${
                        isArabic ? 'right-0 text-right' : 'left-0 text-left'
                      }`}
                    >
                      <div className="px-3 py-1 font-bold text-[#70787d] text-[10px] uppercase border-b border-[#f1f3ff]">
                        {isArabic ? 'أصناف معتمدة سريعة' : 'Quick Certified Catalog'}
                      </div>
                      <div className="max-h-52 overflow-y-auto divide-y divide-[#f9f9ff]">
                        {CATALOG_PRESETS.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAddPresetItem(p)}
                            className="w-full px-3 py-2 text-left hover:bg-[#f9f9ff] flex flex-col gap-0.5 cursor-pointer"
                          >
                            <span className="font-semibold text-[#161c27]">
                              {isArabic ? p.nameAr : p.name}
                            </span>
                            <span className="font-mono text-[10px] text-[#004a60]">
                              SAR {p.unitCost} / {p.uom}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#004a60] text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-[#074e64] shadow-2xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isArabic ? 'إضافة بند' : 'Add Item'}</span>
                </button>
              </div>
            </div>

            {errors.items && (
              <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errors.items}</span>
              </div>
            )}

            {items.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-[#c3cce6] bg-[#f9f9ff]">
                <Package className="h-8 w-8 text-[#70787d] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-[#70787d] font-medium">
                  {isArabic
                    ? 'لم تتم إضافة أي بنود بعد. انقر على "إضافة بند" لإضافة سطر جديد.'
                    : 'No items added yet. Click "Add Item" to add a new row.'}
                </p>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#004a60] text-white px-3 py-1.5 text-xs font-semibold hover:bg-[#074e64]"
                >
                  <Plus className="h-3 w-3" />
                  <span>{isArabic ? 'إضافة بند' : 'Add Item'}</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="w-full text-xs text-left min-w-[720px]">
                  <thead className="bg-[#f9f9ff] text-[11px] text-[#70787d] font-semibold border-b border-[#e3e8f9]">
                    <tr>
                      <th className="p-2.5 w-[30%]">{isArabic ? 'اسم البند' : 'Item Name'}</th>
                      <th className="p-2.5 w-[14%]">{isArabic ? 'رمز SKU' : 'SKU'}</th>
                      <th className="p-2.5 w-[18%]">{isArabic ? 'التصنيف' : 'Category'}</th>
                      <th className="p-2.5 w-[10%]">{isArabic ? 'الوحدة (UOM)' : 'UOM'}</th>
                      <th className="p-2.5 w-[11%]">{isArabic ? 'سعر الوحدة' : 'Unit Cost'}</th>
                      <th className="p-2.5 w-[7%]">{isArabic ? 'الكمية' : 'Qty'}</th>
                      <th className="p-2.5 w-[10%] text-right">{isArabic ? 'الإجمالي' : 'Total'}</th>
                      <th className="p-2.5 w-[4%] text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e3e8f9]">
                    {items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-[#fcfdff]">
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                            placeholder={isArabic ? 'اسم الصنف والمواصفات' : 'Item Name & Specs'}
                            className="w-full rounded-lg border border-[#c3cce6] bg-white px-2 py-1.5 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.sku}
                            onChange={(e) => handleUpdateItem(idx, 'sku', e.target.value)}
                            placeholder="TEX-001"
                            className="w-full rounded-lg border border-[#c3cce6] bg-white px-2 py-1.5 text-xs font-mono text-[#161c27] focus:border-[#004a60] outline-hidden"
                          />
                        </td>
                        <td className="p-2">
                          <select
                            value={item.category}
                            onChange={(e) => handleUpdateItem(idx, 'category', e.target.value)}
                            className="w-full rounded-lg border border-[#c3cce6] bg-white px-2 py-1.5 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden"
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat.value} value={cat.value}>
                                {isArabic ? cat.labelAr : cat.labelEn}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2">
                          <select
                            value={item.uom}
                            onChange={(e) => handleUpdateItem(idx, 'uom', e.target.value)}
                            className="w-full rounded-lg border border-[#c3cce6] bg-white px-2 py-1.5 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden"
                          >
                            {UOM_OPTIONS.map((uom) => (
                              <option key={uom} value={uom}>
                                {uom}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitCost}
                            onChange={(e) => handleUpdateItem(idx, 'unitCost', parseFloat(e.target.value) || 0)}
                            className="w-full rounded-lg border border-[#c3cce6] bg-white px-2 py-1.5 text-xs font-mono text-right text-[#161c27] focus:border-[#004a60] outline-hidden"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={item.qty}
                            onChange={(e) => handleUpdateItem(idx, 'qty', parseInt(e.target.value, 10) || 1)}
                            className="w-full rounded-lg border border-[#c3cce6] bg-white px-2 py-1.5 text-xs font-mono text-right text-[#161c27] focus:border-[#004a60] outline-hidden"
                          />
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-[#161c27] whitespace-nowrap">
                          SAR {item.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Totals & Breakdown */}
            <div className="mt-4 pt-4 border-t border-[#e3e8f9] flex flex-col sm:flex-row sm:items-start justify-end">
              <div className="w-full sm:w-80 space-y-2 text-xs">
                {/* Discount */}
                <div className="flex items-center justify-between">
                  <span className="text-[#70787d] font-semibold">{isArabic ? 'الخصم (SAR)' : 'Discount (SAR)'}</span>
                  <div className="w-32">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full rounded-lg border border-[#c3cce6] bg-white px-2 py-1 text-xs text-right font-mono text-[#161c27] focus:border-[#004a60] outline-hidden"
                    />
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between text-[#161c27]">
                  <span className="text-[#70787d] font-semibold">{isArabic ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span className="font-mono font-semibold">
                    SAR {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* VAT (15%) */}
                <div className="flex items-center justify-between text-[#161c27]">
                  <span className="text-[#70787d] font-semibold">{isArabic ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)'}</span>
                  <span className="font-mono font-semibold">
                    SAR {vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Grand Total */}
                <div className="flex items-center justify-between pt-2 border-t border-[#e3e8f9] text-sm">
                  <span className="font-bold text-[#161c27]">{isArabic ? 'الإجمالي الكلي' : 'Grand Total'}</span>
                  <span className="font-mono font-bold text-[#004a60] text-base">
                    SAR {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Instructions / Notes */}
          <div className="bg-[#f9f9ff] rounded-xl border border-[#e3e8f9] p-4 sm:p-5">
            <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
              {isArabic ? 'تعليمات خاصة / ملاحظات' : 'Special Instructions / Notes'}
            </label>
            <textarea
              rows={3}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder={
                isArabic
                  ? 'أضف أي تعليمات خاصة أو متطلبات لهذه الفاتورة...'
                  : 'Add any special instructions or requirements for this PO...'
              }
              className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs text-[#161c27] placeholder:text-[#70787d]/60 shadow-2xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden"
            />
          </div>

          {/* Attachment (optional) */}
          <div className="bg-white rounded-xl border border-[#e3e8f9] p-4 sm:p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#004a60] mb-2">
              {isArabic ? 'مرفقات الفاتورة (اختياري)' : 'Attachment (optional)'}
            </h3>

            {!attachmentName ? (
              <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#c3cce6] rounded-xl hover:border-[#004a60] hover:bg-[#f9f9ff] transition-all cursor-pointer">
                <Upload className="h-6 w-6 text-[#70787d] mb-1" />
                <span className="text-xs font-semibold text-[#004a60]">
                  {isArabic
                    ? 'انقر لرفع مستند أمر الشراء أو الفاتورة (PDF, صورة، بحد أقصى 10MB)'
                    : 'Click to upload PO document (PDF, image, max 10MB)'}
                </span>
                <span className="text-[10px] text-[#70787d] mt-0.5">PDF, DOCX, PNG, JPG</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]">
                <div className="flex items-center gap-2 text-xs font-medium text-[#161c27]">
                  <FileText className="h-4 w-4 text-[#004a60]" />
                  <span>{attachmentName}</span>
                  {attachmentSize && <span className="text-[10px] text-[#70787d]">({attachmentSize})</span>}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAttachmentName(undefined);
                    setAttachmentSize(undefined);
                  }}
                  className="text-xs text-red-600 hover:text-red-800 font-semibold"
                >
                  {isArabic ? 'إزالة' : 'Remove'}
                </button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e3e8f9]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#c3cce6] text-xs font-semibold text-[#70787d] hover:bg-gray-100 hover:text-[#161c27] transition-all cursor-pointer"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#004a60] text-white text-xs font-semibold hover:bg-[#074e64] shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {initialData
                  ? isArabic ? 'حفظ التعديلات' : 'Update Bill'
                  : isArabic ? 'إنشاء الفاتورة (Create Bill)' : 'Create Bill'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
