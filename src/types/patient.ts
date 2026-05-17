export interface Patient {
  id: string;
  labId: string;
  name: string;
  email?: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  referredBy?: string;
  referralDoctor?: string;
  notes?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  totalVisits: number;
  lastVisit?: string;
  totalSpent: number;
  status: 'Active' | 'Inactive';
  tags?: string[];
  bloodGroup?: string;
  dob?: string;
}

export interface PatientFormData {
  name: string;
  email?: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  referredBy?: string;
  referralDoctor?: string;
  notes?: string;
  bloodGroup?: string;
  dob?: string;
  tags?: string[];
}