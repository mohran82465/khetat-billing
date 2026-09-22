import React, { useState } from 'react';
import { X, Plus, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SalesOrder, Invoice, Quotation, Customer, ReceiptVoucher } from '../data/mockData';

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
  const [scope, setScope] = useState('Khetat Cloud Core ERP + Real-time ZATCA Clearance Integration');
  const [amountNet, setAmountNet] = useState(180000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vat = amountNet * 0.15;
    const newQuote: Quotation = {
      id: `QT-2024-${Math.floor(895 + Math.random() * 50)}`,
      version: 'v1',
      category: 'Master Agreement',
      customer,
      customerInitials: customer.split(' ').map((n) => n[0]).join('').slice(0, 2),
      crNumber: '1010992384',
      trnNumber: '310491827100003',
      dateIssued: '24 Oct 2024',
      validUntil: '07 Nov 2024',
      totalNet: amountNet,
      discount: 0,
      vatAmount: vat,
      grandTotal: amountNet + vat,
      status: 'Sent',
      statusLabel: 'Sent / Review',
      creator: 'Eng. Tariq Mansoor',
      contactName: 'Executive Procurement Lead',
      contactEmail: 'procurement@client.sa',
      items: [
        {
          title: scope,
          scope: 'Annual Enterprise Subscription & Dedicated Hosting',
          price: amountNet,
        },
      ],
      zatcaReady: true,
      eSignStatus: 'Sent for Nafath e-Signature',
    };

    onAdd(newQuote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9]">
          <h3 className="text-base font-bold text-[#161c27]">
            {isArabic ? 'إنشاء عرض سعر جديد' : 'New Commercial Quotation'}
          </h3>
          <button onClick={onClose} className="text-[#70787d] hover:text-[#161c27]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#161c27] mb-1">Target Client Entity</label>
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full rounded-lg border border-[#e3e8f9] p-2.5 focus:border-[#004a60] focus:outline-hidden"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#161c27] mb-1">Solution Scope</label>
            <input
              type="text"
              required
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full rounded-lg border border-[#e3e8f9] p-2.5 focus:border-[#004a60] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#161c27] mb-1">Net Proposal Value (SAR)</label>
            <input
              type="number"
              required
              value={amountNet}
              onChange={(e) => setAmountNet(Number(e.target.value))}
              className="w-full rounded-lg border border-[#e3e8f9] p-2.5 font-mono focus:border-[#004a60] focus:outline-hidden"
            />
          </div>

          <div className="rounded-lg bg-[#f1f3ff] p-3 text-center">
            <span className="text-[11px] text-[#70787d]">Total Proposal incl. 15% VAT:</span>
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
              Issue Quotation
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
