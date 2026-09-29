import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Building2,
  Phone,
  MapPin,
  Calculator,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileCheck,
  HelpCircle,
} from 'lucide-react';
import { EmployeeRecord, Department, PositionRole } from '../../data/hrData';

interface AddNewEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEmployee: (employee: EmployeeRecord) => void;
  departments: Department[];
  positions: PositionRole[];
  existingEmployees: EmployeeRecord[];
  isArabic: boolean;
}

export const AddNewEmployeeModal: React.FC<AddNewEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSaveEmployee,
  departments,
  positions,
  existingEmployees,
  isArabic,
}) => {
  // User toggle
  const [createUserAccount, setCreateUserAccount] = useState(false);

  // Personal Information
  const [firstNameEn, setFirstNameEn] = useState('John');
  const [lastNameEn, setLastNameEn] = useState('Doe');
  const [firstNameAr, setFirstNameAr] = useState('أحمد');
  const [lastNameAr, setLastNameAr] = useState('المنصور');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [nationality, setNationality] = useState('Saudi Arabia');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [bloodType, setBloodType] = useState('O+');

  // Legal & Compliance
  const [idType, setIdType] = useState('National ID');
  const [idNumber, setIdNumber] = useState('1088491029');
  const [idIssueDate, setIdIssueDate] = useState('2022-03-20');
  const [idExpiryHijri, setIdExpiryHijri] = useState('1447/05/20');
  const [passportNumber, setPassportNumber] = useState('KSA338192');
  const [passportExpiry, setPassportExpiry] = useState('2032-10-10');
  const [gosiNumber, setGosiNumber] = useState('449102948');
  const [sponsorshipStatus, setSponsorshipStatus] = useState('Company Sponsored');
  const [professionOnId, setProfessionOnId] = useState('Specialist');

  // Organizational Placement
  const [departmentId, setDepartmentId] = useState('');
  const [positionId, setPositionId] = useState('');
  const [employeeLevel, setEmployeeLevel] = useState('Senior Staff');
  const [dateOfJoining, setDateOfJoining] = useState('2026-09-29');
  const [designation, setDesignation] = useState('Specialist');
  const [directManagerId, setDirectManagerId] = useState('');

  // Contact & Location
  const [personalPhone, setPersonalPhone] = useState('541123344');
  const [personalEmail, setPersonalEmail] = useState('john.doe@example.com');

  // National Address Details
  const [buildingNumber, setBuildingNumber] = useState('1234');
  const [streetName, setStreetName] = useState('King Fahd Road');
  const [country, setCountry] = useState('Saudi Arabia');
  const [region, setRegion] = useState('Riyadh Province');
  const [city, setCity] = useState('Riyadh');
  const [district, setDistrict] = useState('Al Malqa');
  const [postalCode, setPostalCode] = useState('13321');
  const [shortAddress, setShortAddress] = useState('RRRR1234');
  const [emergencyContactName, setEmergencyContactName] = useState('Omar Al-Mansoor');
  const [emergencyAdditionalNumber, setEmergencyAdditionalNumber] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('501192837');
  const [relationship, setRelationship] = useState('Parent');

  // Accounting Mapping
  const [openingBalance, setOpeningBalance] = useState('0.00');
  const [openingBalanceDate, setOpeningBalanceDate] = useState('2026-09-29');

  // Documents
  const [attachedDocs, setAttachedDocs] = useState<Record<string, boolean>>({
    idCopy: false,
    contract: false,
    iban: false,
    education: false,
  });

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (departments.length > 0 && !departmentId) {
        setDepartmentId(departments[0].id);
      }
      if (existingEmployees.length > 0 && !directManagerId) {
        setDirectManagerId(existingEmployees[0].id);
      }
    }
  }, [isOpen, departments, existingEmployees]);

  // Filter positions when department changes
  const availablePositions = positions.filter((p) => p.departmentId === departmentId);

  useEffect(() => {
    if (availablePositions.length > 0) {
      setPositionId(availablePositions[0].id);
    } else {
      setPositionId('');
    }
  }, [departmentId]);

  if (!isOpen) return null;

  const handleToggleDoc = (docKey: string) => {
    setAttachedDocs((prev) => ({ ...prev, [docKey]: !prev[docKey] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!firstNameEn.trim()) {
      newErrors.firstNameEn = isArabic ? 'الاسم الأول (بالإنجليزية) مطلوب' : 'First Name (English) is required';
    }
    if (!lastNameEn.trim()) {
      newErrors.lastNameEn = isArabic ? 'اسم العائلة (بالإنجليزية) مطلوب' : 'Last Name (English) is required';
    }
    if (!departmentId) {
      newErrors.departmentId = isArabic ? 'القسم مطلوب' : 'Department is required';
    }
    if (!directManagerId) {
      newErrors.directManagerId = isArabic ? 'المدير المباشر مطلوب' : 'Direct Manager is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const matchedDept = departments.find((d) => d.id === departmentId);
    const matchedPos = positions.find((p) => p.id === positionId);
    const matchedMgr = existingEmployees.find((e) => e.id === directManagerId);

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const code = `EMP-0${randomSuffix}`;

    const newEmp: EmployeeRecord = {
      id: `emp-${Date.now()}`,
      employeeCode: code,
      firstNameEn: firstNameEn.trim(),
      lastNameEn: lastNameEn.trim(),
      firstNameAr: firstNameAr.trim() || firstNameEn.trim(),
      lastNameAr: lastNameAr.trim() || lastNameEn.trim(),
      dateOfBirth: dateOfBirth || '1995-01-01',
      gender,
      nationality: nationality || 'Saudi Arabia',
      maritalStatus,
      bloodType,
      idType,
      idNumber: idNumber.trim() || '10XXXXXXXX',
      idIssueDate: idIssueDate || '2022-01-01',
      idExpiryHijri: idExpiryHijri.trim() || '1447/05/20',
      passportNumber: passportNumber.trim() || 'XXXXXXXXX',
      passportExpiry: passportExpiry || '2030-01-01',
      gosiNumber: gosiNumber.trim() || 'XXXXXXXXX',
      sponsorshipStatus,
      professionOnId: professionOnId.trim() || 'Specialist',
      departmentId,
      departmentName: matchedDept ? matchedDept.name : 'General',
      positionId,
      positionName: matchedPos ? matchedPos.name : designation,
      employeeLevel,
      dateOfJoining: dateOfJoining || '2026-09-29',
      designation: designation || 'Staff',
      directManagerId,
      directManagerName: matchedMgr ? `${matchedMgr.firstNameEn} ${matchedMgr.lastNameEn}` : 'General Manager',
      personalPhone: `+966 ${personalPhone}`,
      personalEmail: personalEmail.trim() || 'user@example.com',
      buildingNumber: buildingNumber.trim() || '1234',
      streetName: streetName.trim() || 'King Fahd Road',
      country: country || 'Saudi Arabia',
      region: region || 'Riyadh',
      city: city || 'Riyadh',
      district: district.trim() || 'Al Malqa',
      postalCode: postalCode.trim() || '13321',
      shortAddress: shortAddress.trim() || 'RRRR1234',
      emergencyContactName: emergencyContactName.trim() || 'Family Member',
      emergencyAdditionalNumber,
      emergencyPhone: `+966 ${emergencyPhone}`,
      relationship,
      accountCode: `11223-${randomSuffix}`,
      openingBalance: parseFloat(openingBalance) || 0,
      openingBalanceDate: openingBalanceDate || '2026-09-29',
      avatarColor: 'bg-[#004a60]',
      status: 'Active',
      documentsCount: Object.values(attachedDocs).filter(Boolean).length,
    };

    onSaveEmployee(newEmp);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-[#e3e8f9] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header matching user prompt:
            Add New Employee
            Complete the identity record and organizational placement. */}
        <div className="flex items-center justify-between border-b border-[#e3e8f9] bg-[#f9f9ff] px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004a60] text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#161c27]">
                {isArabic ? 'إضافة موظف جديد' : 'Add New Employee'}
              </h2>
              <p className="text-xs text-[#70787d]">
                {isArabic
                  ? 'استكمال سجل الهوية، الامتثال النظامي، والتموضع في الهيكل التنظيمي.'
                  : 'Complete the identity record and organizational placement.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#70787d] hover:bg-[#e8eeff] hover:text-[#161c27] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto text-xs">
          {/* User Section (Toggle / Account credentials) */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#d2defc] bg-[#f0f4ff]/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#e8eeff] text-[#004a60]">
                <User className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-[#161c27] text-xs">
                  {isArabic ? 'حساب مستخدم في النظام (User Account)' : 'User'}
                </span>
                <p className="text-[11px] text-[#70787d]">
                  {isArabic
                    ? 'إنشاء حساب دخول وبوابة الخدمة الذاتية للموظف مرتبطة بالبريد الإلكتروني'
                    : 'Provision system user credentials and employee self-service access'}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={createUserAccount}
                onChange={(e) => setCreateUserAccount(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#004a60]"></div>
            </label>
          </div>

          {/* 1. Personal Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-[#e3e8f9]">
              <span className="font-bold text-[#161c27] text-sm">
                {isArabic ? 'المعلومات الشخصية' : 'Personal Information'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* First Name (English) * */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الاسم الأول (الإنجليزية) *' : 'First Name (English) *'}
                </label>
                <input
                  type="text"
                  value={firstNameEn}
                  onChange={(e) => {
                    setFirstNameEn(e.target.value);
                    if (errors.firstNameEn) setErrors((prev) => ({ ...prev, firstNameEn: '' }));
                  }}
                  placeholder="John"
                  className={`w-full rounded-xl border ${
                    errors.firstNameEn ? 'border-red-400 bg-red-50' : 'border-[#c3cce6] bg-[#f9f9ff]'
                  } px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden`}
                />
                {errors.firstNameEn && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.firstNameEn}</p>
                )}
              </div>

              {/* Last Name (English) * */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'اسم العائلة (الإنجليزية) *' : 'Last Name (English) *'}
                </label>
                <input
                  type="text"
                  value={lastNameEn}
                  onChange={(e) => {
                    setLastNameEn(e.target.value);
                    if (errors.lastNameEn) setErrors((prev) => ({ ...prev, lastNameEn: '' }));
                  }}
                  placeholder="Doe"
                  className={`w-full rounded-xl border ${
                    errors.lastNameEn ? 'border-red-400 bg-red-50' : 'border-[#c3cce6] bg-[#f9f9ff]'
                  } px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden`}
                />
                {errors.lastNameEn && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.lastNameEn}</p>
                )}
              </div>

              {/* First Name (Arabic) */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الاسم الأول (بالعربي)' : 'First Name (Arabic)'}
                </label>
                <input
                  type="text"
                  value={firstNameAr}
                  onChange={(e) => setFirstNameAr(e.target.value)}
                  placeholder="أحمد"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* Last Name (Arabic) */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'اسم العائلة (بالعربي)' : 'Last Name (Arabic)'}
                </label>
                <input
                  type="text"
                  value={lastNameAr}
                  onChange={(e) => setLastNameAr(e.target.value)}
                  placeholder="المنصور"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
              {/* Date of Birth */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'تاريخ الميلاد' : 'Date of Birth'}
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  placeholder="mm/dd/yyyy"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الجنس' : 'Gender'}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                >
                  <option value="Male">{isArabic ? 'ذكر' : 'Male'}</option>
                  <option value="Female">{isArabic ? 'أنثى' : 'Female'}</option>
                </select>
              </div>

              {/* Nationality */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الجنسية' : 'Nationality'}
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="Saudi Arabia"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* Marital Status */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الحالة الاجتماعية' : 'Marital Status'}
                </label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                >
                  <option value="Single">{isArabic ? 'أعزب / عزباء' : 'Single'}</option>
                  <option value="Married">{isArabic ? 'متزوج / متزوجة' : 'Married'}</option>
                  <option value="Divorced">{isArabic ? 'مطلق / مطلقة' : 'Divorced'}</option>
                  <option value="Widowed">{isArabic ? 'أرمل / أرملة' : 'Widowed'}</option>
                </select>
              </div>

              {/* Blood Type */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'فصيلة الدم' : 'Blood Type'}
                </label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                >
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                  <option value="A-">A-</option>
                  <option value="B-">B-</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Legal & Compliance */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-[#e3e8f9]">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span className="font-bold text-[#161c27] text-sm">
                {isArabic ? 'البيانات النظامية والامتثال القانوني' : 'Legal & Compliance'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* ID / Residency Type */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'نوع الهوية / الإقامة' : 'ID / Residency Type'}
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                >
                  <option value="National ID">{isArabic ? 'هوية وطنية للمواطنين' : 'National ID (Saudi)'}</option>
                  <option value="Iqama">{isArabic ? 'إقامة نظامية للمقيمين' : 'Iqama (Resident)'}</option>
                  <option value="GCC National ID">{isArabic ? 'هوية مواطني الخليج' : 'GCC National ID'}</option>
                  <option value="Border Number">{isArabic ? 'رقم الحدود' : 'Border Number'}</option>
                </select>
              </div>

              {/* ID Number */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'رقم الهوية' : 'ID Number'}
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="10XXXXXXXX"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs font-mono focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* ID Issue Date (Gregorian) */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'تاريخ إصدار الهوية (ميلادي)' : 'ID Issue Date (Gregorian)'}
                </label>
                <input
                  type="date"
                  value={idIssueDate}
                  onChange={(e) => setIdIssueDate(e.target.value)}
                  placeholder="mm/dd/yyyy"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* ID Expiry Date (Hijri) */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'تاريخ انتهاء الهوية (هجري)' : 'ID Expiry Date (Hijri)'}
                </label>
                <input
                  type="text"
                  value={idExpiryHijri}
                  onChange={(e) => setIdExpiryHijri(e.target.value)}
                  placeholder="1447/05/20"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs font-mono focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
              {/* Passport Number */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'رقم الجواز' : 'Passport Number'}
                </label>
                <input
                  type="text"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  placeholder="XXXXXXXXX"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs font-mono focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* Passport Expiry */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'انتهاء الجواز' : 'Passport Expiry'}
                </label>
                <input
                  type="date"
                  value={passportExpiry}
                  onChange={(e) => setPassportExpiry(e.target.value)}
                  placeholder="mm/dd/yyyy"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* GOSI Number */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'رقم التأمينات (GOSI)' : 'GOSI Number'}
                </label>
                <input
                  type="text"
                  value={gosiNumber}
                  onChange={(e) => setGosiNumber(e.target.value)}
                  placeholder="XXXXXXXXX"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs font-mono focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* Sponsorship Status */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'حالة الكفالة' : 'Sponsorship Status'}
                </label>
                <select
                  value={sponsorshipStatus}
                  onChange={(e) => setSponsorshipStatus(e.target.value)}
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                >
                  <option value="Company Sponsored">{isArabic ? 'على كفالة المنشأة' : 'Company Sponsored'}</option>
                  <option value="Dependent">{isArabic ? 'تابع مصرح له بالعمل' : 'Dependent'}</option>
                  <option value="Transferable">{isArabic ? 'قابل لنقل الكفالة' : 'Transferable'}</option>
                </select>
              </div>

              {/* Profession on ID */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'المهنة في الإقامة / الهوية' : 'Profession on ID'}
                </label>
                <input
                  type="text"
                  value={professionOnId}
                  onChange={(e) => setProfessionOnId(e.target.value)}
                  placeholder="Specialist"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* 3. Organizational Placement */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-[#e3e8f9]">
              <Building2 className="h-4 w-4 text-[#004a60]" />
              <span className="font-bold text-[#161c27] text-sm">
                {isArabic ? 'التموضع التنظيمي والإداري' : 'Organizational Placement'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Department * */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'القسم *' : 'Department *'}
                </label>
                <select
                  value={departmentId}
                  onChange={(e) => {
                    setDepartmentId(e.target.value);
                    if (errors.departmentId) setErrors((prev) => ({ ...prev, departmentId: '' }));
                  }}
                  className={`w-full rounded-xl border ${
                    errors.departmentId ? 'border-red-400 bg-red-50' : 'border-[#c3cce6] bg-[#f9f9ff]'
                  } px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden`}
                >
                  <option value="">{isArabic ? 'اختر القسم' : 'Select Department'}</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.departmentId}</p>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'المسمى الوظيفي' : 'Position'}
                </label>
                <select
                  value={positionId}
                  onChange={(e) => setPositionId(e.target.value)}
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                >
                  {!departmentId ? (
                    <option value="">{isArabic ? 'اختر قسماً أولاً' : 'Select a department first'}</option>
                  ) : availablePositions.length === 0 ? (
                    <option value="">{isArabic ? 'لا توجد وظائف في هذا القسم' : 'No positions in department'}</option>
                  ) : (
                    availablePositions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Employee Level */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'المستوى الوظيفي' : 'Employee Level'}
                </label>
                <select
                  value={employeeLevel}
                  onChange={(e) => setEmployeeLevel(e.target.value)}
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                >
                  <option value="Executive">{isArabic ? 'تنفيذي / قيادي' : 'Executive'}</option>
                  <option value="Director">{isArabic ? 'مدير إدارة' : 'Director'}</option>
                  <option value="Manager">{isArabic ? 'مدير قسم' : 'Manager'}</option>
                  <option value="Supervisor">{isArabic ? 'مشرف' : 'Supervisor'}</option>
                  <option value="Senior Staff">{isArabic ? 'موظف أول' : 'Senior Staff'}</option>
                  <option value="Entry Level">{isArabic ? 'موظف مبتدئ' : 'Entry Level'}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Date of Joining (DOJ) */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'تاريخ الالتحاق (DOJ)' : 'Date of Joining (DOJ)'}
                </label>
                <input
                  type="date"
                  value={dateOfJoining}
                  onChange={(e) => setDateOfJoining(e.target.value)}
                  placeholder="mm/dd/yyyy"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'اللقب المهني' : 'Designation'}
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Select Designation"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* Direct Manager * */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'المدير المباشر *' : 'Direct Manager *'}
                </label>
                <select
                  value={directManagerId}
                  onChange={(e) => {
                    setDirectManagerId(e.target.value);
                    if (errors.directManagerId) setErrors((prev) => ({ ...prev, directManagerId: '' }));
                  }}
                  className={`w-full rounded-xl border ${
                    errors.directManagerId ? 'border-red-400 bg-red-50' : 'border-[#c3cce6] bg-[#f9f9ff]'
                  } px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden`}
                >
                  <option value="">{isArabic ? 'اختر المدير المباشر' : 'Select Manager'}</option>
                  {existingEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstNameEn} {emp.lastNameEn} • {emp.positionName}
                    </option>
                  ))}
                </select>
                {errors.directManagerId && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.directManagerId}</p>
                )}
              </div>
            </div>
          </div>

          {/* 4. Contact & Location Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-[#e3e8f9]">
              <Phone className="h-4 w-4 text-[#004a60]" />
              <span className="font-bold text-[#161c27] text-sm">
                {isArabic ? 'معلومات الاتصال والموقع' : 'Contact & Location Information'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Personal Phone */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'رقم الجوال الشخصي' : 'Personal Phone'}
                </label>
                <div className="flex rounded-xl border border-[#c3cce6] bg-[#f9f9ff] overflow-hidden focus-within:border-[#004a60] focus-within:bg-white">
                  <span className="px-3 py-2 bg-[#e8eeff] text-[#004a60] font-mono font-bold text-xs shrink-0 flex items-center gap-1 border-r border-[#c3cce6]">
                    <span>🇸🇦 +966</span>
                  </span>
                  <input
                    type="text"
                    value={personalPhone}
                    onChange={(e) => setPersonalPhone(e.target.value)}
                    placeholder="54XXXXXXX"
                    className="w-full px-3 py-2 text-xs font-mono outline-hidden"
                  />
                </div>
              </div>

              {/* Personal Email */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'البريد الإلكتروني الشخصي' : 'Personal Email'}
                </label>
                <input
                  type="email"
                  value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* 5. National Address Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-[#e3e8f9]">
              <MapPin className="h-4 w-4 text-[#004a60]" />
              <span className="font-bold text-[#161c27] text-sm">
                {isArabic ? 'تفاصيل العنوان الوطني السعودي (SPL)' : 'National Address Details'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Building Number */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'رقم المبنى' : 'Building Number'}
                </label>
                <input
                  type="text"
                  value={buildingNumber}
                  onChange={(e) => setBuildingNumber(e.target.value)}
                  placeholder="1234"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs font-mono focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* Street Name */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'اسم الشارع' : 'Street Name'}
                </label>
                <input
                  type="text"
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                  placeholder="King Fahd Road"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الدولة' : 'Country'}
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                >
                  <option value="Saudi Arabia">{isArabic ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Oman">Oman</option>
                  <option value="Qatar">Qatar</option>
                </select>
              </div>

              {/* Region */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'المنطقة' : 'Region'}
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                >
                  <option value="Riyadh Province">{isArabic ? 'منطقة الرياض' : 'Riyadh Province'}</option>
                  <option value="Makkah Province">{isArabic ? 'منطقة مكة المكرمة' : 'Makkah Province'}</option>
                  <option value="Eastern Province">{isArabic ? 'المنطقة الشرقية' : 'Eastern Province'}</option>
                  <option value="Madinah Province">{isArabic ? 'منطقة المدينة المنورة' : 'Madinah Province'}</option>
                  <option value="Asir Province">{isArabic ? 'منطقة عسير' : 'Asir Province'}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {/* City */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'المدينة' : 'City'}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Riyadh"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* District */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الحي' : 'District'}
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Al Malqa"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الرمز البريدي' : 'Postal Code'}
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="13321"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs font-mono focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              {/* Short Address */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'العنوان المختصر' : 'Short Address'}
                </label>
                <input
                  type="text"
                  value={shortAddress}
                  onChange={(e) => setShortAddress(e.target.value)}
                  placeholder="RRRR1234"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs font-mono focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'اسم جهة اتصال الطوارئ' : 'Emergency Contact Name'}
                </label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  placeholder="Omar Al-Mansoor"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'رقم طوارئ إضافي' : 'Additional Number'}
                </label>
                <div className="flex rounded-xl border border-[#c3cce6] bg-[#f9f9ff] overflow-hidden focus-within:border-[#004a60] focus-within:bg-white">
                  <span className="px-2.5 py-2 bg-[#e8eeff] text-[#004a60] font-mono font-bold text-[11px] shrink-0 border-r border-[#c3cce6]">
                    +966
                  </span>
                  <input
                    type="text"
                    value={emergencyAdditionalNumber}
                    onChange={(e) => setEmergencyAdditionalNumber(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-2.5 py-2 text-xs font-mono outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'هاتف الطوارئ' : 'Emergency Phone'}
                </label>
                <div className="flex rounded-xl border border-[#c3cce6] bg-[#f9f9ff] overflow-hidden focus-within:border-[#004a60] focus-within:bg-white">
                  <span className="px-2.5 py-2 bg-[#e8eeff] text-[#004a60] font-mono font-bold text-[11px] shrink-0 border-r border-[#c3cce6]">
                    +966
                  </span>
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="50XXXXXXX"
                    className="w-full px-2.5 py-2 text-xs font-mono outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'صلة القرابة' : 'Relationship'}
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                >
                  <option value="Parent">{isArabic ? 'أحد الوالدين' : 'Parent'}</option>
                  <option value="Spouse">{isArabic ? 'الزوج / الزوجة' : 'Spouse'}</option>
                  <option value="Sibling">{isArabic ? 'الأخ / الأخت' : 'Sibling'}</option>
                  <option value="Friend">{isArabic ? 'صديق' : 'Friend'}</option>
                  <option value="Other">{isArabic ? 'أخرى' : 'Other'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* 6. Accounting Mapping */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-[#e3e8f9]">
              <Calculator className="h-4 w-4 text-[#004a60]" />
              <span className="font-bold text-[#161c27] text-sm">
                {isArabic ? 'الربط المحاسبي (Accounting Mapping)' : 'Accounting Mapping'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 text-xs text-blue-900 flex items-start gap-2.5">
              <HelpCircle className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">
                  {isArabic ? 'رمز الحساب الفرعي (Account Code)' : 'Account Code'}
                </span>
                <p className="text-[11px] text-blue-800">
                  {isArabic
                    ? 'يتم إنشاؤه تلقائياً تحت الحساب "11223 - دفتر موظفي الفندق" بمجرد حفظ سجل الموظف.'
                    : 'Created automatically under 11223 - Employees Ledger when the employee is saved.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Opening Balance */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'الرصيد الافتتاحي (SAR)' : 'Opening Balance'}
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 -translate-y-1/2 left-3 font-mono font-bold text-[#70787d]">
                    SAR
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] py-2 pl-12 pr-3 text-xs font-mono font-bold focus:bg-white focus:border-[#004a60] outline-hidden"
                  />
                </div>
              </div>

              {/* Opening Balance Date */}
              <div>
                <label className="block font-semibold text-[#161c27] mb-1">
                  {isArabic ? 'تاريخ الرصيد الافتتاحي' : 'Opening Balance Date'}
                </label>
                <input
                  type="date"
                  value={openingBalanceDate}
                  onChange={(e) => setOpeningBalanceDate(e.target.value)}
                  placeholder="mm/dd/yyyy"
                  className="w-full rounded-xl border border-[#c3cce6] bg-[#f9f9ff] px-3 py-2 text-xs focus:bg-white focus:border-[#004a60] outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* 7. Documents */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-[#e3e8f9]">
              <Paperclip className="h-4 w-4 text-[#004a60]" />
              <span className="font-bold text-[#161c27] text-sm">
                {isArabic ? 'المستندات والوثائق الرسمية' : 'Documents'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Scanned Copy of ID/Iqama */}
              <div
                onClick={() => handleToggleDoc('idCopy')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  attachedDocs.idCopy
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-2xs'
                    : 'border-[#c3cce6] bg-[#f9f9ff] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs">
                    {isArabic ? 'صورة الهوية / الإقامة' : 'Scanned Copy of ID/Iqama'}
                  </span>
                  {attachedDocs.idCopy ? (
                    <FileCheck className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <UploadCloud className="h-4 w-4 text-[#70787d]" />
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#70787d]">
                  <span className="font-semibold text-[#004a60]">
                    {attachedDocs.idCopy ? (isArabic ? 'تم الإرفاق (PDF)' : 'Attached (PDF)') : (isArabic ? 'إرفاق ملف' : 'Attach File')}
                  </span>
                  <span className="text-[10px]">{isArabic ? 'اختياري' : 'Optional'}</span>
                </div>
              </div>

              {/* Signed Contract */}
              <div
                onClick={() => handleToggleDoc('contract')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  attachedDocs.contract
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-2xs'
                    : 'border-[#c3cce6] bg-[#f9f9ff] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs">
                    {isArabic ? 'العقد الموقع (قوى)' : 'Signed Contract'}
                  </span>
                  {attachedDocs.contract ? (
                    <FileCheck className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <UploadCloud className="h-4 w-4 text-[#70787d]" />
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#70787d]">
                  <span className="font-semibold text-[#004a60]">
                    {attachedDocs.contract ? (isArabic ? 'تم الإرفاق (PDF)' : 'Attached (PDF)') : (isArabic ? 'إرفاق ملف' : 'Attach File')}
                  </span>
                  <span className="text-[10px]">{isArabic ? 'اختياري' : 'Optional'}</span>
                </div>
              </div>

              {/* IBAN Certificate */}
              <div
                onClick={() => handleToggleDoc('iban')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  attachedDocs.iban
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-2xs'
                    : 'border-[#c3cce6] bg-[#f9f9ff] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs">
                    {isArabic ? 'شهادة الآيبان البنكي' : 'IBAN Certificate'}
                  </span>
                  {attachedDocs.iban ? (
                    <FileCheck className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <UploadCloud className="h-4 w-4 text-[#70787d]" />
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#70787d]">
                  <span className="font-semibold text-[#004a60]">
                    {attachedDocs.iban ? (isArabic ? 'تم الإرفاق (PDF)' : 'Attached (PDF)') : (isArabic ? 'إرفاق ملف' : 'Attach File')}
                  </span>
                  <span className="text-[10px]">{isArabic ? 'اختياري' : 'Optional'}</span>
                </div>
              </div>

              {/* Education Certificates */}
              <div
                onClick={() => handleToggleDoc('education')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  attachedDocs.education
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-2xs'
                    : 'border-[#c3cce6] bg-[#f9f9ff] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs">
                    {isArabic ? 'الشهادات والمؤهلات' : 'Education Certificates'}
                  </span>
                  {attachedDocs.education ? (
                    <FileCheck className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <UploadCloud className="h-4 w-4 text-[#70787d]" />
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#70787d]">
                  <span className="font-semibold text-[#004a60]">
                    {attachedDocs.education ? (isArabic ? 'تم الإرفاق (PDF)' : 'Attached (PDF)') : (isArabic ? 'إرفاق ملف' : 'Attach File')}
                  </span>
                  <span className="text-[10px]">{isArabic ? 'اختياري' : 'Optional'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions matching user specification: Cancel, Save Employee */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#e3e8f9] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#c3cce6] bg-white px-4 py-2.5 text-xs font-semibold text-[#161c27] hover:bg-[#f9f9ff] transition-colors"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#004a60] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#074e64] shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isArabic ? 'حفظ الموظف' : 'Save Employee'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
