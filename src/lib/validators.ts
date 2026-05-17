export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[^0-9]/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  if (password.length > 128) {
    return { valid: false, message: 'Password must be less than 128 characters' };
  }
  return { valid: true, message: '' };
}

export function validateAge(age: number): boolean {
  return age >= 0 && age <= 150;
}

export function validatePincode(pincode: string): boolean {
  const re = /^[0-9]{6}$/;
  return re.test(pincode);
}

export function validateAmount(amount: number): boolean {
  return amount >= 0 && amount <= 999999999;
}

export function validatePercentage(percent: number): boolean {
  return percent >= 0 && percent <= 100;
}

export function validateQuantity(qty: number): boolean {
  return qty >= 0 && qty <= 99999;
}

export function validateUPIId(upiId: string): boolean {
  const re = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;
  return re.test(upiId);
}

export function validateGST(gst: string): boolean {
  const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return re.test(gst);
}

export function validatePAN(pan: string): boolean {
  const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return re.test(pan);
}

export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateDateRange(start: string, end: string): boolean {
  const s = new Date(start);
  const e = new Date(end);
  return s <= e;
}

export function validateRequired(value: any, fieldName: string): string | null {
  if (value === null || value === undefined) return `${fieldName} is required`;
  if (typeof value === 'string' && value.trim() === '') return `${fieldName} is required`;
  if (Array.isArray(value) && value.length === 0) return `${fieldName} is required`;
  return null;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validatePatientForm(data: any): ValidationResult {
  const errors: Record<string, string> = {};

  const nameErr = validateRequired(data.name, 'Name');
  if (nameErr) errors.name = nameErr;

  const phoneErr = validateRequired(data.phone, 'Phone');
  if (phoneErr) errors.phone = phoneErr;
  else if (!validatePhone(data.phone)) errors.phone = 'Invalid phone number';

  if (data.email && !validateEmail(data.email)) errors.email = 'Invalid email address';

  if (data.age !== undefined && !validateAge(data.age)) errors.age = 'Invalid age';

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateBillForm(data: any): ValidationResult {
  const errors: Record<string, string> = {};

  const patientErr = validateRequired(data.patientId, 'Patient');
  if (patientErr) errors.patientId = patientErr;

  if (!data.items || data.items.length === 0) {
    errors.items = 'At least one item is required';
  } else {
    data.items.forEach((item: any, i: number) => {
      if (!item.name?.trim()) errors[`item_${i}_name`] = 'Item name required';
      if (!item.rate || item.rate <= 0) errors[`item_${i}_rate`] = 'Invalid rate';
    });
  }

  if (data.discountValue > 0 && !validatePercentage(data.discountValue) && data.discountType === 'Percentage') {
    errors.discount = 'Invalid discount percentage';
  }

  if (data.taxPercentage && !validatePercentage(data.taxPercentage)) {
    errors.tax = 'Invalid tax percentage';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateReportForm(data: any): ValidationResult {
  const errors: Record<string, string> = {};

  const patientErr = validateRequired(data.patientId, 'Patient');
  if (patientErr) errors.patientId = patientErr;

  const categoryErr = validateRequired(data.testCategory, 'Test category');
  if (categoryErr) errors.testCategory = categoryErr;

  const testErr = validateRequired(data.testName, 'Test name');
  if (testErr) errors.testName = testErr;

  if (!data.results || data.results.length === 0) {
    errors.results = 'At least one test result is required';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function sanitizeString(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

export function sanitizeNumber(input: string): number {
  const cleaned = input.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}