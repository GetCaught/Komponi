'use client'

import { Campaign } from '@/lib/supabase'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Star, Clock } from 'lucide-react'

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
  const _t = useTranslations()
  
  
  const formatBudget = (min: number, max: number) => {
    if (min === max) return `$${min.toLocaleString()}`
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
      {/* Header with image placeholder */}
      <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200"></div>
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            campaign.status === 'active' 
              ? 'bg-green-500 text-white' 
              : campaign.status === 'paused'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {campaign.status}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        {/* Company info */}
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-indigo-600">
              {campaign.company?.company_name?.charAt(0) || 'C'}
            </span>
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-900">
              {campaign.company?.company_name || 'Company'}
            </p>
            <div className="flex items-center text-xs text-gray-500">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
              <span>4.9 (127)</span>
            </div>
          </div>
        </div>

        {/* Campaign title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
          {campaign.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {campaign.description}
        </p>

        {/* Category tag */}
        {campaign.category && (
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mb-3">
            {campaign.category.name}
          </span>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">Starting at</div>
            <div className="text-lg font-bold text-gray-900">
              {formatBudget(campaign.budget_min, campaign.budget_max)}
            </div>
          </div>
        </div>
        
        {showActions && (
          <div className="mt-3 flex gap-2">
            <Link
              href={`/campaigns/${campaign.id}`}
              className="flex-1 text-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-md transition-colors"
            >
              View Details
            </Link>
            {onApply && !isApplied && (
              <button
                onClick={() => onApply(campaign.id)}
                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors"
              >
                Apply Now
              </button>
            )}
            {isApplied && (
              <span className="flex-1 text-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md">
                Applied
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}