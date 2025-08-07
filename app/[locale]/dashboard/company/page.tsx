'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase, CompanyProfile, Campaign, Application, InfluencerProfile } from '@/lib/supabase'
import InfluencerCard from '@/components/(common)/InfluencerCard'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function CompanyDashboard() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [influencers, setInfluencers] = useState<InfluencerProfile[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('dashboard')
  const tCommon = useTranslations('common')
  const tCampaigns = useTranslations('campaigns')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push(`/${locale}/login`)
          return
        }

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError

        if (profileData.role !== 'company') {
          router.push(`/${locale}/dashboard`)
          return
        }

        setProfile(profileData)

        // Fetch company's campaigns
        const { data: campaignsData, error: campaignsError } = await supabase
          .from('campaigns')
          .select(`
            *,
            category:categories(*)
          `)
          .eq('company_id', user.id)
          .order('created_at', { ascending: false })

        if (campaignsError) throw campaignsError
        setCampaigns(campaignsData || [])

        // Fetch applications for company's campaigns
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            *,
            campaign:campaigns(*),
            influencer:profiles(*)
          `)
          .in('campaign_id', campaignsData?.map(c => c.id) || [])
          .order('created_at', { ascending: false })

        if (applicationsError) throw applicationsError
        setApplications(applicationsData || [])

        // Fetch top influencers
        const { data: influencersData, error: influencersError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'influencer')
          .not('followers_count', 'is', null)
          .order('followers_count', { ascending: false })
          .limit(6)

        if (influencersError) throw influencersError
        setInfluencers(influencersData || [])

      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, locale])

  const handleContact = async (influencerId: string) => {
    // This would typically open a chat or contact form
    console.log('Contact influencer:', influencerId)
    alert(tCommon('contactFunctionalityComingSoon'))
  }

  const handleApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId)

      if (error) throw error

      // Refresh applications
      const { data: applicationsData } = await supabase
        .from('applications')
        .select(`
          *,
          campaign:campaigns(*),
          influencer:profiles(*)
        `)
        .in('campaign_id', campaigns.map(c => c.id))
        .order('created_at', { ascending: false })

      setApplications(applicationsData || [])
      alert(tCommon('applicationStatusUpdated', { status }))
    } catch (error) {
      console.error('Error updating application:', error)
      alert(tCommon('failedToUpdateApplication'))
    }
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
                {t('welcomeBack')}, {profile?.company_name}!
              </h1>
              <p className="text-gray-600">{t('companyDashboard')}</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href={`/${locale}/campaigns/create`}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                {tCampaigns('create.createCampaign')}
              </Link>
              <Link
                href={`/${locale}/dashboard/company/profile/edit`}
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                {tCommon('editProfile')}
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-500"
              >
                {tCommon('logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">{t('totalCampaigns')}</h3>
            <p className="text-3xl font-bold text-indigo-600">{campaigns.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">{t('activeCampaigns')}</h3>
            <p className="text-3xl font-bold text-green-600">
              {campaigns.filter(c => c.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">{t('totalApplications')}</h3>
            <p className="text-3xl font-bold text-purple-600">{applications.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">{t('pendingReviews')}</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {applications.filter(a => a.status === 'pending').length}
            </p>
          </div>
        </div>

        {/* Recent Applications */}
        {applications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('recentApplications')}</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('influencer')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {tCampaigns('details.campaign')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {tCommon('status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {tCommon('applied')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {tCommon('actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.slice(0, 10).map((application) => (
                      <tr key={application.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {application.influencer?.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.influencer?.followers_count?.toLocaleString()} {t('followers')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {application.campaign?.title}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {application.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApplicationStatus(application.id, 'accepted')}
                                className="text-green-600 hover:text-green-900"
                              >
                                {tCommon('accept')}
                              </button>
                              <button
                                onClick={() => handleApplicationStatus(application.id, 'rejected')}
                                className="text-red-600 hover:text-red-900"
                              >
                                {tCommon('reject')}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Top Influencers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('topInfluencers')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {influencers.map((influencer) => (
              <InfluencerCard
                key={influencer.id}
                influencer={influencer}
                onContact={handleContact}
              />
            ))}
          </div>
        </div>

        {/* Company's Campaigns */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{t('yourCampaigns')}</h2>
            <Link
              href={`/${locale}/campaigns/create`}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              {tCampaigns('create.createCampaign')}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : campaign.status === 'paused'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-2">{campaign.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    ${campaign.budget_min.toLocaleString()} - ${campaign.budget_max.toLocaleString()}
                  </span>
                  <Link
                    href={`/${locale}/campaigns/${campaign.id}`}
                    className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                  >
                    {tCommon('viewDetails')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {campaigns.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('noCampaignsYet')}</p>
              <Link
                href={`/${locale}/campaigns/create`}
                className="mt-4 inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                {tCampaigns('create.createCampaign')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
