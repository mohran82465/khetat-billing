import React, { useState, useMemo } from 'react';
import {
  Mail,
  MessageSquare,
  Smartphone,
  Send,
  Users,
  CheckCircle2,
  ShieldCheck,
  Key,
  FileText,
  Search,
  Filter,
  Sparkles,
  Clock,
  Copy,
  ChevronRight,
  ExternalLink,
  Check,
  RefreshCw,
  Bell,
  ArrowUpRight,
  Plus,
  PenSquare,
  FileCode2,
  FileEdit,
  Tag,
  X,
} from 'lucide-react';
import {
  MultichannelDispatchModal,
  RecipientProfile,
  CommunicationChannel,
} from '../components/MultichannelDispatchModal';
import { WriteTemplateModal } from '../components/WriteTemplateModal';
import { ComposeMessageModal } from '../components/ComposeMessageModal';

interface CustomerMessagingViewProps {
  isArabic: boolean;
  onNavigateToInvoice?: (invoiceId: string) => void;
}

interface OutboxLogItem {
  id: string;
  recipientName: string;
  recipientNameAr: string;
  phoneOrEmail: string;
  channel: CommunicationChannel;
  templateName: string;
  templateNameAr: string;
  timestamp: string;
  status: 'delivered' | 'read' | 'sent';
  referenceCode: string;
  previewSnippet: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  nameAr: string;
  channel: CommunicationChannel | 'all';
  category: string;
  categoryAr?: string;
  subject?: string;
  subjectAr?: string;
  body: string;
  bodyAr?: string;
  tags: string[];
}

export const CustomerMessagingView: React.FC<CustomerMessagingViewProps> = ({
  isArabic,
}) => {
  // Navigation tabs within Customer Messaging
  const [activeTab, setActiveTab] = useState<'customers' | 'composer' | 'templates' | 'outbox'>('customers');

  // Channel filter for outbox / composer
  const [selectedChannel, setSelectedChannel] = useState<CommunicationChannel>('whatsapp');

  // Modal states for Compose & Write Template
  const [isWriteTemplateModalOpen, setIsWriteTemplateModalOpen] = useState(false);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [composeInitialChannel, setComposeInitialChannel] = useState<CommunicationChannel>('email');
  const [composeInitialRecipientId, setComposeInitialRecipientId] = useState<string>('cp-1');
  const [composeInitialTemplateId, setComposeInitialTemplateId] = useState<string>('tpl-pin');

  // Saved Templates State
  const [templatesList, setTemplatesList] = useState<TemplateItem[]>([
    {
      id: 'tpl-pin',
      name: 'Smart Lock Key PIN & Welcome',
      nameAr: 'كود القفل الذكي وترحيب النزيل',
      channel: 'all',
      category: 'Hospitality Access',
      categoryAr: 'الوصول الفندقي والأقفال',
      subject: 'Your Smart Room Key PIN & Check-in Details',
      subjectAr: 'بيانات الدخول الذكي وتأكيد حجز الجناح',
      body: 'Dear {{name}},\nWelcome to {{company}}. Your smart digital key PIN is {{smart_pin}}. Valid for seamless access upon arrival. Your ZATCA compliant e-folio is linked.',
      bodyAr: 'مرحباً {{name}}،\nنرحب بكم في {{company}}. كود الدخول الذكي للفيلا/الجناح هو: {{smart_pin}}. الكود مفعل وجاهز للاستخدام. فاتورة الزكاة الضريبية مرفقة مع رمز QR.',
      tags: ['{{name}}', '{{company}}', '{{smart_pin}}'],
    },
    {
      id: 'tpl-zatca',
      name: 'ZATCA Phase 2 E-Invoice Folio',
      nameAr: 'إشعار الفاتورة الضريبية ZATCA',
      channel: 'all',
      category: 'ZATCA Invoicing',
      categoryAr: 'فواتير الزكاة والضريبة',
      subject: 'Tax Folio & Cryptographic Verification',
      subjectAr: 'الفاتورة الضريبية المعتمدة وختم التشفير',
      body: 'Dear {{name}},\nYour official tax invoice for {{company}} has been cleared with ZATCA Phase 2. Outstanding Balance: SAR {{balance}}.\nView cryptographically signed folio.',
      bodyAr: 'عزيزي {{name}}،\nتم اعتماد فاتورتكم الضريبية الخاصة بـ {{company}} لدى هيئة الزكاة والضريبة. الرصيد: SAR {{balance}}.\nالفاتورة مشفرة وموثقة برمز الاستجابة السريعة.',
      tags: ['{{name}}', '{{company}}', '{{balance}}'],
    },
    {
      id: 'tpl-receipt',
      name: 'Official Payment Receipt & SADAD Voucher',
      nameAr: 'سند قبض رسمي ورقم سداد المعتمد',
      channel: 'all',
      category: 'Payment Receipts',
      categoryAr: 'سندات القبض والمدفوعات',
      subject: 'Payment Received & Official Voucher Confirmation',
      subjectAr: 'تأكيد استلام الدفعة وسند القبض الرسمي',
      body: 'Dear {{name}},\nWe confirmed receipt of your payment for {{company}}. Receipt voucher has been generated with Mada POS settlement reference. Remaining balance: SAR {{balance}}.',
      bodyAr: 'عزيزي {{name}}،\nتم بنجاح تسجيل استلام دفعتكم لـ {{company}}. تم إصدار سند القبض الرسمي المعتمد. الرصيد المتبقي: SAR {{balance}}.',
      tags: ['{{name}}', '{{company}}', '{{balance}}'],
    },
    {
      id: 'tpl-booking',
      name: 'Luxury Villa Reservation Confirmation',
      nameAr: 'تأكيد حجز الفيلا الفندقية الفاخرة',
      channel: 'all',
      category: 'Reservations',
      categoryAr: 'الحجوزات والضيافة',
      subject: 'Booking Confirmation & Geolocation Access Guide',
      subjectAr: 'تأكيد حجز الجناح ودليل الوصول الجغرافي',
      body: 'Dear {{name}},\nYour luxury reservation at {{company}} is confirmed. Our VIP concierge is at your service. Check-in starts at 3:00 PM. Digital key PIN: {{smart_pin}}.',
      bodyAr: 'مرحباً {{name}}،\nيسرنا تأكيد حجزكم في {{company}}. فريق الضيافة بانتظاركم، ويبدأ تسجيل الدخول من 3:00 عصراً. كود المفتاح الذكي: {{smart_pin}}.',
      tags: ['{{name}}', '{{company}}', '{{smart_pin}}'],
    },
  ]);

  // Customer search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>(['cp-1', 'cp-4']);

  // Dispatch Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalChannel, setModalChannel] = useState<CommunicationChannel>('whatsapp');
  const [preselectedIds, setPreselectedIds] = useState<string[]>([]);

  // Notification Banner
  const [notification, setNotification] = useState<string | null>(null);

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Customer & Guest Directory
  const [recipients] = useState<RecipientProfile[]>([
    {
      id: 'cp-1',
      name: 'Sheikh Mansour Al-Harbi',
      nameAr: 'الشيخ منصور الحربي',
      company: 'Khetat Hospitality Hub HQ',
      companyAr: 'المقر الرئيسي لمجموعة خطط للضيافة',
      role: 'Executive Director',
      email: 'm.harbi@khetat.sa',
      phone: '+966 50 442 8899',
      outstandingBalance: 142500,
      smartPin: '4910#',
      city: 'Riyadh',
    },
    {
      id: 'cp-2',
      name: 'Eng. Tariq Mansoor',
      nameAr: 'م. طارق منصور',
      company: 'Western Operations Hub',
      companyAr: 'عمليات القطاع الغربي - جدة',
      role: 'Hospitality Solutions Lead',
      email: 'tariq@khetat.sa',
      phone: '+966 55 993 1122',
      outstandingBalance: 28400,
      smartPin: '3012#',
      city: 'Jeddah',
    },
    {
      id: 'cp-3',
      name: 'Layla Al-Otaibi, SOCPA',
      nameAr: 'أ. ليلى العتيبي (محاسب قانوني)',
      company: 'Saudi Hospitality Central Cluster',
      companyAr: 'المجمع الفندقي المركزي بالرياض',
      role: 'Financial Controller',
      email: 'layla@khetat.sa',
      phone: '+966 54 812 9011',
      outstandingBalance: 85200,
      smartPin: '8841#',
      city: 'Riyadh',
    },
    {
      id: 'cp-4',
      name: 'H.E. Sheikh Fahad Al-Saud',
      nameAr: 'معالي الشيخ فهد آل سعود',
      company: 'The Chedi Hegra AlUla (Villa 08)',
      companyAr: 'منتجع الشيدي الحجر بالعلا (فيلا 08)',
      role: 'Royal Delegation Guest',
      email: 'fahad.saud@alriyadh.sa',
      phone: '+966 50 119 4433',
      outstandingBalance: 14850,
      smartPin: '4910#',
      city: 'AlUla',
    },
    {
      id: 'cp-5',
      name: 'Dr. Sarah Al-Ghamdi',
      nameAr: 'د. سارة الغامدي',
      company: 'KAFD Sky Tower Executive Apartments',
      companyAr: 'أبراج مركز الملك عبدالله المالي (شقة 1402)',
      role: 'Diplomatic Guest',
      email: 'sarah.ghamdi@kafd.sa',
      phone: '+966 55 441 9900',
      outstandingBalance: 7800,
      smartPin: '1402#',
      city: 'Riyadh',
    },
    {
      id: 'cp-6',
      name: 'Sheikh Bandar Al-Husseini',
      nameAr: 'الشيخ بندر الحسيني',
      company: 'Dar Al-Taqwa Suites Madinah',
      companyAr: 'أجنحة دار التقوى الفندقية بالمدينة',
      role: 'Managing Partner',
      email: 'bandar@alhusseini.com.sa',
      phone: '+966 50 662 3311',
      outstandingBalance: 64800,
      smartPin: '5521#',
      city: 'Madinah',
    },
  ]);

  // Outbox Dispatched Log
  const [outboxLogs, setOutboxLogs] = useState<OutboxLogItem[]>([
    {
      id: 'log-1',
      recipientName: 'H.E. Sheikh Fahad Al-Saud',
      recipientNameAr: 'معالي الشيخ فهد آل سعود',
      phoneOrEmail: '+966 50 119 4433',
      channel: 'whatsapp',
      templateName: 'ZATCA Invoice & Smart PIN',
      templateNameAr: 'فاتورة الزكاة وكود القفل الذكي',
      timestamp: 'Today, 10:45 AM',
      status: 'read',
      referenceCode: 'WA-MSG-98124',
      previewSnippet: 'Welcome to Villa 08. Your smart lock PIN: 4910#. ZATCA Phase 2 Cleared Folio attached.',
    },
    {
      id: 'log-2',
      recipientName: 'Sheikh Mansour Al-Harbi',
      recipientNameAr: 'الشيخ منصور الحربي',
      phoneOrEmail: 'm.harbi@khetat.sa',
      channel: 'email',
      templateName: 'Official Tax Statement & Folio',
      templateNameAr: 'كشف حساب ضريبي وفاتورة معتمدة',
      timestamp: 'Today, 09:30 AM',
      status: 'delivered',
      referenceCode: 'EML-SADAD-2041',
      previewSnippet: 'Official Statement of Account for Khetat Hub. Total Outstanding: SAR 142,500.',
    },
    {
      id: 'log-3',
      recipientName: 'Dr. Sarah Al-Ghamdi',
      recipientNameAr: 'د. سارة الغامدي',
      phoneOrEmail: '+966 55 441 9900',
      channel: 'sms',
      templateName: 'Smart Lock Key PIN Alert',
      templateNameAr: 'إشعار كود فتح القفل الذكي',
      timestamp: 'Yesterday, 08:15 PM',
      status: 'delivered',
      referenceCode: 'SMS-STC-44091',
      previewSnippet: 'Khetat Hospitality: Apartment 1402 Smart PIN: 1402#. Valid for 48 hours.',
    },
    {
      id: 'log-4',
      recipientName: 'Sheikh Bandar Al-Husseini',
      recipientNameAr: 'الشيخ بندر الحسيني',
      phoneOrEmail: '+966 50 662 3311',
      channel: 'whatsapp',
      templateName: 'Booking Confirmation & Receipt',
      templateNameAr: 'تأكيد الحجز وسند القبض',
      timestamp: 'Yesterday, 04:20 PM',
      status: 'read',
      referenceCode: 'WA-MSG-97992',
      previewSnippet: 'Reservation confirmed at Dar Al-Taqwa Madinah. Receipt Voucher RCP-2026-9810 issued.',
    },
  ]);

  // Composer Selected Template State
  const [selectedTemplate, setSelectedTemplate] = useState<string>('pin_invoice');
  const [composerRecipientId, setComposerRecipientId] = useState<string>('cp-4');

  const selectedComposerRecipient = useMemo(() => {
    return recipients.find((r) => r.id === composerRecipientId) || recipients[0];
  }, [recipients, composerRecipientId]);

  // Filtered recipients
  const filteredRecipients = useMemo(() => {
    return recipients.filter((r) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.nameAr && r.nameAr.includes(searchQuery)) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.phone.includes(searchQuery) ||
        (r.company && r.company.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedFilterCategory === 'all' ||
        (selectedFilterCategory === 'guests' && (r.role?.includes('Guest') || r.smartPin)) ||
        (selectedFilterCategory === 'executives' && (r.role?.includes('Director') || r.role?.includes('Partner')));

      return matchesSearch && matchesCategory;
    });
  }, [recipients, searchQuery, selectedFilterCategory]);

  // Actions
  const handleToggleSelectRecipient = (id: string) => {
    setSelectedRecipientIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecipientIds.length === recipients.length) {
      setSelectedRecipientIds([]);
    } else {
      setSelectedRecipientIds(recipients.map((r) => r.id));
    }
  };

  const handleOpenDispatch = (channel: CommunicationChannel, targetIds?: string[]) => {
    setModalChannel(channel);
    setPreselectedIds(
      targetIds && targetIds.length > 0
        ? targetIds
        : selectedRecipientIds.length > 0
        ? selectedRecipientIds
        : recipients.map((r) => r.id)
    );
    setIsModalOpen(true);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDispatchSuccess = ({
    channel,
    count,
    templateName,
  }: {
    channel: CommunicationChannel;
    count: number;
    templateName: string;
  }) => {
    const successMsg = isArabic
      ? `تم بنجاح إرسال "${templateName}" إلى ${count} عميل/نزيل عبر ${
          channel === 'whatsapp' ? 'الواتساب الرسمي' : channel === 'email' ? 'البريد الإلكتروني' : 'الرسائل النصية SMS'
        }.`
      : `Successfully dispatched "${templateName}" to ${count} customer(s) via ${channel.toUpperCase()}.`;

    setNotification(successMsg);

    // Append to live outbox log
    const targetRecipient = recipients.find((r) => preselectedIds.includes(r.id)) || recipients[0];
    const newLog: OutboxLogItem = {
      id: `log-${Date.now()}`,
      recipientName: targetRecipient.name + (count > 1 ? ` (+${count - 1} others)` : ''),
      recipientNameAr: targetRecipient.nameAr ? targetRecipient.nameAr + (count > 1 ? ` (+${count - 1} آخرين)` : '') : targetRecipient.name,
      phoneOrEmail: channel === 'email' ? targetRecipient.email : targetRecipient.phone,
      channel,
      templateName,
      templateNameAr: templateName,
      timestamp: 'Just now',
      status: 'delivered',
      referenceCode: `${channel.slice(0, 2).toUpperCase()}-LIVE-${Math.floor(10000 + Math.random() * 90000)}`,
      previewSnippet: `Dispatched ${templateName} successfully via ${channel.toUpperCase()} gateway.`,
    };

    setOutboxLogs((prev) => [newLog, ...prev]);
  };

  const handleSaveNewTemplate = (newTemplate: TemplateItem) => {
    setTemplatesList((prev) => [newTemplate, ...prev]);
    const successMsg = isArabic
      ? `تم بنجاح حفظ وتسجيل القالب الجديد "${newTemplate.nameAr || newTemplate.name}".`
      : `Successfully registered new template "${newTemplate.name}".`;
    setNotification(successMsg);
  };

  const handleSendCustomMessage = ({
    channel,
    recipient,
    subject,
    body,
    templateName,
    attachments,
  }: {
    channel: CommunicationChannel;
    recipient: RecipientProfile;
    subject: string;
    body: string;
    templateName: string;
    attachments: string[];
  }) => {
    const successMsg = isArabic
      ? `تم بنجاح إرسال الرسالة إلى ${recipient.nameAr || recipient.name} عبر ${
          channel === 'whatsapp' ? 'الواتساب الرسمي' : channel === 'email' ? 'البريد الإلكتروني' : 'الرسائل النصية SMS'
        }.`
      : `Dispatched message to ${recipient.name} via ${channel.toUpperCase()} successfully.`;
    setNotification(successMsg);

    const newLog: OutboxLogItem = {
      id: `log-${Date.now()}`,
      recipientName: recipient.name,
      recipientNameAr: recipient.nameAr || recipient.name,
      phoneOrEmail: channel === 'email' ? recipient.email : recipient.phone,
      channel,
      templateName,
      templateNameAr: templateName,
      timestamp: 'Just now',
      status: 'delivered',
      referenceCode: `${channel.slice(0, 2).toUpperCase()}-LIVE-${Math.floor(10000 + Math.random() * 90000)}`,
      previewSnippet: subject ? `[${subject}] ${body.slice(0, 60)}...` : `${body.slice(0, 75)}...`,
    };

    setOutboxLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f9f9ff] overflow-y-auto">
      {/* Top Header */}
      <div className="bg-white border-b border-[#e3e8f9] p-5 lg:p-6 shadow-2xs shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#004a60] to-[#003140] text-white flex items-center justify-center shadow-xs">
              <Send className="h-6 w-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl lg:text-2xl font-bold text-[#161c27]">
                  {isArabic ? 'مركز مراسلات العملاء والنزلاء' : 'Customer Communications Hub'}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-200">
                  <ShieldCheck className="h-3 w-3" />
                  Email • SMS • WhatsApp
                </span>
              </div>
              <p className="text-xs text-[#70787d] mt-1">
                {isArabic
                  ? 'إرسال الفواتير الضريبية ZATCA، أكواد الأقفال الذكية، وسندات القبض للعملاء والنزلاء فوراً عبر البريد، الرسائل النصية القصيرة، أو الواتساب.'
                  : 'Dispatch ZATCA tax folios, smart door PINs, payment receipts, and booking notifications to customers via Email, SMS, or WhatsApp.'}
              </p>
            </div>
          </div>

          {/* Quick Multichannel Send & Compose Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Compose Email / Message Button */}
            <button
              onClick={() => {
                setComposeInitialChannel('email');
                setIsComposeModalOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white px-4 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer ring-1 ring-white/20"
            >
              <PenSquare className="h-4 w-4 text-emerald-300" />
              <span>{isArabic ? '+ إنشاء رسالة أو بريد' : '+ Compose Message / Email'}</span>
            </button>

            {/* 2. Write Template Button */}
            <button
              onClick={() => setIsWriteTemplateModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-4 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <FileCode2 className="h-4 w-4" />
              <span>{isArabic ? '+ كتابة قالب جديد' : '+ Write New Template'}</span>
            </button>

            {/* WhatsApp Quick Dispatch */}
            <button
              onClick={() => handleOpenDispatch('whatsapp')}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
            </button>

            {/* Email Quick Dispatch */}
            <button
              onClick={() => handleOpenDispatch('email')}
              className="flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Mail className="h-4 w-4" />
              <span>{isArabic ? 'بريد' : 'Email'}</span>
            </button>

            {/* SMS Quick Dispatch */}
            <button
              onClick={() => handleOpenDispatch('sms')}
              className="flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Smartphone className="h-4 w-4" />
              <span>{isArabic ? 'SMS' : 'SMS'}</span>
            </button>

            {/* Batch Campaign */}
            <button
              onClick={() => handleOpenDispatch('whatsapp')}
              className="flex items-center gap-1.5 rounded-xl bg-[#161c27] hover:bg-[#202837] text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer border border-[#e3e8f9]/20"
            >
              <Sparkles className="h-4 w-4 text-emerald-300" />
              <span>{isArabic ? 'إرسال جماعي' : 'Batch Campaign'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gateway Live Status Bar */}
      <div className="bg-[#f0f4ff]/70 border-b border-[#e3e8f9] px-5 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            {/* WhatsApp */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-[#161c27]">WhatsApp Cloud API:</span>
              <span className="text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-md text-[11px]">
                {isArabic ? 'متصل (هيئة السياحة • ZATCA)' : 'Connected (Tourism SLA 99.8%)'}
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span className="font-bold text-[#161c27]">Email Gateway:</span>
              <span className="text-sky-800 font-semibold bg-sky-100/70 px-2 py-0.5 rounded-md text-[11px]">
                SPF / DKIM TLS 1.3 Active
              </span>
            </div>

            {/* SMS */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="font-bold text-[#161c27]">Saudi SMS Gateway:</span>
              <span className="text-amber-800 font-semibold bg-amber-100/70 px-2 py-0.5 rounded-md text-[11px]">
                STC • Mobily • Zain (Sender: KHETAT-OS)
              </span>
            </div>
          </div>

          <div className="text-[11px] text-[#70787d] flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>{isArabic ? 'زمن التوصيل الفعلي: < 1.8 ثانية' : 'Real-time Latency: < 1.8s'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white border-b border-[#e3e8f9] px-5 sticky top-0 z-10 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 py-2.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-[#004a60] text-white shadow-xs'
                : 'text-[#40484d] hover:bg-[#f1f3ff] hover:text-[#004a60]'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>{isArabic ? 'دليل العملاء والإرسال السريع' : 'Customer Directory & Quick Send'}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                activeTab === 'customers' ? 'bg-white/20 text-white' : 'bg-[#e8eeff] text-[#004a60]'
              }`}
            >
              {recipients.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('composer')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'composer'
                ? 'bg-[#004a60] text-white shadow-xs'
                : 'text-[#40484d] hover:bg-[#f1f3ff] hover:text-[#004a60]'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>{isArabic ? 'منشئ الرسائل والمعاينة الحية' : 'Live Composer & Preview'}</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-[#004a60] text-white shadow-xs'
                : 'text-[#40484d] hover:bg-[#f1f3ff] hover:text-[#004a60]'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>{isArabic ? 'قوالب الرسائل وتصميمها' : 'Message Templates & Library'}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                activeTab === 'templates' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-800'
              }`}
            >
              {templatesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('outbox')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'outbox'
                ? 'bg-[#004a60] text-white shadow-xs'
                : 'text-[#40484d] hover:bg-[#f1f3ff] hover:text-[#004a60]'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>{isArabic ? 'سجل الرسائل المرسلة' : 'Dispatched Outbox Log'}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                activeTab === 'outbox' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {outboxLogs.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full flex-1 space-y-5">
        {/* Success / Notification Banner */}
        {notification && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span className="font-semibold">{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-emerald-700 hover:text-emerald-900 text-sm font-bold px-2 py-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* ========================================================
            TAB 1: CUSTOMER DIRECTORY & QUICK DISPATCH
           ======================================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            {/* Search & Filter Toolbar */}
            <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#70787d]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isArabic
                      ? 'بحث باسم العميل، الهاتف، البريد، أو الفندق...'
                      : 'Search customer name, phone, email, villa...'
                  }
                  className="w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] py-2 pl-9 pr-3 text-xs text-[#161c27] focus:border-[#004a60] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#161c27] flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5 text-[#70787d]" />
                  {isArabic ? 'التصنيف:' : 'Filter:'}
                </span>
                {[
                  { id: 'all', label: 'All Customers', labelAr: 'كافة العملاء' },
                  { id: 'guests', label: 'VIP Guests & Folios', labelAr: 'النزلاء وكبار الشخصيات' },
                  { id: 'executives', label: 'Corporate Accounts', labelAr: 'حسابات الشركات' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedFilterCategory(cat.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      selectedFilterCategory === cat.id
                        ? 'bg-[#004a60] text-white shadow-2xs'
                        : 'bg-[#f1f3ff] text-[#40484d] hover:bg-[#e8eeff]'
                    }`}
                  >
                    {isArabic ? cat.labelAr : cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Batch Selection Action Bar */}
            <div className="py-2.5 px-4 rounded-xl bg-white border border-[#e3e8f9] shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#161c27]">
                  <input
                    type="checkbox"
                    checked={
                      selectedRecipientIds.length === recipients.length &&
                      recipients.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded text-[#004a60] focus:ring-[#004a60] cursor-pointer"
                  />
                  <span>{isArabic ? 'تحديد الكل' : 'Select All'}</span>
                </label>
                <span className="text-[#70787d]">
                  {selectedRecipientIds.length > 0 ? (
                    <span className="text-[#004a60] font-bold">
                      {isArabic
                        ? `تم تحديد ${selectedRecipientIds.length} من أصل ${recipients.length}`
                        : `${selectedRecipientIds.length} of ${recipients.length} customers selected`}
                    </span>
                  ) : (
                    <span>{isArabic ? 'لم يتم تحديد أي عميل' : 'No customer selected'}</span>
                  )}
                </span>
              </div>

              {/* Action shortcuts for selected customers */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-[#70787d] mr-1">
                  {isArabic ? 'إرسال للمحددين:' : 'Send to selected:'}
                </span>
                <button
                  onClick={() => handleOpenDispatch('whatsapp')}
                  disabled={selectedRecipientIds.length === 0}
                  className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white px-2.5 py-1 text-xs font-bold transition-all cursor-pointer"
                >
                  <MessageSquare className="h-3 w-3" />
                  <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
                </button>
                <button
                  onClick={() => handleOpenDispatch('email')}
                  disabled={selectedRecipientIds.length === 0}
                  className="flex items-center gap-1 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white px-2.5 py-1 text-xs font-bold transition-all cursor-pointer"
                >
                  <Mail className="h-3 w-3" />
                  <span>{isArabic ? 'بريد' : 'Email'}</span>
                </button>
                <button
                  onClick={() => handleOpenDispatch('sms')}
                  disabled={selectedRecipientIds.length === 0}
                  className="flex items-center gap-1 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white px-2.5 py-1 text-xs font-bold transition-all cursor-pointer"
                >
                  <Smartphone className="h-3 w-3" />
                  <span>{isArabic ? 'SMS' : 'SMS'}</span>
                </button>
              </div>
            </div>

            {/* Customers Table with Quick Dispatch Actions */}
            <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#e3e8f9] text-[#70787d] text-[11px] uppercase font-bold bg-[#f9f9ff]">
                      <th className="py-3 px-3.5 w-8">
                        <span className="sr-only">Select</span>
                      </th>
                      <th className="py-3 px-3.5">{isArabic ? 'العميل / المنشأة' : 'Customer & Property'}</th>
                      <th className="py-3 px-3.5">{isArabic ? 'الصفة ونفاذ' : 'Role & Verification'}</th>
                      <th className="py-3 px-3.5">{isArabic ? 'بيانات التواصل' : 'Contact Channels'}</th>
                      <th className="py-3 px-3.5">{isArabic ? 'كود القفل والرصيد' : 'Key PIN & Balance'}</th>
                      <th className="py-3 px-3.5 text-center font-black text-[#004a60]">
                        {isArabic ? 'إرسال فوري للعميل (واتساب / بريد / SMS)' : 'Quick Dispatch to Customer'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e3e8f9]">
                    {filteredRecipients.map((cp) => {
                      const isSelected = selectedRecipientIds.includes(cp.id);
                      return (
                        <tr
                          key={cp.id}
                          className={`transition-colors hover:bg-[#f1f3ff]/60 ${
                            isSelected ? 'bg-[#e8eeff]/40' : ''
                          }`}
                        >
                          <td className="py-3 px-3.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectRecipient(cp.id)}
                              className="rounded text-[#004a60] focus:ring-[#004a60] cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-3.5">
                            <div className="font-bold text-[#161c27] text-sm">
                              {isArabic ? cp.nameAr || cp.name : cp.name}
                            </div>
                            <div className="text-[11px] text-[#70787d] mt-0.5">
                              {isArabic ? cp.companyAr || cp.company : cp.company} • {cp.city}
                            </div>
                          </td>
                          <td className="py-3 px-3.5 text-[#40484d]">
                            <div className="font-medium">{cp.role}</div>
                            <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                              <ShieldCheck className="h-3 w-3" />
                              <span>Nafath Verified</span>
                            </div>
                          </td>
                          <td className="py-3 px-3.5 text-[#40484d]">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-sky-600" />
                              <span>{cp.email}</span>
                            </div>
                            <div className="text-[11px] text-[#70787d] font-mono mt-0.5 flex items-center gap-1">
                              <Smartphone className="h-3 w-3 text-amber-600" />
                              <span>{cp.phone}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-[#004a60] bg-[#e8eeff] px-2 py-0.5 rounded text-[11px]">
                                PIN: {cp.smartPin || '4910#'}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#70787d] font-mono mt-1">
                              SAR {(cp.outstandingBalance || 0).toLocaleString()}
                            </div>
                          </td>
                          <td className="py-3 px-3.5">
                            <div className="flex items-center justify-center gap-2">
                              {/* 1. WhatsApp Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenDispatch('whatsapp', [cp.id])}
                                title={isArabic ? 'إرسال عبر الواتساب' : 'Send via WhatsApp'}
                                className="flex items-center gap-1 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 px-2.5 py-1.5 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                              >
                                <MessageSquare className="h-3.5 w-3.5 text-emerald-600 group-hover:text-white" />
                                <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
                              </button>

                              {/* 2. Email Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenDispatch('email', [cp.id])}
                                title={isArabic ? 'إرسال بريد إلكتروني' : 'Send via Email'}
                                className="flex items-center gap-1 rounded-xl bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-700 border border-sky-200 px-2.5 py-1.5 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                              >
                                <Mail className="h-3.5 w-3.5 text-sky-600 group-hover:text-white" />
                                <span>{isArabic ? 'بريد' : 'Email'}</span>
                              </button>

                              {/* 3. SMS Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenDispatch('sms', [cp.id])}
                                title={isArabic ? 'إرسال رسالة نصية SMS' : 'Send via SMS'}
                                className="flex items-center gap-1 rounded-xl bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-800 border border-amber-200 px-2.5 py-1.5 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                              >
                                <Smartphone className="h-3.5 w-3.5 text-amber-600 group-hover:text-white" />
                                <span>{isArabic ? 'SMS' : 'SMS'}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: INTERACTIVE COMPOSER & LIVE DEVICE PREVIEWS
           ======================================================== */}
        {activeTab === 'composer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Preset & Recipient Selection */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9]">
                  <h3 className="text-sm font-bold text-[#161c27] flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#004a60]" />
                    {isArabic ? 'تجهيز الرسالة والقالب' : 'Template & Dispatch Config'}
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Auto-Token Fill
                  </span>
                </div>

                {/* Channel Selector */}
                <div>
                  <label className="text-xs font-bold text-[#161c27] block mb-1.5">
                    {isArabic ? 'اختر قناة الإرسال للعميل:' : 'Target Dispatch Channel:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedChannel('whatsapp')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        selectedChannel === 'whatsapp'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-2xs'
                          : 'border-[#e3e8f9] bg-[#f9f9ff] text-[#40484d] hover:bg-[#f1f3ff]'
                      }`}
                    >
                      <MessageSquare className="h-5 w-5 text-emerald-600" />
                      <span>{isArabic ? 'واتساب WhatsApp' : 'WhatsApp'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedChannel('email')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        selectedChannel === 'email'
                          ? 'border-sky-600 bg-sky-50 text-sky-800 shadow-2xs'
                          : 'border-[#e3e8f9] bg-[#f9f9ff] text-[#40484d] hover:bg-[#f1f3ff]'
                      }`}
                    >
                      <Mail className="h-5 w-5 text-sky-600" />
                      <span>{isArabic ? 'بريد إلكتروني' : 'Email'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedChannel('sms')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        selectedChannel === 'sms'
                          ? 'border-amber-600 bg-amber-50 text-amber-800 shadow-2xs'
                          : 'border-[#e3e8f9] bg-[#f9f9ff] text-[#40484d] hover:bg-[#f1f3ff]'
                      }`}
                    >
                      <Smartphone className="h-5 w-5 text-amber-600" />
                      <span>{isArabic ? 'رسالة نصية SMS' : 'SMS'}</span>
                    </button>
                  </div>
                </div>

                {/* Recipient Picker */}
                <div>
                  <label className="text-xs font-bold text-[#161c27] block mb-1.5">
                    {isArabic ? 'معاينة الرسالة للعميل:' : 'Preview For Customer:'}
                  </label>
                  <select
                    value={composerRecipientId}
                    onChange={(e) => setComposerRecipientId(e.target.value)}
                    className="w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] px-3.5 py-2 text-xs font-semibold text-[#161c27] focus:border-[#004a60] focus:bg-white focus:outline-hidden cursor-pointer"
                  >
                    {recipients.map((r) => (
                      <option key={r.id} value={r.id}>
                        {isArabic ? r.nameAr || r.name : r.name} — ({r.company || r.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Template Selection */}
                <div>
                  <label className="text-xs font-bold text-[#161c27] block mb-1.5">
                    {isArabic ? 'نوع القالب المعتمد:' : 'Pre-approved Message Template:'}
                  </label>
                  <div className="space-y-2">
                    {[
                      {
                        id: 'pin_invoice',
                        title: 'ZATCA Tax Folio & Smart Lock PIN',
                        titleAr: 'فاتورة الزكاة الضريبية وكود القفل الذكي',
                        desc: 'Villa key PIN code, ZATCA Phase 2 QR-code cryptographic link, and WiFi credentials.',
                      },
                      {
                        id: 'payment_receipt',
                        title: 'Official Payment Receipt & SADAD Voucher',
                        titleAr: 'سند قبض رسمي ورقم سداد المعتمد',
                        desc: 'Official receipt voucher with Mada POS settlement reference and tax details.',
                      },
                      {
                        id: 'booking_confirm',
                        title: 'Luxury Villa Reservation Confirmation',
                        titleAr: 'تأكيد حجز الفيلا الفندقية',
                        desc: 'Check-in time, guest count, geolocation directions, and dedicated concierge contact.',
                      },
                    ].map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setSelectedTemplate(tpl.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                          selectedTemplate === tpl.id
                            ? 'border-[#004a60] bg-[#e8eeff]/50 ring-1 ring-[#004a60]'
                            : 'border-[#e3e8f9] bg-white hover:bg-[#f9f9ff]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#161c27]">
                            {isArabic ? tpl.titleAr : tpl.title}
                          </span>
                          {selectedTemplate === tpl.id && (
                            <span className="h-2 w-2 rounded-full bg-[#004a60]" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#70787d] mt-1">{tpl.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Dispatch Launch */}
                <button
                  type="button"
                  onClick={() => handleOpenDispatch(selectedChannel, [composerRecipientId])}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white py-2.5 text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>
                    {isArabic
                      ? `فتح نافذة الإرسال للعميل عبر ${
                          selectedChannel === 'whatsapp' ? 'الواتساب' : selectedChannel === 'email' ? 'البريد' : 'SMS'
                        }`
                      : `Open Full Dispatch Modal via ${selectedChannel.toUpperCase()}`}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: Live Channel Phone / Email Preview */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9] mb-4">
                  <span className="text-xs font-bold text-[#161c27] flex items-center gap-1.5">
                    <Smartphone className="h-4 w-4 text-[#004a60]" />
                    {isArabic ? 'معاينة حية لشاشة هاتف العميل' : 'Live Recipient Device Preview'}
                  </span>
                  <span className="text-[10px] font-mono bg-[#f1f3ff] text-[#40484d] px-2 py-0.5 rounded font-bold">
                    {selectedComposerRecipient.phone}
                  </span>
                </div>

                {/* Visual Preview Device Frame */}
                {selectedChannel === 'whatsapp' && (
                  <div className="rounded-2xl bg-[#efeae2] border border-[#d1d7db] p-4 text-xs font-sans shadow-inner">
                    {/* WhatsApp Top Chat Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/10">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                          KH
                        </div>
                        <div>
                          <div className="font-bold text-[#111] flex items-center gap-1">
                            <span>Khetat Hospitality Hub</span>
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 inline" />
                          </div>
                          <div className="text-[9px] text-[#54656f]">Official Business Account</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-[#54656f]">10:45 AM</span>
                    </div>

                    {/* WhatsApp Bubble */}
                    <div className="bg-white rounded-xl p-3.5 shadow-xs space-y-2.5 max-w-sm ml-auto border border-[#e2e8eb]">
                      <div className="text-xs text-[#111] leading-relaxed">
                        مرحباً <strong>{isArabic ? selectedComposerRecipient.nameAr || selectedComposerRecipient.name : selectedComposerRecipient.name}</strong>،
                        <br />
                        تم تأكيد جاهزية وحدتكم الفندقية في <strong>{selectedComposerRecipient.company}</strong>.
                      </div>

                      {/* PIN Card Attachment */}
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                        <div className="text-[10px] font-bold uppercase text-emerald-800 flex items-center justify-between">
                          <span>Smart Lock PIN</span>
                          <Key className="h-3 w-3 text-emerald-700" />
                        </div>
                        <div className="text-base font-black font-mono text-emerald-950 mt-1">
                          {selectedComposerRecipient.smartPin || '4910#'}
                        </div>
                        <div className="text-[10px] text-emerald-700 mt-0.5">
                          صالح لمدة 48 ساعة • دخول فوري ذكي
                        </div>
                      </div>

                      {/* ZATCA Folio Attachment Card */}
                      <div className="p-2.5 rounded-lg bg-[#f9f9ff] border border-[#e3e8f9] flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[11px] text-[#161c27]">
                            فاتورة ضريبية ZATCA Phase 2
                          </div>
                          <div className="text-[10px] text-[#70787d] font-mono">
                            FOLIO-2026-9812 • Cleared
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          PDF • QR
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-1 text-[9px] text-[#54656f]">
                        <span>10:45 AM</span>
                        <Check className="h-3 w-3 text-sky-500" />
                        <Check className="h-3 w-3 text-sky-500 -ml-2" />
                      </div>
                    </div>
                  </div>
                )}

                {selectedChannel === 'email' && (
                  <div className="rounded-2xl bg-white border border-[#e3e8f9] p-4 text-xs font-sans shadow-inner space-y-3">
                    <div className="space-y-1.5 pb-3 border-b border-[#e3e8f9] text-[#70787d] text-[11px]">
                      <div>
                        <strong className="text-[#161c27]">From:</strong> reservations@khetat.sa
                      </div>
                      <div>
                        <strong className="text-[#161c27]">To:</strong> {selectedComposerRecipient.email}
                      </div>
                      <div>
                        <strong className="text-[#161c27]">Subject:</strong> Your ZATCA Tax Invoice & Smart Key PIN — Khetat Hospitality
                      </div>
                    </div>

                    <div className="p-3 bg-[#f9f9ff] rounded-xl text-xs text-[#161c27] space-y-2">
                      <p>
                        Dear <strong>{selectedComposerRecipient.name}</strong>,
                      </p>
                      <p>
                        Thank you for staying with Khetat Hospitality OS. Your reservation at{' '}
                        <strong>{selectedComposerRecipient.company}</strong> has been confirmed.
                      </p>
                      <div className="p-3 bg-white border border-[#e3e8f9] rounded-lg">
                        <div className="font-mono font-bold text-sm text-[#004a60]">
                          Smart Lock PIN: {selectedComposerRecipient.smartPin || '4910#'}
                        </div>
                        <div className="text-[11px] text-[#70787d] mt-1">
                          ZATCA Phase 2 Cryptographic XML and PDF Invoice attached.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedChannel === 'sms' && (
                  <div className="rounded-2xl bg-[#f4f4f7] border border-[#e3e8f9] p-4 text-xs font-sans shadow-inner">
                    <div className="text-center text-[10px] text-[#70787d] pb-2 font-mono">
                      Sender: KHETAT-OS • Today 10:45 AM
                    </div>
                    <div className="bg-[#e9e9eb] text-black rounded-2xl rounded-bl-xs p-3.5 max-w-xs space-y-1 leading-relaxed">
                      <div>
                        Khetat Hospitality: Dear {selectedComposerRecipient.name}, your Smart Door PIN for {selectedComposerRecipient.company} is{' '}
                        <strong className="font-mono">{selectedComposerRecipient.smartPin || '4910#'}</strong>.
                      </div>
                      <div className="text-[10px] text-black/60 pt-1">
                        View ZATCA Folio: https://zatca.khetat.sa/inv/{selectedComposerRecipient.id}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: MESSAGE TEMPLATES & DESIGNER
           ======================================================== */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            {/* Header bar */}
            <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#161c27]">
                    {isArabic ? 'مكتبة وقوالب الرسائل المعتمدة' : 'Approved Message Templates Library'}
                  </h3>
                  <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200">
                    {templatesList.length} {isArabic ? 'قوالب جاهزة' : 'Templates'}
                  </span>
                </div>
                <p className="text-xs text-[#70787d] mt-0.5">
                  {isArabic
                    ? 'قوالب قياسية تدعم الحقول الديناميكية (الاسم، كود القفل، الرصيد، الفاتورة) للإرسال السريع عبر الواتساب والبريد وSMS.'
                    : 'Certified multichannel templates with dynamic smart placeholders for instant customer dispatch.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsWriteTemplateModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-4 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <FileCode2 className="h-4 w-4" />
                  <span>{isArabic ? '+ كتابة وتصميم قالب جديد' : '+ Write New Template'}</span>
                </button>

                <button
                  onClick={() => {
                    setComposeInitialChannel('email');
                    setIsComposeModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white px-4 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <PenSquare className="h-4 w-4 text-emerald-300" />
                  <span>{isArabic ? 'إنشاء رسالة' : 'Compose Message'}</span>
                </button>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templatesList.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs hover:border-[#004a60]/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top row: Category and Channels */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#f0f4ff] text-[#004a60] font-bold text-[11px] border border-[#d6e2ff]">
                        {isArabic ? tpl.categoryAr || tpl.category : tpl.category}
                      </span>

                      <div className="flex items-center gap-1">
                        {(tpl.channel === 'all' || tpl.channel === 'whatsapp') && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-200">
                            <MessageSquare className="h-2.5 w-2.5" /> WA
                          </span>
                        )}
                        {(tpl.channel === 'all' || tpl.channel === 'email') && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 border border-sky-200">
                            <Mail className="h-2.5 w-2.5" /> Email
                          </span>
                        )}
                        {(tpl.channel === 'all' || tpl.channel === 'sms') && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 border border-amber-200">
                            <Smartphone className="h-2.5 w-2.5" /> SMS
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Template Title */}
                    <div>
                      <h4 className="text-sm font-bold text-[#161c27]">
                        {isArabic ? tpl.nameAr : tpl.name}
                      </h4>
                      <p className="text-[11px] text-[#70787d]">
                        {isArabic ? tpl.name : tpl.nameAr}
                      </p>
                    </div>

                    {/* Subject line (if any) */}
                    {(tpl.subject || tpl.subjectAr) && (
                      <div className="text-[11px] bg-[#f9f9ff] px-3 py-1.5 rounded-lg border border-[#e3e8f9] text-[#40484d]">
                        <strong className="text-[#161c27]">Subject:</strong>{' '}
                        {isArabic ? tpl.subjectAr || tpl.subject : tpl.subject || tpl.subjectAr}
                      </div>
                    )}

                    {/* Body snippet */}
                    <div
                      dir={isArabic ? 'rtl' : 'ltr'}
                      className="text-xs text-[#2c3437] bg-[#f9f9ff] p-3 rounded-xl border border-[#e3e8f9] leading-relaxed whitespace-pre-wrap font-sans max-h-36 overflow-y-auto"
                    >
                      {isArabic ? tpl.bodyAr || tpl.body : tpl.body || tpl.bodyAr}
                    </div>

                    {/* Dynamic tags used */}
                    {tpl.tags && tpl.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 text-[10px] text-[#70787d]">
                        <span className="font-semibold">{isArabic ? 'الحقول المستخدمة:' : 'Tags:'}</span>
                        {tpl.tags.map((tg) => (
                          <span
                            key={tg}
                            className="bg-white border border-[#c4d4f0] text-[#004a60] px-1.5 py-0.5 rounded font-mono font-bold"
                          >
                            {tg}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-[#e3e8f9] flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopy(tpl.bodyAr || tpl.body, tpl.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#e3e8f9] hover:bg-[#f1f3ff] text-xs font-semibold text-[#40484d] transition-colors cursor-pointer"
                    >
                      {copiedId === tpl.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700">{isArabic ? 'تم النسخ' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>{isArabic ? 'نسخ النص' : 'Copy'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setComposeInitialTemplateId(tpl.id);
                        setComposeInitialChannel(tpl.channel === 'sms' ? 'sms' : tpl.channel === 'whatsapp' ? 'whatsapp' : 'email');
                        setIsComposeModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5 text-emerald-300" />
                      <span>{isArabic ? 'استخدام للإرسال' : 'Use to Dispatch'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: DISPATCHED OUTBOX LOG
           ======================================================== */}
        {activeTab === 'outbox' && (
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9]">
              <div>
                <h3 className="text-sm font-bold text-[#161c27]">
                  {isArabic ? 'سجل الرسائل المرسلة ومتابعة التسليم' : 'Dispatched Message Transmission Logs'}
                </h3>
                <p className="text-xs text-[#70787d] mt-0.5">
                  {isArabic
                    ? 'سجل حي للرسائل المرسلة عبر الواتساب والبريد وSMS مع أختام التسليم والقراءة ورموز التتبع.'
                    : 'Real-time telemetry and delivery status for customer WhatsApp, Email, and SMS transmissions.'}
                </p>
              </div>
              <button
                onClick={() => handleOpenDispatch('whatsapp')}
                className="flex items-center gap-1.5 rounded-xl bg-[#004a60] text-white px-3.5 py-2 text-xs font-bold shadow-xs hover:bg-[#074e64] cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isArabic ? 'إرسال رسالة جديدة' : 'New Dispatch'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#e3e8f9] text-[#70787d] text-[11px] uppercase font-bold bg-[#f9f9ff]">
                    <th className="py-3 px-3.5">{isArabic ? 'المرسل إليه' : 'Recipient'}</th>
                    <th className="py-3 px-3.5">{isArabic ? 'القناة' : 'Channel'}</th>
                    <th className="py-3 px-3.5">{isArabic ? 'القالب والملخص' : 'Template & Message Snippet'}</th>
                    <th className="py-3 px-3.5">{isArabic ? 'رمز التتبع' : 'Reference Code'}</th>
                    <th className="py-3 px-3.5">{isArabic ? 'الوقت والتسليم' : 'Delivery Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8f9]">
                  {outboxLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#f1f3ff]/50 transition-colors">
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-[#161c27]">
                          {isArabic ? log.recipientNameAr || log.recipientName : log.recipientName}
                        </div>
                        <div className="text-[11px] text-[#70787d] font-mono mt-0.5">{log.phoneOrEmail}</div>
                      </td>
                      <td className="py-3 px-3.5">
                        {log.channel === 'whatsapp' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 border border-emerald-200">
                            <MessageSquare className="h-3 w-3 text-emerald-700" />
                            WhatsApp
                          </span>
                        )}
                        {log.channel === 'email' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold px-2.5 py-0.5 border border-sky-200">
                            <Mail className="h-3 w-3 text-sky-700" />
                            Email
                          </span>
                        )}
                        {log.channel === 'sms' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 border border-amber-200">
                            <Smartphone className="h-3 w-3 text-amber-700" />
                            SMS
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-[#161c27]">
                          {isArabic ? log.templateNameAr || log.templateName : log.templateName}
                        </div>
                        <div className="text-[11px] text-[#70787d] line-clamp-1 mt-0.5">
                          {log.previewSnippet}
                        </div>
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="font-mono text-[11px] font-semibold text-[#004a60] bg-[#e8eeff] px-2 py-0.5 rounded">
                          {log.referenceCode}
                        </span>
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="font-bold text-emerald-700 capitalize">{log.status}</span>
                        </div>
                        <div className="text-[10px] text-[#70787d] mt-0.5">{log.timestamp}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Multichannel Dispatch Modal for Email, SMS, WhatsApp */}
      <MultichannelDispatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isArabic={isArabic}
        initialChannel={modalChannel}
        allRecipients={recipients}
        initialSelectedRecipientIds={preselectedIds}
        onDispatchSuccess={handleDispatchSuccess}
      />

      {/* Write Template Modal */}
      <WriteTemplateModal
        isOpen={isWriteTemplateModalOpen}
        onClose={() => setIsWriteTemplateModalOpen(false)}
        isArabic={isArabic}
        onSaveTemplate={handleSaveNewTemplate}
      />

      {/* Compose Custom Message Modal */}
      <ComposeMessageModal
        isOpen={isComposeModalOpen}
        onClose={() => setIsComposeModalOpen(false)}
        isArabic={isArabic}
        allRecipients={recipients}
        initialRecipientId={composeInitialRecipientId}
        initialChannel={composeInitialChannel}
        templates={templatesList}
        initialTemplateId={composeInitialTemplateId}
        onSendMessage={handleSendCustomMessage}
      />
    </div>
  );
};
