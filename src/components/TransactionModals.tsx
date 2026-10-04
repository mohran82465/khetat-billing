import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Receipt,
  Building2,
  Calculator,
  Sliders,
  Check,
  Percent,
} from 'lucide-react';
import {
  SalesOrder,
  Invoice,
  Quotation,
  Customer,
  ReceiptVoucher,
  QuotationTaxBreakdown,
  QuotationItem,
} from '../data/mockData';
import {
  PropertyPlan,
  PlanTier,
  getStoredPlans,
  getStoredTiers,
  getTiersForPlan,
} from '../data/plansConfig';
import {
  TaxConfig,
  getStoredTaxes,
  saveStoredTaxes,
  calculateTierTaxes,
} from '../data/taxSettingsData';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
}

// 1. Create Sales Order Modal
export const CreateSalesOrderModal: React.FC<
  ModalProps & { onAdd: (so: SalesOrder) => void; customers: Customer[] }
> = ({ isOpen, onClose, isArabic, onAdd, customers }) => {
  const [customerName, setCustomerName] = useState(customers[0]?.name || '');
  const [poNumber, setPoNumber] = useState('');
  const [amountNet, setAmountNet] = useState(250000);
  const [paymentTerms, setPaymentTerms] = useState('Net 30 Days (Letter of Credit)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vat = amountNet * 0.15;
    const newOrder: SalesOrder = {
      id: `SO-2024-${Math.floor(1050 + Math.random() * 50)}`,
      poNumber: poNumber || `PO-KSA-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: customerName,
      customerAr: 'منشأة معتمدة',
      industry: 'Enterprise Technology',
      tier: 'Tier-1 Enterprise',
      quotationRef: `QT-2024-0${Math.floor(800 + Math.random() * 99)}`,
      orderDate: '24 Oct 2024',
      provisionSlaDate: '05 Nov 2024',
      totalAmountNet: amountNet,
      vatAmount: vat,
      totalWithVat: amountNet + vat,
      fulfillmentPercent: 10,
      fulfillmentStatus: 'In Progress',
      invoicingStatus: 'Uninvoiced',
      slaLevel: 'High Availability 99.95%',
      paymentTerms,
      cloudTenant: {
        domain: `${customerName.toLowerCase().replace(/[^a-z0-9]/g, '')}.khetatcloud.com`,
        cluster: 'Saudi Sovereign Cloud (Zone 1)',
        allocatedSeats: 150,
        totalSeats: 200,
        status: 'Provisioning',
      },
      milestones: [
        {
          title: 'Contractual Validation',
          subtitle: 'Completed upon order creation',
          status: 'completed',
          stepNumber: 1,
        },
        {
          title: 'Dedicated Cloud Setup',
          subtitle: 'Automated provisioning initiated',
          status: 'current',
          stepNumber: 2,
        },
        {
          title: 'ZATCA Cryptographic Billing',
          subtitle: 'Pending clearance handshake',
          status: 'pending',
          stepNumber: 3,
        },
      ],
      poDocument: 'PO_Generated_Agreement.pdf',
    };

    onAdd(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9]">
          <h3 className="text-base font-bold text-[#161c27]">
            {isArabic ? 'إنشاء أمر بيع جديد' : 'New Enterprise Sales Order'}
          </h3>
          <button onClick={onClose} className="text-[#70787d] hover:text-[#161c27]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#161c27] mb-1">Customer Client</label>
            <select
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-lg border border-[#e3e8f9] p-2.5 focus:border-[#004a60] focus:outline-hidden"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} (CR: {c.crNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#161c27] mb-1">Customer PO Number</label>
            <input
              type="text"
              required
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              placeholder="e.g. ARAMCO-PO-9912"
              className="w-full rounded-lg border border-[#e3e8f9] p-2.5 focus:border-[#004a60] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">Net Amount (SAR)</label>
              <input
                type="number"
                required
                value={amountNet}
                onChange={(e) => setAmountNet(Number(e.target.value))}
                className="w-full rounded-lg border border-[#e3e8f9] p-2.5 font-mono focus:border-[#004a60] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">15% VAT Calculated</label>
              <input
                type="text"
                disabled
                value={`SAR ${(amountNet * 0.15).toLocaleString()}`}
                className="w-full rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] p-2.5 font-mono text-emerald-700 font-semibold"
              />
            </div>
          </div>

          <div className="rounded-lg bg-[#f1f3ff] p-3 text-center">
            <span className="text-[11px] text-[#70787d]">Total Payable Value (incl. 15% VAT):</span>
            <div className="text-lg font-bold font-mono text-[#004a60]">
              SAR {(amountNet * 1.15).toLocaleString()}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e3e8f9]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#e3e8f9] px-4 py-2 font-semibold text-[#40484d] hover:bg-[#f1f3ff]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#004a60] px-5 py-2 font-semibold text-white hover:bg-[#074e64]"
            >
              Generate Sales Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. Create Tax Invoice Modal (ZATCA Fatoora)
export const CreateInvoiceModal: React.FC<
  ModalProps & { onAdd: (inv: Invoice) => void; customers: Customer[] }
> = ({ isOpen, onClose, isArabic, onAdd, customers }) => {
  const [buyerName, setBuyerName] = useState(customers[0]?.name || '');
  const [invoiceType, setInvoiceType] = useState<'Tax Invoice' | 'Simplified'>('Tax Invoice');
  const [itemTitle, setItemTitle] = useState('Enterprise Cloud Node & ZATCA Integration');
  const [amount, setAmount] = useState(150000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vat = amount * 0.15;
    const newInv: Invoice = {
      id: `INV-2024-${Math.floor(3390 + Math.random() * 50)}`,
      codeType: invoiceType === 'Tax Invoice' ? '0100000' : '0200000',
      type: invoiceType,
      typeAr: invoiceType === 'Tax Invoice' ? 'فاتورة ضريبية' : 'فاتورة مبسطة',
      buyerName,
      buyerNameAr: 'شركة معتمدة',
      buyerTrn: '310928374600003',
      buyerAddress: 'Kingdom of Saudi Arabia',
      issueDate: '24 Oct 2024',
      dueDate: '23 Nov 2024',
      taxableAmount: amount,
      vatAmount: vat,
      totalAmount: amount + vat,
      zatcaStatus: 'Cleared',
      zatcaHash: `e9f2a7${Math.random().toString(36).substring(2, 15)}8dc6292773603d0d6aabbdd62a11ef721d1542`,
      zatcaUuid: `83fe-${Math.random().toString(36).substring(2, 8)}-2024`,
      settlementStatus: 'Unpaid',
      lineItems: [
        {
          description: itemTitle,
          descriptionAr: 'خدمات سحابية ورخص مؤسسية معتمدة',
          subtitle: 'ZATCA Real-time Node Implementation',
          qty: 1,
          unitPrice: amount,
          subtotal: amount,
        },
      ],
    };

    onAdd(newInv);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9]">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#161c27]">
              {isArabic ? 'إصدار فاتورة ضريبية (ZATCA)' : 'Issue Tax Invoice (ZATCA Phase 2)'}
            </h3>
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
              Clearance API
            </span>
          </div>
          <button onClick={onClose} className="text-[#70787d] hover:text-[#161c27]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">Invoice Standard</label>
              <select
                value={invoiceType}
                onChange={(e) => setInvoiceType(e.target.value as any)}
                className="w-full rounded-lg border border-[#e3e8f9] p-2.5 focus:border-[#004a60] focus:outline-hidden"
              >
                <option value="Tax Invoice">Standard B2B (Tax Invoice)</option>
                <option value="Simplified">Simplified B2C (Reporting 24h)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">Buyer Entity</label>
              <select
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full rounded-lg border border-[#e3e8f9] p-2.5 focus:border-[#004a60] focus:outline-hidden"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#161c27] mb-1">Line Item Description</label>
            <input
              type="text"
              required
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              className="w-full rounded-lg border border-[#e3e8f9] p-2.5 focus:border-[#004a60] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">Taxable Amount (SAR)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-lg border border-[#e3e8f9] p-2.5 font-mono focus:border-[#004a60] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">VAT 15%</label>
              <input
                type="text"
                disabled
                value={`SAR ${(amount * 0.15).toLocaleString()}`}
                className="w-full rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] p-2.5 font-mono text-emerald-700 font-semibold"
              />
            </div>
          </div>

          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2 text-emerald-800">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span className="text-[11px]">
              Will be instantly signed with CSID #8829-ZTC and registered on ZATCA Portal.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e3e8f9]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#e3e8f9] px-4 py-2 font-semibold text-[#40484d] hover:bg-[#f1f3ff]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#004a60] px-5 py-2 font-semibold text-white hover:bg-[#074e64]"
            >
              Sign & Clear Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. Create Quotation Modal
export const CreateQuotationModal: React.FC<
  ModalProps & { onAdd: (q: Quotation) => void; customers: Customer[] }
> = ({ isOpen, onClose, isArabic, onAdd, customers }) => {
  const [customer, setCustomer] = useState(customers[0]?.name || '');
  const [quoteMode, setQuoteMode] = useState<'plan_tier' | 'custom'>('plan_tier');

  // Plans & Tiers state
  const [plans, setPlans] = useState<PropertyPlan[]>(() => getStoredPlans());
  const [tiers, setTiers] = useState<PlanTier[]>(() => getStoredTiers());
  const [allTaxes, setAllTaxes] = useState<TaxConfig[]>(() => getStoredTaxes());

  // Quick add tax state
  const [isQuickTaxOpen, setIsQuickTaxOpen] = useState(false);
  const [newTaxCode, setNewTaxCode] = useState('');
  const [newTaxName, setNewTaxName] = useState('');
  const [newTaxNameAr, setNewTaxNameAr] = useState('');
  const [newTaxRate, setNewTaxRate] = useState<number>(5);
  const [newTaxType, setNewTaxType] = useState<'percentage' | 'fixed_sar'>('percentage');

  // Refresh data when modal opens
  useEffect(() => {
    if (isOpen) {
      setPlans(getStoredPlans());
      setTiers(getStoredTiers());
      setAllTaxes(getStoredTaxes());
    }
  }, [isOpen]);

  const [selectedPlanId, setSelectedPlanId] = useState<string>('building-plans');
  const availableTiersForPlan = useMemo(() => {
    return tiers.filter((t) => t.planId === selectedPlanId);
  }, [tiers, selectedPlanId]);

  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [propertiesCount, setPropertiesCount] = useState<number>(12);
  const [contractDurationMonths, setContractDurationMonths] = useState<number>(12);
  const [appliedTaxIds, setAppliedTaxIds] = useState<string[]>(['tax-vat-15']);

  // Custom mode state
  const [scope, setScope] = useState('Khetat Cloud Core ERP + Real-time ZATCA Clearance Integration');
  const [amountNet, setAmountNet] = useState(180000);

  // Initialize tier selection when plan changes
  useEffect(() => {
    if (availableTiersForPlan.length > 0) {
      const defaultTier = availableTiersForPlan[0];
      setSelectedTierId(defaultTier.id);
      setPropertiesCount(defaultTier.minProperties || 10);
      setAppliedTaxIds(
        defaultTier.appliedTaxIds && defaultTier.appliedTaxIds.length > 0
          ? defaultTier.appliedTaxIds
          : ['tax-vat-15']
      );
    }
  }, [selectedPlanId, availableTiersForPlan]);

  // When tier changes
  const handleSelectTier = (tierId: string) => {
    setSelectedTierId(tierId);
    const tr = tiers.find((t) => t.id === tierId);
    if (tr) {
      if (tr.minProperties && propertiesCount < tr.minProperties) {
        setPropertiesCount(tr.minProperties);
      }
      setAppliedTaxIds(
        tr.appliedTaxIds && tr.appliedTaxIds.length > 0
          ? tr.appliedTaxIds
          : ['tax-vat-15']
      );
    }
  };

  const handleAddQuickTax = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaxCode || !newTaxName) return;
    const createdTax: TaxConfig = {
      id: `tax-${newTaxCode.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`,
      code: newTaxCode.trim().toUpperCase(),
      name: newTaxName.trim(),
      nameAr: newTaxNameAr.trim() || newTaxName.trim(),
      rate: Number(newTaxRate) || 0,
      type: newTaxType,
      typeAr: newTaxType === 'percentage' ? 'نسبة مئوية (%)' : 'مبلغ ثابت (ر.س)',
      taxCategory: 'Custom',
      taxCategoryAr: 'رسوم وضرائب مخصصة',
      status: 'active',
      isRecoverable: false,
      applyToAllByDefault: false,
      description: `Custom tax created in quotation: ${newTaxCode}`,
      descriptionAr: `ضريبة مخصصة تم إنشاؤها عبر عروض الأسعار: ${newTaxCode}`,
      zatcaCode: 'O',
    };
    const updatedTaxes = [...allTaxes, createdTax];
    setAllTaxes(updatedTaxes);
    saveStoredTaxes(updatedTaxes);
    setAppliedTaxIds((prev) => [...prev, createdTax.id]);
    setIsQuickTaxOpen(false);
    setNewTaxCode('');
    setNewTaxName('');
    setNewTaxNameAr('');
    setNewTaxRate(5);
  };

  const currentPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];
  const currentTier = tiers.find((t) => t.id === selectedTierId) || availableTiersForPlan[0];

  // Calculation for Plan & Tier Mode
  const calculation = useMemo(() => {
    if (quoteMode === 'custom') {
      const vat = amountNet * 0.15;
      return {
        baseMonthly: amountNet / (contractDurationMonths || 1),
        baseNet: amountNet,
        taxesBreakdown: [
          {
            taxId: 'tax-vat-15',
            code: 'VAT-15',
            name: 'Value Added Tax (15%)',
            nameAr: 'ضريبة القيمة المضافة (15%)',
            rate: 15,
            amount: vat,
          },
        ],
        totalTax: vat,
        grandTotal: amountNet + vat,
        isCapped: false,
      };
    }

    if (!currentTier) {
      return {
        baseMonthly: 0,
        baseNet: 0,
        taxesBreakdown: [],
        totalTax: 0,
        grandTotal: 0,
        isCapped: false,
      };
    }

    let monthlyRate = propertiesCount * currentTier.ratePerUnit;
    let isCapped = false;
    if (currentTier.cappedRate && monthlyRate > currentTier.cappedRate) {
      monthlyRate = currentTier.cappedRate;
      isCapped = true;
    }

    const netTotal = monthlyRate * contractDurationMonths;
    const taxesResult = calculateTierTaxes(netTotal, appliedTaxIds, allTaxes);

    return {
      baseMonthly: monthlyRate,
      baseNet: netTotal,
      taxesBreakdown: taxesResult.breakdown,
      totalTax: taxesResult.totalTaxAmount,
      grandTotal: taxesResult.grandTotal,
      isCapped,
    };
  }, [
    quoteMode,
    amountNet,
    contractDurationMonths,
    currentTier,
    propertiesCount,
    appliedTaxIds,
    allTaxes,
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCust = customers.find((c) => c.name === customer) || customers[0] || {
      name: customer || 'Customer Entity',
      initials: 'CE',
      crNumber: '1010992384',
      trn: '310491827100003',
      primaryContact: { name: 'Executive Lead', email: 'lead@client.sa' },
    };

    let items: QuotationItem[] = [];
    if (quoteMode === 'plan_tier' && currentTier && currentPlan) {
      items = [
        {
          title: `${isArabic ? currentPlan.nameAr : currentPlan.name} — ${isArabic ? currentTier.nameAr : currentTier.name}`,
          scope: `${propertiesCount} ${isArabic ? 'عقارات / وحدات فندقية' : 'Hospitality Units'} @ ${currentTier.ratePerUnit} SAR/mo (${contractDurationMonths} ${isArabic ? 'شهور' : 'Months'})`,
          price: calculation.baseNet,
          planId: currentPlan.id,
          planName: currentPlan.name,
          planNameAr: currentPlan.nameAr,
          tierId: currentTier.id,
          tierName: currentTier.name,
          tierNameAr: currentTier.nameAr,
          tierCode: currentTier.code,
          propertiesCount,
          ratePerUnit: currentTier.ratePerUnit,
          isCapped: calculation.isCapped,
          appliedTaxes: calculation.taxesBreakdown,
        },
      ];
    } else {
      items = [
        {
          title: scope,
          scope: `${isArabic ? 'عقد مخصص' : 'Custom Enterprise Contract'} (${contractDurationMonths} ${isArabic ? 'شهر' : 'Months'})`,
          price: calculation.baseNet,
          appliedTaxes: calculation.taxesBreakdown,
        },
      ];
    }

    const newQuote: Quotation = {
      id: `QT-2024-${Math.floor(896 + Math.random() * 50)}`,
      version: 'v1',
      category: quoteMode === 'plan_tier' ? 'Plan & Tier Agreement' : 'Master Agreement',
      customer: selectedCust.name,
      customerInitials: selectedCust.initials || selectedCust.name.slice(0, 2).toUpperCase(),
      crNumber: selectedCust.crNumber || '1010992384',
      trnNumber: selectedCust.trn || '310491827100003',
      dateIssued: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiresInHours: 72,
      isExpiringSoon: false,
      totalNet: calculation.baseNet,
      discount: 0,
      vatAmount: calculation.totalTax,
      grandTotal: calculation.grandTotal,
      status: 'Sent',
      statusLabel: isArabic ? 'مرسل للمراجعة' : 'Sent / Review',
      creator: 'Eng. Tariq Mansoor',
      contactName: selectedCust.primaryContact?.name || 'Executive Procurement Lead',
      contactEmail: selectedCust.primaryContact?.email || 'procurement@client.sa',
      items,
      zatcaReady: true,
      eSignStatus: isArabic ? 'بانتظار التوقيع الرقمي (نفاذ)' : 'Awaiting e-Sign via Nafath',
      planId: quoteMode === 'plan_tier' ? currentPlan?.id : undefined,
      planName: quoteMode === 'plan_tier' ? currentPlan?.name : undefined,
      planNameAr: quoteMode === 'plan_tier' ? currentPlan?.nameAr : undefined,
      tierId: quoteMode === 'plan_tier' ? currentTier?.id : undefined,
      tierName: quoteMode === 'plan_tier' ? currentTier?.name : undefined,
      tierNameAr: quoteMode === 'plan_tier' ? currentTier?.nameAr : undefined,
      tierCode: quoteMode === 'plan_tier' ? currentTier?.code : undefined,
      propertiesCount: quoteMode === 'plan_tier' ? propertiesCount : undefined,
      taxesBreakdown: calculation.taxesBreakdown,
    };

    onAdd(newQuote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 my-auto max-h-[92vh] flex flex-col border border-[#e3e8f9]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#004a60] text-white">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#161c27]">
                {isArabic ? 'إنشاء عرض سعر جديد (Quotations Engine)' : 'New Commercial Quotation'}
              </h3>
              <p className="text-xs text-[#70787d]">
                {isArabic
                  ? 'ربط عروض الأسعار بباقات ومستويات المنظومة مع احتساب الضرائب تلقائياً'
                  : 'Link quotations to plans, tiers, and multi-tax schedules with real-time clearance'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#70787d] hover:text-[#161c27] p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs overflow-y-auto flex-1 pr-1">
          {/* Mode Switcher Pills */}
          <div className="flex items-center p-1 bg-[#f1f3ff] rounded-xl border border-[#e3e8f9]">
            <button
              type="button"
              onClick={() => setQuoteMode('plan_tier')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                quoteMode === 'plan_tier'
                  ? 'bg-white text-[#004a60] shadow-xs'
                  : 'text-[#50585e] hover:text-[#161c27]'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{isArabic ? 'باقة ومستوى تسعير (Plan & Tier)' : 'Plan & Tier Subscription'}</span>
            </button>
            <button
              type="button"
              onClick={() => setQuoteMode('custom')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                quoteMode === 'custom'
                  ? 'bg-white text-[#004a60] shadow-xs'
                  : 'text-[#50585e] hover:text-[#161c27]'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>{isArabic ? 'نطاق تجاري مخصص (Custom Scope)' : 'Custom Scope'}</span>
            </button>
          </div>

          {/* Client Selection */}
          <div>
            <label className="block font-semibold text-[#161c27] mb-1">
              {isArabic ? 'الجهة المستفيدة / العميل *' : 'Target Client Entity *'}
            </label>
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full rounded-xl border border-[#c3cce6] p-2.5 bg-white font-medium focus:border-[#004a60] outline-hidden cursor-pointer"
              required
            >
              {customers.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} {c.city ? `(${c.city})` : ''} — CR: {c.crNumber}
                </option>
              ))}
            </select>
          </div>

          {/* PLAN & TIER SECTION */}
          {quoteMode === 'plan_tier' ? (
            <div className="space-y-4 p-4 rounded-2xl bg-[#f9fbff] border border-[#bcd7f5]">
              {/* 1. Target Plan Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-[#004a60] text-xs flex items-center gap-1.5">
                    <Layers className="h-4 w-4" />
                    <span>{isArabic ? '١. اختيار الباقة الرئيسية (Plan):' : '1. Target Property Plan:'}</span>
                  </label>
                  <span className="text-[10px] text-[#70787d]">
                    {plans.length} {isArabic ? 'باقات متاحة' : 'Plans available'}
                  </span>
                </div>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd7f5] p-2.5 bg-white font-bold text-[#161c27] text-xs focus:border-[#004a60] outline-hidden cursor-pointer shadow-2xs"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {isArabic ? p.nameAr : p.name} ({p.code})
                    </option>
                  ))}
                </select>
                {currentPlan && (
                  <p className="text-[11px] text-[#70787d] mt-1">
                    {isArabic ? currentPlan.subtitleAr : currentPlan.subtitle}
                  </p>
                )}
              </div>

              {/* 2. Target Tier Selection with interactive Cards */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-[#004a60] text-xs flex items-center gap-1.5">
                    <Percent className="h-4 w-4" />
                    <span>{isArabic ? '٢. اختيار مستوى التسعير التابع للباقة (Tier):' : '2. Plan Pricing Tier:'}</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#004a60] font-bold">
                    {availableTiersForPlan.length} {isArabic ? 'مستويات' : 'Tiers'}
                  </span>
                </div>

                {/* Tier Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {availableTiersForPlan.map((tr) => {
                    const isSelected = tr.id === selectedTierId;
                    return (
                      <button
                        key={tr.id}
                        type="button"
                        onClick={() => handleSelectTier(tr.id)}
                        className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#004a60] bg-white ring-2 ring-[#004a60]/20 shadow-xs'
                            : 'border-[#bcd7f5]/80 bg-white/80 hover:bg-white hover:border-[#004a60]/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 w-full mb-1">
                          <span className="font-bold text-xs text-[#161c27] line-clamp-1">
                            {isArabic ? tr.nameAr : tr.name}
                          </span>
                          <span
                            className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                              isSelected ? 'bg-[#004a60] text-white' : 'bg-[#e8eeff] text-[#004a60]'
                            }`}
                          >
                            {tr.code}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-1 text-[#004a60] font-black text-sm font-mono mt-1">
                          <span>{tr.ratePerUnit} SAR</span>
                          <span className="text-[10px] font-normal text-[#70787d]">
                            /{isArabic ? 'عقار شهرياً' : 'unit/mo'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#70787d] mt-1.5 pt-1.5 border-t border-[#f0f4fd] w-full">
                          <span>
                            {tr.minProperties || 1}-{tr.maxProperties || '∞'} {isArabic ? 'عقارات' : 'units'}
                          </span>
                          {tr.cappedRate ? (
                            <span className="text-amber-800 font-semibold font-mono text-[9px]">
                              Cap: {tr.cappedRate} SAR
                            </span>
                          ) : (
                            <span className="text-emerald-700 text-[9px] font-medium">
                              {isArabic ? 'تسعير خطي' : 'Linear'}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Units / Properties Count */}
              <div className="bg-white p-3.5 rounded-xl border border-[#bcd7f5] space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="font-bold text-[#161c27] text-xs">
                    {isArabic ? '٣. عدد العقارات / الوحدات الفندقية المشتركة:' : '3. Enrolled Properties / Units:'}
                  </label>
                  <span className="font-mono text-sm font-black text-[#004a60] bg-[#eef7ff] px-2.5 py-0.5 rounded-lg border border-[#bcd7f5]">
                    {propertiesCount} {isArabic ? 'عقار / وحدة' : 'Properties'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={currentTier?.minProperties || 1}
                    max={currentTier?.maxProperties ? currentTier.maxProperties + 15 : 60}
                    value={propertiesCount}
                    onChange={(e) => setPropertiesCount(parseInt(e.target.value) || 1)}
                    className="flex-1 accent-[#004a60] cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={propertiesCount}
                    onChange={(e) => setPropertiesCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 p-1.5 rounded-lg border border-[#c3cce6] font-mono text-center font-bold text-xs"
                  />
                </div>
                {currentTier && (
                  <div className="flex items-center justify-between text-[10px] text-[#70787d]">
                    <span>
                      {isArabic ? 'النطاق الموصى به للمستوى:' : 'Tier Recommended Range:'}{' '}
                      {currentTier.minProperties || 1} - {currentTier.maxProperties || '∞'}
                    </span>
                    {calculation.isCapped && (
                      <span className="text-amber-700 font-bold">
                        {isArabic ? 'تم تطبيق الحد الأقصى للمستوى (Capped)' : 'Tier Rate Cap Applied'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* 4. Contract Duration & Applied Taxes Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                <div>
                  <label className="block font-bold text-[#161c27] mb-1 text-xs">
                    {isArabic ? '٤. مدة العرض والتعاقد:' : '4. Contract Duration:'}
                  </label>
                  <select
                    value={contractDurationMonths}
                    onChange={(e) => setContractDurationMonths(parseInt(e.target.value) || 12)}
                    className="w-full rounded-xl border border-[#bcd7f5] p-2.5 bg-white text-xs font-semibold outline-hidden cursor-pointer"
                  >
                    <option value={12}>
                      {isArabic ? '١٢ شهر (عقد سنوي كامل - Full Annual)' : '12 Months (Full Annual Agreement)'}
                    </option>
                    <option value={24}>
                      {isArabic ? '٢٤ شهر (عقد سنتين - Multi-Year)' : '24 Months (2-Year Enterprise)'}
                    </option>
                    <option value={6}>
                      {isArabic ? '٦ أشهر (نصف سنوي - Semi-Annual)' : '6 Months (Semi-Annual)'}
                    </option>
                    <option value={3}>
                      {isArabic ? '٣ أشهر (ربع سنوي - Quarterly)' : '3 Months (Quarterly)'}
                    </option>
                    <option value={1}>
                      {isArabic ? 'شهر واحد (تجربة شهرية - Single Month)' : '1 Month (Monthly Trial)'}
                    </option>
                  </select>
                </div>

                {/* Applied Taxes Header & Quick Add */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#161c27] text-xs">
                      {isArabic ? '٥. الضرائب المطبقة على الباقة/المستوى:' : '5. Applied Taxes for Tier:'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsQuickTaxOpen(!isQuickTaxOpen)}
                      className="text-[10px] text-[#004a60] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      <span>{isArabic ? 'ضريبة جديدة' : 'New Tax'}</span>
                    </button>
                  </div>

                  {/* Pre-configured tier taxes hint */}
                  {currentTier?.appliedTaxIds && currentTier.appliedTaxIds.length > 0 && (
                    <div className="text-[10px] text-emerald-800 font-medium flex items-center gap-1 mb-1.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span>
                        {isArabic
                          ? 'الضرائب المعتمدة لهذا المستوى محددة تلقائياً:'
                          : 'Taxes configured for this tier are pre-selected:'}
                      </span>
                    </div>
                  )}

                  {/* Taxes Checklist Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {allTaxes.map((tx) => {
                      const isChecked = appliedTaxIds.includes(tx.id);
                      const isDefaultTierTax = currentTier?.appliedTaxIds?.includes(tx.id);
                      return (
                        <button
                          key={tx.id}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setAppliedTaxIds((prev) => prev.filter((id) => id !== tx.id));
                            } else {
                              setAppliedTaxIds((prev) => [...prev, tx.id]);
                            }
                          }}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-[#004a60] text-white border-[#004a60] shadow-xs'
                              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {isChecked ? (
                            <Check className="h-3.5 w-3.5 shrink-0" />
                          ) : (
                            <span className="h-3 w-3 rounded-full border border-gray-300 inline-block shrink-0" />
                          )}
                          <span className="font-mono">[{tx.code}]</span>
                          <span>{isArabic ? tx.nameAr : tx.name}</span>
                          <span className="font-mono font-normal opacity-90">
                            ({tx.type === 'percentage' ? `${tx.rate}%` : `${tx.rate} SAR`})
                          </span>
                          {isDefaultTierTax && (
                            <span
                              className={`text-[8px] px-1 py-0.2 rounded font-mono ${
                                isChecked ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              Tier
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Inline Quick Tax Adder */}
                  {isQuickTaxOpen && (
                    <div className="mt-2.5 p-3 rounded-xl bg-white border border-[#bcd7f5] shadow-xs space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                        <span className="font-bold text-xs text-[#004a60]">
                          {isArabic ? 'إضافة نوع ضريبة أو رسم جديد:' : 'Add Quick Tax / Surcharge:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsQuickTaxOpen(false)}
                          className="text-gray-400 hover:text-gray-700 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-600 block mb-0.5">
                            {isArabic ? 'كود الضريبة (Code):' : 'Tax Code:'}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. TRM-05"
                            value={newTaxCode}
                            onChange={(e) => setNewTaxCode(e.target.value)}
                            className="w-full p-1.5 border border-gray-300 rounded text-xs font-mono font-bold uppercase"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-600 block mb-0.5">
                            {isArabic ? 'النسبة أو القيمة:' : 'Rate / Value:'}
                          </label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.5"
                              value={newTaxRate}
                              onChange={(e) => setNewTaxRate(Number(e.target.value) || 0)}
                              className="w-full p-1.5 border border-gray-300 rounded text-xs font-mono font-bold"
                            />
                            <select
                              value={newTaxType}
                              onChange={(e) => setNewTaxType(e.target.value as any)}
                              className="p-1 border border-gray-300 rounded text-[10px]"
                            >
                              <option value="percentage">%</option>
                              <option value="fixed_sar">SAR</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-600 block mb-0.5">
                          {isArabic ? 'اسم الضريبة بالعربية:' : 'Arabic Name:'}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. رسوم التنمية السياحية"
                          value={newTaxNameAr}
                          onChange={(e) => setNewTaxNameAr(e.target.value)}
                          className="w-full p-1.5 border border-gray-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-600 block mb-0.5">
                          {isArabic ? 'الاسم بالإنجليزية:' : 'English Name:'}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Tourism Development Surcharge"
                          value={newTaxName}
                          onChange={(e) => setNewTaxName(e.target.value)}
                          className="w-full p-1.5 border border-gray-300 rounded text-xs"
                        />
                      </div>
                      <div className="flex justify-end gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsQuickTaxOpen(false)}
                          className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                        >
                          {isArabic ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                          type="button"
                          onClick={handleAddQuickTax}
                          className="px-3 py-1 bg-[#004a60] text-white text-xs font-bold rounded hover:bg-[#074e64]"
                        >
                          {isArabic ? 'حفظ وتطبيق الضريبة' : 'Save & Apply'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* CUSTOM MODE */
            <div className="space-y-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'نطاق وتفاصيل العمل المخصص:' : 'Custom Scope of Work:'}
                </label>
                <input
                  type="text"
                  required
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full rounded-xl border border-[#c3cce6] p-2.5 bg-white text-xs outline-hidden"
                  placeholder="e.g. Hospitality ERP Custom Deployment"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'القيمة الصافية الإجمالية (ر.س):' : 'Net Total Amount (SAR):'}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={amountNet}
                  onChange={(e) => setAmountNet(Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-[#c3cce6] p-2.5 bg-white font-mono font-bold text-xs"
                />
              </div>
            </div>
          )}

          {/* REAL-TIME CALCULATION BREAKDOWN STRIP */}
          <div className="rounded-2xl bg-gradient-to-r from-[#eef7ff] via-[#f4f9ff] to-white p-4 border border-[#bcd7f5] space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#bcd7f5]/60">
              <span className="font-bold text-[#004a60] flex items-center gap-1.5">
                <Calculator className="h-4 w-4" />
                <span>{isArabic ? 'ملخص احتساب العرض المالي شامل الضرائب:' : 'Financial Quote Calculation:'}</span>
              </span>
              {quoteMode === 'plan_tier' && currentTier && (
                <span className="text-[10px] font-bold text-[#004a60] bg-white px-2 py-0.5 rounded-md border border-[#bcd7f5]">
                  {currentTier.code} • {propertiesCount} Units
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between text-[#50585e]">
                <span>{isArabic ? 'المبلغ الصافي قبل الضريبة:' : 'Subtotal Net:'}</span>
                <span className="font-mono font-bold text-[#161c27]">
                  SAR {calculation.baseNet.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-[#50585e]">
                <span>{isArabic ? 'معدل الحساب الشهري:' : 'Monthly Rate:'}</span>
                <span className="font-mono font-bold text-[#004a60]">
                  SAR {calculation.baseMonthly.toLocaleString()} / mo
                </span>
              </div>
            </div>

            {/* Itemized Taxes Breakdown */}
            <div className="pt-2 border-t border-[#bcd7f5]/60 space-y-1">
              <span className="text-[11px] font-bold text-[#50585e] block">
                {isArabic ? 'الضرائب والرسوم المطبقة:' : 'Tax Schedule:'}
              </span>
              {calculation.taxesBreakdown.length === 0 ? (
                <span className="text-[10px] text-gray-400 italic">
                  {isArabic ? 'لا توجد ضرائب مفعلة' : 'No taxes applied'}
                </span>
              ) : (
                calculation.taxesBreakdown.map((tb) => (
                  <div key={tb.taxId} className="flex justify-between text-[11px] text-[#50585e]">
                    <span className="flex items-center gap-1">
                      <span className="font-mono font-bold text-[#004a60]">[{tb.code}]</span>
                      <span>{isArabic ? tb.nameAr : tb.name} ({tb.rate}%):</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-800">
                      +SAR {tb.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Grand Total */}
            <div className="pt-2 border-t border-[#bcd7f5] flex items-center justify-between text-sm">
              <span className="font-black text-[#161c27]">
                {isArabic ? 'الإجمالي النهائي للعرض (شامل الضرائب):' : 'Grand Total (incl. All Taxes):'}
              </span>
              <span className="font-mono font-black text-base text-[#004a60]">
                SAR {calculation.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3e8f9] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#c3cce6] px-4 py-2 font-semibold text-[#50585e] hover:bg-gray-50 cursor-pointer"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#004a60] px-5 py-2 font-bold text-white hover:bg-[#074e64] shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="h-4 w-4" />
              <span>{isArabic ? 'إصدار عرض السعر' : 'Issue Quotation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 4. Create Payment Receipt Voucher Modal
export const CreateReceiptModal: React.FC<
  ModalProps & {
    onAdd: (r: ReceiptVoucher) => void;
    invoices: Invoice[];
    preselectedInvoice?: Invoice | null;
  }
> = ({ isOpen, onClose, isArabic, onAdd, invoices, preselectedInvoice }) => {
  const [customer, setCustomer] = useState(
    preselectedInvoice?.buyerName || invoices[0]?.buyerName || ''
  );
  const [amount, setAmount] = useState(
    preselectedInvoice ? preselectedInvoice.totalAmount : 75000
  );
  const [method, setMethod] = useState<'mada' | 'sarie' | 'sadad' | 'card' | 'cheque'>('sarie');
  const [allocatedInvoice, setAllocatedInvoice] = useState(
    preselectedInvoice?.id || invoices[0]?.id || ''
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReceipt: ReceiptVoucher = {
      id: `RCT-2024-${Math.floor(520 + Math.random() * 50)}`,
      date: '24 Oct 2024',
      time: '12:00',
      customer,
      customerAr: 'المؤسسة المعتمدة',
      vatNumber: '310144928100003',
      method:
        method === 'mada'
          ? 'Mada (Al Rajhi POS)'
          : method === 'sarie'
          ? 'SARIE Bank Wire (SNB)'
          : method === 'sadad'
          ? 'SADAD Portal Transfer'
          : method === 'card'
          ? 'Corporate Visa / MC'
          : 'Banque Saudi Fransi Cheque',
      methodCategory: method,
      referenceNumber: `TXN-${Math.floor(100000000 + Math.random() * 900000000)}-SARIE`,
      amount,
      wordsEn: 'Saudi Riyals Only',
      wordsAr: 'ريال سعودي لا غير',
      allocatedInvoice,
      allocatedAmount: amount,
      status: 'Reconciled',
    };

    onAdd(newReceipt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9]">
          <h3 className="text-base font-bold text-[#161c27]">
            {isArabic ? 'تسجيل سند قبض مالي' : 'Record Official Receipt Voucher'}
          </h3>
          <button onClick={onClose} className="text-[#70787d] hover:text-[#161c27]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#161c27] mb-1">Received From (Client)</label>
            <input
              type="text"
              required
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full rounded-lg border border-[#e3e8f9] p-2.5 focus:border-[#004a60] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">Payment Mode</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full rounded-lg border border-[#e3e8f9] p-2.5 focus:border-[#004a60] focus:outline-hidden"
              >
                <option value="sarie">SARIE Bank Wire</option>
                <option value="mada">Mada POS</option>
                <option value="sadad">SADAD Bill</option>
                <option value="card">Credit Card</option>
                <option value="cheque">Bank Cheque</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#161c27] mb-1">Amount Collected (SAR)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-lg border border-[#e3e8f9] p-2.5 font-mono focus:border-[#004a60] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#161c27] mb-1">Allocate to Tax Invoice</label>
            <select
              value={allocatedInvoice}
              onChange={(e) => setAllocatedInvoice(e.target.value)}
              className="w-full rounded-lg border border-[#e3e8f9] p-2.5 font-mono focus:border-[#004a60] focus:outline-hidden"
            >
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.id} — {inv.buyerName} (SAR {inv.totalAmount.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e3e8f9]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#e3e8f9] px-4 py-2 font-semibold text-[#40484d] hover:bg-[#f1f3ff]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#004a60] px-5 py-2 font-semibold text-white hover:bg-[#074e64]"
            >
              Issue Voucher & Settle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 5. Create Customer Modal
export const CreateCustomerModal: React.FC<
  ModalProps & { onAdd: (c: Customer) => void }
> = ({ isOpen, onClose, isArabic, onAdd }) => {
  const [name, setName] = useState('');
  const [crNumber, setCrNumber] = useState('');
  const [trn, setTrn] = useState('');
  const [city, setCity] = useState('Riyadh');
  const [creditLimit, setCreditLimit] = useState(200000);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: Customer = {
      id: `CUST-00${Math.floor(10 + Math.random() * 90)}`,
      name: name || 'Saudi Tech Solutions Co.',
      nameAr: 'شركة التقنية السعودية',
      initials: (name || 'ST')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      city,
      country: 'Saudi Arabia',
      crNumber: crNumber || '1010998877',
      trn: trn || '310998877600003',
      primaryContact: {
        name: contactName || 'Abdullah Al-Shehri',
        email: contactEmail || 'info@client.sa',
        phone: '+966 50 555 4433',
      },
      tier: 'Enterprise',
      outstandingBalance: 0,
      creditLimit,
      nationalAddress: {
        building: 'Building 1204',
        street: 'King Fahd Road',
        district: 'Al-Olaya',
        city,
        postalCode: '12214',
        shortAddress: `RYD-${Math.floor(1000 + Math.random() * 9000)}-4400`,
      },
      activeSubscriptions: [
        {
          title: 'Standard Platform License',
          pricePerMonth: 8500,
          billingCycle: 'Monthly',
          status: 'Active',
        },
      ],
    };

    onAdd(newCust);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9]">
          <h3 className="text-base font-bold text-[#161c27]">
            {isArabic ? 'إضافة عميل مؤسسي جديد' : 'New Customer Account'}
          </h3>
          <button onClick={onClose} className="text-[#70787d] hover:text-[#161c27]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#161c27] mb-1">Company Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Al-Rajhi Advanced Cloud Services"
              className="w-full rounded-lg border border-[#e3e8f9] p-2.5 focus:border-[#004a60] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">Commercial Reg. (CR)</label>
              <input
                type="text"
                required
                value={crNumber}
                onChange={(e) => setCrNumber(e.target.value)}
                placeholder="1010XXXXXX"
                className="w-full rounded-lg border border-[#e3e8f9] p-2.5 font-mono focus:border-[#004a60] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">ZATCA TRN (15 digits)</label>
              <input
                type="text"
                required
                value={trn}
                onChange={(e) => setTrn(e.target.value)}
                placeholder="300XXXXXXXXXXX3"
                className="w-full rounded-lg border border-[#e3e8f9] p-2.5 font-mono focus:border-[#004a60] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">City / Region</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-[#e3e8f9] p-2.5 focus:border-[#004a60] focus:outline-hidden"
              >
                <option value="Riyadh">Riyadh (الرياض)</option>
                <option value="Jeddah">Jeddah (جدة)</option>
                <option value="Dammam">Dammam (الدمام)</option>
                <option value="Al Khobar">Al Khobar (الخبر)</option>
                <option value="Neom">Neom (نيوم)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">Credit Limit (SAR)</label>
              <input
                type="number"
                value={creditLimit}
                onChange={(e) => setCreditLimit(Number(e.target.value))}
                className="w-full rounded-lg border border-[#e3e8f9] p-2.5 font-mono focus:border-[#004a60] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">Primary Contact Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Tariq Mansoor"
                className="w-full rounded-lg border border-[#e3e8f9] p-2.5 focus:border-[#004a60] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#161c27] mb-1">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@client.sa"
                className="w-full rounded-lg border border-[#e3e8f9] p-2.5 focus:border-[#004a60] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e3e8f9]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#e3e8f9] px-4 py-2 font-semibold text-[#40484d] hover:bg-[#f1f3ff]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#004a60] px-5 py-2 font-semibold text-white hover:bg-[#074e64]"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
