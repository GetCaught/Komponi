import Link from 'next/link'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function HomePage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">InfluencerHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link
                href="/campaigns/browse"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                {t('navigation.browse')} {t('navigation.campaigns')}
              </Link>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                {t('navigation.signIn')}
              </Link>
              <Link
                href="/signup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {t('navigation.getStarted')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              {t('home.hero.title')}
              <span className="block text-indigo-200">{t('home.hero.subtitle')}</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
              {t('home.hero.description')}
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link
                href="/signup"
                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-medium transition-colors"
              >
                {t('home.hero.joinAsInfluencer')}
              </Link>
              <Link
                href="/signup"
                className="bg-indigo-800 text-white hover:bg-indigo-900 px-8 py-3 rounded-md text-lg font-medium transition-colors"
              >
                {t('home.hero.joinAsCompany')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t('home.features.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Influencers */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('home.features.forInfluencers')}</h3>
              <ul className="space-y-3 text-gray-600">
                {t.raw('home.features.influencerFeatures').map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* For Companies */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('home.features.forCompanies')}</h3>
              <ul className="space-y-3 text-gray-600">
                {t.raw('home.features.companyFeatures').map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform Features */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('home.features.platformFeatures')}</h3>
              <ul className="space-y-3 text-gray-600">
                {t.raw('home.features.platformFeaturesList').map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              {t('home.cta.title')}
            </h2>
            <p className="mt-4 text-xl text-indigo-100">
              {t('home.cta.description')}
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                href="/signup"
                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-medium transition-colors"
              >
                {t('home.cta.createAccount')}
              </Link>
              <Link
                href="/campaigns/browse"
                className="bg-indigo-800 text-white hover:bg-indigo-900 px-8 py-3 rounded-md text-lg font-medium transition-colors"
              >
                {t('home.cta.browseCampaigns')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">InfluencerHub</h3>
              <p className="text-gray-400 mb-4">
                {t('home.footer.description')}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">{t('home.footer.forInfluencers')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/signup" className="hover:text-white">{t('home.footer.joinAsInfluencer')}</Link></li>
                <li><Link href="/campaigns/browse" className="hover:text-white">{t('home.footer.browseCampaigns')}</Link></li>
                <li><Link href="/login" className="hover:text-white">{t('home.footer.signIn')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">{t('home.footer.forCompanies')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/signup" className="hover:text-white">{t('home.footer.joinAsCompany')}</Link></li>
                <li><Link href="/campaigns/create" className="hover:text-white">{t('home.footer.createCampaign')}</Link></li>
                <li><Link href="/login" className="hover:text-white">{t('home.footer.signIn')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              {t('common.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 