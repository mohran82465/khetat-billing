export interface Department {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  usaliDepartment: string;
  usaliGlCode: string;
  headOfDepartment: string;
  positionsCount: number;
  employeesCount: number;
  createdAt: string;
}

export interface PositionRole {
  id: string;
  name: string;
  nameAr: string;
  departmentId: string;
  departmentName: string;
  description: string;
  roleType: string;
  level: string;
  reportsToPositionId?: string;
  employeesCount: number;
  createdAt: string;
}

export interface EmployeeRecord {
  id: string;
  employeeCode: string;
  firstNameEn: string;
  lastNameEn: string;
  firstNameAr: string;
  lastNameAr: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  nationality: string;
  maritalStatus: string;
  bloodType: string;
  // Legal & Compliance
  idType: string;
  idNumber: string;
  idIssueDate: string;
  idExpiryHijri: string;
  passportNumber: string;
  passportExpiry: string;
  gosiNumber: string;
  sponsorshipStatus: string;
  professionOnId: string;
  // Placement
  departmentId: string;
  departmentName: string;
  positionId: string;
  positionName: string;
  employeeLevel: string;
  dateOfJoining: string;
  designation: string;
  directManagerId: string;
  directManagerName: string;
  // Contact
  personalPhone: string;
  personalEmail: string;
  // Address
  buildingNumber: string;
  streetName: string;
  country: string;
  region: string;
  city: string;
  district: string;
  postalCode: string;
  shortAddress: string;
  emergencyContactName: string;
  emergencyAdditionalNumber?: string;
  emergencyPhone: string;
  relationship: string;
  // Accounting
  accountCode: string;
  openingBalance: number;
  openingBalanceDate: string;
  // Meta
  avatarColor: string;
  status: 'Active' | 'On Leave' | 'Probation';
  documentsCount: number;
}

export const USALI_PAYROLL_DEPARTMENTS = [
  { id: 'usali-rooms', name: 'Rooms Division (GL: 6100 - Payroll & Related)', code: '6100' },
  { id: 'usali-fb', name: 'Food & Beverage (GL: 6200 - Payroll & Related)', code: '6200' },
  { id: 'usali-admin', name: 'Administrative & General (GL: 6300 - Payroll & Related)', code: '6300' },
  { id: 'usali-sales', name: 'Sales & Marketing (GL: 6400 - Payroll & Related)', code: '6400' },
  { id: 'usali-pom', name: 'Property Operations & Maintenance (GL: 6500)', code: '6500' },
  { id: 'usali-it', name: 'Information & Telecommunication Systems (GL: 6600)', code: '6600' },
  { id: 'usali-hr', name: 'Human Resources (GL: 6700 - Payroll & Benefits)', code: '6700' },
  { id: 'usali-security', name: 'Security & Guest Safety Services (GL: 6150)', code: '6150' },
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-1',
    name: 'Front Office & Guest Services',
    nameAr: 'المكاتب الأمامية وخدمات النزلاء',
    description: 'Guest check-in/out, concierge, VIP arrivals, IoT key dispensing, and front desk cashiers.',
    usaliDepartment: 'Rooms Division (GL: 6100 - Payroll & Related)',
    usaliGlCode: '6100',
    headOfDepartment: 'Ziyad Al-Bishri',
    positionsCount: 4,
    employeesCount: 18,
    createdAt: '2026-01-15',
  },
  {
    id: 'dept-2',
    name: 'Housekeeping Operations',
    nameAr: 'خدمة الغرف والإشراف الداخلي',
    description: 'Room turnover, linen inventory management, guest amenities replenishing, and public area hygiene.',
    usaliDepartment: 'Rooms Division (GL: 6100 - Payroll & Related)',
    usaliGlCode: '6100',
    headOfDepartment: 'Reem Al-Zahrani',
    positionsCount: 3,
    employeesCount: 22,
    createdAt: '2026-01-15',
  },
  {
    id: 'dept-3',
    name: 'Food & Beverage',
    nameAr: 'الأغذية والمشروبات والمطاعم',
    description: 'Fine dining outlets, room service catering, breakfast commissary, and kitchen sanitation.',
    usaliDepartment: 'Food & Beverage (GL: 6200 - Payroll & Related)',
    usaliGlCode: '6200',
    headOfDepartment: 'Chef Jean-Paul Martin',
    positionsCount: 5,
    employeesCount: 14,
    createdAt: '2026-01-20',
  },
  {
    id: 'dept-4',
    name: 'Finance & USALI Accounting',
    nameAr: 'الإدارة المالية والمحاسبة الفندقية',
    description: 'Ledger management, daily night audits, AP/AR, ZATCA tax returns, and bank reconciliations.',
    usaliDepartment: 'Administrative & General (GL: 6300 - Payroll & Related)',
    usaliGlCode: '6300',
    headOfDepartment: 'Fahad Al-Shehri',
    positionsCount: 3,
    employeesCount: 6,
    createdAt: '2026-01-10',
  },
  {
    id: 'dept-5',
    name: 'Human Resources & Talent',
    nameAr: 'الموارد البشرية واستقطاب الكفاءات',
    description: 'Workforce Saudization (Nitaqat Platinum), GOSI compliance, recruitment, and employee relations.',
    usaliDepartment: 'Human Resources (GL: 6700 - Payroll & Benefits)',
    usaliGlCode: '6700',
    headOfDepartment: 'Sultan Al-Shahrani',
    positionsCount: 2,
    employeesCount: 4,
    createdAt: '2026-01-10',
  },
];

export const INITIAL_POSITIONS: PositionRole[] = [
  {
    id: 'pos-1',
    name: 'Hotel General Manager',
    nameAr: 'المدير العام للمنشأة الفندقية',
    departmentId: 'dept-4',
    departmentName: 'Finance & USALI Accounting',
    description: 'Overall strategic leadership, owner relations, and operational compliance across hotel units.',
    roleType: 'Executive',
    level: 'Executive',
    employeesCount: 1,
    createdAt: '2026-01-10',
  },
  {
    id: 'pos-2',
    name: 'Revenue Manager',
    nameAr: 'مدير العوائد والتسعير الديناميكي',
    departmentId: 'dept-4',
    departmentName: 'Finance & USALI Accounting',
    description: 'Dynamic pricing models, OTA channel allocation, RevPAR optimization, and yield forecasting.',
    roleType: 'Management',
    level: 'Manager',
    reportsToPositionId: 'pos-1',
    employeesCount: 1,
    createdAt: '2026-01-12',
  },
  {
    id: 'pos-3',
    name: 'Front Desk Operations Supervisor',
    nameAr: 'مشرف عمليات الاستقبال',
    departmentId: 'dept-1',
    departmentName: 'Front Office & Guest Services',
    description: 'Manages reception staff, VIP check-ins, guest dispute resolution, and shift handovers.',
    roleType: 'Supervisory',
    level: 'Supervisor',
    reportsToPositionId: 'pos-1',
    employeesCount: 3,
    createdAt: '2026-01-15',
  },
  {
    id: 'pos-4',
    name: 'Guest Service Agent',
    nameAr: 'موظف خدمة النزلاء والاستقبال',
    departmentId: 'dept-1',
    departmentName: 'Front Office & Guest Services',
    description: 'Direct guest handling, passport scanning, room key dispensing, and billing enquiries.',
    roleType: 'Operational',
    level: 'Entry Level',
    reportsToPositionId: 'pos-3',
    employeesCount: 15,
    createdAt: '2026-01-15',
  },
  {
    id: 'pos-5',
    name: 'Executive Housekeeper',
    nameAr: 'مديرة الإشراف الداخلي',
    departmentId: 'dept-2',
    departmentName: 'Housekeeping Operations',
    description: 'Supervises room cleaning cycles, inspection reports, laundry contracts, and inventory.',
    roleType: 'Management',
    level: 'Manager',
    reportsToPositionId: 'pos-1',
    employeesCount: 1,
    createdAt: '2026-01-15',
  },
  {
    id: 'pos-6',
    name: 'Senior Financial Controller',
    nameAr: 'المراقب المالي الأول',
    departmentId: 'dept-4',
    departmentName: 'Finance & USALI Accounting',
    description: 'Oversees USALI ledger balancing, supplier payments, cash flow, and ZATCA submissions.',
    roleType: 'Management',
    level: 'Manager',
    reportsToPositionId: 'pos-1',
    employeesCount: 2,
    createdAt: '2026-01-10',
  },
  {
    id: 'pos-7',
    name: 'HR & Saudization Specialist',
    nameAr: 'أخصائي موارد بشرية وتوطين',
    departmentId: 'dept-5',
    departmentName: 'Human Resources & Talent',
    description: 'Responsible for Qiwa platform contracts, Mudad payroll compliance, and GOSI filings.',
    roleType: 'Professional',
    level: 'Senior Staff',
    reportsToPositionId: 'pos-1',
    employeesCount: 3,
    createdAt: '2026-01-12',
  },
];

export const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  {
    id: 'emp-1',
    employeeCode: 'EMP-0101',
    firstNameEn: 'Mansour',
    lastNameEn: 'Al-Harbi',
    firstNameAr: 'منصور',
    lastNameAr: 'الحربي',
    dateOfBirth: '1980-04-12',
    gender: 'Male',
    nationality: 'Saudi Arabia',
    maritalStatus: 'Married',
    bloodType: 'O+',
    idType: 'National ID',
    idNumber: '1029384756',
    idIssueDate: '2020-05-10',
    idExpiryHijri: '1450/04/15',
    passportNumber: 'KSA882910',
    passportExpiry: '2029-08-20',
    gosiNumber: '992019283',
    sponsorshipStatus: 'Company Sponsored',
    professionOnId: 'General Manager',
    departmentId: 'dept-4',
    departmentName: 'Finance & USALI Accounting',
    positionId: 'pos-1',
    positionName: 'Hotel General Manager',
    employeeLevel: 'Executive',
    dateOfJoining: '2022-01-01',
    designation: 'Managing Director & CEO',
    directManagerId: 'none',
    directManagerName: 'Board of Directors',
    personalPhone: '+966 50 123 4567',
    personalEmail: 'm.harbi@khetathospitality.sa',
    buildingNumber: '1234',
    streetName: 'King Fahd Road',
    country: 'Saudi Arabia',
    region: 'Riyadh Province',
    city: 'Riyadh',
    district: 'Al Malqa',
    postalCode: '13321',
    shortAddress: 'RRRR1234',
    emergencyContactName: 'Fahad Al-Harbi',
    emergencyPhone: '+966 55 998 1234',
    relationship: 'Sibling',
    accountCode: '11223-0101',
    openingBalance: 0.0,
    openingBalanceDate: '2022-01-01',
    avatarColor: 'bg-emerald-600',
    status: 'Active',
    documentsCount: 4,
  },
  {
    id: 'emp-2',
    employeeCode: 'EMP-0102',
    firstNameEn: 'Ziyad',
    lastNameEn: 'Al-Bishri',
    firstNameAr: 'زياد',
    lastNameAr: 'البشري',
    dateOfBirth: '1988-09-22',
    gender: 'Male',
    nationality: 'Saudi Arabia',
    maritalStatus: 'Married',
    bloodType: 'A+',
    idType: 'National ID',
    idNumber: '1048291029',
    idIssueDate: '2021-02-14',
    idExpiryHijri: '1448/11/02',
    passportNumber: 'KSA771920',
    passportExpiry: '2030-01-15',
    gosiNumber: '883920194',
    sponsorshipStatus: 'Company Sponsored',
    professionOnId: 'Front Office Supervisor',
    departmentId: 'dept-1',
    departmentName: 'Front Office & Guest Services',
    positionId: 'pos-3',
    positionName: 'Front Desk Operations Supervisor',
    employeeLevel: 'Supervisor',
    dateOfJoining: '2023-03-15',
    designation: 'Front Office Lead',
    directManagerId: 'emp-1',
    directManagerName: 'Mansour Al-Harbi',
    personalPhone: '+966 54 882 1920',
    personalEmail: 'z.bishri@khetathospitality.sa',
    buildingNumber: '4421',
    streetName: 'Olaya Street',
    country: 'Saudi Arabia',
    region: 'Riyadh Province',
    city: 'Riyadh',
    district: 'Al-Yasmin',
    postalCode: '13325',
    shortAddress: 'OLYA4421',
    emergencyContactName: 'Noura Al-Bishri',
    emergencyPhone: '+966 50 441 9922',
    relationship: 'Spouse',
    accountCode: '11223-0102',
    openingBalance: 0.0,
    openingBalanceDate: '2023-03-15',
    avatarColor: 'bg-blue-600',
    status: 'Active',
    documentsCount: 3,
  },
  {
    id: 'emp-3',
    employeeCode: 'EMP-0103',
    firstNameEn: 'Reem',
    lastNameEn: 'Al-Zahrani',
    firstNameAr: 'ريم',
    lastNameAr: 'الزهراني',
    dateOfBirth: '1992-06-18',
    gender: 'Female',
    nationality: 'Saudi Arabia',
    maritalStatus: 'Single',
    bloodType: 'B+',
    idType: 'National ID',
    idNumber: '1099281920',
    idIssueDate: '2022-07-01',
    idExpiryHijri: '1451/02/10',
    passportNumber: 'KSA662019',
    passportExpiry: '2031-04-18',
    gosiNumber: '772910481',
    sponsorshipStatus: 'Company Sponsored',
    professionOnId: 'Operations Executive',
    departmentId: 'dept-2',
    departmentName: 'Housekeeping Operations',
    positionId: 'pos-5',
    positionName: 'Executive Housekeeper',
    employeeLevel: 'Manager',
    dateOfJoining: '2023-08-01',
    designation: 'Head of Housekeeping',
    directManagerId: 'emp-1',
    directManagerName: 'Mansour Al-Harbi',
    personalPhone: '+966 56 229 1049',
    personalEmail: 'r.zahrani@khetathospitality.sa',
    buildingNumber: '8820',
    streetName: 'Anas Ibn Malik Road',
    country: 'Saudi Arabia',
    region: 'Riyadh Province',
    city: 'Riyadh',
    district: 'Al Narjis',
    postalCode: '13328',
    shortAddress: 'NRJS8820',
    emergencyContactName: 'Dr. Mona Al-Zahrani',
    emergencyPhone: '+966 53 118 9944',
    relationship: 'Parent',
    accountCode: '11223-0103',
    openingBalance: 0.0,
    openingBalanceDate: '2023-08-01',
    avatarColor: 'bg-purple-600',
    status: 'Active',
    documentsCount: 4,
  },
  {
    id: 'emp-4',
    employeeCode: 'EMP-0104',
    firstNameEn: 'Fahad',
    lastNameEn: 'Al-Shehri',
    firstNameAr: 'فهد',
    lastNameAr: 'الشهري',
    dateOfBirth: '1985-11-04',
    gender: 'Male',
    nationality: 'Saudi Arabia',
    maritalStatus: 'Married',
    bloodType: 'O+',
    idType: 'National ID',
    idNumber: '1019283746',
    idIssueDate: '2019-10-12',
    idExpiryHijri: '1449/08/20',
    passportNumber: 'KSA554910',
    passportExpiry: '2028-11-30',
    gosiNumber: '661928471',
    sponsorshipStatus: 'Company Sponsored',
    professionOnId: 'Chief Accountant',
    departmentId: 'dept-4',
    departmentName: 'Finance & USALI Accounting',
    positionId: 'pos-6',
    positionName: 'Senior Financial Controller',
    employeeLevel: 'Manager',
    dateOfJoining: '2022-04-10',
    designation: 'Head of Finance',
    directManagerId: 'emp-1',
    directManagerName: 'Mansour Al-Harbi',
    personalPhone: '+966 50 338 1920',
    personalEmail: 'f.shehri@khetathospitality.sa',
    buildingNumber: '3102',
    streetName: 'Tahlia Street',
    country: 'Saudi Arabia',
    region: 'Riyadh Province',
    city: 'Riyadh',
    district: 'Al Sulaimaniyah',
    postalCode: '12243',
    shortAddress: 'SLMN3102',
    emergencyContactName: 'Abdullah Al-Shehri',
    emergencyPhone: '+966 55 441 2299',
    relationship: 'Sibling',
    accountCode: '11223-0104',
    openingBalance: 0.0,
    openingBalanceDate: '2022-04-10',
    avatarColor: 'bg-indigo-600',
    status: 'Active',
    documentsCount: 3,
  },
  {
    id: 'emp-5',
    employeeCode: 'EMP-0105',
    firstNameEn: 'Sultan',
    lastNameEn: 'Al-Shahrani',
    firstNameAr: 'سلطان',
    lastNameAr: 'الشهراني',
    dateOfBirth: '1990-02-17',
    gender: 'Male',
    nationality: 'Saudi Arabia',
    maritalStatus: 'Married',
    bloodType: 'AB+',
    idType: 'National ID',
    idNumber: '1077281940',
    idIssueDate: '2021-09-05',
    idExpiryHijri: '1450/01/14',
    passportNumber: 'KSA449102',
    passportExpiry: '2029-06-25',
    gosiNumber: '552918472',
    sponsorshipStatus: 'Company Sponsored',
    professionOnId: 'HR Specialist',
    departmentId: 'dept-5',
    departmentName: 'Human Resources & Talent',
    positionId: 'pos-7',
    positionName: 'HR & Saudization Specialist',
    employeeLevel: 'Senior Staff',
    dateOfJoining: '2023-01-15',
    designation: 'People & Culture Lead',
    directManagerId: 'emp-1',
    directManagerName: 'Mansour Al-Harbi',
    personalPhone: '+966 55 771 9028',
    personalEmail: 's.shahrani@khetathospitality.sa',
    buildingNumber: '5512',
    streetName: 'Prince Turki Al-Awwal Road',
    country: 'Saudi Arabia',
    region: 'Riyadh Province',
    city: 'Riyadh',
    district: 'Al Nakheel',
    postalCode: '12384',
    shortAddress: 'NKHL5512',
    emergencyContactName: 'Sarah Al-Shahrani',
    emergencyPhone: '+966 50 882 1199',
    relationship: 'Spouse',
    accountCode: '11223-0105',
    openingBalance: 0.0,
    openingBalanceDate: '2023-01-15',
    avatarColor: 'bg-amber-600',
    status: 'Active',
    documentsCount: 4,
  },
  {
    id: 'emp-6',
    employeeCode: 'EMP-0106',
    firstNameEn: 'John',
    lastNameEn: 'Doe',
    firstNameAr: 'أحمد',
    lastNameAr: 'المنصور',
    dateOfBirth: '1994-08-14',
    gender: 'Male',
    nationality: 'Saudi Arabia',
    maritalStatus: 'Single',
    bloodType: 'O+',
    idType: 'National ID',
    idNumber: '1088491029',
    idIssueDate: '2022-03-20',
    idExpiryHijri: '1447/05/20',
    passportNumber: 'KSA338192',
    passportExpiry: '2032-10-10',
    gosiNumber: '449102948',
    sponsorshipStatus: 'Company Sponsored',
    professionOnId: 'Specialist',
    departmentId: 'dept-1',
    departmentName: 'Front Office & Guest Services',
    positionId: 'pos-4',
    positionName: 'Guest Service Agent',
    employeeLevel: 'Entry Level',
    dateOfJoining: '2024-02-01',
    designation: 'Front Office Associate',
    directManagerId: 'emp-2',
    directManagerName: 'Ziyad Al-Bishri',
    personalPhone: '+966 54 112 3344',
    personalEmail: 'john.doe@example.com',
    buildingNumber: '1234',
    streetName: 'King Fahd Road',
    country: 'Saudi Arabia',
    region: 'Riyadh Province',
    city: 'Riyadh',
    district: 'Al Malqa',
    postalCode: '13321',
    shortAddress: 'RRRR1234',
    emergencyContactName: 'Omar Al-Mansoor',
    emergencyPhone: '+966 50 119 2837',
    relationship: 'Parent',
    accountCode: '11223-0106',
    openingBalance: 0.0,
    openingBalanceDate: '2024-02-01',
    avatarColor: 'bg-teal-600',
    status: 'Active',
    documentsCount: 2,
  },
];
