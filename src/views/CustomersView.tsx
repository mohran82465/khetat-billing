import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Building,
  Mail,
  Phone,
  ShieldCheck,
  CreditCard,
  FileText,
  MapPin,
  ChevronRight,
  X,
  ExternalLink,
  Layers,
  MessageSquare,
  Smartphone,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { Customer } from '../data/mockData';
import {
  MultichannelDispatchModal,
  RecipientProfile,
  CommunicationChannel,
} from '../components/MultichannelDispatchModal';

interface CustomersViewProps {
  customers: Customer[];
  isArabic: boolean;
  onOpenCreateCustomer: () => void;
  onCreateOrderForCustomer: (customer: Customer) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  isArabic,
  onOpenCreateCustomer,
  onCreateOrderForCustomer,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0] || null);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'All' | 'Enterprise' | 'Corporate'>('All');
  const [viewState, setViewState] = useState<'populated' | 'skeleton' | 'empty'>('populated');

  // Multichannel Dispatch state
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchChannel, setDispatchChannel] = useState<CommunicationChannel>('whatsapp');
  const [selectedCustomerIdsForDispatch, setSelectedCustomerIdsForDispatch] = useState<string[]>([]);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);

  const recipientProfiles: RecipientProfile[] = customers.map((c) => ({
    id: c.id,
    name: c.name,
    nameAr: c.nameAr,
    company: c.name,
    companyAr: c.nameAr,
    email: c.primaryContact.email,
    phone: c.primaryContact.phone,
    role: `${c.tier} Client`,
    outstandingBalance: c.outstandingBalance,
    smartPin: '4910#',
    city: c.city,
  }));

  const handleOpenDispatch = (channel: CommunicationChannel, targetIds?: string[]) => {
    setDispatchChannel(channel);
    setSelectedCustomerIdsForDispatch(
      targetIds && targetIds.length > 0
        ? targetIds
        : selectedCustomerIdsForDispatch.length > 0
        ? selectedCustomerIdsForDispatch
        : customers.map((c) => c.id)
    );
    setIsDispatchModalOpen(true);
  };

  const handleToggleCustomerSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCustomerIdsForDispatch((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllCustomers = () => {
    if (selectedCustomerIdsForDispatch.length === customers.length) {
      setSelectedCustomerIdsForDispatch([]);
    } else {
      setSelectedCustomerIdsForDispatch(customers.map((c) => c.id));
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (tierFilter !== 'All' && c.tier !== tierFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.nameAr.includes(q) ||
        c.crNumber.includes(q) ||
        c.trn.includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Banner */}
      <div className="p-4 lg:p-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#161c27]">
              {isArabic ? 'إدارة العملاء والحسابات' : 'Customer Master & Accounts Directory'}
            </h1>
            <p className="text-xs text-[#70787d] mt-1">
              {isArabic
                ? 'دليل العملاء المؤسسي، العناوين الوطنية المعتمدة لـ ZATCA، والسقوف الائتمانية واشتراكات السحابة'
                : 'B2B enterprise directory, ZATCA registered National Addresses, credit facilities, and active subscriptions.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View State Controls for Design Completeness */}
            <div className="hidden md:flex items-center rounded-lg border border-[#e3e8f9] bg-white p-0.5 text-xs text-[#70787d]">
              <button
                onClick={() => setViewState('populated')}
                className={`rounded px-2 py-1 ${viewState === 'populated' ? 'bg-[#004a60] text-white font-semibold' : 'hover:bg-[#f1f3ff]'}`}
              >
                Normal
              </button>
              <button
                onClick={() => setViewState('skeleton')}
                className={`rounded px-2 py-1 ${viewState === 'skeleton' ? 'bg-[#004a60] text-white font-semibold' : 'hover:bg-[#f1f3ff]'}`}
              >
                Skeleton
              </button>
              <button
                onClick={() => setViewState('empty')}
                className={`rounded px-2 py-1 ${viewState === 'empty' ? 'bg-[#004a60] text-white font-semibold' : 'hover:bg-[#f1f3ff]'}`}
              >
                Empty
              </button>
            </div>

            {/* Multichannel Dispatch Action Group */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleOpenDispatch('whatsapp')}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                title="Send WhatsApp to customers"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span className="hidden md:inline">{isArabic ? 'واتساب' : 'WhatsApp'}</span>
                {selectedCustomerIdsForDispatch.length > 0 && (
                  <span className="bg-emerald-800 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                    {selectedCustomerIdsForDispatch.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleOpenDispatch('email')}
                className="flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                title="Send Regular Email to customers"
              >
                <Mail className="h-3.5 w-3.5" />
                <span className="hidden md:inline">{isArabic ? 'بريد' : 'Email'}</span>
                {selectedCustomerIdsForDispatch.length > 0 && (
                  <span className="bg-sky-800 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                    {selectedCustomerIdsForDispatch.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleOpenDispatch('sms')}
                className="flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                title="Send SMS"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span className="hidden md:inline">{isArabic ? 'رسائل SMS' : 'SMS'}</span>
                {selectedCustomerIdsForDispatch.length > 0 && (
                  <span className="bg-amber-800 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                    {selectedCustomerIdsForDispatch.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleOpenDispatch('whatsapp')}
                className="flex items-center gap-1.5 rounded-lg bg-[#004a60] hover:bg-[#074e64] text-white px-3 py-2 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                title="Batch Dispatch with Templates"
              >
                <Send className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">{isArabic ? 'إرسال جماعي' : 'Batch Message'}</span>
              </button>
            </div>

            <button
              onClick={onOpenCreateCustomer}
              className="flex items-center gap-2 rounded-lg bg-[#004a60] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#074e64] transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? '+ عميل جديد' : '+ New Customer'}</span>
            </button>
          </div>
        </div>

        {/* Success Dispatch Alert Banner */}
        {dispatchSuccessMsg && (
          <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{dispatchSuccessMsg}</span>
            </div>
            <button
              onClick={() => setDispatchSuccessMsg(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-[#e3e8f9] py-3">
          <div className="flex items-center gap-2">
            {(['All', 'Enterprise', 'Corporate'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  tierFilter === t
                    ? 'bg-[#004a60] text-white'
                    : 'bg-white text-[#40484d] border border-[#e3e8f9] hover:bg-[#f1f3ff]'
                }`}
              >
                {t === 'All' && (isArabic ? 'جميع العملاء' : 'All Clients')}
                {t === 'Enterprise' && 'Enterprise'}
                {t === 'Corporate' && 'Corporate'}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isArabic ? 'بحث بالاسم، السجل التجاري...' : 'Filter name, CR, TRN, City...'}
              className="w-full rounded-lg border border-[#e3e8f9] bg-white py-1.5 pl-8 pr-3 text-xs text-[#161c27] placeholder-[#70787d] focus:border-[#004a60] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Table View */}
        <div className="flex-1 overflow-auto p-4 lg:p-6 pt-2">
          {viewState === 'skeleton' ? (
            <div className="rounded-xl border border-[#e3e8f9] bg-white p-4 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : viewState === 'empty' ? (
            <div className="rounded-xl border border-[#e3e8f9] bg-white p-12 text-center">
              <Users className="h-12 w-12 text-[#bfc8cd] mx-auto mb-3" />
              <div className="font-bold text-sm text-[#161c27]">No customers in this view</div>
              <p className="text-xs text-[#70787d] mt-1">Get started by creating your first client profile.</p>
              <button
                onClick={onOpenCreateCustomer}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#004a60] px-4 py-2 text-xs font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                <span>Add Customer</span>
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#e3e8f9] bg-white shadow-xs">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="border-b border-[#e3e8f9] bg-[#f9f9ff] text-[11px] font-semibold uppercase text-[#70787d]">
                  <tr>
                    <th className="p-3 w-8">
                      <input
                        type="checkbox"
                        checked={
                          selectedCustomerIdsForDispatch.length === customers.length &&
                          customers.length > 0
                        }
                        onChange={handleSelectAllCustomers}
                        className="rounded text-[#004a60] focus:ring-[#004a60] cursor-pointer"
                        title="Select All"
                      />
                    </th>
                    <th className="p-3">{isArabic ? 'اسم المنشأة' : 'Customer Entity'}</th>
                    <th className="p-3">{isArabic ? 'السجل والرقم الضريبي' : 'CR & ZATCA TRN'}</th>
                    <th className="p-3">{isArabic ? 'جهة الاتصال' : 'Primary Contact'}</th>
                    <th className="p-3 text-right">{isArabic ? 'الرصيد القائم' : 'Outstanding (SAR)'}</th>
                    <th className="p-3">{isArabic ? 'الحد الائتماني' : 'Credit Facility'}</th>
                    <th className="p-3 text-center">{isArabic ? 'إرسال سريع' : 'Quick Dispatch'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8f9]">
                  {filteredCustomers.map((cust) => {
                    const isSelected = selectedCustomer?.id === cust.id;
                    const isChecked = selectedCustomerIdsForDispatch.includes(cust.id);
                    const utilPercent =
                      cust.creditLimit > 0
                        ? Math.round((cust.outstandingBalance / cust.creditLimit) * 100)
                        : 0;
                    return (
                      <tr
                        key={cust.id}
                        onClick={() => setSelectedCustomer(cust)}
                        className={`cursor-pointer transition-colors hover:bg-[#f1f3ff]/60 ${
                          isSelected ? 'bg-[#e8eeff]/70 font-medium' : ''
                        }`}
                      >
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleToggleCustomerSelection(cust.id, e as any)}
                            className="rounded text-[#004a60] focus:ring-[#004a60] cursor-pointer"
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8eeff] font-bold text-[#004a60]">
                              {cust.initials}
                            </div>
                            <div>
                              <div className="font-semibold text-[#161c27]">
                                {isArabic ? cust.nameAr : cust.name}
                              </div>
                              <div className="text-[10px] text-[#70787d]">
                                {cust.city}, {cust.country}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-[11px]">
                          <div>CR: {cust.crNumber}</div>
                          <div className="text-[10px] text-[#004a60]">TRN: {cust.trn}</div>
                        </td>
                        <td className="p-3 text-[11px]">
                          <div className="font-semibold text-[#161c27]">
                            {cust.primaryContact.name}
                          </div>
                          <div className="text-[10px] text-[#70787d]">
                            {cust.primaryContact.email}
                          </div>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-[#161c27]">
                          SAR {cust.outstandingBalance.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 rounded-full bg-[#e3e8f9] overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  utilPercent > 80
                                    ? 'bg-rose-500'
                                    : utilPercent > 50
                                    ? 'bg-amber-500'
                                    : 'bg-[#004a60]'
                                }`}
                                style={{ width: `${utilPercent}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-[#70787d]">
                              {utilPercent}%
                            </span>
                          </div>
                          <div className="text-[9px] text-[#70787d]">
                            Limit: SAR {cust.creditLimit.toLocaleString()}
                          </div>
                        </td>
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              title="Send WhatsApp"
                              onClick={() => handleOpenDispatch('whatsapp', [cust.id])}
                              className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Send Regular Email"
                              onClick={() => handleOpenDispatch('email', [cust.id])}
                              className="p-1 rounded-md text-sky-600 hover:bg-sky-50 cursor-pointer"
                            >
                              <Mail className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Send SMS"
                              onClick={() => handleOpenDispatch('sms', [cust.id])}
                              className="p-1 rounded-md text-amber-600 hover:bg-amber-50 cursor-pointer"
                            >
                              <Smartphone className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Side-Sheet: Customer 360 View */}
        {selectedCustomer && (
          <aside className="w-96 border-l border-[#e3e8f9] bg-white flex flex-col h-full shadow-lg shrink-0 overflow-y-auto hidden xl:flex">
            {/* Sheet Header */}
            <div className="p-4 border-b border-[#e3e8f9] flex items-center justify-between bg-[#f9f9ff]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004a60] font-bold text-white shadow-xs">
                  {selectedCustomer.initials}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#161c27] leading-tight">
                    {isArabic ? selectedCustomer.nameAr : selectedCustomer.name}
                  </div>
                  <span className="text-[10px] font-semibold text-[#004a60]">
                    {selectedCustomer.tier} Account
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-[#70787d] hover:text-[#161c27] p-1 rounded-md hover:bg-[#e3e8f9]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sheet Content */}
            <div className="p-4 space-y-4 text-xs">
              {/* ZATCA Official National Address Card */}
              <div className="rounded-xl border border-[#e3e8f9] p-3 space-y-2 bg-[#f9f9ff]">
                <div className="flex items-center justify-between text-xs font-bold text-[#161c27]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#004a60]" />
                    <span>ZATCA National Address</span>
                  </div>
                  <span className="rounded bg-[#aae2fd] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#004a60]">
                    {selectedCustomer.nationalAddress.shortAddress}
                  </span>
                </div>
                <div className="text-[11px] text-[#40484d] space-y-0.5">
                  <div>{selectedCustomer.nationalAddress.building}</div>
                  <div>
                    {selectedCustomer.nationalAddress.district},{' '}
                    {selectedCustomer.nationalAddress.city}{' '}
                    {selectedCustomer.nationalAddress.postalCode}
                  </div>
                </div>
              </div>

              {/* Credit Facility Overview */}
              <div className="rounded-xl border border-[#e3e8f9] p-3 space-y-2">
                <div className="flex items-center justify-between font-bold text-[#161c27]">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-[#004a60]" />
                    <span>Credit & Exposure Facility</span>
                  </div>
                  <span className="font-mono text-xs text-[#004a60]">
                    SAR {selectedCustomer.creditLimit.toLocaleString()} Max
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#70787d]">Current Outstanding:</span>
                  <span className="font-mono font-bold text-[#161c27]">
                    SAR {selectedCustomer.outstandingBalance.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#e3e8f9] overflow-hidden">
                  <div
                    className="h-full bg-[#004a60] rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (selectedCustomer.outstandingBalance /
                          selectedCustomer.creditLimit) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Active Cloud Subscriptions */}
              <div>
                <div className="font-bold text-[#161c27] mb-2 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[#004a60]" />
                  <span>Active Cloud Subscriptions</span>
                </div>
                <div className="space-y-2">
                  {selectedCustomer.activeSubscriptions.map((sub, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-[#e3e8f9] p-2.5 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-[#161c27]">{sub.title}</div>
                        <div className="text-[10px] text-[#70787d]">{sub.billingCycle}</div>
                      </div>
                      <div className="font-mono font-bold text-[#004a60]">
                        SAR {sub.pricePerMonth.toLocaleString()}/mo
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => onCreateOrderForCustomer(selectedCustomer)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#004a60] py-2.5 font-semibold text-white hover:bg-[#074e64] transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create Sales Order for Client</span>
                </button>
                <button
                  onClick={() =>
                    alert(
                      `Generated Statement of Account (SOA) for ${selectedCustomer.name} (YTD Ledger exported)`
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#e3e8f9] bg-white py-2 font-semibold text-[#40484d] hover:bg-[#f1f3ff] transition-all cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5 text-[#70787d]" />
                  <span>Generate Statement of Account (SOA)</span>
                </button>

                {/* Direct Client Dispatch Buttons */}
                <div className="pt-2 border-t border-[#e3e8f9] space-y-1.5">
                  <div className="text-[10px] font-bold text-[#70787d] uppercase">
                    {isArabic ? 'إرسال مباشر للعميل (واتساب / بريد / SMS)' : 'Direct Client Dispatch'}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenDispatch('whatsapp', [selectedCustomer.id])}
                      className="flex items-center justify-center gap-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white py-2 font-semibold text-[11px] transition-colors cursor-pointer border border-emerald-200"
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDispatch('email', [selectedCustomer.id])}
                      className="flex items-center justify-center gap-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white py-2 font-semibold text-[11px] transition-colors cursor-pointer border border-sky-200"
                    >
                      <Mail className="h-3 w-3" />
                      <span>{isArabic ? 'بريد' : 'Email'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDispatch('sms', [selectedCustomer.id])}
                      className="flex items-center justify-center gap-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white py-2 font-semibold text-[11px] transition-colors cursor-pointer border border-amber-200"
                    >
                      <Smartphone className="h-3 w-3" />
                      <span>{isArabic ? 'SMS' : 'SMS'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Multichannel Dispatch Modal for Customers */}
      <MultichannelDispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        isArabic={isArabic}
        initialChannel={dispatchChannel}
        allRecipients={recipientProfiles}
        initialSelectedRecipientIds={selectedCustomerIdsForDispatch}
        onDispatchSuccess={({ channel, count, templateName }) => {
          setDispatchSuccessMsg(
            isArabic
              ? `تم بنجاح إرسال "${templateName}" إلى ${count} عميل عبر ${channel.toUpperCase()}`
              : `Dispatched "${templateName}" to ${count} customer(s) via ${channel.toUpperCase()} successfully.`
          );
        }}
      />
    </div>
  );
};
