'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, InfluencerProfile as Profile } from '../../lib/supabase'
import Spinner from '../../components/ui/Spinner'

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        setProfile(profileData)
        
        // Redirect based on role
        if (profileData.role === 'influencer') {
          router.push('/dashboard/influencer')
        } else {
          router.push('/dashboard/company')
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return null
} 