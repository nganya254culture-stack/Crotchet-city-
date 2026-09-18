export type ServiceCategory = 'all' | 'crochet' | 'starter' | 'repair' | 'styling' | 'detox' | 'extensions' | 'barber';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  duration: string;
  priceKsh: number;
  priceUsd: number;
  description: string;
  benefits: string[];
  isPopular?: boolean;
  tag?: string;
  image: string;
}

export interface Employee {
  id: string;
  name: string;
  moniker: string;
  role: string;
  title: string;
  experienceYears: number;
  bio: string;
  specialties: string[];
  avatar: string;
  availableToday: boolean;
  rating: number;
  completedHeads: number;
  quote: string;
  instagram: string;
  isOwner?: boolean;
}

export interface CustomerReview {
  id: string;
  author: string;
  avatar: string;
  locAge: string;
  serviceType: string;
  locticianName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

export interface TransformationItem {
  id: string;
  title: string;
  clientName: string;
  service: string;
  loctician: string;
  duration: string;
  beforeDescription: string;
  afterDescription: string;
  beforeImg: string;
  afterImg: string;
  neatnessKeyFactors: string[];
}

export interface BookingRequest {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceId: string;
  serviceName: string;
  locticianId: string;
  locticianName: string;
  date: string;
  timeSlot: string;
  notes?: string;
  amountKsh: number;
  depositPaidKsh: number;
  mpesaCode?: string;
  status: 'confirmed' | 'pending_payment';
  createdAt: string;
}

export interface MpesaTransaction {
  id: string;
  receiptNumber: string;
  phoneNumber: string;
  amount: number;
  purpose: string;
  status: 'success' | 'processing' | 'failed';
  timestamp: string;
}
