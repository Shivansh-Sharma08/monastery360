import { Monastery, CulturalEvent, Booking, AdminStats } from '@/types';

export class MonasteryService {
  
  static async getMonasteries(): Promise<Monastery[]> {
    await this.delay(800);
    return mockMonasteries;
  }

  static async getMonasteryById(id: string): Promise<Monastery | null> {
    await this.delay(500);
    return mockMonasteries.find(m => m.id === id) || null;
  }

  static async searchMonasteries(query: string): Promise<Monastery[]> {
    await this.delay(600);
    return mockMonasteries.filter(m => 
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  static async getNearbyAttractions(monasteryId: string): Promise<any[]> {
    await this.delay(400);
    const monastery = mockMonasteries.find(m => m.id === monasteryId);
    return monastery?.nearbyAttractions || [];
  }

  static async getCulturalEvents(): Promise<CulturalEvent[]> {
    await this.delay(500);
    return mockCulturalEvents;
  }

  static async bookVisit(booking: Omit<Booking, 'id' | 'status' | 'paymentStatus'>): Promise<Booking> {
    await this.delay(1000);
    return {
      ...booking,
      id: Date.now().toString(),
      status: 'confirmed',
      paymentStatus: 'paid'
    };
  }

  static async getAdminStats(): Promise<AdminStats> {
    await this.delay(700);
    return {
      totalVisitors: 12847,
      totalRevenue: 89650,
      popularTours: ['Sacred Architecture', 'Manuscript Collection', 'Garden Meditation'],
      upcomingEvents: 8,
      averageRating: 4.8,
      monthlyGrowth: 15.3
    };
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Mock data
const mockMonasteries: Monastery[] = [
  {
    id: '1',
    name: 'Monastery of Sacred Wisdom',
    description: 'A 12th-century monastery renowned for its magnificent frescoes and extensive manuscript collection. This sacred place has been a center of learning and spiritual contemplation for over 800 years.',
    location: {
      latitude: 42.6977,
      longitude: 23.3219,
      address: 'Sacred Mountain Path 1',
      city: 'Rila',
      region: 'Sofia Province',
      country: 'Bulgaria'
    },
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549298916-f52d724204b4?w=800&h=600&fit=crop'
    ],
    virtualTours: [
      {
        id: 'vt1',
        title: 'Sacred Architecture Tour',
        description: 'Explore the stunning Byzantine architecture and intricate stone carvings',
        duration: 25,
        thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tourUrl: '/virtual-tours/sacred-architecture',
        language: 'en',
        highlights: ['Main Chapel', 'Bell Tower', 'Cloister Walkways', 'Ancient Foundations']
      }
    ],
    panoramicViews: [
      {
        id: 'pv1',
        title: 'Main Chapel Interior',
        description: 'Experience the breathtaking frescoes and sacred atmosphere',
        imageUrl: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1200&h=600&fit=crop',
        hotspots: [
          {
            id: 'hs1',
            x: 30,
            y: 20,
            title: 'Altar Iconostasis',
            description: 'Hand-carved wooden screen decorated with gold leaf icons'
          }
        ],
        location: 'Main Chapel'
      }
    ],
    audioGuides: [
      {
        id: 'ag1',
        title: 'Welcome to Sacred Wisdom',
        description: 'Introduction to the monastery history and significance',
        audioUrl: '/audio/welcome-guide.mp3',
        duration: 180,
        language: 'en',
        transcript: 'Welcome to the Monastery of Sacred Wisdom...'
      }
    ],
    manuscripts: [
      {
        id: 'ms1',
        title: 'The Chronicle of Sacred Wisdom',
        description: '13th-century illuminated manuscript detailing the monastery foundation',
        period: '1204-1230',
        imageUrls: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=800&fit=crop'],
        tags: ['illuminated', 'chronicle', 'foundation', 'medieval'],
        digitizedPages: []
      }
    ],
    nearbyAttractions: [
      {
        id: 'na1',
        name: 'Sacred Mountain Trail',
        description: 'Scenic hiking trail with panoramic views',
        location: {
          latitude: 42.7000,
          longitude: 23.3200,
          address: 'Mountain Trail Head',
          city: 'Rila',
          region: 'Sofia Province',
          country: 'Bulgaria'
        },
        distance: 2.5,
        type: 'nature',
        rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec65b5?w=400&h=300&fit=crop'
      }
    ],
    culturalEvents: [
      {
        id: 'ce1',
        title: 'Autumn Harvest Festival',
        description: 'Traditional celebration with local music and blessed harvest',
        startDate: '2024-09-21',
        endDate: '2024-09-23',
        location: 'Monastery Courtyard',
        type: 'festival',
        ticketsRequired: false,
        currentParticipants: 0,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
      }
    ],
    visitingHours: {
      monday: { open: true, openTime: '09:00', closeTime: '17:00' },
      tuesday: { open: true, openTime: '09:00', closeTime: '17:00' },
      wednesday: { open: true, openTime: '09:00', closeTime: '17:00' },
      thursday: { open: true, openTime: '09:00', closeTime: '17:00' },
      friday: { open: true, openTime: '09:00', closeTime: '17:00' },
      saturday: { open: true, openTime: '09:00', closeTime: '18:00' },
      sunday: { open: true, openTime: '10:00', closeTime: '16:00', specialNotes: 'Limited access during morning service' }
    },
    ticketPricing: {
      adult: 15,
      student: 10,
      senior: 12,
      child: 8,
      family: 40,
      currency: 'EUR'
    }
  }
];

const mockCulturalEvents: CulturalEvent[] = [
  {
    id: 'ce1',
    title: 'Autumn Harvest Festival',
    description: 'Traditional celebration with local music, blessed harvest, and community gathering. Experience centuries-old traditions in an authentic monastery setting.',
    startDate: '2024-09-21',
    endDate: '2024-09-23',
    location: 'Monastery Courtyard',
    type: 'festival',
    ticketsRequired: false,
    currentParticipants: 0,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
  },
  {
    id: 'ce2',
    title: 'Manuscript Illumination Workshop',
    description: 'Learn the ancient art of manuscript illumination from master scribes. Create your own illuminated letter using traditional techniques.',
    startDate: '2024-10-05',
    endDate: '2024-10-05',
    location: 'Scriptorium',
    type: 'workshop',
    ticketsRequired: true,
    maxParticipants: 12,
    currentParticipants: 8,
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
  }
];