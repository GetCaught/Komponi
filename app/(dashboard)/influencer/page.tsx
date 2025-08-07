'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase, InfluencerProfile, Campaign, Application } from '@/lib/supabase'
import CampaignCard from '@/components/(common)/CampaignCard'
import Link from 'next/link'

export default function InfluencerDashboard() {
  const t = useTranslations()
  const [profile, setProfile] = useState<InfluencerProfile | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError

        if (profileData.role !== 'influencer') {
          router.push('/dashboard')
          return
        }

        setProfile(profileData)

        // Fetch active campaigns
        const { data: campaignsData, error: campaignsError } = await supabase
          .from('campaigns')
          .select(`
            *,
            company:profiles!campaigns_company_id_fkey(*),
            category:categories(*)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false })

        if (campaignsError) throw campaignsError
        setCampaigns(campaignsData || [])

        // Fetch user's applications
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            *,
            campaign:campaigns(*)
          `)
          .eq('influencer_id', user.id)
          .order('created_at', { ascending: false })

        if (applicationsError) throw applicationsError
        setApplications(applicationsData || [])

      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleApply = async (campaignId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

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

      // Refresh applications
      const { data: applicationsData } = await supabase
        .from('applications')
        .select(`
          *,
          campaign:campaigns(*)
        `)
        .eq('influencer_id', user.id)
        .order('created_at', { ascending: false })

      setApplications(applicationsData || [])
      alert('Application submitted successfully!')
    } catch (error) {
      console.error('Error applying:', error)
      alert('Failed to submit application')
    }
  }

  const isApplied = (campaignId: string) => {
    return applications.some(app => app.campaign_id === campaignId)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {profile?.full_name}!
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/dashboard/influencer/profile/edit"
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Edit Profile
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">{t('dashboard.totalApplications')}</h3>
            <p className="text-3xl font-bold text-indigo-600">{applications.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">{t('dashboard.activeCampaigns')}</h3>
            <p className="text-3xl font-bold text-green-600">{campaigns.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">{t('dashboard.followers')}</h3>
            <p className="text-3xl font-bold text-purple-600">
              {profile?.followers_count?.toLocaleString() || 'N/A'}
            </p>
          </div>
        </div>

        {/* Recent Applications */}
        {applications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('dashboard.recentApplications')}</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.slice(0, 5).map((application) => (
                      <tr key={application.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {application.campaign?.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.campaign?.company?.company_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            application.status === 'accepted' 
                              ? 'bg-green-100 text-green-800'
                              : application.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {application.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(application.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Available Campaigns */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('dashboard.campaigns')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="text-center py-12">
              <p className="text-gray-500">{t('dashboard.noActiveCampaigns')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 