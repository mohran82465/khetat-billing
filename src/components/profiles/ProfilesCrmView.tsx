import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Building,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  ShieldCheck,
  User,
  Sliders,
  Send,
  Smartphone,
  Copy,
  Check,
  X,
  Layers,
  MapPin,
  ExternalLink,
  List,
  LayoutGrid,
  Eye,
  Calendar,
  Clock,
  Briefcase,
  Award,
  ArrowUpRight,
  ChevronRight,
  UserCheck,
  UserPlus,
  RefreshCw,
  Sparkles,
  ArrowRight,
  DollarSign,
  AlertCircle,
  FileText,
  BadgeAlert,
  SlidersHorizontal,
  Share2,
} from 'lucide-react';
import {
  CrmUserProfile,
  CrmUserStatus,
  CrmUserType,
  CrmLeadStage,
  CrmSyncStatus,
  INITIAL_CRM_PROFILES,
} from '../../data/crmData';

interface ProfilesCrmViewProps {
  isArabic: boolean;
  onNavigateToSection?: (section: string) => void;
}

export const ProfilesCrmView: React.FC<ProfilesCrmViewProps> = ({
  isArabic,
  onNavigateToSection,
}) => {
  const [profiles, setProfiles] = useState<CrmUserProfile[]>(INITIAL_CRM_PROFILES);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'potential' | 'mudabbir' | 'pending_sync'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | CrmUserType>('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');

  // Modal States
  const [inspectingProfile, setInspectingProfile] = useState<CrmUserProfile | null>(null);
  const [editingProfile, setEditingProfile] = useState<CrmUserProfile | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // New User Form State
  const [newStatus, setNewStatus] = useState<CrmUserStatus>('potential');
  const [newUserType, setNewUserType] = useState<CrmUserType>('operator');
  const [newLeadStage, setNewLeadStage] = useState<CrmLeadStage>('new_lead');
  const [newName, setNewName] = useState('');
  const [newNameAr, setNewNameAr] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyNameAr, setNewCompanyNameAr] = useState('');
  const [newPhone, setNewPhone] = useState('+966 5');
  const [newEmail, setNewEmail] = useState('');
  const [newCity, setNewCity] = useState('Riyadh');
  const [newCityAr, setNewCityAr] = useState('الرياض');
  const [newDistrict, setNewDistrict] = useState('');
  const [newPropertiesCount, setNewPropertiesCount] = useState('2');
  const [newKeysCount, setNewKeysCount] = useState('20');
  const [newPotentialValue, setNewPotentialValue] = useState('120000');
  const [newSourceChannel, setNewSourceChannel] = useState<'Mudabbir Web Portal' | 'Mudabbir Mobile App' | 'Self-Registration Form'>('Mudabbir Web Portal');
  const [newUserNotes, setNewUserNotes] = useState('');

  // Edit / Admin Modification Form State
  const [editTier, setEditTier] = useState<string>('Gold Enterprise');
  const [editPlan, setEditPlan] = useState<string>('Hotel Enterprise OS');
  const [editDiscount, setEditDiscount] = useState<string>('10');
  const [editManager, setEditManager] = useState<string>('Eng. Tariq Mansoor');
  const [editManagerPhone, setEditManagerPhone] = useState<string>('+966 55 993 1122');
  const [editCreditLimit, setEditCreditLimit] = useState<string>('100000');
  const [editVerification, setEditVerification] = useState<'Verified Nafath' | 'Pending Documents' | 'Audit Passed' | 'Requires Clarification'>('Verified Nafath');
  const [editAdminNotes, setEditAdminNotes] = useState<string>('');
  const [editCustomTerms, setEditCustomTerms] = useState<string>('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Metrics
  const totalCount = profiles.length;
  const activeCount = profiles.filter((p) => p.status === 'active').length;
  const potentialCount = profiles.filter((p) => p.status === 'potential').length;
  const mudabbirSubmissionsCount = profiles.filter((p) => p.mudabbirData).length;
  const pendingSyncCount = profiles.filter((p) => p.syncStatus === 'pending_sync_to_user' || p.syncStatus === 'user_submitted_review').length;
  const totalPotentialPipeline = profiles
    .filter((p) => p.status === 'potential')
    .reduce((acc, p) => acc + (p.potentialDealValueSar || 0), 0);

  // Filtered Profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      // Status Filter
      if (statusFilter === 'active' && p.status !== 'active') return false;
      if (statusFilter === 'potential' && p.status !== 'potential') return false;
      if (statusFilter === 'mudabbir' && !p.mudabbirData?.sourceChannel.includes('Mudabbir')) return false;
      if (statusFilter === 'pending_sync' && p.syncStatus === 'synced') return false;

      // Type Filter
      if (typeFilter !== 'all' && p.userType !== typeFilter) return false;

      // City Filter
      if (cityFilter !== 'all' && p.city !== cityFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          p.name.toLowerCase().includes(q) ||
          p.nameAr.includes(q) ||
          p.companyName.toLowerCase().includes(q) ||
          p.companyNameAr.includes(q) ||
          p.phone.includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.cityAr.includes(q) ||
          p.code.toLowerCase().includes(q) ||
          (p.mudabbirData?.crNumber && p.mudabbirData.crNumber.includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [profiles, statusFilter, typeFilter, cityFilter, searchQuery]);

  // Distinct cities
  const citiesList = useMemo(() => {
    return Array.from(new Set(profiles.map((p) => p.city))).sort();
  }, [profiles]);

  // Handle Convert Potential to Active User
  const handleConvertToActive = (profileId: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profileId) {
          return {
            ...p,
            status: 'active',
            leadStage: 'active_client',
            leadStageAr: 'عميل نشط ومعتمد',
            syncStatus: 'pending_sync_to_user',
            syncStatusAr: 'تعديلات بانتظار الإرسال للمستخدم',
            updatedAt: '2026-10-02',
          };
        }
        return p;
      })
    );
    showToast(isArabic ? 'تم ترقية وتحويل المستخدم إلى مستخدم نشط بنجاح' : 'Converted lead into Active User');
  };

  // Open Edit / Admin Modifications Modal
  const handleOpenEdit = (profile: CrmUserProfile) => {
    setEditingProfile(profile);
    setEditTier(profile.adminData.approvedTier || 'Gold Enterprise');
    setEditPlan(profile.adminData.approvedPlan || profile.mudabbirData.requestedPlan || 'Hotel Enterprise OS');
    setEditDiscount(profile.adminData.customDiscountPercent?.toString() || '10');
    setEditManager(profile.adminData.assignedAccountManager || 'Eng. Tariq Mansoor');
    setEditManagerPhone(profile.adminData.assignedManagerPhone || '+966 55 993 1122');
    setEditCreditLimit(profile.adminData.creditLimitSar?.toString() || '75000');
    setEditVerification(profile.adminData.verificationStatus || 'Verified Nafath');
    setEditAdminNotes(profile.adminData.adminInternalNotes || '');
    setEditCustomTerms(profile.adminData.adminCustomTerms || '');
  };

  // Save Admin Modifications
  const handleSaveAdminData = (syncDirectlyToUser: boolean) => {
    if (!editingProfile) return;

    const now = '2026-10-02 10:00';
    const updatedProfiles = profiles.map((p) => {
      if (p.id === editingProfile.id) {
        return {
          ...p,
          adminData: {
            ...p.adminData,
            lastModifiedAt: now,
            modifiedBy: 'Sheikh Mansour Al-Harbi (CEO)',
            approvedTier: editTier as any,
            approvedTierAr:
              editTier === 'VIP Platinum'
                ? 'شريك بلاتيني استراتيجي'
                : editTier === 'Gold Enterprise'
                ? 'شريك ذهبي معتمد'
                : editTier === 'Silver Partner'
                ? 'شريك فضي'
                : 'مشغل قياسي',
            approvedPlan: editPlan,
            customDiscountPercent: parseFloat(editDiscount) || 0,
            assignedAccountManager: editManager,
            assignedManagerPhone: editManagerPhone,
            creditLimitSar: parseFloat(editCreditLimit) || 0,
            verificationStatus: editVerification,
            verificationStatusAr:
              editVerification === 'Verified Nafath'
                ? 'موثق عبر نفاذ والسجل التجاري'
                : editVerification === 'Audit Passed'
                ? 'تم التدقيق المالي ومطابقة التراخيص'
                : 'بانتظار الوثائق الرسمية',
            adminInternalNotes: editAdminNotes,
            adminCustomTerms: editCustomTerms,
            syncDeliveredAt: syncDirectlyToUser ? now : p.adminData.syncDeliveredAt,
            deliveryMethod: syncDirectlyToUser ? ('Mudabbir Portal Sync' as const) : p.adminData.deliveryMethod,
          },
          syncStatus: syncDirectlyToUser ? ('synced' as const) : ('pending_sync_to_user' as const),
          syncStatusAr: syncDirectlyToUser
            ? 'تمت المزامنة للمستخدم بنجاح'
            : 'تعديلات بانتظار الإرسال للمستخدم',
          lastSyncTimestamp: syncDirectlyToUser ? now : p.lastSyncTimestamp,
          updatedAt: '2026-10-02',
        };
      }
      return p;
    });

    setProfiles(updatedProfiles);
    setEditingProfile(null);
    showToast(
      syncDirectlyToUser
        ? isArabic
          ? `تم حفظ التعديلات ومزامنة البيانات المعتمدة مع المستخدم عبر منصة مدبّر`
          : `Saved changes and synced updated profile with user via Mudabbir`
        : isArabic
        ? `تم حفظ التعديلات الإدارية داخلياً (جاهزة للمزامنة مع المستخدم)`
        : `Saved admin modifications internally`
    );
  };

  // Direct Push / Sync updated data to User via Mudabbir
  const handlePushSyncToUser = (profile: CrmUserProfile) => {
    const now = '2026-10-02 10:15';
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profile.id) {
          return {
            ...p,
            syncStatus: 'synced',
            syncStatusAr: 'تمت المزامنة للمستخدم بنجاح',
            lastSyncTimestamp: now,
            adminData: {
              ...p.adminData,
              syncDeliveredAt: now,
              deliveryMethod: 'Mudabbir Portal Sync',
            },
          };
        }
        return p;
      })
    );
    showToast(
      isArabic
        ? `تم إرسال ومزامنة البيانات المعدلة لحساب «${profile.nameAr}» في منصة مدبّر بنجاح`
        : `Synced updated profile data to ${profile.name}'s Mudabbir account`
    );
  };

  // Create New User (Active or Potential)
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCompanyName) return;

    const generatedId = `crm-usr-${Date.now()}`;
    const generatedCode = `CRM-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newProfile: CrmUserProfile = {
      id: generatedId,
      code: generatedCode,
      userType: newUserType,
      userTypeAr:
        newUserType === 'operator'
          ? 'مشغل منشأة فندقية'
          : newUserType === 'guest'
          ? 'نزيل / عميل فردي VIP'
          : newUserType === 'corporate'
          ? 'شركة سياحة وسفر متعاقدة'
          : 'مالك ومستثمر عقارات',
      status: newStatus,
      leadStage: newStatus === 'active' ? 'active_client' : newLeadStage,
      leadStageAr:
        newStatus === 'active'
          ? 'عميل نشط ومعتمد'
          : newLeadStage === 'new_lead'
          ? 'مستخدم محتمل جديد'
          : newLeadStage === 'contacted'
          ? 'تم التواصل المبدئي'
          : newLeadStage === 'proposal_sent'
          ? 'تم إرسال العرض'
          : 'قيد المراجعة والتفاوض',
      potentialDealValueSar: parseFloat(newPotentialValue) || 100000,
      interestLevel: 'High',
      name: newName,
      nameAr: newNameAr || newName,
      companyName: newCompanyName,
      companyNameAr: newCompanyNameAr || newCompanyName,
      phone: newPhone,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      city: newCity,
      cityAr: newCityAr || newCity,
      district: newDistrict || 'Central Area',
      mudabbirData: {
        submittedAt: '2026-10-02 09:30',
        sourceChannel: newSourceChannel,
        companyName: newCompanyName,
        companyNameAr: newCompanyNameAr,
        fullName: newName,
        fullNameAr: newNameAr,
        phone: newPhone,
        email: newEmail,
        city: newCity,
        cityAr: newCityAr,
        district: newDistrict,
        propertyCount: parseInt(newPropertiesCount, 10) || 1,
        keysCount: parseInt(newKeysCount, 10) || 10,
        propertyType: 'Hotels',
        propertyTypeAr: 'فنادق وشقق مخدومة',
        requestedPlan: 'Hotel Enterprise OS',
        userNotes: newUserNotes || 'مستخدم مسجل جديد في المنصة.',
      },
      adminData: {
        lastModifiedAt: '2026-10-02 09:35',
        modifiedBy: 'Admin Ingestion Lead',
        approvedTier: newStatus === 'active' ? 'Gold Enterprise' : 'Standard Operator',
        approvedTierAr: newStatus === 'active' ? 'شريك ذهبي معتمد' : 'مشغل قياسي',
        approvedPlan: 'Hotel Enterprise OS',
        assignedAccountManager: 'Eng. Tariq Mansoor',
        assignedManagerPhone: '+966 55 993 1122',
        verificationStatus: newStatus === 'active' ? 'Verified Nafath' : 'Pending Documents',
        verificationStatusAr: newStatus === 'active' ? 'موثق عبر نفاذ' : 'بانتظار استكمال الوثائق',
        adminInternalNotes: 'تم تسجيل المستخدم في نظام CRM بنجاح.',
      },
      syncStatus: newStatus === 'active' ? 'synced' : 'pending_sync_to_user',
      syncStatusAr: newStatus === 'active' ? 'تمت المزامنة للمستخدم بنجاح' : 'تعديلات بانتظار الإرسال للمستخدم',
      propertiesCount: parseInt(newPropertiesCount, 10) || 1,
      keysCount: parseInt(newKeysCount, 10) || 10,
      createdAt: '2026-10-02',
      updatedAt: '2026-10-02',
      avatarColor: newStatus === 'active' ? 'bg-[#004a60]' : 'bg-amber-600',
    };

    setProfiles((prev) => [newProfile, ...prev]);
    setIsAddUserModalOpen(false);

    // Reset Form
    setNewName('');
    setNewNameAr('');
    setNewCompanyName('');
    setNewCompanyNameAr('');
    setNewPhone('+966 5');
    setNewEmail('');
    setNewUserNotes('');

    showToast(
      isArabic
        ? `تمت إضافة ${newStatus === 'active' ? 'المستخدم النشط' : 'المستخدم المحتمل'} «${newProfile.nameAr}» بنجاح`
        : `Created new ${newStatus === 'active' ? 'Active User' : 'Potential Lead'}: ${newProfile.name}`
    );
  };

  return (
    <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#004a60] text-white px-4 py-2.5 shadow-xl border border-white/20 text-xs font-semibold animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BANNER: CRM SYSTEM OVERVIEW & WORKFLOW */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base font-bold text-[#161c27] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#004a60]" />
              <span>{isArabic ? 'نظام إدارة علاقات العملاء والملفات (Profiles CRM)' : 'Profiles CRM & User Hub'}</span>
            </h2>
            <span className="text-[10px] font-bold bg-[#e8eeff] text-[#004a60] px-2.5 py-0.5 rounded-full border border-[#c3cce6]">
              {totalCount} {isArabic ? 'مستخدم مسجل' : 'Total Users'}
            </span>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {activeCount} {isArabic ? 'نشط' : 'Active'}
            </span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
              {potentialCount} {isArabic ? 'محتمل (Leads)' : 'Potential'}
            </span>
          </div>
          <p className="text-xs text-[#70787d] mt-1.5 max-w-3xl leading-relaxed">
            {isArabic
              ? 'إدارة متكاملة لبيانات المستخدمين المدخلة ذاتياً عبر منصة مدبّر، مع إمكانية تعديل واعتماد البيانات من قبل الإدارة وإعادة إرسالها ومزامنتها مع المستخدم، بالإضافة لتأسيس مستخدم جديد أو مستخدم محتمل.'
              : 'Complete CRM for user profiles: ingest self-submitted data from Mudabbir, adjust and approve terms by admin, push modifications back to user, and manage active vs potential leads.'}
          </p>
        </div>

        {/* Action Buttons: Add User & View Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
          <div className="flex items-center p-1 bg-[#f1f3ff] rounded-xl border border-[#e3e8f9]">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[#004a60] shadow-xs'
                  : 'text-[#70787d] hover:text-[#161c27]'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>{isArabic ? 'قائمة (List)' : 'List'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-[#004a60] shadow-xs'
                  : 'text-[#70787d] hover:text-[#161c27]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>{isArabic ? 'بطاقات' : 'Cards'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white px-4 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>{isArabic ? '+ إضافة مستخدم (نشط / محتمل)' : '+ Add User (Active/Lead)'}</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Active Users */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'active' ? 'all' : 'active')}
          className={`bg-white rounded-xl border p-3.5 shadow-2xs cursor-pointer transition-all ${
            statusFilter === 'active'
              ? 'border-[#004a60] ring-2 ring-[#004a60]/20 bg-[#e8eeff]/20'
              : 'border-[#e3e8f9] hover:border-[#c3cce6]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#70787d]">
              {isArabic ? 'المستخدمون النشطون' : 'Active Users'}
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <UserCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-lg font-extrabold text-emerald-700 mt-1">{activeCount}</div>
          <span className="text-[9px] text-[#70787d]">{isArabic ? 'مشغلون وعملاء معتمدون' : 'Live & verified'}</span>
        </div>

        {/* Potential Users / Leads */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'potential' ? 'all' : 'potential')}
          className={`bg-white rounded-xl border p-3.5 shadow-2xs cursor-pointer transition-all ${
            statusFilter === 'potential'
              ? 'border-[#004a60] ring-2 ring-[#004a60]/20 bg-[#e8eeff]/20'
              : 'border-[#e3e8f9] hover:border-[#c3cce6]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#70787d]">
              {isArabic ? 'مستخدمون محتملون (Leads)' : 'Potential Leads'}
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <UserPlus className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-lg font-extrabold text-amber-700 mt-1">{potentialCount}</div>
          <span className="text-[9px] text-[#70787d]">{isArabic ? 'فرص قيد التفاوض والتعاقد' : 'In pipeline'}</span>
        </div>

        {/* Potential Pipeline Value */}
        <div className="bg-white rounded-xl border border-[#e3e8f9] p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#70787d]">
              {isArabic ? 'قيمة الصفقات المحتملة' : 'Pipeline Value'}
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <DollarSign className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-lg font-extrabold text-[#004a60] mt-1">
            SAR {(totalPotentialPipeline / 1000).toFixed(0)}k
          </div>
          <span className="text-[9px] text-[#70787d]">{isArabic ? 'عقود متوقعة سنوياً' : 'Annual ACV pipeline'}</span>
        </div>

        {/* Ingested via Mudabbir */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'mudabbir' ? 'all' : 'mudabbir')}
          className={`bg-white rounded-xl border p-3.5 shadow-2xs cursor-pointer transition-all ${
            statusFilter === 'mudabbir'
              ? 'border-[#004a60] ring-2 ring-[#004a60]/20 bg-[#e8eeff]/20'
              : 'border-[#e3e8f9] hover:border-[#c3cce6]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#70787d]">
              {isArabic ? 'واردة من منصة مدبّر' : 'From Mudabbir'}
            </span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
              <Smartphone className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-lg font-extrabold text-purple-700 mt-1">{mudabbirSubmissionsCount}</div>
          <span className="text-[9px] text-[#70787d]">{isArabic ? 'تسجيل ذاتي عبر البوابة' : 'Self-serve intake'}</span>
        </div>

        {/* Pending Sync to User */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'pending_sync' ? 'all' : 'pending_sync')}
          className={`bg-white rounded-xl border p-3.5 shadow-2xs cursor-pointer transition-all ${
            statusFilter === 'pending_sync'
              ? 'border-[#004a60] ring-2 ring-[#004a60]/20 bg-[#e8eeff]/20'
              : 'border-[#e3e8f9] hover:border-[#c3cce6]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#70787d]">
              {isArabic ? 'بانتظار المزامنة للمستخدم' : 'Pending Sync'}
            </span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <RefreshCw className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-lg font-extrabold text-rose-700 mt-1">{pendingSyncCount}</div>
          <span className="text-[9px] text-[#70787d]">{isArabic ? 'تعديلات تتطلب الإرسال' : 'Require user push'}</span>
        </div>
      </div>

      {/* FILTER BAR: SEARCH & STATUS PILLS */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#004a60] text-white shadow-2xs'
                  : 'bg-[#f1f3ff] text-[#40484d] hover:bg-[#e8eeff]'
              }`}
            >
              {isArabic ? 'جميع المستخدمين' : 'All Users'} ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'active'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-[#f1f3ff] text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>{isArabic ? 'المستخدمون النشطون' : 'Active Users'}</span>
              <span className="rounded-full bg-white/20 px-1.5 text-[9px]">{activeCount}</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('potential')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'potential'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-[#f1f3ff] text-amber-800 hover:bg-amber-50'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>{isArabic ? 'مستخدمون محتملون (Leads)' : 'Potential Leads'}</span>
              <span className="rounded-full bg-white/20 px-1.5 text-[9px]">{potentialCount}</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('mudabbir')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'mudabbir'
                  ? 'bg-purple-700 text-white shadow-2xs'
                  : 'bg-[#f1f3ff] text-purple-800 hover:bg-purple-50'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>{isArabic ? 'واردة من منصة مدبّر' : 'From Mudabbir'}</span>
              <span className="rounded-full bg-white/20 px-1.5 text-[9px]">{mudabbirSubmissionsCount}</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending_sync')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'pending_sync'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'bg-[#f1f3ff] text-rose-800 hover:bg-rose-50'
              }`}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{isArabic ? 'تعديلات بانتظار الإرسال' : 'Pending Sync'}</span>
              <span className="rounded-full bg-white/20 px-1.5 text-[9px]">{pendingSyncCount}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative md:w-72">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d] ${isArabic ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? 'بحث بالاسم، المنشأة، الهاتف، المدينة...' : 'Search name, company, phone...'}
              className={`w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] py-1.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden ${
                isArabic ? 'pr-8 pl-3' : 'pl-8 pr-3'
              }`}
            />
          </div>
        </div>

        {/* Secondary filters: Type and City */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#f1f3ff] text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#70787d] text-[11px]">{isArabic ? 'نوع المستخدم:' : 'User Type:'}</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="rounded-lg border border-[#c3cce6] bg-[#f9f9ff] py-1 px-2 text-[11px] font-semibold text-[#004a60] outline-hidden cursor-pointer"
            >
              <option value="all">{isArabic ? 'جميع الأنواع' : 'All Types'}</option>
              <option value="operator">{isArabic ? 'مشغلو منشآت وفنادق' : 'Operators'}</option>
              <option value="corporate">{isArabic ? 'شركات سياحية متعاقدة' : 'Corporate'}</option>
              <option value="guest">{isArabic ? 'نزلاء وعملاء أفراد' : 'Guests'}</option>
              <option value="property_owner">{isArabic ? 'ملاك ومستثمرون' : 'Property Owners'}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-[#70787d] text-[11px]">{isArabic ? 'المدينة:' : 'City:'}</span>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="rounded-lg border border-[#c3cce6] bg-[#f9f9ff] py-1 px-2 text-[11px] font-semibold text-[#004a60] outline-hidden cursor-pointer"
            >
              <option value="all">{isArabic ? 'جميع المدن' : 'All Cities'}</option>
              {citiesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: LIST TABLE VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
              <thead className="bg-[#f9f9ff] border-b border-[#e3e8f9] text-[#70787d] uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">{isArabic ? 'رمز المستخدم' : 'Code'}</th>
                  <th className="py-3 px-4">{isArabic ? 'المستخدم والمنشأة' : 'User & Entity'}</th>
                  <th className="py-3 px-4">{isArabic ? 'حالة الحساب (CRM)' : 'CRM Status'}</th>
                  <th className="py-3 px-4">{isArabic ? 'مصدر البيانات (منصة مدبّر)' : 'Data Origin (Mudabbir)'}</th>
                  <th className="py-3 px-4">{isArabic ? 'تعديلات الإدارة والمزامنة' : 'Admin Edits & Sync'}</th>
                  <th className="py-3 px-4">{isArabic ? 'العقارات والمفاتيح' : 'Capacity'}</th>
                  <th className="py-3 px-4">{isArabic ? 'المدينة والاتصال' : 'Contact & City'}</th>
                  <th className="py-3 px-4 text-center">{isArabic ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8f9]">
                {filteredProfiles.map((p) => {
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-[#f1f3ff]/60 transition-colors group cursor-pointer"
                      onClick={() => setInspectingProfile(p)}
                    >
                      {/* Code & Avatar */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-7 w-7 rounded-lg text-white font-bold text-[10px] flex items-center justify-center shrink-0 ${p.avatarColor}`}
                          >
                            {p.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-mono text-[11px] font-bold text-[#004a60] bg-[#e8eeff] px-2 py-0.5 rounded-md">
                            {p.code}
                          </span>
                        </div>
                      </td>

                      {/* User & Entity Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-xs text-[#161c27] group-hover:text-[#004a60] transition-colors leading-snug">
                          {isArabic ? p.nameAr : p.name}
                        </div>
                        <div className="text-[11px] text-[#70787d] font-semibold mt-0.5">
                          {isArabic ? p.companyNameAr : p.companyName}
                        </div>
                        <span className="inline-block mt-1 text-[9px] font-semibold px-1.5 py-0.2 rounded-md bg-[#f1f3ff] text-[#40484d]">
                          {isArabic ? p.userTypeAr : p.userType}
                        </span>
                      </td>

                      {/* CRM Status: Active vs Potential Lead */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {p.status === 'active' ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <span>{isArabic ? 'مستخدم نشط ومعتمد' : 'Active User'}</span>
                            </span>
                            <div className="text-[9px] text-emerald-700 font-medium">
                              {p.adminData.approvedTierAr || 'شريك معتمد'}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              <span>{isArabic ? 'مستخدم محتمل (Lead)' : 'Potential Lead'}</span>
                            </span>
                            <div className="text-[10px] font-extrabold text-[#004a60]">
                              SAR {(p.potentialDealValueSar || 0).toLocaleString()}
                            </div>
                            <div className="text-[9px] text-[#70787d]">
                              {isArabic ? p.leadStageAr : p.leadStage}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Data Origin: User Input from Mudabbir Platform */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 w-fit">
                          <Smartphone className="h-3 w-3 shrink-0" />
                          <span>{p.mudabbirData.sourceChannel}</span>
                        </div>
                        <div className="text-[10px] text-[#70787d] mt-1">
                          {isArabic ? 'تاريخ الإدخال:' : 'Submitted:'} {p.mudabbirData.submittedAt}
                        </div>
                        <div className="text-[9px] text-[#40484d] truncate max-w-xs mt-0.5">
                          {isArabic ? 'الطلب:' : 'Req:'} {p.mudabbirData.requestedPlan}
                        </div>
                      </td>

                      {/* Admin Modifications & Sync Status */}
                      <td className="py-3 px-4">
                        {p.syncStatus === 'synced' ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              <span>{isArabic ? 'تمت المزامنة للمستخدم' : 'Synced to User'}</span>
                            </span>
                            <div className="text-[9px] text-[#70787d]">
                              {isArabic ? 'آخر إرسال:' : 'Delivered:'} {p.lastSyncTimestamp}
                            </div>
                          </div>
                        ) : p.syncStatus === 'pending_sync_to_user' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 animate-pulse">
                              <AlertCircle className="h-3 w-3 text-rose-600" />
                              <span>{isArabic ? 'تعديلات بانتظار الإرسال' : 'Pending Push'}</span>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePushSyncToUser(p);
                              }}
                              className="block text-[10px] font-bold text-[#004a60] bg-[#e8eeff] hover:bg-[#d5e2ff] px-2 py-0.5 rounded cursor-pointer transition-colors"
                            >
                              {isArabic ? '⚡ إرسال للمستخدم الآن' : '⚡ Push to User'}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <Clock className="h-3 w-3 text-amber-600" />
                              <span>{isArabic ? 'بيانات جديدة تتطلب المراجعة' : 'Review Needed'}</span>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEdit(p);
                              }}
                              className="block text-[10px] font-bold text-[#004a60] bg-[#e8eeff] hover:bg-[#d5e2ff] px-2 py-0.5 rounded cursor-pointer"
                            >
                              {isArabic ? '✏️ مراجعة وتعديل' : '✏️ Review'}
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Capacity */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-xs text-[#161c27]">
                          {p.propertiesCount} {isArabic ? 'عقارات' : 'Properties'}
                        </div>
                        <div className="text-[10px] text-[#70787d]">
                          {p.keysCount} {isArabic ? 'مفتاح / وحدة' : 'Keys'}
                        </div>
                      </td>

                      {/* Contact & City */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-[#161c27] flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#004a60]" />
                          <span>{isArabic ? p.cityAr : p.city}</span>
                        </div>
                        <div className="text-[10px] text-[#004a60] font-mono mt-0.5">
                          {p.phone}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          {/* Convert to Active if potential */}
                          {p.status === 'potential' && (
                            <button
                              type="button"
                              onClick={() => handleConvertToActive(p.id)}
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-xs cursor-pointer flex items-center gap-1"
                              title={isArabic ? 'ترقية وتحويل إلى مستخدم نشط' : 'Convert to Active User'}
                            >
                              <UserCheck className="h-3 w-3" />
                              <span>{isArabic ? 'تفعيل' : 'Activate'}</span>
                            </button>
                          )}

                          {/* Edit / Enter Admin Data */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-[#70787d] hover:text-[#004a60] hover:bg-[#e8eeff] cursor-pointer"
                            title={isArabic ? 'تعديل البيانات وإعداد النسخة المعتمدة' : 'Edit & Admin Overrides'}
                          >
                            <Sliders className="h-3.5 w-3.5" />
                          </button>

                          {/* Quick Push Sync to User */}
                          {p.syncStatus !== 'synced' && (
                            <button
                              type="button"
                              onClick={() => handlePushSyncToUser(p)}
                              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                              title={isArabic ? 'مزامنة وإرسال للمستخدم عبر مدبّر' : 'Push to User via Mudabbir'}
                            >
                              <Send className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {/* View 360 Profile */}
                          <button
                            type="button"
                            onClick={() => setInspectingProfile(p)}
                            className="p-1.5 rounded-lg text-[#70787d] hover:text-[#004a60] hover:bg-[#e8eeff] cursor-pointer"
                            title={isArabic ? 'عرض بطاقة المستخدم والبيانات المقارنة' : 'Inspect Profile'}
                          >
                            <Eye className="h-3.5 w-3.5" />
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
      )}

      {/* VIEW MODE 2: CARDS GRID */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProfiles.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs hover:shadow-md hover:border-[#004a60]/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-[#004a60] bg-[#e8eeff] px-2 py-0.5 rounded-md">
                    {p.code}
                  </span>
                  {p.status === 'active' ? (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <UserCheck className="h-3 w-3" />
                      <span>{isArabic ? 'مستخدم نشط' : 'Active'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <UserPlus className="h-3 w-3" />
                      <span>{isArabic ? 'مستخدم محتمل' : 'Lead'}</span>
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-[#161c27]">
                  {isArabic ? p.nameAr : p.name}
                </h3>
                <div className="text-xs text-[#70787d] mt-0.5 font-medium">
                  {isArabic ? p.companyNameAr : p.companyName}
                </div>

                {/* Mudabbir Source Pill */}
                <div className="mt-3 p-2.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-purple-900 font-bold mb-1">
                    <span className="flex items-center gap-1">
                      <Smartphone className="h-3 w-3" />
                      {p.mudabbirData.sourceChannel}
                    </span>
                    <span>{p.mudabbirData.submittedAt}</span>
                  </div>
                  <div className="text-[11px] text-[#40484d]">
                    {isArabic ? 'الطلب:' : 'Req:'} <strong>{p.mudabbirData.requestedPlan}</strong> ({p.propertiesCount} {isArabic ? 'عقارات' : 'properties'})
                  </div>
                </div>

                {/* Admin Status Strip */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-[#70787d] font-bold">
                      {isArabic ? 'حالة المزامنة مع المستخدم:' : 'Sync Status:'}
                    </span>
                    {p.syncStatus === 'synced' ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-md">
                        {isArabic ? 'متزامن' : 'Synced'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.2 rounded-md">
                        {isArabic ? 'بانتظار الإرسال' : 'Pending'}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#161c27]">
                    {isArabic ? 'المسؤول:' : 'Assigned:'} <strong>{p.adminData.assignedAccountManager || 'قيد التعيين'}</strong>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-[#e3e8f9] flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(p)}
                  className="text-xs font-bold text-[#004a60] hover:underline cursor-pointer"
                >
                  {isArabic ? 'تعديل البيانات' : 'Edit Admin'}
                </button>

                <div className="flex items-center gap-1.5">
                  {p.syncStatus !== 'synced' && (
                    <button
                      type="button"
                      onClick={() => handlePushSyncToUser(p)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Send className="h-3 w-3" />
                      <span>{isArabic ? 'إرسال للمستخدم' : 'Push'}</span>
                    </button>
                  )}
                  {p.status === 'potential' && (
                    <button
                      type="button"
                      onClick={() => handleConvertToActive(p.id)}
                      className="px-2.5 py-1 rounded-lg bg-[#004a60] hover:bg-[#074e64] text-white font-bold text-[10px] shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <UserCheck className="h-3 w-3" />
                      <span>{isArabic ? 'تفعيل' : 'Activate'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: ADD USER (ACTIVE OR POTENTIAL LEAD) */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e3e8f9] my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9] mb-4">
              <div>
                <h3 className="text-base font-bold text-[#161c27]">
                  {isArabic ? 'تأسيس مستخدم جديد أو مستخدم محتمل (CRM)' : 'Create New User or Lead'}
                </h3>
                <p className="text-xs text-[#70787d]">
                  {isArabic
                    ? 'تسجيل مستخدم نشط أو إضافة عميل محتمل ضمن خط الأنابيب التسويقي مع إمكانية التحويل لاحقاً'
                    : 'Register an active client or capture a prospective lead into your CRM'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-[#70787d] hover:text-[#161c27] p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              {/* Status Switcher: Active User vs Potential User */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#e8eeff]/60 to-[#f1f3ff] border border-[#c3cce6]">
                <label className="font-bold text-[#004a60] block mb-2 text-xs">
                  {isArabic ? 'نوع التسجيل في نظام CRM *' : 'Profile Status in CRM *'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStatus('active')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      newStatus === 'active'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-[#40484d] border-[#c3cce6] hover:bg-[#e8eeff]'
                    }`}
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>{isArabic ? 'مستخدم جديد نشط (Active)' : 'New Active User'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus('potential')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      newStatus === 'potential'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-[#40484d] border-[#c3cce6] hover:bg-[#e8eeff]'
                    }`}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>{isArabic ? 'مستخدم محتمل (Lead / Prospect)' : 'Potential Lead'}</span>
                  </button>
                </div>
              </div>

              {/* User Type & Pipeline Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'تصنيف الكيان / المستخدم *' : 'User Role / Type *'}
                  </label>
                  <select
                    value={newUserType}
                    onChange={(e) => setNewUserType(e.target.value as any)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-medium"
                  >
                    <option value="operator">{isArabic ? 'مشغل منشأة فندقية (Operator)' : 'Operator'}</option>
                    <option value="corporate">{isArabic ? 'شركة وسياحة متعاقدة (Corporate)' : 'Corporate'}</option>
                    <option value="property_owner">{isArabic ? 'مالك ومستثمر عقاري (Owner)' : 'Property Owner'}</option>
                    <option value="guest">{isArabic ? 'نزيل / عميل فردي VIP (Guest)' : 'Guest VIP'}</option>
                  </select>
                </div>

                {newStatus === 'potential' ? (
                  <div>
                    <label className="font-semibold text-[#161c27] block mb-1">
                      {isArabic ? 'مرحلة العميل المحتمل (Lead Stage)' : 'Pipeline Stage'}
                    </label>
                    <select
                      value={newLeadStage}
                      onChange={(e) => setNewLeadStage(e.target.value as any)}
                      className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-medium"
                    >
                      <option value="new_lead">{isArabic ? 'مستخدم محتمل جديد (New Lead)' : 'New Lead'}</option>
                      <option value="contacted">{isArabic ? 'تم التواصل المبدئي (Contacted)' : 'Contacted'}</option>
                      <option value="under_review">{isArabic ? 'قيد المراجعة وتعديل العرض' : 'Under Review'}</option>
                      <option value="proposal_sent">{isArabic ? 'تم إرسال العرض المالي' : 'Proposal Sent'}</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="font-semibold text-[#161c27] block mb-1">
                      {isArabic ? 'قناة التسجيل (Source Channel)' : 'Intake Source'}
                    </label>
                    <select
                      value={newSourceChannel}
                      onChange={(e) => setNewSourceChannel(e.target.value as any)}
                      className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-medium"
                    >
                      <option value="Mudabbir Web Portal">Mudabbir Web Portal (بوابة مدبّر الإلكترونية)</option>
                      <option value="Mudabbir Mobile App">Mudabbir Mobile App (تطبيق مدبّر)</option>
                      <option value="Self-Registration Form">Direct Registration (تسجيل مباشر)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'اسم المستخدم / جهة الاتصال *' : 'Full Name (Contact) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Sultan Al-Harbi"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'اسم المنشأة / الشركة *' : 'Company / Entity Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="مثال: شركة شاليهات الواحة الفندقية"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
              </div>

              {/* Phone, Email & City */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'رقم الجوال *' : 'Phone *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="client@domain.sa"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'المدينة' : 'City'}
                  </label>
                  <select
                    value={newCity}
                    onChange={(e) => {
                      setNewCity(e.target.value);
                      setNewCityAr(
                        e.target.value === 'Riyadh' ? 'الرياض' : e.target.value === 'Jeddah' ? 'جدة' : e.target.value === 'Makkah' ? 'مكة المكرمة' : 'المدينة المنورة'
                      );
                    }}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  >
                    <option value="Riyadh">Riyadh (الرياض)</option>
                    <option value="Jeddah">Jeddah (جدة)</option>
                    <option value="Makkah">Makkah (مكة المكرمة)</option>
                    <option value="Madinah">Madinah (المدينة المنورة)</option>
                    <option value="AlUla">AlUla (العلا)</option>
                    <option value="Al Khobar">Al Khobar (الخبر)</option>
                  </select>
                </div>
              </div>

              {/* Deal Value & Properties */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'عدد العقارات التابعة' : 'Properties Count'}
                  </label>
                  <input
                    type="number"
                    value={newPropertiesCount}
                    onChange={(e) => setNewPropertiesCount(e.target.value)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'عدد الوحدات / المفاتيح' : 'Keys / Units'}
                  </label>
                  <input
                    type="number"
                    value={newKeysCount}
                    onChange={(e) => setNewKeysCount(e.target.value)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'قيمة العقد المتوقعة (SAR)' : 'Estimated Deal Value'}
                  </label>
                  <input
                    type="number"
                    value={newPotentialValue}
                    onChange={(e) => setNewPotentialValue(e.target.value)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-mono text-[#004a60] font-bold"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-semibold text-[#161c27] block mb-1">
                  {isArabic ? 'ملاحظات المستخدم / تفاصيل الطلب الوارد من مدبّر' : 'User Notes / Intake Details'}
                </label>
                <textarea
                  rows={2}
                  value={newUserNotes}
                  onChange={(e) => setNewUserNotes(e.target.value)}
                  placeholder={isArabic ? 'تفاصيل الخدمات المطلوبة، الأجهزة الذكية، أو شروط التعاقد...' : 'Requested services...'}
                  className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3e8f9]">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#c3cce6] text-[#70787d] hover:bg-[#f9f9ff] font-semibold"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>
                    {isArabic
                      ? newStatus === 'active'
                        ? 'تأسيس المستخدم النشط'
                        : 'تسجيل المستخدم المحتمل'
                      : 'Create Profile'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ADMIN DATA & SYNC PUSH TO USER VIA MUDABBIR */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#e3e8f9] my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9] mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#004a60] text-white">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#161c27]">
                    {isArabic
                      ? `مراجعة وتعديل بيانات المستخدم: ${editingProfile.nameAr}`
                      : `Edit & Push Data for: ${editingProfile.name}`}
                  </h3>
                  <p className="text-xs text-[#70787d]">
                    {isArabic
                      ? 'يمكنك إدخال وتعديل البيانات الإدارية، واعتماد العروض، وإرسال البيانات المعدلة للمستخدم عبر منصة مدبّر'
                      : 'Modify internal terms, approve pricing, and push updated data to user in Mudabbir portal.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingProfile(null)}
                className="text-[#70787d] hover:text-[#161c27] p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Comparison banner: User Input vs Admin Output */}
            <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 mb-4 text-xs">
              <div className="flex items-center justify-between font-bold text-purple-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>{isArabic ? 'البيانات المدخلة من قبل المستخدم عبر مدبّر:' : 'User Submitted Data via Mudabbir:'}</span>
                </span>
                <span className="font-mono text-[10px]">{editingProfile.mudabbirData.submittedAt}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[#40484d] mt-2">
                <div>
                  <span className="text-[10px] text-[#70787d] block">{isArabic ? 'المنشأة:' : 'Company:'}</span>
                  <span className="font-semibold">{editingProfile.mudabbirData.companyName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#70787d] block">{isArabic ? 'الباقة المطلوبة:' : 'Requested:'}</span>
                  <span className="font-semibold text-purple-800">{editingProfile.mudabbirData.requestedPlan}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#70787d] block">{isArabic ? 'السجل التجاري:' : 'CR Number:'}</span>
                  <span className="font-mono">{editingProfile.mudabbirData.crNumber || 'غير مرفق'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#70787d] block">{isArabic ? 'الوحدات:' : 'Units:'}</span>
                  <span className="font-bold">{editingProfile.mudabbirData.keysCount} مفتاح</span>
                </div>
              </div>
              {editingProfile.mudabbirData.userNotes && (
                <div className="mt-2 pt-2 border-t border-purple-200/60 text-[10px] text-purple-900 italic">
                  "{editingProfile.mudabbirData.userNotes}"
                </div>
              )}
            </div>

            {/* Admin Modification Fields */}
            <div className="space-y-3 text-xs">
              <div className="font-bold text-[#161c27] flex items-center gap-1.5 border-b border-[#e3e8f9] pb-1">
                <ShieldCheck className="h-4 w-4 text-[#004a60]" />
                <span>{isArabic ? 'تعديلات واعتمادات الإدارة (البيانات التي ستُمنح للمستخدم):' : 'Admin Modifications & Overrides:'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'المستوى المعتمد (Tier) *' : 'Approved Tier *'}
                  </label>
                  <select
                    value={editTier}
                    onChange={(e) => setEditTier(e.target.value)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-medium"
                  >
                    <option value="VIP Platinum">VIP Platinum (بلاتيني استراتيجي)</option>
                    <option value="Gold Enterprise">Gold Enterprise (شريك ذهبي)</option>
                    <option value="Silver Partner">Silver Partner (شريك فضي)</option>
                    <option value="Standard Operator">Standard Operator (مشغل قياسي)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'الخطة الفندقية المعتمدة' : 'Approved Plan'}
                  </label>
                  <input
                    type="text"
                    value={editPlan}
                    onChange={(e) => setEditPlan(e.target.value)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'خصم مخصص للمستخدم (%)' : 'Custom Discount %'}
                  </label>
                  <input
                    type="number"
                    value={editDiscount}
                    onChange={(e) => setEditDiscount(e.target.value)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-mono font-bold text-[#004a60]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'مدير الحساب المعين' : 'Account Manager'}
                  </label>
                  <input
                    type="text"
                    value={editManager}
                    onChange={(e) => setEditManager(e.target.value)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'هاتف مدير الحساب' : 'Manager Phone'}
                  </label>
                  <input
                    type="text"
                    value={editManagerPhone}
                    onChange={(e) => setEditManagerPhone(e.target.value)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'سقف الائتمان (SAR)' : 'Credit Limit SAR'}
                  </label>
                  <input
                    type="number"
                    value={editCreditLimit}
                    onChange={(e) => setEditCreditLimit(e.target.value)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#161c27] block mb-1">
                  {isArabic ? 'الشروط الخاصة الممنوحة للمستخدم (Custom Terms)' : 'Special Terms for User:'}
                </label>
                <input
                  type="text"
                  value={editCustomTerms}
                  onChange={(e) => setEditCustomTerms(e.target.value)}
                  placeholder={isArabic ? 'مثال: تسوية شهرية مع إعفاء رسوم ربط أول 30 قفل ذكي...' : 'Custom terms...'}
                  className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-[#161c27] block mb-1">
                  {isArabic ? 'ملاحظات وتدقيق الإدارة الداخلي' : 'Internal Admin Notes'}
                </label>
                <textarea
                  rows={2}
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  placeholder={isArabic ? 'ملاحظات داخلية لا تظهر للمستخدم...' : 'Internal audit log...'}
                  className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#e3e8f9] flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setEditingProfile(null)}
                className="px-4 py-2 rounded-xl border border-[#c3cce6] text-[#70787d] hover:bg-[#f9f9ff] text-xs font-semibold cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveAdminData(false)}
                  className="px-4 py-2 rounded-xl border border-[#004a60] text-[#004a60] hover:bg-[#e8eeff] text-xs font-bold transition-all cursor-pointer"
                >
                  {isArabic ? 'حفظ التعديلات داخلياً' : 'Save Internally'}
                </button>

                {/* THE CORE USER REQUIREMENT: PUSH AND GIVE UPDATED DATA TO THE USER VIA MUDABBIR */}
                <button
                  type="button"
                  onClick={() => handleSaveAdminData(true)}
                  className="px-5 py-2 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  <span>{isArabic ? '⚡ حفظ وإرسال البيانات المعدلة للمستخدم عبر مدبّر' : '⚡ Save & Push to User via Mudabbir'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: 360 INSPECTION PROFILE CARD */}
      {inspectingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#e3e8f9] my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9] mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-xl text-white font-bold text-sm flex items-center justify-center shrink-0 ${inspectingProfile.avatarColor}`}
                >
                  {inspectingProfile.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#161c27]">
                    {isArabic ? inspectingProfile.nameAr : inspectingProfile.name}
                  </h3>
                  <div className="text-xs text-[#70787d] font-semibold mt-0.5">
                    {isArabic ? inspectingProfile.companyNameAr : inspectingProfile.companyName} • {inspectingProfile.code}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectingProfile(null)}
                className="text-[#70787d] hover:text-[#161c27] p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Dual Data Display: User Submitted vs Admin Approved */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs">
              {/* Box 1: User Input via Mudabbir */}
              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-purple-900 flex items-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>{isArabic ? 'مدخلة من المستخدم (منصة مدبّر)' : 'User-Entered via Mudabbir'}</span>
                  </span>
                  <span className="text-[10px] text-purple-700 font-mono">
                    {inspectingProfile.mudabbirData.submittedAt}
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-[#40484d]">
                  <div>
                    <span className="text-[10px] text-[#70787d]">{isArabic ? 'الاسم والشركة:' : 'Name/Company:'}</span>{' '}
                    <strong>{inspectingProfile.mudabbirData.fullName}</strong> ({inspectingProfile.mudabbirData.companyName})
                  </div>
                  <div>
                    <span className="text-[10px] text-[#70787d]">{isArabic ? 'الهاتف والبريد:' : 'Contact:'}</span>{' '}
                    <span className="font-mono text-[#004a60]">{inspectingProfile.mudabbirData.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#70787d]">{isArabic ? 'السجل والضريبة:' : 'CR / Tax:'}</span>{' '}
                    <span className="font-mono">{inspectingProfile.mudabbirData.crNumber || 'قيد الرفع'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#70787d]">{isArabic ? 'الباقة المطلوبة:' : 'Requested Plan:'}</span>{' '}
                    <strong className="text-purple-800">{inspectingProfile.mudabbirData.requestedPlan}</strong>
                  </div>
                  {inspectingProfile.mudabbirData.userNotes && (
                    <div className="p-2 bg-white/80 rounded-lg border border-purple-200 text-[10px] text-purple-950 mt-2 italic">
                      "{inspectingProfile.mudabbirData.userNotes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Box 2: Admin Overrides & Synced to User */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#e8eeff]/60 to-[#f1f3ff] border border-[#c3cce6]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#004a60] flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{isArabic ? 'البيانات المعدلة من الإدارة' : 'Admin Approved & Overrides'}</span>
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {inspectingProfile.adminData.verificationStatusAr || 'موثق'}
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-[#40484d]">
                  <div>
                    <span className="text-[10px] text-[#70787d]">{isArabic ? 'المستوى المعتمد:' : 'Approved Tier:'}</span>{' '}
                    <strong className="text-[#004a60]">{inspectingProfile.adminData.approvedTierAr || 'شريك معتمد'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#70787d]">{isArabic ? 'الخصم الممنوح:' : 'Discount:'}</span>{' '}
                    <strong className="text-emerald-700">{inspectingProfile.adminData.customDiscountPercent || 0}% خصم سنوي</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#70787d]">{isArabic ? 'مدير الحساب:' : 'Manager:'}</span>{' '}
                    <strong>{inspectingProfile.adminData.assignedAccountManager || 'قيد التعيين'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#70787d]">{isArabic ? 'سقف الائتمان:' : 'Credit:'}</span>{' '}
                    <span className="font-mono font-bold text-[#161c27]">
                      SAR {(inspectingProfile.adminData.creditLimitSar || 0).toLocaleString()}
                    </span>
                  </div>
                  {inspectingProfile.adminData.adminCustomTerms && (
                    <div className="p-2 bg-white/80 rounded-lg border border-[#c3cce6] text-[10px] text-[#004a60] mt-2 font-medium">
                      {inspectingProfile.adminData.adminCustomTerms}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sync Timestamp and Actions */}
            <div className="p-3 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9] flex items-center justify-between text-xs mb-4">
              <div>
                <span className="text-[10px] text-[#70787d] block font-semibold">
                  {isArabic ? 'حالة وصول البيانات لحساب المستخدم في مدبّر:' : 'Mudabbir User Sync Status:'}
                </span>
                <span className="font-bold text-xs text-[#161c27]">
                  {isArabic ? inspectingProfile.syncStatusAr : inspectingProfile.syncStatus}
                  {inspectingProfile.lastSyncTimestamp && ` (${inspectingProfile.lastSyncTimestamp})`}
                </span>
              </div>

              {inspectingProfile.syncStatus !== 'synced' ? (
                <button
                  type="button"
                  onClick={() => {
                    handlePushSyncToUser(inspectingProfile);
                    setInspectingProfile((prev) => prev ? { ...prev, syncStatus: 'synced', syncStatusAr: 'تمت المزامنة للمستخدم بنجاح' } : null);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isArabic ? 'مزامنة وإرسال للمستخدم الآن' : 'Push to User'}</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isArabic ? 'البيانات محدثة لدى المستخدم' : 'Up to date on User Portal'}</span>
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3e8f9]">
              <button
                type="button"
                onClick={() => {
                  const p = inspectingProfile;
                  setInspectingProfile(null);
                  handleOpenEdit(p);
                }}
                className="px-4 py-2 rounded-xl bg-[#004a60] text-white text-xs font-bold hover:bg-[#074e64] cursor-pointer flex items-center gap-1.5"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>{isArabic ? 'تعديل البيانات الإدارية' : 'Edit Overrides'}</span>
              </button>
              <button
                type="button"
                onClick={() => setInspectingProfile(null)}
                className="px-4 py-2 rounded-xl border border-[#c3cce6] text-[#70787d] hover:bg-[#f9f9ff] text-xs font-semibold cursor-pointer"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
