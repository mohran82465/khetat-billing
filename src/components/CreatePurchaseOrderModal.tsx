import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Building2,
  Calendar,
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
  PurchaseOrder,
  PurchaseOrderItem,
  HOTEL_PROPERTIES,
  HotelProperty,
} from '../data/mockData';

interface CreatePurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
  suppliers: Supplier[];
  onAddPurchaseOrder: (po: PurchaseOrder) => void;
  initialData?: PurchaseOrder | null;
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
  { value: 'Printing & Corporate Uniforms', labelEn: 'Printing & Corporate Uniforms', labelAr: 'المطبوعات والزي الموحد' },
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
    name: 'Plush Velour Bathrobe 500 GSM with Monogram',
    nameAr: 'أرواب حمام مخملية فاخرة 500 جم مطرزة بشعار الفندق',
    sku: 'TEX-ROB-500',
    category: 'Hotel Linen & Textiles',
    uom: 'PCS',
    unitCost: 145.0,
    qty: 40,
  },
  {
    name: 'VingCard Essence RFID BLE Smart Door Lock',
    nameAr: 'أقفال أبواب ذكية VingCard Essence بتقنية RFID و BLE',
    sku: 'IOT-VNG-ESS01',
    category: 'Smart Lock & IoT Hardware',
    uom: 'PCS',
    unitCost: 1450.0,
    qty: 20,
  },
  {
    name: 'RFID Encrypted Guest Keycards (NXP Mifare 1K)',
    nameAr: 'بطاقات مفاتيح ذكية مشفرة للنزلاء (NXP Mifare 1K)',
    sku: 'IOT-CRD-1000',
    category: 'Smart Lock & IoT Hardware',
    uom: 'BOX',
    unitCost: 380.0,
    qty: 10,
  },
  {
    name: 'Organic Sandalwood & Amber Vanity Amenities Set',
    nameAr: 'طقم مستحضرات عناية عضوية برائحة خشب الصندل والعنبر',
    sku: 'AMN-SND-050',
    category: 'Guest Amenities & Toiletries',
    uom: 'SET',
    unitCost: 18.5,
    qty: 500,
  },
  {
    name: 'Artisanal Single-Origin Arabica Coffee Beans (1KG)',
    nameAr: 'حبوب قهوة أرابيكا مختصة مفردة المصدر (1 كجم)',
    sku: 'FNB-COF-ETH01',
    category: 'Food & Beverage Supplies',
    uom: 'KG',
    unitCost: 95.0,
    qty: 30,
  },
  {
    name: 'Hospitality Sanitizer & Surface Disinfectant (SFDA 5L)',
    nameAr: 'معقم ومطهر أسطح فندقي معتمد من هيئة الغذاء والدواء (5 لتر)',
    sku: 'CLN-DIS-005',
    category: 'Cleaning & Housekeeping',
    uom: 'BOX',
    unitCost: 120.0,
    qty: 25,
  },
];

export const CreatePurchaseOrderModal: React.FC<CreatePurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  isArabic,
  suppliers,
  onAddPurchaseOrder,
  initialData,
}) => {
  // PO Information
  const [poNumber, setPoNumber] = useState('PO-2026-0001');
  const [issueDate, setIssueDate] = useState('2026-09-24');
  const [supplierId, setSupplierId] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [requestedDeliveryDate, setRequestedDeliveryDate] = useState('');

  // PO Items
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);

  // Special Instructions
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Shipping Address
  const [shortAddress, setShortAddress] = useState('');
  const [buildingNo, setBuildingNo] = useState('');
  const [secondaryNo, setSecondaryNo] = useState('');
  const [streetName, setStreetName] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Contact Details
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Attachment
  const [attachmentName, setAttachmentName] = useState<string | undefined>(undefined);
  const [attachmentSize, setAttachmentSize] = useState<string | undefined>(undefined);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCatalogPresetMenu, setShowCatalogPresetMenu] = useState(false);

  // When initialData changes or modal opens
  useEffect(() => {
    if (initialData) {
      setPoNumber(initialData.poNumber);
      setIssueDate(initialData.issueDate);
      setSupplierId(initialData.supplierId);
      setPropertyId(initialData.propertyId);
      setWarehouseId(initialData.warehouseId);
      setRequestedDeliveryDate(initialData.requestedDeliveryDate);
      setItems(initialData.items || []);
      setDiscount(initialData.discount || 0);
      setSpecialInstructions(initialData.specialInstructions || '');
      setShortAddress(initialData.shippingAddress.shortAddress || '');
      setBuildingNo(initialData.shippingAddress.buildingNo || '');
      setSecondaryNo(initialData.shippingAddress.secondaryNo || '');
      setStreetName(initialData.shippingAddress.streetName || '');
      setDistrict(initialData.shippingAddress.district || '');
      setCity(initialData.shippingAddress.city || '');
      setPostalCode(initialData.shippingAddress.postalCode || '');
      setContactName(initialData.contactDetails.contactName || '');
      setPhone(initialData.contactDetails.phone || '');
      setEmail(initialData.contactDetails.email || '');
      setAttachmentName(initialData.attachmentName);
      setAttachmentSize(initialData.attachmentSize);
    } else if (isOpen) {
      // Auto-generate next PO number
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setPoNumber(`PO-2026-${randomSuffix}`);
      setIssueDate(new Date().toISOString().split('T')[0] || '2026-09-24');
      setSupplierId('');
      setPropertyId('');
      setWarehouseId('');
      setRequestedDeliveryDate('');
      setItems([]);
      setDiscount(0);
      setSpecialInstructions('');
      setShortAddress('');
      setBuildingNo('');
      setSecondaryNo('');
      setStreetName('');
      setDistrict('');
      setCity('');
      setPostalCode('');
      setContactName('');
      setPhone('');
      setEmail('');
      setAttachmentName(undefined);
      setAttachmentSize(undefined);
      setErrors({});
    }
  }, [initialData, isOpen]);

  // When Property selection changes, load Warehouses & auto-populate shipping and contact details
  const selectedProperty = HOTEL_PROPERTIES.find((p) => p.id === propertyId);
  const availableWarehouses = selectedProperty ? selectedProperty.warehouses : [];

  const handlePropertyChange = (newPropId: string) => {
    setPropertyId(newPropId);
    setWarehouseId(''); // Reset warehouse selection
    if (errors.propertyId) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.propertyId;
        return copy;
      });
    }

    const prop = HOTEL_PROPERTIES.find((p) => p.id === newPropId);
    if (prop) {
      // Auto-fill shipping address and contact details
      setShortAddress(prop.shippingAddress.shortAddress);
      setBuildingNo(prop.shippingAddress.buildingNo);
      setSecondaryNo(prop.shippingAddress.secondaryNo);
      setStreetName(prop.shippingAddress.streetName);
      setDistrict(prop.shippingAddress.district);
      setCity(prop.shippingAddress.city);
      setPostalCode(prop.shippingAddress.postalCode);
      setContactName(prop.contactDetails.contactName);
      setPhone(prop.contactDetails.phone);
      setEmail(prop.contactDetails.email);

      // Default to first warehouse if available
      if (prop.warehouses.length > 0) {
        setWarehouseId(prop.warehouses[0].id);
      }
    } else {
      setShortAddress('');
      setBuildingNo('');
      setSecondaryNo('');
      setStreetName('');
      setDistrict('');
      setCity('');
      setPostalCode('');
      setContactName('');
      setPhone('');
      setEmail('');
    }
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const taxableAmount = Math.max(0, subtotal - (Number(discount) || 0));
  const vatAmount = Number((taxableAmount * 0.15).toFixed(2));
  const grandTotal = Number((taxableAmount + vatAmount).toFixed(2));

  // Item row operations
  const handleAddItem = () => {
    const newItem: PurchaseOrderItem = {
      id: `POI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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
    const newItem: PurchaseOrderItem = {
      id: `POI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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

  const handleUpdateItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
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

  // Form Validation & Submission
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!supplierId) {
      errs.supplierId = isArabic ? 'يرجى اختيار المورد' : 'Supplier is required';
    }
    if (!propertyId) {
      errs.propertyId = isArabic ? 'يرجى اختيار المنشأة الفندقية' : 'Property is required';
    }
    if (!warehouseId) {
      errs.warehouseId = isArabic ? 'يرجى تحديد المستودع' : 'Warehouse is required';
    }
    if (!requestedDeliveryDate) {
      errs.requestedDeliveryDate = isArabic ? 'يرجى تحديد تاريخ التسليم المطلوب' : 'Requested delivery date is required';
    }
    if (items.length === 0) {
      errs.items = isArabic ? 'يرجى إضافة بند واحد على الأقل لأمر الشراء' : 'Add at least one line item to the PO';
    } else {
      const hasEmptyItem = items.some((it) => !it.name.trim() || it.qty <= 0);
      if (hasEmptyItem) {
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

    const newPO: PurchaseOrder = {
      id: initialData ? initialData.id : poNumber,
      poNumber: poNumber.trim() || `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: issueDate || '2026-09-24',
      supplierId,
      supplierName: supplierObj ? supplierObj.name : 'Selected Supplier',
      supplierNameAr: supplierObj?.nameAr,
      propertyId,
      propertyName: propObj ? propObj.name : 'Selected Property',
      warehouseId,
      warehouseName: whObj ? whObj.name : 'Central Warehouse',
      requestedDeliveryDate,
      items,
      discount: Number(discount) || 0,
      subtotal,
      vatAmount,
      grandTotal,
      specialInstructions: specialInstructions.trim() || undefined,
      shippingAddress: {
        shortAddress,
        buildingNo,
        secondaryNo,
        streetName,
        district,
        city,
        postalCode,
      },
      contactDetails: {
        contactName,
        phone,
        email,
      },
      attachmentName,
      attachmentSize,
      status: initialData ? initialData.status : 'Approved',
      statusAr: initialData ? initialData.statusAr : 'معتمد وجارِ التوريد',
      createdAt: initialData ? initialData.createdAt : new Date().toISOString().split('T')[0],
    };

    onAddPurchaseOrder(newPO);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#e3e8f9] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e8f9] bg-gradient-to-r from-[#f9f9ff] to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#004a60] text-white shadow-xs">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#004a60]">
                {isArabic ? 'إدارة المشتريات والتوريدات' : 'Procurement & Supply Chain'}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#161c27]">
                {initialData
                  ? isArabic ? 'تعديل أمر الشراء' : 'Edit Purchase Order'
                  : isArabic ? 'إنشاء أمر شراء جديد (New Purchase Order)' : 'New Purchase Order'}
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
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          {/* Section 1: PO Information */}
          <div className="bg-[#f9f9ff] rounded-xl border border-[#e3e8f9] p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#e3e8f9]">
              <Package className="h-4 w-4 text-[#004a60]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#004a60]">
                {isArabic ? 'معلومات أمر الشراء (PO Information)' : 'PO Information'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* PO Number */}
              <div>
                <label className="block text-xs font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'رقم أمر الشراء' : 'PO Number'}
                </label>
                <input
                  type="text"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  placeholder="PO-2026-0001"
                  className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs font-mono font-bold text-[#161c27] shadow-2xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden"
                />
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-xs font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'تاريخ الإصدار' : 'Issue Date'}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs text-[#161c27] shadow-2xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden"
                  />
                </div>
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
                      {s.name} {s.nameAr ? `(${s.nameAr})` : ''} - {s.category}
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
                      ? 'اختر منشأة فندقية لتحميل مستودعاتها المعتمدة'
                      : 'Select a property to load its warehouses'}
                  </p>
                ) : errors.warehouseId ? (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.warehouseId}</span>
                  </p>
                ) : null}
              </div>

              {/* Requested Delivery Date * */}
              <div>
                <label className="block text-xs font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'تاريخ التسليم المطلوب *' : 'Requested Delivery Date *'}
                </label>
                <input
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={requestedDeliveryDate}
                  onChange={(e) => {
                    setRequestedDeliveryDate(e.target.value);
                    if (errors.requestedDeliveryDate) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.requestedDeliveryDate;
                        return copy;
                      });
                    }
                  }}
                  className={`w-full rounded-xl border bg-white px-3 py-2 text-xs text-[#161c27] shadow-2xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden ${
                    errors.requestedDeliveryDate ? 'border-red-400 bg-red-50/30' : 'border-[#c3cce6]'
                  }`}
                />
                {errors.requestedDeliveryDate && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.requestedDeliveryDate}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: PO Items Area */}
          <div className="bg-white rounded-xl border border-[#e3e8f9] p-4 sm:p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-2 border-b border-[#e3e8f9]">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#004a60]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#004a60]">
                  {isArabic
                    ? `بنود أمر الشراء (${items.length})`
                    : `PO Items (${items.length})`}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Catalog Quick Preset Helper */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCatalogPresetMenu(!showCatalogPresetMenu)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#c3cce6] bg-[#f9f9ff] text-[#004a60] px-3 py-1.5 text-xs font-semibold hover:bg-[#e8eeff] transition-all cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>{isArabic ? 'إضافة من الكتالوج الفندقي' : 'From Catalog'}</span>
                  </button>

                  {showCatalogPresetMenu && (
                    <div
                      className={`absolute top-full mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-[#e3e8f9] z-20 py-2 text-xs ${
                        isArabic ? 'right-0 text-right' : 'left-0 text-left'
                      }`}
                    >
                      <div className="px-3 py-1.5 font-bold text-[#70787d] border-b border-[#e3e8f9] text-[10px] uppercase">
                        {isArabic ? 'أصناف معتمدة سريعة الإضافة' : 'Quick Certified Catalog Items'}
                      </div>
                      <div className="max-h-56 overflow-y-auto divide-y divide-[#f1f3ff]">
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
                            <div className="flex items-center justify-between text-[10px] text-[#70787d]">
                              <span>SKU: {p.sku}</span>
                              <span className="font-mono text-[#004a60] font-bold">
                                SAR {p.unitCost} / {p.uom}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Add Item Button */}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#004a60] text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-[#074e64] shadow-2xs transition-all cursor-pointer"
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

            {/* Items Table */}
            {items.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-[#c3cce6] bg-[#f9f9ff]">
                <Package className="h-8 w-8 text-[#70787d] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-[#70787d] font-medium">
                  {isArabic
                    ? 'لم تتم إضافة أي بنود بعد. انقر على "إضافة بند" لإضافة سطر جديد أو اختر من الكتالوج.'
                    : 'No items added yet. Click "Add Item" to add a new row.'}
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#004a60] text-white px-3 py-1.5 text-xs font-semibold hover:bg-[#074e64]"
                  >
                    <Plus className="h-3 w-3" />
                    <span>{isArabic ? 'إضافة بند يدوي' : 'Add Item'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="w-full text-xs text-left min-w-[760px]">
                  <thead className="bg-[#f9f9ff] text-[11px] text-[#70787d] font-semibold border-b border-[#e3e8f9]">
                    <tr>
                      <th className="p-2.5 w-[28%]">{isArabic ? 'اسم البند' : 'Item Name'}</th>
                      <th className="p-2.5 w-[14%]">{isArabic ? 'رمز SKU' : 'SKU'}</th>
                      <th className="p-2.5 w-[18%]">{isArabic ? 'التصنيف' : 'Category'}</th>
                      <th className="p-2.5 w-[10%]">{isArabic ? 'الوحدة (UOM)' : 'UOM'}</th>
                      <th className="p-2.5 w-[11%]">{isArabic ? 'سعر الوحدة' : 'Unit Cost'}</th>
                      <th className="p-2.5 w-[8%]">{isArabic ? 'الكمية' : 'Qty'}</th>
                      <th className="p-2.5 w-[11%] text-right">{isArabic ? 'الإجمالي' : 'Total'}</th>
                      <th className="p-2.5 w-[5%] text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e3e8f9]">
                    {items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-[#fcfdff]">
                        {/* Item Name */}
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                            placeholder={isArabic ? 'اسم الصنف والمواصفات' : 'Item Name & Specs'}
                            className="w-full rounded-lg border border-[#c3cce6] bg-white px-2 py-1.5 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden"
                          />
                        </td>

                        {/* SKU */}
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.sku}
                            onChange={(e) => handleUpdateItem(idx, 'sku', e.target.value)}
                            placeholder="TEX-001"
                            className="w-full rounded-lg border border-[#c3cce6] bg-white px-2 py-1.5 text-xs font-mono text-[#161c27] focus:border-[#004a60] outline-hidden"
                          />
                        </td>

                        {/* Category */}
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

                        {/* UOM */}
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

                        {/* Unit Cost */}
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitCost}
                            onChange={(e) => handleUpdateItem(idx, 'unitCost', parseFloat(e.target.value) || 0)}
                            className="w-full rounded-lg border border-[#c3cce6] bg-white px-2 py-1.5 text-xs text-[#161c27] font-mono text-right focus:border-[#004a60] outline-hidden"
                          />
                        </td>

                        {/* Qty */}
                        <td className="p-2">
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={item.qty}
                            onChange={(e) => handleUpdateItem(idx, 'qty', parseInt(e.target.value, 10) || 1)}
                            className="w-full rounded-lg border border-[#c3cce6] bg-white px-2 py-1.5 text-xs text-[#161c27] font-mono text-right focus:border-[#004a60] outline-hidden"
                          />
                        </td>

                        {/* Total */}
                        <td className="p-2 text-right font-mono font-bold text-[#161c27] whitespace-nowrap">
                          SAR {item.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Delete Action */}
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

            {/* Totals & Financial Breakdown */}
            <div className="mt-4 pt-4 border-t border-[#e3e8f9] flex flex-col sm:flex-row sm:items-start justify-end">
              <div className="w-full sm:w-80 space-y-2 text-xs">
                {/* Discount */}
                <div className="flex items-center justify-between">
                  <span className="text-[#70787d] font-semibold">
                    {isArabic ? 'الخصم (SAR)' : 'Discount (SAR)'}
                  </span>
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
                  <span className="text-[#70787d] font-semibold">
                    {isArabic ? 'المجموع الفرعي (Subtotal)' : 'Subtotal'}
                  </span>
                  <span className="font-mono font-semibold">
                    SAR {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* VAT (15%) */}
                <div className="flex items-center justify-between text-[#161c27]">
                  <span className="text-[#70787d] font-semibold">
                    {isArabic ? 'ضريبة القيمة المضافة (VAT 15%)' : 'VAT (15%)'}
                  </span>
                  <span className="font-mono font-semibold">
                    SAR {vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Grand Total */}
                <div className="flex items-center justify-between pt-2 border-t border-[#e3e8f9] text-sm">
                  <span className="font-bold text-[#161c27]">
                    {isArabic ? 'الإجمالي الكلي (Grand Total)' : 'Grand Total'}
                  </span>
                  <span className="font-mono font-bold text-[#004a60] text-base">
                    SAR {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Special Instructions / Notes */}
          <div className="bg-[#f9f9ff] rounded-xl border border-[#e3e8f9] p-4 sm:p-5">
            <label className="block text-xs font-semibold text-[#161c27] mb-1.5">
              {isArabic ? 'تعليمات خاصة / ملاحظات (Special Instructions / Notes)' : 'Special Instructions / Notes'}
            </label>
            <textarea
              rows={3}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder={
                isArabic
                  ? 'أضف أي تعليمات خاصة أو متطلبات تسليم لأمر الشراء هذا...'
                  : 'Add any special instructions or requirements for this PO...'
              }
              className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs text-[#161c27] placeholder:text-[#70787d]/60 shadow-2xs focus:border-[#004a60] focus:ring-1 focus:ring-[#004a60] outline-hidden"
            />
          </div>

          {/* Section 4: Shipping Address */}
          <div className="bg-white rounded-xl border border-[#e3e8f9] p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e3e8f9]">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#004a60]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#004a60]">
                  {isArabic ? 'عنوان الشحن والتسليم (Shipping Address)' : 'Shipping Address'}
                </h3>
              </div>
              {selectedProperty && (
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  {isArabic ? 'مُعبأ تلقائياً من المنشأة' : 'Auto-filled from Property'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Short Address */}
              <div>
                <label className="block text-[11px] font-medium text-[#70787d] mb-1">
                  {isArabic ? 'العنوان المختصر' : 'Short Address'}
                </label>
                <input
                  type="text"
                  value={shortAddress}
                  onChange={(e) => setShortAddress(e.target.value)}
                  placeholder="e.g. RHSA7980"
                  className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs font-mono text-[#161c27] focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* Building No. */}
              <div>
                <label className="block text-[11px] font-medium text-[#70787d] mb-1">
                  {isArabic ? 'رقم المبنى' : 'Building No.'}
                </label>
                <input
                  type="text"
                  value={buildingNo}
                  onChange={(e) => setBuildingNo(e.target.value)}
                  placeholder="1234"
                  className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* Secondary No. */}
              <div>
                <label className="block text-[11px] font-medium text-[#70787d] mb-1">
                  {isArabic ? 'الرقم الإضافي' : 'Secondary No.'}
                </label>
                <input
                  type="text"
                  value={secondaryNo}
                  onChange={(e) => setSecondaryNo(e.target.value)}
                  placeholder="5678"
                  className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* Street Name */}
              <div>
                <label className="block text-[11px] font-medium text-[#70787d] mb-1">
                  {isArabic ? 'اسم الشارع' : 'Street Name'}
                </label>
                <input
                  type="text"
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                  placeholder="King Fahd Road"
                  className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-[11px] font-medium text-[#70787d] mb-1">
                  {isArabic ? 'الحي' : 'District'}
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="District"
                  className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-[11px] font-medium text-[#70787d] mb-1">
                  {isArabic ? 'المدينة' : 'City'}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-[11px] font-medium text-[#70787d] mb-1">
                  {isArabic ? 'الرمز البريدي' : 'Postal Code'}
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Postal Code"
                  className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Contact Details */}
          <div className="bg-[#f9f9ff] rounded-xl border border-[#e3e8f9] p-4 sm:p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#004a60] mb-3 pb-2 border-b border-[#e3e8f9]">
              {isArabic ? 'بيانات الاتصال (Contact Details)' : 'Contact Details'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Contact Name */}
              <div>
                <label className="block text-[11px] font-medium text-[#70787d] mb-1">
                  {isArabic ? 'اسم جهة الاتصال' : 'Contact Name'}
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Contact Name"
                  className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-medium text-[#70787d] mb-1">
                  {isArabic ? 'رقم الهاتف' : 'Phone'}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966 5X XXX XXXX"
                  className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs text-[#161c27] font-mono focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-medium text-[#70787d] mb-1">
                  {isArabic ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="procurement@hotel.sa"
                  className="w-full rounded-xl border border-[#c3cce6] bg-white px-3 py-2 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Attachment (optional) */}
          <div className="bg-white rounded-xl border border-[#e3e8f9] p-4 sm:p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#004a60] mb-2">
              {isArabic ? 'مرفقات أمر الشراء (اختياري)' : 'Attachment (optional)'}
            </h3>

            {!attachmentName ? (
              <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#c3cce6] rounded-xl hover:border-[#004a60] hover:bg-[#f9f9ff] transition-all cursor-pointer">
                <Upload className="h-6 w-6 text-[#70787d] mb-1" />
                <span className="text-xs font-semibold text-[#004a60]">
                  {isArabic
                    ? 'انقر لرفع مستند أمر الشراء (PDF, صورة، بحد أقصى 10MB)'
                    : 'Click to upload PO document (PDF, image, max 10MB)'}
                </span>
                <span className="text-[10px] text-[#70787d] mt-0.5">
                  PDF, DOCX, PNG, JPG
                </span>
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
                  {attachmentSize && (
                    <span className="text-[10px] text-[#70787d]">({attachmentSize})</span>
                  )}
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
                  ? isArabic ? 'حفظ التعديلات' : 'Update PO'
                  : isArabic ? 'إنشاء أمر الشراء (Create PO)' : 'Create PO'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
