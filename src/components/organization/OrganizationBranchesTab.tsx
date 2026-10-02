import React, { useState, useMemo } from 'react';
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
  LayoutList,
  LayoutGrid,
  Filter,
  Eye,
  ArrowUpDown,
  ChevronDown,
  Layers,
  Home,
  Hotel,
  Sparkles,
  Briefcase,
  SlidersHorizontal,
} from 'lucide-react';
import {
  OrganizationBranch,
  OrgContact,
} from '../../data/organizationData';
import { HOSPITALITY_ORGANIZATIONS } from '../../data/hospitalityData';

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

  // View Mode: DEFAULT TO LIST VIEW as requested by the user
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrgFilter, setSelectedOrgFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Inspection Modal for Property & Building details
  const [inspectingBranch, setInspectingBranch] = useState<OrganizationBranch | null>(null);

  // Manage Assigned Workforce modal
  const [managingWorkforceBranch, setManagingWorkforceBranch] = useState<OrganizationBranch | null>(null);
  const [tempAssignedContactIds, setTempAssignedContactIds] = useState<string[]>([]);

  // Add Branch modal
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [newOrgId, setNewOrgId] = useState('ORG-KHETAT-HQ');
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newNameAr, setNewNameAr] = useState('');
  const [newBuildingName, setNewBuildingName] = useState('');
  const [newBuildingNameAr, setNewBuildingNameAr] = useState('');
  const [newBuildingType, setNewBuildingType] = useState('Tower');
  const [newFloorsCount, setNewFloorsCount] = useState('12');
  const [newTotalUnits, setNewTotalUnits] = useState('150');
  const [newApartments, setNewApartments] = useState('80');
  const [newSuites, setNewSuites] = useState('40');
  const [newHotelRooms, setNewHotelRooms] = useState('30');
  const [newVillas, setNewVillas] = useState('0');
  const [newCommercial, setNewCommercial] = useState('0');
  const [newType, setNewType] = useState<OrganizationBranch['type']>('Hotel Property');
  const [newCity, setNewCity] = useState('Riyadh');
  const [newCityAr, setNewCityAr] = useState('الرياض');
  const [newDistrict, setNewDistrict] = useState('Al-Olaya District');
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newManagerName, setNewManagerName] = useState('');
  const [newManagedKeys, setNewManagedKeys] = useState('120');
  const [newBranchContacts, setNewBranchContacts] = useState<string[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Distinct Organizations available across all properties
  const organizationsList = useMemo(() => {
    const orgMap = new Map<string, { id: string; name: string; nameAr: string; count: number; badgeColor?: string }>();

    // Start with all active branches
    activeBranches.forEach((b) => {
      const orgId = b.organizationId || 'ORG-KHETAT-HQ';
      const orgName = b.organizationName || 'Khetat Hospitality Hub & Operations Ltd.';
      const orgNameAr = b.organizationNameAr || 'شركة خطط للضيافة وتقنية العمليات الفندقية';
      const badgeColor = b.organizationBadgeColor || 'bg-[#e8eeff] text-[#004a60] border-[#c3cce6]';

      if (!orgMap.has(orgId)) {
        orgMap.set(orgId, { id: orgId, name: orgName, nameAr: orgNameAr, count: 1, badgeColor });
      } else {
        const item = orgMap.get(orgId)!;
        item.count += 1;
      }
    });

    // Also include other registered hospitality organizations
    HOSPITALITY_ORGANIZATIONS.forEach((hOrg) => {
      if (!orgMap.has(hOrg.id)) {
        orgMap.set(hOrg.id, {
          id: hOrg.id,
          name: hOrg.name,
          nameAr: hOrg.nameAr,
          count: 0,
          badgeColor: hOrg.badgeColor,
        });
      }
    });

    return Array.from(orgMap.values());
  }, [activeBranches]);

  // Distinct Cities
  const citiesList = useMemo(() => {
    return Array.from(new Set(activeBranches.map((b) => b.city))).sort();
  }, [activeBranches]);

  // Filtered branches list
  const filteredBranches = useMemo(() => {
    return activeBranches.filter((b) => {
      // 1. Organization Filter
      const matchOrg =
        selectedOrgFilter === 'all' ||
        b.organizationId === selectedOrgFilter ||
        b.organizationName === selectedOrgFilter ||
        b.organizationNameAr === selectedOrgFilter;

      // 2. City Filter
      const matchCity = cityFilter === 'all' || b.city === cityFilter;

      // 3. Type Filter
      const matchType = typeFilter === 'all' || b.type === typeFilter;

      // 4. Search Query (Matches name, arabic name, building name, organization name, code, manager, city)
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.nameAr.includes(q) ||
        (b.buildingName && b.buildingName.toLowerCase().includes(q)) ||
        (b.buildingNameAr && b.buildingNameAr.includes(q)) ||
        (b.organizationName && b.organizationName.toLowerCase().includes(q)) ||
        (b.organizationNameAr && b.organizationNameAr.includes(q)) ||
        b.code.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.cityAr.includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.addressAr.includes(q) ||
        b.managerName.toLowerCase().includes(q) ||
        b.managerNameAr.includes(q);

      return matchOrg && matchCity && matchType && matchSearch;
    });
  }, [activeBranches, selectedOrgFilter, cityFilter, typeFilter, searchQuery]);

  // Key Aggregated Metrics
  const totalBuildingsCount = activeBranches.length;
  const totalUnitsInAllBuildings = activeBranches.reduce(
    (acc, b) => acc + (b.totalUnitsInBuilding || b.managedKeys || 0),
    0
  );
  const totalManagedKeys = activeBranches.reduce((acc, b) => acc + b.managedKeys, 0);
  const totalOrganizationsCount = organizationsList.filter((o) => o.count > 0).length;
  const averageUnitsPerBuilding =
    totalBuildingsCount > 0 ? Math.round(totalUnitsInAllBuildings / totalBuildingsCount) : 0;

  // Open Workforce Management modal
  const handleOpenManageWorkforce = (branch: OrganizationBranch) => {
    const assignedIds = contacts
      .filter((c) => c.assignedBranchIds.includes(branch.id))
      .map((c) => c.id);

    setManagingWorkforceBranch(branch);
    setTempAssignedContactIds(assignedIds);
  };

  // Save Workforce assignment for this branch
  const handleSaveBranchWorkforce = () => {
    if (!managingWorkforceBranch) return;

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

    const updatedBranch: OrganizationBranch = {
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

    const orgMatch = organizationsList.find((o) => o.id === newOrgId);
    const generatedId = `br-${Date.now()}`;
    const unitsTotal = parseInt(newTotalUnits, 10) || 100;
    const floors = parseInt(newFloorsCount, 10) || 10;

    const branch: OrganizationBranch = {
      id: generatedId,
      code: newCode || `BR-${newCity.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      name: newName,
      nameAr: newNameAr || newName,
      organizationId: newOrgId,
      organizationName: orgMatch?.name || 'Khetat Hospitality Hub & Operations Ltd.',
      organizationNameAr: orgMatch?.nameAr || 'شركة خطط للضيافة وتقنية العمليات الفندقية',
      organizationBadgeColor: orgMatch?.badgeColor || 'bg-[#e8eeff] text-[#004a60] border-[#c3cce6]',
      buildingName: newBuildingName || newName,
      buildingNameAr: newBuildingNameAr || newNameAr || newName,
      buildingType: newBuildingType,
      buildingTypeAr:
        newBuildingType === 'Executive Tower'
          ? 'برج إداري وفندقي'
          : newBuildingType === 'Mixed-Use Luxury Tower'
          ? 'برج فاخر متعدد الاستخدامات'
          : newBuildingType === '5-Star Hotel Building'
          ? 'مبنى فندقي 5 نجوم'
          : newBuildingType === 'Residential Compound'
          ? 'مجمع فلل ومساكن فندقية'
          : 'مبنى فندقي مخدوم',
      floorsCount: floors,
      totalUnitsInBuilding: unitsTotal,
      unitBreakdown: {
        apartments: parseInt(newApartments, 10) || 0,
        suites: parseInt(newSuites, 10) || 0,
        hotelRooms: parseInt(newHotelRooms, 10) || 0,
        villas: parseInt(newVillas, 10) || 0,
        commercialUnits: parseInt(newCommercial, 10) || 0,
      },
      type: newType,
      typeAr:
        newType === 'Headquarters'
          ? 'المقر الرئيسي'
          : newType === 'Regional Hub'
          ? 'فرع إقليمي'
          : newType === 'Resort Hub'
          ? 'فرع منتجعات التراث'
          : newType === 'Hotel Property'
          ? 'فندق سياحي فاخر'
          : newType === 'Tower'
          ? 'برج وأبراج فندقية'
          : 'مجمع سكني وفندقي',
      city: newCity,
      cityAr: newCityAr || newCity,
      district: newDistrict || 'Central Sector',
      address: newAddress || `${newCity}, Saudi Arabia`,
      addressAr: newAddress || `${newCityAr}، المملكة العربية السعودية`,
      shortAddress: `${newCity.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-4401`,
      phone: newPhone || '+966 11 456 7890',
      email: newEmail || `property.${newCity.toLowerCase()}@khetat.sa`,
      managerName: newManagerName || 'General Property Manager',
      managerNameAr: newManagerName || 'المدير العام للعقار',
      managerPhone: '+966 50 123 4567',
      assignedContactIds: newBranchContacts,
      managedKeys: parseInt(newManagedKeys, 10) || unitsTotal,
      status: 'Active',
    };

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
    setNewBuildingName('');
    setNewBuildingNameAr('');
    showToast(
      isArabic
        ? `تم تأسيس العقار والمبنى الجديد ${branch.nameAr} بنجاح`
        : `Established property & building ${branch.name}`
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

      {/* Top Header Card with Building Units & Organization Summary */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base font-bold text-[#161c27] flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#004a60]" />
              <span>{isArabic ? 'سجل العقارات والمباني للمشغلين' : 'Operators Properties & Buildings'}</span>
            </h2>
            <span className="text-[10px] font-bold bg-[#e8eeff] text-[#004a60] px-2.5 py-0.5 rounded-full border border-[#c3cce6]">
              {totalBuildingsCount} {isArabic ? 'مبنى / عقار مسجل' : 'Properties & Buildings'}
            </span>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {totalOrganizationsCount} {isArabic ? 'مؤسسات مشغلة' : 'Operating Organizations'}
            </span>
          </div>
          <p className="text-xs text-[#70787d] mt-1 max-w-2xl leading-relaxed">
            {isArabic
              ? 'عرض قائمة العقارات والمباني الفندقية مع إحصائيات دقيقة لعدد العقارات والوحدات السكنية في كل مبنى، وفلترة سريعة حسب اسم المؤسسة المشغلة والمدينة.'
              : 'Directory of operating hospitality buildings with accurate counts of real estate units per building, filtered by organization and city.'}
          </p>
        </div>

        {/* Highlight KPI Pills: Total units in buildings + View Mode Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
          {/* Prominent Units in Building KPI */}
          <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#e8eeff]/80 to-[#f1f3ff] border border-[#c3cce6] text-xs shadow-2xs">
            <div className="p-2 rounded-lg bg-[#004a60] text-white">
              <Home className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] font-semibold text-[#70787d]">
                {isArabic ? 'إجمالي العقارات والوحدات بالمباني' : 'Total Units in Buildings'}
              </div>
              <div className="text-sm font-extrabold text-[#004a60]">
                {totalUnitsInAllBuildings.toLocaleString()}{' '}
                <span className="text-[10px] font-semibold text-[#40484d]">
                  {isArabic ? 'عقار / وحدة' : 'Units'}
                </span>
              </div>
            </div>
            <div className="h-7 w-px bg-[#c3cce6]/80 hidden sm:block" />
            <div className="hidden sm:block">
              <div className="text-[10px] text-[#70787d]">{isArabic ? 'متوسط كل مبنى' : 'Avg / Building'}</div>
              <div className="font-bold text-[#161c27] text-xs">
                ~{averageUnitsPerBuilding} {isArabic ? 'وحدة' : 'Units'}
              </div>
            </div>
          </div>

          {/* View Mode Toggle: Default to List View as user requested */}
          <div className="flex items-center p-1 bg-[#f1f3ff] rounded-xl border border-[#e3e8f9]">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[#004a60] shadow-xs'
                  : 'text-[#70787d] hover:text-[#161c27]'
              }`}
              title={isArabic ? 'عرض الجدول والقائمة' : 'List View'}
            >
              <LayoutList className="h-3.5 w-3.5" />
              <span>{isArabic ? 'قائمة (List)' : 'List View'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-[#004a60] shadow-xs'
                  : 'text-[#70787d] hover:text-[#161c27]'
              }`}
              title={isArabic ? 'عرض البطاقات' : 'Grid Cards View'}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>{isArabic ? 'بطاقات' : 'Cards'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAddBranchModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>{isArabic ? 'إضافة عقار / مبنى' : 'Add Property'}</span>
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS BAR: ORGANIZATION FILTER & SEARCH */}
      <div className="bg-white rounded-2xl border border-[#e3e8f9] p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* ORGANIZATION FILTER DROPDOWN & SELECTOR */}
          <div className="flex items-center gap-2 flex-1 max-w-xl">
            <span className="text-xs font-bold text-[#161c27] flex items-center gap-1 shrink-0">
              <Building className="h-3.5 w-3.5 text-[#004a60]" />
              <span>{isArabic ? 'فلترة حسب المؤسسة (Organization):' : 'Filter by Organization:'}</span>
            </span>
            <div className="relative flex-1">
              <select
                value={selectedOrgFilter}
                onChange={(e) => setSelectedOrgFilter(e.target.value)}
                className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] py-2 px-3 text-xs font-bold text-[#004a60] focus:bg-white focus:border-[#004a60] outline-hidden cursor-pointer"
              >
                <option value="all">
                  {isArabic
                    ? `🏢 جميع المؤسسات (${activeBranches.length} عقار / مبنى)`
                    : `🏢 All Organizations (${activeBranches.length} properties)`}
                </option>
                {organizationsList
                  .filter((org) => org.count > 0)
                  .map((org) => (
                    <option key={org.id} value={org.id}>
                      {isArabic ? `${org.nameAr} (${org.count} عقار / مبنى)` : `${org.name} (${org.count} properties)`}
                    </option>
                  ))}
              </select>
            </div>
            {selectedOrgFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedOrgFilter('all')}
                className="text-[11px] font-bold text-[#004a60] hover:underline cursor-pointer px-1.5 py-1 bg-[#e8eeff] rounded-lg shrink-0"
              >
                {isArabic ? 'إلغاء الفلتر' : 'Reset'}
              </button>
            )}
          </div>

          {/* Quick Search Field */}
          <div className="relative md:w-80">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#70787d] ${
                isArabic ? 'right-3' : 'left-3'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isArabic
                  ? 'بحث باسم المؤسسة، المبنى، العقار، المدينة...'
                  : 'Search organization, building, property, city...'
              }
              className={`w-full rounded-xl border border-[#e3e8f9] bg-[#f9f9ff] py-2 text-xs text-[#161c27] focus:bg-white focus:border-[#004a60] outline-hidden ${
                isArabic ? 'pr-8 pl-3' : 'pl-8 pr-3'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={`absolute top-1/2 -translate-y-1/2 text-[#70787d] hover:text-[#161c27] p-1 ${
                  isArabic ? 'left-2.5' : 'right-2.5'
                }`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Organization Chips / Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-[#f1f3ff]">
          <span className="text-[11px] font-semibold text-[#70787d] shrink-0">
            {isArabic ? 'مؤسسات سريعة:' : 'Quick Select:'}
          </span>
          <button
            type="button"
            onClick={() => setSelectedOrgFilter('all')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedOrgFilter === 'all'
                ? 'bg-[#004a60] text-white shadow-2xs'
                : 'bg-[#f1f3ff] text-[#40484d] hover:bg-[#e8eeff]'
            }`}
          >
            {isArabic ? 'الكل' : 'All'} ({activeBranches.length})
          </button>
          {organizationsList
            .filter((org) => org.count > 0)
            .map((org) => {
              const isSelected = selectedOrgFilter === org.id || selectedOrgFilter === org.name;
              return (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => setSelectedOrgFilter(org.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#004a60] text-white shadow-2xs'
                      : 'bg-[#f1f3ff] text-[#40484d] hover:bg-[#e8eeff]'
                  }`}
                >
                  <span className="truncate max-w-[170px]">{isArabic ? org.nameAr : org.name}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white text-[#004a60]'
                    }`}
                  >
                    {org.count}
                  </span>
                </button>
              );
            })}
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-semibold text-[#70787d] shrink-0">
            {isArabic ? 'المدينة:' : 'City:'}
          </span>
          <button
            type="button"
            onClick={() => setCityFilter('all')}
            className={`rounded-md px-2 py-0.5 text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              cityFilter === 'all'
                ? 'bg-[#004a60] text-white shadow-2xs'
                : 'bg-[#f9f9ff] border border-[#e3e8f9] text-[#70787d] hover:bg-[#e8eeff]'
            }`}
          >
            {isArabic ? 'جميع المدن' : 'All Cities'}
          </button>
          {citiesList.map((city) => {
            const countInCity = activeBranches.filter((b) => b.city === city).length;
            const isSelected = cityFilter === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => setCityFilter(city)}
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#004a60] text-white shadow-2xs'
                    : 'bg-[#f9f9ff] border border-[#e3e8f9] text-[#50585e] hover:bg-[#e8eeff]'
                }`}
              >
                {city} ({countInCity})
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER RESULTS COUNTER */}
      <div className="flex items-center justify-between text-xs text-[#70787d] px-1">
        <span>
          {isArabic ? (
            <>
              عرض <strong className="text-[#161c27]">{filteredBranches.length}</strong> من إجمالي{' '}
              <strong className="text-[#004a60]">{activeBranches.length}</strong> مبنى وعقار
              {selectedOrgFilter !== 'all' && (
                <span className="mr-1 text-[#004a60] font-semibold">
                  (مفلتر حسب المؤسسة المختارة)
                </span>
              )}
            </>
          ) : (
            <>
              Showing <strong className="text-[#161c27]">{filteredBranches.length}</strong> of{' '}
              <strong className="text-[#004a60]">{activeBranches.length}</strong> properties
              {selectedOrgFilter !== 'all' && ' (filtered by organization)'}
            </>
          )}
        </span>

        <span className="text-[11px] font-semibold text-[#004a60]">
          {isArabic ? 'مجموع العقارات والوحدات في المعروض:' : 'Total Units in filtered view:'}{' '}
          <strong className="font-bold underline">
            {filteredBranches
              .reduce((acc, b) => acc + (b.totalUnitsInBuilding || b.managedKeys || 0), 0)
              .toLocaleString()}{' '}
            {isArabic ? 'عقار / وحدة' : 'units'}
          </strong>
        </span>
      </div>

      {/* EMPTY STATE */}
      {filteredBranches.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-[#c3cce6] p-12 text-center">
          <Building2 className="h-10 w-10 text-[#9ba4b5] mx-auto mb-3 opacity-60" />
          <h3 className="text-sm font-bold text-[#161c27]">
            {isArabic ? 'لا توجد عقارات مطابقة للفلتر المحدد' : 'No properties match the selected filters'}
          </h3>
          <p className="text-xs text-[#70787d] mt-1 max-w-sm mx-auto">
            {isArabic
              ? 'جرّب إعادة تعيين فلتر المؤسسة أو مسح نص البحث لعرض كافة العقارات والمباني.'
              : 'Try resetting the organization filter or clear the search query to show all properties.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedOrgFilter('all');
              setCityFilter('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#004a60] text-white text-xs font-bold shadow-xs hover:bg-[#074e64] cursor-pointer"
          >
            {isArabic ? 'إعادة ضبط الفلاتر' : 'Reset All Filters'}
          </button>
        </div>
      )}

      {/* VIEW MODE 1: LIST VIEW (TABLE) - EXPLICIT USER REQUIREMENT */}
      {viewMode === 'list' && filteredBranches.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e3e8f9] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
              <thead className="bg-[#f9f9ff] border-b border-[#e3e8f9] text-[#70787d] uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">{isArabic ? 'الرمز' : 'Code'}</th>
                  <th className="py-3 px-4">{isArabic ? 'اسم العقار والمبنى' : 'Property & Building'}</th>
                  <th className="py-3 px-4">{isArabic ? 'المؤسسة المشغلة' : 'Organization'}</th>
                  <th className="py-3 px-4">{isArabic ? 'المدينة والحي' : 'Location'}</th>
                  {/* PROMINENT COLUMN: NUMBER OF PROPERTIES / UNITS IN BUILDING */}
                  <th className="py-3 px-4 bg-[#e8eeff]/40 text-[#004a60] font-extrabold text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Home className="h-3.5 w-3.5 text-[#004a60]" />
                      <span>{isArabic ? 'عدد العقارات / الوحدات بالمبنى' : 'Units in Building'}</span>
                    </div>
                  </th>
                  <th className="py-3 px-4">{isArabic ? 'نوع المبنى' : 'Building Type'}</th>
                  <th className="py-3 px-4">{isArabic ? 'المدير والاتصال' : 'Manager'}</th>
                  <th className="py-3 px-4">{isArabic ? 'الكوادر المسندة' : 'Workforce'}</th>
                  <th className="py-3 px-4 text-center">{isArabic ? 'الحالة' : 'Status'}</th>
                  <th className="py-3 px-4 text-center">{isArabic ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8f9]">
                {filteredBranches.map((branch) => {
                  const linkedContacts = contacts.filter((c) =>
                    c.assignedBranchIds.includes(branch.id)
                  );
                  const units = branch.totalUnitsInBuilding || branch.managedKeys || 0;
                  const floors = branch.floorsCount || (units > 200 ? 24 : units > 80 ? 12 : 4);

                  return (
                    <tr
                      key={branch.id}
                      className="hover:bg-[#f1f3ff]/60 transition-colors group cursor-pointer"
                      onClick={() => setInspectingBranch(branch)}
                    >
                      {/* Code & Type */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[11px] text-[#004a60] whitespace-nowrap">
                        <span className="bg-[#e8eeff] border border-[#c3cce6] px-2 py-0.5 rounded-md">
                          {branch.code}
                        </span>
                      </td>

                      {/* Property & Building Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-xs text-[#161c27] group-hover:text-[#004a60] transition-colors leading-snug">
                          {isArabic ? branch.nameAr : branch.name}
                        </div>
                        <div className="text-[11px] text-[#70787d] mt-0.5 flex items-center gap-1">
                          <Building className="h-3 w-3 text-[#004a60] shrink-0" />
                          <span className="font-semibold text-[#40484d]">
                            {isArabic ? branch.buildingNameAr || branch.buildingName : branch.buildingName || branch.name}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#8a9299] truncate max-w-xs mt-0.5">
                          {isArabic ? branch.addressAr : branch.address} ({branch.shortAddress})
                        </div>
                      </td>

                      {/* Organization Name with Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                            branch.organizationBadgeColor || 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          <Building2 className="h-3 w-3 shrink-0" />
                          <span>
                            {isArabic
                              ? branch.organizationNameAr || 'شركة خطط للضيافة'
                              : branch.organizationName || 'Khetat Hospitality Hub'}
                          </span>
                        </span>
                      </td>

                      {/* City & District */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-[#161c27] flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#004a60]" />
                          <span>{isArabic ? branch.cityAr : branch.city}</span>
                        </div>
                        <div className="text-[10px] text-[#70787d]">{branch.district}</div>
                      </td>

                      {/* HIGHLIGHTED: NUMBER OF PROPERTIES / UNITS IN BUILDING */}
                      <td className="py-3.5 px-4 bg-[#e8eeff]/25 whitespace-nowrap">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-extrabold text-sm text-[#004a60]">
                            {units.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold text-[#40484d]">
                            {isArabic ? 'عقار / وحدة' : 'units'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-[#70787d]">
                          <span className="bg-white border border-[#c3cce6] px-1.5 py-0.2 rounded-md font-semibold text-[#004a60]">
                            {floors} {isArabic ? 'طابق' : 'Floors'}
                          </span>
                          {branch.unitBreakdown && (
                            <span className="text-[#8a9299] text-[9px] truncate max-w-[130px]">
                              {branch.unitBreakdown.apartments ? `${branch.unitBreakdown.apartments} شقة • ` : ''}
                              {branch.unitBreakdown.suites ? `${branch.unitBreakdown.suites} جناح` : ''}
                              {branch.unitBreakdown.villas ? `${branch.unitBreakdown.villas} فيلا` : ''}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Building Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f1f3ff] text-[#40484d] text-[10px] font-semibold border border-[#e3e8f9]">
                          <span>{isArabic ? branch.buildingTypeAr || branch.typeAr : branch.buildingType || branch.type}</span>
                        </span>
                      </td>

                      {/* Manager & Contact */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-[#161c27]">
                          {isArabic ? branch.managerNameAr : branch.managerName}
                        </div>
                        <div className="text-[10px] font-mono text-[#004a60]">
                          {branch.managerPhone || branch.phone}
                        </div>
                      </td>

                      {/* Workforce */}
                      <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <div className="flex -space-x-1.5 rtl:space-x-reverse overflow-hidden">
                            {linkedContacts.slice(0, 3).map((c) => (
                              <div
                                key={c.id}
                                className={`h-6 w-6 rounded-full text-white font-bold text-[9px] flex items-center justify-center border border-white ${c.avatarColor}`}
                                title={`${isArabic ? c.nameAr : c.name} (${isArabic ? c.roleAr : c.role})`}
                              >
                                {c.initials}
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenManageWorkforce(branch)}
                            className="text-[10px] font-bold text-[#004a60] hover:underline px-2 py-0.5 bg-[#e8eeff] rounded-md cursor-pointer"
                          >
                            {linkedContacts.length} {isArabic ? 'كوادر' : 'Staff'}
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{branch.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setInspectingBranch(branch)}
                            className="p-1.5 rounded-lg text-[#70787d] hover:text-[#004a60] hover:bg-[#e8eeff] cursor-pointer"
                            title={isArabic ? 'عرض تفاصيل المبنى والعقارات' : 'View Building Details'}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenManageWorkforce(branch)}
                            className="p-1.5 rounded-lg text-[#70787d] hover:text-[#004a60] hover:bg-[#e8eeff] cursor-pointer"
                            title={isArabic ? 'إدارة فريق العمل المسند' : 'Manage Workforce'}
                          >
                            <Sliders className="h-4 w-4" />
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

      {/* VIEW MODE 2: CARDS GRID (ALTERNATIVE) */}
      {viewMode === 'cards' && filteredBranches.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredBranches.map((branch) => {
            const linkedContacts = contacts.filter((c) =>
              c.assignedBranchIds.includes(branch.id)
            );
            const units = branch.totalUnitsInBuilding || branch.managedKeys || 0;
            const floors = branch.floorsCount || (units > 200 ? 24 : units > 80 ? 12 : 4);

            return (
              <div
                key={branch.id}
                className="bg-white rounded-2xl border border-[#e3e8f9] p-5 shadow-2xs hover:shadow-md hover:border-[#004a60]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge Strip with Organization */}
                  <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[11px] font-bold text-[#004a60] bg-[#e8eeff] px-2 py-0.5 rounded-lg border border-[#c3cce6]">
                        {branch.code}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold border ${
                          branch.organizationBadgeColor || 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        <Building2 className="h-3 w-3 shrink-0" />
                        <span>
                          {isArabic
                            ? branch.organizationNameAr || 'شركة خطط للضيافة'
                            : branch.organizationName || 'Khetat Hospitality Hub'}
                        </span>
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>{branch.status}</span>
                    </span>
                  </div>

                  {/* Property Name & Building Name */}
                  <h3 className="text-base font-bold text-[#161c27] leading-snug">
                    {isArabic ? branch.nameAr : branch.name}
                  </h3>
                  <div className="text-xs text-[#004a60] font-semibold mt-1 flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-[#004a60] shrink-0" />
                    <span>
                      {isArabic ? branch.buildingNameAr || branch.buildingName : branch.buildingName || branch.name}
                    </span>
                    <span className="text-[#c3cce6]">•</span>
                    <span className="text-[#70787d] font-normal">
                      {isArabic ? branch.buildingTypeAr || branch.typeAr : branch.buildingType || branch.type}
                    </span>
                  </div>

                  <p className="text-xs text-[#70787d] mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#004a60] shrink-0" />
                    <span>
                      {isArabic ? branch.addressAr : branch.address} ({branch.shortAddress})
                    </span>
                  </p>

                  {/* PROMINENT UNITS IN BUILDING CARD */}
                  <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-[#e8eeff]/60 to-[#f1f3ff] border border-[#c3cce6] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#70787d] block uppercase tracking-wider">
                        {isArabic ? 'عدد العقارات والوحدات في المبنى' : 'Total Units in Building'}
                      </span>
                      <div className="text-base font-extrabold text-[#004a60] flex items-baseline gap-1 mt-0.5">
                        <span>{units.toLocaleString()}</span>
                        <span className="text-xs font-bold text-[#40484d]">
                          {isArabic ? 'عقار / وحدة سكنية' : 'Units'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right rtl:text-left text-xs">
                      <span className="bg-white border border-[#c3cce6] px-2 py-1 rounded-lg font-bold text-[#004a60] inline-block">
                        {floors} {isArabic ? 'طوابق' : 'Floors'}
                      </span>
                      <div className="text-[10px] text-[#70787d] mt-1">
                        {branch.managedKeys} {isArabic ? 'مفتاح مشغل' : 'keys active'}
                      </div>
                    </div>
                  </div>

                  {/* Manager & Direct Phone */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#f9f9ff] p-3 rounded-xl border border-[#e3e8f9] text-xs">
                    <div>
                      <span className="text-[10px] text-[#70787d] block font-medium">
                        {isArabic ? 'مدير العقار / الفرع' : 'Property Manager'}
                      </span>
                      <div className="font-bold text-[#161c27] mt-0.5">
                        {isArabic ? branch.managerNameAr : branch.managerName}
                      </div>
                      <div className="text-[10px] text-[#004a60] font-mono mt-0.5">
                        {branch.managerPhone || branch.phone}
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

                  {/* Linked Workforce */}
                  <div className="mt-3.5 pt-3 border-t border-[#e3e8f9]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-[#161c27] flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-[#004a60]" />
                        <span>
                          {isArabic
                            ? `الكوادر وفريق العمل المسند (${linkedContacts.length})`
                            : `Workforce Linked (${linkedContacts.length})`}
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleOpenManageWorkforce(branch)}
                        className="text-xs font-bold text-[#004a60] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sliders className="h-3 w-3" />
                        <span>{isArabic ? 'ربط كوادر / تعديل' : 'Manage'}</span>
                      </button>
                    </div>

                    {linkedContacts.length === 0 ? (
                      <div className="p-2.5 text-center bg-[#f9f9ff] rounded-xl border border-dashed border-[#c3cce6] text-xs text-[#70787d]">
                        {isArabic
                          ? 'لم يتم إسناد أي موظف أو كادر لهذا العقار حتى الآن'
                          : 'No workforce currently assigned to this property'}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {linkedContacts.map((contact) => (
                          <div
                            key={contact.id}
                            className="flex items-center gap-2 p-2 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9]"
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
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="mt-4 pt-3 border-t border-[#e3e8f9] flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setInspectingBranch(branch)}
                    className="flex items-center gap-1.5 text-[#004a60] hover:underline font-bold text-xs cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>{isArabic ? 'عرض بطاقة المبنى الكاملة' : 'View Building Card'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenManageWorkforce(branch)}
                    className="px-3 py-1.5 rounded-lg bg-[#004a60] hover:bg-[#074e64] text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Users className="h-3 w-3" />
                    <span>{isArabic ? 'إدارة الكوادر' : 'Link Workforce'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PROPERTY & BUILDING INSPECTION MODAL */}
      {inspectingBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#e3e8f9] my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9] mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#004a60] text-white">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#161c27]">
                    {isArabic ? inspectingBranch.nameAr : inspectingBranch.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[10px] font-bold text-[#004a60] bg-[#e8eeff] px-2 py-0.2 rounded-md">
                      {inspectingBranch.code}
                    </span>
                    <span className="text-xs text-[#70787d]">
                      {isArabic ? inspectingBranch.buildingNameAr : inspectingBranch.buildingName}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectingBranch(null)}
                className="text-[#70787d] hover:text-[#161c27] p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Organization Tag */}
            <div className="p-3 rounded-xl bg-[#f9f9ff] border border-[#e3e8f9] flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-[#004a60]" />
                <div>
                  <span className="text-[10px] text-[#70787d] block font-medium">
                    {isArabic ? 'المؤسسة المالكة أو المشغلة:' : 'Operating Organization:'}
                  </span>
                  <span className="font-bold text-xs text-[#161c27]">
                    {isArabic
                      ? inspectingBranch.organizationNameAr || 'شركة خطط للضيافة'
                      : inspectingBranch.organizationName || 'Khetat Hospitality Hub'}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#004a60] bg-[#e8eeff] px-2.5 py-1 rounded-lg">
                {inspectingBranch.city} • {inspectingBranch.district}
              </span>
            </div>

            {/* Core Units In Building Breakdown */}
            <div className="bg-gradient-to-r from-[#e8eeff]/60 to-[#f1f3ff] rounded-xl p-4 border border-[#c3cce6] mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-[#004a60]" />
                  <div>
                    <h4 className="text-sm font-extrabold text-[#004a60]">
                      {isArabic ? 'عدد العقارات والوحدات في المبنى' : 'Units & Properties in Building'}
                    </h4>
                    <span className="text-[11px] text-[#70787d]">
                      {isArabic
                        ? `إجمالي الوحدات العقارية المسجلة في هيكل ${inspectingBranch.buildingNameAr || inspectingBranch.buildingName || 'المبنى'}`
                        : `Total registered units in ${inspectingBranch.buildingName || 'the building'}`}
                    </span>
                  </div>
                </div>

                <div className="text-right rtl:text-left">
                  <span className="text-xl font-extrabold text-[#004a60]">
                    {(inspectingBranch.totalUnitsInBuilding || inspectingBranch.managedKeys || 0).toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-[#40484d] block">
                    {isArabic ? 'عقار / وحدة' : 'Units'}
                  </span>
                </div>
              </div>

              {/* Units Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#c3cce6]/60">
                <div className="bg-white p-2 rounded-lg border border-[#e3e8f9] text-center">
                  <span className="text-[10px] text-[#70787d] block">{isArabic ? 'طوابق المبنى' : 'Floors'}</span>
                  <span className="text-xs font-bold text-[#161c27]">
                    {inspectingBranch.floorsCount || 12} {isArabic ? 'طابق' : 'Floors'}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-[#e3e8f9] text-center">
                  <span className="text-[10px] text-[#70787d] block">
                    {isArabic ? 'شقق فندقية' : 'Apartments'}
                  </span>
                  <span className="text-xs font-bold text-[#004a60]">
                    {inspectingBranch.unitBreakdown?.apartments || Math.round((inspectingBranch.totalUnitsInBuilding || 100) * 0.6)}{' '}
                    {isArabic ? 'شقة' : 'Apts'}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-[#e3e8f9] text-center">
                  <span className="text-[10px] text-[#70787d] block">{isArabic ? 'أجنحة فاخرة' : 'Suites'}</span>
                  <span className="text-xs font-bold text-emerald-700">
                    {inspectingBranch.unitBreakdown?.suites || Math.round((inspectingBranch.totalUnitsInBuilding || 100) * 0.25)}{' '}
                    {isArabic ? 'جناح' : 'Suites'}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-[#e3e8f9] text-center">
                  <span className="text-[10px] text-[#70787d] block">{isArabic ? 'مفاتيح مشغلة' : 'Keys Active'}</span>
                  <span className="text-xs font-bold text-indigo-700">
                    {inspectingBranch.managedKeys} {isArabic ? 'مفتاح' : 'Keys'}
                  </span>
                </div>
              </div>
            </div>

            {/* Address & Manager Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
              <div className="p-3 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff]">
                <span className="text-[10px] text-[#70787d] font-semibold block mb-1">
                  {isArabic ? 'العنوان الوطني والإحداثيات' : 'Address Coordinates'}
                </span>
                <p className="font-semibold text-[#161c27]">
                  {isArabic ? inspectingBranch.addressAr : inspectingBranch.address}
                </p>
                <div className="text-[10px] text-[#004a60] font-mono mt-1">
                  Short Code: {inspectingBranch.shortAddress}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff]">
                <span className="text-[10px] text-[#70787d] font-semibold block mb-1">
                  {isArabic ? 'المدير والتواصل الميداني' : 'Manager & Field Contact'}
                </span>
                <p className="font-bold text-[#161c27]">
                  {isArabic ? inspectingBranch.managerNameAr : inspectingBranch.managerName}
                </p>
                <div className="text-[10px] text-[#004a60] font-mono mt-0.5">
                  {inspectingBranch.managerPhone || inspectingBranch.phone}
                </div>
                <div className="text-[10px] text-[#70787d] truncate mt-0.5">
                  {inspectingBranch.email}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3e8f9]">
              <button
                type="button"
                onClick={() => {
                  const b = inspectingBranch;
                  setInspectingBranch(null);
                  handleOpenManageWorkforce(b);
                }}
                className="px-4 py-2 rounded-xl bg-[#004a60] text-white text-xs font-bold hover:bg-[#074e64] cursor-pointer flex items-center gap-1.5"
              >
                <Users className="h-4 w-4" />
                <span>{isArabic ? 'إدارة الكوادر المسندة' : 'Manage Workforce'}</span>
              </button>
              <button
                type="button"
                onClick={() => setInspectingBranch(null)}
                className="px-4 py-2 rounded-xl border border-[#c3cce6] text-[#70787d] hover:bg-[#f9f9ff] text-xs font-semibold cursor-pointer"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE WORKFORCE MODAL */}
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
                      ? `ربط الكوادر وفريق العمل بعقار: ${managingWorkforceBranch.nameAr}`
                      : `Link Workforce to: ${managingWorkforceBranch.name}`}
                  </h3>
                  <p className="text-[11px] text-[#70787d]">
                    {isArabic
                      ? 'حدد أعضاء فريق العمل المعتمدين والمكلفين بالعمل في هذا الموقع والعقار'
                      : 'Select authorized workforce contacts stationed or assigned to this property.'}
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

      {/* ADD NEW PROPERTY & BUILDING MODAL */}
      {isAddBranchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e3e8f9] my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f9] mb-4">
              <div>
                <h3 className="text-base font-bold text-[#161c27]">
                  {isArabic ? 'إضافة وتسجيل عقار ومبنى جديد' : 'Add New Property & Building'}
                </h3>
                <p className="text-xs text-[#70787d]">
                  {isArabic
                    ? 'تسجيل منشأة أو مبنى فندقي، وتحديد عدد الوحدات والعقارات بالمبنى والمؤسسة التابعة'
                    : 'Register operating building, units count, and affiliated organization'}
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
              {/* Organization Selector */}
              <div>
                <label className="font-bold text-[#161c27] block mb-1">
                  {isArabic ? 'المؤسسة المشغلة التابع لها العقار *' : 'Operating Organization *'}
                </label>
                <select
                  value={newOrgId}
                  onChange={(e) => setNewOrgId(e.target.value)}
                  className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs font-bold text-[#004a60] focus:border-[#004a60] outline-hidden"
                >
                  {organizationsList.map((org) => (
                    <option key={org.id} value={org.id}>
                      {isArabic ? org.nameAr : org.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'اسم العقار (English) *' : 'Property Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Al-Olaya Executive Tower & Hotel"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'اسم العقار بالعربية *' : 'Property Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    value={newNameAr}
                    onChange={(e) => setNewNameAr(e.target.value)}
                    placeholder="مثال: فندق وبرج العليا الفندقي"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
              </div>

              {/* Building Name & Units in Building */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#e8eeff]/40 p-3 rounded-xl border border-[#c3cce6]">
                <div>
                  <label className="font-bold text-[#004a60] block mb-1">
                    {isArabic ? 'اسم المبنى / البرج' : 'Building Name'}
                  </label>
                  <input
                    type="text"
                    value={newBuildingName}
                    onChange={(e) => setNewBuildingName(e.target.value)}
                    placeholder="e.g. Tower 4 / Block A"
                    className="w-full rounded-lg border border-[#c3cce6] bg-white p-2 text-xs focus:border-[#004a60] outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#004a60] block mb-1">
                    {isArabic ? 'عدد العقارات / الوحدات *' : 'Total Units in Building *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={newTotalUnits}
                    onChange={(e) => setNewTotalUnits(e.target.value)}
                    placeholder="e.g. 150"
                    className="w-full rounded-lg border border-[#c3cce6] bg-white p-2 text-xs focus:border-[#004a60] outline-hidden font-mono font-bold text-[#004a60]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#004a60] block mb-1">
                    {isArabic ? 'عدد الطوابق' : 'Building Floors'}
                  </label>
                  <input
                    type="number"
                    value={newFloorsCount}
                    onChange={(e) => setNewFloorsCount(e.target.value)}
                    placeholder="e.g. 16"
                    className="w-full rounded-lg border border-[#c3cce6] bg-white p-2 text-xs focus:border-[#004a60] outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* City and Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'نوع المنشأة' : 'Property Type'}
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  >
                    <option value="Hotel Property">Hotel Property (فندق سياحي)</option>
                    <option value="Tower">Tower (برج فندقي شاهق)</option>
                    <option value="Residential Complex">Residential Complex (مجمع شقق / فلل)</option>
                    <option value="Resort Hub">Resort Hub (منتجع تراثي أو ساحلي)</option>
                    <option value="Headquarters">Headquarters (المقر الرئيسي)</option>
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
                        e.target.value === 'Riyadh'
                          ? 'الرياض'
                          : e.target.value === 'Jeddah'
                          ? 'جدة'
                          : e.target.value === 'Makkah'
                          ? 'مكة المكرمة'
                          : e.target.value === 'Madinah'
                          ? 'المدينة المنورة'
                          : e.target.value === 'AlUla'
                          ? 'العلا'
                          : e.target.value === 'Al Khobar'
                          ? 'الخبر'
                          : e.target.value
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
                    <option value="Taif">Taif (الطائف)</option>
                    <option value="Red Sea">Red Sea (البحر الأحمر)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'الحي' : 'District'}
                  </label>
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    placeholder="Al-Olaya / Corniche"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
              </div>

              {/* Manager & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'اسم مدير العقار' : 'Property Manager'}
                  </label>
                  <input
                    type="text"
                    value={newManagerName}
                    onChange={(e) => setNewManagerName(e.target.value)}
                    placeholder="Eng. Abdullah Al-Harbi"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#161c27] block mb-1">
                    {isArabic ? 'هاتف التواصل' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+966 50 123 4567"
                    className="w-full rounded-lg border border-[#c3cce6] p-2 text-xs focus:border-[#004a60] outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Initial Workforce Assignment */}
              <div className="pt-2 border-t border-[#e3e8f9]">
                <label className="font-bold text-[#161c27] block mb-1">
                  {isArabic ? 'إسناد الكوادر الأولية للعقار:' : 'Assign Initial Workforce:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-28 overflow-y-auto p-1.5 rounded-xl border border-[#e3e8f9] bg-[#f9f9ff]">
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
                  <span>{isArabic ? 'تأسيس العقار والمبنى' : 'Create Property'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
