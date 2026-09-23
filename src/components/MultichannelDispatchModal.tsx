import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Smartphone,
  Send,
  X,
  CheckCircle2,
  Users,
  User,
  Sparkles,
  Paperclip,
  ShieldCheck,
  Check,
  Clock,
  AlertCircle,
  Copy,
  ChevronDown,
} from 'lucide-react';

export type CommunicationChannel = 'email' | 'sms' | 'whatsapp';

export interface RecipientProfile {
  id: string;
  name: string;
  nameAr?: string;
  company?: string;
  companyAr?: string;
  email: string;
  phone: string;
  role?: string;
  outstandingBalance?: number;
  smartPin?: string;
  city?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  nameAr: string;
  channel: CommunicationChannel | 'all';
  subject?: string;
  subjectAr?: string;
  body: string;
  bodyAr: string;
}

interface MultichannelDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
  initialChannel?: CommunicationChannel;
  allRecipients: RecipientProfile[];
  initialSelectedRecipientIds?: string[];
  onDispatchSuccess?: (info: {
    channel: CommunicationChannel;
    count: number;
    templateName: string;
  }) => void;
}

export const MultichannelDispatchModal: React.FC<MultichannelDispatchModalProps> = ({
  isOpen,
  onClose,
  isArabic,
  initialChannel = 'whatsapp',
  allRecipients,
  initialSelectedRecipientIds = [],
  onDispatchSuccess,
}) => {
  if (!isOpen) return null;

  const [channel, setChannel] = useState<CommunicationChannel>(initialChannel);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialSelectedRecipientIds.length > 0
      ? initialSelectedRecipientIds
      : allRecipients.map((r) => r.id)
  );

  // Search in recipients list
  const [recipientSearch, setRecipientSearch] = useState('');

  // Selected template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-pin');

  // Custom message overrides
  const [subjectInput, setSubjectInput] = useState<string>(
    'The Chedi Hegra AlUla - Digital Key PIN & Booking Confirmation'
  );
  const [messageBody, setMessageBody] = useState<string>(
    'مرحباً {{name}}،\nتم تأكيد حجزكم في {{company}}. كود الدخول للقفل الذكي للفيلا هو {{smart_pin}}. فاتورة ZATCA الضريبية المعتمدة رقم 10293 مرفقة.\nنتمنى لكم إقامة سعيدة.'
  );

  // Attachments
  const [attachZatcaFolio, setAttachZatcaFolio] = useState<boolean>(true);
  const [attachShortAddress, setAttachShortAddress] = useState<boolean>(true);

  // Sending state
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendProgress, setSendProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Pre-configured templates
  const TEMPLATES: MessageTemplate[] = [
    {
      id: 'tpl-pin',
      name: 'Smart Lock Key PIN & Welcome',
      nameAr: 'كود القفل الذكي وترحيب النزيل',
      channel: 'all',
      subject: 'Your Smart Room Key & Check-in Details',
      subjectAr: 'بيانات الدخول الذكي وتأكيد حجز الجناح',
      body: 'Dear {{name}},\nWelcome to {{company}}. Your smart digital key PIN is {{smart_pin}}. Valid for seamless access upon arrival. Your ZATCA compliant e-folio is linked.',
      bodyAr: 'مرحباً {{name}}،\nنرحب بكم في {{company}}. كود الدخول الذكي للفيلا/الجناح هو: {{smart_pin}}. الكود مفعل وجاهز للاستخدام. فاتورة الزكاة الضريبية مرفقة مع رمز QR.',
    },
    {
      id: 'tpl-zatca',
      name: 'ZATCA Phase 2 E-Invoice Folio',
      nameAr: 'إشعار الفاتورة الضريبية ZATCA',
      channel: 'all',
      subject: 'Tax Folio & Cryptographic Verification',
      subjectAr: 'فاتورة ضريبية رسمية معتمدة من هيئة الزكاة',
      body: 'Dear {{name}},\nYour official tax invoice from {{company}} has been cleared with ZATCA Phase 2. Outstanding Balance: SAR {{balance}}. View attached PDF receipt.',
      bodyAr: 'عزيزي {{name}}،\nتم إصدار واعتماد فاتورتكم الضريبية من {{company}} عبر منصة فاتورة (ZATCA Phase 2). الرصيد: {{balance}} ريال. تجدون الفاتورة الرسمية مرفقة.',
    },
    {
      id: 'tpl-reminder',
      name: 'Corporate Balance Payment Reminder',
      nameAr: 'تذكير بسداد المستحقات والآجل',
      channel: 'all',
      subject: 'Statement of Account & Settlement Notice',
      subjectAr: 'كشف حساب ومطالبة سداد الفواتير المستحقة',
      body: 'Greetings {{name}},\nThis is a polite reminder regarding pending payment of SAR {{balance}} for {{company}}. Kindly settle via SADAD Bill #2049102.',
      bodyAr: 'تحية طيبة {{name}}،\nنود تذكيركم بسداد المستحقات القائمة بمبلغ {{balance}} ريال لحساب {{company}}. يمكنكم السداد المباشر عبر نظام سداد رقم 2049102.',
    },
    {
      id: 'tpl-vip',
      name: 'VIP Concierge Escort & Transfer',
      nameAr: 'استقبال الوفود وكبار الشخصيات',
      channel: 'all',
      subject: 'Airport Escort & Private Villa Concierge',
      subjectAr: 'ترتيبات الاستقبال الخاص وخدمة الكونسيرج',
      body: 'Esteemed {{name}},\nYour private luxury transfer has been scheduled for your arrival at {{company}}. Your dedicated butler is reachable via this number.',
      bodyAr: 'سعادة {{name}}،\nتم تأكيد خدمة الاستقبال والنقل الفاخر من المطار إلى {{company}}. المساعد الشخصي بانتظار تشريفكم لخدمتكم على مدار الساعة.',
    },
    {
      id: 'tpl-custom',
      name: 'Custom Tailored Message',
      nameAr: 'رسالة مخصصة (نص حر)',
      channel: 'all',
      subject: 'Notice from Khetat Hospitality Management',
      subjectAr: 'إشعار من إدارة الضيافة',
      body: 'Dear {{name}},\n\n[Write your customized announcement or instruction here]\n\nWarm regards,\n{{company}} Operations Team',
      bodyAr: 'السيد/ة {{name}} المحترم/ة،\n\n[اكتب نص رسالتك المخصصة هنا]\n\nمع أطيب التحيات،\nفريق إدارة العمليات في {{company}}',
    },
  ];

  // When template changes, apply text
  const handleSelectTemplate = (tpl: MessageTemplate) => {
    setSelectedTemplateId(tpl.id);
    setSubjectInput(isArabic ? tpl.subjectAr || tpl.subject || '' : tpl.subject || '');
    setMessageBody(isArabic ? tpl.bodyAr : tpl.body);
  };

  // Toggle recipient
  const handleToggleRecipient = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Select all / deselect all
  const handleSelectAll = () => {
    if (selectedIds.length === allRecipients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allRecipients.map((r) => r.id));
    }
  };

  // Insert tag into text
  const handleInsertTag = (tag: string) => {
    setMessageBody((prev) => prev + ` {{${tag}}}`);
  };

  // Filtered recipients
  const filteredRecipients = allRecipients.filter((r) => {
    const q = recipientSearch.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.nameAr && r.nameAr.includes(q)) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      (r.company && r.company.toLowerCase().includes(q))
    );
  });

  // Sample recipient for preview
  const previewRecipient =
    allRecipients.find((r) => selectedIds.includes(r.id)) || allRecipients[0];

  const renderPreviewText = (templateText: string) => {
    if (!previewRecipient) return templateText;
    return templateText
      .replace(/\{\{name\}\}/g, isArabic ? previewRecipient.nameAr || previewRecipient.name : previewRecipient.name)
      .replace(/\{\{company\}\}/g, isArabic ? previewRecipient.companyAr || previewRecipient.company || 'منشأة الضيافة' : previewRecipient.company || 'Khetat Hospitality')
      .replace(/\{\{balance\}\}/g, (previewRecipient.outstandingBalance || 14250).toLocaleString())
      .replace(/\{\{smart_pin\}\}/g, previewRecipient.smartPin || '4910#')
      .replace(/\{\{role\}\}/g, previewRecipient.role || 'Partner')
      .replace(/\{\{city\}\}/g, previewRecipient.city || 'Riyadh');
  };

  // Send dispatch execution
  const handleExecuteSend = () => {
    if (selectedIds.length === 0) return;
    setIsSending(true);
    setSendProgress(15);

    const stepInterval = setInterval(() => {
      setSendProgress((prev) => {
        if (prev >= 100) {
          clearInterval(stepInterval);
          setIsSending(false);
          setIsCompleted(true);
          const currentTpl = TEMPLATES.find((t) => t.id === selectedTemplateId);
          if (onDispatchSuccess) {
            onDispatchSuccess({
              channel,
              count: selectedIds.length,
              templateName: currentTpl ? (isArabic ? currentTpl.nameAr : currentTpl.name) : 'Custom Message',
            });
          }
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-[#e3e8f9] max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#e3e8f9] bg-[#f9f9ff] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#004a60] text-white flex items-center justify-center shadow-xs">
              {channel === 'whatsapp' && <MessageSquare className="h-5 w-5 text-emerald-300" />}
              {channel === 'email' && <Mail className="h-5 w-5 text-sky-300" />}
              {channel === 'sms' && <Smartphone className="h-5 w-5 text-amber-300" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#161c27]">
                  {isArabic ? 'إرسال الرسائل والتنبيهات المخصصة' : 'Omnichannel Customer Dispatch'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {isArabic ? 'بث فوري موثق' : 'Verified Gateway'}
                </span>
              </div>
              <p className="text-[11px] text-[#70787d]">
                {isArabic
                  ? 'إرسال بريد إلكتروني، رسائل نصية SMS، أو واتساب مع قوالب تفاعلية وتخصيص بالبيانات.'
                  : 'Send Regular Email, SMS, or WhatsApp to individual or batch customer profiles.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#70787d] hover:text-[#161c27] p-1.5 rounded-lg hover:bg-[#e3e8f9] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isCompleted ? (
          <div className="p-8 sm:p-12 text-center space-y-4 my-auto">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-[#161c27]">
                {isArabic ? 'تم إرسال الرسائل بنجاح!' : 'Messages Successfully Dispatched!'}
              </h4>
              <p className="text-xs text-[#70787d] max-w-md mx-auto">
                {isArabic
                  ? `تم تسليم الرسالة إلى ${selectedIds.length} مستلم عبر قناة ${channel.toUpperCase()}. تم تسجيل التقرير في سجلات الزكاة والأمن السيبراني.`
                  : `Delivered to ${selectedIds.length} customer profiles via ${channel.toUpperCase()} gateway with digital timestamp.`}
              </p>
            </div>

            <div className="p-4 bg-[#f9f9ff] rounded-xl border border-[#e3e8f9] max-w-sm mx-auto text-left text-xs space-y-1.5">
              <div className="flex justify-between text-[#70787d]">
                <span>Channel:</span>
                <span className="font-bold text-[#161c27] uppercase">{channel}</span>
              </div>
              <div className="flex justify-between text-[#70787d]">
                <span>Recipients Reached:</span>
                <span className="font-bold text-emerald-700">{selectedIds.length} Profiles</span>
              </div>
              <div className="flex justify-between text-[#70787d]">
                <span>Status:</span>
                <span className="font-bold text-emerald-700">Acknowledged / Delivered (100%)</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={onClose}
                className="rounded-xl bg-[#004a60] text-white px-6 py-2.5 text-xs font-bold shadow-xs hover:bg-[#074e64] cursor-pointer"
              >
                {isArabic ? 'إغلاق ومتابعة' : 'Done & Return to Profiles'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
            {/* Left Column: Channel & Recipients Selector (5 cols) */}
            <div className="lg:col-span-5 space-y-4 border-b lg:border-b-0 lg:border-r border-[#e3e8f9] pb-4 lg:pb-0 lg:pr-5">
              {/* Channel Selector */}
              <div>
                <label className="block font-bold text-[#161c27] mb-2">
                  1. {isArabic ? 'اختر قناة الإرسال' : 'Select Communication Channel'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: 'whatsapp' as const,
                      label: 'WhatsApp',
                      labelAr: 'واتساب',
                      icon: MessageSquare,
                      color: 'text-emerald-600',
                      bg: 'bg-emerald-50 border-emerald-300',
                    },
                    {
                      id: 'email' as const,
                      label: 'Email',
                      labelAr: 'البريد',
                      icon: Mail,
                      color: 'text-blue-600',
                      bg: 'bg-blue-50 border-blue-300',
                    },
                    {
                      id: 'sms' as const,
                      label: 'SMS',
                      labelAr: 'رسالة نصية',
                      icon: Smartphone,
                      color: 'text-amber-600',
                      bg: 'bg-amber-50 border-amber-300',
                    },
                  ].map((ch) => {
                    const Icon = ch.icon;
                    const isActive = channel === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setChannel(ch.id)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          isActive
                            ? `${ch.bg} ring-2 ring-[#004a60]/20 font-bold shadow-2xs`
                            : 'border-[#e3e8f9] bg-white text-[#40484d] hover:bg-[#f9f9ff]'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${ch.color}`} />
                        <span className="text-[11px]">{isArabic ? ch.labelAr : ch.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recipients Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-[#161c27]">
                    2. {isArabic ? 'تحديد المستلمين' : 'Select Customer Profiles'}
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-[11px] font-bold text-[#004a60] hover:underline cursor-pointer"
                  >
                    {selectedIds.length === allRecipients.length
                      ? isArabic
                        ? 'إلغاء التحديد'
                        : 'Deselect All'
                      : isArabic
                      ? 'تحديد الكل (دفعة)'
                      : 'Select All (Batch)'}
                  </button>
                </div>

                <div className="text-[10px] text-[#70787d] mb-2 flex items-center justify-between">
                  <span>
                    {isArabic
                      ? `تم تحديد ${selectedIds.length} من أصل ${allRecipients.length} عميل`
                      : `${selectedIds.length} of ${allRecipients.length} profiles selected`}
                  </span>
                  {selectedIds.length > 1 && (
                    <span className="font-bold text-[#004a60] bg-[#e8eeff] px-1.5 py-0.2 rounded-md">
                      Batch Send
                    </span>
                  )}
                </div>

                {/* Filter input */}
                <input
                  type="text"
                  value={recipientSearch}
                  onChange={(e) => setRecipientSearch(e.target.value)}
                  placeholder={isArabic ? 'بحث بالاسم، البريد أو الهاتف...' : 'Filter recipients...'}
                  className="w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] py-1.5 px-3 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] focus:outline-hidden mb-2"
                />

                {/* Scrollable List */}
                <div className="max-h-56 overflow-y-auto space-y-1.5 border border-[#e3e8f9] rounded-xl p-2 bg-[#fcfdff]">
                  {filteredRecipients.map((rec) => {
                    const isChecked = selectedIds.includes(rec.id);
                    return (
                      <div
                        key={rec.id}
                        onClick={() => handleToggleRecipient(rec.id)}
                        className={`p-2 rounded-lg border flex items-center gap-2.5 cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-[#e8eeff]/60 border-[#004a60]/30'
                            : 'bg-white border-[#f1f3ff] hover:bg-[#f9f9ff]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-[#004a60] focus:ring-[#004a60] cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[#161c27] truncate">
                            {isArabic ? rec.nameAr || rec.name : rec.name}
                          </div>
                          <div className="text-[10px] text-[#70787d] flex items-center gap-2 truncate">
                            {channel === 'email' ? (
                              <span>{rec.email}</span>
                            ) : (
                              <span>{rec.phone}</span>
                            )}
                            {rec.company && <span>• {rec.company}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Template Picker */}
              <div>
                <label className="block font-bold text-[#161c27] mb-1.5">
                  3. {isArabic ? 'قوالب الرسائل الجاهزة' : 'Message Template Preset'}
                </label>
                <div className="space-y-1.5">
                  {TEMPLATES.map((tpl) => {
                    const isSelected = selectedTemplateId === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => handleSelectTemplate(tpl)}
                        className={`w-full text-left p-2 rounded-xl border text-[11px] transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#004a60] bg-[#e8eeff] font-bold text-[#004a60]'
                            : 'border-[#e3e8f9] bg-white text-[#40484d] hover:bg-[#f9f9ff]'
                        }`}
                      >
                        <span>{isArabic ? tpl.nameAr : tpl.name}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#004a60]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Customization & Live Preview (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Dynamic Tag Injectors */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-[#161c27]">
                    4. {isArabic ? 'تخصيص الرسالة والمتغيرات' : 'Compose & Dynamic Placeholders'}
                  </label>
                  <span className="text-[10px] text-[#70787d]">
                    {isArabic ? 'انقر لإدراج الحقل تلقائياً:' : 'Click to insert tag:'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { tag: 'name', label: '{{name}}', labelAr: 'الاسم' },
                    { tag: 'company', label: '{{company}}', labelAr: 'المنشأة' },
                    { tag: 'smart_pin', label: '{{smart_pin}}', labelAr: 'كود القفل' },
                    { tag: 'balance', label: '{{balance}}', labelAr: 'الرصيد' },
                    { tag: 'city', label: '{{city}}', labelAr: 'المدينة' },
                  ].map((t) => (
                    <button
                      key={t.tag}
                      type="button"
                      onClick={() => handleInsertTag(t.tag)}
                      className="px-2 py-0.5 rounded-lg bg-[#f1f3ff] text-[#004a60] hover:bg-[#004a60] hover:text-white transition-colors text-[10px] font-mono font-semibold cursor-pointer border border-[#e3e8f9]"
                    >
                      +{t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Subject Line (for email channel) */}
              {channel === 'email' && (
                <div>
                  <label className="block font-semibold text-[#161c27] mb-1">
                    {isArabic ? 'عنوان البريد الإلكتروني' : 'Email Subject'}
                  </label>
                  <input
                    type="text"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    placeholder="Enter email subject line..."
                    className="w-full rounded-xl border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
                  />
                </div>
              )}

              {/* Message Body Editor */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'نص الرسالة المخصص' : 'Message Content'}
                </label>
                <textarea
                  rows={5}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between text-[10px] text-[#70787d] mt-1 px-1">
                  <span>
                    {channel === 'sms'
                      ? `${messageBody.length} characters (1 SMS segment)`
                      : `${messageBody.length} characters`}
                  </span>
                  <span>Supports UTF-8 & Arabic Diacritics</span>
                </div>
              </div>

              {/* Add-ons & Compliance Options */}
              <div className="p-3 bg-[#f9f9ff] rounded-xl border border-[#e3e8f9] space-y-2">
                <div className="font-bold text-[#161c27] text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{isArabic ? 'الملحقات وتوثيق المعاملة' : 'Attachments & Digital Folio'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attachZatcaFolio}
                      onChange={(e) => setAttachZatcaFolio(e.target.checked)}
                      className="rounded text-[#004a60]"
                    />
                    <span>Attach ZATCA QR-code PDF</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attachShortAddress}
                      onChange={(e) => setAttachShortAddress(e.target.checked)}
                      className="rounded text-[#004a60]"
                    />
                    <span>Include National Address Map PIN</span>
                  </label>
                </div>
              </div>

              {/* Live Rendered Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-[#161c27] flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>
                      {isArabic
                        ? `معاينة حية للمستلم (${previewRecipient ? (isArabic ? previewRecipient.nameAr || previewRecipient.name : previewRecipient.name) : ''})`
                        : `Live Preview for (${previewRecipient ? previewRecipient.name : ''})`}
                    </span>
                  </label>
                </div>

                <div
                  className={`rounded-xl p-3.5 border text-xs ${
                    channel === 'whatsapp'
                      ? 'bg-[#e5ddd5]/40 border-emerald-200'
                      : channel === 'email'
                      ? 'bg-sky-50/50 border-sky-200'
                      : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  {channel === 'email' && (
                    <div className="pb-2 mb-2 border-b border-sky-200 font-semibold text-[#161c27]">
                      Subject: {renderPreviewText(subjectInput)}
                    </div>
                  )}

                  <div className="bg-white rounded-lg p-3 shadow-2xs border border-gray-100 whitespace-pre-wrap leading-relaxed text-[#161c27]">
                    {renderPreviewText(messageBody)}
                  </div>

                  {attachZatcaFolio && (
                    <div className="mt-2 text-[10px] text-emerald-800 font-semibold flex items-center gap-1 bg-white/70 p-1.5 rounded-lg border border-emerald-200">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      <span>ZATCA Phase 2 Official Folio PDF [Attached]</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        {!isCompleted && (
          <div className="p-4 border-t border-[#e3e8f9] bg-[#f9f9ff] flex items-center justify-between">
            <div className="text-[11px] text-[#70787d]">
              {selectedIds.length === 0 ? (
                <span className="text-rose-500 font-semibold">
                  {isArabic ? 'يرجى تحديد مستلم واحد على الأقل' : 'Please select at least one recipient'}
                </span>
              ) : (
                <span>
                  {isArabic ? 'سيتم الإرسال إلى' : 'Ready to dispatch to'}{' '}
                  <strong className="text-[#004a60]">{selectedIds.length}</strong>{' '}
                  {isArabic ? 'مستلم عبر' : 'profile(s) via'}{' '}
                  <strong className="uppercase text-[#004a60]">{channel}</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#e3e8f9] px-4 py-2 text-xs font-semibold text-[#70787d] hover:bg-[#f1f3ff] cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                disabled={selectedIds.length === 0 || isSending}
                onClick={handleExecuteSend}
                className={`flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold text-white shadow-xs transition-all cursor-pointer ${
                  selectedIds.length === 0 || isSending
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#004a60] hover:bg-[#074e64]'
                }`}
              >
                {isSending ? (
                  <>
                    <Clock className="h-3.5 w-3.5 animate-spin" />
                    <span>{isArabic ? `جارٍ الإرسال (${sendProgress}%)...` : `Sending (${sendProgress}%)...`}</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>
                      {isArabic
                        ? `إرسال الرسائل (${selectedIds.length})`
                        : `Dispatch to ${selectedIds.length} Customer(s)`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
