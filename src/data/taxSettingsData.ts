export interface TaxConfig {
  id: string;
  code: string; // كود الضريبة e.g. VAT-15, MUN-05, TOUR-025, SRV-10
  name: string; // اسم الضريبة بالإنجليزية
  nameAr: string; // اسم الضريبة بالعربية
  rate: number; // نسبتها e.g. 15, 5, 2.5, 10
  type: 'percentage' | 'fixed_sar'; // نوع الضريبة: نسبة مئوية أو مبلغ ثابت
  typeAr: string;
  taxCategory: 'Standard' | 'ZeroRated' | 'Exempt' | 'TourismFee' | 'MunicipalFee' | 'ServiceCharge' | 'Custom';
  taxCategoryAr: string;
  status: 'active' | 'inactive';
  isRecoverable: boolean;
  applyToAllByDefault?: boolean;
  description?: string;
  descriptionAr?: string;
  zatcaCode?: string; // S, Z, E, O
}

export const DEFAULT_TAXES: TaxConfig[] = [
  {
    id: 'tax-vat-15',
    code: 'VAT-15',
    name: 'Value Added Tax (VAT 15%)',
    nameAr: 'ضريبة القيمة المضافة (15%)',
    rate: 15,
    type: 'percentage',
    typeAr: 'نسبة مئوية (%)',
    taxCategory: 'Standard',
    taxCategoryAr: 'النسبة الأساسية القياسية',
    status: 'active',
    isRecoverable: true,
    applyToAllByDefault: true,
    description: 'Standard KSA VAT enforced by ZATCA (Phase 2 Fatoora clearance ready).',
    descriptionAr: 'الضريبة العامة المعتمدة في المملكة العربية السعودية ومتوافقة مع هيئة الزكاة والضريبة والجمارك.',
    zatcaCode: 'S',
  },
  {
    id: 'tax-mun-05',
    code: 'MUN-05',
    name: 'Municipal Accommodation Fee (5%)',
    nameAr: 'رسوم البلدية للإيواء والمنشآت (5%)',
    rate: 5,
    type: 'percentage',
    typeAr: 'نسبة مئوية (%)',
    taxCategory: 'MunicipalFee',
    taxCategoryAr: 'رسوم بلدية إيواء فندقي',
    status: 'active',
    isRecoverable: false,
    applyToAllByDefault: false,
    description: 'Municipal lodging tax applied to hospitality buildings and residential suites.',
    descriptionAr: 'رسوم الإيواء البلدي للمنشآت والمباني الفندقية والشقق المخدومة المعتمدة.',
    zatcaCode: 'O',
  },
  {
    id: 'tax-tour-25',
    code: 'TOUR-2.5',
    name: 'Tourism Development Levy (2.5%)',
    nameAr: 'رسوم تنمية السياحة والضيافة (2.5%)',
    rate: 2.5,
    type: 'percentage',
    typeAr: 'نسبة مئوية (%)',
    taxCategory: 'TourismFee',
    taxCategoryAr: 'رسوم سياحية حكومية',
    status: 'active',
    isRecoverable: false,
    applyToAllByDefault: false,
    description: 'Saudi Tourism Authority development levy for licensed hospitality establishments.',
    descriptionAr: 'رسوم تنمية السياحة المعتمدة لقطاع الفنادق والوحدات السكنية السياحية.',
    zatcaCode: 'O',
  },
  {
    id: 'tax-srv-10',
    code: 'SRV-10',
    name: 'Hospitality Service Charge (10%)',
    nameAr: 'رسوم الخدمة الفندقية والتشغيل (10%)',
    rate: 10,
    type: 'percentage',
    typeAr: 'نسبة مئوية (%)',
    taxCategory: 'ServiceCharge',
    taxCategoryAr: 'رسوم خدمة فندقية وتشغيلية',
    status: 'active',
    isRecoverable: false,
    applyToAllByDefault: false,
    description: 'Direct hospitality operations service charge for premium residential suites.',
    descriptionAr: 'رسوم تشغيل وخدمة الضيافة المباشرة للمستويات والمنشآت الفندقية الفاخرة.',
    zatcaCode: 'O',
  },
  {
    id: 'tax-vat-0',
    code: 'VAT-0',
    name: 'Zero-Rated Tax (0%)',
    nameAr: 'ضريبة بنسبة الصفر (0%)',
    rate: 0,
    type: 'percentage',
    typeAr: 'نسبة مئوية (%)',
    taxCategory: 'ZeroRated',
    taxCategoryAr: 'معفاة / نسبة الصفر',
    status: 'active',
    isRecoverable: false,
    applyToAllByDefault: false,
    description: 'Eligible zero-rated transactions for qualified government diplomatic stays.',
    descriptionAr: 'معاملات معفاة من الضريبة أو خاضعة لنسبة الصفر للمستفيدين المؤهلين نظاماً.',
    zatcaCode: 'Z',
  },
];

const TAXES_STORAGE_KEY = 'khetat_tax_financial_settings_v1';

export function getStoredTaxes(): TaxConfig[] {
  try {
    const raw = localStorage.getItem(TAXES_STORAGE_KEY);
    if (!raw) {
      saveStoredTaxes(DEFAULT_TAXES);
      return DEFAULT_TAXES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_TAXES;
  } catch {
    return DEFAULT_TAXES;
  }
}

export function saveStoredTaxes(taxes: TaxConfig[]): void {
  try {
    localStorage.setItem(TAXES_STORAGE_KEY, JSON.stringify(taxes));
  } catch (err) {
    console.error('Failed to save taxes in localStorage', err);
  }
}

export interface TaxCalculationResult {
  baseAmount: number;
  totalTaxAmount: number;
  grandTotal: number;
  breakdown: {
    taxId: string;
    code: string;
    name: string;
    nameAr: string;
    rate: number;
    amount: number;
  }[];
}

export function calculateTierTaxes(
  baseAmount: number,
  appliedTaxIds: string[] = ['tax-vat-15'],
  taxesList?: TaxConfig[]
): TaxCalculationResult {
  const taxes = taxesList || getStoredTaxes();
  const activeTaxes = taxes.filter((t) => t.status === 'active' && appliedTaxIds.includes(t.id));

  let totalTaxAmount = 0;
  const breakdown = activeTaxes.map((t) => {
    let taxAmount = 0;
    if (t.type === 'percentage') {
      taxAmount = (baseAmount * t.rate) / 100;
    } else {
      taxAmount = t.rate;
    }
    totalTaxAmount += taxAmount;
    return {
      taxId: t.id,
      code: t.code,
      name: t.name,
      nameAr: t.nameAr,
      rate: t.rate,
      amount: taxAmount,
    };
  });

  return {
    baseAmount,
    totalTaxAmount: Math.round(totalTaxAmount * 100) / 100,
    grandTotal: Math.round((baseAmount + totalTaxAmount) * 100) / 100,
    breakdown,
  };
}
