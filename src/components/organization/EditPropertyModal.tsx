import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Check,
  Building2,
  Building,
  Layers,
  MapPin,
  Phone,
  Mail,
  Globe,
  Plus,
  Trash2,
  Edit3,
  Sliders,
  DollarSign,
  AlertCircle,
  Sparkles,
  Home,
  CheckCircle2,
  Hash,
  ArrowUpDown,
  Tag,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import {
  OrganizationBranch,
  PropertyUnitType,
  PropertyFloor,
  PropertyUnit,
} from '../../data/organizationData';

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
  branch?: OrganizationBranch | null;
  isCreate?: boolean;
  onSave: (property: OrganizationBranch) => void;
  organizationsList?: { id: string; name: string; nameAr: string }[];
}

export const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  isOpen,
  onClose,
  isArabic,
  branch,
  isCreate = false,
  onSave,
  organizationsList = [],
}) => {
  // Default values
  const defaultUnitTypes: PropertyUnitType[] = [
    { id: 'ut-deluxe', name: 'Deluxe Room', nameAr: 'غرفة ديلوكس فاخرة', dailyRate: 400.0, monthlyRate: 8000.0, unitsCount: 10 },
    { id: 'ut-exec', name: 'Executive Room', nameAr: 'غرفة رجال الأعمال التنفيذية', dailyRate: 600.0, monthlyRate: 12000.0, unitsCount: 11 },
    { id: 'ut-standard', name: 'Standard Room', nameAr: 'غرفة قياسية كلاسيكية', dailyRate: 250.0, monthlyRate: 5000.0, unitsCount: 10 },
  ];

  const defaultFloors: PropertyFloor[] = [
    {
      id: 'fl-first',
      name: 'First Floor',
      nameAr: 'الدور الأول',
      order: 2,
      roomCodes: [
        'First Floor-111', 'First Floor-112', 'First Floor-113', 'First Floor-114',
        'First Floor-115', 'First Floor-116', 'First Floor-117', 'First Floor-118',
        'First Floor-119', 'First Floor-120',
      ],
    },
    {
      id: 'fl-ground',
      name: 'Ground Floor',
      nameAr: 'الدور الأرضي',
      order: 1,
      roomCodes: [
        'Ground Floor-101', 'Ground Floor-102', 'Ground Floor-103', 'Ground Floor-104',
        'Ground Floor-105', 'Ground Floor-106', 'Ground Floor-107', 'Ground Floor-108',
        'Ground Floor-109', 'Ground Floor-110',
      ],
    },
    {
      id: 'fl-second',
      name: 'Second Floor',
      nameAr: 'الدور الثاني',
      order: 3,
      roomCodes: [
        'Second Floor-121', 'Second Floor-122', 'Second Floor-123', 'Second Floor-124',
        'Second Floor-125', 'Second Floor-126', 'Second Floor-127', 'Second Floor-128',
        'Second Floor-129', 'Second Floor-130',
      ],
    },
    {
      id: 'fl-secret',
      name: 'secret floor',
      nameAr: 'الدور السري / الرووف',
      order: 4,
      roomCodes: ['secret floor-450'],
    },
  ];

  const defaultUnits: PropertyUnit[] = [
    { id: 'u-101', unitNumber: 'Ground Floor-101', floorId: 'fl-ground', floorName: 'Ground Floor', unitTypeId: 'ut-standard', unitTypeName: 'Standard Room', dailyRate: 250, monthlyRate: 5000, status: 'Available' },
    { id: 'u-102', unitNumber: 'Ground Floor-102', floorId: 'fl-ground', floorName: 'Ground Floor', unitTypeId: 'ut-standard', unitTypeName: 'Standard Room', dailyRate: 250, monthlyRate: 5000, status: 'Occupied' },
    { id: 'u-103', unitNumber: 'Ground Floor-103', floorId: 'fl-ground', floorName: 'Ground Floor', unitTypeId: 'ut-standard', unitTypeName: 'Standard Room', dailyRate: 250, monthlyRate: 5000, status: 'Available' },
    { id: 'u-104', unitNumber: 'Ground Floor-104', floorId: 'fl-ground', floorName: 'Ground Floor', unitTypeId: 'ut-standard', unitTypeName: 'Standard Room', dailyRate: 250, monthlyRate: 5000, status: 'Available' },
    { id: 'u-105', unitNumber: 'Ground Floor-105', floorId: 'fl-ground', floorName: 'Ground Floor', unitTypeId: 'ut-standard', unitTypeName: 'Standard Room', dailyRate: 250, monthlyRate: 5000, status: 'Occupied' },
    { id: 'u-106', unitNumber: 'Ground Floor-106', floorId: 'fl-ground', floorName: 'Ground Floor', unitTypeId: 'ut-standard', unitTypeName: 'Standard Room', dailyRate: 250, monthlyRate: 5000, status: 'Available' },
    { id: 'u-107', unitNumber: 'Ground Floor-107', floorId: 'fl-ground', floorName: 'Ground Floor', unitTypeId: 'ut-standard', unitTypeName: 'Standard Room', dailyRate: 250, monthlyRate: 5000, status: 'Available' },
    { id: 'u-108', unitNumber: 'Ground Floor-108', floorId: 'fl-ground', floorName: 'Ground Floor', unitTypeId: 'ut-standard', unitTypeName: 'Standard Room', dailyRate: 250, monthlyRate: 5000, status: 'Maintenance' },
    { id: 'u-109', unitNumber: 'Ground Floor-109', floorId: 'fl-ground', floorName: 'Ground Floor', unitTypeId: 'ut-standard', unitTypeName: 'Standard Room', dailyRate: 250, monthlyRate: 5000, status: 'Available' },
    { id: 'u-110', unitNumber: 'Ground Floor-110', floorId: 'fl-ground', floorName: 'Ground Floor', unitTypeId: 'ut-standard', unitTypeName: 'Standard Room', dailyRate: 250, monthlyRate: 5000, status: 'Available' },

    { id: 'u-111', unitNumber: 'First Floor-111', floorId: 'fl-first', floorName: 'First Floor', unitTypeId: 'ut-deluxe', unitTypeName: 'Deluxe Room', dailyRate: 400, monthlyRate: 8000, status: 'Occupied' },
    { id: 'u-112', unitNumber: 'First Floor-112', floorId: 'fl-first', floorName: 'First Floor', unitTypeId: 'ut-deluxe', unitTypeName: 'Deluxe Room', dailyRate: 400, monthlyRate: 8000, status: 'Occupied' },
    { id: 'u-113', unitNumber: 'First Floor-113', floorId: 'fl-first', floorName: 'First Floor', unitTypeId: 'ut-deluxe', unitTypeName: 'Deluxe Room', dailyRate: 400, monthlyRate: 8000, status: 'Available' },
    { id: 'u-114', unitNumber: 'First Floor-114', floorId: 'fl-first', floorName: 'First Floor', unitTypeId: 'ut-deluxe', unitTypeName: 'Deluxe Room', dailyRate: 400, monthlyRate: 8000, status: 'Available' },
    { id: 'u-115', unitNumber: 'First Floor-115', floorId: 'fl-first', floorName: 'First Floor', unitTypeId: 'ut-deluxe', unitTypeName: 'Deluxe Room', dailyRate: 400, monthlyRate: 8000, status: 'Occupied' },
    { id: 'u-116', unitNumber: 'First Floor-116', floorId: 'fl-first', floorName: 'First Floor', unitTypeId: 'ut-deluxe', unitTypeName: 'Deluxe Room', dailyRate: 400, monthlyRate: 8000, status: 'Available' },
    { id: 'u-117', unitNumber: 'First Floor-117', floorId: 'fl-first', floorName: 'First Floor', unitTypeId: 'ut-deluxe', unitTypeName: 'Deluxe Room', dailyRate: 400, monthlyRate: 8000, status: 'Available' },
    { id: 'u-118', unitNumber: 'First Floor-118', floorId: 'fl-first', floorName: 'First Floor', unitTypeId: 'ut-deluxe', unitTypeName: 'Deluxe Room', dailyRate: 400, monthlyRate: 8000, status: 'Occupied' },
    { id: 'u-119', unitNumber: 'First Floor-119', floorId: 'fl-first', floorName: 'First Floor', unitTypeId: 'ut-deluxe', unitTypeName: 'Deluxe Room', dailyRate: 400, monthlyRate: 8000, status: 'Available' },
    { id: 'u-120', unitNumber: 'First Floor-120', floorId: 'fl-first', floorName: 'First Floor', unitTypeId: 'ut-deluxe', unitTypeName: 'Deluxe Room', dailyRate: 400, monthlyRate: 8000, status: 'Reserved' },

    { id: 'u-121', unitNumber: 'Second Floor-121', floorId: 'fl-second', floorName: 'Second Floor', unitTypeId: 'ut-exec', unitTypeName: 'Executive Room', dailyRate: 600, monthlyRate: 12000, status: 'Occupied' },
    { id: 'u-122', unitNumber: 'Second Floor-122', floorId: 'fl-second', floorName: 'Second Floor', unitTypeId: 'ut-exec', unitTypeName: 'Executive Room', dailyRate: 600, monthlyRate: 12000, status: 'Available' },
    { id: 'u-123', unitNumber: 'Second Floor-123', floorId: 'fl-second', floorName: 'Second Floor', unitTypeId: 'ut-exec', unitTypeName: 'Executive Room', dailyRate: 600, monthlyRate: 12000, status: 'Available' },
    { id: 'u-124', unitNumber: 'Second Floor-124', floorId: 'fl-second', floorName: 'Second Floor', unitTypeId: 'ut-exec', unitTypeName: 'Executive Room', dailyRate: 600, monthlyRate: 12000, status: 'Occupied' },
    { id: 'u-125', unitNumber: 'Second Floor-125', floorId: 'fl-second', floorName: 'Second Floor', unitTypeId: 'ut-exec', unitTypeName: 'Executive Room', dailyRate: 600, monthlyRate: 12000, status: 'Occupied' },
    { id: 'u-126', unitNumber: 'Second Floor-126', floorId: 'fl-second', floorName: 'Second Floor', unitTypeId: 'ut-exec', unitTypeName: 'Executive Room', dailyRate: 600, monthlyRate: 12000, status: 'Available' },
    { id: 'u-127', unitNumber: 'Second Floor-127', floorId: 'fl-second', floorName: 'Second Floor', unitTypeId: 'ut-exec', unitTypeName: 'Executive Room', dailyRate: 600, monthlyRate: 12000, status: 'Reserved' },
    { id: 'u-128', unitNumber: 'Second Floor-128', floorId: 'fl-second', floorName: 'Second Floor', unitTypeId: 'ut-exec', unitTypeName: 'Executive Room', dailyRate: 600, monthlyRate: 12000, status: 'Available' },
    { id: 'u-129', unitNumber: 'Second Floor-129', floorId: 'fl-second', floorName: 'Second Floor', unitTypeId: 'ut-exec', unitTypeName: 'Executive Room', dailyRate: 600, monthlyRate: 12000, status: 'Available' },
    { id: 'u-130', unitNumber: 'Second Floor-130', floorId: 'fl-second', floorName: 'Second Floor', unitTypeId: 'ut-exec', unitTypeName: 'Executive Room', dailyRate: 600, monthlyRate: 12000, status: 'Occupied' },

    { id: 'u-450', unitNumber: 'secret floor-450', floorId: 'fl-secret', floorName: 'secret floor', unitTypeId: 'ut-exec', unitTypeName: 'Executive Room', dailyRate: 600, monthlyRate: 12000, status: 'Occupied' },
  ];

  // State
  const [name, setName] = useState(branch?.name || '');
  const [nameAr, setNameAr] = useState(branch?.nameAr || '');
  const [code, setCode] = useState(branch?.code || `RHSA${Math.floor(1000 + Math.random() * 9000)}`);
  const [propertyType, setPropertyType] = useState<string>(branch?.buildingType || 'Hotel');
  const [country, setCountry] = useState(branch?.country || 'Saudi Arabia');
  const [stateRegion, setStateRegion] = useState(branch?.stateRegion || 'Riyadh');
  const [city, setCity] = useState(branch?.city || 'Riyadh');
  const [cityAr, setCityAr] = useState(branch?.cityAr || 'الرياض');
  const [district, setDistrict] = useState(branch?.district || 'Al-Olaya District');
  const [postalCode, setPostalCode] = useState(branch?.postalCode || '12345');
  const [address, setAddress] = useState(branch?.address || 'King Fahd Road, Al-Olaya, Riyadh 12345, Saudi Arabia');
  const [addressAr, setAddressAr] = useState(branch?.addressAr || 'طريق الملك فهد، حي العليا، الرياض 12345، المملكة العربية السعودية');
  const [phone, setPhone] = useState(branch?.phone || '+966 11 234 5678');
  const [email, setEmail] = useState(branch?.email || 'info@grandhotel.com');
  const [website, setWebsite] = useState(branch?.website || 'https://www.grandhotel.com');
  const [organizationId, setOrganizationId] = useState(branch?.organizationId || 'ORG-KHETAT-HQ');
  const [organizationName, setOrganizationName] = useState(
    branch?.organizationName || 'Khetat Hospitality Hub & Operations Ltd.'
  );
  const [organizationNameAr, setOrganizationNameAr] = useState(
    branch?.organizationNameAr || 'شركة خطط للضيافة وتقنية العمليات الفندقية'
  );

  // Subscription Quota Limit
  const [subscriptionLimit, setSubscriptionLimit] = useState<number>(
    branch?.subscriptionLimit || 35
  );
  const [subscriptionPlanName, setSubscriptionPlanName] = useState<string>(
    branch?.subscriptionPlanName || 'Building Plans - Tier 2 (Growth & Capped)'
  );

  // Property Structure State
  const [unitTypes, setUnitTypes] = useState<PropertyUnitType[]>(
    branch?.unitTypes && branch.unitTypes.length > 0 ? branch.unitTypes : defaultUnitTypes
  );

  const [floors, setFloors] = useState<PropertyFloor[]>(
    branch?.floors && branch.floors.length > 0 ? branch.floors : defaultFloors
  );

  const [units, setUnits] = useState<PropertyUnit[]>(
    branch?.units && branch.units.length > 0 ? branch.units : defaultUnits
  );

  // Synchronize when branch or isCreate changes
  useEffect(() => {
    if (isOpen) {
      if (isCreate || !branch) {
        setName("Mohran's Property");
        setNameAr('عقار مهران الفندقي');
        setCode('RHSA1234');
        setPropertyType('Hotel');
        setCountry('Saudi Arabia');
        setStateRegion('Riyadh');
        setCity('Riyadh');
        setCityAr('الرياض');
        setDistrict('Al-Olaya District');
        setPostalCode('12345');
        setAddress('King Fahd Road, Al-Olaya, Riyadh 12345, Saudi Arabia');
        setAddressAr('طريق الملك فهد، حي العليا، الرياض 12345، المملكة العربية السعودية');
        setPhone('+966 11 234 5678');
        setEmail('info@grandhotel.com');
        setWebsite('https://www.grandhotel.com');
        setSubscriptionLimit(35);
        setSubscriptionPlanName('Building Plans - Tier 2 (Growth & Capped)');
        setUnitTypes(defaultUnitTypes);
        setFloors(defaultFloors);
        setUnits(defaultUnits);
      } else {
        setName(branch.name);
        setNameAr(branch.nameAr);
        setCode(branch.code);
        setPropertyType(branch.buildingType || 'Hotel');
        setCountry(branch.country || 'Saudi Arabia');
        setStateRegion(branch.stateRegion || 'Riyadh');
        setCity(branch.city);
        setCityAr(branch.cityAr);
        setDistrict(branch.district);
        setPostalCode(branch.postalCode || '12345');
        setAddress(branch.address);
        setAddressAr(branch.addressAr || branch.address);
        setPhone(branch.phone || '+966 11 234 5678');
        setEmail(branch.email || 'info@grandhotel.com');
        setWebsite(branch.website || 'https://www.grandhotel.com');
        setOrganizationId(branch.organizationId || 'ORG-KHETAT-HQ');
        setOrganizationName(branch.organizationName || 'Khetat Hospitality Hub & Operations Ltd.');
        setOrganizationNameAr(branch.organizationNameAr || 'شركة خطط للضيافة وتقنية العمليات الفندقية');
        setSubscriptionLimit(branch.subscriptionLimit || Math.max(35, branch.totalUnitsInBuilding || 30));
        setSubscriptionPlanName(branch.subscriptionPlanName || 'Building Plans - Tier 2 (Growth & Capped)');
        setUnitTypes(branch.unitTypes && branch.unitTypes.length > 0 ? branch.unitTypes : defaultUnitTypes);
        setFloors(branch.floors && branch.floors.length > 0 ? branch.floors : defaultFloors);
        setUnits(branch.units && branch.units.length > 0 ? branch.units : defaultUnits);
      }
    }
  }, [isOpen, branch, isCreate]);

  // Active Structure Tab: 'types' | 'floors' | 'units'
  const [structureTab, setStructureTab] = useState<'types' | 'floors' | 'units'>('types');

  // Sub-dialog states
  const [isAddUnitTypeOpen, setIsAddUnitTypeOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeNameAr, setNewTypeNameAr] = useState('');
  const [newDailyRate, setNewDailyRate] = useState<number>(300);
  const [newMonthlyRate, setNewMonthlyRate] = useState<number>(6000);

  const [isAddFloorOpen, setIsAddFloorOpen] = useState(false);
  const [newFloorName, setNewFloorName] = useState('');
  const [newFloorNameAr, setNewFloorNameAr] = useState('');

  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [newUnitNumber, setNewUnitNumber] = useState('');
  const [newUnitFloorId, setNewUnitFloorId] = useState('');
  const [newUnitTypeId, setNewUnitTypeId] = useState('');

  // Batch Auto-Number & Generator State
  const [isBatchGeneratorOpen, setIsBatchGeneratorOpen] = useState(false);
  const [batchFloorId, setBatchFloorId] = useState('');
  const [batchTypeId, setBatchTypeId] = useState('');
  const [batchStartNum, setBatchStartNum] = useState(101);
  const [batchCount, setBatchCount] = useState(10);

  // Error / Toast notice
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  // Recalculate Unit Types count dynamically
  const enrichedUnitTypes = useMemo(() => {
    return unitTypes.map((ut) => {
      const count = units.filter((u) => u.unitTypeId === ut.id).length;
      return { ...ut, unitsCount: count };
    });
  }, [unitTypes, units]);

  // Recalculate Floors roomCodes dynamically
  const enrichedFloors = useMemo(() => {
    return floors.map((fl) => {
      const rooms = units.filter((u) => u.floorId === fl.id).map((u) => u.unitNumber);
      return { ...fl, roomCodes: rooms };
    });
  }, [floors, units]);

  // Subscription capacity usage calculations
  const totalUnitsCount = units.length;
  const isOverSubscription = totalUnitsCount > subscriptionLimit;
  const subscriptionPercentage = Math.min(100, Math.round((totalUnitsCount / subscriptionLimit) * 100));

  if (!isOpen) return null;

  // HANDLER: Add Unit Type
  const handleCreateUnitType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    const newId = `ut-${Date.now()}`;
    const newUT: PropertyUnitType = {
      id: newId,
      name: newTypeName.trim(),
      nameAr: newTypeNameAr.trim() || newTypeName.trim(),
      dailyRate: Number(newDailyRate) || 0,
      monthlyRate: Number(newMonthlyRate) || 0,
      unitsCount: 0,
    };
    setUnitTypes((prev) => [...prev, newUT]);
    setNewTypeName('');
    setNewTypeNameAr('');
    setIsAddUnitTypeOpen(false);
    showNotice(isArabic ? 'تمت إضافة نوع الوحدة بنجاح' : 'Unit type added successfully');
  };

  // HANDLER: Delete Unit Type
  const handleDeleteUnitType = (typeId: string) => {
    const hasUnits = units.some((u) => u.unitTypeId === typeId);
    if (hasUnits) {
      if (!window.confirm(isArabic ? 'هناك وحدات مسندة لهذا النوع، هل تريد بالتأكيد حذفه؟' : 'There are units assigned to this type, are you sure?')) {
        return;
      }
    }
    setUnitTypes((prev) => prev.filter((t) => t.id !== typeId));
    showNotice(isArabic ? 'تم حذف نوع الوحدة' : 'Unit type deleted');
  };

  // HANDLER: Add Floor
  const handleCreateFloor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFloorName.trim()) return;
    const newFl: PropertyFloor = {
      id: `fl-${Date.now()}`,
      name: newFloorName.trim(),
      nameAr: newFloorNameAr.trim() || newFloorName.trim(),
      order: floors.length + 1,
      roomCodes: [],
    };
    setFloors((prev) => [...prev, newFl]);
    setNewFloorName('');
    setNewFloorNameAr('');
    setIsAddFloorOpen(false);
    showNotice(isArabic ? 'تمت إضافة الدور بنجاح' : 'Floor added successfully');
  };

  // HANDLER: Delete Floor
  const handleDeleteFloor = (floorId: string) => {
    const hasUnits = units.some((u) => u.floorId === floorId);
    if (hasUnits) {
      if (!window.confirm(isArabic ? 'هناك وحدات مسجلة في هذا الدور، هل تريد حذفه؟' : 'Units exist on this floor, delete anyway?')) {
        return;
      }
    }
    setFloors((prev) => prev.filter((f) => f.id !== floorId));
    showNotice(isArabic ? 'تم حذف الدور' : 'Floor deleted');
  };

  // HANDLER: Add Single Unit / Room
  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitNumber.trim()) return;

    if (units.length >= subscriptionLimit) {
      showNotice(
        isArabic
          ? `⚠️ سقف الاشتراك المسموح هو (${subscriptionLimit} وحدة). سيتم تسجيل الوحدة مع تنبيه بتجاوز السعة.`
          : `⚠️ Subscription limit of ${subscriptionLimit} units reached.`
      );
    }

    const selectedFloor = floors.find((f) => f.id === (newUnitFloorId || floors[0]?.id)) || floors[0];
    const selectedType = unitTypes.find((t) => t.id === (newUnitTypeId || unitTypes[0]?.id)) || unitTypes[0];

    const newU: PropertyUnit = {
      id: `u-${Date.now()}`,
      unitNumber: newUnitNumber.trim(),
      floorId: selectedFloor?.id || 'fl-ground',
      floorName: selectedFloor?.name || 'Ground Floor',
      unitTypeId: selectedType?.id || 'ut-standard',
      unitTypeName: selectedType?.name || 'Standard Room',
      dailyRate: selectedType?.dailyRate || 250,
      monthlyRate: selectedType?.monthlyRate || 5000,
      status: 'Available',
    };

    setUnits((prev) => [...prev, newU]);
    setNewUnitNumber('');
    setIsAddUnitOpen(false);
    showNotice(isArabic ? `تمت إضافة الوحدة "${newU.unitNumber}" بنجاح` : `Unit "${newU.unitNumber}" added`);
  };

  // HANDLER: Batch Generate & Auto-Number Units
  const handleBatchGenerateUnits = (e: React.FormEvent) => {
    e.preventDefault();
    const count = Math.max(1, Number(batchCount) || 1);
    const selectedFloor = floors.find((f) => f.id === (batchFloorId || floors[0]?.id)) || floors[0];
    const selectedType = unitTypes.find((t) => t.id === (batchTypeId || unitTypes[0]?.id)) || unitTypes[0];

    if (units.length + count > subscriptionLimit) {
      showNotice(
        isArabic
          ? `⚠️ إضافة ${count} وحدات ستتجاوز سقف الاشتراك (${subscriptionLimit} وحدة).`
          : `⚠️ Adding ${count} units exceeds subscription limit of ${subscriptionLimit}.`
      );
    }

    const newBatch: PropertyUnit[] = [];
    for (let i = 0; i < count; i++) {
      const roomNum = `${selectedFloor.name}-${batchStartNum + i}`;
      newBatch.push({
        id: `u-${Date.now()}-${i}`,
        unitNumber: roomNum,
        floorId: selectedFloor.id,
        floorName: selectedFloor.name,
        unitTypeId: selectedType.id,
        unitTypeName: selectedType.name,
        dailyRate: selectedType.dailyRate,
        monthlyRate: selectedType.monthlyRate,
        status: 'Available',
      });
    }

    setUnits((prev) => [...prev, ...newBatch]);
    setIsBatchGeneratorOpen(false);
    showNotice(isArabic ? `تم توليد وترقيم ${count} وحدات بنجاح` : `Auto-generated ${count} units successfully`);
  };

  // HANDLER: Delete Single Unit
  const handleDeleteUnit = (unitId: string) => {
    setUnits((prev) => prev.filter((u) => u.id !== unitId));
    showNotice(isArabic ? 'تم حذف الوحدة' : 'Unit deleted');
  };

  // SAVE ALL CHANGES (CREATE OR EDIT)
  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedOrg = organizationsList.find((o) => o.id === organizationId);

    const finalBranch: OrganizationBranch = {
      id: branch?.id || `prop-${Date.now()}`,
      code: code.trim() || `RHSA${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim() || "Mohran's Property",
      nameAr: nameAr.trim() || name.trim() || 'عقار مهران الفندقي',
      buildingName: (branch && branch.buildingName) || name.trim() || 'Hotel Tower',
      buildingNameAr: (branch && branch.buildingNameAr) || nameAr.trim() || 'المبنى الفندقي',
      buildingType: propertyType,
      buildingTypeAr: propertyType === 'Hotel' ? 'فندق' : propertyType,
      country,
      stateRegion,
      city,
      cityAr: cityAr || city,
      district: district || 'Al-Olaya District',
      postalCode: postalCode || '12345',
      address: address || `${city}, Saudi Arabia`,
      addressAr: addressAr || `${cityAr || city}، المملكة العربية السعودية`,
      shortAddress: code.trim(),
      phone: phone || '+966 11 234 5678',
      email: email || 'info@grandhotel.com',
      website: website || 'https://www.grandhotel.com',
      managerName: branch?.managerName || 'Sheikh Mohran Al-Otaibi',
      managerNameAr: branch?.managerNameAr || 'مهران العتيبي',
      managerPhone: branch?.managerPhone || phone || '+966 50 123 4567',
      assignedContactIds: branch?.assignedContactIds || [],
      managedKeys: units.length,
      status: branch?.status || 'Active',
      type: (propertyType === 'Hotel' ? 'Hotel Property' : propertyType === 'Tower' ? 'Tower' : 'Hotel Property') as any,
      typeAr: propertyType === 'Hotel' ? 'فندق سياحي' : 'منشأة فندقية',
      organizationId,
      organizationName: selectedOrg?.name || organizationName,
      organizationNameAr: selectedOrg?.nameAr || organizationNameAr,
      organizationBadgeColor: branch?.organizationBadgeColor || 'bg-emerald-50 text-emerald-800 border-emerald-200',
      subscriptionLimit,
      subscriptionPlanName,
      floorsCount: floors.length,
      totalUnitsInBuilding: units.length,
      unitBreakdown: {
        hotelRooms: units.filter((u) => u.unitTypeName.toLowerCase().includes('room')).length,
        suites: units.filter((u) => u.unitTypeName.toLowerCase().includes('suite') || u.unitTypeName.toLowerCase().includes('exec')).length,
      },
      unitTypes: enrichedUnitTypes,
      floors: enrichedFloors,
      units,
    };

    onSave(finalBranch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl border border-[#e3e8f9] my-auto animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
        {/* Toast notice inside modal */}
        {notice && (
          <div className="mb-3 p-2.5 rounded-xl bg-[#004a60] text-white text-xs font-semibold flex items-center justify-between border border-white/20">
            <span>{notice}</span>
            <button onClick={() => setNotice(null)} className="p-0.5 text-white/70 hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e3e8f9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#004a60] text-white flex items-center justify-center font-bold shadow-xs">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#161c27]">
                  {isCreate
                    ? isArabic
                      ? 'إضافة عقار (Add Property): '
                      : 'Add Property: '
                    : isArabic
                    ? 'تعديل العقار (Edit Property): '
                    : 'Edit Property: '}
                  <span className="text-[#004a60]">{name || (isCreate ? "Mohran's Property" : branch?.name)}</span>
                </h3>
                <span className="text-[10px] font-mono font-bold bg-[#e8eeff] text-[#004a60] px-2 py-0.5 rounded-md border border-[#bcd7f5]">
                  {code}
                </span>
              </div>
              <p className="text-xs text-[#70787d]">
                {isArabic
                  ? 'إدارة تفاصيل العقار، العنوان، هيكل أنواع الوحدات، الأدوار، وترقيم الغرف'
                  : 'Manage property info, location, unit types structure, floors, and room numbers'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#70787d] hover:text-[#161c27] p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
          {/* ========================================================================= */}
          {/* SUBSCRIPTION QUOTA BANNER ("عدد الوحدات بيكون علي حسب الاشتراك اللي دفعه") */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#eef7ff] via-[#f4f9ff] to-[#fcfdff] border border-[#bcd7f5] space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#004a60]" />
                <span className="text-xs font-black text-[#004a60]">
                  {isArabic ? 'سعة اشتراك العقار:' : 'Property Subscription Quota:'}
                </span>
                <span className="text-xs font-bold text-[#161c27]">{subscriptionPlanName}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                <span className={isOverSubscription ? 'text-red-600' : 'text-[#004a60]'}>
                  {totalUnitsCount}
                </span>
                <span className="text-[#70787d]">/ {subscriptionLimit}</span>
                <span className="text-[11px] text-[#70787d]">
                  {isArabic ? 'وحدة مرخصة' : 'licensed units'}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#d8e6f5] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isOverSubscription
                    ? 'bg-red-500'
                    : subscriptionPercentage > 85
                    ? 'bg-amber-500'
                    : 'bg-[#004a60]'
                }`}
                style={{ width: `${Math.min(100, (totalUnitsCount / Math.max(1, subscriptionLimit)) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#525e65]">
              <span>
                {isOverSubscription ? (
                  <span className="text-red-600 font-bold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {isArabic
                      ? `تم تجاوز سقف الاشتراك بـ ${totalUnitsCount - subscriptionLimit} وحدات!`
                      : `Exceeded subscription limit by ${totalUnitsCount - subscriptionLimit} units!`}
                  </span>
                ) : (
                  <span>
                    {isArabic
                      ? `متبقي ${subscriptionLimit - totalUnitsCount} وحدات متاحة للتسجيل ضمن هذا الاشتراك`
                      : `${subscriptionLimit - totalUnitsCount} units remaining under current subscription`}
                  </span>
                )}
              </span>

              <div className="flex items-center gap-1">
                <span className="text-[#70787d]">{isArabic ? 'الحد الأقصى للاشتراك:' : 'Quota Limit:'}</span>
                <input
                  type="number"
                  min="1"
                  value={subscriptionLimit}
                  onChange={(e) => setSubscriptionLimit(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 p-1 rounded-md border border-[#bcd7f5] text-center font-mono font-bold text-xs bg-white text-[#004a60]"
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* GENERAL PROPERTY DETAILS FORM */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#70787d] tracking-wider border-b border-[#f1f3ff] pb-1">
              {isArabic ? 'بيانات ومعلومات العقار' : 'Property General Information'}
            </h4>

            {/* Operating Organization Selector */}
            {organizationsList.length > 0 && (
              <div className="text-xs">
                <label className="block font-bold text-[#161c27] mb-1">
                  {isArabic ? 'المؤسسة المشغلة التابع لها العقار:' : 'Operating Organization:'}
                </label>
                <select
                  value={organizationId}
                  onChange={(e) => {
                    setOrganizationId(e.target.value);
                    const found = organizationsList.find((o) => o.id === e.target.value);
                    if (found) {
                      setOrganizationName(found.name);
                      setOrganizationNameAr(found.nameAr);
                    }
                  }}
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 font-bold text-[#004a60] bg-white focus:border-[#004a60] outline-hidden"
                >
                  {organizationsList.map((org) => (
                    <option key={org.id} value={org.id}>
                      {isArabic ? org.nameAr : org.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Property Name AR & EN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#161c27] mb-1">
                  {isArabic ? 'اسم العقار (English):' : 'Property Name (English):'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mohran's Property"
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 font-bold text-[#161c27] focus:border-[#004a60] outline-hidden bg-[#fcfdff]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#161c27] mb-1">
                  {isArabic ? 'اسم العقار (عربي):' : 'Property Name (Arabic):'}
                </label>
                <input
                  type="text"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: عقار مهران الفندقي"
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 font-bold text-[#161c27] focus:border-[#004a60] outline-hidden bg-[#fcfdff]"
                />
              </div>
            </div>

            {/* Property Type, Code, Country, State/Region */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'نوع العقار:' : 'Property Type:'}
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 font-medium bg-white focus:border-[#004a60] outline-hidden"
                >
                  <option value="Hotel">Hotel (فندق)</option>
                  <option value="Serviced Apartments">Serviced Apartments (شقق مخدومة)</option>
                  <option value="Resort">Resort (منتجع)</option>
                  <option value="Villa Compound">Villa Compound (مجمع فلل)</option>
                  <option value="Commercial Tower">Commercial Tower (برج تجاري)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'كود العقار (Code):' : 'Short Identifier (Code):'}
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="RHSA1234"
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 font-mono font-bold text-[#004a60] bg-white focus:border-[#004a60] outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الدولة:' : 'Country:'}
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Saudi Arabia"
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'المنطقة / المقاطعة:' : 'State / Region:'}
                </label>
                <input
                  type="text"
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  placeholder="Riyadh"
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>
            </div>

            {/* City, District, Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'المدينة:' : 'City:'}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    if (e.target.value === 'Riyadh') setCityAr('الرياض');
                    else if (e.target.value === 'Jeddah') setCityAr('جدة');
                    else if (e.target.value === 'Makkah') setCityAr('مكة المكرمة');
                    else if (e.target.value === 'Madinah') setCityAr('المدينة المنورة');
                  }}
                  placeholder="Riyadh"
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 bg-white focus:border-[#004a60] outline-hidden font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الحي:' : 'District:'}
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Select or enter district (e.g. Al-Olaya)"
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الرمز البريدي:' : 'Postal Code:'}
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 12345"
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 bg-white focus:border-[#004a60] outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Full Address */}
            <div className="text-xs">
              <label className="block font-semibold text-[#161c27] mb-1">
                {isArabic ? 'العنوان التفصيلي بالكامل:' : 'Full address including all details:'}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full address including all details (e.g. King Fahd Road, Al-Olaya, Riyadh 12345)"
                className="w-full rounded-xl border border-[#e3e8f9] p-2.5 bg-white focus:border-[#004a60] outline-hidden"
              />
            </div>

            {/* Phone, Email, Website */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الهاتف:' : 'Phone:'}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +966 11 234 5678"
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 bg-white focus:border-[#004a60] outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'البريد الإلكتروني:' : 'Email:'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. info@grandhotel.com"
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 bg-white focus:border-[#004a60] outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الموقع الإلكتروني:' : 'Website:'}
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. https://www.grandhotel.com"
                  className="w-full rounded-xl border border-[#e3e8f9] p-2.5 bg-white focus:border-[#004a60] outline-hidden font-mono"
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PROPERTY STRUCTURE SECTION (UNIT TYPES, FLOORS, AND ROOMS) */}
          {/* ========================================================================= */}
          <div className="space-y-4 pt-4 border-t border-[#e3e8f9]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-black text-[#161c27] flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#004a60]" />
                  <span>{isArabic ? 'هيكل العقار (Property Structure)' : 'Property Structure'}</span>
                </h4>
                <p className="text-xs text-[#70787d] mt-0.5">
                  {isArabic
                    ? 'إدارة أنواع الوحدات، الأدوار، والغرف والوحدات لهذا العقار وترقيمها.'
                    : 'Manage the unit types, floors and rooms of this property.'}
                </p>
              </div>

              {/* Sub-tabs inside Property Structure */}
              <div className="flex items-center gap-1 bg-[#f1f3ff] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setStructureTab('types')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    structureTab === 'types'
                      ? 'bg-white text-[#004a60] shadow-xs'
                      : 'text-[#70787d] hover:text-[#161c27]'
                  }`}
                >
                  {isArabic ? 'أنواع الوحدات' : 'Unit Types'} ({unitTypes.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStructureTab('floors')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    structureTab === 'floors'
                      ? 'bg-white text-[#004a60] shadow-xs'
                      : 'text-[#70787d] hover:text-[#161c27]'
                  }`}
                >
                  {isArabic ? 'الأدوار' : 'Floors'} ({floors.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStructureTab('units')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    structureTab === 'units'
                      ? 'bg-white text-[#004a60] shadow-xs'
                      : 'text-[#70787d] hover:text-[#161c27]'
                  }`}
                >
                  {isArabic ? 'الوحدات والغرف' : 'Units'} ({units.length})
                </button>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* SUBSECTION 1: UNIT TYPES */}
            {/* ------------------------------------------------------------- */}
            {structureTab === 'types' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#161c27]">
                    Unit Types ({enrichedUnitTypes.length})
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsAddUnitTypeOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#004a60] bg-[#e8eeff] hover:bg-[#d8e6f5] px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{isArabic ? 'إضافة نوع وحدة (Add unit type)' : 'Add unit type'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {enrichedUnitTypes.map((ut) => (
                    <div
                      key={ut.id}
                      className="p-4 rounded-xl border border-[#e3e8f9] bg-[#fcfdff] hover:border-[#004a60]/30 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-black text-xs text-[#161c27]">{ut.name}</h5>
                          <button
                            type="button"
                            onClick={() => handleDeleteUnitType(ut.id)}
                            className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                            title="Delete type"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-[#70787d]">
                          Daily: SAR {ut.dailyRate.toFixed(2)} • Monthly: SAR {ut.monthlyRate.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-[#f1f3ff] flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-[#004a60] bg-[#e8eeff] px-2 py-0.5 rounded-md">
                          {ut.unitsCount || 0} Units
                        </span>
                        <span className="text-[10px] text-[#70787d]">
                          {isArabic ? ut.nameAr : ut.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inline Dialog: Add Unit Type */}
                {isAddUnitTypeOpen && (
                  <div className="p-4 rounded-xl border-2 border-[#004a60]/30 bg-[#f8fbff] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#004a60]">
                        {isArabic ? 'إضافة نوع وحدة جديد' : 'New Unit Type Definition'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAddUnitTypeOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateUnitType} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#161c27] mb-1">
                          Name (English):
                        </label>
                        <input
                          type="text"
                          required
                          value={newTypeName}
                          onChange={(e) => setNewTypeName(e.target.value)}
                          placeholder="e.g. Royal Suite"
                          className="w-full p-2 rounded-lg border border-[#c3cce6] bg-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#161c27] mb-1">
                          Name (Arabic):
                        </label>
                        <input
                          type="text"
                          value={newTypeNameAr}
                          onChange={(e) => setNewTypeNameAr(e.target.value)}
                          placeholder="جناح ملكي"
                          className="w-full p-2 rounded-lg border border-[#c3cce6] bg-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#161c27] mb-1">
                          Daily Rate (SAR):
                        </label>
                        <input
                          type="number"
                          value={newDailyRate}
                          onChange={(e) => setNewDailyRate(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full p-2 rounded-lg border border-[#c3cce6] bg-white font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#161c27] mb-1">
                          Monthly Rate (SAR):
                        </label>
                        <input
                          type="number"
                          value={newMonthlyRate}
                          onChange={(e) => setNewMonthlyRate(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full p-2 rounded-lg border border-[#c3cce6] bg-white font-mono font-bold"
                        />
                      </div>
                      <div className="sm:col-span-4 flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAddUnitTypeOpen(false)}
                          className="px-3 py-1.5 rounded-lg border border-[#c3cce6] text-gray-700 font-semibold"
                        >
                          {isArabic ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-[#004a60] text-white font-bold hover:bg-[#074e64]"
                        >
                          {isArabic ? 'حفظ نوع الوحدة' : 'Save Unit Type'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* SUBSECTION 2: FLOORS */}
            {/* ------------------------------------------------------------- */}
            {structureTab === 'floors' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#161c27]">
                    Floors ({enrichedFloors.length})
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsAddFloorOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#004a60] bg-[#e8eeff] hover:bg-[#d8e6f5] px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{isArabic ? 'إضافة دور (Add Floor)' : 'Add Floor'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {enrichedFloors.map((fl) => (
                    <div
                      key={fl.id}
                      className="p-4 rounded-xl border border-[#e3e8f9] bg-[#fcfdff] hover:border-[#004a60]/30 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-[#004a60]/10 text-[#004a60] font-black text-xs flex items-center justify-center">
                            {fl.order || 1}
                          </span>
                          <h5 className="font-black text-xs text-[#161c27]">{fl.name}</h5>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteFloor(fl.id)}
                          className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                          title="Delete floor"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Room Codes list in this floor */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#70787d]">
                          {isArabic
                            ? `الوحدات والغرف المسندة لهذا الدور (${fl.roomCodes?.length || 0}):`
                            : `Assigned rooms (${fl.roomCodes?.length || 0}):`}
                        </span>
                        {fl.roomCodes && fl.roomCodes.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 rounded-lg bg-gray-50 border border-[#f1f3ff]">
                            {fl.roomCodes.map((rc, rci) => (
                              <span
                                key={rci}
                                className="text-[10px] font-mono font-semibold bg-white border border-[#e3e8f9] text-[#2c3840] px-1.5 py-0.5 rounded"
                              >
                                {rc}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-400 italic p-1">
                            {isArabic ? 'لا توجد وحدات بعد في هذا الدور' : 'No rooms assigned yet'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inline Dialog: Add Floor */}
                {isAddFloorOpen && (
                  <div className="p-4 rounded-xl border-2 border-[#004a60]/30 bg-[#f8fbff] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#004a60]">
                        {isArabic ? 'إضافة دور جديد' : 'New Floor Definition'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAddFloorOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateFloor} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#161c27] mb-1">
                          Floor Name (English):
                        </label>
                        <input
                          type="text"
                          required
                          value={newFloorName}
                          onChange={(e) => setNewFloorName(e.target.value)}
                          placeholder="e.g. Third Floor / Penthouse"
                          className="w-full p-2 rounded-lg border border-[#c3cce6] bg-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#161c27] mb-1">
                          Floor Name (Arabic):
                        </label>
                        <input
                          type="text"
                          value={newFloorNameAr}
                          onChange={(e) => setNewFloorNameAr(e.target.value)}
                          placeholder="الدور الثالث / البنتهاوس"
                          className="w-full p-2 rounded-lg border border-[#c3cce6] bg-white font-bold"
                        />
                      </div>
                      <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAddFloorOpen(false)}
                          className="px-3 py-1.5 rounded-lg border border-[#c3cce6] text-gray-700 font-semibold"
                        >
                          {isArabic ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-[#004a60] text-white font-bold hover:bg-[#074e64]"
                        >
                          {isArabic ? 'حفظ الدور' : 'Save Floor'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* SUBSECTION 3: UNITS / ROOMS */}
            {/* ------------------------------------------------------------- */}
            {structureTab === 'units' && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#161c27]">
                      Units ({units.length})
                    </span>
                    <span className="text-[11px] font-bold text-[#70787d]">
                      {isArabic ? `سقف الاشتراك: ${subscriptionLimit}` : `Subscription Cap: ${subscriptionLimit}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsBatchGeneratorOpen(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#004a60] bg-[#eef7ff] hover:bg-[#d8e6f5] px-3 py-1.5 rounded-lg transition-all cursor-pointer border border-[#bcd7f5]"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>{isArabic ? 'توليد وترقيم آلي' : 'Auto-Number'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsAddUnitOpen(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#004a60] hover:bg-[#074e64] px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{isArabic ? 'إضافة غرفة (Add Room)' : 'Add Room'}</span>
                    </button>
                  </div>
                </div>

                {/* Inline Dialog: Add Single Unit / Room */}
                {isAddUnitOpen && (
                  <div className="p-4 rounded-xl border-2 border-[#004a60]/30 bg-[#f8fbff] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#004a60]">
                        {isArabic ? 'إضافة وحدة / غرفة جديدة' : 'Add New Unit / Room'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAddUnitOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateUnit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#161c27] mb-1">
                          Unit / Room Number:
                        </label>
                        <input
                          type="text"
                          required
                          value={newUnitNumber}
                          onChange={(e) => setNewUnitNumber(e.target.value)}
                          placeholder="e.g. First Floor-121 or 205"
                          className="w-full p-2 rounded-lg border border-[#c3cce6] bg-white font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#161c27] mb-1">
                          Assigned Floor:
                        </label>
                        <select
                          value={newUnitFloorId || floors[0]?.id}
                          onChange={(e) => setNewUnitFloorId(e.target.value)}
                          className="w-full p-2 rounded-lg border border-[#c3cce6] bg-white font-medium"
                        >
                          {floors.map((fl) => (
                            <option key={fl.id} value={fl.id}>
                              {fl.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#161c27] mb-1">
                          Unit Type:
                        </label>
                        <select
                          value={newUnitTypeId || unitTypes[0]?.id}
                          onChange={(e) => setNewUnitTypeId(e.target.value)}
                          className="w-full p-2 rounded-lg border border-[#c3cce6] bg-white font-medium"
                        >
                          {unitTypes.map((ut) => (
                            <option key={ut.id} value={ut.id}>
                              {ut.name} (SAR {ut.dailyRate}/day)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3 flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAddUnitOpen(false)}
                          className="px-3 py-1.5 rounded-lg border border-[#c3cce6] text-gray-700 font-semibold"
                        >
                          {isArabic ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-[#004a60] text-white font-bold hover:bg-[#074e64]"
                        >
                          {isArabic ? 'حفظ الوحدة' : 'Save Unit'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Inline Dialog: Batch Auto-number Generator */}
                {isBatchGeneratorOpen && (
                  <div className="p-4 rounded-xl border-2 border-amber-400 bg-amber-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-amber-600" />
                        <span>{isArabic ? 'توليد وترقيم الوحدات تلقائياً' : 'Auto-Generate & Number Units'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsBatchGeneratorOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <form onSubmit={handleBatchGenerateUnits} className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#161c27] mb-1">
                          Floor:
                        </label>
                        <select
                          value={batchFloorId || floors[0]?.id}
                          onChange={(e) => setBatchFloorId(e.target.value)}
                          className="w-full p-2 rounded-lg border border-amber-200 bg-white"
                        >
                          {floors.map((fl) => (
                            <option key={fl.id} value={fl.id}>
                              {fl.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#161c27] mb-1">
                          Unit Type:
                        </label>
                        <select
                          value={batchTypeId || unitTypes[0]?.id}
                          onChange={(e) => setBatchTypeId(e.target.value)}
                          className="w-full p-2 rounded-lg border border-amber-200 bg-white"
                        >
                          {unitTypes.map((ut) => (
                            <option key={ut.id} value={ut.id}>
                              {ut.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#161c27] mb-1">
                          Starting Number:
                        </label>
                        <input
                          type="number"
                          value={batchStartNum}
                          onChange={(e) => setBatchStartNum(parseInt(e.target.value) || 101)}
                          className="w-full p-2 rounded-lg border border-amber-200 bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#161c27] mb-1">
                          Units Count:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={batchCount}
                          onChange={(e) => setBatchCount(parseInt(e.target.value) || 1)}
                          className="w-full p-2 rounded-lg border border-amber-200 bg-white font-mono font-bold"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-4 flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsBatchGeneratorOpen(false)}
                          className="px-3 py-1.5 rounded-lg border border-amber-300 text-gray-700"
                        >
                          {isArabic ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700"
                        >
                          {isArabic ? 'توليد الوحدات الآن' : 'Generate Units Now'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Units Grid Display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto p-1">
                  {units.length === 0 ? (
                    <div className="col-span-3 p-8 text-center border border-dashed border-[#c3cce6] rounded-xl text-gray-400 text-xs">
                      {isArabic ? 'لا توجد وحدات مسجلة بعد، استخدم "إضافة غرفة" أو "توليد وترقيم آلي"' : 'No rooms added yet, click "Add Room" or "Auto-Number"'}
                    </div>
                  ) : (
                    units.map((u) => (
                      <div
                        key={u.id}
                        className="p-3 rounded-xl border border-[#e3e8f9] bg-[#fcfdff] hover:border-[#004a60]/30 transition-all flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <div className="font-mono font-bold text-xs text-[#161c27]">
                            {u.unitNumber}
                          </div>
                          <div className="text-[11px] text-[#70787d]">
                            {u.floorName} • {u.unitTypeName}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                              u.status === 'Available'
                                ? 'bg-emerald-100 text-emerald-800'
                                : u.status === 'Occupied'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {u.status || 'Available'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteUnit(u.id)}
                            className="text-gray-300 hover:text-red-600 p-1 cursor-pointer"
                            title="Delete unit"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions (Cancel & Save Changes) */}
        <div className="pt-4 border-t border-[#e3e8f9] flex items-center justify-between">
          <div className="text-xs text-[#70787d]">
            <span>{isArabic ? 'إجمالي الوحدات:' : 'Total Units:'} </span>
            <strong className="text-[#004a60] font-mono">{units.length}</strong>
            <span> / {subscriptionLimit} </span>
            <span>({isArabic ? 'بحسب الاشتراك' : 'per subscription'})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#c3cce6] text-gray-700 font-semibold text-xs hover:bg-gray-50 cursor-pointer"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-6 py-2 rounded-xl bg-[#004a60] hover:bg-[#074e64] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>
                {isCreate
                  ? isArabic
                    ? 'حفظ وتأسيس العقار (Save Changes)'
                    : 'Save Changes'
                  : isArabic
                  ? 'حفظ التعديلات'
                  : 'Save Changes'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
