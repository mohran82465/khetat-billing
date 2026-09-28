import React, { useState } from 'react';
import {
  Building2,
  Building,
  MapPin,
  Phone,
  Mail,
  Users,
  User,
  Plus,
  Sliders,
  CheckCircle2,
  Key,
  ShieldCheck,
  Search,
  ExternalLink,
  X,
  Check,
  Clock,
} from 'lucide-react';
import {
  OrganizationBranch,
  OrgContact,
} from '../../data/organizationData';

interface OrganizationBranchesTabProps {
  isArabic: boolean;
  branches: OrganizationBranch[];
  contacts: OrgContact[];
  onUpdateBranch?: (updatedBranch: OrganizationBranch) => void;
  onAddBranch?: (newBranch: OrganizationBranch) => void;
  onUpdateContactBranches?: (contactId: string, branchIds: string[]) => void;
}

export const OrganizationBranchesTab: React.FC<OrganizationBranchesTabProps> = ({
  isArabic,
  branches,
  contacts,
  onUpdateBranch,
  onAddBranch,
  onUpdateContactBranches,
}) => {
  const [internalBranches, setInternalBranches] = useState<OrganizationBranch[]>(branches);
  const activeBranches = branches.length > 0 ? branches : internalBranches;

  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');

  // Manage Assigned Workforce modal
  const [managingWorkforceBranch, setManagingWorkforceBranch] = useState<OrganizationBranch | null>(null);
  const [tempAssignedContactIds, setTempAssignedContactIds] = useState<string[]>([]);

  // Add Branch modal
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newNameAr, setNewNameAr] = useState('');
  const [newType, setNewType] = useState<OrganizationBranch['type']>('Regional Hub');
  const [newCity, setNewCity] = useState('Al Khobar');
  const [newCityAr, setNewCityAr] = useState('الخبر');
  const [newDistrict, setNewDistrict] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newManagerName, setNewManagerName] = useState('');
  const [newManagedKeys, setNewManagedKeys] = useState('80');
  const [newBranchContacts, setNewBranchContacts] = useState<string[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open Workforce Management modal
  const handleOpenManageWorkforce = (branch: OrganizationBranch) => {
    // Find all contacts that have this branch.id in their assignedBranchIds
    const assignedIds = contacts
      .filter((c) => c.assignedBranchIds.includes(branch.id))
      .map((c) => c.id);

    setManagingWorkforceBranch(branch);
    setTempAssignedContactIds(assignedIds);
  };

  // Save Workforce assignment for this branch
  const handleSaveBranchWorkforce = () => {
    if (!managingWorkforceBranch) return;

    // For every contact:
    // If contact is in tempAssignedContactIds, ensure branch.id is in their assignedBranchIds
    // If not, remove branch.id from their assignedBranchIds
    contacts.forEach((c) => {
      const isSelected = tempAssignedContactIds.includes(c.id);
      const currentlyHas = c.assignedBranchIds.includes(managingWorkforceBranch.id);

      if (isSelected && !currentlyHas) {
        onUpdateContactBranches?.(c.id, [...c.assignedBranchIds, managingWorkforceBranch.id]);
      } else if (!isSelected && currentlyHas) {
        onUpdateContactBranches?.(
          c.id,
          c.assignedBranchIds.filter((id) => id !== managingWorkforceBranch.id)
        );
      }
    });

    const updatedBranch = {
      ...managingWorkforceBranch,
      assignedContactIds: tempAssignedContactIds,
    };

    if (onUpdateBranch) {
      onUpdateBranch(updatedBranch);
    } else {
      setInternalBranches((prev) =>
        prev.map((b) => (b.id === updatedBranch.id ? updatedBranch : b))
      );
    }

    setManagingWorkforceBranch(null);
    showToast(
      isArabic
        ? `تم تحديث الكوادر وفريق العمل المسند لـ ${managingWorkforceBranch.nameAr} بنجاح`
        : `Updated linked workforce for ${managingWorkforceBranch.name}`
    );
  };

  // Toggle Contact Checkbox
  const handleToggleContactCheck = (contactId: string) => {
    setTempAssignedContactIds((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId]
    );
  };

  // Add Branch Submit
  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const generatedId = `br-${Date.now()}`;
    const branch: OrganizationBranch = {
      id: generatedId,
      code: newCode || `BR-${newCity.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      name: newName,
      nameAr: newNameAr || newName,
      type: newType,
      typeAr:
        newType === 'Headquarters'
          ? 'المقر الرئيسي'
          : newType === 'Regional Hub'
          ? 'فرع إقليمي'
          : newType === 'Resort Hub'
          ? 'فرع منتجعات التراث'
          : 'مكتب عمليات وتنسيق',
      city: newCity,
      cityAr: newCityAr || newCity,
      district: newDistrict || 'Central Sector',
      address: newAddress || `${newCity}, Saudi Arabia`,
      addressAr: newAddress || `${newCityAr}، المملكة العربية السعودية`,
      shortAddress: `${newCity.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-4401`,
      phone: newPhone || '+966 13 881 2200',
      email: newEmail || `branch.${newCity.toLowerCase()}@khetat.sa`,
      managerName: newManagerName || 'Branch Manager',
      managerNameAr: newManagerName || 'مدير الفرع',
      managerPhone: '+966 50 123 4567',
      assignedContactIds: newBranchContacts,
      managedKeys: parseInt(newManagedKeys, 10) || 60,
      status: 'Active',
    };

    // Update contacts that were selected for this branch
    newBranchContacts.forEach((cId) => {
      const contact = contacts.find((c) => c.id === cId);
      if (contact && !contact.assignedBranchIds.includes(generatedId)) {
        onUpdateContactBranches?.(cId, [...contact.assignedBranchIds, generatedId]);
      }
    });

    if (onAddBranch) {
      onAddBranch(branch);
    } else {
      setInternalBranches((prev) => [...prev, branch]);
    }

    setIsAddBranchModalOpen(false);
    setNewName('');
    setNewNameAr('');
    setNewCode('');
    showToast(isArabic ? `تم تأسيس الفرع الجديد ${branch.nameAr} بنجاح` : `Established branch ${branch.name}`);
  };

  // Filter branches
  const filteredBranches = activeBranches.filter((b) => {
    const matchCity = cityFilter === 'all' || b.city === cityFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.nameAr.includes(q) ||
      b.code.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q) ||
      b.managerName.toLowerCase().includes(q);

    return matchCity && matchSearch;
  });

  const totalKeys = activeBranches.reduce((acc, b) => acc + b.managedKeys, 0);

  return (
    <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#004a60] text-white px-4 py-2.5 shadow-xl border border-white/20 text-xs font-semibold animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#161c27] flex items-center gap-2">
              <Building className="h-5 w-5 text-[#004a60]" />
              <span>{isArabic ? 'شبكة فروع ومواقع المؤسسة' : 'Organization Operating Branches'}</span>
            </h2>
            <span className="text-[10px] font-bold bg-[#e8eeff] text-[#004a60] px-2 py-0.5 rounded-full">
              {activeBranches.length} {isArabic ? 'فروع نشطة' : 'Active Branches'}
            </span>
          </div>
          <p className="text-xs text-[#70787d] mt-1 max-w-2xl leading-relaxed">
            {isArabic
              ? 'تعتبر الفروع حلقة الوصل بين المؤسسة وكوادرها وفريق عملها في مواقع محددة، مع إمكانية إسناد جهة الاتصال لعدة فروع ضمن نفس المؤسسة.'
              : 'Acts as the link between an organization and its workforce at specific locations. A contact can also be assigned to multiple branches within the same organization.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9] text-xs">
            <div>
              <div className="text-[10px] text-[#70787d]">{isArabic ? 'إجمالي المفاتيح' : 'Managed Keys'}</div>
              <div className="font-bold text-[#004a60]">{totalKeys.toLocaleString()} Keys</div>
            </div>
            <div className="h-6 w-px bg-[#e3e8f9]" />
            <div>
              <div className="text-[10px] text-[#70787d]">{isArabic ? 'المدن المغطاة' : 'Cities'}</div>
              <div className="font-bold text-[#161c27]">
                {Array.from(new Set(activeBranches.map((b) => b.city))).length} Cities
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddBranchModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white px-4 py-2.5 text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{isArabic ? 'إضافة فرع جديد' : 'Add New Branch'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] p-3.5 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#161c27]">{isArabic ? 'المدينة:' : 'City:'}</span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setCityFilter('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                cityFilter === 'all'
                  ? 'bg-[#004a60] text-white shadow-2xs'
                  : 'bg-[#f1f3ff] text-[#40484d] hover:bg-[#e8eeff]'
              }`}
            >
              {isArabic ? 'جميع المدن' : 'All Cities'} ({activeBranches.length})
            </button>
            {Array.from(new Set(activeBranches.map((b) => b.city))).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setCityFilter(city)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  cityFilter === city
                    ? 'bg-[#004a60] text-white shadow-2xs'
                    : 'bg-[#f1f3ff] text-[#40484d] hover:bg-[#e8eeff]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div className="relative sm:w-64">
          <Search className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d] ${isArabic ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isArabic ? 'بحث بالاسم، الرمز، المدير...' : 'Search branch, code, manager...'}
            className={`w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] py-1.5 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden ${
              isArabic ? 'pr-8 pl-3' : 'pl-8 pr-3'
            }`}
          />
        </div>
      </div>

      {/* Branches List Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredBranches.map((branch) => {
          // Identify contacts assigned to this branch
          const linkedContacts = contacts.filter((c) =>
            c.assignedBranchIds.includes(branch.id)
          );

          return (
            <div
              key={branch.id}
              className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-2xs hover:shadow-md hover:border-[#004a60]/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Badge Strip */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#004a60] bg-[#e8eeff] px-2 py-0.5 rounded-lg border border-[#c3cce6]">
                      {branch.code}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        branch.type === 'Headquarters'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : branch.type === 'Resort Hub'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      <Building2 className="h-3 w-3" />
                      <span>{isArabic ? branch.typeAr : branch.type}</span>
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>{branch.status}</span>
                  </span>
                </div>

                {/* Branch Name & Address */}
                <h3 className="text-base font-bold text-[#161c27] leading-snug">
                  {isArabic ? branch.nameAr : branch.name}
                </h3>
                <p className="text-xs text-[#70787d] mt-1 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#004a60] shrink-0" />
                  <span>
                    {isArabic ? branch.addressAr : branch.address} ({branch.shortAddress})
                  </span>
                </p>

                {/* Manager & Branch Contacts Coordinates */}
                <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#f9f9ff] p-3 rounded-xl border border-[#e3e8f9] text-xs">
                  <div>
                    <span className="text-[10px] text-[#70787d] block font-medium">
                      {isArabic ? 'مدير الفرع / المسؤول' : 'Branch Manager'}
                    </span>
                    <div className="font-bold text-[#161c27] mt-0.5">
                      {isArabic ? branch.managerNameAr : branch.managerName}
                    </div>
                    <div className="text-[10px] text-[#004a60] font-mono mt-0.5">
                      {branch.managerPhone}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#70787d] block font-medium">
                      {isArabic ? 'الاتصال المباشر والبريد' : 'Direct Phone & Email'}
                    </span>
                    <div className="font-mono text-xs font-semibold text-[#161c27] mt-0.5">
                      {branch.phone}
                    </div>
                    <div className="text-[10px] text-[#004a60] truncate mt-0.5">
                      {branch.email}
                    </div>
                  </div>
                </div>

                {/* Linked Workforce Section (Core User Requirement) */}
                <div className="mt-4 pt-3 border-t border-[#e3e8f9]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#161c27] flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-[#004a60]" />
                      <span>
                        {isArabic
                          ? `الكوادر وفريق العمل المسند لهذا الفرع (${linkedContacts.length})`
                          : `Workforce Linked to this Location (${linkedContacts.length})`}
                      </span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenManageWorkforce(branch)}
                      className="text-xs font-bold text-[#004a60] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sliders className="h-3 w-3" />
                      <span>{isArabic ? 'ربط كوادر / تعديل' : 'Manage Workforce'}</span>
                    </button>
                  </div>

                  {linkedContacts.length === 0 ? (
                    <div className="p-3 text-center bg-[#f9f9ff] rounded-xl border border-dashed border-[#c3cce6] text-xs text-[#70787d]">
                      {isArabic
                        ? 'لم يتم إسناد أي موظف أو كادر لهذا الفرع حتى الآن'
                        : 'No workforce currently assigned to this location'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {linkedContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center gap-2 p-2 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9] hover:bg-white transition-colors"
                        >
                          <div
                            className={`h-7 w-7 rounded-lg text-white font-bold text-[10px] flex items-center justify-center shrink-0 ${contact.avatarColor}`}
                          >
                            {contact.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs text-[#161c27] truncate">
                              {isArabic ? contact.nameAr : contact.name}
                            </div>
                            <div className="text-[10px] text-[#70787d] truncate">
                              {isArabic ? contact.roleAr : contact.role}
                            </div>
                          </div>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                              contact.affiliation === 'internal'
                                ? 'bg-blue-100 text-blue-800'
                                : contact.affiliation === 'external'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {contact.affiliation === 'internal'
                              ? 'Org'
                              : contact.affiliation === 'external'
                              ? 'Ext'
                              : 'Ind'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-[#e3e8f9] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#004a60] font-semibold text-[11px]">
                  <Key className="h-3.5 w-3.5" />
                  <span>
                    {branch.managedKeys} {isArabic ? 'وحدات ومفاتيح مشغلة' : 'Keys Managed'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenManageWorkforce(branch)}
                  className="px-3 py-1.5 rounded-lg bg-[#004a60] hover:bg-[#074e64] text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Users className="h-3 w-3" />
                  <span>{isArabic ? 'إدارة فريق الفرع' : 'Link Workforce'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manage Workforce Modal for a Specific Branch */}
      {managingWorkforceBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e3e8f9] my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9] mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#e8eeff] text-[#004a60]">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#161c27]">
                    {isArabic
                      ? `ربط الكوادر وفريق العمل بفرع: ${managingWorkforceBranch.nameAr}`
                      : `Link Workforce to: ${managingWorkforceBranch.name}`}
                  </h3>
                  <p className="text-[11px] text-[#70787d]">
                    {isArabic
                      ? 'حدد أعضاء فريق العمل المعتمدين والمكلفين بالعمل في هذا الموقع الجغرافي'
                      : 'Select authorized workforce contacts stationed or assigned to this branch location.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setManagingWorkforceBranch(null)}
                className="text-[#70787d] hover:text-[#161c27] p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 py-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#161c27]">
                  {isArabic ? 'قائمة جميع جهات الاتصال المتاحة:' : 'Available Contacts Directory:'}
                </span>
                <span className="text-[11px] text-[#70787d]">
                  {isArabic ? 'المحدد حالياً:' : 'Assigned:'}{' '}
                  <span className="font-bold text-[#004a60]">{tempAssignedContactIds.length}</span>
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {contacts.map((contact) => {
                  const isChecked = tempAssignedContactIds.includes(contact.id);
                  return (
                    <label
                      key={contact.id}
                      onClick={() => handleToggleContactCheck(contact.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#e8eeff]/60 border-[#004a60]'
                          : 'bg-[#f9f9ff] border-[#e3e8f9] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-[#004a60] focus:ring-[#004a60] cursor-pointer"
                        />
                        <div
                          className={`h-8 w-8 rounded-lg text-white font-bold text-[11px] flex items-center justify-center shrink-0 ${contact.avatarColor}`}
                        >
                          {contact.initials}
                        </div>
                        <div className="text-xs">
                          <div className="font-bold text-[#161c27]">
                            {isArabic ? contact.nameAr : contact.name}
                          </div>
                          <div className="text-[11px] text-[#70787d]">
                            {isArabic ? contact.roleAr : contact.role} • {contact.city}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          contact.affiliation === 'internal'
                            ? 'bg-blue-100 text-blue-800'
                            : contact.affiliation === 'external'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {contact.affiliation === 'internal'
                          ? isArabic ? 'داخلي' : 'Internal'
                          : contact.affiliation === 'external'
                          ? isArabic ? 'جهة أخرى' : 'External'
                          : isArabic ? 'مستقل' : 'Independent'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-[#e3e8f9]">
              <button
                type="button"
                onClick={() => setManagingWorkforceBranch(null)}
                className="px-4 py-2 rounded-xl border border-[#c3cce6] text-[#70787d] hover:bg-[#f9f9ff] text-xs font-semibold cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveBranchWorkforce}
                className="px-5 py-2 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" />
                <span>{isArabic ? 'حفظ إسناد الكوادر' : 'Save Linked Workforce'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Branch Modal */}
      {isAddBranchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e3e8f9] my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9] mb-4">
              <div>
                <h3 className="text-base font-bold text-[#161c27]">
                  {isArabic ? 'تأسيس وإضافة فرع جديد للمؤسسة' : 'Establish New Branch Node'}
                </h3>
                <p className="text-xs text-[#70787d]">
                  {isArabic ? 'تسجيل موقع تشغيلي جديد وتعيين الكوادر الإدارية' : 'Create operating location and link initial workforce'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddBranchModalOpen(false)}
                className="text-[#70787d] hover:text-[#161c27] p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'اسم الفرع بالإنجليزية *' : 'Branch Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Eastern Province Operations Hub"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'اسم الفرع بالعربية' : 'Branch Name (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={newNameAr}
                    onChange={(e) => setNewNameAr(e.target.value)}
                    placeholder="مثال: فرع المنطقة الشرقية والخبر"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'نوع الفرع' : 'Branch Type'}
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  >
                    <option value="Regional Hub">Regional Hub (فرع إقليمي)</option>
                    <option value="Resort Hub">Resort Hub (فرع منتجعات التراث)</option>
                    <option value="Operations Node">Operations Node (مكتب عمليات)</option>
                    <option value="Headquarters">Headquarters (مقر رئيسي)</option>
                  </select>
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
                        e.target.value === 'Al Khobar'
                          ? 'الخبر'
                          : e.target.value === 'Dammam'
                          ? 'الدمام'
                          : e.target.value === 'Taif'
                          ? 'الطائف'
                          : e.target.value === 'Abha'
                          ? 'أبها'
                          : e.target.value
                      );
                    }}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  >
                    <option value="Al Khobar">Al Khobar (الخبر)</option>
                    <option value="Dammam">Dammam (الدمام)</option>
                    <option value="Taif">Taif (الطائف)</option>
                    <option value="Abha">Abha (أبها)</option>
                    <option value="Jazan">Jazan (جازان)</option>
                    <option value="Najran">Najran (نجران)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'المفاتيح المشغلة' : 'Managed Keys'}
                  </label>
                  <input
                    type="number"
                    value={newManagedKeys}
                    onChange={(e) => setNewManagedKeys(e.target.value)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'العنوان الفعلي للفرع' : 'Physical Address'}
                  </label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="King Salman Road, Business Park"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'الحي' : 'District'}
                  </label>
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    placeholder="Al-Yarmouk District"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'هاتف الفرع' : 'Branch Phone'}
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+966 13 881 2200"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'اسم مدير الفرع' : 'Branch Manager'}
                  </label>
                  <input
                    type="text"
                    value={newManagerName}
                    onChange={(e) => setNewManagerName(e.target.value)}
                    placeholder="Fahad Al-Dossary"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
              </div>

              {/* Initial Workforce Assignment */}
              <div className="pt-2 border-t border-[#e3e8f9]">
                <label className="font-bold text-[#161c27] block mb-1">
                  {isArabic ? 'إسناد الكوادر الأولية للفرع (Workforce Link)' : 'Assign Initial Workforce:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-32 overflow-y-auto p-1.5 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff]">
                  {contacts.map((c) => {
                    const isChecked = newBranchContacts.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-[#e3e8f9] text-xs cursor-pointer hover:bg-[#e8eeff]/50"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewBranchContacts((prev) => [...prev, c.id]);
                            } else {
                              setNewBranchContacts((prev) => prev.filter((id) => id !== c.id));
                            }
                          }}
                          className="rounded text-[#004a60] focus:ring-[#004a60]"
                        />
                        <span className="font-medium text-[#161c27] truncate">
                          {isArabic ? c.nameAr : c.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3e8f9]">
                <button
                  type="button"
                  onClick={() => setIsAddBranchModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#c3cce6] text-[#70787d] hover:bg-[#f9f9ff] font-semibold"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isArabic ? 'تأسيس الفرع' : 'Create Branch'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
