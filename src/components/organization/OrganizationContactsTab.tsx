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
  MessageSquare,
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
  UserX,
  Tag,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';
import {
  OrgContact,
  ContactAffiliation,
  EmploymentStatus,
  OrganizationBranch,
  INITIAL_ORGANIZATION_HQ,
} from '../../data/organizationData';
import {
  HOSPITALITY_ORGANIZATIONS,
  HospitalityOrganization,
} from '../../data/hospitalityData';
import {
  MultichannelDispatchModal,
  RecipientProfile,
  CommunicationChannel,
} from '../MultichannelDispatchModal';

interface OrganizationContactsTabProps {
  isArabic: boolean;
  contacts: OrgContact[];
  branches: OrganizationBranch[];
  onUpdateContact?: (updatedContact: OrgContact) => void;
  onAddContact?: (newContact: OrgContact) => void;
}

export const OrganizationContactsTab: React.FC<OrganizationContactsTabProps> = ({
  isArabic,
  contacts,
  branches,
  onUpdateContact,
  onAddContact,
}) => {
  const [internalContacts, setInternalContacts] = useState<OrgContact[]>(contacts);
  const activeContacts = contacts.length > 0 ? contacts : internalContacts;

  // View Mode: Defaults to 'list' (List Table View) as explicitly requested by user
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');

  // Filter states
  const [employmentFilter, setEmploymentFilter] = useState<'all' | EmploymentStatus>('all');
  const [affiliationFilter, setAffiliationFilter] = useState<'all' | ContactAffiliation>('all');
  const [orgFilter, setOrgFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected contact for Full Profile Inspection Drawer/Modal
  const [inspectingContact, setInspectingContact] = useState<OrgContact | null>(null);

  // Selected contact for Assign Branches Modal
  const [branchAssignContact, setBranchAssignContact] = useState<OrgContact | null>(null);
  const [tempAssignedBranchIds, setTempAssignedBranchIds] = useState<string[]>([]);

  // Add Contact / Employee Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNameAr, setNewNameAr] = useState('');
  const [newAffiliation, setNewAffiliation] = useState<ContactAffiliation>('internal');
  const [newEmploymentStatus, setNewEmploymentStatus] = useState<EmploymentStatus>('Current Employee');
  const [newSelectedOrgId, setNewSelectedOrgId] = useState<string>('ORG-KHETAT-HQ');
  const [newCustomOrgName, setNewCustomOrgName] = useState('');
  const [newDepartment, setNewDepartment] = useState('Hotel Operations');
  const [newRole, setNewRole] = useState('');
  const [newRoleAr, setNewRoleAr] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('Riyadh');
  const [newStartDate, setNewStartDate] = useState('Jan 2024');
  const [newEndDate, setNewEndDate] = useState('');
  const [newNationalId, setNewNationalId] = useState('');
  const [newAssignedBranches, setNewAssignedBranches] = useState<string[]>(['br-1']);
  const [newNotes, setNewNotes] = useState('');

  // Multichannel Dispatch state
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchChannel, setDispatchChannel] = useState<CommunicationChannel>('whatsapp');
  const [selectedContactIdsForDispatch, setSelectedContactIdsForDispatch] = useState<string[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
    showToast(isArabic ? `تم نسخ ${label}` : `Copied ${label} to clipboard`);
  };

  // Distinct departments for filter
  const departmentsList = useMemo(() => {
    const set = new Set<string>();
    activeContacts.forEach((c) => {
      if (c.department) set.add(c.department);
    });
    return Array.from(set);
  }, [activeContacts]);

  // Filter contacts
  const filteredContacts = useMemo(() => {
    return activeContacts.filter((c) => {
      // Employment status filter (Current vs Previously Worked / Former)
      const matchEmployment =
        employmentFilter === 'all' || c.employmentStatus === employmentFilter;

      // Affiliation filter
      const matchAffiliation =
        affiliationFilter === 'all' || c.affiliation === affiliationFilter;

      // Organization filter
      const matchOrg =
        orgFilter === 'all' ||
        c.organizationId === orgFilter ||
        c.organizationName.toLowerCase().includes(orgFilter.toLowerCase());

      // Branch filter
      const matchBranch =
        branchFilter === 'all' || c.assignedBranchIds.includes(branchFilter);

      // Department filter
      const matchDepartment =
        departmentFilter === 'all' || c.department === departmentFilter;

      // Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.nameAr.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.roleAr.includes(q) ||
        c.organizationName.toLowerCase().includes(q) ||
        c.organizationNameAr.includes(q) ||
        c.department.toLowerCase().includes(q) ||
        (c.nationalIdMasked && c.nationalIdMasked.includes(q));

      return (
        matchEmployment &&
        matchAffiliation &&
        matchOrg &&
        matchBranch &&
        matchDepartment &&
        matchSearch
      );
    });
  }, [
    activeContacts,
    employmentFilter,
    affiliationFilter,
    orgFilter,
    branchFilter,
    departmentFilter,
    searchQuery,
  ]);

  // Statistical KPIs
  const stats = useMemo(() => {
    const total = activeContacts.length;
    const currentEmployees = activeContacts.filter(
      (c) => c.employmentStatus === 'Current Employee' || !c.employmentStatus
    ).length;
    const previouslyWorked = activeContacts.filter(
      (c) => c.employmentStatus === 'Previously Worked' || c.status === 'Former'
    ).length;
    const clientOrgEmployees = activeContacts.filter(
      (c) => c.affiliation === 'client_organization'
    ).length;
    const nafathVerifiedCount = activeContacts.filter((c) => c.nafathVerified).length;

    return {
      total,
      currentEmployees,
      previouslyWorked,
      clientOrgEmployees,
      nafathVerifiedCount,
    };
  }, [activeContacts]);

  // Open Assign Branches Modal
  const handleOpenAssignBranches = (contact: OrgContact) => {
    setBranchAssignContact(contact);
    setTempAssignedBranchIds([...contact.assignedBranchIds]);
  };

  const handleSaveAssignedBranches = () => {
    if (!branchAssignContact) return;

    const updated: OrgContact = {
      ...branchAssignContact,
      assignedBranchIds: tempAssignedBranchIds,
    };

    if (onUpdateContact) {
      onUpdateContact(updated);
    } else {
      setInternalContacts((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
    }

    setBranchAssignContact(null);
    showToast(
      isArabic
        ? `تم تحديث الفروع المسندة لـ ${branchAssignContact.nameAr} بنجاح`
        : `Updated assigned branches for ${branchAssignContact.name}`
    );
  };

  const handleToggleBranchCheck = (branchId: string) => {
    setTempAssignedBranchIds((prev) =>
      prev.includes(branchId) ? prev.filter((id) => id !== branchId) : [...prev, branchId]
    );
  };

  // Handle Add Contact / Employee
  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const initials = newName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    // Resolve organization metadata
    let selectedOrgName = 'Khetat Hospitality Hub & Operations Ltd.';
    let selectedOrgNameAr = 'شركة خطط للضيافة وتقنية العمليات الفندقية';

    if (newAffiliation === 'client_organization') {
      const foundOrg = HOSPITALITY_ORGANIZATIONS.find((o) => o.id === newSelectedOrgId);
      if (foundOrg) {
        selectedOrgName = foundOrg.name;
        selectedOrgNameAr = foundOrg.nameAr;
      }
    } else if (newAffiliation === 'external' || newAffiliation === 'independent') {
      selectedOrgName = newCustomOrgName || (newAffiliation === 'independent' ? 'Independent Advisory' : 'External Partner');
      selectedOrgNameAr = newCustomOrgName || (newAffiliation === 'independent' ? 'مكتب استشارات مستقل' : 'جهة خارجية');
    }

    const created: OrgContact = {
      id: `ct-${Date.now()}`,
      name: newName,
      nameAr: newNameAr || newName,
      initials: initials || 'EMP',
      affiliation: newAffiliation,
      organizationId: newSelectedOrgId,
      organizationName: selectedOrgName,
      organizationNameAr: selectedOrgNameAr,
      department: newDepartment,
      departmentAr: isArabic ? newDepartment : newDepartment,
      employmentStatus: newEmploymentStatus,
      employmentStatusAr:
        newEmploymentStatus === 'Current Employee'
          ? 'موظف حالي'
          : newEmploymentStatus === 'Previously Worked'
          ? 'موظف سابق (عمل بالمنشأة)'
          : 'مستشار / متعاقد',
      tenureYears: newEmploymentStatus === 'Current Employee' ? `Since ${newStartDate}` : `${newStartDate} – ${newEndDate || '2025'}`,
      startDate: newStartDate,
      endDate: newEndDate || undefined,
      role: newRole || 'Hospitality Specialist',
      roleAr: newRoleAr || newRole || 'أخصائي ضيافة',
      email: newEmail || `contact_${Date.now()}@hospitality.sa`,
      phone: newPhone || '+966 50 000 0000',
      city: newCity,
      assignedBranchIds: newAssignedBranches,
      nafathVerified: true,
      nationalIdMasked: newNationalId ? `${newNationalId.slice(0, 4)}****${newNationalId.slice(-2)}` : '1088****91',
      status: newEmploymentStatus === 'Previously Worked' ? 'Former' : 'Active',
      avatarColor:
        newAffiliation === 'internal'
          ? 'bg-[#004a60]'
          : newAffiliation === 'client_organization'
          ? 'bg-emerald-800'
          : newAffiliation === 'external'
          ? 'bg-purple-800'
          : 'bg-slate-700',
      notes: newNotes,
      notesAr: newNotes,
    };

    if (onAddContact) {
      onAddContact(created);
    } else {
      setInternalContacts((prev) => [created, ...prev]);
    }

    setIsAddModalOpen(false);
    setNewName('');
    setNewNameAr('');
    setNewRole('');
    setNewRoleAr('');
    setNewEmail('');
    setNewPhone('');
    setNewCustomOrgName('');
    setNewNotes('');
    showToast(
      isArabic
        ? `تمت إضافة الكادر / الموظف ${created.nameAr} بنجاح`
        : `Added employee ${created.name} successfully`
    );
  };

  // Recipient profiles for multichannel dispatch
  const recipientProfiles: RecipientProfile[] = activeContacts.map((c) => ({
    id: c.id,
    name: c.name,
    nameAr: c.nameAr,
    company: c.organizationName,
    companyAr: c.organizationNameAr,
    email: c.email,
    phone: c.phone,
    role: c.role,
    city: c.city,
  }));

  const handleOpenDispatch = (channel: CommunicationChannel, contactId?: string) => {
    setDispatchChannel(channel);
    setSelectedContactIdsForDispatch(
      contactId
        ? [contactId]
        : selectedContactIdsForDispatch.length > 0
        ? selectedContactIdsForDispatch
        : activeContacts.map((c) => c.id)
    );
    setIsDispatchModalOpen(true);
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

      {/* Top Banner Card: Key Metrics and Actions */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base font-bold text-[#161c27] flex items-center gap-2">
              <Users className="h-5 w-5 text-[#004a60]" />
              <span>
                {isArabic
                  ? 'دليل جهات الاتصال وكوادر المؤسسات'
                  : 'Organizations Workforce & Contacts Directory'}
              </span>
            </h2>
            <span className="text-[10px] font-bold bg-[#e8eeff] text-[#004a60] px-2.5 py-0.5 rounded-full border border-[#004a60]/20">
              {stats.total} {isArabic ? 'شخص / كادر' : 'Total Personnel'}
            </span>
          </div>
          <p className="text-xs text-[#70787d] mt-1 max-w-2xl leading-relaxed">
            {isArabic
              ? 'سجل الموظفين والكوادر الحالية ومن عملوا سابقاً في المؤسسات المشتركة والمنصة، مع تتبع الفروع المسندة والامتثال عبر نفاذ الوطني.'
              : 'Directory of current employees, personnel who worked in client organizations, external delegates, and independent advisors with multi-branch assignments.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {/* View Mode Switcher (List Table View vs Cards View) */}
          <div className="flex items-center rounded-xl bg-[#f1f3ff] p-1 border border-[#e3e8f9]">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[#004a60] shadow-2xs'
                  : 'text-[#70787d] hover:text-[#161c27]'
              }`}
              title={isArabic ? 'عرض الجدول والقائمة' : 'List Table View'}
            >
              <List className="h-3.5 w-3.5" />
              <span>{isArabic ? 'جدول' : 'List Table'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-[#004a60] shadow-2xs'
                  : 'text-[#70787d] hover:text-[#161c27]'
              }`}
              title={isArabic ? 'عرض البطاقات' : 'Cards Grid View'}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>{isArabic ? 'بطاقات' : 'Cards'}</span>
            </button>
          </div>

          {/* Quick Multichannel Batch Triggers */}
          <button
            type="button"
            onClick={() => handleOpenDispatch('whatsapp')}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isArabic ? 'واتساب' : 'WhatsApp'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenDispatch('email')}
            className="flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            <Mail className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isArabic ? 'بريد' : 'Email'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white px-4 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{isArabic ? 'إضافة موظف / كادر' : 'Add Employee / Contact'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-[#e3e8f9] p-3 shadow-2xs flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] text-[#70787d] font-semibold">
              {isArabic ? 'الموظفون الحاليون' : 'Current Employees'}
            </div>
            <div className="text-base font-bold text-[#161c27]">
              {stats.currentEmployees} <span className="text-[10px] text-emerald-600 font-semibold">{isArabic ? 'نشط' : 'Active'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e3e8f9] p-3 shadow-2xs flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] text-[#70787d] font-semibold">
              {isArabic ? 'من عملوا بالمؤسسات سابقاً' : 'Previously Worked (Alumni)'}
            </div>
            <div className="text-base font-bold text-[#161c27]">
              {stats.previouslyWorked} <span className="text-[10px] text-slate-500 font-semibold">{isArabic ? 'سجل تاريخي' : 'Historical'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e3e8f9] p-3 shadow-2xs flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] text-[#70787d] font-semibold">
              {isArabic ? 'كوادر المؤسسات المشتركة' : 'Subscribed Org Staff'}
            </div>
            <div className="text-base font-bold text-[#161c27]">
              {stats.clientOrgEmployees} <span className="text-[10px] text-purple-600 font-semibold">{isArabic ? 'عملاء' : 'Clients'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e3e8f9] p-3 shadow-2xs flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] text-[#70787d] font-semibold">
              {isArabic ? 'تحقق نفاذ الوطني' : 'Nafath Verified'}
            </div>
            <div className="text-base font-bold text-[#161c27]">
              {stats.nafathVerifiedCount} <span className="text-[10px] text-blue-600 font-semibold">{isArabic ? 'موثق' : 'Verified'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] p-3.5 shadow-2xs space-y-3">
        {/* Row 1: Quick Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setEmploymentFilter('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              employmentFilter === 'all'
                ? 'bg-[#004a60] text-white shadow-2xs'
                : 'bg-[#f1f3ff] text-[#40484d] hover:bg-[#e8eeff]'
            }`}
          >
            {isArabic ? 'جميع الكوادر' : 'All Personnel'} ({stats.total})
          </button>

          <button
            type="button"
            onClick={() => setEmploymentFilter('Current Employee')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              employmentFilter === 'Current Employee'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <UserCheck className="h-3 w-3" />
            <span>{isArabic ? 'الموظفون الحاليون' : 'Current Employees'}</span> ({stats.currentEmployees})
          </button>

          <button
            type="button"
            onClick={() => setEmploymentFilter('Previously Worked')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              employmentFilter === 'Previously Worked'
                ? 'bg-slate-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <Clock className="h-3 w-3" />
            <span>{isArabic ? 'من عملوا بالمؤسسة سابقاً' : 'Previously Worked (Alumni)'}</span> ({stats.previouslyWorked})
          </button>

          <button
            type="button"
            onClick={() => setEmploymentFilter('Advisor')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              employmentFilter === 'Advisor'
                ? 'bg-purple-800 text-white shadow-2xs'
                : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Shield className="h-3 w-3" />
            <span>{isArabic ? 'مستشارون وجهات تنظيمية' : 'Advisors & Inspectors'}</span>
          </button>
        </div>

        {/* Row 2: Detailed Dropdowns & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-[#e3e8f9]">
          {/* Organization Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#70787d] font-semibold whitespace-nowrap">
              {isArabic ? 'المؤسسة:' : 'Organization:'}
            </span>
            <select
              value={orgFilter}
              onChange={(e) => setOrgFilter(e.target.value)}
              className="w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] py-1.5 px-2.5 text-xs font-medium text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden cursor-pointer"
            >
              <option value="all">{isArabic ? 'كافة المؤسسات' : 'All Organizations'}</option>
              <option value="ORG-KHETAT-HQ">{isArabic ? 'شركة خطط (المقر الرئيسي)' : 'Khetat Hospitality HQ'}</option>
              {HOSPITALITY_ORGANIZATIONS.map((org) => (
                <option key={org.id} value={org.id}>
                  {isArabic ? org.nameAr : org.name}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#70787d] font-semibold whitespace-nowrap">
              {isArabic ? 'الفرع:' : 'Branch:'}
            </span>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] py-1.5 px-2.5 text-xs font-medium text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden cursor-pointer"
            >
              <option value="all">{isArabic ? 'جميع الفروع' : 'All Branches'}</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {isArabic ? b.nameAr : b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#70787d] font-semibold whitespace-nowrap">
              {isArabic ? 'القسم:' : 'Dept:'}
            </span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] py-1.5 px-2.5 text-xs font-medium text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden cursor-pointer"
            >
              <option value="all">{isArabic ? 'كافة الأقسام' : 'All Departments'}</option>
              {departmentsList.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d] ${
                isArabic ? 'right-3' : 'left-3'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? 'بحث بالاسم، المؤسسة، الدور...' : 'Search name, org, role...'}
              className={`w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] py-1.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden ${
                isArabic ? 'pr-8 pl-2.5' : 'pl-8 pr-2.5'
              }`}
            />
          </div>
        </div>
      </div>

      {/* LIST TABLE VIEW (The User's Primary Request) */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse" dir={isArabic ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="bg-[#f9f9ff] text-[#40484d] border-b border-[#e3e8f9] font-bold text-[11px]">
                  <th className="py-3 px-3.5">{isArabic ? 'الموظف / الشخص' : 'Employee / Person'}</th>
                  <th className="py-3 px-3.5">{isArabic ? 'المؤسسة والجهة' : 'Organization & Entity'}</th>
                  <th className="py-3 px-3.5">{isArabic ? 'المسمى والقسم' : 'Role & Department'}</th>
                  <th className="py-3 px-3.5">{isArabic ? 'الحالة الوظيفية' : 'Employment Status'}</th>
                  <th className="py-3 px-3.5">{isArabic ? 'الفروع المسندة' : 'Assigned Branches'}</th>
                  <th className="py-3 px-3.5">{isArabic ? 'وسائل الاتصال' : 'Direct Coordinates'}</th>
                  <th className="py-3 px-3.5 text-center">{isArabic ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8f9]">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-xs text-[#70787d]">
                      {isArabic ? 'لا توجد نتائج مطابقة لمعايير البحث' : 'No contacts matching criteria.'}
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => {
                    const assignedBranchesList = branches.filter((b) =>
                      contact.assignedBranchIds.includes(b.id)
                    );

                    const isCurrent = contact.employmentStatus === 'Current Employee' || contact.status === 'Active';
                    const isFormer = contact.employmentStatus === 'Previously Worked' || contact.status === 'Former';

                    return (
                      <tr
                        key={contact.id}
                        className="hover:bg-[#f9f9ff] transition-colors group cursor-pointer"
                        onClick={() => setInspectingContact(contact)}
                      >
                        {/* 1. Employee / Person */}
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`h-9 w-9 rounded-xl text-white font-bold flex items-center justify-center shrink-0 shadow-2xs text-xs relative ${contact.avatarColor}`}
                            >
                              {contact.initials}
                              {/* Employment dot indicator */}
                              <span
                                className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                                  isFormer
                                    ? 'bg-slate-400'
                                    : 'bg-emerald-500'
                                }`}
                              />
                            </div>
                            <div>
                              <div className="font-bold text-[#161c27] group-hover:text-[#004a60] transition-colors flex items-center gap-1.5">
                                <span>{isArabic ? contact.nameAr : contact.name}</span>
                                {contact.nafathVerified && (
                                  <span
                                    title="Nafath ID Verified"
                                    className="inline-flex items-center text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded text-[9px] font-bold border border-emerald-200"
                                  >
                                    <ShieldCheck className="h-2.5 w-2.5 mr-0.5" />
                                    <span>Nafath</span>
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-[#70787d] font-mono mt-0.5">
                                {contact.nationalIdMasked || '1088****91'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Organization & Entity */}
                        <td className="py-3 px-3.5">
                          <div className="font-semibold text-[#161c27] flex items-center gap-1.5">
                            <Building2 className="h-3 w-3 text-[#004a60] shrink-0" />
                            <span className="truncate max-w-[190px]">
                              {isArabic ? contact.organizationNameAr : contact.organizationName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                contact.affiliation === 'internal'
                                  ? 'bg-[#e8eeff] text-[#004a60]'
                                  : contact.affiliation === 'client_organization'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : contact.affiliation === 'external'
                                  ? 'bg-purple-50 text-purple-800 border border-purple-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {contact.affiliation === 'internal'
                                ? isArabic
                                  ? 'المنصة (HQ)'
                                  : 'Host HQ'
                                : contact.affiliation === 'client_organization'
                                ? isArabic
                                  ? 'مؤسسة مشتركة'
                                  : 'Subscribed Org'
                                : contact.affiliation === 'external'
                                ? isArabic
                                  ? 'جهة شريكة'
                                  : 'External Partner'
                                : isArabic
                                ? 'مستقل'
                                : 'Independent'}
                            </span>
                            <span className="text-[10px] text-[#70787d]">
                              • {contact.city}
                            </span>
                          </div>
                        </td>

                        {/* 3. Role & Department */}
                        <td className="py-3 px-3.5">
                          <div className="font-semibold text-[#004a60]">
                            {isArabic ? contact.roleAr : contact.role}
                          </div>
                          <div className="text-[10px] text-[#70787d] mt-0.5 flex items-center gap-1">
                            <Briefcase className="h-2.5 w-2.5 text-[#70787d]" />
                            <span>{contact.department || 'Operations'}</span>
                          </div>
                        </td>

                        {/* 4. Employment Status (People Who Worked in Org) */}
                        <td className="py-3 px-3.5">
                          {isFormer ? (
                            <div className="inline-flex flex-col">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                                <Clock className="h-3 w-3 text-slate-500" />
                                <span>{isArabic ? 'عمل سابقاً بالمنشأة' : 'Previously Worked'}</span>
                              </span>
                              <span className="text-[10px] text-[#70787d] mt-0.5">
                                {contact.tenureYears || `${contact.startDate} – ${contact.endDate || '2024'}`}
                              </span>
                            </div>
                          ) : (
                            <div className="inline-flex flex-col">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>{isArabic ? 'موظف حالي • نشط' : 'Current Employee'}</span>
                              </span>
                              <span className="text-[10px] text-[#70787d] mt-0.5">
                                {contact.tenureYears || `Since ${contact.startDate}`}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* 5. Assigned Branches */}
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-1 flex-wrap max-w-[210px]">
                            {assignedBranchesList.length === 0 ? (
                              <span className="text-[10px] text-[#70787d] italic">
                                {isArabic ? 'غير مسند لفروع' : 'No branch'}
                              </span>
                            ) : (
                              assignedBranchesList.slice(0, 2).map((b) => (
                                <span
                                  key={b.id}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#f1f3ff] text-[10px] font-semibold text-[#161c27] border border-[#e3e8f9]"
                                >
                                  <span className="h-1 w-1 rounded-full bg-[#004a60]" />
                                  <span className="truncate max-w-[80px]">
                                    {isArabic ? b.nameAr.split(' - ')[0] : b.name.split(' ')[0]}
                                  </span>
                                </span>
                              ))
                            )}
                            {assignedBranchesList.length > 2 && (
                              <span className="text-[10px] font-bold text-[#004a60] bg-[#e8eeff] px-1 py-0.5 rounded">
                                +{assignedBranchesList.length - 2}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAssignBranches(contact);
                            }}
                            className="text-[10px] font-bold text-[#004a60] hover:underline mt-1 flex items-center gap-0.5 cursor-pointer"
                          >
                            <Sliders className="h-2.5 w-2.5" />
                            <span>{isArabic ? 'إدارة الفروع' : 'Manage Branches'}</span>
                          </button>
                        </td>

                        {/* 6. Direct Coordinates */}
                        <td className="py-3 px-3.5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <a
                                href={`mailto:${contact.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-[#004a60] hover:underline truncate max-w-[130px]"
                                title={contact.email}
                              >
                                {contact.email}
                              </a>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(contact.email, 'Email');
                                }}
                                className="text-[#70787d] hover:text-[#004a60]"
                              >
                                {copiedField === 'Email' ? (
                                  <Check className="h-2.5 w-2.5 text-emerald-600" />
                                ) : (
                                  <Copy className="h-2.5 w-2.5" />
                                )}
                              </button>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-mono">
                              <a
                                href={`tel:${contact.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-[#161c27] hover:underline"
                              >
                                {contact.phone}
                              </a>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(contact.phone, 'Phone');
                                }}
                                className="text-[#70787d] hover:text-[#004a60]"
                              >
                                {copiedField === 'Phone' ? (
                                  <Check className="h-2.5 w-2.5 text-emerald-600" />
                                ) : (
                                  <Copy className="h-2.5 w-2.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* 7. Actions */}
                        <td className="py-3 px-3.5 text-center">
                          <div
                            className="flex items-center justify-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => handleOpenDispatch('whatsapp', contact.id)}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer border border-emerald-200"
                              title="WhatsApp Concierge"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenDispatch('email', contact.id)}
                              className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white transition-colors cursor-pointer border border-sky-200"
                              title="Send Email"
                            >
                              <Mail className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setInspectingContact(contact)}
                              className="p-1.5 rounded-lg bg-[#e8eeff] text-[#004a60] hover:bg-[#004a60] hover:text-white transition-colors cursor-pointer border border-[#004a60]/20"
                              title={isArabic ? 'الملف التعريفي الكامل' : 'Full Dossier'}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS GRID VIEW (Alternative View Mode) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => {
            const assignedBranchesList = branches.filter((b) =>
              contact.assignedBranchIds.includes(b.id)
            );
            const isFormer = contact.employmentStatus === 'Previously Worked' || contact.status === 'Former';

            return (
              <div
                key={contact.id}
                className="bg-white rounded-2xl border border-[#e3e8f9] p-4.5 shadow-2xs hover:shadow-md hover:border-[#004a60]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Row: Affiliation & Employment Status */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        contact.affiliation === 'internal'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : contact.affiliation === 'client_organization'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : contact.affiliation === 'external'
                          ? 'bg-purple-50 text-purple-800 border border-purple-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-300'
                      }`}
                    >
                      {contact.affiliation === 'internal' && <Building2 className="h-3 w-3" />}
                      {contact.affiliation === 'client_organization' && <Building2 className="h-3 w-3 text-emerald-600" />}
                      {contact.affiliation === 'external' && <Building className="h-3 w-3" />}
                      {contact.affiliation === 'independent' && <User className="h-3 w-3" />}
                      <span>
                        {contact.affiliation === 'internal'
                          ? isArabic
                            ? 'يعمل بالمنصة (HQ)'
                            : 'Host Platform HQ'
                          : contact.affiliation === 'client_organization'
                          ? isArabic
                            ? 'مؤسسة مشتركة'
                            : 'Subscribed Org'
                          : contact.affiliation === 'external'
                          ? isArabic
                            ? 'جهة شريكة'
                            : 'External Org'
                          : isArabic
                          ? 'مستقل'
                          : 'Independent'}
                      </span>
                    </span>

                    {isFormer ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
                        <Clock className="h-2.5 w-2.5" />
                        <span>{isArabic ? 'عمل سابقاً' : 'Previously Worked'}</span>
                      </span>
                    ) : (
                      contact.nafathVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="h-3 w-3 text-emerald-600" />
                          <span>Nafath</span>
                        </span>
                      )
                    )}
                  </div>

                  {/* Contact Identity */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-11 w-11 rounded-2xl text-white font-bold flex items-center justify-center shrink-0 shadow-2xs ${contact.avatarColor}`}
                    >
                      {contact.initials}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#161c27] group-hover:text-[#004a60] transition-colors leading-snug">
                        {isArabic ? contact.nameAr : contact.name}
                      </h3>
                      <div className="text-[11px] font-semibold text-[#004a60] mt-0.5">
                        {isArabic ? contact.roleAr : contact.role}
                      </div>
                      <div className="text-[10px] text-[#70787d] mt-0.5 line-clamp-1">
                        {isArabic ? contact.organizationNameAr : contact.organizationName}
                      </div>
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="mt-3.5 space-y-1.5 bg-[#f9f9ff] p-3 rounded-xl border border-[#e3e8f9]/70 text-xs">
                    <div className="flex items-center justify-between">
                      <a
                        href={`mailto:${contact.email}`}
                        className="hover:underline text-[#004a60] font-medium flex items-center gap-1.5 truncate max-w-[200px]"
                      >
                        <Mail className="h-3 w-3 text-sky-600 shrink-0" />
                        <span className="truncate">{contact.email}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(contact.email, 'Email')}
                        className="text-[#70787d] hover:text-[#004a60]"
                      >
                        {copiedField === 'Email' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <a
                        href={`tel:${contact.phone}`}
                        className="hover:underline font-mono text-[#161c27] font-semibold flex items-center gap-1.5"
                      >
                        <Phone className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span>{contact.phone}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(contact.phone, 'Phone')}
                        className="text-[#70787d] hover:text-[#004a60]"
                      >
                        {copiedField === 'Phone' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Assigned Branches Section */}
                  <div className="mt-3 pt-2.5 border-t border-[#e3e8f9]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-[#70787d] uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#004a60]" />
                        <span>{isArabic ? 'الفروع المسند إليها' : 'Assigned Branches'}</span>
                        <span className="text-[#004a60]">({contact.assignedBranchIds.length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenAssignBranches(contact)}
                        className="text-[10px] font-bold text-[#004a60] hover:underline cursor-pointer"
                      >
                        {isArabic ? 'إدارة الفروع' : 'Manage'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {assignedBranchesList.length === 0 ? (
                        <span className="text-[10px] text-[#70787d] italic">
                          {isArabic ? 'غير مسند لأي فرع حالياً' : 'No branch assigned'}
                        </span>
                      ) : (
                        assignedBranchesList.map((br) => (
                          <span
                            key={br.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-[#c3cce6] text-[10px] font-semibold text-[#161c27]"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span>{isArabic ? br.nameAr.split(' - ')[0] : br.name.split(' ')[0]}</span>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Strip */}
                <div className="mt-4 pt-3 border-t border-[#e3e8f9] flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenDispatch('whatsapp', contact.id)}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer border border-emerald-200"
                      title="WhatsApp"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDispatch('email', contact.id)}
                      className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white transition-colors cursor-pointer border border-sky-200"
                      title="Email"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setInspectingContact(contact)}
                      className="p-1.5 rounded-lg bg-[#e8eeff] text-[#004a60] hover:bg-[#004a60] hover:text-white transition-colors cursor-pointer border border-[#004a60]/20"
                      title="View Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenAssignBranches(contact)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#e8eeff] hover:bg-[#d5e0ff] text-[#004a60] text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Sliders className="h-3 w-3" />
                    <span>{isArabic ? 'إسناد الفروع' : 'Assign Branches'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL EMPLOYEE & WORKFORCE DOSSIER DRAWER/MODAL */}
      {inspectingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#e3e8f9] my-auto animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#e3e8f9] mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`h-12 w-12 rounded-2xl text-white font-bold text-base flex items-center justify-center shadow-md ${inspectingContact.avatarColor}`}
                >
                  {inspectingContact.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#161c27]">
                      {isArabic ? inspectingContact.nameAr : inspectingContact.name}
                    </h3>
                    {inspectingContact.employmentStatus === 'Previously Worked' ? (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-300">
                        {isArabic ? 'عمل سابقاً بالمنشأة' : 'Previously Worked (Alumni)'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                        {isArabic ? 'موظف حالي' : 'Current Employee'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#004a60] mt-0.5">
                    {isArabic ? inspectingContact.roleAr : inspectingContact.role} • {inspectingContact.department}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectingContact(null)}
                className="text-[#70787d] hover:text-[#161c27] p-1.5 rounded-lg hover:bg-[#f1f3ff]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Organization and Work Tenure Dossier */}
              <div className="bg-[#f9f9ff] p-4 rounded-xl border border-[#e3e8f9] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#161c27] flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-[#004a60]" />
                    <span>{isArabic ? 'بيانات المنشأة وسجل العمل' : 'Organization & Employment Dossier'}</span>
                  </span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#e3e8f9] text-[#004a60] font-bold">
                    {inspectingContact.nationalIdMasked ? `National ID: ${inspectingContact.nationalIdMasked}` : 'Nafath Verified'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#70787d] text-[11px] block">{isArabic ? 'المنشأة أو جهة العمل:' : 'Organization:'}</span>
                    <span className="font-bold text-[#161c27]">{inspectingContact.organizationName}</span>
                    <span className="text-[11px] text-[#70787d] block">{inspectingContact.organizationNameAr}</span>
                  </div>

                  <div>
                    <span className="text-[#70787d] text-[11px] block">{isArabic ? 'المدينة والمقر:' : 'City & Location:'}</span>
                    <span className="font-bold text-[#161c27]">{inspectingContact.city}, Saudi Arabia</span>
                  </div>

                  <div>
                    <span className="text-[#70787d] text-[11px] block">{isArabic ? 'مدة الخدمة وسجل التعيين:' : 'Tenure / Service Record:'}</span>
                    <span className="font-bold text-[#161c27]">
                      {inspectingContact.tenureYears || `${inspectingContact.startDate} – ${inspectingContact.endDate || 'Present'}`}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#70787d] text-[11px] block">{isArabic ? 'طبيعة الصلة النظامية:' : 'Affiliation Status:'}</span>
                    <span className="font-bold text-[#004a60]">
                      {inspectingContact.affiliation === 'internal'
                        ? 'Host Platform HQ Workforce'
                        : inspectingContact.affiliation === 'client_organization'
                        ? 'Subscribed Client Organization Staff'
                        : inspectingContact.affiliation === 'external'
                        ? 'External Entity / Government Partner'
                        : 'Independent Advisor / Contractor'}
                    </span>
                  </div>
                </div>

                {inspectingContact.notes && (
                  <div className="pt-2 border-t border-[#e3e8f9] text-[11px] text-[#40484d] bg-white p-2.5 rounded-lg border">
                    <span className="font-bold text-[#161c27] block mb-0.5">
                      {isArabic ? 'ملاحظات وتفويضات المسؤولية:' : 'Scope & Key Responsibilities:'}
                    </span>
                    <p>{isArabic ? inspectingContact.notesAr || inspectingContact.notes : inspectingContact.notes}</p>
                  </div>
                )}
              </div>

              {/* Assigned Branches and Hotel Locations */}
              <div className="bg-white p-4 rounded-xl border border-[#e3e8f9] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#161c27] flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#004a60]" />
                    <span>{isArabic ? 'الفروع والفنادق المسند إليها' : 'Assigned Branches & Hotel Locations'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const c = inspectingContact;
                      setInspectingContact(null);
                      handleOpenAssignBranches(c);
                    }}
                    className="text-xs font-bold text-[#004a60] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Sliders className="h-3 w-3" />
                    <span>{isArabic ? 'تعديل الفروع' : 'Edit Assignments'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {branches
                    .filter((b) => inspectingContact.assignedBranchIds.includes(b.id))
                    .map((branch) => (
                      <div
                        key={branch.id}
                        className="p-2.5 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-[#161c27]">
                            {isArabic ? branch.nameAr : branch.name}
                          </div>
                          <div className="text-[10px] text-[#70787d]">
                            {branch.city} • {branch.managedKeys} Keys
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-white text-[#004a60] px-2 py-0.5 rounded border border-[#e3e8f9]">
                          {branch.code}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Direct Communication Channels */}
              <div className="bg-[#f9f9ff] p-4 rounded-xl border border-[#e3e8f9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-sky-600" />
                    <span className="font-mono text-xs">{inspectingContact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="font-mono text-xs">{inspectingContact.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const id = inspectingContact.id;
                      setInspectingContact(null);
                      handleOpenDispatch('whatsapp', id);
                    }}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const id = inspectingContact.id;
                      setInspectingContact(null);
                      handleOpenDispatch('email', id);
                    }}
                    className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Email</span>
                  </button>
                  <a
                    href={`tel:${inspectingContact.phone}`}
                    className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-[#e3e8f9]">
              <button
                type="button"
                onClick={() => setInspectingContact(null)}
                className="px-5 py-2 rounded-xl bg-[#004a60] text-white font-bold text-xs"
              >
                {isArabic ? 'إغلاق الملف' : 'Close Dossier'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN BRANCHES MODAL (Key Feature: A contact can be assigned to multiple branches) */}
      {branchAssignContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#e3e8f9] my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9] mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-xl text-white font-bold flex items-center justify-center ${branchAssignContact.avatarColor}`}
                >
                  {branchAssignContact.initials}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#161c27]">
                    {isArabic
                      ? `إسناد الفروع لـ ${branchAssignContact.nameAr}`
                      : `Assign Branches for ${branchAssignContact.name}`}
                  </h3>
                  <p className="text-[11px] text-[#70787d]">
                    {isArabic
                      ? 'يمكن إسناد جهة الاتصال لأكثر من فرع تشغيلي ضمن المؤسسة في نفس الوقت.'
                      : 'Assign this individual to one or multiple operational branches within the organization.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBranchAssignContact(null)}
                className="text-[#70787d] hover:text-[#161c27] p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 py-1">
              <span className="text-xs font-bold text-[#161c27] block">
                {isArabic ? 'اختر الفروع المرتبطة (يمكن اختيار عدة فروع):' : 'Select Associated Branches (Multi-select Allowed):'}
              </span>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {branches.map((branch) => {
                  const isChecked = tempAssignedBranchIds.includes(branch.id);
                  return (
                    <label
                      key={branch.id}
                      onClick={() => handleToggleBranchCheck(branch.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#e8eeff]/60 border-[#004a60]'
                          : 'bg-[#f9f9ff] border-[#e3e8f9] hover:bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-[#004a60] focus:ring-[#004a60] cursor-pointer"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#161c27]">
                            {isArabic ? branch.nameAr : branch.name}
                          </span>
                          <span className="font-mono text-[10px] text-[#004a60] bg-white px-1.5 py-0.5 rounded border border-[#e3e8f9]">
                            {branch.code}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#70787d] mt-0.5">
                          {branch.city} • {branch.district}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#e3e8f9]">
              <div className="text-xs text-[#70787d]">
                {isArabic ? 'الفروع المحددة:' : 'Selected:'}{' '}
                <span className="font-bold text-[#004a60]">{tempAssignedBranchIds.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBranchAssignContact(null)}
                  className="px-4 py-2 rounded-xl border border-[#c3cce6] text-[#70787d] hover:bg-[#f9f9ff] text-xs font-semibold cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveAssignedBranches}
                  className="px-5 py-2 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>{isArabic ? 'حفظ إسناد الفروع' : 'Save Branch Assignment'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW CONTACT / EMPLOYEE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e3e8f9] my-auto animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9] mb-4">
              <div>
                <h3 className="text-base font-bold text-[#161c27]">
                  {isArabic ? 'إضافة موظف / كادر في المنشآت' : 'Add Employee / Organization Workforce'}
                </h3>
                <p className="text-xs text-[#70787d]">
                  {isArabic
                    ? 'تسجيل موظف حالي أو توثيق كادر عمل سابقاً في المؤسسة المشتركة مع إسناد الفروع'
                    : 'Register current staff or historical alumni with organization & branch assignment'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#70787d] hover:text-[#161c27] p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-3.5 text-xs">
              {/* Affiliation Selector */}
              <div>
                <label className="font-bold text-[#161c27] block mb-1.5">
                  {isArabic ? 'طبيعة الصلة بالمؤسسة (Affiliation) *' : 'Affiliation Status *'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label
                    onClick={() => setNewAffiliation('internal')}
                    className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                      newAffiliation === 'internal'
                        ? 'bg-[#e8eeff] border-[#004a60] text-[#004a60] font-bold shadow-2xs'
                        : 'bg-[#f9f9ff] border-[#e3e8f9] text-[#70787d]'
                    }`}
                  >
                    <Building2 className="h-4 w-4 mx-auto mb-1" />
                    <span className="text-[11px] block">{isArabic ? 'المنصة (HQ)' : 'Host HQ'}</span>
                  </label>

                  <label
                    onClick={() => setNewAffiliation('client_organization')}
                    className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                      newAffiliation === 'client_organization'
                        ? 'bg-emerald-50 border-emerald-700 text-emerald-800 font-bold shadow-2xs'
                        : 'bg-[#f9f9ff] border-[#e3e8f9] text-[#70787d]'
                    }`}
                  >
                    <Building2 className="h-4 w-4 mx-auto mb-1 text-emerald-600" />
                    <span className="text-[11px] block">{isArabic ? 'مؤسسة مشتركة' : 'Subscribed Org'}</span>
                  </label>

                  <label
                    onClick={() => setNewAffiliation('external')}
                    className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                      newAffiliation === 'external'
                        ? 'bg-purple-50 border-purple-800 text-purple-900 font-bold shadow-2xs'
                        : 'bg-[#f9f9ff] border-[#e3e8f9] text-[#70787d]'
                    }`}
                  >
                    <Building className="h-4 w-4 mx-auto mb-1" />
                    <span className="text-[11px] block">{isArabic ? 'جهة شريكة' : 'External Org'}</span>
                  </label>

                  <label
                    onClick={() => setNewAffiliation('independent')}
                    className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                      newAffiliation === 'independent'
                        ? 'bg-slate-200 border-slate-700 text-slate-900 font-bold shadow-2xs'
                        : 'bg-[#f9f9ff] border-[#e3e8f9] text-[#70787d]'
                    }`}
                  >
                    <User className="h-4 w-4 mx-auto mb-1" />
                    <span className="text-[11px] block">{isArabic ? 'مستقل / استشاري' : 'Independent'}</span>
                  </label>
                </div>
              </div>

              {/* Employment Status: Current Employee vs Previously Worked in Organization */}
              <div>
                <label className="font-bold text-[#161c27] block mb-1.5">
                  {isArabic ? 'الحالة الوظيفية وسجل العمل بالمنشأة *' : 'Employment Status & History *'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label
                    onClick={() => setNewEmploymentStatus('Current Employee')}
                    className={`p-2 rounded-xl border text-center cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      newEmploymentStatus === 'Current Employee'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                        : 'bg-[#f9f9ff] border-[#e3e8f9] text-[#70787d]'
                    }`}
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>{isArabic ? 'موظف حالي على رأس العمل' : 'Current Employee'}</span>
                  </label>

                  <label
                    onClick={() => setNewEmploymentStatus('Previously Worked')}
                    className={`p-2 rounded-xl border text-center cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      newEmploymentStatus === 'Previously Worked'
                        ? 'bg-slate-200 border-slate-700 text-slate-900 font-bold'
                        : 'bg-[#f9f9ff] border-[#e3e8f9] text-[#70787d]'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>{isArabic ? 'عمل سابقاً بالمنشأة (موظف سابق)' : 'Previously Worked (Alumni)'}</span>
                  </label>

                  <label
                    onClick={() => setNewEmploymentStatus('Advisor')}
                    className={`p-2 rounded-xl border text-center cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      newEmploymentStatus === 'Advisor'
                        ? 'bg-purple-100 border-purple-800 text-purple-900 font-bold'
                        : 'bg-[#f9f9ff] border-[#e3e8f9] text-[#70787d]'
                    }`}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    <span>{isArabic ? 'مستشار / متعاقد' : 'Advisor / Consultant'}</span>
                  </label>
                </div>
              </div>

              {/* Organization Picker (if Subscribed Client Organization) */}
              {newAffiliation === 'client_organization' ? (
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'المؤسسة المشتركة التي يعمل بها *' : 'Subscribed Client Organization *'}
                  </label>
                  <select
                    value={newSelectedOrgId}
                    onChange={(e) => setNewSelectedOrgId(e.target.value)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-medium"
                  >
                    {HOSPITALITY_ORGANIZATIONS.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name} ({org.nameAr}) - {org.city}
                      </option>
                    ))}
                  </select>
                </div>
              ) : newAffiliation === 'external' || newAffiliation === 'independent' ? (
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'اسم جهة العمل أو المنشأة *' : 'Entity / Practice Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustomOrgName}
                    onChange={(e) => setNewCustomOrgName(e.target.value)}
                    placeholder="e.g. Ministry of Tourism, Private Advisory..."
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
              ) : null}

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'الاسم بالإنجليزية *' : 'Full Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Fahad Al-Mutairi"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'الاسم بالعربية' : 'Full Name (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={newNameAr}
                    onChange={(e) => setNewNameAr(e.target.value)}
                    placeholder="مثال: فهد المطيري"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
              </div>

              {/* Role, Department & City */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'المسمى الوظيفي *' : 'Job Title / Role *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. General Manager"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'القسم أو الإدارة' : 'Department'}
                  </label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  >
                    <option value="Hotel Operations">Hotel Operations</option>
                    <option value="Executive Leadership">Executive Leadership</option>
                    <option value="Finance & ZATCA">Finance & ZATCA</option>
                    <option value="IT & Smart Hardware">IT & Smart Hardware</option>
                    <option value="Guest Experience">Guest Experience</option>
                    <option value="Asset Management">Asset Management</option>
                    <option value="Regulatory Compliance">Regulatory Compliance</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'المدينة' : 'City'}
                  </label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  >
                    <option value="Riyadh">Riyadh (الرياض)</option>
                    <option value="Jeddah">Jeddah (جدة)</option>
                    <option value="AlUla">AlUla (العلا)</option>
                    <option value="Makkah">Makkah (مكة)</option>
                    <option value="Madinah">Madinah (المدينة)</option>
                    <option value="Al Khobar">Al Khobar (الخبر)</option>
                    <option value="Red Sea">Red Sea (البحر الأحمر)</option>
                  </select>
                </div>
              </div>

              {/* Start Date & End Date (for people who worked in org) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'تاريخ بداية العمل أو التعيين' : 'Start Date'}
                  </label>
                  <input
                    type="text"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    placeholder="e.g. Jan 2021"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic
                      ? 'تاريخ انتهاء العمل (إن كان موظفاً سابقاً)'
                      : 'End Date (if previously worked)'}
                  </label>
                  <input
                    type="text"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    placeholder="e.g. Aug 2024 (Leave blank if current)"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'البريد الإلكتروني *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="fahad@organization.sa"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'رقم الجوال *' : 'Mobile Phone *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+966 50 123 4567"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Branch Assignment Checkboxes */}
              <div className="pt-2 border-t border-[#e3e8f9]">
                <label className="font-bold text-[#161c27] block mb-1.5">
                  {isArabic ? 'إسناد الفروع (يمكن تحديد عدة فروع) *' : 'Assign to Branches (Multi-select) *'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 border border-[#e3e8f9] rounded-xl bg-[#f9f9ff]">
                  {branches.map((b) => {
                    const isChecked = newAssignedBranches.includes(b.id);
                    return (
                      <label
                        key={b.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#e3e8f9] text-xs cursor-pointer hover:bg-[#e8eeff]/50"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAssignedBranches((prev) => [...prev, b.id]);
                            } else {
                              setNewAssignedBranches((prev) => prev.filter((id) => id !== b.id));
                            }
                          }}
                          className="rounded text-[#004a60] focus:ring-[#004a60]"
                        />
                        <span className="font-medium text-[#161c27] truncate">
                          {isArabic ? b.nameAr : b.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3e8f9]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#c3cce6] text-[#70787d] hover:bg-[#f9f9ff] font-semibold"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isArabic ? 'تسجيل الموظف / الكادر' : 'Save Employee Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MULTICHANNEL DISPATCH MODAL (WhatsApp & Email) */}
      <MultichannelDispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        isArabic={isArabic}
        initialChannel={dispatchChannel}
        allRecipients={recipientProfiles}
        initialSelectedRecipientIds={selectedContactIdsForDispatch}
        onDispatchSuccess={({ channel, count, templateName }) => {
          showToast(
            isArabic
              ? `تم بنجاح إرسال "${templateName}" إلى ${count} جهة اتصال عبر ${channel.toUpperCase()}`
              : `Dispatched "${templateName}" to ${count} contact(s) via ${channel.toUpperCase()}`
          );
        }}
      />
    </div>
  );
};
