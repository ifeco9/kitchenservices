export type Role = 'customer' | 'technician' | 'admin';
export type AvailabilityStatus = 'available' | 'limited' | 'unavailable';
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: Role;
  phone?: string;
  address?: string;
  city?: string;
  postcode?: string;
  preferred_contact?: 'email' | 'phone';
  created_at: string;
}

export interface Certification {
  name: string;
  issuer: string;
  verified: boolean;
  renewal_date?: string;
}


export interface TechnicianAvailability {
  id: string;
  technician_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export interface TechnicianService {
  id: string;
  technician_id: string;
  service_id: string;
  custom_price?: number;
  is_active: boolean;
  created_at: string;
  // Computed/Joined
  service?: Service;
}

export interface Technician extends Profile {
  bio?: string;
  specializations: string[];
  certifications: Certification[];
  years_experience: number;
  hourly_rate: number;
  callout_fee: number;
  service_radius_miles: number;
  is_verified: boolean;
  availability_status: AvailabilityStatus;
  location_lat?: number;
  location_lng?: number;
  address?: string;
  // Computed/Joined fields
  rating?: number;
  review_count?: number;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  icon_name: string;
  category: 'repair' | 'installation' | 'maintenance';
}

export interface Booking {
  id: string;
  customer_id: string;
  technician_id: string;
  service_id: string;
  status: BookingStatus;
  scheduled_date: string;
  duration_hours?: number; // Duration of the booking in hours (default: 2)
  total_amount: number;
  description?: string;
  address: string;
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  technician_id: string;
  customer_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}
