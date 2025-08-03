'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, Campaign, Application, Profile } from '@/lib/supabase'
import Link from 'next/link'

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isApplied, setIsApplied] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campaignId = params.id as string

        // Fetch campaign details
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaigns')
          .select(`
            *,
            company:profiles!campaigns_company_id_fkey(*),
            category:categories(*)
          `)
          .eq('id', campaignId)
          .single()

        if (campaignError) throw campaignError
        setCampaign(campaignData)

        // Fetch applications for this campaign
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            *,
            influencer:profiles(*)
          `)
          .eq('campaign_id', campaignId)
          .order('created_at', { ascending: false })

        if (applicationsError) throw applicationsError
        setApplications(applicationsData || [])

        // Check if current user has applied
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const hasApplied = applicationsData?.some(app => app.influencer_id === user.id)
          setIsApplied(hasApplied || false)

          // Fetch user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          setUserProfile(profileData)
        }

      } catch (error) {
        console.error('Error fetching campaign:', error)
        router.push('/campaigns/browse')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  const handleApply = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please log in to apply for this campaign')
        return
      }

      if (userProfile?.role !== 'influencer') {
        alert('Only influencers can apply for campaigns')
        return
      }

      const pitch = prompt('Please provide a brief pitch for this campaign:')
      if (!pitch) return

      const { error } = await supabase
        .from('applications')
        .insert([
          {
            campaign_id: campaign!.id,
            influencer_id: user.id,
            pitch,
            status: 'pending'
          }
        ])

      if (error) throw error

      setIsApplied(true)
      alert('Application submitted successfully!')
    } catch (error) {
      console.error('Error applying:', error)
      alert('Failed to submit application')
    }
  }

  const formatBudget = (min: number, max: number) => {
    if (min === max) return `$${min.toLocaleString()}`
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Campaign not found</h1>
          <Link
            href="/campaigns/browse"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Back to campaigns
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href="/campaigns/browse"
                  className="text-indigo-600 hover:text-indigo-500 mb-2 inline-block"
                >
                  ← Back to campaigns
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">{campaign.title}</h1>
                <p className="text-gray-600 mt-2">by {campaign.company?.company_name}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  campaign.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : campaign.status === 'paused'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.status}
                </span>
                {userProfile?.role === 'influencer' && !isApplied && campaign.status === 'active' && (
                  <button
                    onClick={handleApply}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                  >
                    Apply Now
                  </button>
                )}
                {isApplied && (
                  <span className="px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-md">
                    Applied
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Details</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-6">{campaign.description}</p>
                
                <h3 className="text-lg font-medium text-gray-900 mb-3">Requirements</h3>
                <p className="text-gray-700 mb-6">{campaign.requirements}</p>
              </div>
            </div>

            {/* Applications (if user is the company owner) */}
            {userProfile?.role === 'company' && userProfile.id === campaign.company_id && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Applications ({applications.length})
                </h2>
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {application.influencer?.full_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {application.influencer?.followers_count?.toLocaleString()} followers
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            application.status === 'accepted' 
                              ? 'bg-green-100 text-green-800'
                              : application.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {application.status}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{application.pitch}</p>
                        <p className="text-xs text-gray-500">
                          Applied {new Date(application.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No applications yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Budget</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatBudget(campaign.budget_min, campaign.budget_max)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-gray-900">{campaign.category?.name || 'General'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Posted</p>
                  <p className="text-gray-900">
                    {new Date(campaign.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Applications</p>
                  <p className="text-gray-900">{applications.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Company Name</p>
                  <p className="text-gray-900">{campaign.company?.company_name}</p>
                </div>
                {campaign.company?.industry && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Industry</p>
                    <p className="text-gray-900">{campaign.company.industry}</p>
                  </div>
                )}
                {campaign.company?.location && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-gray-900">{campaign.company.location}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 