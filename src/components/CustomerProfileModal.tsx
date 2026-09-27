import React, { useState, useMemo } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Building,
  CreditCard,
  MapPin,
  MessageSquare,
  Smartphone,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Layers,
  FileText,
  AlertCircle,
  Share2,
  Calendar,
} from 'lucide-react';
import { Customer } from '../data/mockData';

export interface CustomerMessage {
  id: string;
  channel: 'email' | 'sms' | 'whatsapp';
  timestamp: string;
  subject?: string;
  subjectAr?: string;
  body: string;
  bodyAr?: string;
  sentTo: string;
  status: 'Delivered' | 'Read' | 'Sent';
  statusAr: string;
  senderName: string;
  category: 'ZATCA Invoice' | 'Payment Reminder' | 'Smart PIN' | 'Subscription' | 'General';
}

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  isArabic: boolean;
  onCreateSalesOrder?: (customer: Customer) => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  customer,
  isArabic,
  onCreateSalesOrder,
}) => {
  if (!isOpen || !customer) return null;

  // Active channel filter in communications
  const [activeChannelFilter, setActiveChannelFilter] = useState<'all' | 'email' | 'sms' | 'whatsapp'>('all');
  const [messageSearch, setMessageSearch] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Quick compose state
  const [isComposing, setIsComposing] = useState(false);
  const [composeChannel, setComposeChannel] = useState<'email' | 'sms' | 'whatsapp'>('whatsapp');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
    showToast(isArabic ? `تم نسخ ${fieldName}` : `Copied ${fieldName} to clipboard`);
  };

  // Mock messages customized per customer
  const [customerMessages, setCustomerMessages] = useState<Record<string, CustomerMessage[]>>(() => {
    // Generate default communications for existing customers
    const defaultMessages: CustomerMessage[] = [
      {
        id: 'MSG-001',
        channel: 'email',
        timestamp: '26 Sep 2026, 14:32',
        subject: `ZATCA Phase 2 E-Invoice #INV-2026-3380 Attached`,
        subjectAr: `فاتورة ضريبية إلكترونية معتمدة من زاتكا #INV-2026-3380`,
        body: `Dear ${customer.primaryContact.name},\n\nPlease find attached the official ZATCA Cryptographically Cleared Tax Invoice #INV-2026-3380 for ${customer.name}. Taxable Amount: SAR ${customer.outstandingBalance.toLocaleString()}.00 with embedded QR Verification Hash.\n\nBest regards,\nSaudi Hospitality Hub Accounts Department`,
        bodyAr: `عزيزنا ${customer.primaryContact.name}،\n\nنرفق لكم الفاتورة الضريبية الرسمية المشفرة والمجازة من هيئة الزكاة والضريبة والجمارك رقم #INV-2026-3380 لصالح ${customer.nameAr}. المبلغ الخاضع للضريبة: ${customer.outstandingBalance.toLocaleString()} ر.س مع رمز الاستجابة السريع المعتمد.`,
        sentTo: customer.primaryContact.email,
        status: 'Read',
        statusAr: 'تمت القراءة',
        senderName: 'Billing & ZATCA Gateway',
        category: 'ZATCA Invoice',
      },
      {
        id: 'MSG-002',
        channel: 'whatsapp',
        timestamp: '24 Sep 2026, 11:15',
        subject: `Monthly Hospitality Cloud Subscription Renewal`,
        subjectAr: `إشعار تجديد اشتراك باقة الضيافة الفندقية السحابية`,
        body: `مرحباً أستاذ ${customer.primaryContact.name}،\nيسعدنا إشعاركم بجاهزية اشتراككم السحابي في منصة نزل للضيافة (${customer.activeSubscriptions[0]?.title || 'Enterprise OS'}). للدفع الفوري عبر مدى أو سداد برمز الفوترة المعتمد: https://pay.hospitality.sa/inv/${customer.id}`,
        sentTo: customer.primaryContact.phone,
        status: 'Delivered',
        statusAr: 'تم التسليم عبر الواتساب',
        senderName: 'Nuzul Hospitality Concierge',
        category: 'Subscription',
      },
      {
        id: 'MSG-003',
        channel: 'sms',
        timestamp: '20 Sep 2026, 09:40',
        subject: `Payment Reminder: Statement of Account SAR ${customer.outstandingBalance.toLocaleString()}`,
        subjectAr: `تذكير سداد: الرصيد القائم المستحق`,
        body: `تذكير سداد من نزل: عزيزنا العميل في ${customer.nameAr}، نود تذكيركم بسداد المستحق بقيمة ${customer.outstandingBalance.toLocaleString()} ر.س عبر نظام سداد (رمز المفوتر: 204) أو مدى لتفادي توقف الصلاحيات. شكراً لتعاونكم.`,
        sentTo: customer.primaryContact.phone,
        status: 'Delivered',
        statusAr: 'تم تسليم الرسالة النصية',
        senderName: 'SMS Gateway (Saudi Telecom)',
        category: 'Payment Reminder',
      },
      {
        id: 'MSG-004',
        channel: 'whatsapp',
        timestamp: '15 Sep 2026, 16:05',
        subject: `Smart Lock PIN & VIP Room Access Key PIN 4910#`,
        subjectAr: `رمز الدخول الذكي للأجنحة الفندقية 4910#`,
        body: `عزيزنا ${customer.primaryContact.name}،\nتم إصدار رمز الدخول الذكي المشفر للأبواب: 4910# لغرف وأجنحة المشغل في ${customer.city}. صالح طوال فترة الإقامة والزيارة. نتمنى لكم إقامة سعيدة!`,
        sentTo: customer.primaryContact.phone,
        status: 'Read',
        statusAr: 'تمت القراءة',
        senderName: 'Smart Access IoT Service',
        category: 'Smart PIN',
      },
      {
        id: 'MSG-005',
        channel: 'email',
        timestamp: '10 Sep 2026, 08:30',
        subject: `Monthly Statement of Account (SOA) Q3 2026`,
        subjectAr: `كشف حساب العميل والتعاملات المالية للربع الثالث`,
        body: `Dear ${customer.primaryContact.name},\n\nYour Statement of Account (SOA) for ${customer.name} (CR: ${customer.crNumber}) is ready for download. Credit Facility Limit: SAR ${customer.creditLimit.toLocaleString()}. Current Balance: SAR ${customer.outstandingBalance.toLocaleString()}.\n\nThank you for choosing Saudi Hospitality OS.`,
        bodyAr: `السادة / ${customer.nameAr} المحترمين،\nعناية الأستاذ / ${customer.primaryContact.name}\n\nنرفق لكم كشف الحساب المالي المعتمد لتعاملات الربع الثالث. السقف الائتماني المعتمد: ${customer.creditLimit.toLocaleString()} ر.س. الرصيد المتبقي: ${customer.outstandingBalance.toLocaleString()} ر.س.`,
        sentTo: customer.primaryContact.email,
        status: 'Read',
        statusAr: 'تمت القراءة',
        senderName: 'Finance & AR Department',
        category: 'General',
      },
    ];
    return { [customer.id]: defaultMessages };
  });

  const messagesList = customerMessages[customer.id] || [];

  // Filter messages by channel & search
  const filteredMessages = useMemo(() => {
    return messagesList.filter((m) => {
      const matchChannel = activeChannelFilter === 'all' || m.channel === activeChannelFilter;
      const q = messageSearch.toLowerCase();
      const matchSearch =
        !q ||
        m.body.toLowerCase().includes(q) ||
        (m.bodyAr && m.bodyAr.toLowerCase().includes(q)) ||
        (m.subject && m.subject.toLowerCase().includes(q)) ||
        (m.subjectAr && m.subjectAr.toLowerCase().includes(q)) ||
        m.sentTo.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q);
      return matchChannel && matchSearch;
    });
  }, [messagesList, activeChannelFilter, messageSearch]);

  const counts = useMemo(() => {
    const emailCount = messagesList.filter((m) => m.channel === 'email').length;
    const smsCount = messagesList.filter((m) => m.channel === 'sms').length;
    const whatsappCount = messagesList.filter((m) => m.channel === 'whatsapp').length;
    return { all: messagesList.length, email: emailCount, sms: smsCount, whatsapp: whatsappCount };
  }, [messagesList]);

  // Handle Quick Send Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeBody.trim()) return;

    const targetRecipient = composeChannel === 'email' ? customer.primaryContact.email : customer.primaryContact.phone;

    const newMsg: CustomerMessage = {
      id: `MSG-${Date.now()}`,
      channel: composeChannel,
      timestamp: 'Just now',
      subject: composeSubject.trim() || (composeChannel === 'email' ? 'New Message from Saudi Hospitality OS' : undefined),
      body: composeBody.trim(),
      sentTo: targetRecipient,
      status: 'Delivered',
      statusAr: 'تم الإرسال بنجاح',
      senderName: 'Support & Dispatch Hub',
      category: 'General',
    };

    setCustomerMessages((prev) => ({
      ...prev,
      [customer.id]: [newMsg, ...(prev[customer.id] || [])],
    }));

    setComposeSubject('');
    setComposeBody('');
    setIsComposing(false);
    showToast(
      isArabic
        ? `تم إرسال الرسالة إلى ${customer.primaryContact.name} عبر ${composeChannel.toUpperCase()} بنجاح`
        : `Message sent to ${customer.primaryContact.name} via ${composeChannel.toUpperCase()} successfully`
    );
  };

  const utilPercent = Math.min(
    100,
    Math.round((customer.outstandingBalance / (customer.creditLimit || 1)) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-60 flex items-center gap-2 rounded-xl bg-[#004a60] text-white px-4 py-2.5 shadow-xl border border-white/20 text-xs font-semibold animate-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#e3e8f9] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Top Header / Profile Bar */}
        <div className="px-6 py-4.5 border-b border-[#e3e8f9] bg-gradient-to-r from-[#003647] via-[#004a60] to-[#0d5c75] text-white shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white font-bold text-lg border border-white/20 shadow-xs">
              {customer.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {isArabic ? customer.nameAr : customer.name}
                </h2>
                <span className="rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 text-[10px] font-bold px-2 py-0.5">
                  {customer.tier} Account
                </span>
              </div>
              <div className="text-xs text-white/80 mt-0.5 flex items-center gap-2">
                <span>{customer.city}, {customer.country}</span>
                <span>•</span>
                <span className="font-mono text-white/90">CR: {customer.crNumber}</span>
                <span>•</span>
                <span className="font-mono text-white/90">TRN: {customer.trn}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onCreateSalesOrder && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCreateSalesOrder(customer);
                }}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isArabic ? 'إنشاء أمر بيع' : 'New Sales Order'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - 2 Columns Layout */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
          {/* Left Column: Customer Profile Details (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Primary Contact Person Box */}
            <div className="bg-[#f9f9ff] rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#e3e8f9]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#004a60] flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {isArabic ? 'بيانات جهة الاتصال الرئيسية' : 'Primary Contact Details'}
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-1.5 py-0.5 rounded-md">
                  Authorized
                </span>
              </div>

              <div className="space-y-3">
                {/* Contact Name */}
                <div>
                  <span className="text-[10px] text-[#70787d] uppercase tracking-wider block font-medium">
                    {isArabic ? 'الاسم بالكامل' : 'Contact Person Name'}
                  </span>
                  <div className="text-xs font-bold text-[#161c27] mt-0.5 flex items-center justify-between">
                    <span>{customer.primaryContact.name}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(customer.primaryContact.name, 'Name')}
                      className="text-[#70787d] hover:text-[#004a60] p-1"
                      title="Copy Name"
                    >
                      {copiedField === 'Name' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <span className="text-[10px] text-[#70787d] uppercase tracking-wider block font-medium">
                    {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                  </span>
                  <div className="text-xs font-semibold text-[#004a60] mt-0.5 flex items-center justify-between">
                    <a
                      href={`mailto:${customer.primaryContact.email}`}
                      className="hover:underline flex items-center gap-1.5 truncate max-w-[210px]"
                    >
                      <Mail className="h-3.5 w-3.5 text-[#004a60] shrink-0" />
                      <span className="truncate">{customer.primaryContact.email}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(customer.primaryContact.email, 'Email')}
                      className="text-[#70787d] hover:text-[#004a60] p-1 shrink-0"
                      title="Copy Email"
                    >
                      {copiedField === 'Email' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <span className="text-[10px] text-[#70787d] uppercase tracking-wider block font-medium">
                    {isArabic ? 'رقم الهاتف / الجوال' : 'Phone / Mobile'}
                  </span>
                  <div className="text-xs font-semibold text-[#161c27] mt-0.5 flex items-center justify-between">
                    <a
                      href={`tel:${customer.primaryContact.phone}`}
                      className="hover:underline font-mono flex items-center gap-1.5 text-emerald-700 font-bold"
                    >
                      <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{customer.primaryContact.phone}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(customer.primaryContact.phone, 'Phone')}
                      className="text-[#70787d] hover:text-[#004a60] p-1 shrink-0"
                      title="Copy Phone"
                    >
                      {copiedField === 'Phone' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct Quick Action Buttons */}
              <div className="mt-3 pt-3 border-t border-[#e3e8f9] flex items-center gap-1.5">
                <a
                  href={`tel:${customer.primaryContact.phone}`}
                  className="flex-1 py-1.5 rounded-lg bg-white border border-[#c3cce6] hover:bg-[#e8eeff] text-[#004a60] text-center font-bold text-[11px] transition-colors flex items-center justify-center gap-1"
                >
                  <Phone className="h-3 w-3 text-emerald-600" />
                  <span>{isArabic ? 'اتصال' : 'Call'}</span>
                </a>
                <a
                  href={`mailto:${customer.primaryContact.email}`}
                  className="flex-1 py-1.5 rounded-lg bg-white border border-[#c3cce6] hover:bg-[#e8eeff] text-[#004a60] text-center font-bold text-[11px] transition-colors flex items-center justify-center gap-1"
                >
                  <Mail className="h-3 w-3 text-sky-600" />
                  <span>{isArabic ? 'بريد' : 'Email'}</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setIsComposing(true);
                    setComposeChannel('whatsapp');
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <MessageSquare className="h-3 w-3" />
                  <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
                </button>
              </div>
            </div>

            {/* Financial Exposure & Credit Facility */}
            <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between font-bold text-[#161c27]">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-[#004a60]" />
                  <span>{isArabic ? 'السقف الائتماني والتعرض' : 'Credit & Exposure Facility'}</span>
                </div>
                <span className="font-mono text-[11px] text-[#004a60]">
                  SAR {customer.creditLimit.toLocaleString()} Max
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-[#70787d]">{isArabic ? 'الرصيد القائم المستحق:' : 'Current Outstanding:'}</span>
                <span className="font-mono font-bold text-[#161c27]">
                  SAR {customer.outstandingBalance.toLocaleString()}
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div className="h-2 rounded-full bg-[#e3e8f9] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      utilPercent > 80 ? 'bg-rose-500' : utilPercent > 50 ? 'bg-amber-500' : 'bg-[#004a60]'
                    }`}
                    style={{ width: `${utilPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#70787d] mt-1">
                  <span>{isArabic ? 'الاستخدام:' : 'Utilization:'} {utilPercent}%</span>
                  <span>{isArabic ? 'المتاح:' : 'Available:'} SAR {(customer.creditLimit - customer.outstandingBalance).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* ZATCA Registered National Address */}
            <div className="bg-[#f9f9ff] rounded-2xl border border-[#e3e8f9] p-3.5 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-[#161c27]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#004a60]" />
                  <span>{isArabic ? 'العنوان الوطني لـ ZATCA' : 'ZATCA National Address'}</span>
                </div>
                <span className="rounded bg-[#aae2fd] px-1.5 py-0.2 font-mono text-[10px] font-bold text-[#004a60]">
                  {customer.nationalAddress.shortAddress}
                </span>
              </div>
              <div className="text-[11px] text-[#40484d] leading-relaxed">
                <div>{customer.nationalAddress.building}</div>
                <div>{customer.nationalAddress.district}, {customer.nationalAddress.city} {customer.nationalAddress.postalCode}</div>
              </div>
            </div>

            {/* Active Subscriptions Box */}
            <div className="bg-white rounded-2xl border border-[#e3e8f9] p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#161c27]">
                <Layers className="h-3.5 w-3.5 text-[#004a60]" />
                <span>{isArabic ? 'الاشتراكات السحابية النشطة' : 'Active Subscriptions'}</span>
              </div>
              <div className="space-y-1.5">
                {customer.activeSubscriptions.map((sub, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9] flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-[#161c27] text-[11px]">{sub.title}</div>
                      <div className="text-[10px] text-[#70787d]">{sub.billingCycle}</div>
                    </div>
                    <div className="font-mono font-bold text-[#004a60] text-xs">
                      SAR {sub.pricePerMonth.toLocaleString()}/mo
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Communications Sent to Customer (Emails, SMS, Messages) (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            {/* Communications Header & Channel Filter Bar */}
            <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#e3e8f9]">
                <div>
                  <h3 className="text-sm font-bold text-[#161c27] flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-[#004a60]" />
                    <span>
                      {isArabic
                        ? `سجل الرسائل المرسلة للعميل (${counts.all})`
                        : `Customer Sent Messages & Log (${counts.all})`}
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#70787d] mt-0.5">
                    {isArabic
                      ? 'جميع رسائل البريد الإلكتروني، والرسائل النصية القصيرة SMS، ومراسلات الواتساب المرسلة للعميل'
                      : 'Audit log of all official emails, SMS alerts, and WhatsApp messages dispatched to this client.'}
                  </p>
                </div>

                {/* Send New Message Button */}
                <button
                  type="button"
                  onClick={() => setIsComposing(!isComposing)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isComposing ? (isArabic ? 'إخفاء الإرسال' : 'Close Form') : (isArabic ? '+ إرسال رسالة جديدة' : '+ Send Message')}</span>
                </button>
              </div>

              {/* Compose Box (If toggled) */}
              {isComposing && (
                <form
                  onSubmit={handleSendMessage}
                  className="p-3.5 rounded-xl bg-[#f9f9ff] border border-[#c3cce6] space-y-3 animate-in fade-in duration-150"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#161c27] flex items-center gap-1.5">
                      <Send className="h-3.5 w-3.5 text-[#004a60]" />
                      {isArabic ? 'إرسال رسالة فورية إلى جهة الاتصال' : 'Dispatch New Message to Customer'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setComposeChannel('whatsapp')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                          composeChannel === 'whatsapp'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-white text-[#70787d] border border-[#e3e8f9]'
                        }`}
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setComposeChannel('email')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                          composeChannel === 'email'
                            ? 'bg-sky-600 text-white shadow-2xs'
                            : 'bg-white text-[#70787d] border border-[#e3e8f9]'
                        }`}
                      >
                        <Mail className="h-3 w-3" />
                        <span>Email</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setComposeChannel('sms')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                          composeChannel === 'sms'
                            ? 'bg-amber-600 text-white shadow-2xs'
                            : 'bg-white text-[#70787d] border border-[#e3e8f9]'
                        }`}
                      >
                        <Smartphone className="h-3 w-3" />
                        <span>SMS</span>
                      </button>
                    </div>
                  </div>

                  {/* Sent To Target Indicator */}
                  <div className="text-[11px] text-[#70787d] bg-white p-2 rounded-lg border border-[#e3e8f9]">
                    <span className="font-semibold text-[#161c27]">
                      {isArabic ? 'المستلم:' : 'Recipient:'}{' '}
                    </span>
                    {customer.primaryContact.name} ({composeChannel === 'email' ? customer.primaryContact.email : customer.primaryContact.phone})
                  </div>

                  {composeChannel === 'email' && (
                    <input
                      type="text"
                      value={composeSubject}
                      onChange={(e) => setComposeSubject(e.target.value)}
                      placeholder={isArabic ? 'موضوع البريد الإلكتروني...' : 'Email Subject line...'}
                      className="w-full rounded-lg border border-[#c3cce6] bg-white px-3 py-1.5 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden"
                    />
                  )}

                  <textarea
                    rows={3}
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    placeholder={
                      composeChannel === 'whatsapp'
                        ? isArabic
                          ? 'اكتب رسالة الواتساب هنا...'
                          : 'Write WhatsApp message text...'
                        : composeChannel === 'sms'
                        ? isArabic
                          ? 'نص الرسالة القصيرة SMS (160 حرف)...'
                          : 'SMS Text message content (160 chars max)...'
                        : isArabic
                        ? 'محتوى البريد الإلكتروني...'
                        : 'Email message content...'
                    }
                    className="w-full rounded-lg border border-[#c3cce6] bg-white px-3 py-2 text-xs text-[#161c27] focus:border-[#004a60] outline-hidden"
                  />

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsComposing(false)}
                      className="px-3 py-1.5 rounded-lg border border-[#c3cce6] text-[#70787d] hover:bg-white text-xs font-semibold cursor-pointer"
                    >
                      {isArabic ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#004a60] hover:bg-[#074e64] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="h-3 w-3" />
                      <span>{isArabic ? 'إرسال الآن' : 'Dispatch Now'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Filters & Search Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                {/* Channel Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setActiveChannelFilter('all')}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                      activeChannelFilter === 'all'
                        ? 'bg-[#004a60] text-white'
                        : 'bg-[#f1f3ff] text-[#40484d] hover:bg-[#e8eeff]'
                    }`}
                  >
                    {isArabic ? 'الكل' : 'All'} ({counts.all})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveChannelFilter('email')}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap flex items-center gap-1 cursor-pointer transition-colors ${
                      activeChannelFilter === 'email'
                        ? 'bg-sky-600 text-white'
                        : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
                    }`}
                  >
                    <Mail className="h-3 w-3" />
                    <span>{isArabic ? 'البريد' : 'Emails'}</span> ({counts.email})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveChannelFilter('sms')}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap flex items-center gap-1 cursor-pointer transition-colors ${
                      activeChannelFilter === 'sms'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    <Smartphone className="h-3 w-3" />
                    <span>{isArabic ? 'رسائل SMS' : 'SMS'}</span> ({counts.sms})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveChannelFilter('whatsapp')}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap flex items-center gap-1 cursor-pointer transition-colors ${
                      activeChannelFilter === 'whatsapp'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    <MessageSquare className="h-3 w-3" />
                    <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span> ({counts.whatsapp})
                  </button>
                </div>

                {/* Message Search */}
                <div className="relative sm:w-56">
                  <Search className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d] ${isArabic ? 'right-2.5' : 'left-2.5'}`} />
                  <input
                    type="text"
                    value={messageSearch}
                    onChange={(e) => setMessageSearch(e.target.value)}
                    placeholder={isArabic ? 'بحث في الرسائل...' : 'Search messages...'}
                    className={`w-full rounded-lg border border-[#e3e8f9] bg-[#f9f9ff] py-1 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden ${
                      isArabic ? 'pr-8 pl-2' : 'pl-8 pr-2'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-[#c3cce6] bg-[#f9f9ff]">
                  <MessageSquare className="h-8 w-8 text-[#70787d] mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold text-[#161c27]">
                    {isArabic ? 'لا توجد رسائل مطابقة' : 'No Messages Found'}
                  </p>
                  <p className="text-[11px] text-[#70787d] mt-1">
                    {isArabic
                      ? 'يمكنك إرسال أول بريد، أو رسالة SMS، أو واتساب باستخدام الزر أعلاه'
                      : 'You can send a new email, SMS, or WhatsApp message to this client.'}
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-2xl border p-4 shadow-2xs transition-all hover:shadow-xs bg-white ${
                      msg.channel === 'email'
                        ? 'border-sky-100 hover:border-sky-300'
                        : msg.channel === 'sms'
                        ? 'border-amber-100 hover:border-amber-300'
                        : 'border-emerald-100 hover:border-emerald-300'
                    }`}
                  >
                    {/* Message Header */}
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#f1f3ff]">
                      <div className="flex items-center gap-2">
                        {/* Channel Badge */}
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            msg.channel === 'email'
                              ? 'bg-sky-100 text-sky-800'
                              : msg.channel === 'sms'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {msg.channel === 'email' && <Mail className="h-3 w-3" />}
                          {msg.channel === 'sms' && <Smartphone className="h-3 w-3" />}
                          {msg.channel === 'whatsapp' && <MessageSquare className="h-3 w-3" />}
                          <span className="uppercase">{msg.channel}</span>
                        </span>

                        {/* Category tag */}
                        <span className="text-[10px] bg-gray-100 text-[#40484d] font-semibold px-2 py-0.2 rounded-md">
                          {msg.category}
                        </span>
                      </div>

                      {/* Timestamp & Status */}
                      <div className="flex items-center gap-2 text-[10px] text-[#70787d]">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3 w-3 text-[#70787d]" />
                          {msg.timestamp}
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-md">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          {isArabic ? msg.statusAr : msg.status}
                        </span>
                      </div>
                    </div>

                    {/* Subject line (if email or titled) */}
                    {(msg.subject || msg.subjectAr) && (
                      <div className="font-bold text-xs text-[#161c27] mb-1.5">
                        {isArabic && msg.subjectAr ? msg.subjectAr : msg.subject}
                      </div>
                    )}

                    {/* Body Content */}
                    <div className="text-xs text-[#40484d] whitespace-pre-line leading-relaxed bg-[#fcfdff] p-3 rounded-xl border border-[#f1f3ff]">
                      {isArabic && msg.bodyAr ? msg.bodyAr : msg.body}
                    </div>

                    {/* Message Footer Info */}
                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#70787d]">
                      <div>
                        <span className="font-medium text-[#161c27]">
                          {isArabic ? 'مرسلة إلى:' : 'Delivered to:'}{' '}
                        </span>
                        <span className="font-mono text-[#004a60] font-semibold">{msg.sentTo}</span>
                      </div>
                      <div>
                        <span>{isArabic ? 'بواسطة:' : 'Sender:'} {msg.senderName}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#e3e8f9] bg-[#f9f9ff] flex items-center justify-between shrink-0">
          <div className="text-xs text-[#70787d]">
            {isArabic ? 'الملف التعريفي للعميل والرسائل المعتمدة' : 'Customer Master Profile & Official Logs'}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#004a60] text-white text-xs font-semibold hover:bg-[#074e64] shadow-xs cursor-pointer"
            >
              {isArabic ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
