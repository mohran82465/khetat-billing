import React, { useState } from 'react';
import {
  X,
  FileCode2,
  Sparkles,
  Check,
  Smartphone,
  Mail,
  MessageSquare,
  ShieldCheck,
  Tag,
  Eye,
  Key,
} from 'lucide-react';
import { CommunicationChannel } from './MultichannelDispatchModal';
import { TemplateItem } from '../views/CustomerMessagingView';

interface WriteTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
  onSaveTemplate: (template: TemplateItem) => void;
}

export const WriteTemplateModal: React.FC<WriteTemplateModalProps> = ({
  isOpen,
  onClose,
  isArabic,
  onSaveTemplate,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [channel, setChannel] = useState<CommunicationChannel | 'all'>('all');
  const [category, setCategory] = useState('Hospitality Access');
  const [subject, setSubject] = useState('');
  const [subjectAr, setSubjectAr] = useState('');
  const [body, setBody] = useState(
    'Dear {{name}},\nWelcome to {{company}}. Your smart digital key PIN is {{smart_pin}}. Valid for seamless access upon arrival.'
  );
  const [bodyAr, setBodyAr] = useState(
    'مرحباً {{name}}،\nنرحب بكم في {{company}}. كود الدخول الذكي للفيلا/الجناح هو: {{smart_pin}}. الكود مفعل وجاهز للاستخدام.'
  );
  const [activeLanguageTab, setActiveLanguageTab] = useState<'ar' | 'en'>('ar');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const DYNAMIC_TAGS = [
    { tag: '{{name}}', labelEn: 'Guest Name', labelAr: 'اسم العميل/النزيل' },
    { tag: '{{company}}', labelEn: 'Hotel / Property', labelAr: 'الفندق / الوحدة' },
    { tag: '{{smart_pin}}', labelEn: 'Door Lock PIN', labelAr: 'كود القفل الذكي' },
    { tag: '{{balance}}', labelEn: 'Outstanding Balance', labelAr: 'الرصيد المستحق' },
    { tag: '{{invoice_id}}', labelEn: 'ZATCA Invoice #', labelAr: 'رقم الفاتورة الضريبية' },
    { tag: '{{date}}', labelEn: 'Current Date', labelAr: 'التاريخ الحالي' },
  ];

  const handleInsertTag = (tag: string) => {
    if (activeLanguageTab === 'ar') {
      setBodyAr((prev) => prev + ' ' + tag);
    } else {
      setBody((prev) => prev + ' ' + tag);
    }
  };

  // Sample data for live simulation
  const sampleCustomer = {
    name: 'Sheikh Mansour Al-Harbi',
    nameAr: 'الشيخ منصور الحربي',
    company: 'The Chedi Hegra AlUla',
    smart_pin: '4910#',
    balance: '14,250.00',
    invoice_id: 'INV-2026-8831',
    date: '2026-09-23',
  };

  const getResolvedPreview = (text: string) => {
    return text
      .replace(/{{name}}/g, activeLanguageTab === 'ar' ? sampleCustomer.nameAr : sampleCustomer.name)
      .replace(/{{company}}/g, sampleCustomer.company)
      .replace(/{{smart_pin}}/g, sampleCustomer.smart_pin)
      .replace(/{{balance}}/g, sampleCustomer.balance)
      .replace(/{{invoice_id}}/g, sampleCustomer.invoice_id)
      .replace(/{{date}}/g, sampleCustomer.date);
  };

  const handleSave = () => {
    if (!name.trim() && !nameAr.trim()) {
      setErrorMsg(isArabic ? 'يرجى كتابة اسم القالب' : 'Please provide a template title');
      return;
    }

    const resolvedTags = DYNAMIC_TAGS.map((t) => t.tag).filter(
      (tag) => body.includes(tag) || bodyAr.includes(tag)
    );

    const newTemplate: TemplateItem = {
      id: `tpl-custom-${Date.now()}`,
      name: name.trim() || nameAr.trim(),
      nameAr: nameAr.trim() || name.trim(),
      channel,
      category,
      categoryAr:
        category === 'Hospitality Access'
          ? 'الوصول الفندقي والأقفال'
          : category === 'ZATCA Invoicing'
          ? 'فواتير الزكاة والضريبة'
          : category === 'Payment Receipts'
          ? 'سندات القبض'
          : 'مراسلات مخصصة',
      subject: subject.trim() || undefined,
      subjectAr: subjectAr.trim() || undefined,
      body: body.trim(),
      bodyAr: bodyAr.trim(),
      tags: resolvedTags.length > 0 ? resolvedTags : ['{{name}}'],
    };

    onSaveTemplate(newTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#e3e8f9] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e3e8f9] bg-gradient-to-r from-[#f9f9ff] to-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
              <FileCode2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base lg:text-lg font-bold text-[#161c27]">
                {isArabic ? 'كتابة وتصميم قالب مراسلة جديد' : 'Write & Register Message Template'}
              </h2>
              <p className="text-xs text-[#70787d]">
                {isArabic
                  ? 'صمم قوالب معتمدة تدعم الحقول الديناميكية (الاسم، كود القفل، الرصيد، الفاتورة) للإرسال الفوري'
                  : 'Compose reusable multichannel templates with dynamic placeholders for WhatsApp, Email & SMS'}
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

        {/* Modal Body */}
        <div className="p-5 lg:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Form grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#161c27] mb-1.5">
                {isArabic ? 'اسم القالب (بالعربية)' : 'Template Title (Arabic)'}
              </label>
              <input
                type="text"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder={isArabic ? 'مثال: إشعار كود القفل الذكي وترحيب النزيل' : 'e.g., Smart Lock PIN & Welcome'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e8f9] text-xs focus:outline-none focus:ring-2 focus:ring-[#004a60]/20 focus:border-[#004a60]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#161c27] mb-1.5">
                {isArabic ? 'اسم القالب (بالإنجليزية)' : 'Template Title (English)'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., VIP Door Lock PIN & Check-in Details"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e8f9] text-xs focus:outline-none focus:ring-2 focus:ring-[#004a60]/20 focus:border-[#004a60]"
              />
            </div>
          </div>

          {/* Channel Compatibility & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#161c27] mb-1.5">
                {isArabic ? 'القنوات المدعومة' : 'Target Channels'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('all')}
                  className={`py-2 px-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                    channel === 'all'
                      ? 'bg-[#004a60] text-white border-[#004a60] shadow-xs'
                      : 'bg-white border-[#e3e8f9] text-[#40484d] hover:bg-[#f1f3ff]'
                  }`}
                >
                  {isArabic ? 'الكل' : 'All'}
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`py-2 px-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    channel === 'whatsapp'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white border-[#e3e8f9] text-[#40484d] hover:bg-[#f1f3ff]'
                  }`}
                >
                  <MessageSquare className="h-3 w-3" />
                  WA
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`py-2 px-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    channel === 'email'
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-white border-[#e3e8f9] text-[#40484d] hover:bg-[#f1f3ff]'
                  }`}
                >
                  <Mail className="h-3 w-3" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('sms')}
                  className={`py-2 px-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    channel === 'sms'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white border-[#e3e8f9] text-[#40484d] hover:bg-[#f1f3ff]'
                  }`}
                >
                  <Smartphone className="h-3 w-3" />
                  SMS
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#161c27] mb-1.5">
                {isArabic ? 'تصنيف القالب' : 'Template Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e8f9] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#004a60]/20 focus:border-[#004a60]"
              >
                <option value="Hospitality Access">
                  {isArabic ? 'الوصول الفندقي والأقفال الذكية' : 'Hospitality Access & Smart Locks'}
                </option>
                <option value="ZATCA Invoicing">
                  {isArabic ? 'فواتير الزكاة والضريبة ZATCA' : 'ZATCA Invoicing & Tax Folios'}
                </option>
                <option value="Payment Receipts">
                  {isArabic ? 'سندات القبض والمدفوعات' : 'Payment Receipts & SADAD'}
                </option>
                <option value="Reservations">
                  {isArabic ? 'الحجوزات وتأكيد الإقامة' : 'Reservations & Booking'}
                </option>
                <option value="Custom Communications">
                  {isArabic ? 'مراسلات مخصصة وحملات' : 'Custom Campaigns & Alerts'}
                </option>
              </select>
            </div>
          </div>

          {/* Email Subject (if applicable) */}
          {(channel === 'all' || channel === 'email') && (
            <div>
              <label className="block text-xs font-bold text-[#161c27] mb-1.5">
                {isArabic ? 'عنوان البريد الإلكتروني (Subject)' : 'Email Subject Line'}
              </label>
              <input
                type="text"
                value={activeLanguageTab === 'ar' ? subjectAr : subject}
                onChange={(e) => {
                  if (activeLanguageTab === 'ar') setSubjectAr(e.target.value);
                  else setSubject(e.target.value);
                }}
                placeholder={
                  activeLanguageTab === 'ar'
                    ? 'مثال: تأكيد الحجز وبيانات الدخول الذكي للفيلا'
                    : 'e.g., Booking Confirmation & Smart Digital Key PIN'
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e8f9] text-xs focus:outline-none focus:ring-2 focus:ring-[#004a60]/20 focus:border-[#004a60]"
              />
            </div>
          )}

          {/* Dynamic Placeholder Insertion Bar */}
          <div className="bg-[#f0f4ff]/80 rounded-xl p-3 border border-[#e3e8f9]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#004a60] flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {isArabic ? 'إدراج حقول متغيرة بنقرة واحدة:' : 'Insert Dynamic Placeholder Tag:'}
              </span>
              <span className="text-[10px] text-[#70787d]">
                {isArabic ? 'يتم استبدالها تلقائياً ببيانات النزيل' : 'Auto-substituted per recipient'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DYNAMIC_TAGS.map((t) => (
                <button
                  key={t.tag}
                  type="button"
                  onClick={() => handleInsertTag(t.tag)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#c4d4f0] text-[11px] font-mono font-semibold text-[#004a60] hover:bg-[#004a60] hover:text-white transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>{t.tag}</span>
                  <span className="text-[9px] opacity-75 font-sans">
                    ({isArabic ? t.labelAr : t.labelEn})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Language Tabs for Template Body */}
          <div className="flex items-center gap-2 border-b border-[#e3e8f9] pb-2">
            <button
              type="button"
              onClick={() => setActiveLanguageTab('ar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLanguageTab === 'ar'
                  ? 'bg-[#004a60] text-white shadow-xs'
                  : 'text-[#70787d] hover:bg-[#f1f3ff]'
              }`}
            >
              🇸🇦 {isArabic ? 'النص العربي' : 'Arabic Text'}
            </button>
            <button
              type="button"
              onClick={() => setActiveLanguageTab('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLanguageTab === 'en'
                  ? 'bg-[#004a60] text-white shadow-xs'
                  : 'text-[#70787d] hover:bg-[#f1f3ff]'
              }`}
            >
              🇬🇧 {isArabic ? 'النص الإنجليزي' : 'English Text'}
            </button>
          </div>

          {/* Textarea */}
          <div>
            <textarea
              rows={4}
              value={activeLanguageTab === 'ar' ? bodyAr : body}
              onChange={(e) => {
                if (activeLanguageTab === 'ar') setBodyAr(e.target.value);
                else setBody(e.target.value);
              }}
              dir={activeLanguageTab === 'ar' ? 'rtl' : 'ltr'}
              className="w-full p-3.5 rounded-xl border border-[#e3e8f9] text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#004a60]/20 focus:border-[#004a60] leading-relaxed"
              placeholder={
                activeLanguageTab === 'ar'
                  ? 'اكتب نص القالب هنا واستخدم الأزرار أعلاه لإدراج الحقول الذكية...'
                  : 'Write your message template here and use tags above to inject dynamic recipient values...'
              }
            />
          </div>

          {/* Real-time Dynamic Preview Card */}
          <div className="bg-[#f9f9ff] rounded-xl p-3.5 border border-[#e3e8f9] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#161c27]">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <Eye className="h-3.5 w-3.5" />
                {isArabic ? 'معاينة حية للقالب مع بيانات تجريبية:' : 'Live Render Preview (Sample Customer):'}
              </span>
              <span className="text-[10px] text-[#70787d]">
                {sampleCustomer.name} ({sampleCustomer.company})
              </span>
            </div>
            <div
              dir={activeLanguageTab === 'ar' ? 'rtl' : 'ltr'}
              className="bg-white rounded-lg p-3 border border-[#e3e8f9] text-xs text-[#161c27] whitespace-pre-wrap leading-relaxed font-sans"
            >
              {getResolvedPreview(activeLanguageTab === 'ar' ? bodyAr : body)}
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
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Check className="h-4 w-4 text-emerald-300" />
            <span>{isArabic ? 'حفظ وتسجيل القالب' : 'Save & Register Template'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
