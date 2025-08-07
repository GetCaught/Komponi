'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'influencer' | 'company'>('influencer')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const t = useTranslations('auth')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role,
              company_name: role === 'company' ? companyName : undefined,
            },
          },
        })

        if (error) throw error

        if (data.user) {
          // Create profile in profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                full_name: fullName,
                role,
                company_name: role === 'company' ? companyName : undefined,
              },
            ])

          if (profileError) throw profileError
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
      }

      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'login' ? t('auth.signInToAccount') : t('auth.createAccount')}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {mode === 'signup' && (
              <>
                <div>
                  <input
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder={t('auth.fullName')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <select
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'influencer' | 'company')}
                  >
                    <option value="influencer">{t('auth.imInfluencer')}</option>
                    <option value="company">{t('auth.imCompany')}</option>
                  </select>
                </div>
                {role === 'company' && (
                  <div>
                    <input
                      type="text"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder={t('auth.companyName')}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                )}
              </>
            )}
            <div>
              <input
                type="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${
                  mode === 'login' ? 'rounded-t-md' : ''
                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder={t('auth.emailAddress')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t('auth.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? t('common.loading') : mode === 'login' ? t('auth.signInButton') : t('auth.signUpButton')}
            </button>
          </div>

          <div className="text-center">
            <a
              href={mode === 'login' ? '/signup' : '/login'}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {mode === 'login'
                ? t('auth.dontHaveAccount')
                : t('auth.alreadyHaveAccount')}
            </a>
          </div>
        </form>
      </div>
    </div>
  )
} 