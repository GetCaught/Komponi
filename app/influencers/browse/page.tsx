'use client'

import { useEffect, useState } from 'react'
import { supabase, InfluencerProfile, Category } from '../../lib/supabase'
import InfluencerCard from '../../components/(common)/InfluencerCard'
import { Search, Filter } from 'lucide-react'

export default function BrowseInfluencersPage() {
  const [influencers, setInfluencers] = useState<InfluencerProfile[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .order('name')
        setCategories(categoriesData || [])

        // Fetch influencers
        const { data: influencersData } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'influencer')
          .not('followers_count', 'is', null)
          .order('followers_count', { ascending: false })
        
        setInfluencers(influencersData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
          <h1 className="text-4xl font-bold mb-2">[TRANSLATION_MISSING]</h1>
          <p className="text-purple-100">[TRANSLATION_MISSING]</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-32">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-purple-600" />
                [TRANSLATION_MISSING]
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    [TRANSLATION_MISSING]
                  </label>
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="[TRANSLATION_MISSING]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    [TRANSLATION_MISSING]
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">[TRANSLATION_MISSING]</option>
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
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                    <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredInfluencers.map(influencer => (
                  <InfluencerCard key={influencer.id} influencer={influencer} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}