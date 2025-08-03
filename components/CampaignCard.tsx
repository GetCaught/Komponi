'use client'

import { Campaign } from '@/lib/supabase'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface CampaignCardProps {
  campaign: Campaign
  showActions?: boolean
  onApply?: (campaignId: string) => void
  isApplied?: boolean
}

export default function CampaignCard({ 
  campaign, 
  showActions = true, 
  onApply, 
  isApplied = false 
}: CampaignCardProps) {
  const t = useTranslations()
  
  const formatBudget = (min: number, max: number) => {
    if (min === max) return `$${min.toLocaleString()}`
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {campaign.title}
          </h3>
          <p className="text-sm text-gray-600">
            {t('common.by')} {campaign.company?.company_name || t('campaigns.details.company')}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          campaign.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : campaign.status === 'paused'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {campaign.status}
        </span>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {campaign.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{t('campaigns.details.budget')}</p>
          <p className="text-lg font-semibold text-green-600">
            {formatBudget(campaign.budget_min, campaign.budget_max)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{t('campaigns.details.category')}</p>
          <p className="text-sm text-gray-900">
            {campaign.category?.name || t('common.general')}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-500 mb-2">{t('campaigns.details.requirements')}</p>
        <p className="text-sm text-gray-700 line-clamp-2">
          {campaign.requirements}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">
          {t('common.posted')} {new Date(campaign.created_at).toLocaleDateString()}
        </p>
        
        {showActions && (
          <div className="flex gap-2">
            <Link
              href={`/campaigns/${campaign.id}`}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t('common.viewDetails')}
            </Link>
            {onApply && !isApplied && (
              <button
                onClick={() => onApply(campaign.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
              >
                {t('campaigns.details.applyNow')}
              </button>
            )}
            {isApplied && (
              <span className="px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-md">
                {t('common.applied')}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 