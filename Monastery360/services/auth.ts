import { User } from '@/types';

// Mock authentication service
export class AuthService {
  private static currentUser: User | null = null;

  static async login(email: string, password: string): Promise<User> {
    // Mock login logic - will be replaced with Supabase
    await this.delay(1000);
    
    // Mock users for demonstration
    const mockUsers: Record<string, User> = {
      'tourist@monastery.com': {
        id: '1',
        email: 'tourist@monastery.com',
        name: 'Elena Rodriguez',
        role: 'tourist',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b913?w=150&h=150&fit=crop&crop=face',
        preferences: {
          language: 'en',
          notifications: true,
          offlineMode: false,
          audioGuideSettings: {
            autoPlay: true,
            volume: 0.8,
            preferredNarratorVoice: 'female_calm',
            downloadQuality: 'medium'
          }
        }
      },
      'admin@monastery.com': {
        id: '2',
        email: 'admin@monastery.com',
        name: 'Brother Marcus',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }
    };

    const user = mockUsers[email];
    if (!user || password !== '123456') {
      throw new Error('Invalid credentials');
    }

    this.currentUser = user;
    return user;
  }

  static async signup(name: string, email: string, password: string): Promise<User> {
    await this.delay(1000);
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'tourist',
      preferences: {
        language: 'en',
        notifications: true,
        offlineMode: false,
        audioGuideSettings: {
          autoPlay: true,
          volume: 0.8,
          preferredNarratorVoice: 'female_calm',
          downloadQuality: 'medium'
        }
      }
    };

    this.currentUser = newUser;
    return newUser;
  }

  static async logout(): Promise<void> {
    await this.delay(500);
    this.currentUser = null;
  }

  static getCurrentUser(): User | null {
    return this.currentUser;
  }

  static async refreshToken(): Promise<string | null> {
    await this.delay(300);
    return this.currentUser ? 'mock_token_' + Date.now() : null;
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}