import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Mail,
  MessageSquare,
  Smartphone,
  Paperclip,
  CheckCircle2,
  Sparkles,
  Key,
  ShieldCheck,
  Tag,
  Eye,
  Check,
} from 'lucide-react';
import { CommunicationChannel, RecipientProfile } from './MultichannelDispatchModal';
import { TemplateItem } from '../views/CustomerMessagingView';

interface ComposeMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
  allRecipients: RecipientProfile[];
  initialRecipientId?: string;
  initialChannel?: CommunicationChannel;
  templates: TemplateItem[];
  initialTemplateId?: string;
  onSendMessage: (info: {
    channel: CommunicationChannel;
    recipient: RecipientProfile;
    subject: string;
    body: string;
    templateName: string;
    attachments: string[];
  }) => void;
}

export const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({
  isOpen,
  onClose,
  isArabic,
  allRecipients,
  initialRecipientId,
  initialChannel = 'email',
  templates,
  initialTemplateId,
  onSendMessage,
}) => {
  if (!isOpen) return null;

  const [channel, setChannel] = useState<CommunicationChannel>(initialChannel);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(
    initialRecipientId || (allRecipients[0] ? allRecipients[0].id : '')
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialTemplateId || 'custom'
  );

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachZatca, setAttachZatca] = useState(true);
  const [attachPinCard, setAttachPinCard] = useState(true);
  const [attachSadadReceipt, setAttachSadadReceipt] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // When selected template changes, pre-fill
  useEffect(() => {
    if (selectedTemplateId === 'custom') {
      if (!body) {
        setSubject(
          isArabic
            ? 'إشعار هام من إدارة العمليات — مجموعة خطط للضيافة'
            : 'Important Update from Operations — Khetat Hospitality'
        );
        setBody(
          isArabic
            ? 'مرحباً {{name}}،\nنود إفادتكم بخصوص إقامتكم في {{company}}.\nكود القفل الذكي الخاص بكم هو: {{smart_pin}}.\nمع خالص التحية والتقدير.'
            : 'Dear {{name}},\nWe would like to share an update regarding your booking at {{company}}.\nYour smart door access PIN is: {{smart_pin}}.\nWarm regards,\nOperations Team'
        );
      }
      return;
    }

    const tpl = templates.find((t) => t.id === selectedTemplateId);
    if (tpl) {
      setSubject(
        isArabic ? tpl.subjectAr || tpl.subject || '' : tpl.subject || tpl.subjectAr || ''
      );
      setBody(isArabic ? tpl.bodyAr || tpl.body : tpl.body || tpl.bodyAr || '');
    }
  }, [selectedTemplateId, isArabic, templates]);

  const selectedRecipient =
    allRecipients.find((r) => r.id === selectedRecipientId) || allRecipients[0];

  // Dynamic tags
  const DYNAMIC_TAGS = [
    { tag: '{{name}}', labelEn: 'Guest Name', labelAr: 'اسم العميل' },
    { tag: '{{company}}', labelEn: 'Hotel', labelAr: 'الفندق/الوحدة' },
    { tag: '{{smart_pin}}', labelEn: 'Door PIN', labelAr: 'كود القفل' },
    { tag: '{{balance}}', labelEn: 'Balance', labelAr: 'الرصيد' },
    { tag: '{{invoice_id}}', labelEn: 'Invoice #', labelAr: 'الفاتورة' },
  ];

  const handleInsertTag = (tag: string) => {
    setBody((prev) => prev + ' ' + tag);
  };

  // Resolved dynamic preview text
  const getResolvedPreview = (rawText: string) => {
    if (!selectedRecipient) return rawText;
    return rawText
      .replace(
        /{{name}}/g,
        isArabic ? selectedRecipient.nameAr || selectedRecipient.name : selectedRecipient.name
      )
      .replace(
        /{{company}}/g,
        isArabic
          ? selectedRecipient.companyAr || selectedRecipient.company || 'Khetat Hospitality'
          : selectedRecipient.company || 'Khetat Hospitality'
      )
      .replace(/{{smart_pin}}/g, selectedRecipient.smartPin || '4910#')
      .replace(
        /{{balance}}/g,
        selectedRecipient.outstandingBalance
          ? selectedRecipient.outstandingBalance.toLocaleString()
          : '0.00'
      )
      .replace(/{{invoice_id}}/g, 'INV-2026-9812');
  };

  const handleSend = () => {
    if (!selectedRecipient) return;

    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);

      const attachments: string[] = [];
      if (attachZatca) attachments.push('ZATCA-E-Invoice-QR.pdf');
      if (attachPinCard) attachments.push('Smart-Door-Access-Key.png');
      if (attachSadadReceipt) attachments.push('SADAD-Official-Receipt.pdf');

      const templateName =
        selectedTemplateId === 'custom'
          ? isArabic
            ? 'رسالة مخصصة مباشرة'
            : 'Custom Direct Message'
          : templates.find((t) => t.id === selectedTemplateId)?.name || 'Custom Message';

      onSendMessage({
        channel,
        recipient: selectedRecipient,
        subject,
        body: getResolvedPreview(body),
        templateName,
        attachments,
      });

      setTimeout(() => {
        onClose();
      }, 1000);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#e3e8f9] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e3e8f9] bg-gradient-to-r from-[#f9f9ff] to-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#004a60] text-white flex items-center justify-center shadow-xs">
              <Send className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base lg:text-lg font-bold text-[#161c27]">
                {isArabic ? 'إنشاء وإرسال رسالة مباشرة للعميل' : 'Compose & Dispatch Customer Message'}
              </h2>
              <p className="text-xs text-[#70787d]">
                {isArabic
                  ? 'اختر القناة والعميل، واستخدم القوالب أو اكتب نصاً حراً مع إرفاق المستندات المعتمدة'
                  : 'Select channel & customer, customize templates or write freely with certified ZATCA attachments'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#70787d] hover:bg-[#f1f3ff] hover:text-[#161c27] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 lg:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {sendSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-bold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>
                {isArabic
                  ? `تم إرسال الرسالة بنجاح إلى ${selectedRecipient?.name} عبر ${channel.toUpperCase()}!`
                  : `Dispatched successfully to ${selectedRecipient?.name} via ${channel.toUpperCase()}!`}
              </span>
            </div>
          )}

          {/* Step 1: Choose Channel & Recipient */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Channel selection */}
            <div>
              <label className="block text-xs font-bold text-[#161c27] mb-1.5">
                {isArabic ? 'قناة الإرسال' : 'Delivery Channel'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`py-2 px-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    channel === 'email'
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-white border-[#e3e8f9] text-[#40484d] hover:bg-[#f1f3ff]'
                  }`}
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`py-2 px-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    channel === 'whatsapp'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white border-[#e3e8f9] text-[#40484d] hover:bg-[#f1f3ff]'
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('sms')}
                  className={`py-2 px-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    channel === 'sms'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white border-[#e3e8f9] text-[#40484d] hover:bg-[#f1f3ff]'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>SMS</span>
                </button>
              </div>
            </div>

            {/* Recipient Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#161c27] mb-1.5">
                {isArabic ? 'العميل / النزيل المستلم' : 'Target Recipient'}
              </label>
              <select
                value={selectedRecipientId}
                onChange={(e) => setSelectedRecipientId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e8f9] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#004a60]/20 focus:border-[#004a60]"
              >
                {allRecipients.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} {r.nameAr ? `(${r.nameAr})` : ''} — {r.company || ''} [
                    {channel === 'email' ? r.email : r.phone}]
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Template Choice */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#161c27]">
                {isArabic ? 'بدء من قالب مسجل (اختياري)' : 'Start from Registered Template'}
              </label>
              <span className="text-[10px] text-[#70787d]">
                {isArabic ? 'يمكنك التعديل على النص بحرية بعد اختياره' : 'Freely edit the text after selection'}
              </span>
            </div>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e8f9] text-xs bg-[#f9f9ff] focus:outline-none focus:ring-2 focus:ring-[#004a60]/20 focus:border-[#004a60]"
            >
              <option value="custom">
                {isArabic ? '✏️ كتابة نص مخصص من الصفر' : '✏️ Write Custom from Scratch'}
              </option>
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  📄 {isArabic ? tpl.nameAr || tpl.name : tpl.name} ({tpl.category})
                </option>
              ))}
            </select>
          </div>

          {/* Email Subject line */}
          {channel === 'email' && (
            <div>
              <label className="block text-xs font-bold text-[#161c27] mb-1.5">
                {isArabic ? 'عنوان البريد (Subject)' : 'Email Subject Line'}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e8f9] text-xs focus:outline-none focus:ring-2 focus:ring-[#004a60]/20 focus:border-[#004a60]"
                placeholder={isArabic ? 'موضوع الرسالة...' : 'Message Subject...'}
              />
            </div>
          )}

          {/* Tag Quick Inserter */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#f0f4ff]/80 p-2.5 rounded-xl border border-[#e3e8f9]">
            <span className="text-[10px] font-bold text-[#004a60] flex items-center gap-1 shrink-0">
              <Tag className="h-3 w-3" />
              {isArabic ? 'حقول ديناميكية:' : 'Tags:'}
            </span>
            {DYNAMIC_TAGS.map((t) => (
              <button
                key={t.tag}
                type="button"
                onClick={() => handleInsertTag(t.tag)}
                className="px-2 py-0.5 rounded-md bg-white border border-[#c4d4f0] text-[10px] font-mono font-bold text-[#004a60] hover:bg-[#004a60] hover:text-white transition-all cursor-pointer shadow-2xs"
              >
                {t.tag}
              </button>
            ))}
          </div>

          {/* Message Body Textarea */}
          <div>
            <label className="block text-xs font-bold text-[#161c27] mb-1.5">
              {isArabic ? 'نص الرسالة' : 'Message Body'}
            </label>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#e3e8f9] text-xs focus:outline-none focus:ring-2 focus:ring-[#004a60]/20 focus:border-[#004a60] leading-relaxed font-sans"
              placeholder={isArabic ? 'اكتب نص رسالتك هنا...' : 'Type your message text here...'}
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-xs font-bold text-[#161c27] mb-1.5 flex items-center gap-1">
              <Paperclip className="h-3.5 w-3.5 text-[#004a60]" />
              <span>{isArabic ? 'مرفقات وتراخيص ZATCA الذكية' : 'Certified Attachments & ZATCA Folios'}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#e3e8f9] bg-white cursor-pointer hover:bg-[#f9f9ff]">
                <input
                  type="checkbox"
                  checked={attachZatca}
                  onChange={(e) => setAttachZatca(e.target.checked)}
                  className="rounded text-[#004a60] focus:ring-0"
                />
                <span className="text-[11px] font-semibold text-[#161c27]">
                  {isArabic ? 'فاتورة ZATCA مع QR' : 'ZATCA Tax Folio (PDF)'}
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#e3e8f9] bg-white cursor-pointer hover:bg-[#f9f9ff]">
                <input
                  type="checkbox"
                  checked={attachPinCard}
                  onChange={(e) => setAttachPinCard(e.target.checked)}
                  className="rounded text-[#004a60] focus:ring-0"
                />
                <span className="text-[11px] font-semibold text-[#161c27]">
                  {isArabic ? 'بطاقة كود القفل الذكي' : 'Smart Door Key PIN'}
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#e3e8f9] bg-white cursor-pointer hover:bg-[#f9f9ff]">
                <input
                  type="checkbox"
                  checked={attachSadadReceipt}
                  onChange={(e) => setAttachSadadReceipt(e.target.checked)}
                  className="rounded text-[#004a60] focus:ring-0"
                />
                <span className="text-[11px] font-semibold text-[#161c27]">
                  {isArabic ? 'سند قبض سداد/مدى' : 'SADAD Voucher'}
                </span>
              </label>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="bg-[#f9f9ff] p-3.5 rounded-xl border border-[#e3e8f9] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#161c27]">
              <span className="flex items-center gap-1.5 text-[#004a60]">
                <Eye className="h-3.5 w-3.5" />
                {isArabic ? 'المعاينة الحية كما ستصل للعميل:' : 'Live Render Preview for Customer:'}
              </span>
              <span className="text-[10px] text-[#70787d] font-mono">
                {channel === 'email' ? selectedRecipient?.email : selectedRecipient?.phone}
              </span>
            </div>

            <div className="bg-white rounded-lg p-3 border border-[#e3e8f9] text-xs text-[#161c27] whitespace-pre-wrap leading-relaxed shadow-2xs">
              {channel === 'email' && (
                <div className="text-[11px] text-[#70787d] border-b border-[#e3e8f9] pb-1.5 mb-2">
                  <strong className="text-[#161c27]">Subject:</strong> {subject}
                </div>
              )}
              {getResolvedPreview(body)}

              {/* Attachments preview badge */}
              {(attachZatca || attachPinCard || attachSadadReceipt) && (
                <div className="mt-3 pt-2 border-t border-[#f0f0f4] flex flex-wrap gap-1.5">
                  {attachZatca && (
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                      <ShieldCheck className="h-3 w-3" /> ZATCA-Invoice.pdf
                    </span>
                  )}
                  {attachPinCard && (
                    <span className="inline-flex items-center gap-1 rounded bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5">
                      <Key className="h-3 w-3" /> PIN: {selectedRecipient?.smartPin || '4910#'}
                    </span>
                  )}
                  {attachSadadReceipt && (
                    <span className="inline-flex items-center gap-1 rounded bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5">
                      SADAD-Receipt.pdf
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 lg:p-5 border-t border-[#e3e8f9] bg-[#f9f9ff]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#70787d] hover:bg-[#e8eeff] hover:text-[#161c27] transition-all cursor-pointer"
          >
            {isArabic ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            type="button"
            disabled={isSending || sendSuccess}
            onClick={handleSend}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isSending ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>{isArabic ? 'جاري الإرسال عبر البوابة...' : 'Dispatching via Gateway...'}</span>
              </>
            ) : sendSuccess ? (
              <>
                <Check className="h-4 w-4 text-emerald-300" />
                <span>{isArabic ? 'تم الإرسال بنجاح!' : 'Sent Successfully!'}</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4 text-emerald-300" />
                <span>
                  {isArabic
                    ? `إرسال فوراً إلى ${selectedRecipient?.name?.split(' ')[0] || 'العميل'}`
                    : `Send Now to ${selectedRecipient?.name?.split(' ')[0] || 'Customer'}`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
