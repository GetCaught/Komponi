'use client'

import { useState } from 'react'
import { InfluencerProfile, Category } from '@/lib/supabase'
import InfluencerCard from '@/components/(common)/InfluencerCard'
import { Search, Filter } from 'lucide-react'

// Mock data for categories
const mockCategories: Category[] = [
  { id: '1', name: 'Fashion & Beauty', description: 'Style, makeup, and beauty trends' },
  { id: '2', name: 'Fitness & Health', description: 'Workout routines and healthy lifestyle' },
  { id: '3', name: 'Travel & Adventure', description: 'Travel destinations and experiences' },
  { id: '4', name: 'Food & Cooking', description: 'Recipes and culinary adventures' },
  { id: '5', name: 'Technology', description: 'Tech reviews and digital trends' },
  { id: '6', name: 'Lifestyle', description: 'Daily life and personal development' },
  { id: '7', name: 'Art & Design', description: 'Creative content and artistic expression' },
  { id: '8', name: 'Business', description: 'Entrepreneurship and professional development' }
]

// Mock data for influencers with stock photos and diverse niches
const mockInfluencers: InfluencerProfile[] = [
  {
    id: '1',
    email: 'sophia.chen@email.com',
    full_name: 'Sophia Chen',
    role: 'influencer',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612f1ab?w=400&h=400&fit=crop&crop=face',
    bio: '✨ Fashion enthusiast sharing daily outfit inspiration and beauty tips. Partnering with sustainable brands that align with my values.',
    location: 'Los Angeles, CA',
    followers_count: 245000,
    engagement_rate: 4.2,
    categories: ['Fashion & Beauty'],
    social_media_handles: {
      instagram: 'sophiachen_style',
      tiktok: 'sophiachen',
      youtube: 'SophiaChenStyle'
    },
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'marco.fitness@email.com',
    full_name: 'Marco Rodriguez',
    role: 'influencer',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: '💪 Certified personal trainer helping you achieve your fitness goals. Home workouts, nutrition tips, and motivation daily!',
    location: 'Miami, FL',
    followers_count: 189000,
    engagement_rate: 5.8,
    categories: ['Fitness & Health'],
    social_media_handles: {
      instagram: 'marco_fit_life',
      tiktok: 'marcorodriguezfit',
      youtube: 'MarcoFitnessTV'
    },
    created_at: '2023-02-10T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z'
  },
  {
    id: '3',
    email: 'emma.wanderlust@email.com',
    full_name: 'Emma Thompson',
    role: 'influencer',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    bio: '🌍 Adventure seeker documenting hidden gems around the world. Sustainable travel advocate and photography enthusiast.',
    location: 'London, UK',
    followers_count: 312000,
    engagement_rate: 3.9,
    categories: ['Travel & Adventure'],
    social_media_handles: {
      instagram: 'emma_wanderlust',
      tiktok: 'emmathompsontravel',
      youtube: 'WanderlustWithEmma'
    },
    created_at: '2023-03-05T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: '4',
    email: 'chef.david@email.com',
    full_name: 'David Kim',
    role: 'influencer',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: '👨‍🍳 Professional chef sharing easy recipes and cooking techniques. Making gourmet accessible for home cooks everywhere!',
    location: 'New York, NY',
    followers_count: 156000,
    engagement_rate: 6.1,
    categories: ['Food & Cooking'],
    social_media_handles: {
      instagram: 'chef_david_kitchen',
      tiktok: 'chefdavidkim',
      youtube: 'DavidKimCooks'
    },
    created_at: '2023-04-20T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '5',
    email: 'alex.tech@email.com',
    full_name: 'Alexandra Wang',
    role: 'influencer',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    bio: '⚡ Tech enthusiast reviewing the latest gadgets and apps. Helping you navigate the digital world with honest, in-depth reviews.',
    location: 'San Francisco, CA',
    followers_count: 198000,
    engagement_rate: 4.7,
    categories: ['Technology'],
    social_media_handles: {
      instagram: 'alexandra_tech',
      tiktok: 'alextechreview',
      youtube: 'AlexandraTechHub'
    },
    created_at: '2023-05-12T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: '6',
    email: 'maya.lifestyle@email.com',
    full_name: 'Maya Patel',
    role: 'influencer',
    avatar_url: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=400&h=400&fit=crop&crop=face',
    bio: '🌱 Lifestyle blogger focused on mindful living and self-care. Sharing tips for a balanced, intentional life in a busy world.',
    location: 'Toronto, Canada',
    followers_count: 142000,
    engagement_rate: 5.3,
    categories: ['Lifestyle'],
    social_media_handles: {
      instagram: 'maya_mindful_life',
      tiktok: 'mayapatellife',
      youtube: 'MindfulWithMaya'
    },
    created_at: '2023-06-08T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z'
  },
  {
    id: '7',
    email: 'carlos.art@email.com',
    full_name: 'Carlos Martinez',
    role: 'influencer',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    bio: '🎨 Digital artist and designer creating vibrant illustrations. Sharing my creative process and tips for aspiring artists.',
    location: 'Barcelona, Spain',
    followers_count: 87000,
    engagement_rate: 7.2,
    categories: ['Art & Design'],
    social_media_handles: {
      instagram: 'carlos_creates',
      tiktok: 'carlosmartinezart',
      youtube: 'CarlosCreativeStudio'
    },
    created_at: '2023-07-14T00:00:00Z',
    updated_at: '2024-01-30T00:00:00Z'
  },
  {
    id: '8',
    email: 'sarah.business@email.com',
    full_name: 'Sarah Johnson',
    role: 'influencer',
    avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
    bio: '💼 Entrepreneur and business coach helping others build successful online businesses. Real strategies for real results.',
    location: 'Austin, TX',
    followers_count: 176000,
    engagement_rate: 4.9,
    categories: ['Business'],
    social_media_handles: {
      instagram: 'sarah_biz_coach',
      tiktok: 'sarahjohnsonbiz',
      youtube: 'SarahBusinessHub'
    },
    created_at: '2023-08-22T00:00:00Z',
    updated_at: '2024-02-05T00:00:00Z'
  },
  {
    id: '9',
    email: 'jason.gaming@email.com',
    full_name: 'Jason Lee',
    role: 'influencer',
    avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop&crop=face',
    bio: '🎮 Gaming content creator and streamer. Reviews, tutorials, and epic gameplay moments. Join the community!',
    location: 'Seattle, WA',
    followers_count: 267000,
    engagement_rate: 5.5,
    categories: ['Technology'],
    social_media_handles: {
      instagram: 'jason_gaming_pro',
      tiktok: 'jasonleegaming',
      youtube: 'JasonLeeGameHub'
    },
    created_at: '2023-09-10T00:00:00Z',
    updated_at: '2024-02-10T00:00:00Z'
  },
  {
    id: '10',
    email: 'nina.wellness@email.com',
    full_name: 'Nina Rodriguez',
    role: 'influencer',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    bio: '🧘 Wellness coach specializing in yoga and meditation. Helping you find inner peace and physical strength through mindful practices.',
    location: 'Denver, CO',
    followers_count: 134000,
    engagement_rate: 6.3,
    categories: ['Fitness & Health', 'Lifestyle'],
    social_media_handles: {
      instagram: 'nina_wellness_journey',
      tiktok: 'ninarodriguezwellness',
      youtube: 'WellnessWithNina'
    },
    created_at: '2023-10-05T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z'
  }
]

export default function BrowseInfluencersPage() {
  const [influencers] = useState<InfluencerProfile[]>(mockInfluencers)
  const [categories] = useState<Category[]>(mockCategories)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')


  // Filter logic
  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = influencer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.bio?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || influencer.categories?.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-2">Discover Influencers</h1>
          <p className="text-purple-100">Connect with content creators across different niches and industries</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-32">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-purple-600" />
                Filters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Influencers
                  </label>
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Search by name or bio..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Influencers Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredInfluencers.map(influencer => (
                <InfluencerCard key={influencer.id} influencer={influencer} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}