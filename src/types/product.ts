export interface ProductLaunch {
  id: string;
  name: string;
  category: 'dog_food' | 'puppy_food' | 'treats' | 'supplements';
  targetAudience: 'puppies' | 'adult_dogs' | 'senior_dogs';
  healthFocus: string[];
  launchDate: string;
  status: 'draft' | 'in_progress' | 'launched' | 'completed';
  description: string;
  price: number;
  seoKeywords: string[];
  socialMediaCopy: {
    instagram: string[];
    facebook: string[];
    twitter: string[];
  };
}

export interface UserProfile {
  id: string;
  segment: 'new_puppy_owner' | 'experienced_owner' | 'veterinarian' | 'breeder';
  interests: string[];
  dogBreed?: string;
  dogAge?: number;
  preferences: {
    contentType: string[];
    socialPlatforms: string[];
  };
}

export interface SEOKeyword {
  keyword: string;
  searchVolume: number;
  difficulty: 'low' | 'medium' | 'high';
  category: string;
  intent: 'informational' | 'commercial' | 'transactional';
}

export interface SocialMediaPost {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter';
  content: string;
  hashtags: string[];
  targetSegment: string;
  performance?: {
    engagement: number;
    reach: number;
    clicks: number;
  };
}