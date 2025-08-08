'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, Campaign, Category } from '@/lib/supabase'
import CampaignCard from '@/components/(common)/CampaignCard'
import { Search, Filter, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function BrowseCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchCampaigns = useCallback(async () => {
    try {
      let query = supabase
        .from('campaigns')
        .select(`
          *,
          company:profiles!campaigns_company_id_fkey(*),
          category:categories(*)
        `)
        .eq('status', 'active')

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory)
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setCampaigns(data || [])
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    }
  }, [selectedCategory, searchTerm])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name')

        if (categoriesError) throw categoriesError
        setCategories(categoriesData || [])

        // Fetch campaigns
        await fetchCampaigns()
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [fetchCampaigns])

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  const handleApply = async (campaignId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please log in to apply for campaigns')
        return
      }

      const pitch = prompt('Please provide a brief pitch for this campaign:')
      if (!pitch) return

      const { error } = await supabase
        .from('applications')
        .insert([
          {
            campaign_id: campaignId,
            influencer_id: user.id,
            pitch,
            status: 'pending'
          }
        ])

      if (error) throw error

      alert('Application submitted successfully!')
    } catch (error) {
      console.error('Error applying:', error)
      alert('Failed to submit application')
    }
  }

  const isApplied = (campaignId: string) => {
    // This would need to be implemented with actual application data
    return false
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-green-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-900">Komponi</Link>
              <span>/</span>
              <span className="text-gray-900">Browse Services</span>
            </nav>
          </div>
          
          {/* Main Header */}
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find the perfect service for your project</h1>
            <p className="text-gray-600">Explore thousands of services from talented freelancers around the world</p>
          </div>
          
          {/* Search and Filters */}
          <div className="pb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
              
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm min-w-[200px]"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              
              {/* Filter Button */}
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">More Filters</span>
              </button>
            </div>
            
            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors">
                Logo Design
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors">
                Social Media
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors">
                Content Writing
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors">
                Photography
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{campaigns.length}</span> services available
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>Relevance</option>
              <option>Best Selling</option>
              <option>Newest Arrivals</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>
        
        {/* Campaign Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onApply={handleApply}
              isApplied={isApplied(campaign.id)}
            />
          ))}
        </div>

        {campaigns.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
        
        {/* Load More */}
        {campaigns.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-white border border-gray-300 hover:border-gray-400 px-8 py-3 rounded-lg font-medium transition-colors">
              Load more services
            </button>
          </div>
        )}
      </div>
    </div>
  )
}