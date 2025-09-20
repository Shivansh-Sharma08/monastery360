export interface User {
  id: string;
  email: string;
  name: string;
  role: 'tourist' | 'admin';
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language: string;
  notifications: boolean;
  offlineMode: boolean;
  audioGuideSettings: AudioGuideSettings;
}

export interface AudioGuideSettings {
  autoPlay: boolean;
  volume: number;
  preferredNarratorVoice: string;
  downloadQuality: 'low' | 'medium' | 'high';
}

export interface Monastery {
  id: string;
  name: string;
  description: string;
  location: Location;
  images: string[];
  virtualTours: VirtualTour[];
  panoramicViews: PanoramicView[];
  audioGuides: AudioGuide[];
  manuscripts: Manuscript[];
  nearbyAttractions: Attraction[];
  culturalEvents: CulturalEvent[];
  visitingHours: VisitingHours;
  ticketPricing: TicketPricing;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  region: string;
  country: string;
}

export interface VirtualTour {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  thumbnailUrl: string;
  tourUrl: string;
  language: string;
  highlights: string[];
}

export interface PanoramicView {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  hotspots: Hotspot[];
  location: string;
}

export interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  title: string;
  description: string;
  audioUrl?: string;
  relatedContent?: string[];
}

export interface AudioGuide {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  language: string;
  beaconId?: string; // for location-based triggers
  transcript?: string;
}

export interface Manuscript {
  id: string;
  title: string;
  description: string;
  period: string;
  imageUrls: string[];
  tags: string[];
  digitizedPages: DigitizedPage[];
}

export interface DigitizedPage {
  id: string;
  pageNumber: number;
  imageUrl: string;
  transcription?: string;
  annotations: Annotation[];
}

export interface Annotation {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  type: 'historical' | 'artistic' | 'religious' | 'linguistic';
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  location: Location;
  distance: number; // in kilometers
  type: 'monastery' | 'museum' | 'restaurant' | 'accommodation' | 'nature';
  rating: number;
  imageUrl: string;
}

export interface CulturalEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  type: 'festival' | 'ritual' | 'exhibition' | 'workshop' | 'ceremony';
  ticketsRequired: boolean;
  maxParticipants?: number;
  currentParticipants: number;
  imageUrl: string;
}

export interface VisitingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  open: boolean;
  openTime?: string;
  closeTime?: string;
  specialNotes?: string;
}

export interface TicketPricing {
  adult: number;
  student: number;
  senior: number;
  child: number;
  family: number;
  currency: string;
}

export interface Booking {
  id: string;
  userId: string;
  monasteryId: string;
  eventId?: string;
  visitDate: string;
  visitors: VisitorInfo[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequests?: string;
}

export interface VisitorInfo {
  name: string;
  age: number;
  ticketType: string;
}

export interface AdminStats {
  totalVisitors: number;
  totalRevenue: number;
  popularTours: string[];
  upcomingEvents: number;
  averageRating: number;
  monthlyGrowth: number;
}