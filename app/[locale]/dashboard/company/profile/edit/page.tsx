'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, CompanyProfile } from '@/lib/supabase'
import { useI18n } from '@/config/i18n'

export default function EditCompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [companyName, setCompanyName] = useState('')
  const [description, setDescription] = useState('')
  const [website, setWebsite] = useState('')
  const [trustpilotUrl, setTrustpilotUrl] = useState('')
  const router = useRouter()
  const { t } = useI18n()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        setProfile(data)
        setCompanyName(data.company_name || '')
        setDescription(data.description || '')
        setWebsite(data.website || '')
        setTrustpilotUrl(data.trustpilot_url || '')
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const updates = {
        id: user.id,
        company_name: companyName,
        description,
        website,
        trustpilot_url: trustpilotUrl,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) throw error

      alert(t('profile.profileUpdated'))
      router.push('/dashboard/company')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert(t('profile.profileFailed'))
    } finally {
      setLoading(false)
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('profile.editProfile')}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              {t('auth.companyName')}
            </label>
            <input
              type="text"
              id="companyName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              {t('profile.description')}
            </label>
            <textarea
              id="description"
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              {t('profile.website')}
            </label>
            <input
              type="url"
              id="website"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="trustpilotUrl" className="block text-sm font-medium text-gray-700">
              Trustpilot URL
            </label>
            <input
              type="url"
              id="trustpilotUrl"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={trustpilotUrl}
              onChange={(e) => setTrustpilotUrl(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? t('common.saving') : t('common.saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}