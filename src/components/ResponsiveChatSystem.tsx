import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  User,
  Plus,
  Search,
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Check,
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  ArrowRight,
  Shield,
  ShieldCheck,
  Key,
  FileText,
  Clock,
  Sparkles,
  Info,
  Filter,
  UserPlus,
  Bell,
  Trash2,
  X,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderNameAr?: string;
  senderAvatar: string;
  senderRole?: string;
  isMe: boolean;
  text: string;
  textAr?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachment?: {
    type: 'image' | 'file' | 'pin' | 'invoice';
    name: string;
    url?: string;
    size?: string;
  };
}

export interface ChatThread {
  id: string;
  type: 'direct' | 'group' | 'guest';
  name: string;
  nameAr: string;
  avatar: string;
  badge?: string;
  property?: string;
  propertyAr?: string;
  membersCount?: number;
  members?: { id: string; name: string; nameAr: string; role: string; avatar: string }[];
  lastMessage: string;
  lastMessageAr?: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
  messages: ChatMessage[];
}

interface ResponsiveChatSystemProps {
  isArabic: boolean;
  initialTab?: 'all' | 'direct' | 'group' | 'guest';
}

export const ResponsiveChatSystem: React.FC<ResponsiveChatSystemProps> = ({
  isArabic,
  initialTab = 'all',
}) => {
  const [filterType, setFilterType] = useState<'all' | 'direct' | 'group' | 'guest'>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeThreadId, setActiveThreadId] = useState<string>('group-1');
  const [mobileShowThread, setMobileShowThread] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [showGroupInfo, setShowGroupInfo] = useState<boolean>(false);

  // Modals
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState<boolean>(false);
  const [isNewDirectModalOpen, setIsNewDirectModalOpen] = useState<boolean>(false);

  // New group form
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newGroupNameAr, setNewGroupNameAr] = useState<string>('');
  const [newGroupProperty, setNewGroupProperty] = useState<string>('The Chedi Hegra AlUla');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([
    'usr-1',
    'usr-2',
    'usr-3',
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Available staff members to add to groups or chat with
  const availableTeamMembers = [
    {
      id: 'usr-1',
      name: 'Eng. Tariq Mansoor',
      nameAr: 'م. طارق منصور',
      role: 'General Manager',
      property: 'All Properties',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'usr-2',
      name: 'Layla Al-Otaibi, SOCPA',
      nameAr: 'أ. ليلى العتيبي',
      role: 'Financial Controller',
      property: 'Central Hub',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'usr-3',
      name: 'Abdulrahman Al-Ghamdi',
      nameAr: 'عبدالرحمن الغامدي',
      role: 'Front Desk Supervisor',
      property: 'The Chedi Hegra AlUla',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'usr-4',
      name: 'Khadija Al-Madani',
      nameAr: 'خديجة المدني',
      role: 'Reservations Lead',
      property: 'Dar Al-Taqwa Madinah',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'usr-5',
      name: 'Sultan Al-Dosari',
      nameAr: 'سلطان الدوسري',
      role: 'Operations & Maintenance',
      property: 'KAFD Executive Riyadh',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    },
  ];

  // Initial threads data
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: 'group-1',
      type: 'group',
      name: 'The Chedi AlUla - Operations & VIP Escort',
      nameAr: 'منتجع الشيدي العلا - العمليات واستقبال كبار الشخصيات',
      avatar: '🏨',
      badge: 'Group • 12 Staff',
      property: 'The Chedi Hegra AlUla',
      propertyAr: 'منتجع الشيدي الحجر - العلا',
      membersCount: 12,
      members: availableTeamMembers,
      lastMessage: 'Villa 08 smart lock PIN 4910# verified for royal delegation arrival.',
      lastMessageAr: 'تم تفعيل كود القفل الذكي 4910# للفيلا 08 وجاهزة لاستقبال الوفد.',
      lastMessageTime: '10:42 AM',
      unreadCount: 3,
      messages: [
        {
          id: 'm-1',
          senderId: 'usr-1',
          senderName: 'Eng. Tariq Mansoor',
          senderNameAr: 'م. طارق منصور',
          senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          senderRole: 'General Manager',
          isMe: false,
          text: 'Team, royal delegation arriving at 12:30 PM via AlUla International Airport. Ensure Villa 08 and Villa 09 are fully inspected.',
          textAr: 'فريق العمل، وفد رسمي سيصل الساعة 12:30 ظهراً عبر مطار العلا الدولي. نرجو التأكد من جاهزية الفلل 08 و09.',
          timestamp: '10:15 AM',
          status: 'read',
        },
        {
          id: 'm-2',
          senderId: 'usr-5',
          senderName: 'Sultan Al-Dosari',
          senderNameAr: 'سلطان الدوسري',
          senderAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
          senderRole: 'Housekeeping Lead',
          isMe: false,
          text: 'Housekeeping completed. Amenities, fresh dates, and Arabic coffee service prepared. Smart climate set to 21°C.',
          textAr: 'تم الانتهاء من تجهيز الغرف، ووضع الضيافة السعودية والتمور الفاخرة. تم ضبط التكييف الذكي على 21 درجة.',
          timestamp: '10:30 AM',
          status: 'read',
        },
        {
          id: 'm-3',
          senderId: 'usr-3',
          senderName: 'Abdulrahman Al-Ghamdi',
          senderNameAr: 'عبدالرحمن الغامدي',
          senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          senderRole: 'Front Desk',
          isMe: false,
          text: 'Villa 08 smart lock PIN generated: 4910#. Dispatched to guest concierge WhatsApp with ZATCA Phase 2 cleared folio.',
          textAr: 'تم توليد رقم القفل الذكي للفيلا 08: #4910 وإرساله عبر واتساب الكونسيرج مع فاتورة الزكاة المعتمدة.',
          timestamp: '10:42 AM',
          status: 'read',
          attachment: {
            type: 'pin',
            name: 'Smart Lock PIN: 4910#',
            size: 'Villa 08 • Valid 48 hrs',
          },
        },
      ],
    },
    {
      id: 'group-2',
      type: 'group',
      name: 'Front Desk & Night Audit Shift (All Properties)',
      nameAr: 'شفت الاستقبال والتدقيق الليلي (كافة الفروع)',
      avatar: '🛎️',
      badge: 'Group • 8 Staff',
      property: 'Central Hospitality Cluster',
      propertyAr: 'المجمع الفندقي الأوسط',
      membersCount: 8,
      members: availableTeamMembers.slice(0, 4),
      lastMessage: 'Night audit batch posting for Dar Al-Taqwa completed.',
      lastMessageAr: 'تم إغلاق التدقيق الليلي وترحيل قيود فندق دار التقوى بنجاح.',
      lastMessageTime: '08:15 AM',
      unreadCount: 0,
      messages: [
        {
          id: 'm-4',
          senderId: 'usr-4',
          senderName: 'Khadija Al-Madani',
          senderNameAr: 'خديجة المدني',
          senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          senderRole: 'Reservations Lead',
          isMe: false,
          text: 'Dar Al-Taqwa Madinah reached 98.2% occupancy for Umrah weekend reservations. All 320 folios matched with Mada POS settlements.',
          textAr: 'نسبة إشغال فندق دار التقوى بالمدينة بلغت 98.2% لعطلة نهاية الأسبوع. تمت مطابقة كافة الـ 320 فاتورة مع أجهزة مدى.',
          timestamp: '08:10 AM',
          status: 'read',
        },
        {
          id: 'm-5',
          senderId: 'usr-2',
          senderName: 'Layla Al-Otaibi, SOCPA',
          senderNameAr: 'أ. ليلى العتيبي',
          senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          senderRole: 'Financial Controller',
          isMe: false,
          text: 'Excellent work. The USALI rooms revenue journal was posted automatically to General Ledger.',
          textAr: 'عمل ممتاز. تم ترحيل قيود إيرادات الغرف USALI آلياً إلى دفتر الأستاذ العام.',
          timestamp: '08:15 AM',
          status: 'read',
        },
      ],
    },
    {
      id: 'direct-1',
      type: 'direct',
      name: 'Layla Al-Otaibi, SOCPA',
      nameAr: 'أ. ليلى العتيبي (محاسب قانوني)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      badge: 'Financial Controller',
      property: 'Central HQ Riyadh',
      propertyAr: 'المقر الرئيسي - الرياض',
      isOnline: true,
      lastMessage: 'I reviewed the corporate credit folio for Aramco delegation.',
      lastMessageAr: 'راجعت فاتورة الائتمان الآجل لوفد شركة أرامكو.',
      lastMessageTime: '09:50 AM',
      unreadCount: 1,
      messages: [
        {
          id: 'm-6',
          senderId: 'usr-2',
          senderName: 'Layla Al-Otaibi',
          senderNameAr: 'أ. ليلى العتيبي',
          senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          senderRole: 'Financial Controller',
          isMe: false,
          text: 'Peace be upon you. I reviewed the corporate credit folio for Aramco delegation (SAR 142,500). Cryptographic hash was generated cleanly.',
          textAr: 'السلام عليكم. راجعت فاتورة الآجل لوفد أرامكو بقيمة 142,500 ريال وتم إصدار الهاش التشفيري بنجاح.',
          timestamp: '09:48 AM',
          status: 'read',
        },
        {
          id: 'm-7',
          senderId: 'me',
          senderName: 'You',
          senderNameAr: 'أنت',
          senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          isMe: true,
          text: 'Thank you Layla. Did the SADAD invoice notification trigger to their procurement portal?',
          textAr: 'شكراً أستاذة ليلى. هل تم إرسال إشعار سداد إلى بوابة المشتريات الخاصة بهم؟',
          timestamp: '09:49 AM',
          status: 'read',
        },
        {
          id: 'm-8',
          senderId: 'usr-2',
          senderName: 'Layla Al-Otaibi',
          senderNameAr: 'أ. ليلى العتيبي',
          senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          senderRole: 'Financial Controller',
          isMe: false,
          text: 'Yes! Bill number #204-991823 was transmitted and acknowledged by their finance system.',
          textAr: 'نعم! تم إرسال رقم الفاتورة #204-991823 وتم تأكيد الاستلام من نظامهم المالي.',
          timestamp: '09:50 AM',
          status: 'read',
        },
      ],
    },
    {
      id: 'direct-2',
      type: 'direct',
      name: 'Eng. Tariq Mansoor',
      nameAr: 'م. طارق منصور',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      badge: 'General Manager',
      property: 'Western Cluster',
      propertyAr: 'القطاع الغربي',
      isOnline: true,
      lastMessage: 'Let us sync on the high-season pricing matrix.',
      lastMessageAr: 'دعنا نناقش مصفوفة الأسعار للموسم السياحي القادم.',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      messages: [
        {
          id: 'm-9',
          senderId: 'usr-1',
          senderName: 'Eng. Tariq Mansoor',
          senderNameAr: 'م. طارق منصور',
          senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          isMe: false,
          text: 'Hello. Let us sync on the high-season pricing matrix for Winter at Tantora AlUla.',
          textAr: 'أهلاً بك. دعنا نحدد موعداً لمراجعة خطة تسعير موسم شتاء طنطورة بالعلا.',
          timestamp: 'Yesterday, 04:30 PM',
          status: 'read',
        },
      ],
    },
    {
      id: 'guest-1',
      type: 'guest',
      name: 'H.E. Sheikh Fahad Al-Saud (Villa 08)',
      nameAr: 'معالي الشيخ فهد آل سعود (فيلا 08)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      badge: 'WhatsApp Concierge • VIP',
      property: 'The Chedi Hegra AlUla',
      propertyAr: 'منتجع الشيدي الحجر',
      isOnline: false,
      lastMessage: 'Thank you for the warm hospitality and smooth digital check-in.',
      lastMessageAr: 'شكراً جزيلاً على حسن الضيافة وسرعة إجراءات الدخول الرقمية.',
      lastMessageTime: '10:55 AM',
      unreadCount: 0,
      messages: [
        {
          id: 'm-10',
          senderId: 'me',
          senderName: 'Concierge Bot',
          senderNameAr: 'كونسيرج الشيدي',
          senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          isMe: true,
          text: 'Welcome to The Chedi Hegra. Your smart lock PIN code is 4910#. Breakfast is served at The Ridge from 07:00 AM.',
          textAr: 'مرحباً بكم في منتجع الشيدي الحجر. كود الدخول الذكي الخاص بكم هو #4910. الإفطار متاح في مطعم ذا ريدج ابتداءً من 7:00 صباحاً.',
          timestamp: '10:43 AM',
          status: 'read',
        },
        {
          id: 'm-11',
          senderId: 'guest-1',
          senderName: 'H.E. Sheikh Fahad Al-Saud',
          senderNameAr: 'معالي الشيخ فهد آل سعود',
          senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          isMe: false,
          text: 'Thank you for the warm hospitality and smooth digital check-in. Could we request buggy transport at 02:00 PM?',
          textAr: 'شكراً جزيلاً على حسن الضيافة وسرعة إجراءات الدخول الرقمية. هل يمكن ترتيب سيارة جولف (بجي) الساعة 2:00 ظهراً؟',
          timestamp: '10:55 AM',
          status: 'read',
        },
      ],
    },
  ]);

  // Active thread
  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  // Filter threads
  const filteredThreads = threads.filter((t) => {
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'direct' && t.type === 'direct') ||
      (filterType === 'group' && t.type === 'group') ||
      (filterType === 'guest' && t.type === 'guest');

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.name.toLowerCase().includes(q) ||
      t.nameAr.toLowerCase().includes(q) ||
      (t.lastMessage && t.lastMessage.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  // Send message handler
  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: 'You',
      senderNameAr: 'أنت',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isMe: true,
      text: content.trim(),
      textAr: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== activeThreadId) return t;
        return {
          ...t,
          lastMessage: content.trim(),
          lastMessageAr: content.trim(),
          lastMessageTime: 'Just now',
          messages: [...t.messages, newMsg],
        };
      })
    );

    setInputText('');
  };

  // Create new group chat handler
  const handleCreateGroup = () => {
    if (!newGroupName.trim() && !newGroupNameAr.trim()) return;

    const groupTitle = newGroupName.trim() || (isArabic ? 'مجموعة عمل جديدة' : 'New Operational Team');
    const groupTitleAr = newGroupNameAr.trim() || (isArabic ? 'مجموعة عمل جديدة' : groupTitle);
    const newId = `group-${Date.now()}`;

    const memberObjects = availableTeamMembers.filter((m) =>
      selectedGroupMembers.includes(m.id)
    );

    const newThread: ChatThread = {
      id: newId,
      type: 'group',
      name: groupTitle,
      nameAr: groupTitleAr,
      avatar: '👥',
      badge: `Group • ${memberObjects.length + 1} Staff`,
      property: newGroupProperty,
      propertyAr: newGroupProperty,
      membersCount: memberObjects.length + 1,
      members: memberObjects,
      lastMessage: isArabic ? 'تم إنشاء مجموعة العمل' : 'Group chat created',
      lastMessageAr: 'تم إنشاء مجموعة العمل',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `m-${Date.now()}`,
          senderId: 'system',
          senderName: 'System',
          senderNameAr: 'النظام',
          senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          isMe: false,
          text: `Group created with ${memberObjects.length} members for ${newGroupProperty}.`,
          textAr: `تم إنشاء المجموعة وإضافة ${memberObjects.length} أعضاء لمنشأة ${newGroupProperty}.`,
          timestamp: 'Just now',
          status: 'read',
        },
      ],
    };

    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newId);
    setMobileShowThread(true);
    setIsNewGroupModalOpen(false);
    setNewGroupName('');
    setNewGroupNameAr('');
  };

  // Quick reply shortcuts
  const quickReplies = [
    { text: 'Smart lock PIN generated & dispatched.', textAr: 'تم إنشاء كود القفل الذكي وإرساله للنزيل.' },
    { text: 'Villa inspection completed and approved.', textAr: 'تم فحص جاهزية الفيلا واعتمادها للتشغيل.' },
    { text: 'ZATCA Phase 2 tax folio cleared.', textAr: 'تم اعتماد فاتورة الزكاة المشفرة وتثبيتها.' },
    { text: 'Guest luggage dispatched to room.', textAr: 'تم نقل أمتعة النزيل إلى الغرفة بنجاح.' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] bg-white rounded-2xl border border-[#e3e8f9] shadow-xs overflow-hidden">
      {/* Top Main Chat Header / Bar */}
      <div className="bg-[#f9f9ff] border-b border-[#e3e8f9] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#004a60] to-[#003140] text-white flex items-center justify-center shadow-xs">
            <MessageSquare className="h-5 w-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#161c27]">
                {isArabic ? 'مركز المحادثات والتواصل الفندقي' : 'Hospitality Operations & Guest Messaging'}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-200">
                <ShieldCheck className="h-3 w-3" />
                Live WhatsApp API & Internal Mesh
              </span>
            </div>
            <p className="text-[11px] text-[#70787d]">
              {isArabic
                ? 'محادثات مباشرة بين فرق العمل، مجموعات التشغيل الميداني، وكونسيرج النزلاء الموثق.'
                : 'Direct 1-on-1 team chats, operational group channels, and WhatsApp concierge.'}
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewGroupModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#004a60] text-white px-3 py-1.5 text-xs font-bold shadow-xs hover:bg-[#074e64] transition-all cursor-pointer"
          >
            <Users className="h-3.5 w-3.5" />
            <span>{isArabic ? 'مجموعة جديدة' : '+ New Group'}</span>
          </button>

          <button
            onClick={() => setIsNewDirectModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[#e3e8f9] bg-white text-[#161c27] px-3 py-1.5 text-xs font-semibold shadow-2xs hover:bg-[#f1f3ff] transition-all cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5 text-[#004a60]" />
            <span>{isArabic ? 'محادثة فردية' : 'Direct Message'}</span>
          </button>
        </div>
      </div>

      {/* Main Responsive Grid: Chats Sidebar (Left) + Active Conversation (Right) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ================= COLUMN 1: THREADS LIST ================= */}
        <div
          className={`w-full lg:w-80 xl:w-96 border-r border-[#e3e8f9] flex flex-col bg-white shrink-0 ${
            mobileShowThread ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Search Bar */}
          <div className="p-3 border-b border-[#e3e8f9]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isArabic ? 'بحث في المحادثات أو الرسائل...' : 'Search chats, groups, guests...'}
                className="w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] py-1.5 pl-9 pr-3 text-xs text-[#161c27] focus:border-[#004a60] focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 mt-2.5 overflow-x-auto no-scrollbar pb-0.5">
              {[
                { id: 'all', label: 'All', labelAr: 'الكل', count: threads.length },
                {
                  id: 'group',
                  label: 'Groups',
                  labelAr: 'المجموعات',
                  count: threads.filter((t) => t.type === 'group').length,
                },
                {
                  id: 'direct',
                  label: 'Direct',
                  labelAr: 'المباشرة',
                  count: threads.filter((t) => t.type === 'direct').length,
                },
                {
                  id: 'guest',
                  label: 'Guests',
                  labelAr: 'النزلاء',
                  count: threads.filter((t) => t.type === 'guest').length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    filterType === tab.id
                      ? 'bg-[#004a60] text-white font-bold shadow-2xs'
                      : 'bg-[#f1f3ff] text-[#40484d] hover:bg-[#e8eeff]'
                  }`}
                >
                  <span>{isArabic ? tab.labelAr : tab.label}</span>
                  <span
                    className={`ml-1 text-[9px] px-1 py-0.2 rounded-full ${
                      filterType === tab.id ? 'bg-white/20 text-white' : 'bg-white text-[#70787d]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Thread List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#f1f3ff]">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#70787d]">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-[#70787d]/40" />
                {isArabic ? 'لا توجد محادثات مطابقة' : 'No matching conversations found'}
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = thread.id === activeThreadId;

                return (
                  <div
                    key={thread.id}
                    onClick={() => {
                      setActiveThreadId(thread.id);
                      setMobileShowThread(true);
                    }}
                    className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#f1f3ff] border-l-4 border-l-[#004a60]'
                        : 'hover:bg-[#f9f9ff]'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      {thread.type === 'group' ? (
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg shadow-2xs">
                          {thread.avatar}
                        </div>
                      ) : (
                        <img
                          src={thread.avatar}
                          alt={thread.name}
                          className="h-10 w-10 rounded-full object-cover border border-[#e3e8f9]"
                        />
                      )}
                      {thread.isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="font-bold text-xs text-[#161c27] truncate">
                          {isArabic ? thread.nameAr : thread.name}
                        </div>
                        <span className="text-[10px] text-[#70787d] whitespace-nowrap shrink-0">
                          {thread.lastMessageTime}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-[#70787d] mb-1">
                        {thread.type === 'group' && (
                          <span className="bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.2 rounded-md">
                            Group
                          </span>
                        )}
                        {thread.type === 'guest' && (
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded-md">
                            WhatsApp
                          </span>
                        )}
                        <span className="truncate">{isArabic ? thread.propertyAr : thread.property}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] text-[#40484d] truncate">
                          {isArabic ? thread.lastMessageAr || thread.lastMessage : thread.lastMessage}
                        </p>
                        {thread.unreadCount > 0 && (
                          <span className="h-4 min-w-4 px-1 rounded-full bg-[#004a60] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= COLUMN 2: ACTIVE CHAT CONVERSATION ================= */}
        <div
          className={`flex-1 flex flex-col bg-[#fcfdff] ${
            mobileShowThread ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Active Conversation Header */}
          <div className="h-16 px-4 bg-white border-b border-[#e3e8f9] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {/* Mobile Back Button */}
              <button
                onClick={() => setMobileShowThread(false)}
                className="lg:hidden p-1.5 rounded-lg text-[#004a60] hover:bg-[#f1f3ff] cursor-pointer"
                title="Back to chats"
              >
                {isArabic ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
              </button>

              {/* Chat Avatar */}
              <div className="relative shrink-0">
                {activeThread.type === 'group' ? (
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg shadow-2xs">
                    {activeThread.avatar}
                  </div>
                ) : (
                  <img
                    src={activeThread.avatar}
                    alt={activeThread.name}
                    className="h-10 w-10 rounded-full object-cover border border-[#e3e8f9]"
                  />
                )}
                {activeThread.isOnline && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-[#161c27]">
                    {isArabic ? activeThread.nameAr : activeThread.name}
                  </h3>
                  {activeThread.type === 'group' && (
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                      {activeThread.membersCount} members
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#70787d] flex items-center gap-2">
                  <span>{isArabic ? activeThread.propertyAr : activeThread.property}</span>
                  {activeThread.type === 'direct' && (
                    <>
                      <span>•</span>
                      <span className={activeThread.isOnline ? 'text-emerald-600 font-medium' : ''}>
                        {activeThread.isOnline ? 'Online now' : 'Active today'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Conversation Actions */}
            <div className="flex items-center gap-2">
              {activeThread.type === 'group' && (
                <button
                  onClick={() => setShowGroupInfo(!showGroupInfo)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    showGroupInfo
                      ? 'bg-[#004a60] text-white border-[#004a60]'
                      : 'border-[#e3e8f9] bg-white text-[#40484d] hover:bg-[#f1f3ff]'
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">
                    {isArabic ? 'أعضاء المجموعة' : 'Members'}
                  </span>
                </button>
              )}

              {activeThread.type === 'guest' && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>WhatsApp Verified</span>
                </span>
              )}
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]/60">
            {/* Encryption & Compliance Banner */}
            <div className="max-w-md mx-auto bg-white rounded-xl border border-[#e3e8f9] p-2 text-center text-[10px] text-[#70787d] flex items-center justify-center gap-1.5 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>
                {isArabic
                  ? 'المحادثة مشفرة ومتوافقة مع معايير الهيئة الوطنية للأمن السيبراني وهيئة الزكاة.'
                  : 'End-to-end encrypted under NCA cybersecurity guidelines. ZATCA folios digitally verified.'}
              </span>
            </div>

            {/* Messages */}
            {activeThread.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] sm:max-w-[70%] ${
                  msg.isMe ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {!msg.isMe && (
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="h-7 w-7 rounded-full object-cover shrink-0 mt-1 border border-[#e3e8f9]"
                  />
                )}

                <div className="space-y-1">
                  {/* Sender Name for group chats */}
                  {!msg.isMe && activeThread.type === 'group' && (
                    <div className="flex items-center gap-1.5 text-[10px] text-[#70787d] px-1">
                      <span className="font-bold text-[#161c27]">
                        {isArabic ? msg.senderNameAr || msg.senderName : msg.senderName}
                      </span>
                      {msg.senderRole && (
                        <span className="bg-gray-100 text-[#40484d] text-[9px] px-1.5 py-0.2 rounded-md">
                          {msg.senderRole}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                      msg.isMe
                        ? 'bg-[#004a60] text-white rounded-tr-none'
                        : 'bg-white text-[#161c27] border border-[#e3e8f9] rounded-tl-none'
                    }`}
                  >
                    <p>{isArabic ? msg.textAr || msg.text : msg.text}</p>

                    {/* Rich Attachment Preview */}
                    {msg.attachment && (
                      <div
                        className={`mt-2.5 p-2.5 rounded-xl flex items-center gap-2.5 border ${
                          msg.isMe
                            ? 'bg-white/10 border-white/20 text-white'
                            : 'bg-[#f9f9ff] border-[#e3e8f9] text-[#161c27]'
                        }`}
                      >
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                            msg.isMe ? 'bg-white/20' : 'bg-[#e8eeff] text-[#004a60]'
                          }`}
                        >
                          <Key className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-[11px] truncate">{msg.attachment.name}</div>
                          <div
                            className={`text-[10px] ${
                              msg.isMe ? 'text-white/80' : 'text-[#70787d]'
                            }`}
                          >
                            {msg.attachment.size}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Timestamp & status */}
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        msg.isMe ? 'text-white/70' : 'text-[#70787d]'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.isMe && <CheckCheck className="h-3 w-3 text-emerald-300" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Strip */}
          <div className="px-3 py-1.5 bg-[#f9f9ff] border-t border-[#e3e8f9] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-[#70787d] uppercase tracking-wider shrink-0 mr-1">
              {isArabic ? 'رد سريع:' : 'Quick:'}
            </span>
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(isArabic ? reply.textAr : reply.text)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-[#e3e8f9] text-[11px] font-medium text-[#40484d] hover:bg-[#e8eeff] hover:text-[#004a60] transition-colors cursor-pointer"
              >
                {isArabic ? reply.textAr : reply.text}
              </button>
            ))}
          </div>

          {/* Input & Send Bar */}
          <div className="p-3 bg-white border-t border-[#e3e8f9] flex items-center gap-2 shrink-0">
            <button
              title="Attach Document or PIN"
              onClick={() => handleSendMessage('Smart lock PIN verified for guest check-in.')}
              className="p-2 rounded-xl text-[#70787d] hover:text-[#004a60] hover:bg-[#f1f3ff] transition-colors cursor-pointer"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={
                isArabic
                  ? `أرسل رسالة إلى ${activeThread.nameAr}... (اضغط Enter للإرسال)`
                  : `Type message to ${activeThread.name}... (Press Enter to send)`
              }
              className="flex-1 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] py-2 px-3.5 text-xs text-[#161c27] focus:border-[#004a60] focus:bg-white focus:outline-hidden"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className={`p-2.5 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer ${
                inputText.trim()
                  ? 'bg-[#004a60] text-white hover:bg-[#074e64] shadow-xs'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ================= OPTIONAL RIGHT DRAWER: GROUP MEMBERS INFO ================= */}
        {showGroupInfo && activeThread.type === 'group' && (
          <div className="w-72 bg-white border-l border-[#e3e8f9] p-4 flex flex-col shrink-0 animate-in slide-in-from-right-5 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9]">
              <h4 className="text-xs font-bold text-[#161c27]">
                {isArabic ? 'أعضاء المجموعة' : 'Group Participants'}
              </h4>
              <button
                onClick={() => setShowGroupInfo(false)}
                className="text-[#70787d] hover:text-[#161c27] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 text-xs text-[#70787d] mb-2">
              <span>{activeThread.property}</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 divide-y divide-[#f1f3ff]">
              {activeThread.members?.map((member) => (
                <div key={member.id} className="pt-2 flex items-center gap-2.5">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-8 w-8 rounded-full object-cover border border-[#e3e8f9]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-[#161c27] truncate">
                      {isArabic ? member.nameAr : member.name}
                    </div>
                    <div className="text-[10px] text-[#70787d] truncate">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                alert(
                  isArabic
                    ? 'تم فتح نافذة دعوة أعضاء إضافيين لمجموعة العمل'
                    : 'Invite additional staff to this operational channel'
                );
              }}
              className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-xl border border-[#004a60] bg-white py-2 text-xs font-bold text-[#004a60] hover:bg-[#f1f3ff] transition-all cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>{isArabic ? 'إضافة عضو للمجموعة' : 'Add Team Member'}</span>
            </button>
          </div>
        )}
      </div>

      {/* ================= MODAL: CREATE GROUP CHAT ================= */}
      {isNewGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9]">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#004a60] text-white flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#161c27]">
                    {isArabic ? 'إنشاء مجموعة محادثة جديدة' : 'Create Group Channel'}
                  </h3>
                  <p className="text-[11px] text-[#70787d]">
                    {isArabic
                      ? 'قناة تواصل تشغيلية مخصصة لفريق الفندق أو قسم محدد.'
                      : 'Dedicated channel for property departments and operations.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewGroupModalOpen(false)}
                className="text-[#70787d] hover:text-[#161c27] text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  Group Name (English) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. AlUla Desert Villas - Housekeeping"
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  اسم المجموعة (بالعربية) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newGroupNameAr}
                  onChange={(e) => setNewGroupNameAr(e.target.value)}
                  placeholder="مثال: فلل العلا الصحراوية - فريق خدمة الغرف"
                  dir="rtl"
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'المنشأة الفندقية التابعة لها' : 'Target Hotel / Branch'}
                </label>
                <select
                  value={newGroupProperty}
                  onChange={(e) => setNewGroupProperty(e.target.value)}
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 text-xs text-[#161c27] focus:border-[#004a60] focus:outline-hidden"
                >
                  <option>The Chedi Hegra AlUla</option>
                  <option>Dar Al-Taqwa Luxury Suites Madinah</option>
                  <option>KAFD Sky Tower Executive Apartments Riyadh</option>
                  <option>Durrat Al-Arous Marina Luxury Chalets Jeddah</option>
                  <option>All 142 KSA Hospitality Properties</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1.5">
                  {isArabic ? 'إضافة أعضاء الفريق للمجموعة' : 'Select Team Members'}
                </label>
                <div className="max-h-40 overflow-y-auto space-y-1.5 border border-[#e3e8f9] rounded-xl p-2 bg-[#f9f9ff]">
                  {availableTeamMembers.map((member) => {
                    const isChecked = selectedGroupMembers.includes(member.id);
                    return (
                      <label
                        key={member.id}
                        className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedGroupMembers(
                                selectedGroupMembers.filter((id) => id !== member.id)
                              );
                            } else {
                              setSelectedGroupMembers([...selectedGroupMembers, member.id]);
                            }
                          }}
                          className="rounded border-gray-300 text-[#004a60] focus:ring-[#004a60] cursor-pointer"
                        />
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-xs text-[#161c27] truncate">
                            {isArabic ? member.nameAr : member.name}
                          </div>
                          <div className="text-[10px] text-[#70787d]">{member.role}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3e8f9]">
              <button
                type="button"
                onClick={() => setIsNewGroupModalOpen(false)}
                className="rounded-xl border border-[#e3e8f9] px-4 py-2 text-xs font-semibold text-[#70787d] hover:bg-[#f1f3ff] cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleCreateGroup}
                className="flex items-center gap-1.5 rounded-xl bg-[#004a60] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#074e64] cursor-pointer"
              >
                <Users className="h-4 w-4" />
                <span>{isArabic ? 'إنشاء المجموعة وبدء المحادثة' : 'Create Group & Open'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DIRECT MESSAGE PICKER ================= */}
      {isNewDirectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-[#e3e8f9] p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9]">
              <h3 className="text-sm font-bold text-[#161c27]">
                {isArabic ? 'بدء محادثة جديدة' : 'Start Direct Message'}
              </h3>
              <button
                onClick={() => setIsNewDirectModalOpen(false)}
                className="text-[#70787d] hover:text-[#161c27] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableTeamMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => {
                    const existing = threads.find(
                      (t) => t.type === 'direct' && t.name.includes(member.name.split(' ')[0])
                    );
                    if (existing) {
                      setActiveThreadId(existing.id);
                    } else {
                      const newThreadId = `direct-${Date.now()}`;
                      const directChat: ChatThread = {
                        id: newThreadId,
                        type: 'direct',
                        name: member.name,
                        nameAr: member.nameAr,
                        avatar: member.avatar,
                        badge: member.role,
                        property: member.property,
                        propertyAr: member.property,
                        isOnline: true,
                        lastMessage: 'Conversation started',
                        lastMessageAr: 'بدأت المحادثة',
                        lastMessageTime: 'Just now',
                        unreadCount: 0,
                        messages: [],
                      };
                      setThreads((prev) => [directChat, ...prev]);
                      setActiveThreadId(newThreadId);
                    }
                    setMobileShowThread(true);
                    setIsNewDirectModalOpen(false);
                  }}
                  className="p-2.5 rounded-xl border border-[#e3e8f9] hover:bg-[#f1f3ff] hover:border-[#004a60] flex items-center gap-2.5 cursor-pointer transition-all"
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-xs text-[#161c27]">
                      {isArabic ? member.nameAr : member.name}
                    </div>
                    <div className="text-[10px] text-[#70787d]">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
