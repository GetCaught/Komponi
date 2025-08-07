import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  full_name: string
  role: 'influencer' | 'company'
  avatar_url?: string
  bio?: string
  website?: string
  location?: string
  created_at: string
  updated_at: string
  // Influencer-specific fields (optional for companies)
  followers_count?: number
  engagement_rate?: number
  categories?: string[]
  social_media_handles?: {
    instagram?: string
    tiktok?: string
    youtube?: string
    twitter?: string
  }
  // Company-specific fields (optional for influencers)
  company_name?: string
  industry?: string
  company_size?: string
}

export interface InfluencerProfile extends Profile {
  role: 'influencer'
  followers_count?: number
  engagement_rate?: number
  categories?: string[]
  instagram_url?: string
  youtube_url?: string
  tiktok_url?: string
  profile_picture_url?: string
}

export interface CompanyProfile extends Profile {
  role: 'company'
  company_name: string
  industry?: string
  company_size?: string
  trustpilot_url?: string
}

export interface Category {
  id: string
  name: string
  description?: string
}

export interface Campaign {
  id: string
  title: string
  description: string
  budget_min: number
  budget_max: number
  requirements: string
  category_id: string
  company_id: string
  status: 'active' | 'paused' | 'completed'
  created_at: string
  updated_at: string
  company?: CompanyProfile
  category?: Category
}

export interface Application {
  id: string
  campaign_id: string
  influencer_id: string
  pitch: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  campaign?: Campaign
  influencer?: InfluencerProfile
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  sender?: Profile
  receiver?: Profile
} 